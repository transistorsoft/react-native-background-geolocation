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
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;

import org.greenrobot.eventbus.Subscribe;

import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.event.FinishHeadlessTaskEvent;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.transistorsoft.locationmanager.logger.TSLog;

import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * The BackgroundGeolocation SDK creates a single instance of this class (via reflection upon Config.headlessJobService)
 * The SDK delivers events to this instance by dropping them onto EventBus (see @Subscribe).  Because this instance is subscribed
 * into EventBus, it's protected from GC.
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
 *
 * Created by chris on 2018-01-23.
 */

public class HeadlessTask {
    private static String HEADLESS_TASK_NAME = "BackgroundGeolocation";
    // Hard-coded time-limit for headless-tasks is 60000 @todo configurable?
    private static final int TASK_TIMEOUT = 60000;
    private static final AtomicInteger sLastTaskId = new AtomicInteger(0);

    synchronized static int getNextTaskId() {
        return sLastTaskId.incrementAndGet();
    }

    private final List<TaskConfig> mTaskQueue = new ArrayList<>();
    private final AtomicBoolean mIsReactContextInitialized = new AtomicBoolean(false);
    private final AtomicBoolean mIsInitializingReactContext = new AtomicBoolean(false);
    private final AtomicBoolean mIsHeadlessJsTaskListenerRegistered = new AtomicBoolean(false);

    /**
     * EventBus receiver for a HeadlessTask HeadlessEvent
     * @param event
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onHeadlessEvent(HeadlessEvent event) {
        String name = event.getName();
        TSLog.logger.debug("\uD83D\uDC80  event: " + name);

        WritableMap clientEvent = new WritableNativeMap();
        JSONObject params = null;
        clientEvent.putString("name", name);

        if (name.equals(BackgroundGeolocation.EVENT_TERMINATE)) {
            params = event.getTerminateEvent();
        } else if (name.equals(BackgroundGeolocation.EVENT_LOCATION)) {
            try {
                params = event.getLocationEvent().toJson();
            } catch (JSONException e) {
                TSLog.logger.error(e.getMessage(), e);
            }
        } else if (name.equals(BackgroundGeolocation.EVENT_MOTIONCHANGE)) {
            params = event.getMotionChangeEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_HTTP)) {
            params = event.getHttpEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_PROVIDERCHANGE)) {
            params = event.getProviderChangeEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_ACTIVITYCHANGE)) {
            params = event.getActivityChangeEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_SCHEDULE)) {
            params = event.getScheduleEvent();
        } else if (name.equals(BackgroundGeolocation.EVENT_BOOT)) {
            params = event.getBootEvent();
        } else if (name.equals(BackgroundGeolocation.EVENT_GEOFENCE)) {
            params = event.getGeofenceEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_GEOFENCESCHANGE)) {
            params = event.getGeofencesChangeEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_HEARTBEAT)) {
            params = event.getHeartbeatEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_POWERSAVECHANGE)) {
            clientEvent.putBoolean("params", event.getPowerSaveChangeEvent().isPowerSaveMode());
        } else if (name.equals(BackgroundGeolocation.EVENT_CONNECTIVITYCHANGE)) {
            params = event.getConnectivityChangeEvent().toJson();
        } else if (name.equals(BackgroundGeolocation.EVENT_ENABLEDCHANGE)) {
            clientEvent.putBoolean("params", event.getEnabledChangeEvent());
        } else if (name.equals(BackgroundGeolocation.EVENT_NOTIFICATIONACTION)) {
            clientEvent.putString("params", event.getNotificationEvent());
        } else if (name.equals(BackgroundGeolocation.EVENT_AUTHORIZATION)) {
            params = event.getAuthorizationEvent().toJson();
        } else {
            TSLog.logger.warn(TSLog.warn("Unknown Headless Event: " + name));
            clientEvent.putString("error", "Unknown event: " + name);
            clientEvent.putNull("params");
        }

        if (params != null) {
            try {
                clientEvent.putMap("params", RNBackgroundGeolocationModule.jsonToMap(params));
            } catch (JSONException e) {
                clientEvent.putNull("params");
                clientEvent.putString("error", e.getMessage());
                TSLog.logger.error(TSLog.error(e.getMessage()), e);
                e.printStackTrace();
            }
        }

        try {
            startTask(event.getContext(), new TaskConfig(clientEvent));
        } catch (AssertionError e) {
            TSLog.logger.warn(TSLog.warn("Failed invoke HeadlessTask " + name + ".  Task ignored." + e.getMessage()));
        }
    }

    /**
     * EventBus Receiver.  Called when developer runs BackgroundGeolocation.finishHeadlessTask(taskId) from within their registered HeadlessTask.
     * Calls RN's HeadlessJsTaskContext.finishTask(taskId);
     * @param event
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onFinishHeadlessTask(FinishHeadlessTaskEvent event) {
        if (!mIsReactContextInitialized.get()) {
            TSLog.logger.warn(TSLog.warn("BackgroundGeolocation.finishHeadlessTask:" + event.getTaskId() + " found no ReactContext"));
            return;
        }
        ReactContext reactContext = getReactContext(event.getContext());
        if (reactContext != null) {
            int taskId = event.getTaskId();

            synchronized (mTaskQueue) {
                // Locate the TaskConfig instance by our local taskId.
                TaskConfig taskConfig = null;
                for (TaskConfig config : mTaskQueue) {
                    if (config.getTaskId() == taskId) {
                        taskConfig = config;
                        break;
                    }
                }
                if (taskConfig != null) {
                    HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
                    // Tell RN we're done using the mapped getReactTaskId().
                    headlessJsTaskContext.finishTask(taskConfig.getReactTaskId());
                } else {
                    TSLog.logger.warn(TSLog.warn("Failed to find task: " + taskId));
                }
            }
        } else {
            TSLog.logger.warn(TSLog.warn("Failed to finishHeadlessTask: " + event.getTaskId() + " -- HeadlessTask onFinishHeadlessTask failed to find a ReactContext.  This is unexpected"));
        }
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    private void startTask(Context context, final TaskConfig taskConfig) throws AssertionError {
        UiThreadUtil.assertOnUiThread();

        // push this HeadlessEvent onto the taskQueue, to be drained once the React context is finished initializing,
        // or executed immediately if Context exists currently.
        synchronized (mTaskQueue) {
            mTaskQueue.add(taskConfig);
        }

        if (!mIsReactContextInitialized.get()) {
            createReactContextAndScheduleTask(context);
        } else {
            invokeStartTask(getReactContext(context), taskConfig);
        }
    }

    synchronized private void invokeStartTask(ReactContext reactContext, final TaskConfig taskConfig) {
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
        try {
            if (mIsHeadlessJsTaskListenerRegistered.compareAndSet(false, true)) {
                // Register the RN HeadlessJSTaskEventListener just once.
                // This inline-listener is handy here as a closure around the HeadlessJsTaskContext.
                // Otherwise, we'd have to store this Context to an instance var.
                // The only purpose of this listener is to clear events from the queue.  The RN task is assumed to have had its .stopTask(taskId) method called, which is why this event has fired.
                // WARNING:  this listener seems to receive events from ANY OTHER plugin's Headless events.
                // TODO we might use a LifeCycle event-listener here to remove the listener when the app is launched to foreground.
                headlessJsTaskContext.addTaskEventListener(new HeadlessJsTaskEventListener() {
                    @Override public void onHeadlessJsTaskStart(int taskId) {}
                    @Override public void onHeadlessJsTaskFinish(int taskId) {
                        synchronized (mTaskQueue) {
                            if (mTaskQueue.isEmpty()) {
                                // Nothing in queue?  This events cannot be for us.
                                return;
                            }
                            // Query our queue for this event...
                            TaskConfig taskConfig = null;
                            for (TaskConfig config : mTaskQueue) {
                                if (config.getReactTaskId() == taskId) {
                                    taskConfig = config;
                                    break;
                                }
                            }
                            if (taskConfig != null) {
                                // Clear it from the Queue.
                                TSLog.logger.debug("taskId: " + taskConfig.getTaskId());
                                mTaskQueue.remove(taskConfig);
                            } else {
                                TSLog.logger.warn(TSLog.warn("Failed to find taskId: " + taskId));
                            }
                        }
                    }
                });
            }
            // Finally:  the actual launch of the RN headless-task!
            int taskId = headlessJsTaskContext.startTask(taskConfig.getTaskConfig());
            // Provide the RN taskId to our private TaskConfig instance, mapping the RN taskId to our TaskConfig's internal taskId.
            taskConfig.setReactTaskId(taskId);
            TSLog.logger.debug("taskId: " + taskId);
        } catch (IllegalStateException e) {
            TSLog.logger.error(TSLog.error(e.getMessage()), e);
        }
    }

    protected ReactNativeHost getReactNativeHost(Context context) {
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
                TSLog.logger.error(TSLog.error("[HeadlessTask] Reflection error getCurrentReactContext: " + e.getMessage()), e);
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
            TSLog.logger.debug("initialize ReactContext");
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
                            TSLog.logger.error(TSLog.error("HeadlessTask reflection error A: " + e), e);
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
     * Invokes HeadlessEvents queued while waiting for the ReactContext to initialize.
     * @param reactContext
     */
    private void drainTaskQueue(final ReactContext reactContext) {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            synchronized (mTaskQueue) {
                for (TaskConfig taskConfig : mTaskQueue) {
                    invokeStartTask(reactContext, taskConfig);
                }
            }
        }, 500);
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
     * Wrapper for a client event.  Inserts our custom taskId into the RN ClientEvent params.
     */
    private static class TaskConfig {
        private final int mTaskId;
        private int mReactTaskId;
        private final WritableMap mParams;
        public TaskConfig(WritableMap params) {
            mTaskId = getNextTaskId();
            // Insert our custom taskId for users to call BackgroundGeolocation.finishHeadlessTask(taskId) with.
            params.putInt("taskId", mTaskId);
            mParams = params;
        }
        public void setReactTaskId(int taskId) {
            mReactTaskId = taskId;
        }
        public int getTaskId() { return mTaskId; }
        public int getReactTaskId() { return mReactTaskId; }

        public HeadlessJsTaskConfig getTaskConfig() {
            return new HeadlessJsTaskConfig(HEADLESS_TASK_NAME, mParams, TASK_TIMEOUT);
        }
    }
}
