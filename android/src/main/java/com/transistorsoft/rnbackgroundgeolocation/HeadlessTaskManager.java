package com.transistorsoft.rnbackgroundgeolocation;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.transistorsoft.locationmanager.logger.TSLog;

import java.lang.reflect.Method;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This is a general singleton for managing invoking RN headless-tasks.  This class could be copied and implemented in any plugin.
 *
 * RN headless-tasks have no mechanism for the Javascript to signal completion of their tasks:  you can either configure a timeout for
 * your tasks (letting each task timeout) or provide no timeout at all, which will cause a memory leak in RN's HeadlessJsContext.java
 * https://github.com/facebook/react-native/blob/bc0b5ca5df5d2cf12c791b0332ef2fb4e29d6d2d/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/jstasks/HeadlessJsTaskContext.java#L53-L55
 *
 * Without providing a timeout for your headless-tasks, those collections in HeadlessJsContext will continue grow and never be cleared.
 *
 * Because there's only one instance of this class, we have to be mindful that we can possibly receive events rapidly,
 * so we store them in a Queue (#mTaskQueue).
 *
 * We also have to be mindful that it's a heavy operation to do the initial launch the ReactNative Host, so several events
 * might build up in the queue before the Host is finally launched, when we drain the queue (see #drainTaskQueue).
 *
 * For finally sending events to the client, we wrap the RN HeadlessJsTaskConfig with our own TaskConfig class.  This class
 * adds our own auto-incremented "taskId" field to maintain a mapping between our taskId and RN's.  See #invokeStartTask.
 * This class appends our custom taskId into the the event params sent to Javascript, for the following purpose:
 *
 * ```javascript
 * const BackgroundGeolocationHeadlessTask = async (event) => {
 *   console.log('[HeadlessTask] taskId: ', event.taskId);  // <-- here's our custom taskId.
 *
 *   await doWork();  // <-- perform some arbitrarily long process (eg: http request).
 *
 *   BackgroundGeolocation.finishHeadlessTask(event.taskId);  // <-- $$$ Here's the money $$$
 * }
 * ```
 *
 * See "Here's the $money" above: We want to signal back to this native HeadlessTask instance , that our JS task is now complete.
 * This is a pretty easy task to do via EventBus -- Just create a new instance of FinishHeadlessTaskEvent(params.taskId);
 *
 * The code then looks up a TaskConfig from mEventQueue using the given event.taskId.
 *
 * All this extra fussing with taking care to finish our RN HeadlessTasks seems to be more important with RN's "new architecture", where before,
 * RN seemed to automatically complete its tasks seemingly when the Javascript function stopped executing.  This is why it was always so
 * important to await one's Promises and do all the work before the the last line of the function executed.
 *
 * Now, the Javascript must explicitly call back to the native side to say "I'M DONE" -- BackgroundGeolocation.finishHeadlessTask(taskId)
 */
public class HeadlessTaskManager implements HeadlessJsTaskEventListener {
    private static final String TAG = "TSLocationManager";

    private static HeadlessTaskManager sInstance;
    public static HeadlessTaskManager getInstance() {
        if (sInstance == null) {
            sInstance = getInstanceSynchronized();
        }
        return sInstance;
    }

    private static synchronized HeadlessTaskManager getInstanceSynchronized() {
        if (sInstance == null) sInstance = new HeadlessTaskManager();
        return sInstance;
    }

    private final Set<Task> mTaskQueue = new CopyOnWriteArraySet<>();
    private final AtomicBoolean mIsReactContextInitialized = new AtomicBoolean(false);
    private final AtomicBoolean mWillDrainTaskQueue = new AtomicBoolean(false);
    private final AtomicBoolean mIsInitializingReactContext = new AtomicBoolean(false);
    private final AtomicBoolean mIsHeadlessJsTaskListenerRegistered = new AtomicBoolean(false);

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param context Application Context
     * @param task The Task instance
     */
    public void startTask(Context context, Task task) throws AssertionError {
        UiThreadUtil.assertOnUiThread();

        addTask(task);

        if (!mIsReactContextInitialized.get()) {
            createReactContextAndScheduleTask(context);
        } else {
            boolean success = invokeStartTask(getReactContext(context), task);
            if (!success) {
                removeTask(task);
            }
        }
    }

    public void finishTask(Context context, int taskId) throws TaskNotFoundError, ContextError {
        if (!mIsReactContextInitialized.get()) {
            throw new ContextError(getClass().getName() + ".finishTask:  ReactContext not initialized");
        }
        ReactContext reactContext = getReactContext(context.getApplicationContext());
        if (reactContext != null) {
            Task task = findTask(taskId);
            if (task != null) {
                HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
                if (headlessJsTaskContext.isTaskRunning(task.getReactTaskId())) {
                    headlessJsTaskContext.finishTask(task.getReactTaskId());
                }
            } else {
                throw new TaskNotFoundError(taskId);
            }
        } else {
            throw new ContextError(getClass().getName() + ".finishTask ReactContext is null");
        }
    }

    private boolean invokeStartTask(ReactContext reactContext, final Task task) {
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
        if (mIsHeadlessJsTaskListenerRegistered.compareAndSet(false, true)) {
            // Register the RN HeadlessJSTaskEventListener just once.
            // TODO we might use a LifeCycle event-listener here to remove the listener when the app is launched to foreground.
            headlessJsTaskContext.addTaskEventListener(this);
        }
        try {
            return task.invoke(reactContext);
        } catch (Exception e) {
            task.onError(e);
            return false;
        }
    }

    @Override
    public void onHeadlessJsTaskStart(int taskId) {}

    // The only purpose of this listener is to clear events from the queue.  The RN task is assumed to have had its .stopTask(taskId) method called, which is why this event has fired.
    // WARNING:  this listener seems to receive events from ANY OTHER plugin's Headless events.
    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        Task task = findTaskByReactId(taskId);
        if (task == null) {
            return;
        }
        removeTask(task);
        task.onFinish();

        TSLog.logger.debug("[onHeadlessJsTaskFinish] taskId: " + taskId);
    }

    private ReactNativeHost getReactNativeHost(Context context) {
        return ((ReactApplication) context.getApplicationContext()).getReactNativeHost();
    }

    /**
     * Get the {ReactHost} used by this app. ure and returns null if not.
     */
    private @Nullable Object getReactHost(Context context) {
        context = context.getApplicationContext();
        try {
            Method getReactHost = context.getClass().getMethod("getReactHost");
            return getReactHost.invoke(context);
        } catch (Exception e) {
            return null;
        }
    }

    private ReactContext getReactContext(Context context) {
        if (isBridglessArchitectureEnabled()) {
            Object reactHost = getReactHost(context);
            Assertions.assertNotNull(reactHost, "getReactHost() is null in New Architecture");
            try {
                Method getCurrentReactContext = reactHost.getClass().getMethod("getCurrentReactContext");
                return (ReactContext) getCurrentReactContext.invoke(reactHost);
            } catch (Exception e) {
                TSLog.logger.error(TSLog.error( "Reflection error getCurrentReactContext: " + e.getMessage()), e);
            }
        }
        final ReactInstanceManager reactInstanceManager = getReactNativeHost(context).getReactInstanceManager();
        return reactInstanceManager.getCurrentReactContext();
    }

    private void createReactContextAndScheduleTask(Context context) {
        // ReactContext could have already been initialized by another plugin (eg: background-fetch).
        // If we get a non-null ReactContext here, we're good to go!
        ReactContext reactContext = getReactContext(context);
        if (reactContext != null && !mIsInitializingReactContext.get()) {
            mIsReactContextInitialized.set(true);
            drainTaskQueue(reactContext);
            return;
        }
        if (mIsInitializingReactContext.compareAndSet(false, true)) {
            TSLog.logger.debug( "[createReactContextAndScheduleTask] initialize ReactContext");
            final Object reactHost = getReactHost(context);
            if (isBridglessArchitectureEnabled()) { // NEW arch
                ReactInstanceEventListener callback = new ReactInstanceEventListener() {
                    @Override
                    public void onReactContextInitialized(@NonNull ReactContext reactContext) {
                        mIsReactContextInitialized.set(true);
                        drainTaskQueue(reactContext);
                        try {
                            Method removeReactInstanceEventListener = reactHost.getClass().getMethod("removeReactInstanceEventListener", ReactInstanceEventListener.class);
                            removeReactInstanceEventListener.invoke(reactHost, this);
                        } catch (Exception e) {
                            TSLog.logger.error(TSLog.error("HeadlessTask reflection error removeReactInstanceEventListener: ") + e);
                        }
                    }
                };
                try {
                    Method addReactInstanceEventListener = reactHost.getClass().getMethod("addReactInstanceEventListener", ReactInstanceEventListener.class);
                    addReactInstanceEventListener.invoke(reactHost, callback);
                    Method startReactHost = reactHost.getClass().getMethod("start");
                    startReactHost.invoke(reactHost);
                } catch (Exception e) {
                    TSLog.logger.error(TSLog.error("HeadlessTask reflection error ReactHost start: " + e.getMessage()), e);
                }
            } else { // OLD arch
                final ReactInstanceManager reactInstanceManager = getReactNativeHost(context).getReactInstanceManager();
                reactInstanceManager.addReactInstanceEventListener(new ReactInstanceEventListener() {
                    @Override
                    public void onReactContextInitialized(@NonNull ReactContext reactContext) {
                        mIsReactContextInitialized.set(true);
                        drainTaskQueue(reactContext);
                        reactInstanceManager.removeReactInstanceEventListener(this);
                    }
                });
                reactInstanceManager.createReactContextInBackground();
            }
        }
    }

    /**
     * Return true if this app is running with RN's bridgeless architecture.
     * Cheers to @mikehardy for this idea.
     * @return
     */
    private boolean isBridglessArchitectureEnabled() {
        try {
            Class<?> entryPoint = Class.forName("com.facebook.react.defaults.DefaultNewArchitectureEntryPoint");
            Method bridgelessEnabled = entryPoint.getMethod("getBridgelessEnabled");
            Object result = bridgelessEnabled.invoke(null);
            return (result == Boolean.TRUE);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Invokes HeadlessEvents queued while waiting for the ReactContext to initialize.
     * @param reactContext
     */
    private void drainTaskQueue(final ReactContext reactContext) {
        if (mWillDrainTaskQueue.compareAndSet(false, true)) {
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                synchronized(mTaskQueue) {
                    mTaskQueue.forEach((Task task) -> {
                        boolean success = invokeStartTask(reactContext, task);
                        if (!success) {
                            removeTask(task);
                        }
                    });
                }
            }, 250);
        }
    }

    // Find a task in the queue.
    public Task findTask(int taskId) {
        Task found = null;
        // Locate the TaskConfig instance by our local taskId.
        synchronized (mTaskQueue) {
            for (Task task : mTaskQueue) {
                if (task.getId() == taskId) {
                    found = task;
                    break;
                }
            }
        }
        return found;
    }

    private Task findTaskByReactId(int reactTaskId) {
        Task found = null;
        // Locate the TaskConfig instance by our local taskId.
        synchronized (mTaskQueue) {
            for (Task config : mTaskQueue) {
                if (config.getReactTaskId() == reactTaskId) {
                    found = config;
                    break;
                }
            }
        }
        return found;
    }
    // Add a task to queue.
    private void addTask(Task config) {
        // push this HeadlessEvent onto the taskQueue, to be drained once the React context is finished initializing,
        // or executed immediately if Context exists currently.
        synchronized (mTaskQueue) {
            mTaskQueue.add(config);
        }
    }

    // Remove TaskConfig from queue.
    private void removeTask(Task task) {
        synchronized (mTaskQueue) {
            mTaskQueue.remove(task);
        }
    }

    // Any tasks in the queue?
    private boolean hasTasks() {
        synchronized (mTaskQueue) {
            return !mTaskQueue.isEmpty();
        }
    }

    /**
     * Wrapper for a client event.  Inserts our custom taskId into the RN ClientEvent params.
     */
    public static class Task {
        private static final AtomicInteger sLastTaskId = new AtomicInteger(0);
        synchronized static int getNextTaskId() {
            return sLastTaskId.incrementAndGet();
        }

        private final int mId;
        private final String mTaskName;
        private int mReactTaskId;
        private final OnInvokeCallback mOnInvokeCallback;
        private final OnFinishCallback mOnFinishCallback;
        private final OnErrorCallback mOnErrorCallback;
        private final int mTimeout;
        private final WritableMap mParams;

        Task(Builder builder) {
            mTaskName = builder.name;
            mId = getNextTaskId();
            mOnInvokeCallback = builder.onInvokeCallback;
            mOnFinishCallback = builder.onFinishCallback;
            mOnErrorCallback = builder.onErrorCallback;
            mTimeout = builder.timeout;
            mParams = builder.params;
            // append our custom headless taskId.
            mParams.putInt("_transistorHeadlessTaskId", mId);
        }

        boolean invoke(ReactContext reactContext) throws IllegalStateException {
            if (mReactTaskId > 0) {
                TSLog.logger.warn(TSLog.warn("Task already invoked <IGNORED>: " + this));
                return true;
            }
            HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
            // Provide the RN taskId to our private TaskConfig instance, mapping the RN taskId to our TaskConfig's internal taskId.

            mReactTaskId = headlessJsTaskContext.startTask(buildTaskConfig());
            if (mOnInvokeCallback != null) {
                mOnInvokeCallback.onInvoke(reactContext, this);
            }
            return true;
        }

        public int getId() {
            return mId;
        }

        private int getReactTaskId() {
            return mReactTaskId;
        }

        private HeadlessJsTaskConfig buildTaskConfig() {
            return new HeadlessJsTaskConfig(mTaskName, mParams, mTimeout);
        }

        void onFinish() {
            if (mOnFinishCallback != null) {
                mOnFinishCallback.onFinish(mId);
            }
        }

        void onError(Exception e) {
            if (mOnErrorCallback != null) {
                mOnErrorCallback.onError(this, e);
            }
        }

        public String toString() {
            return "[HeadlessTaskManager.Task name: " + mTaskName + " id: " + mId + "]";
        }

        public static class Builder {
            private static final int DEFAULT_TIMEOUT = 60000;

            private String name;
            private OnInvokeCallback onInvokeCallback;
            private OnFinishCallback onFinishCallback;
            private OnErrorCallback onErrorCallback;
            private WritableMap params;
            private int timeout = DEFAULT_TIMEOUT;

            public Builder setName(String name) {
                this.name = name;
                return this;
            }
            public Builder setOnInvokeCallback(OnInvokeCallback callback) {
                this.onInvokeCallback = callback;
                return this;
            }
            public Builder setOnFinishCallback(OnFinishCallback callback) {
                this.onFinishCallback = callback;
                return this;
            }
            public Builder setOnErrorCallback(OnErrorCallback callback) {
                this.onErrorCallback = callback;
                return this;
            }
            public Builder setParams(WritableMap params) {
                this.params = params;
                return this;
            }
            public Builder setTimeout(int timeout) {
                this.timeout = timeout;
                return this;
            }
            public Task build() {
                return new Task(this);
            }
        }
    }

    public static class TaskNotFoundError extends Exception {
        public TaskNotFoundError(int taskId) {
            super(HeadlessTaskManager.class.getName() + " failed to find task: " + taskId);
        }
    }

    public static class ContextError extends Exception {
        public ContextError(String message) {
            super(message);
        }
    }

    public interface OnInvokeCallback {
        void onInvoke(ReactContext reactContext, Task task);
    }
    public interface OnFinishCallback {
        void onFinish(int taskId);
    }
    public interface OnErrorCallback {
        void onError(Task task, Exception e);
    }
}
