package com.transistorsoft.rnbackgroundgeolocation;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.greenrobot.eventbus.Subscribe;

import com.transistorsoft.locationmanager.config.TSConfig;
import com.transistorsoft.locationmanager.event.EventName;
import com.transistorsoft.locationmanager.event.FinishHeadlessTaskEvent;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.transistorsoft.locationmanager.http.HttpResponse;
import com.transistorsoft.locationmanager.logger.TSLog;

import org.greenrobot.eventbus.ThreadMode;

import java.util.HashMap;
import java.util.Map;

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
        TSConfig config = TSConfig.getInstance(event.getContext());

        String name = event.getName();
        TSLog.logger.debug("\uD83D\uDC80  event: " + name);

        WritableMap clientEvent = new WritableNativeMap();
        Map<String, ?> params = null;
        clientEvent.putString("name", name);

        if (name.equals(EventName.TERMINATE)) {
            params = config.toMap(false);
        } else if (name.equals(EventName.LOCATION)) {
            params = event.getLocationEvent().toMap();
        } else if (name.equals(EventName.MOTIONCHANGE)) {
            params = event.getMotionChangeEvent().toMap();
        } else if (name.equals(EventName.HTTP)) {
            HttpResponse response = (HttpResponse) event.getEvent();
            Map<String, Object> httpParams = new HashMap<>();
            httpParams.put("status", response.getStatus());
            httpParams.put("responseText", response.getResponseText());
            httpParams.put("success", response.isSuccess());
            params = httpParams;
        } else if (name.equals(EventName.PROVIDERCHANGE)) {
            params = event.getProviderChangeEvent().toMap();
        } else if (name.equals(EventName.ACTIVITYCHANGE)) {
            params = event.getActivityChangeEvent().toMap();
        } else if (name.equals(EventName.SCHEDULE)) {
            params = config.toMap(false);
        } else if (name.equals(EventName.BOOT)) {
            params = config.toMap(false);
        } else if (name.equals(EventName.GEOFENCE)) {
            params = event.getGeofenceEvent().toMap();
        } else if (name.equals(EventName.GEOFENCESCHANGE)) {
            params = event.getGeofencesChangeEvent().toMap();
        } else if (name.equals(EventName.HEARTBEAT)) {
            params = event.getHeartbeatEvent().toMap();
        } else if (name.equals(EventName.POWERSAVECHANGE)) {
            clientEvent.putBoolean("params", event.getPowerSaveChangeEvent().isPowerSaveMode());
        } else if (name.equals(EventName.CONNECTIVITYCHANGE)) {
            params = event.getConnectivityChangeEvent().toMap();
        } else if (name.equals(EventName.ENABLEDCHANGE)) {
            clientEvent.putBoolean("params", event.getEnabledChangeEvent());
        } else if (name.equals(EventName.NOTIFICATIONACTION)) {
            clientEvent.putString("params", event.getNotificationEvent());
        } else if (name.equals(EventName.AUTHORIZATION)) {
            params = event.getAuthorizationEvent().toMap();
        } else {
            TSLog.logger.warn(TSLog.warn("Unknown Headless Event: " + name));
            clientEvent.putString("error", "Unknown event: " + name);
            clientEvent.putNull("params");
        }

        if (params != null) {
            clientEvent.putMap("params", RNBackgroundGeolocationModule.mapToWritableMap(params));
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
