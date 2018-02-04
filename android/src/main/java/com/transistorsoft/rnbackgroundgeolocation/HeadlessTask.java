package com.transistorsoft.rnbackgroundgeolocation;

import android.content.Context;
import android.os.Handler;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.transistorsoft.locationmanager.logger.TSLog;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by chris on 2018-01-23.
 */

public class HeadlessTask implements HeadlessJsTaskEventListener {
    private static String HEADLESS_TASK_NAME = "BackgroundGeolocation";
    // Hard-coded time-limit for headless-tasks is 30000 @todo configurable?
    private static int TASK_TIMEOUT = 30000;
    private static Handler mHandler = new Handler();

    private ReactNativeHost mReactNativeHost;
    private HeadlessJsTaskContext mActiveTaskContext;
    private Callback mCallback;

    HeadlessTask(Context context, WritableMap args, Callback callback) {
        try {
            ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();
        } catch (AssertionError e) {
            TSLog.logger.warn(TSLog.warn("Failed to fetch ReactApplication.  Task ignored."));
            return;  // <-- Do nothing.  Just return
        }
        mCallback = callback;
        String eventName = args.getString("event");

        TSLog.logger.debug("\uD83D\uDC80  event: " + eventName);

        WritableMap event = new WritableNativeMap();
        event.putString("name", eventName);
        try {
            event.putMap("params", RNBackgroundGeolocationModule.jsonToMap(new JSONObject(args.getString("params"))));
        } catch (JSONException e) {
            TSLog.logger.error(TSLog.error(e.getMessage()));
            event.putNull("params");
            event.putString("error", e.getMessage());
            e.printStackTrace();
        }
        HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(HEADLESS_TASK_NAME, event, TASK_TIMEOUT);
        startTask(config);
    }

    @Override
    public void onHeadlessJsTaskStart(int taskId) {
        TSLog.logger.debug("taskId: " + taskId);
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        TSLog.logger.debug("taskId: " + taskId);
        mActiveTaskContext.removeTaskEventListener(this);
        mCallback.onComplete();
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    private void startTask(final HeadlessJsTaskConfig taskConfig) {
        UiThreadUtil.assertOnUiThread();
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(final ReactContext reactContext) {
                    // Hack to fix unknown problem executing asynchronous BackgroundTask when ReactContext is created *first time*.  Fixed by adding short delay before #invokeStartTask
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            invokeStartTask(reactContext, taskConfig);
                        }
                    }, 500);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground();
            }
        } else {
            invokeStartTask(reactContext, taskConfig);
        }
    }

    private void invokeStartTask(ReactContext reactContext, final HeadlessJsTaskConfig taskConfig) {
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
        headlessJsTaskContext.addTaskEventListener(this);
        mActiveTaskContext = headlessJsTaskContext;
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    int taskId = headlessJsTaskContext.startTask(taskConfig);
                } catch (IllegalStateException e) {
                    TSLog.logger.error(TSLog.error(e.getMessage()));
                    mCallback.onComplete();
                }
            }
        });
    }

    public interface Callback {
        void onComplete();
    }
}
