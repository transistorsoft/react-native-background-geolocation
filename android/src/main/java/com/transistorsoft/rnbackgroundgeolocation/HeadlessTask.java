package com.transistorsoft.rnbackgroundgeolocation;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.greenrobot.eventbus.Subscribe;

import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.event.FinishHeadlessTaskEvent;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.transistorsoft.locationmanager.logger.TSLog;

import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * The BackgroundGeolocation SDK creates a single instance of this class (via reflection upon Config.headlessJobService)
 * The SDK delivers events to this instance by dropping them onto EventBus (see @Subscribe).  Because this instance is subscribed
 * into EventBus, it's protected from GC.
 *
 * Created by chris on 2018-01-23.
 */

public class HeadlessTask {
    private static final String HEADLESS_TASK_NAME = "BackgroundGeolocation";
    // Hard-coded time-limit for headless-tasks is 60000 @todo configurable?
    private static final int TASK_TIMEOUT = 60000 * 2;

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
            }
        }

        try {
            HeadlessTaskManager.getInstance().startTask(event.getContext(), new HeadlessTaskManager.Task.Builder()
                    .setName(HEADLESS_TASK_NAME)
                    .setParams(clientEvent)
                    .setTimeout(TASK_TIMEOUT)
                    .setOnInvokeCallback((reactContext, task) -> {
                        //TSLog.logger.debug("*** onInvoke: " + task.getId());
                    })
                    .setOnFinishCallback(taskId -> {
                        //TSLog.logger.debug("*** onFinish: " + taskId);
                    })
                    .setOnErrorCallback((task, e) -> {
                        TSLog.logger.warn("⚠\uFE0F  HeadlessTaskError: " + e.getMessage() + ": " + task.toString());
                    })
                    .build()
            );
        } catch (Exception e) {
            TSLog.logger.warn(TSLog.warn("Failed invoke HeadlessTask " + name + ".  Task ignored:  " + e.getMessage()));
            e.printStackTrace();
        }
    }

    /**
     * EventBus Receiver.  Called when developer runs BackgroundGeolocation.finishHeadlessTask(taskId) from within their registered HeadlessTask.
     * Calls RN's HeadlessJsTaskContext.finishTask(taskId);
     * @param event
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onFinishHeadlessTask(FinishHeadlessTaskEvent event) {
        try {
            HeadlessTaskManager.getInstance().finishTask(event.getContext(), event.getTaskId());
        } catch (Exception e) {
            TSLog.logger.warn(TSLog.warn(e.getMessage()));
        }
    }
}
