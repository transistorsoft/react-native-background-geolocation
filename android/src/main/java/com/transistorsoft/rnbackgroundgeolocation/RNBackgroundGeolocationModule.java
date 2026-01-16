package com.transistorsoft.rnbackgroundgeolocation;

import com.transistorsoft.rnbackgroundgeolocation.NativeRNBackgroundGeolocationSpec;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
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
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.transistorsoft.locationmanager.config.TSConfig;
import com.transistorsoft.locationmanager.config.edit.Editor;
import com.transistorsoft.locationmanager.event.EventName;
import com.transistorsoft.locationmanager.event.FinishHeadlessTaskEvent;
import com.transistorsoft.locationmanager.event.HeadlessEvent;
import com.google.android.gms.common.GoogleApiAvailability;

import com.transistorsoft.locationmanager.adapter.BackgroundGeolocation;

import com.transistorsoft.locationmanager.adapter.callback.*;

import com.transistorsoft.locationmanager.data.LocationModel;

import com.transistorsoft.locationmanager.data.SQLQuery;
import com.transistorsoft.locationmanager.device.DeviceInfo;
import com.transistorsoft.locationmanager.event.ActivityChangeEvent;
import com.transistorsoft.locationmanager.event.AuthorizationEvent;
import com.transistorsoft.locationmanager.event.ConnectivityChangeEvent;
import com.transistorsoft.locationmanager.event.GeofenceEvent;
import com.transistorsoft.locationmanager.event.GeofencesChangeEvent;
import com.transistorsoft.locationmanager.event.HeartbeatEvent;
import com.transistorsoft.locationmanager.event.LocationEvent;
import com.transistorsoft.locationmanager.event.LocationProviderChangeEvent;
import com.transistorsoft.locationmanager.geofence.TSGeofence;
import com.transistorsoft.locationmanager.http.HttpResponse;
import com.transistorsoft.locationmanager.http.HttpService;
import com.transistorsoft.locationmanager.http.TSAuthorization;
import com.transistorsoft.locationmanager.http.TransistorAuthorizationToken;
import com.transistorsoft.locationmanager.location.TSCurrentPositionRequest;
import com.transistorsoft.locationmanager.location.TSWatchPositionRequest;
import com.transistorsoft.locationmanager.scheduler.TSScheduleManager;
import com.transistorsoft.locationmanager.scheduler.ScheduleEvent;
import com.transistorsoft.locationmanager.event.TerminateEvent;
import com.transistorsoft.locationmanager.util.Sensors;
import com.transistorsoft.locationmanager.logger.TSLog;
import com.transistorsoft.locationmanager.device.DeviceSettingsRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by chris on 2015-10-30.
 */
@ReactModule(name = "RNBackgroundGeolocation")
public class RNBackgroundGeolocationModule
        extends NativeRNBackgroundGeolocationSpec
        implements ActivityEventListener, LifecycleEventListener {

    private static final String TAG = "TSLocationManager";
    private static final String JOB_SERVICE_CLASS = "HeadlessTask";

    public static final String ACCESS_COARSE_LOCATION = Manifest.permission.ACCESS_COARSE_LOCATION;
    public static final String ACCESS_FINE_LOCATION = Manifest.permission.ACCESS_FINE_LOCATION;

    public static final int REQUEST_ACTION_START                = 1;
    public static final int REQUEST_ACTION_GET_CURRENT_POSITION = 2;
    public static final int REQUEST_ACTION_START_GEOFENCES      = 3;

    private static final String EVENT_WATCHPOSITION = "watchposition";

    private boolean mInitialized = false;
    private boolean mReady = false;

    // Map of event listener-counts
    private final HashMap<String, Integer> mListeners = new HashMap<>();
    private List<String> mEvents = new ArrayList<>();


    public RNBackgroundGeolocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);

        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.setUseCLLocationAccuracy(true);
        Editor ed = config.edit();
        //ed.geo().setUseCLLocationAccuracy(true);
        ed.app().setHeadlessJobService(getClass().getPackage().getName() + "." + JOB_SERVICE_CLASS);
        ed.commit();

        // These are the only events which can be subscribed to.
        mEvents.add(EventName.LOCATION);
        mEvents.add(EventName.MOTIONCHANGE);
        mEvents.add(EventName.ACTIVITYCHANGE);
        mEvents.add(EventName.PROVIDERCHANGE);
        mEvents.add(EventName.GEOFENCESCHANGE);
        mEvents.add(EventName.GEOFENCE);
        mEvents.add(EventName.HEARTBEAT);
        mEvents.add(EventName.HTTP);
        mEvents.add(EventName.SCHEDULE);
        mEvents.add(EventName.POWERSAVECHANGE);
        mEvents.add(EventName.CONNECTIVITYCHANGE);
        mEvents.add(EventName.ENABLEDCHANGE);
        mEvents.add(EventName.NOTIFICATIONACTION);
        mEvents.add(TSAuthorization.NAME);
    }

    @Override
    public void initialize() {
        // do nothing
    }
    @Override
    public String getName() {
        return "RNBackgroundGeolocation";
    }

    private void registerEvents() {
        BackgroundGeolocation adapter = getAdapter();

        adapter.onLocation(new LocationCallback());
        adapter.onMotionChange(new MotionChangeCallback());
        adapter.onActivityChange(new ActivityChangeCallback());
        adapter.onLocationProviderChange(new LocationProviderChangeCallback());
        adapter.onGeofencesChange(new GeofencesChangeCallback());
        adapter.onGeofence(new GeofenceCallback());
        adapter.onHeartbeat(new HeartbeatCallback());
        adapter.onHttp(new HttpResponseCallback());
        adapter.onSchedule(new ScheduleCallback());
        adapter.onPowerSaveChange(new PowerSaveChangeCallack());
        adapter.onConnectivityChange(new ConnectivityChangeCallback());
        adapter.onEnabledChange(new EnabledChangeCallback());
        adapter.onNotificationAction(new NotificationActionCallback());
        HttpService.getInstance(getReactApplicationContext()).onAuthorization(new AuthorizationCallback());
    }

    /**
     * location event callback
     */
    private class LocationCallback implements TSLocationCallback {
        @Override
        public void onLocation(LocationEvent locationEvent) {
            sendEvent(EventName.LOCATION, mapToWritableMap(locationEvent.toMap()));
        }

        @Override public void onError(Integer error) {
            onLocationError(error);
        }
    }

    /**
     * motionchange event callback
     */
    private class MotionChangeCallback implements TSLocationCallback {
        @Override
        public void onLocation(LocationEvent locationEvent) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("isMoving", locationEvent.isMoving());
            params.putMap("location", mapToWritableMap(locationEvent.toMap()));
            sendEvent(EventName.MOTIONCHANGE, params);
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
            sendEvent(EventName.ACTIVITYCHANGE, mapToWritableMap(event.toMap()));
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
            params.putInt("accuracyAuthorization", event.getAccuracyAuthorization());
            params.putInt("status", event.getStatus());
            sendEvent(EventName.PROVIDERCHANGE, params);
        }
    }

    /**
     * connectivitychange event callback
     */
    private class ConnectivityChangeCallback implements TSConnectivityChangeCallback {
        @Override public void onConnectivityChange(ConnectivityChangeEvent event) {
            WritableMap params = new WritableNativeMap();
            params.putBoolean("connected", event.hasConnection());
            sendEvent(EventName.CONNECTIVITYCHANGE, params);
        }
    }
    /**
     * enabledchange event callback
     */
    private class EnabledChangeCallback implements TSEnabledChangeCallback {
        @Override public void onEnabledChange(boolean enabled) {
            sendEvent(EventName.ENABLEDCHANGE, enabled);
        }
    }
    /**
     * notificationaction event callback
     */
    private class NotificationActionCallback implements TSNotificationActionCallback {
        @Override public void onClick(String buttonId) {
            sendEvent(EventName.NOTIFICATIONACTION, buttonId);
        }
    }
    /**
     * geofenceschange event callback
     */
    private class GeofencesChangeCallback implements TSGeofencesChangeCallback {
        @Override public void onGeofencesChange(GeofencesChangeEvent event) {
            // TODO
            WritableMap params = new WritableNativeMap();
            WritableArray on = new WritableNativeArray();
            WritableArray off = new WritableNativeArray();
            sendEvent(EventName.GEOFENCESCHANGE, mapToWritableMap(event.toMap()));
        }
    }

    /**
     * geofence event callback
     */
    private class GeofenceCallback implements TSGeofenceCallback {
        @Override public void onGeofence(GeofenceEvent event) {
            sendEvent(EventName.GEOFENCE, mapToWritableMap(event.toMap()));
        }
    }

    /**
     * heartbeat event callback
     */
    private class HeartbeatCallback implements TSHeartbeatCallback {
        @Override public void onHeartbeat(HeartbeatEvent event) {
            sendEvent(EventName.HEARTBEAT, mapToWritableMap(event.toMap()));
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
            sendEvent(EventName.HTTP, params);
        }
    }

    /**
     * schedule event callback
     */
    private class ScheduleCallback implements TSScheduleCallback {
        @Override public void onSchedule(ScheduleEvent event) {
            TSConfig config = TSConfig.getInstance(getReactApplicationContext());
            sendEvent(EventName.SCHEDULE, mapToWritableMap(config.toMap(false)));
        }
    }

    /**
    * powersavechange event callback
    */
    private class PowerSaveChangeCallack implements TSPowerSaveChangeCallback {
        @Override public void onPowerSaveChange(Boolean isPowerSaveMode) {
            sendEvent(EventName.POWERSAVECHANGE, isPowerSaveMode);
        }
    }

    /**
     * authorization event callback
     */
    private class AuthorizationCallback implements TSAuthorizationCallback {
        @Override public void onResponse(AuthorizationEvent event) {
            sendEvent(TSAuthorization.NAME, mapToWritableMap(event.toMap()));
        }
    }

    @Override
    public void onHostResume() {
        if (!mInitialized) {
            initializeLocationManager();
        }
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }        
        getAdapter().setActivity(activity);
    }

    @Override
    public void onHostPause() {
        Context context = getReactApplicationContext();
        TSConfig config = TSConfig.getInstance(context);
        if (config.getEnabled()) {
            TSScheduleManager.getInstance(context).oneShot(TerminateEvent.ACTION, 10000);
        }
    }
    @Override
    public void onHostDestroy() {
        mInitialized = false;
        mReady = false;
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
    public void ready(ReadableMap params, final Promise response) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());

        boolean reset = true;
        if (params.hasKey("reset")) {
            reset = params.getBoolean("reset");
        }

        if (mReady) {
            if (reset) {
                TSLog.w(TSLog.warn("#ready already called.  Redirecting to #setConfig"));
                setConfig(params, response);
            } else {
                TSLog.w(TSLog.warn("#ready already called.  Ignored config since reset: false"));
                response.resolve(getState());
            }
            return;
        }
        mReady = true;
        registerEvents();

        if (config.isFirstBoot()) {
            config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));
        } else {
            if (reset) {
                config.reset();
                config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));
            } else if (params.hasKey(TSAuthorization.NAME)) {
                ReadableMap readableMap = params.getMap(TSAuthorization.NAME);
                if (readableMap != null) {
                    Map<String, Object> options = readableMap.toHashMap();
                    // Have to be careful with expires:  ReadadbleMap#toHashMap converts it to Double.
                    options.put(TSAuthorization.FIELD_EXPIRES, readableMap.getInt(TSAuthorization.FIELD_EXPIRES));

                    Editor ed = config.edit();
                    ed.auth().setAuthorization(options);
                    ed.commit();
                }
            }
        }
        getAdapter().ready(new TSCallback() {
            @Override public void onSuccess() { response.resolve(getState()); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void configure(ReadableMap params, final Promise response){
        final TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.reset();
        config.updateWithJSONObject(mapToJson(setHeadlessJobService(params)));

        getAdapter().ready(new TSCallback() {
            @Override public void onSuccess() { response.resolve(getState()); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void setConfig(ReadableMap params, final Promise response) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.updateWithJSONObject(mapToJson(params));
        response.resolve(getState());
    }

    @ReactMethod
    public void reset(ReadableMap defaultConfig, final Promise response) {
        TSConfig config = TSConfig.getInstance(getReactApplicationContext());
        config.reset();
        config.updateWithJSONObject(mapToJson(setHeadlessJobService(defaultConfig)));
        response.resolve(getState());
    }

    @ReactMethod
    public void start(final Promise response) {
        getAdapter().start(new TSCallback() {
            @Override public void onSuccess() { response.resolve(getState()); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void startSchedule(Promise response) {
        if (getAdapter().startSchedule()) {
            response.resolve(getState());
        } else {
            response.reject("Failed to start schedule.  Did you configure a #schedule?");
        }
    }

    @ReactMethod
    public void stopSchedule(Promise response) {
        getAdapter().stopSchedule();
        response.resolve(getState());
    }

    @ReactMethod
    public void startGeofences(final Promise response) {
        getAdapter().startGeofences(new TSCallback() {
            @Override public void onSuccess() { response.resolve(getState()); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void stop(final Promise response) {
        getAdapter().stop(new TSCallback() {
            @Override public void onSuccess() { response.resolve(getState()); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void changePace(final boolean moving, final Promise response) {
        getAdapter().changePace(moving, new TSCallback() {
            @Override public void onSuccess() { response.resolve(moving); }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void getState(Promise response) {
        response.resolve(getState());
    }

    @ReactMethod
    public void getLocations(final Promise response) {
        getAdapter().getLocations(new TSGetLocationsCallback() {
            @Override public void onSuccess(List<LocationModel> records) {
                try {
                    JSONArray data = new JSONArray();
                    for (LocationModel location : records) {
                        data.put(location.json);
                    }
                    response.resolve(convertJsonToArray(data));
                } catch (JSONException e) {
                    e.printStackTrace();
                    response.reject(e.getMessage());
                }
            }
            @Override public void onFailure(Integer error) { response.reject(error.toString()); }
        });
    }

    @ReactMethod
    public void getCount(final Promise response) {
        response.resolve(getAdapter().getCount());
    }

    @ReactMethod
    public void insertLocation(ReadableMap params, final Promise response) {
        getAdapter().insertLocation(mapToJson(params), new TSInsertLocationCallback() {
            @Override public void onSuccess(String uuid) {
                response.resolve(uuid);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    // @deprecated -> #destroyLocations
    @ReactMethod
    public void clearDatabase(Promise response) {
        destroyLocations(response);
    }

    @ReactMethod
    public void destroyLocations(final Promise response) {
        getAdapter().destroyLocations(new TSCallback() {
            @Override public void onSuccess() { 
                response.resolve(true); 
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void destroyLocation(String uuid, final Promise response) {
        getAdapter().destroyLocation(uuid, new TSCallback() {
            @Override public void onSuccess() { response.resolve(true); }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void destroyLog(final Promise response) {
        getAdapter().destroyLog(new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void sync(final Promise response) {
        getAdapter().sync(new TSSyncCallback() {
            @Override public void onSuccess(List<LocationModel> records) {
                try {
                    JSONArray data = new JSONArray();
                    for (LocationModel location : records) {
                        data.put(location.json);
                    }
                    response.resolve(convertJsonToArray(data));
                } catch (JSONException e) {
                    response.reject(e.getMessage());
                }
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void getCurrentPosition(ReadableMap options, final Promise response) {
        TSCurrentPositionRequest.Builder builder = new TSCurrentPositionRequest.Builder(getReactApplicationContext());

        builder.setCallback(new TSLocationCallback() {
            @Override public void onLocation(LocationEvent event) {
                response.resolve(mapToWritableMap(event.toMap()));
            }
            @Override public void onError(Integer errorCode) {
                response.reject(errorCode.toString());
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
    public void watchPosition(ReadableMap options, final Promise response) {
        TSWatchPositionRequest.Builder builder = new TSWatchPositionRequest.Builder(getReactApplicationContext());

        builder.setCallback(new TSLocationCallback() {
            @Override public void onLocation(LocationEvent event) {
                sendEvent(EVENT_WATCHPOSITION, mapToWritableMap(event.toMap()));
            }
            @Override public void onError(Integer error) {
                response.reject(error.toString());
            }
        });

        if (options.hasKey("interval"))        { builder.setInterval((long) options.getInt("interval")); }
        if (options.hasKey("extras"))          { builder.setExtras(mapToJson(options.getMap("extras"))); }
        if (options.hasKey("persist"))         { builder.setPersist(options.getBoolean("persist")); }
        if (options.hasKey("desiredAccuracy")) { builder.setDesiredAccuracy(options.getInt("desiredAccuracy")); }

        getAdapter().watchPosition(builder.build());
        // TODO Implement watchId for android.
        response.resolve(-1);
    }
    @ReactMethod
    public void stopWatchPosition(double watchId, final Promise response) {
        // TODO Implement watchId for android.
        getAdapter().stopWatchPosition(new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }
    @ReactMethod
    public void getOdometer(final Promise response) {
        response.resolve(getAdapter().getOdometer());
    }
    @ReactMethod
    public void setOdometer(double value, final Promise response) {
        getAdapter().setOdometer(value, new TSLocationCallback() {
            @Override public void onLocation(LocationEvent event) {
                response.resolve(mapToWritableMap(event.toMap()));
            }
            @Override public void onError(Integer errorCode) {
                response.reject(errorCode.toString());
            }
        });
    }
    @ReactMethod
    public void addGeofence(ReadableMap options, final Promise response) {
        try {
             getAdapter().addGeofence(buildGeofence(options), new TSCallback() {
                 @Override public void onSuccess() { response.resolve(true); }
                 @Override public void onFailure(String error) { response.reject(error); }
             });
        } catch (TSGeofence.Exception e) {
            response.reject(e.getMessage());
        }
    }

    @ReactMethod
    public void addGeofences(ReadableArray data, final Promise response) {
        List<TSGeofence> geofences = new ArrayList<TSGeofence>();
        for (int n=0;n<data.size();n++) {
            try {
                geofences.add(buildGeofence(data.getMap(n)));
            } catch (TSGeofence.Exception e) {
                response.reject(e.getMessage());
                return;
            }
        }

        getAdapter().addGeofences(geofences, new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
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
        if (config.hasKey("vertices"))         {
            // Polygon Geofence
            List<List<Double>> vertices = new ArrayList<>();
            ReadableArray rows = config.getArray("vertices");
            if (rows != null) {
                for (int i = 0; i < rows.size(); i++) {
                    // Each row is a vertex of the Polygon.
                    ReadableArray record = rows.getArray(i);
                    List<Double> vertex = new ArrayList<>();
                    vertex.add(record.getDouble(0)); // latitude
                    vertex.add(record.getDouble(1)); // longitude
                    vertices.add(vertex);
                }
                builder.setVertices(vertices);
            }
        }
        return builder.build();
    }

    @ReactMethod
    public void removeGeofence(String identifier, final Promise response) {
        getAdapter().removeGeofence(identifier, new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void removeGeofences(final Promise response) {
        // TODO allow JS api to delete a list-of-geofences.
        // TODO accept WritableArray geofences from Client js API, allowing to remove a set of geofences
        List<String> identifiers = new ArrayList<>();
        getAdapter().removeGeofences(identifiers, new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void getGeofences(final Promise response) {
        getAdapter().getGeofences(new TSGetGeofencesCallback() {
            @Override public void onSuccess(List<TSGeofence> geofences) {
                WritableArray rs = new WritableNativeArray();
                for (TSGeofence geofence : geofences) {
                    rs.pushMap(mapToWritableMap(geofence.toMap()));
                }
                response.resolve(rs);
            }
            @Override public void onFailure(String error) { response.reject(error); }
        });
    }

    @ReactMethod
    public void getGeofence(String identifier, final Promise response) {
        getAdapter().getGeofence(identifier, new TSGetGeofenceCallback() {
            @Override public void onSuccess(TSGeofence geofence) {
                response.resolve(mapToWritableMap(geofence.toMap()));
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void geofenceExists(String identifier, final Promise response) {
        getAdapter().geofenceExists(identifier, new TSGeofenceExistsCallback() {
            @Override public void onResult(boolean exists) {
                 response.resolve(exists);
            }
        });
    }

    // TODO Rename #beginBackgroundTask -> #startBackgroundTask
    @ReactMethod
    public void beginBackgroundTask(final Promise response) {
        getAdapter().startBackgroundTask(new TSBackgroundTaskCallback() {
            @Override public void onStart(int taskId) {
                response.resolve(taskId);
            }
            @Override public void onCancel(int taskId) { } // NO IMPLEMENTATION
        });
    }

    // TODO Rename #finish -> #stopBackgroundTask
    @ReactMethod
    public void finish(double taskId, Promise response) {
        getAdapter().stopBackgroundTask((int) taskId);
        response.resolve(taskId);
    }

    /**
     * Called by user's registered HeadlessTask when they call BackgroundGeolocation.finishHeadlessTask(event.taskId)
     * @param taskId*
     */
    @ReactMethod
    public void finishHeadlessTask(double taskId, Promise response) {
        EventBus eventBus = EventBus.getDefault();
        if (!eventBus.hasSubscriberForEvent(HeadlessEvent.class)) {
            // This shouldn't happen.  In order for this method to even be called, it MUST have been executed from within the consumer's
            // registered HeadlessTask.  In order for that headless-task to have even be called, HeadlessEvent MUST have been registered with EventBus.
            String message = "finishHeadlessTask failed to find an EventBus subscriber for HeadlessEvent";
            TSLog.e(TSLog.warn(message));
            response.reject(message);
            return;
        }
        FinishHeadlessTaskEvent event = new FinishHeadlessTaskEvent(getReactApplicationContext(), (int) taskId);
        eventBus.post(event);
        response.resolve(true);
    }

    @ReactMethod
    public void getTransistorToken(String orgname, String username, String url, final Promise response) {

        TransistorAuthorizationToken.findOrCreate(getReactApplicationContext(), orgname, username, url, new TransistorAuthorizationToken.Callback() {
            @Override public void onSuccess(TransistorAuthorizationToken token) {
                response.resolve(mapToWritableMap(token.toMap()));
            }
            @Override public void onFailure(String error) {
                WritableMap params = new WritableNativeMap();
                params.putString("status", error);
                params.putString("message", error);
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void destroyTransistorToken(String url, final Promise response) {
        TransistorAuthorizationToken.destroyTokenForUrl(getReactApplicationContext(), url, new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void playSound(String soundId, Promise response) {
        getAdapter().startTone(soundId);
        response.resolve(true);
    }

    @ReactMethod
    public void getLog(ReadableMap params, final Promise response) {
        SQLQuery query = parseSQLQuery(params);

        TSLog.getLog(query, new TSGetLogCallback() {
            @Override public void onSuccess(String log) {
                response.resolve(log);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void emailLog(String email, ReadableMap params,  final Promise response) {
        SQLQuery query = parseSQLQuery(params);

        TSLog.emailLog(getCurrentActivity(), email, query, new TSEmailLogCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void uploadLog(String url, ReadableMap params,  final Promise response) {
        SQLQuery query = parseSQLQuery(params);

        TSLog.uploadLog(getReactApplicationContext(), url, query, new TSCallback() {
            @Override public void onSuccess() {
                response.resolve(true);
            }
            @Override public void onFailure(String error) {
                response.reject(error);
            }
        });
    }

    @ReactMethod
    public void log(String level, String message, Promise response) {
        TSLog.log(level, message);
        response.resolve(true); 
    }

    private SQLQuery parseSQLQuery(ReadableMap params) {
        SQLQuery query = SQLQuery.create();
        if (params.hasKey("start")) {
            Double start = params.getDouble("start");
            query.setStart(start.longValue());
        }
        if (params.hasKey("end")) {
            Double end = params.getDouble("end");
            query.setEnd(end.longValue());
        }
        if (params.hasKey("order")) {
            query.setOrder(params.getInt("order"));
        }
        if (params.hasKey("limit")) {
            query.setLimit(params.getInt("limit"));
        }
        return query;
    }

    @ReactMethod
    public void getSensors(Promise response) {
        Sensors sensors = Sensors.getInstance(getReactApplicationContext());
        WritableMap params = new WritableNativeMap();
        params.putString("platform", "android");
        params.putBoolean("accelerometer", sensors.hasAccelerometer());
        params.putBoolean("magnetometer", sensors.hasMagnetometer());
        params.putBoolean("gyroscope", sensors.hasGyroscope());
        params.putBoolean("significant_motion", sensors.hasSignificantMotion());
        response.resolve(params);
    }

    @ReactMethod
    public void getDeviceInfo(Promise response) {
        DeviceInfo deviceInfo = DeviceInfo.getInstance(getReactApplicationContext());

        WritableMap params = new WritableNativeMap();
        params.putString("manufacturer", deviceInfo.getManufacturer());
        params.putString("model", deviceInfo.getModel());
        params.putString("version", deviceInfo.getVersion());
        params.putString("platform", deviceInfo.getPlatform());
        params.putString("framework", "react-native");
        response.resolve(params);
    }

    @ReactMethod
    public void isPowerSaveMode(Promise response) {
        response.resolve(getAdapter().isPowerSaveMode());
    }

    @ReactMethod
    public void isIgnoringBatteryOptimizations(Promise response) {
        boolean isIgnoring = getAdapter().isIgnoringBatteryOptimizations();
        response.resolve(isIgnoring);
    }

    @ReactMethod
    public void requestSettings(ReadableMap args, Promise response) {
        try {
            String action = args.getString("action");
            DeviceSettingsRequest request = getAdapter().requestSettings(action);
            if (request != null) {
                response.resolve(mapToWritableMap(request.toMap()));
            } else {
                response.reject("Failed to find " + action + " screen for device " + Build.MANUFACTURER + " " + Build.MODEL + "@" + Build.VERSION.RELEASE);
            }
        } catch (Exception e) {
            response.reject(e.getMessage(), e);
        }
    }

    @ReactMethod
    public void showSettings(ReadableMap args, Promise response) {
        String action = args.getString("action");
        boolean didShow = getAdapter().showSettings(action);
        if (didShow) {
            response.resolve(true);
        } else {
            response.reject("Failed to find " + action + " screen for device " + Build.MANUFACTURER + " " + Build.MODEL + "@" + Build.VERSION.RELEASE);
        }
    }

    @ReactMethod
    public void getProviderState(Promise response) {
        response.resolve(mapToWritableMap(getAdapter().getProviderState().toMap()));
    }

    @ReactMethod
    public void requestPermission(final Promise response) {
        getAdapter().requestPermission(new TSRequestPermissionCallback() {
            @Override public void onSuccess(int status) {
                response.resolve(status);
            }
            @Override public void onFailure(int status) {
                response.reject("Permission request failed with status: " + status);
            }
        });
    }

    @ReactMethod
    public void requestTemporaryFullAccuracy(String purpose, final Promise response) {
        getAdapter().requestTemporaryFullAccuracy(purpose, new TSRequestPermissionCallback() {
            @Override public void onSuccess(int accuracyAuthorization) {
                response.resolve(accuracyAuthorization);
            }
            @Override public void onFailure(int accuracyAuthorization) {
                response.reject("Temporary full accuracy request failed with status: " + accuracyAuthorization);
            }
        });
    }

    @ReactMethod
    public void addListener(String event) {
        // Keep:  Required for RN built-in NativeEventEmitter calls.
    }

    @ReactMethod
    public void removeListeners(double count) {
        // Keep:  Required for RN built-in NativeEventEmitter calls.
    }

    private void removeAllListeners() {
        synchronized (mListeners) {
            mListeners.clear();
        }
        getAdapter().removeListeners();
    }

    private void onLocationError(Integer code) {
        WritableMap params = new WritableNativeMap();
        params.putInt("error", code);
        sendEvent(EventName.LOCATION, params);
    }

    private void handlePlayServicesConnectError(Integer errorCode) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        GoogleApiAvailability.getInstance().getErrorDialog(getCurrentActivity(), errorCode, 1001).show();
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void sendEvent(String eventName, String result) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, result);
    }

    private void sendEvent(String eventName, Boolean result) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, result);
    }

    @SuppressWarnings("unchecked")
    public static WritableMap mapToWritableMap(Map<String, ?> src) {
        WritableMap map = new WritableNativeMap();
        if (src == null) {
            return map;
        }

        for (Map.Entry<String, ?> entry : src.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value == null) {
                map.putNull(key);
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Long) {
                map.putDouble(key, ((Long) value).doubleValue());
            } else if (value instanceof Float) {
                map.putDouble(key, ((Float) value).doubleValue());
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else if (value instanceof Map) {
                map.putMap(key, mapToWritableMap((Map<String, ?>) value));
            } else if (value instanceof Iterable) {
                map.putArray(key, iterableToWritableArray((Iterable<Object>) value));
            } else if (value.getClass().isArray()) {
                List<Object> list = Arrays.asList((Object[]) value);
                map.putArray(key, iterableToWritableArray(list));
            } else {
                map.putString(key, value.toString());
            }
        }

        return map;
    }

    private static WritableArray iterableToWritableArray(Iterable<Object> src) {
        WritableArray array = new WritableNativeArray();
        if (src == null) return array;

        for (Object value : src) {
            if (value == null) {
                array.pushNull();
            } else if (value instanceof Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof Long) {
                array.pushDouble(((Long) value).doubleValue());
            } else if (value instanceof Float) {
                array.pushDouble(((Float) value).doubleValue());
            } else if (value instanceof Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String) {
                array.pushString((String) value);
            } else if (value instanceof Map) {
                array.pushMap(mapToWritableMap((Map<String, Object>) value));
            } else if (value instanceof Iterable) {
                array.pushArray(iterableToWritableArray((Iterable<Object>) value));
            } else if (value.getClass().isArray()) {
                List<Object> list = Arrays.asList((Object[]) value);
                array.pushArray(iterableToWritableArray(list));
            } else {
                array.pushString(value.toString());
            }
        }

        return array;
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
            } else if (value instanceof Float) {
                map.putDouble(key, ((Float) value).doubleValue());
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
                    jsonArray.put(readableArray.getDouble(i));
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

    private void initializeLocationManager() {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }
        BackgroundGeolocation adapter = getAdapter();
        adapter.setActivity(activity);
        // Handle play-services connect errors.
        adapter.onPlayServicesConnectError((new TSPlayServicesConnectErrorCallback() {
            @Override
            public void onPlayServicesConnectError(int errorCode) {
                handlePlayServicesConnectError(errorCode);
            }
        }));
        mInitialized = true;
    }

    private ReadableMap setHeadlessJobService(ReadableMap config) {
        WritableMap myConfig = new WritableNativeMap();
        myConfig.merge(config);
        myConfig.putString("headlessJobService", getClass().getPackage().getName() + "." + JOB_SERVICE_CLASS);
        return myConfig;
    }

    private WritableMap getState() {
        return mapToWritableMap(TSConfig.getInstance(getReactApplicationContext()).toMap(false));
    }

    private BackgroundGeolocation getAdapter() {
        return BackgroundGeolocation.getInstance(getReactApplicationContext());
    }

    @Override
    public void onCatalystInstanceDestroy() {
        mInitialized = false;
        removeAllListeners();
    }
}
