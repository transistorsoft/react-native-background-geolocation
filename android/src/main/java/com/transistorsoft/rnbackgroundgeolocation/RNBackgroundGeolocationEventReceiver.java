package com.transistorsoft.rnbackgroundgeolocation;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;

import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.logger.TSLog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This BroadcastReceiver receives broadcasted events from the BackgroundGeolocation plugin.
 * It's designed for you to customize in your own application, to handle events in the native
 * environment.  You can use this in cases where the user has terminated your foreground Activity
 * while the BackgroundGeolocation background Service continues to operate.
 *
 * You can use this Service to implement the React Native Headless JS mechanism (https://facebook.github.io/react-native/docs/headless-js-android.html)
 *
 * To enable this service, add the following block to your AndroidManifest within the <application></application> element:
 *
 <application>
    <receiver android:name="com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocationEventReceiver">
        <intent-filter>
            <!-- You may choose to listen to any, all or none of the following events.  If you don't wish to listen to a particular event, remove it from your AndroidManifest -->
            <action android:name="com.transistorsoft.locationmanager.event.BOOT" />
            <action android:name="com.transistorsoft.locationmanager.event.TERMINATE" />
            <action android:name="com.transistorsoft.locationmanager.event.HEARTBEAT" />
            <action android:name="com.transistorsoft.locationmanager.event.MOTIONCHANGE" />
            <action android:name="com.transistorsoft.locationmanager.event.LOCATION" />
            <action android:name="com.transistorsoft.locationmanager.event.GEOFENCE" />
            <action android:name="com.transistorsoft.locationmanager.event.HTTP" />
            <action android:name="com.transistorsoft.locationmanager.event.SCHEDULE" />
            <action android:name="com.transistorsoft.locationmanager.event.ACTIVITYCHANGE" />
            <action android:name="com.transistorsoft.locationmanager.event.PROVIDERCHANGE" />
            <action android:name="com.transistorsoft.locationmanager.event.GEOFENCESCHANGE" />
        </intent-filter>
     </receiver>
 </application>
 *
 * You can register a Headless JS service in your index.android.js as follows:

 import BackgroundGeolocationHeadlessService from "./BackgroundGeolocationHeadlessService"
 .
 .
 .
 AppRegistry.registerHeadlessTask('BackgroundGeolocation', () => BackgroundGeolocationHeadlessService);

 * It's up to you to create your own BackgroundGeolocationHeadlessService.js.  The event object contains a #name and #params.  It could like something like this:

 module.exports = async (event) => {
   console.log('[js] BackgroundGeolocationHeadlessService: ', event.name, event.params);
 }

 *
 *
 * @author chris scott, Transistor Software www.transistorsoft.com
 *
 * This BroadcastReceiver receives the following events:
 *
 * @event heartbeat         BackgroundGeolocation.EVENT_HEARTBEAT
 * @event motionchange      BackgroundGeolocation.EVENT_MOTIONCHANGE
 * @event location          BackgroundGeolocation.EVENT_LOCATION
 * @event geofence          BackgroundGeolocation.EVENT_GEOFENCE
 * @event http              BackgroundGeolocation.EVENT_HTTP
 * @event schedule          BackgroundGeolocation.EVENT_SCHEDULE
 * @event activitychange    BackgroundGeolocation.EVENT_ACTIVITYCHANGE
 * @event providerchange    BackgroundGeolocation.EVENT_PROVIDERCHANGE
 * @event geofenceschange   BackgroundGeolocation.EVENT_GEOFENCESCHANGE
 * @event heartbeat         BackgroundGeolocation.EVENT_BOOT
 *
 */
public class RNBackgroundGeolocationEventReceiver extends BroadcastReceiver implements HeadlessJsTaskEventListener {
    /**
     * This is the name of your React Native HeadlessJs service name on the client:
     *
     * AppRegistry.registerHeadlessTask('HeadlessService', () => HeadlessService);
     */
    private static String HEADLESS_TASK_NAME = "BackgroundGeolocation";

    private ReactNativeHost mReactNativeHost;
    private HeadlessJsTaskContext mActiveTaskContext;

    @Override
    public void onHeadlessJsTaskStart(int taskId) {
        TSLog.logger.debug("onHeadlessJsTaskStart: " + taskId);
    }
    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        TSLog.logger.debug("onHeadlessJsTaskFinish: " + taskId);
        mActiveTaskContext.removeTaskEventListener(this);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String eventName = getEventName(intent.getAction());

        // Ensure we can reference ReactApplication.  If not, the ReactApplication has not yet been booted so cannot possibly have registered a HeadlessTask.
        try {
            ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();
        } catch (AssertionError e) {
            TSLog.logger.warn(TSLog.warn("Failed to fetch ReactApplication.  Task ignored."));
            return;  // <-- Do nothing.  Just return
        }

        BackgroundGeolocation adapter = BackgroundGeolocation.getInstance(context, intent);
        if (!adapter.isMainActivityActive()) {
            TSLog.logger.debug(TSLog.header("Headless Event Receiver: " + eventName));
            Bundle extras = intent.getExtras();
            WritableMap params = Arguments.fromBundle(extras);
            // Decode JSON -> Map / Array where applicable.
            try {
                if (extras.containsKey("location")) {
                    JSONObject location = new JSONObject(extras.getString("location"));
                    params.putMap("location", RNBackgroundGeolocationModule.jsonToMap(location));
                } else if (extras.containsKey("state")) {
                    JSONObject state = new JSONObject(extras.getString("state"));
                    params.putMap("state", RNBackgroundGeolocationModule.jsonToMap(state));
                } else if (extras.containsKey("provider")) {
                    JSONObject provider = new JSONObject(extras.getString("provider"));
                    params.putMap("provider", RNBackgroundGeolocationModule.jsonToMap(provider));
                } else if (eventName.equalsIgnoreCase(BackgroundGeolocation.EVENT_GEOFENCESCHANGE)) {
                    JSONObject event = new JSONObject(extras.getString(BackgroundGeolocation.EVENT_GEOFENCESCHANGE));
                    params.putArray("on", RNBackgroundGeolocationModule.convertJsonToArray(event.getJSONArray("on")));
                    params.putArray("off", RNBackgroundGeolocationModule.convertJsonToArray(event.getJSONArray("off")));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
            WritableMap event = new WritableNativeMap();
            event.putString("name", eventName);
            event.putMap("params", params);
            HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(HEADLESS_TASK_NAME, event);
            startTask(config);
        } else if (mReactNativeHost.hasInstance()) {
            ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
            if (reactContext != null) {
                HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
                headlessJsTaskContext.removeTaskEventListener(this);
            }
        }
    }

    /**
     * Fetch the last portion of the Intent action foo.bar.EVENT_NAME -> event_name
     * @param {String} action
     * @return {string} eventName
     */
    private String getEventName(String action) {
        String[] path = action.split("\\.");
        return path[path.length-1].toLowerCase();
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    protected void startTask(final HeadlessJsTaskConfig taskConfig) {
        UiThreadUtil.assertOnUiThread();
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext reactContext) {
                    invokeStartTask(reactContext, taskConfig);
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
                int taskId = headlessJsTaskContext.startTask(taskConfig);
            }
        });



    }
}


