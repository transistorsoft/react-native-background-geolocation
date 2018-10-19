package com.transistorsoft.rnbackgroundgeolocation;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.telecom.Call;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.android.gms.common.GoogleApiAvailability;

import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;
import com.transistorsoft.locationmanager.adapter.TSConfig;
import com.transistorsoft.locationmanager.adapter.callback.*;
import com.transistorsoft.locationmanager.data.LocationModel;
import com.transistorsoft.locationmanager.event.ActivityChangeEvent;
import com.transistorsoft.locationmanager.event.ConnectivityChangeEvent;
import com.transistorsoft.locationmanager.event.GeofenceEvent;
import com.transistorsoft.locationmanager.event.GeofencesChangeEvent;
import com.transistorsoft.locationmanager.event.HeartbeatEvent;
import com.transistorsoft.locationmanager.event.LocationProviderChangeEvent;
import com.transistorsoft.locationmanager.geofence.TSGeofence;
import com.transistorsoft.locationmanager.http.HttpResponse;
import com.transistorsoft.locationmanager.location.TSCurrentPositionRequest;
import com.transistorsoft.locationmanager.location.TSLocation;
import com.transistorsoft.locationmanager.location.TSWatchPositionRequest;
import com.transistorsoft.locationmanager.scheduler.ScheduleEvent;
import com.transistorsoft.locationmanager.util.Sensors;
import com.transistorsoft.locationmanager.logger.TSLog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by chris on 2015-10-30.
 */
public class RNBackgroundGeolocationModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {

    private static final String TAG = "TSLocationManager";
    private static final String JOB_SERVICE_CLASS = "HeadlessTask";

    public static final String ACCESS_COARSE_LOCATION = Manifest.permission.ACCESS_COARSE_LOCATION;
    public static final String ACCESS_FINE_LOCATION = Manifest.permission.ACCESS_FINE_LOCATION;

    public static final int REQUEST_ACTION_START                = 1;
    public static final int REQUEST_ACTION_GET_CURRENT_POSITION = 2;
    public static final int REQUEST_ACTION_START_GEOFENCES      = 3;

    private boolean initialized = false;
    private Intent launchIntent;

    private static final String EVENT_WATCHPOSITION = "watchposition";

    // Map of event listener-counts
    private final HashMap<String, Integer> listeners = new HashMap<>();

    private List<String> events = new ArrayList<>();

    public RNBackgroundGeolocationModule(ReactApplicationContext reactContext) {
        super(reactContext);

        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.useCLLocationAccuracy(true);

        config.updateWithBuilder()
            .setHeadlessJobService(getClass().getPackage().getName() + "." + JOB_SERVICE_CLASS)
            .commit();

        // These are the only events which can be subscribed to.
        events.add(BackgroundGeolocation.EVENT_LOCATION);
        events.add(BackgroundGeolocation.EVENT_MOTIONCHANGE);
        events.add(BackgroundGeolocation.EVENT_ACTIVITYCHANGE);
        events.add(BackgroundGeolocation.EVENT_PROVIDERCHANGE);
        events.add(BackgroundGeolocation.EVENT_GEOFENCESCHANGE);
        events.add(BackgroundGeolocation.EVENT_GEOFENCE);
        events.add(BackgroundGeolocation.EVENT_HEARTBEAT);
        events.add(BackgroundGeolocation.EVENT_HTTP);
        events.add(BackgroundGeolocation.EVENT_SCHEDULE);
        events.add(BackgroundGeolocation.EVENT_POWERSAVECHANGE);
        events.add(BackgroundGeolocation.EVENT_CONNECTIVITYCHANGE);
        events.add(BackgroundGeolocation.EVENT_ENABLEDCHANGE);

        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void initialize() {
        // do nothing
    }
    @Override
    public String getName() {
        return "RNBackgroundGeolocation";
    }


    /**
     * location event callback
     */
    private class LocationCallback implements TSLocationCallback {
        @Override public void onLocation(TSLocation location) {
            try {
                sendEvent(BackgroundGeolocation.EVENT_LOCATION, jsonToMap(location.toJson()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        @Override public void onError(Integer error) {
            onLocationError(error);
        }
    }

    /**
     * motionchange event callback
     */
    private class MotionChangeCallback implements TSLocationCallback {
        @Override public void onLocation(TSLocation location) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("isMoving", location.getIsMoving());
            try {
                params.putMap("location", jsonToMap(location.toJson()));
                sendEvent(BackgroundGeolocation.EVENT_MOTIONCHANGE, params);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        @Override public void onError(Integer error) {
            onLocationError(error);
        }
    }

    /**
     * activitychange event callback
     */
    private class ActivityChangeCallback implements TSActivityChangeCallback {
        @Override public void onActivityChange(ActivityChangeEvent event) {
            try {
                sendEvent(BackgroundGeolocation.EVENT_ACTIVITYCHANGE, jsonToMap(event.toJson()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * providerchange event callback
     */
    private class LocationProviderChangeCallback implements TSLocationProviderChangeCallback {
        @Override public void onLocationProviderChange(LocationProviderChangeEvent event) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("network", event.isNetworkEnabled());
            params.putBoolean("gps", event.isGPSEnabled());
            params.putBoolean("enabled", event.isEnabled());
            params.putInt("status", event.getStatus());
            sendEvent(BackgroundGeolocation.EVENT_PROVIDERCHANGE, params);
        }
    }

    /**
     * connectivitychange event callback
     */
    private class ConnectivityChangeCallback implements TSConnectivityChangeCallback {
        @Override public void onConnectivityChange(ConnectivityChangeEvent event) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("connected", event.hasConnection());
            sendEvent(BackgroundGeolocation.EVENT_CONNECTIVITYCHANGE, params);
        }
    }
    /**
     * enabledchange event callback
     */
    private class EnabledChangeCallback implements TSEnabledChangeCallback {
        @Override public void onEnabledChange(boolean enabled) {
            sendEvent(BackgroundGeolocation.EVENT_ENABLEDCHANGE, enabled);
        }
    }
    /**
     * geofenceschange event callback
     */
    private class GeofencesChangeCallback implements TSGeofencesChangeCallback {
        @Override public void onGeofencesChange(GeofencesChangeEvent event) {
            try {
                // TODO
                WritableMap params = new WritableNativeMap();
                WritableArray on = new WritableNativeArray();
                WritableArray off = new WritableNativeArray();
                sendEvent(BackgroundGeolocation.EVENT_GEOFENCESCHANGE, jsonToMap(event.toJson()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * geofence event callback
     */
    private class GeofenceCallback implements TSGeofenceCallback {
        @Override public void onGeofence(GeofenceEvent event) {
            try {
                sendEvent(BackgroundGeolocation.EVENT_GEOFENCE, jsonToMap(event.toJson()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * heartbeat event callback
     */
    private class HeartbeatCallback implements TSHeartbeatCallback {
        @Override public void onHeartbeat(HeartbeatEvent event) {
            try {
                sendEvent(BackgroundGeolocation.EVENT_HEARTBEAT, jsonToMap(event.toJson()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * http event callback
     */
    private class HttpResponseCallback implements TSHttpResponseCallback {
        @Override public void onHttpResponse(HttpResponse response) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("success", response.isSuccess());
            params.putInt("status", response.status);
            params.putString("responseText", response.responseText);
            sendEvent(BackgroundGeolocation.EVENT_HTTP, params);
        }
    }

    /**
     * schedule event callback
     */
    private class ScheduleCallback implements TSScheduleCallback {
        @Override public void onSchedule(ScheduleEvent event) {
            try {
                sendEvent(BackgroundGeolocation.EVENT_SCHEDULE, jsonToMap(event.getState()));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    /**
    * powersavechange event callback
    */
    private class PowerSaveChangeCallack implements TSPowerSaveChangeCallback {
        @Override public void onPowerSaveChange(Boolean isPowerSaveMode) {
            sendEvent(BackgroundGeolocation.EVENT_POWERSAVECHANGE, isPowerSaveMode);
        }
    }

    @Override
    public void onHostResume() {
        if (!initialized) {
            initializeLocationManager();
        }
    }
    @Override
    public void onHostPause() {

    }
    @Override
    public void onHostDestroy() {
        initialized = false;
        removeAllListeners();
        getAdapter().onActivityDestroy();
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @ReactMethod
    public void registerPlugin(String name) {
        // Do nothing.  This is for iOS only.
    }

    @ReactMethod
    public void ready(ReadableMap params, final Callback success, final Callback failure) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        if (config.isFirstBoot()) {
            config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));
        } else if (params.hasKey("reset") && params.getBoolean("reset")) {
            config.reset();
            config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));
        }
        getAdapter().ready(new TSCallback() {
            @Override public void onSuccess() { success.invoke(getState()); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void configure(ReadableMap params, final Callback success, final Callback failure){
        final TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.reset();
        config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));

        getAdapter().ready(new TSCallback() {
            @Override public void onSuccess() { success.invoke(getState()); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void setConfig(ReadableMap params, final Callback success, final Callback failure) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.updateWithJSONObject(mapToJson(params));
        success.invoke(getState());
    }

    @ReactMethod
    public void reset(ReadableMap defaultConfig, final Callback success, final Callback failure) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.reset();
        config.updateWithJSONObject(mapToJson(setHeadlessJobService(defaultConfig)));
        success.invoke(getState());
    }

    @ReactMethod
    public void start(final Callback success, final Callback failure) {
        getAdapter().start(new TSCallback() {
            @Override public void onSuccess() { success.invoke(getState()); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void startSchedule(Callback success, Callback failure) {
        if (getAdapter().startSchedule()) {
            success.invoke(getState());
        } else {
            failure.invoke("Failed to start schedule.  Did you configure a #schedule?");
        }
    }

    @ReactMethod
    public void stopSchedule(Callback success, Callback failure) {
        getAdapter().stopSchedule();
        success.invoke(getState());
    }

    @ReactMethod
    public void startGeofences(final Callback success, final Callback failure) {
        getAdapter().startGeofences(new TSCallback() {
            @Override public void onSuccess() { success.invoke(getState()); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void stop(final Callback success, final Callback failure) {
        getAdapter().stop(new TSCallback() {
            @Override public void onSuccess() { success.invoke(getState()); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void changePace(Boolean moving, final Callback success, final Callback failure) {
        getAdapter().changePace(moving, new TSCallback() {
            @Override public void onSuccess() { success.invoke(); }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void getState(Callback success, final Callback failure) {
        success.invoke(getState());
    }

    @ReactMethod
    public void getLocations(final Callback success, final Callback failure) {
        getAdapter().getLocations(new TSGetLocationsCallback() {
            @Override public void onSuccess(List<LocationModel> records) {
                try {
                    JSONArray data = new JSONArray();
                    for (LocationModel location : records) {
                        data.put(location.json);
                    }
                    success.invoke(convertJsonToArray(data));
                } catch (JSONException e) {
                    e.printStackTrace();
                    failure.invoke(e.getMessage());
                }
            }
            @Override public void onFailure(Integer error) { failure.invoke(error); }
        });
    }

    @ReactMethod
    public void getCount(final Callback success, final Callback failure) {
        success.invoke(getAdapter().getCount());
    }

    @ReactMethod
    public void insertLocation(ReadableMap params, final Callback success, final Callback failure) {
        getAdapter().insertLocation(mapToJson(params), new TSInsertLocationCallback() {
            @Override public void onSuccess(String uuid) {
                success.invoke(uuid);
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    // @deprecated -> #destroyLocations
    @ReactMethod
    public void clearDatabase(Callback success, Callback failure) {
        destroyLocations(success, failure);
    }

    @ReactMethod
    public void destroyLocations(final Callback success, final Callback failure) {
        getAdapter().destroyLocations(new TSCallback() {
            @Override public void onSuccess() { success.invoke(); }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void destroyLog(final Callback success, final Callback failure) {
        getAdapter().destroyLog(new TSCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void sync(final Callback success, final Callback failure) {
        getAdapter().sync(new TSSyncCallback() {
            @Override public void onSuccess(List<LocationModel> records) {
                try {
                    JSONArray data = new JSONArray();
                    for (LocationModel location : records) {
                        data.put(location.json);
                    }
                    success.invoke(convertJsonToArray(data));
                } catch (JSONException e) {
                    failure.invoke(e.getMessage());
                }
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void getCurrentPosition(ReadableMap options, final Callback success, final Callback failure) {
        TSCurrentPositionRequest.Builder builder = new TSCurrentPositionRequest.Builder(getReactApplicationContext());

        builder.setCallback(new TSLocationCallback() {
            @Override public void onLocation(TSLocation tsLocation) {
                try {
                    success.invoke(jsonToMap(tsLocation.toJson()));
                } catch (JSONException e) {
                    failure.invoke(e.getMessage());
                }
            }
            @Override public void onError(Integer errorCode) {
                failure.invoke(errorCode);
            }
        });

        if (options.hasKey("samples"))         { builder.setSamples(options.getInt("samples")); }
        if (options.hasKey("extras"))          { builder.setExtras(mapToJson(options.getMap("extras"))); }
        if (options.hasKey("persist"))         { builder.setPersist(options.getBoolean("persist")); }
        if (options.hasKey("timeout"))         { builder.setTimeout(options.getInt("timeout")); }
        if (options.hasKey("maximumAge"))      { builder.setMaximumAge((long) options.getInt("maximumAge")); }
        if (options.hasKey("desiredAccuracy")) { builder.setDesiredAccuracy(options.getInt("desiredAccuracy")); }

        getAdapter().getCurrentPosition(builder.build());
    }
    @ReactMethod
    public void watchPosition(ReadableMap options, final Callback success, final Callback failure) {
        TSWatchPositionRequest.Builder builder = new TSWatchPositionRequest.Builder(getReactApplicationContext());

        builder.setCallback(new TSLocationCallback() {
            @Override public void onLocation(TSLocation tsLocation) {
                try {
                    sendEvent(EVENT_WATCHPOSITION, jsonToMap(tsLocation.toJson()));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            @Override public void onError(Integer error) {
                failure.invoke(error);
            }
        });

        if (options.hasKey("interval"))        { builder.setInterval((long) options.getInt("interval")); }
        if (options.hasKey("extras"))          { builder.setExtras(mapToJson(options.getMap("extras"))); }
        if (options.hasKey("persist"))         { builder.setPersist(options.getBoolean("persist")); }
        if (options.hasKey("desiredAccuracy")) { builder.setDesiredAccuracy(options.getInt("desiredAccuracy")); }

        getAdapter().watchPosition(builder.build());
        success.invoke();
    }
    @ReactMethod
    public void stopWatchPosition(final Callback success, final Callback failure) {
        getAdapter().stopWatchPosition(new TSCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }
    @ReactMethod
    public void getOdometer(Callback success, Callback failure) {
        success.invoke(getAdapter().getOdometer());
    }
    @ReactMethod
    public void setOdometer(Float value, final Callback success, final Callback failure) {
        getAdapter().setOdometer(value, new TSLocationCallback() {
            @Override public void onLocation(TSLocation location) {
                try {
                    success.invoke(jsonToMap(location.toJson()));
                } catch (JSONException e) {
                    failure.invoke(e.getMessage());
                }
            }
            @Override public void onError(Integer errorCode) {
                failure.invoke((Integer) errorCode);
            }
        });
    }
    @ReactMethod
    public void addGeofence(ReadableMap options, final Callback success, final Callback failure) {
        try {
             getAdapter().addGeofence(buildGeofence(options), new TSCallback() {
                 @Override public void onSuccess() { success.invoke(); }
                 @Override public void onFailure(String error) { failure.invoke(error); }
             });
        } catch (TSGeofence.Exception e) {
            failure.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void addGeofences(ReadableArray data, final Callback success, final Callback failure) {
        List<TSGeofence> geofences = new ArrayList<TSGeofence>();
        for (int n=0;n<data.size();n++) {
            try {
                geofences.add(buildGeofence(data.getMap(n)));
            } catch (TSGeofence.Exception e) {
                failure.invoke(e.getMessage());
                return;
            }
        }

        getAdapter().addGeofences(geofences, new TSCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    private TSGeofence buildGeofence(ReadableMap config) throws TSGeofence.Exception {
        TSGeofence.Builder builder = new TSGeofence.Builder();
        if (config.hasKey("identifier"))       { builder.setIdentifier(config.getString("identifier")); }
        if (config.hasKey("latitude"))         { builder.setLatitude(config.getDouble("latitude")); }
        if (config.hasKey("longitude"))        { builder.setLongitude(config.getDouble("longitude")); }
        if (config.hasKey("radius"))           { builder.setRadius((float) config.getDouble("radius")); }
        if (config.hasKey("notifyOnEntry"))    { builder.setNotifyOnEntry(config.getBoolean("notifyOnEntry")); }
        if (config.hasKey("notifyOnExit"))     { builder.setNotifyOnExit(config.getBoolean("notifyOnExit")); }
        if (config.hasKey("notifyOnDwell"))    { builder.setNotifyOnDwell(config.getBoolean("notifyOnDwell")); }
        if (config.hasKey("loiteringDelay"))   { builder.setLoiteringDelay(config.getInt("loiteringDelay")); }
        if (config.hasKey("extras"))           { builder.setExtras(mapToJson(config.getMap("extras"))); }

        return builder.build();
    }

    @ReactMethod
    public void removeGeofence(String identifier, final Callback success, final Callback failure) {
        getAdapter().removeGeofence(identifier, new TSCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void removeGeofences(final Callback success, final Callback failure) {
        // TODO allow JS api to delete a list-of-geofences.
        // TODO accept WritableArray geofences from Client js API, allowing to remove a set of geofences
        List<String> identifiers = new ArrayList<>();
        getAdapter().removeGeofences(identifiers, new TSCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void getGeofences(final Callback success, final Callback failure) {
        getAdapter().getGeofences(new TSGetGeofencesCallback() {
            @Override public void onSuccess(List<TSGeofence> geofences) {
                try {
                    WritableArray rs = new WritableNativeArray();
                    for (TSGeofence geofence : geofences) {
                        WritableMap data = new WritableNativeMap();
                        data.putString("identifier", geofence.getIdentifier());
                        data.putDouble("latitude", geofence.getLatitude());
                        data.putDouble("longitude", geofence.getLongitude());
                        data.putDouble("radius", geofence.getRadius());
                        data.putBoolean("notifyOnEntry", geofence.getNotifyOnEntry());
                        data.putBoolean("notifyOnExit", geofence.getNotifyOnExit());
                        data.putBoolean("notifyOnDwell", geofence.getNotifyOnDwell());
                        data.putInt("loiteringDelay", geofence.getLoiteringDelay());
                        if (geofence.getExtras() != null) {
                            data.putMap("extras", jsonToMap(geofence.getExtras()));
                        }
                        rs.pushMap(data);
                    }
                    success.invoke(rs);
                } catch (JSONException e) {
                    e.printStackTrace();
                    failure.invoke(e.getMessage());
                }
            }
            @Override public void onFailure(String error) { failure.invoke(error); }
        });
    }
    /**
    * Android doesn't support (or require) background-tasks.  This method is here for compatibility with iOS API
    */
    @ReactMethod
    public void beginBackgroundTask(Callback success) {
        Integer taskId = 0;
        success.invoke(taskId);
    }
    /**
    * Android doesn't support (or require) background-tasks.  This method is here for compatibility with iOS API
    */
    @ReactMethod
    public void finish(Integer taskId) {

    }

    @ReactMethod
    public void playSound( int soundId) {
        getAdapter().startTone(soundId);
    }

    @ReactMethod
    public void getLog(final Callback success, final Callback failure) {
        getAdapter().getLog(new TSGetLogCallback() {
            @Override public void onSuccess(String log) {
                success.invoke(log);
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void emailLog(String email, final Callback success, final Callback failure) {
        getAdapter().emailLog(email, getCurrentActivity(), new TSEmailLogCallback() {
            @Override public void onSuccess() {
                success.invoke();
            }
            @Override public void onFailure(String error) {
                failure.invoke(error);
            }
        });
    }

    @ReactMethod
    public void log(String level, String message) throws JSONException {
        TSLog.log(level, message);
    }

    @ReactMethod
    public void getSensors(Callback success, Callback error) {
        Sensors sensors = Sensors.getInstance(getReactApplicationContext());
        WritableMap params = new WritableNativeMap();
        params.putString("platform", "android");
        params.putBoolean("accelerometer", sensors.hasAccelerometer());
        params.putBoolean("magnetometer", sensors.hasMagnetometer());
        params.putBoolean("gyroscope", sensors.hasGyroscope());
        params.putBoolean("significant_motion", sensors.hasSignificantMotion());
        success.invoke(params);
    }

    @ReactMethod
    public void isPowerSaveMode(Callback success, Callback error) {
        success.invoke(getAdapter().isPowerSaveMode());
    }

    @ReactMethod
    public void addEventListener(String event) {
        if (!events.contains(event)) {
            Log.e(TAG, "[RNBackgroundGeolocation addListener] Unknown event: " + event);
            return;
        }
        BackgroundGeolocation adapter = getAdapter();
        Integer count;

        synchronized(listeners) {
            if (listeners.containsKey(event)) {
                count = listeners.get(event);
                count++;
                listeners.put(event, count);
            } else {
                count = 1;
                listeners.put(event, count);
            }
        }
        if (count == 1) {
            if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_LOCATION)) {
                adapter.onLocation(new LocationCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_MOTIONCHANGE)) {
                adapter.onMotionChange(new MotionChangeCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_ACTIVITYCHANGE)) {
                adapter.onActivityChange(new ActivityChangeCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_PROVIDERCHANGE)) {
                adapter.onLocationProviderChange(new LocationProviderChangeCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_GEOFENCESCHANGE)) {
                adapter.onGeofencesChange(new GeofencesChangeCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_GEOFENCE)) {
                adapter.onGeofence(new GeofenceCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_HEARTBEAT)) {
                adapter.onHeartbeat(new HeartbeatCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_HTTP)) {
                adapter.onHttp(new HttpResponseCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_SCHEDULE)) {
                adapter.onSchedule(new ScheduleCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_POWERSAVECHANGE)) {
                adapter.onPowerSaveChange(new PowerSaveChangeCallack());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_CONNECTIVITYCHANGE)) {
                adapter.onConnectivityChange(new ConnectivityChangeCallback());
            } else if (event.equalsIgnoreCase(BackgroundGeolocation.EVENT_ENABLEDCHANGE)) {
                adapter.onEnabledChange(new EnabledChangeCallback());
            }
        }
    }

    @ReactMethod
    public void removeListener(String event) {
        Integer count;

        synchronized (listeners) {
            if (listeners.containsKey(event)) {
                count = listeners.get(event);
                count--;
                if (count > 0) {
                    listeners.put(event, count);
                } else {
                    getAdapter().removeListeners(event);
                }
            }
        }
    }

    @ReactMethod
    public void removeAllListeners(Callback success, Callback failure) {
        removeAllListeners();
        success.invoke();
    }

    private void removeAllListeners() {
        synchronized (listeners) {
            listeners.clear();
        }
        getAdapter().removeListeners();
    }

    private void onLocationError(Integer code) {
        WritableMap params = new WritableNativeMap();
        params.putInt("error", code);
        sendEvent(BackgroundGeolocation.EVENT_LOCATION, params);
    }

    private void handlePlayServicesConnectError(Integer errorCode) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        GoogleApiAvailability.getInstance().getErrorDialog(getCurrentActivity(), errorCode, 1001).show();
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext().getJSModule(RCTNativeAppEventEmitter.class).emit(eventName, params);
    }

    private void sendEvent(String eventName, String result) {
        getReactApplicationContext().getJSModule(RCTNativeAppEventEmitter.class).emit(eventName, result);
    }

    private void sendEvent(String eventName, Boolean result) {
        getReactApplicationContext().getJSModule(RCTNativeAppEventEmitter.class).emit(eventName, result);
    }

    public static WritableMap jsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();
        if (jsonObject == null) {
            return map;
        }
        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, jsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Long) {
                map.putDouble(key, ((Long) value).doubleValue());
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(jsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    public static JSONObject mapToJson(ReadableMap map) {
        ReadableMapKeySetIterator iterator = map.keySetIterator();
        JSONObject json = new JSONObject();

        try {
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                switch (map.getType(key)) {
                    case String:
                        json.put(key, map.getString(key));
                        break;
                    case Boolean:
                        json.put(key, map.getBoolean(key));
                        break;
                    case Number:
                        json.put(key, map.getDouble(key));
                        break;
                    case Map:
                        json.put(key, mapToJson(map.getMap(key)));
                        break;
                    case Array:
                        json.put(key, arrayToJson(map.getArray(key)));
                        break;

                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return json;
    }

    public static JSONArray arrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray jsonArray = new JSONArray();
        for(int i=0; i < readableArray.size(); i++) {
            ReadableType valueType = readableArray.getType(i);
            switch (valueType){
                case Null:
                    jsonArray.put(JSONObject.NULL);
                    break;
                case Boolean:
                    jsonArray.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    jsonArray.put(readableArray.getInt(i));
                    break;
                case String:
                    jsonArray.put(readableArray.getString(i));
                    break;
                case Map:
                    jsonArray.put(mapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    jsonArray.put(arrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return jsonArray;
    }

    // TODO placehold for implementing Android M permissions request.  Just return true for now.
    private Boolean hasPermission(String permission) {
        return true;
    }
    // TODO placehold for implementing Android M permissions request.  Just return true for now.
    private void requestPermissions(int requestCode, String[] action) {

    }

    private void initializeLocationManager() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        launchIntent    = activity.getIntent();

        if (launchIntent.hasExtra("forceReload")) {
            activity.moveTaskToBack(true);
        }
        // Handle play-services connect errors.
        getAdapter().onPlayServicesConnectError((new TSPlayServicesConnectErrorCallback() {
            @Override
            public void onPlayServicesConnectError(int errorCode) {
                handlePlayServicesConnectError(errorCode);
            }
        }));
        initialized = true;
    }

    private ReadableMap setHeadlessJobService(ReadableMap config) {
        WritableMap myConfig = new WritableNativeMap();
        myConfig.merge(config);
        myConfig.putString("headlessJobService", getClass().getPackage().getName() + "." + JOB_SERVICE_CLASS);
        return myConfig;
    }

    private WritableMap getState() {
        try {
            return jsonToMap(TSConfig.getInstance(getReactApplicationContext()).toJson());
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    private BackgroundGeolocation getAdapter() {
        return BackgroundGeolocation.getInstance(getReactApplicationContext(), launchIntent);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        initialized = false;
        removeAllListeners();
    }
}
