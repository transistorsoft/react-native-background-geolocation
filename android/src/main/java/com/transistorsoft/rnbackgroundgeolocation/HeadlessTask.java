package com.transistorsoft.rnbackgroundgeolocation;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;

import org.greenrobot.eventbus.Subscribe;

import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.transistorsoft.locationmanager.logger.TSLog;

import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chris on 2018-01-23.
 */

public class HeadlessTask {
    private static String HEADLESS_TASK_NAME = "BackgroundGeolocation";
    // Hard-coded time-limit for headless-tasks is 30000 @todo configurable?
    private static int TASK_TIMEOUT = 30000;

    private final List<Integer> mTasks = new ArrayList<>();

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
            params = event.getLocationEvent().toJson();
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
                TSLog.logger.error(TSLog.error(e.getMessage()));
                e.printStackTrace();
            }
        }

        HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(HEADLESS_TASK_NAME, clientEvent, TASK_TIMEOUT);
        try {
            startTask(event.getContext(), config);
        } catch (AssertionError e) {
            TSLog.logger.warn(TSLog.warn("Failed invoke HeadlessTask " + name + ".  Task ignored." + e.getMessage()));
        }
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    private void startTask(Context context, final HeadlessJsTaskConfig taskConfig) throws AssertionError {
        ReactApplication reactApplication = ((ReactApplication) context);

        UiThreadUtil.assertOnUiThread();
        final ReactInstanceManager reactInstanceManager = reactApplication.getReactNativeHost().getReactInstanceManager();

        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override public void onReactContextInitialized(final ReactContext reactContext) {
                    // Hack to fix unknown problem executing asynchronous BackgroundTask when ReactContext is created *first time*.  Fixed by adding short delay before #invokeStartTask
                    new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            invoke(reactContext, taskConfig);
                        }
                    }, 500);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground();
            }
        } else {
            invoke(reactContext, taskConfig);
        }
    }

    private void invoke(ReactContext reactContext, final HeadlessJsTaskConfig taskConfig) {
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);

        synchronized(mTasks) {
            if (mTasks.isEmpty()) {
                headlessJsTaskContext.addTaskEventListener(new HeadlessJsTaskEventListener() {
                    @Override public void onHeadlessJsTaskStart(int taskId) {
                        TSLog.logger.debug("taskId: " + taskId);
                    }
                    @Override public void onHeadlessJsTaskFinish(int taskId) {
                        TSLog.logger.debug("taskId: " + taskId);
                        synchronized (mTasks) {
                            if (!mTasks.isEmpty()) {
                                mTasks.remove(0);
                            }
                            if (mTasks.isEmpty()) {
                                headlessJsTaskContext.removeTaskEventListener(this);
                            }
                        }
                    }
                });
            }
            try {
                mTasks.add(headlessJsTaskContext.startTask(taskConfig));
            } catch (IllegalStateException e) {
                TSLog.logger.error(TSLog.error(e.getMessage()));
            }
        }
    }
}
