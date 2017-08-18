# :books: API Documentation
- :wrench: [Configuration Options](#wrench-configuration-options)
  + [Geolocation Options](#wrench-geolocation-options)
    * [Common](#geolocation-common-options)
    * [iOS](#geolocation-ios-options)
    * [Android](#geolocation-android-options)
  + [Activity Recognition Options](#wrench-activity-recognition-options)
    * [Common](#activity-recognition-common-options)
    * [iOS](#activity-recognition-ios-options)
  + [HTTP & Persistence Options](#wrench-http--persistence-options)
  + [Geofencing Options](#wrench-geofencing-options)
  + [Application Options](#wrench-application-options)
    * [Common](#application-common-options)
    * [iOS](#application-ios-options)
    * [Android](#application-android-options)
- :zap: [Events](#zap-events)
- :small_blue_diamond: [Methods](#large_blue_diamond-methods)
  + [Core API Methods](#small_blue_diamond-core-api-methods)
  + [HTTP & Persistence Methods](#small_blue_diamond-http--persistence-methods)
  + [Geofencing Methods](#small_blue_diamond-geofencing-methods)
  + [Logging Methods](#small_blue_diamond-logging-methods)
- :blue_book: Guides
  + [Philosophy of Operation](../../../wiki/Philosophy-of-Operation)
  + [Geofencing](geofencing.md)
  + [HTTP Features](http.md)
  + [Location Data Schema](../../../wiki/Location-Data-Schema)
  + [Debugging](../../../wiki/Debugging)

# :wrench: Configuration Options

The following **Options** can all be provided to the plugin's `#configure` method:

```javascript
BackgroundGeolocation.configure({
  desiredAccuracy: 0,
  distanceFilter: 50,
  .
  .
  .
}, function(state) {
  console.log('- BackgroundGeolocation configured and ready');
  if (!state.enabled) {  // <-- current state provided to callback
    BackgroundGeolocation.start();
  }
});

// Use #setConfig if you need to change options after you've executed #configure

BackgroundGeolocation.setConfig({
  desiredAccuracy: 10,
  distanceFilter: 10
}, function() {
  console.log('set config success');
}, function() {
  console.log('failed to setConfig');
});

```


## :wrench: Geolocation Options

### [Geolocation] Common Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`desiredAccuracy`](#config-integer-desiredaccuracy-0-10-100-1000-in-meters) | `Integer` | `0` | Specify the desired-accuracy of the geolocation system with 1 of 4 values, `0`, `10`, `100`, `1000` where `0` means **HIGHEST POWER, HIGHEST ACCURACY** and `1000` means **LOWEST POWER, LOWEST ACCURACY** |
| [`distanceFilter`](#config-integer-distancefilter) | `Integer` | `10` | The minimum distance (measured in meters) a device must move horizontally before an update event is generated. |
| [`disableElasticity`](#config-boolean-disableelasticity-false) | `Boolean` | `false` | Set true to disable automatic speed-based #distanceFilter elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km. |
| [`stopAfterElapsedMinutes`](#config-integer-stopafterelapsedminutes) | `Integer`  | `0`  | The plugin can optionally automatically stop tracking after some number of minutes elapses after the [`#start`](#startsuccessfn-failurefn) method was called. |
| [`stopOnStationary`](#config-boolean-stoponstationary) | `Boolean`  | `false`  | The plugin can optionally automatically stop tracking when the `stopTimeout` timer elapses. |
| [`desiredOdometerAccuracy`](#config-integer-desiredodometeraccuracy-100) | `Integer`  | `100`  | Location accuracy threshold in **meters** for odometer calculations. |


### [Geolocation] iOS Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`stationaryRadius`](#config-integer-stationaryradius-meters) | `Integer`  | `25`  | When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage. |
| [`useSignificantChangesOnly`](#config-boolean-usesignificantchangesonly-false) | `Boolean` | `false` | Defaults to `false`.  Set `true` in order to disable constant background-tracking and use only the iOS [Significant Changes API](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges). |
| [`locationAuthorizationRequest`](#config-string-locationauthorizationrequest-always) | `String` | `Always` | The desired iOS location-authorization request, either `Always` or `WhenInUse`. |
| [`locationAuthorizationAlert`](#config-object-locationauthorizationalert) | `Object` | `{}` | When you configure the plugin [`locationAuthorizationRequest`](config-string-locationauthorizationrequest-always) `Always` or `WhenInUse` and the user *changes* that value in the app's location-services settings or *disables* location-services, the plugin will display an Alert directing the user to the **Settings** screen. |

### [Geolocation] Android Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`locationUpdateInterval`](#config-integer-millis-locationupdateinterval) | `Integer` | `1000` | With [`distanceFilter: 0`](config-integer-distancefilter), Sets the desired interval for location updates, in milliseconds. |
| [`fastestLocationUpdateInterval`](#config-integer-millis-fastestlocationupdateinterval) | `Integer` | `10000` | Explicitly set the fastest interval for location updates, in milliseconds. |
| [`deferTime`](#config-integer-defertime) | `Integer` | `0` | Sets the maximum wait time in milliseconds for location updates to be delivered to your callback, when they will all be delivered in a batch.|


## :wrench: Activity Recognition Options

### [Activity Recognition] Common Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`activityRecognitionInterval`](#config-integer-millis-10000-activityrecognitioninterval) | `Integer` | `10000` | The desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of `0` will result in activity detections at the fastest possible rate. |
| [`stopTimeout`](#config-integer-minutes-stoptimeout) | `Integer` | `5`  | The number of **minutes** to wait before turning off location-services after the ActivityRecognition System (ARS) detects the device is `STILL` |
| [`minimumActivityRecognitionConfidence`](#config-integer-millis-minimumactivityrecognitionconfidence) | `Integer` | `75` | Each activity-recognition-result returned by the API is tagged with a "confidence" level expressed as a `%`.  You can set your desired confidence to trigger a state-change.|
| [`stopDetectionDelay`](#config-integer-minutes-stopdetectiondelay-0) | `Integer` | `0` | Number of **minute** to delay the stop-detection system from being activated.| 
| [`disableStopDetection`](#config-boolean-disablestopdetection-false) | `Boolean` | `false` | Disable accelerometer-based **Stop-detection System**. :warning: Not recommended|

### [Activity Recognition] iOS Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`activityType`](#config-string-activitytype-automotivenavigation-othernavigation-fitness-other) | `String` |  `Other` | Presumably, this affects ios GPS algorithm.  See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information |
| [`disableMotionActivityUpdates`](#config-boolean-disablemotionactivityupdates-false) | `Boolean` | `false` | Disable iOS motion-activity updates (eg: "walking", "in_vehicle").  This feature requires a device having the **M7** co-processor (ie: iPhone 5s and up). :warning: The plugin is **HIGHLY** optimized to use this for improved battery performance.  You are **STRONLY** recommended to **NOT** disable this. |


## :wrench: HTTP & Persistence Options

:blue_book: [HTTP Guide](http.md)

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`url`](#config-string-url-undefined) | `String` | `null` | Your server url where you wish to HTTP POST locations to |
| [`httpTimeout`](#config-integer-httptimeout-60000) | `Integer` | `60000` | HTTP request timeout in milliseconds. |
| [`params`](#config-object-params) | `Object` | `null` | Optional HTTP params sent along in HTTP request to above [`#url`](#config-string-url-undefined) |
| [`extras`](#config-object-extras) | `Object` | `null` | Optional meta-data to attach to *each* recorded location |
| [`headers`](#config-object-headers) | `Object` | `null` | Optional HTTP headers sent along in HTTP request to above [`#url`](#config-string-url-undefined) |
| [`method`](#config-string-method-post) | `String` | `POST` | The HTTP method.  Defaults to `POST`.  Some servers require `PUT`.|
| [`httpRootProperty`](#config-string-httprootproperty-location) | `String` | `location` | The root property of the JSON data where location-data will be appended. |
| [`locationTemplate`](#config-string-locationtemplate-undefined) | `String` | `undefined` | Optional custom location data schema (eg: `{ "lat:<%= latitude %>, "lng":<%= longitude %> }`|
| [`geofenceTemplate`](#config-string-geofencetemplate-undefined) | `String` | `undefined` | Optional custom geofence data schema (eg: `{ "lat:<%= latitude %>, "lng":<%= longitude %>, "geofence":"<%= geofence.identifier %>:<%= geofence.action %>" }`|
| [`autoSync`](#config-string-autosync-true) | `Boolean` | `true` | If you've enabeld HTTP feature by configuring an [`#url`](#config-string-url-undefined), the plugin will attempt to upload each location to your server **as it is recorded**.|
| [`autoSyncThreshold`](#config-integer-autosyncthreshold-0) | `Integer` | `0` | The minimum number of persisted records to trigger an [`#autoSync`](#config-string-autosync-true) action. |
| [`batchSync`](#config-string-batchsync-false) | `Boolean` | `false` | If you've enabled HTTP feature by configuring an [`#url`](config-string-url-undefined), [`batchSync: true`](#config-string-batchsync-false) will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request.|
| [`maxBatchSize`](#config-integer-maxbatchsize-undefined) | `Integer` | `-1` | If you've enabled HTTP feature by configuring an [`#url`](config-string-url-undefined) and [`batchSync: true`](#config-string-batchsync-false), this parameter will limit the number of records attached to each batch.|
| [`maxDaysToPersist`](#config-integer-maxdaystopersist-1) | `Integer` |  `1` |  Maximum number of days to store a geolocation in plugin's SQLite database.|
| [`maxRecordsToPersist`](#config-integer-maxrecordstopersist--1) | `Integer` |  `-1` |  Maximum number of records to persist in plugin's SQLite database.  Defaults to `-1` (no limit).  To disable persisting locations, set this to `0`|
| [`locationsOrderDirection`](#config-string-locationsorderdirection-asc) | `String` |  `ASC` |  Controls the order that locations are selected from the database (and synced to your server).  Defaults to ascending (`ASC`), where oldest locations are synced first.|


## :wrench: Application Options

### [Application] Common Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`stopOnTerminate`](#config-boolean-stoponterminate-true) | `Boolean` |  `true` | Set `false` to continue tracking after user teminates the app. |
| [`startOnBoot`](#config-boolean-startonboot-false) | `Boolean` | `false` | Set to `true` to enable background-tracking after the device reboots. |
| [`heartbeatInterval`](#config-integer-heartbeatinterval-undefined) | `Integer` | `60` | Rate in **seconds** to fire [`heartbeat`](#heartbeat) events. |
| [`schedule`](#config-array-schedule-undefined) | `Array` | `undefined` | Defines a schedule to automatically start/stop tracking at configured times |

### [Application] iOS Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`preventSuspend`](#config-boolean-preventsuspend-false) | `Boolean` | `false` | Enable this to prevent **iOS** from suspending your app in the background while in the **stationary state**.  Must be used in conjunction with a [`#heartbeatInterval`](config-integer-heartbeatinterval-undefined).|

### [Application] Android Options

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`foregroundService`](#config-boolean-foregroundservice-false) | `Boolean` | `false` | Set `true` to make the plugin *mostly* immune to OS termination due to memory pressure from other apps. |
| [`notificationPriority`](#config-integer-notificationpriority-notification_priority_default) | `Integer` | `NOTIFICATION_PRIORITY_DEFAULT` | Controls the priority of the `foregroundService` notification and notification-bar icon. |
| [`notificationTitle`](#config-string-notificationtitle-app-name) | `String` | "Your App Name" | When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  Defaults to the application name |
| [`notificationText`](#config-string-notificationtext-location-service-activated) | `String` |  "Location service activated" | When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.|
| [`notificationColor`](#config-string-notificationcolor-null) | `String` | `null` | When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), controls the color of the persistent notification in the Notification Bar. |
| [`notificationSmallIcon`](#config-string-notificationsmallicon-app-icon) | `String` |  Your App Icon | When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), controls your customize notification *small* icon.  Defaults to your application icon.|
| [`notificationLargeIcon`](#config-string-notificationlargeicon-undefined) | `String` |  `undefined` | When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), controls your customize notification *large* icon.  Defaults to `undefined`.|
| [`forceReloadOnMotionChange`](#config-boolean-forcereloadonmotionchange-false) | `Boolean` | `false` |  Launch your app whenever the [`#motionchange`](#motionchange) event fires. |
| [`forceReloadOnLocationChange`](#config-boolean-forcereloadonlocationchange-false) | `Boolean` | `false` |  Launch your app whenever the [`#location`](#location) event fires. |
| [`forceReloadOnGeofence`](#config-boolean-forcereloadongeofence-false) | `Boolean` | `false` |  Launch your app whenever the [`#geofence`](#geofence) event fires. |
| [`forceReloadOnHeartbeat`](#config-boolean-forcereloadonheartbeat-false) | `Boolean` | `false` |  Launch your app whenever the [`#heartbeat`](#heartbeat) event fires. |
| [`forceReloadOnSchedule`](#config-boolean-forcereloadonschedule-false) | `Boolean` | `false` |  Launch your app whenever a [`schedule`](#schedule) event fires. |
| [`forceReloadOnBoot`](#config-boolean-forcereloadonboot-false) | `Boolean` | `false` |  If the user reboots the device with the plugin configured for [`startOnBoot: true`](#config-boolean-startonboot-false), your will app will launch when the device is rebooted. |



## :wrench: Geofencing Options

:blue_book: [Geofencing Guide](geofencing.md)

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`geofenceProximityRadius`](#config-integer-meters-geofenceproximityradius-1000) | `Integer`  | `1000`  | Radius in **meters** to query for geofences within proximity. |
| [`geofenceInitialTriggerEntry`](#config-boolean-geofenceinitialtriggerentry-true) | `Boolean` | `true` | Set `false` to disable triggering a geofence immediately if device is already inside it.|


## :wrench: Logging & Debug Options

:blue_book: [Logging & Debugging Guide](../../../wiki/Debugging)

| Option      | Type      | Default   | Note                              |
|-------------|-----------|-----------|-----------------------------------|
| [`debug`](#config-boolean-debug-false) | `Boolean` | `false` | When enabled, the plugin will emit sounds & notifications for life-cycle events of background-geolocation |
| [`logLevel`](#config-integer-loglevel-5) | `Integer` | `LOG_LEVEL_VERBOSE` | Sets the verbosity of the plugin's logs from `LOG_LEVEL_OFF` to `LOG_LEVEL_VERBOSE` |
| [`logMaxDays`](#config-integer-logmaxdays-3) | `Integer` | `3` | Maximum days to persist a log-entry in database. |


# :zap: Events

| Event Name         | Description                                     |
|--------------------|-------------------------------------------------|
| [`location`](#location) | Fired whenever a new location is recorded. |
| [`motionchange`](#motionchange) | Fired when the device changes state between **stationary** and **moving** |
| [`activitychange`](#activitychange) | Fired when the activity-recognition system detects a *change* in detected-activity (`still, on_foot, in_vehicle, on_bicycle, running`) |
| [`providerchange`](#providerchange)| Fired when a change in the state of the device's **Location Services** has been detected.  eg: "GPS ON", "Wifi only".|
| [`geofence`](#geofence) | Fired when a geofence crossing event occurs. |
| [`geofenceschange`](#geofenceschange) | Fired when the list of monitored geofences within [`#geofenceProximityRadius`](#config-integer-meters-geofenceproximityradius-1000) changed|
| [`http`](#http) | Fired after a successful HTTP response. `response` object is provided with `status` and `responseText`. |
| [`heartbeat`](#heartbeat) | Fired each [`#heartbeatInterval`](#config-integer-heartbeatinterval-undefined) while the plugin is in the **stationary** state with.  Your callback will be provided with a `params {}` containing the last known `location {Object}` |
| [`schedule`](#schedule) | Fired when a schedule event occurs.  Your `callbackFn` will be provided with the current **`state`** Object. | 

### Adding event-listeners: `#on`

Event-listeners can be attached using the method **`#on`**, supplying the **Event Name** in the following table. **`#on`** accepts both a **`successFn`** and **`failureFn`**.

```javascript
BackgroundGeolocation.on("location", successFn, failureFn);
```

### Removing event-listeners: `#un`

Event-listeners are removed with the method **`#un`**.  You must supply a reference to the *exact* `successFn` reference used with the **`#on`** method:

```javascript
function onLocation(location) { 
  console.log('- location: ', location); 
}
function onLocationError(error) {
  console.log('- location error: ', error);
}
// Add a location listener
BackgroundGeolocation.on('location', onLocation, onLocationError);
.
.
.
// Remove a location listener supplying only the successFn (onLocation)
BackgroundGeolocation.un('location', onLocation);
```


# :large_blue_diamond: Methods

### :small_blue_diamond: Core API Methods

| Method Name      | Arguments       | Notes                                |
|------------------|-----------------|--------------------------------------|
| [`configure`](#configureconfig-successfn-failurefn) | `{config}`, `successFn`, `failureFn` | Initializes the plugin and configures its config options. The **`success`** callback will be executed after the plugin has successfully configured and provided with the current **`state`** `Object`. |
| [`setConfig`](#setconfigconfig-successfn-failurefn) | `{config}`, `successFn`, `failureFn` | Re-configure the plugin with new config options. |
| [`on`](#onevent-successfn-failurefn) | `event`,`successFn`,`failureFn` | Adds an event-listener |
| [`un`](#unevent-callbackfn) | `event`,`callbackFn`, | Removes an event-listener |
| [`start`](#startsuccessfn-failurefn) | `callbackFn`| Enable location tracking.  Supplied **`callbackFn`** will be executed when tracking is successfully engaged.  This is the plugin's power **ON** button. |
| [`stop`](#stopsuccessfn-failurefn) | `callbackFn` | Disable location tracking.  Supplied **`callbackFn`** will be executed when tracking is successfully halted.  This is the plugin's power **OFF** button. |
| [`getState`](#getstatesuccessfn) | `callbackFn` | Fetch the current-state of the plugin, including **`enabled`**, **`isMoving`**, as well as all other config params |
| [`getCurrentPosition`](#getcurrentpositionsuccessfn-failurefn-options) | `successFn`, `failureFn`, `{options}` | Retrieves the current position using maximum power & accuracy by fetching a number of samples and returning the most accurate to your **`callbackFn`**.|
| [`watchPosition`](#watchpositionsuccessfn-failurefn-options) | `successFn`, `failureFn`, `{options}` | Start a stream of continuous location-updates. |
| [`stopWatchPosition`](#stopwatchpositionsuccessfn-failurefn) | `successFn`, `failureFn` | Halt [`#watchPosition`](#watchpositionsuccessfn-failurefn-options) updates. |
| [`changePace`](#changepaceenabled-successfn-failurefn) | `Boolean`, `successFn` | Toggles the plugin's state between **stationary** and **moving**. |
| [`getOdometer`](#getodometercallbackfn-failurefn) | `callbackFn` | The plugin constantly tracks distance travelled. The supplied callback will be executed and provided with the **`distance`** (meters) as the 1st parameter.|
| [`setOdometer`](#setodometervalue-callbackfn-failurefn) | `Integer`, `callbackFn` | Set the `odometer` to *any* arbitrary value.  **NOTE** `setOdometer` will perform a `getCurrentPosition` in order to record to exact location where odometer was set; as a result, the `callback` signatures are identical to those of `getCurrentPosition`.|
| [`resetOdometer`](#resetodometercallbackfn-failurefn) | `callbackFn` | Reset the **odometer** to `0`.  Alias for [`setOdometer(0)`](#setodometervalue-callbackfn-failurefn) |
| [`startSchedule`](#startschedulecallbackfn) | `callbackFn` | If a [`schedule`](#config-array-schedule-undefined) was configured, this method will initiate that schedule.|
| [`stopSchedule`](#stopschedulecallbackfn) | `callbackFn` | This method will stop the Scheduler service.  Your **`callbackFn`** will be executed after the Scheduler has stopped |
| [`removeListeners`](#removelistenerssuccessfn-failurefn) | `none` | Remove all events-listeners registered with **`#on`** method |
| [`startBackgroundTask`](#startbackgroundtaskcallbackfn) | `callbackFn` | Sends a signal to the native OS that you wish to perform a long-running task.  The OS will not suspend your app until you signal completion with the **`#finish`** method.|
| [`finish`](#finishtaskid) | `taskId` | Sends a signal to the native OS the supplied **`taskId`** is complete and the OS may proceed to suspend your application if applicable.|


### :small_blue_diamond: HTTP & Persistence Methods

| Method Name      | Arguments       | Notes                                |
|------------------|-----------------|--------------------------------------|
| [`getLocations`](#getlocationssuccessfn-failurefn) | `callbackFn` | Fetch all the locations currently stored in native plugin's SQLite database. Your **`callbackFn`** will receive an **`Array`** of locations in the 1st parameter |
| [`getCount`](#getcountsuccessfn-failurefn) | `callbackFn` | Fetches count of SQLite locations table **`SELECT count(*) from locations`** |
| [`destroyLocations`](#destroylocationssuccessfn-failurefn) | `callbackFn` | Delete all records in plugin's SQLite database |
| [`sync`](#syncsuccessfn-failurefn) | `successFn`, `failureFn` | If the plugin is configured for HTTP with an [`#url`](#config-string-url-undefined) and [`#autoSync: false`](#config-string-autosync-true), this method will initiate POSTing the locations currently stored in the native SQLite database to your configured [`#url`](#config-string-url-undefined)|


### :small_blue_diamond: Geofencing Methods

| Method Name      | Arguments       | Notes                                |
|------------------|-----------------|--------------------------------------|
| [`startGeofences`](#startgeofencescallbackfn) | `callbackFn` | Engages the geofences-only **`trackingMode`**.  In this mode, no active location-tracking will occur -- only geofences will be monitored|
| [`addGeofence`](#addgeofenceconfig-successfn-failurefn) | `{config}`, `successFn`, `failureFn` | Adds a geofence to be monitored by the native plugin.|
| [`addGeofences`](#addgeofencesgeofences-successfn-failurefn) | `[geofences]`, `sucessFn`, `failureFn` | Adds a list geofences to be monitored by the native plugin. |
| [`removeGeofence`](#removegeofenceidentifier-successfn-failurefn) | `identifier`, `successFn`, `failureFn` | Removes a geofence identified by the provided `identifier` |
| [`removeGeofences`](#removegeofencescallbackfn-failurefn) | `successFn`, `failureFn` | Removes all geofences |
| [`getGeofences`](#getgeofencessuccessfn-failurefn) | `callbackFn` | Fetch the list of monitored geofences. |


### :small_blue_diamond: Logging Methods

| Method Name      | Arguments       | Notes                                |
|------------------|-----------------|--------------------------------------|
| [`setLogLevel`](#setloglevelloglevel-callbackfn) | `Integer`, `callbackFn` | Set the Log filter:  `LOG_LEVEL_OFF`, `LOG_LEVEL_ERROR`, `LOG_LEVEL_WARNING`, `LOG_LEVEL_INFO`, `LOG_LEVEL_DEBUG`, `LOG_LEVEL_VERBOSE`|
| [`getLog`](#getlogcallbackfn) | `callbackFn` | Fetch the entire contents of the current log database as a `String`.|
| [`destroyLog`](#destroylogsuccessfn-failurefn) | `callbackFn`, `failureFn` | Destroy the contents of the Log database. |
| [`emailLog`](#emaillogemail-callbackfn) | `email`, `callbackFn` | Fetch the entire contents of Log database and email it to a recipient using the device's native email client.|
| [`getSensors`](#getsensorscallbackfn-failurefn) | `callbackFn`, `failureFn` | Returns the presense of device sensors *accelerometer*, *gyroscope*, *magnetometer*, in addition to iOS/Android-specific sensors|
| [`logger.error`](#logger) | `message` | Record a :exclamation: log message into the plugin's log database. |
| [`logger.warn`](#logger) | `message` | Record a :warning: log message into the plugin's log database. |
| [`logger.debug`](#logger) | `message` | Record a :beetle: log message into the plugin's log database. |
| [`logger.info`](#logger) | `message` | Record a :information_source: log message into the plugin's log database. |
| [`logger.notice`](#logger) | `message` | Record a :large_blue_circle: log message into the plugin's log database. |
| [`logger.header`](#logger) | `message` | Record a header log message into the plugin's log database. |
| [`logger.on`](#logger) | `message` | Record a :tennis: log message into the plugin's log database. |
| [`logger.off`](#logger) | `message` | Record a :red_circle: log message into the plugin's log database. |
| [`logger.ok`](#logger) | `message` | Record a :white_check_mark: log message into the plugin's 
| [`playSound`](#playsoundsoundid) | `Integer` | Here's a fun one.  The plugin can play a number of OS system sounds for each platform.  For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html).  I offer this API as-is, it's up to you to figure out how this works. |


# :wrench: Geolocation Options

## :wrench: [Geolocation] Common Options

#### `@config {Integer} desiredAccuracy [0, 10, 100, 1000] in meters`

Specify the desired-accuracy of the geolocation system with 1 of 4 values, `0`, `10`, `100`, `1000` where `0` means **HIGHEST POWER, HIGHEST ACCURACY** and `1000` means **LOWEST POWER, LOWEST ACCURACY**

You may also use the following constants upon `BackgroundGeolocation`:

| Name                        | Value | Location Providers | Description |
|-----------------------------|-------|--------------------|-------------|
| `DESIRED_ACCURACY_HIGH`     | `0`   | GPS + Wifi + Cellular | Highest power; highest accuracy |
| `DESIRED_ACCURACY_MEDIUM`   | `10`  | Wifi + Cellular | Medium power; Medium accuracy; |
| `DESIRED_ACCURACY_LOW`      | `100` | Wifi (low power) + Cellular | Lower power; No GPS |
| `DESIRED_ACCURACY_VERY_LOW` | `1000`| Cellular only | Lowest power; lowest accuracy |

```javascript
BackgroundGeoloction.configure({
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH
});
```

:warning: Only **`DESIRED_ACCURACY_HIGH`** uses GPS.  `speed`, `heading` and `altitude` are available only from GPS.

:blue_book: For platform-specific information about location accuracy, see the corresponding API docs:

- [Android](https://developer.android.com/reference/com/google/android/gms/location/LocationRequest.html#PRIORITY_BALANCED_POWER_ACCURACY)
- [iOS](https://developer.apple.com/reference/corelocation/cllocationmanager/1423836-desiredaccuracy?language=objc) 

------------------------------------------------------------------------------

#### `@config {Integer} distanceFilter`

The minimum distance (measured in meters) a device must move horizontally before an update event is generated.

However, by default, **`distanceFilter`** is elastically auto-calculated by the plugin:  When speed increases, **`distanceFilter`** increases;  when speed decreases, so too does **`distanceFilter`**.  

:information_source: To disable this behaviour, configure [`disableElasticity: true`](#config-boolean-disableelasticity-false)

**`distanceFilter`** is auto calculated by rounding speed to the nearest `5 m/s` and adding **`distanceFilter`** meters for each `5 m/s` increment.

For example, at biking speed of 7.7 m/s with a configured **`distanceFilter: 30`**:

```
  rounded_speed = round(7.7, 5)
  => 10
  multiplier = rounded_speed / 5
  => 10 / 5 = 2
  adjusted_distance_filter = multiplier * distanceFilter
  => 2 * 30 = 60 meters
```

At highway speed of `27 m/s` with a configured `distanceFilter: 50`:

```
  rounded_speed = round(27, 5)
  => 30
  multiplier = rounded_speed / 5
  => 30 / 5 = 6
  adjusted_distance_filter = multiplier * distanceFilter
  => 6 * 50 = 300 meters
```

Note the following real example of background-geolocation on highway 101 towards San Francisco as the driver slows down as he runs into slower traffic (geolocations become compressed as distanceFilter decreases)

![distanceFilter at highway speed](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/distance-filter-highway.png)

Compare now background-geolocation in the scope of a city.  In this image, the left-hand track is from a cab-ride, while the right-hand track is walking speed.

![distanceFilter at city scale](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/distance-filter-city.png)

------------------------------------------------------------------------------

#### `@config {Boolean} disableElasticity [false]`

Defaults to **`false`**.  Set **`true`** to disable automatic, speed-based [`#distanceFilter`](#config-integer-distancefilter) elasticity.

------------------------------------------------------------------------------

#### `@config {Integer} stopAfterElapsedMinutes`

The plugin can optionally automatically stop tracking after some number of minutes elapses after the `#start` method was called.

```javascript
BackgroundGeolocation.configure({
  stopAfterElapsedMinutes: 30
}, function(state) {
  BackgroundGeolocation.start();  // <-- plugin will automatically #stop in 30 minutes
});
```

------------------------------------------------------------------------------

#### `@config {Boolean} stopOnStationary`

The plugin can optionally automatically stop tracking when the `stopTimeout` timer elapses.  For example, when the plugin first detects a `motionchange` into the "moving" state, the next time a `motionchange` event occurs into the "stationary" state, the plugin will have automatically called `#stop` upon itself.

:warning: `stopOnStationary` will **only** occur due to `stopTimeout` timer elapse.  It will **not** occur by manually executing `changePace(false)`.

```javascript
BackgroundGeolocation.configure({
  stopOnStationary: true
}, function(state) {
  BackgroundGeolocation.start();
});
```

------------------------------------------------------------------------------

#### `@config {Integer} desiredOdometerAccuracy [100]`

Specify an accuracy threshold in **meters** for odometer calculations.  Defaults to `100`.  If a location arrives having **`accuracy > desiredOdometerAccuracy`**, that location will not be used to update the odometer.  If you only want to calculate odometer from GPS locations, you could set **`desiredOdometerAccuracy: 10`**.  This will prevent odometer updates when a device is moving around indoors, in a shopping mall, for example.


## :wrench: [Geolocation] iOS Options

#### `@config {Integer} stationaryRadius (meters)`

When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.

Configuring **`stationaryRadius: 0`** has **NO EFFECT** (in fact the plugin enforces a minimum **``stationaryRadius``** of `25`).

The following image shows the typical distance iOS requires to detect exit of the **`stationaryRadius`**:

![](https://camo.githubusercontent.com/0230dfcb2457db3344f614bf5e3a641e61fb5c27/68747470733a2f2f7777772e64726f70626f782e636f6d2f732f7466746f327038767a30646e796b732f53637265656e73686f74253230323031372d30312d303725323031372e32362e35322e706e673f646c3d31)

:blue_book: For more information, see [Philosophy of Operation](../../../wiki/Philosophy-of-Operation)

:warning: iOS will not detect the exact moment the device moves out of the stationary-radius.  In normal conditions, it will typically take **~200 meters** before the plugin begins tracking.  

------------------------------------------------------------------------------

#### `@config {Boolean} useSignificantChangesOnly [false]`

Defaults to `false`.  Set `true` in order to disable constant background-tracking and use only the iOS [Significant Changes API](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc).  

:warning: If Apple has denied your application, refusing to grant your app the privelege of using the **`UIBackgroundMode: "location"`**, this can be a solution.  **NOTE** The Significant Changes API will report a location only every `500` to `1000` meters.  Many of the plugin's configuration parameters **will be ignored**, such as [`#distanceFilter`](#config-integer-distancefilter), [`#stationaryRadius`](#config-integer-stationaryradius-meters), [`#activityType`](#config-string-activitytype-automotivenavigation-othernavigation-fitness-other), etc.

------------------------------------------------------------------------------

#### `@config {Boolean} pausesLocationUpdatesAutomatically [true]`

:warning: This option should generally be left `undefined`.  You should only specifiy this option if you know *exactly* what you're doing.

The default behaviour of the plugin is to turn **off** location-services *automatically* when the device is detected to be stationary.  When set to `false`, location-services will **never** be turned off (and `disableStopDetection` will automatically be set to `true`) -- it's your responsibility to turn them off when you no longer need to track the device.  This feature should **not** generally be used.  `preventSuspend` will no longer work either.

------------------------------------------------------------------------------

#### `@config {String} locationAuthorizationRequest [Always]`

The desired iOS location-authorization request, either **`Always`** or **`WhenInUse`**.  **`locationAuthorizationRequest`** tells the plugin the mode it *expects* to be in &mdash; if the user changes this mode in their settings, the plugin will detect this (@see [`locationAuthorizationAlert`](#config-object-locationauthorizationalert)).  Defaults to **`Always`**.  **`WhenInUse`** will display a **blue bar** at top-of-screen informing user that location-services are on.

:warning: Configuring **`WhenInUse`** will disable many of the plugin's features, since iOS forbids any API which operates in the background to operate (such as **geofences**, which the plugin relies upon to automatically engage background tracking).

------------------------------------------------------------------------------

#### `@config {Object} locationAuthorizationAlert`

When you configure the plugin location-authorization `Always` or `WhenInUse` and the user changes the value in the app's location-services settings or disabled location-services, the plugin will display an Alert directing the user to the **Settings** screen.  This config allows you to configure all the Strings for that Alert popup and accepts an `{Object}` containing the following keys:

##### `@config {String} titleWhenOff [Location services are off]`  The title of the alert if user changes, for example, the location-request to `WhenInUse` when you requested `Always`.

##### `@config {String} titleWhenNotEnabled [Background location is not enabled]`  The title of the alert when user disables location-services or changes the authorization request to `Never`

##### `@config {String} instructions [To use background location, you must enable {locationAuthorizationRequest} in the Location Services settings]`  The body text of the alert.

##### `@config {String} cancelButton [Cancel]` Cancel button label

##### `@config {String} settingsButton [Settings]` Settings button label

![](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/docs-locationAuthorizationAlert.jpg)

```javascript
BackgroundGeolocation.configure({
  locationAuthorizationAlert: {
    titleWhenNotEnabled: "Yo, location-services not enabled",
    titleWhenOff: "Yo, location-services OFF",
    instructions: "You must enable 'Always' in location-services, buddy",
    cancelButton: "Cancel",
    settingsButton: "Settings"
  }
})
```


## :wrench: [Geolocation] Android Options

#### `@config {Integer millis} locationUpdateInterval`

:warning: To use **`locationUpdateInterval`** you must also configure [`distanceFilter: 0`](#config-integer-distancefilter).  **`distanceFilter`** *overrides* **`locationUpdateInterval`**.

Set the desired interval for active location updates, in milliseconds.

The location client will actively try to obtain location updates for your application at this interval, so it has a direct influence on the amount of power used by your application. Choose your interval wisely.

This interval is inexact. You may not receive updates at all (if no location sources are available), or you may receive them slower than requested. You may also receive them faster than requested (if other applications are requesting location at a faster interval). 

Applications with only the coarse location permission may have their interval silently throttled.

:blue_book: [Android docs](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setInterval(long))

```javascript
BackgroundGeolocation.configure({
  distanceFilter: 0,            // Must be 0 or locationUpdateInterval is ignored!
  locationUpdateInterval: 5000  // Get a location every 5 seconds
});
```

------------------------------------------------------------------------------

#### `@config {Integer millis} fastestLocationUpdateInterval`

Explicitly set the fastest interval for location updates, in milliseconds.

This controls the fastest rate at which your application will receive location updates, which might be faster than [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval) in some situations (for example, if other applications are triggering location updates).

This allows your application to passively acquire locations at a rate faster than it actively acquires locations, saving power.

Unlike [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval), this parameter is exact. Your application will never receive updates faster than this value.

If you don't call this method, a fastest interval will be set to **30000 (30s)**. 

An interval of `0` is allowed, but **not recommended**, since location updates may be extremely fast on future implementations.

If **`#fastestLocationUpdateInterval`** is set slower than [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval), then your effective fastest interval is [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval).

:blue_book: [Android docs](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setFastestInterval(long))

------------------------------------------------------------------------------

#### `@config {Integer} deferTime`

Defaults to `0` (no defer).  Sets the maximum wait time in milliseconds for location updates.  If you pass a value at least 2x larger than the interval specified with [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval), then location delivery may be delayed and multiple locations can be delivered at once. Locations are determined at the [`#locationUpdateInterval`](#config-integer-millis-locationupdateinterval) rate, but can be delivered in batch after the interval you set in this method. This can consume less battery and give more accurate locations, depending on the device's hardware capabilities. You should set this value to be as large as possible for your needs if you don't need immediate location delivery.

------------------------------------------------------------------------------

#### `@config {String} triggerActivities`

These are the comma-delimited list of [activity-names](https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity) returned by the `ActivityRecognition` API which will trigger a state-change from **stationary** to **moving**.  By default, the plugin will trigger on **any** of the **moving-states**:

| Activity Name  |
|----------------|
| `in_vehicle`   |
| `on_bicycle`   |
| `on_foot`      |
| `running`      |
| `walking`      |

If you wish, you can configure the plugin to only engage the **moving** state for vehicles by providing only `"in_vehicle"`.

```javascript
// Only trigger tracking for vehicles
BackgroundGeolocation.configure({
  triggerActivities: 'in_vehicle'
});

// Only trigger tracking for on_foot, walking and running
BackgroundGeolocation.configure({
  triggerActivities: 'on_foot, walking, running'
});
```

------------------------------------------------------------------------------

# :wrench: Activity Recognition Options

## :wrench: [Activity Recognition] Common Options

#### `@config {Integer millis} [10000] activityRecognitionInterval`

Defaults to `10000` (10 seconds).  The desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of 0 will result in activity detections at the fastest possible rate.

------------------------------------------------------------------------------

#### `@config {Integer millis} minimumActivityRecognitionConfidence` 

Each activity-recognition-result returned by the API is tagged with a "confidence" level expressed as a %.  You can set your desired confidence to trigger a [`motionchange`](#motionchange) event.  Defaults to **`75`**.

------------------------------------------------------------------------------

#### `@config {Integer minutes} stopTimeout`

When in the **moving** state, specifies the number of minutes to wait before turning off location-services and enter **stationary** state after the ActivityRecognition System detects the device is `STILL` (**Android:** defaults to 0, no timeout, **iOS:** defaults to 5min).  If you don't set a value, the plugin is eager to turn off the GPS ASAP.  An example use-case for this configuration is to delay GPS OFF while in a car waiting at a traffic light.

:blue_book: See [Philosophy of Operation](../../../wiki/Philosophy-of-Operation)

:warning: Setting a value > 15 min is **not** recommended, particularly for Android.

------------------------------------------------------------------------------

#### `@config {Boolean} disableStopDetection [false]`

**iOS**

Disables the accelerometer-based **Stop-detection System**.  When disabled, the plugin will use the default iOS behaviour of automatically turning off location-services when the device has stopped for exactly 15 minutes.  When disabled, you will no longer have control over [`#stopTimeout`](#config-integer-minutes-stoptimeout).

**iOS Stop-detection timing**.
![](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/ios-stop-detection-timing.png)

**Android**

Location-services **will never turn OFF** if you set this to **`true`**!  It will be purely up to you or the user to execute [`changePace(false)`](#changepaceenabled-successfn-failurefn) or [`#stop`](#stopsuccessfn-failurefn) to turn off location-services.

## :wrench: [Activity Recognition] iOS Options


#### `@config {String} activityType [AutomotiveNavigation, OtherNavigation, Fitness, Other]`

Presumably, this affects ios GPS algorithm.

:blue_book: [Apple docs](https://developer.apple.com/reference/corelocation/cllocationmanager/1620567-activitytype?language=objc).

------------------------------------------------------------------------------

#### `@config {Integer minutes} stopDetectionDelay [0]` 

Defaults to **`0`**.  Allows the stop-detection system to be delayed from activating.  When the stop-detection system *is* engaged, location-services will be turned **off** and only the accelerometer is monitored.  Stop-detection will only engage if this timer expires.  The timer is cancelled if any movement is detected before expiration.  If a value of **`0`** is specified, the stop-detection system will engage as soon as the device is detected to be stationary.

------------------------------------------------------------------------------

#### `@config {Boolean} disableMotionActivityUpdates [false]`

Defaults to **`false`**.  Set **`true`** to disable iOS [`CMMotionActivityManager`](https://developer.apple.com/reference/coremotion/cmmotionactivitymanager) updates (eg: `walking`, `in_vehicle`).  This feature requires a device having the **M7** co-processor (ie: iPhone 5s and up).

:information_source: This feature will ask the user for "Health updates" permission using the **[`MOTION_USAGE_DESCRIPTION`](https://github.com/transistorsoft/cordova-background-geolocation#configuring-the-plugin)**.  If you do not wish to ask the user for the "Health updates", set this option to `true`; However, you will no longer receive accurate activity data in the recorded locations.

:warning: The plugin is **HIGHLY** optimized for motion-activity-updates.  If you **do** disable this, the plugin *will* drain more battery power.  You are **STRONGLY** advised against disabling this.  You should explain to your users with the **[`MOTION_USAGE_DESCRIPTION`](https://github.com/transistorsoft/cordova-background-geolocation#configuring-the-plugin)**, for example:

> "Accelerometer use increases battery efficiency by intelligently toggling location-tracking"

# :wrench: Geofencing Options

#### `@config {Integer meters} geofenceProximityRadius [1000]`

Defaults to `1000` meters.  **@see** releated event [`geofenceschange`](#geofenceschange).  When using Geofences, the plugin activates only thoses in proximity (the maximim geofences allowed to be simultaneously monitored is limited by the platform, where **iOS** allows only 20 and **Android**.  However, the plugin allows you to create as many geofences as you wish (thousands even).  It stores these in its database and uses spatial queries to determine which **20** or **100** geofences to activate.

:blue_book: [See Geofencing Guide](geofencing.md)

:tv: [View animation of this behaviour](https://dl.dropboxusercontent.com/u/2319755/background-geolocation/images/background-geolocation-infinite-geofencing.gif)

![](https://dl.dropboxusercontent.com/u/2319755/background-geolocation/images/geofenceProximityRadius_iphone6_spacegrey_portrait.png)

------------------------------------------------------------------------------

#### `@config {Boolean} geofenceInitialTriggerEntry [true]`

Defaults to `true`.  Set `false` to disable triggering a geofence immediately if device is already inside it.


# :wrench: HTTP & Persistence Options


#### `@config {String} url [undefined]`

Your server **`url`** where you wish to HTTP POST location data to.

```javascript
BackgroundGeolocation.configure({
  url: 'http://my-server.com/locations'
});
```

:blue_book: See [HTTP Guide](http.md) for more information.

:warning: It is highly recommended to let the plugin manage uploading locations to your server, **particularly for Android** when configured with **`stopOnTerminate: false`**, since your Cordova app (where your Javascript lives) *will* terminate &mdash; only the plugin's native Android background service will continue to operate, recording locations and uploading to your server.  The plugin's native HTTP service *is* better at this task than Javascript Ajax requests, since the plugin will automatically retry on server failure.

------------------------------------------------------------------------------

#### `@config {Integer} httpTimeout [60000]`

HTTP request timeout in **milliseconds**.  The `http` **`failureFn`** will execute when an HTTP timeout occurs.  Defaults to `60000 ms` (1 minute).

```javascript
BackgroundGeolocation.on('http', function(request) {
  console.log('HTTP SUCCESS: ', response);
}, function(request) {
  console.log('HTTP FAILURE', response);
});

BackgroundGeolocation.configure({
  url: 'http://my-server.com/locations',
  httpTimeout: 3000
});
```

------------------------------------------------------------------------------

#### `@config {String} method [POST]`

The HTTP method to use when creating an HTTP request to your configured [`#url`](#config-string-url-undefined).  Defaults to `POST`.  Valid values are `POST`, `PUT` and `OPTIONS`.

```javascript
BackgroundGeolocation.configure({
  url: 'http://my-server.com/locations',
  method: 'PUT'
});
```

------------------------------------------------------------------------------

#### `@config {Object} params`

Optional HTTP **`params`** sent along in each HTTP request.

```javascript
BackgroundGeolocation.configure({
  url: 'http://my-server.com/locations',
  params: {
    user_id: 1234,
    device_id: 'abc123'
  }
});
```

```javascript
POST /locations
 {
  "location": {
    "coords": {
      "latitude": 45.51927004945047,
      "longitude": -73.61650072045029
      .
      .
      .
    }
  },
  "user_id": 1234,
  "device_id": 'abc123'
}

```

------------------------------------------------------------------------------

#### `@config {Object} headers`

Optional HTTP params sent along in HTTP request to above [`#url`](#config-string-url-undefined).

------------------------------------------------------------------------------

#### `@config {String} httpRootProperty [location]`

The root property of the JSON data where location-data will be placed.

:blue_book: See [HTTP Guide](http.md) for more information.

```json
{
    "rootProperty":{
        "coords": {
            "latitude":23.232323,
            "longitude":37.373737
        }
    }
}
```

You may also specify the character **`httpRootProperty:"."`** to place your data in the *root* of the JSON:

```json
{
    "coords": {
        "latitude":23.232323,
        "longitude":37.373737
    }
}
```

------------------------------------------------------------------------------

#### `@config {String} locationTemplate [undefined]`

Optional custom template for rendering `location` JSON request data in HTTP requests.  Evaulate variables in your **`locationTemplate`** using Ruby `erb`-style tags:

```erb
<%= variable_name %>
```

:blue_book: See [HTTP Guide](http.md) for more information.

```javascript
BackgroundGeolocation.configure({
  locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>,"event":"<%= event %>",isMoving:<%= isMoving %>}'
});

// Or use a compact [Array] template!
BackgroundGeolocation.configure({
  locationTemplate: '[<%=latitude%>, <%=longitude%>, "<%=event%>", <%=is_moving%>]'
})
```

:warning: If you've configured [`#extras`](#config-object-extras), these key-value pairs will be merged *directly* onto your location data.  Eg:

```javascript
BackgroundGeolocation.configure({
  httpRootProperty: 'data',
  locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>}',
  extras: {
    "foo":"bar"
  }
})
```

Will result in JSON:
```json
{
    "data": {
        "lat":23.23232323,
        "lng":37.37373737,
        "foo":"bar"
    }
}
```

**Template Tags**

| Tag | Type | Description |
|-----|------|-------------|
| `latitude` | `Float` ||
| `longitude` | `Float` ||
| `speed` | `Float` | Meters|
| `heading` | `Float` | Degress|
| `accuracy` | `Float` | Meters|
| `altitude` | `Float` | Meters|
| `altitude_accuracy` | `Float` | Meters|
| `timestamp` | `String` |ISO-8601|
| `uuid` | `String` |Unique ID|
| `event` | `String` |`motionchange|geofence|heartbeat`
| `odometer` | `Float` | Meters|
| `activity.type` | `String` | `still|on_foot|running|on_bicycle|in_vehicle|unknown`|
| `activity.confidence` | `Integer` | 0-100%|
| `battery.level` | `Float` | 0-100%|
| `battery.is_charging` | `Boolean` | Is device plugged in?|

------------------------------------------------------------------------------

#### `@config {String} geofenceTemplate [undefined]`

Optional custom template for rendering `geofence` JSON request data in HTTP requests.  The `geofenceTemplate` is similar to [`#locationTemplate`](#config-string-locationtemplate-undefined) with the addition of two extra `geofence.*` tags.

Evaulate variables in your **`geofenceTemplate`** using Ruby `erb`-style tags:

```erb
<%= variable_name %>
```

:blue_book: See [HTTP Guide](http.md) for more information.

```javascript
BackgroundGeolocation.configure({
  geofenceTemplate: '{ "lat":<%= latitude %>, "lng":<%= longitude %>, "geofence":"<%= geofence.identifier %>:<%= geofence.action %>" }'
});

// Or use a compact [Array] template!
BackgroundGeolocation.configure({
  geofenceTemplate: '[<%= latitude %>, <%= longitude %>, "<%= geofence.identifier %>", "<%= geofence.action %>"]'
})

```

**Template Tags**
The tag-list is identical to [`#locationTemplate`](#config-string-locationtemplate-undefined) with the addition of `geofence.identifier` and `geofence.action`.  

| Tag | Type | Description |
|-----|------|-------------|
| **`geofence.identifier`** | `String` | Which geofence?|
| **`geofence.action`** | `String` | `ENTER|EXIT`|
| `latitude` | `Float` ||
| `longitude` | `Float` ||
| `speed` | `Float` | Meters|
| `heading` | `Float` | Degress|
| `accuracy` | `Float` | Meters|
| `altitude` | `Float` | Meters|
| `altitude_accuracy` | `Float` | Meters|
| `timestamp` | `String` |ISO-8601|
| `uuid` | `String` |Unique ID|
| `event` | `String` |`motionchange|geofence|heartbeat`
| `odometer` | `Float` | Meters|
| `activity.type` | `String` | `still|on_foot|running|on_bicycle|in_vehicle|unknown`
| `activity.confidence` | `Integer` | 0-100%|
| `battery.level` | `Float` | 0-100%|
| `battery.is_charging` | `Boolean` | Is device plugged in?|

------------------------------------------------------------------------------

#### `@config {String} batchSync [false]`

Default is **`false`**.  If you've enabled HTTP feature by configuring an [`#url`](#config-string-url-undefined), [`batchSync: true`](#config-string-batchsync-false) will POST *all* the locations currently stored in native SQLite datbase to your server in a single HTTP POST request.  With [`batchSync: false`](#config-string-batchsync-false), an HTTP POST request will be initiated for **each** location in database.

------------------------------------------------------------------------------

#### `@config {Integer} maxBatchSize [undefined]`

If you've enabled HTTP feature by configuring an [`#url`](#config-string-url-undefined) with [`batchSync: true`](#config-string-batchsync-false), this parameter will limit the number of records attached to **each** batch request.  If the current number of records exceeds the **`maxBatchSize`**, multiple HTTP requests will be generated until the location queue is empty.

------------------------------------------------------------------------------

#### `@config {String} autoSync [true]`

Default is `true`.  If you've enabeld HTTP feature by configuring an [`#url`](#config-string-url-undefined), the plugin will attempt to HTTP POST each location to your server **as it is recorded**.  If you set [`autoSync: false`](#config-string-autosync-true), it's up to you to **manually** execute the [`#sync`](synccallbackfn-failurefn) method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute [`#sync`](synccallbackfn-failurefn)).

------------------------------------------------------------------------------

#### `@config {Integer} autoSyncThreshold [0]`

The minimum number of persisted records to trigger an [`autoSync`](#config-string-autosync-true) action.  If you configure a value greater-than **`0`**, the plugin will wait until that many locations are recorded before executing HTTP requests to your server through your configured [`#url`](#config-string-url-undefined).

------------------------------------------------------------------------------

#### `@config {Object} extras`

Optional arbitrary key/value `{}` to attach to each recorded location

Eg: Every recorded location will have the following **`extras`** appended:

:blue_book: See [HTTP Guide](http.md) for more information.

```javascript
BackgroundGeolocation.configure({
  url: 'http://my-server.com/locations',
  extras: {
    route_id: 1234
  },
  params: {
    device_id: 'abc123'
  }
});
```

```javascript
- POST /locations
{
  "device_id": "abc123" // <-- params appended to root of JSON
  "location": {
    "coords": {
      "latitude": 45.51927004945047,
      "longitude": -73.61650072045029,
      .
      .
      .
    },
    "extras": {  // <-- extras appended to *each* location
      "route_id": 1234
    }
  }
}

```

------------------------------------------------------------------------------

#### `@config {Integer} maxDaysToPersist [1]`

Maximum number of days to store a geolocation in plugin's SQLite database when your server fails to respond with **`HTTP 200 OK`**.  The plugin will continue attempting to sync with your server until **`maxDaysToPersist`** when it will give up and remove the location from the database.

------------------------------------------------------------------------------

#### `@config {Integer} maxRecordsToPersist [-1]`

Maximum number of records to persist in plugin's SQLite database.  Default `-1`
 means **no limit**.

------------------------------------------------------------------------------

#### `@config {String} locationsOrderDirection [ASC]`

Controls the order that locations are selected from the database (and synced to your server).  Defaults to ascending (`ASC`), where oldest locations are synced first.|


# :wrench: Application Options

## :wrench: [Application] Common Options

#### `@config {Boolean} stopOnTerminate [true]`

Defaults to **`true`**.  When the user terminates the app, the plugin will **stop** tracking.  Set this to **`false`** to continue tracking after application terminate.

If you *do* configure **`stopOnTerminate: false`**, your Javascript application **will** terminate at that time.  However, both Android and iOS differ in their behaviour *after* this point:

**iOS**

Before an iOS app terminates, the plugin will ensure that a **stationary geofence** is created around the last known position.  When the user moves beyond the stationary geofence (typically ~200 meters), iOS will completely reboot your application in the background, including your Javascript application and the plugin will resume tracking.  iOS maintains geofence monitoring at the OS level, in spite of application terminate / device reboot.

In the following image, imagine the user terminated the application at the **"red circle"** on the right then continued moving north-west, in the direction of the **red arrow**:  Once the device moves north-west by about 200 meters, exiting the stationary, iOS reboots the app and tracking resumes.

:information_source: [Demo Video of `stopOnTerminate: false`](https://youtu.be/rFNDIQLEouo?t=69)

![](https://camo.githubusercontent.com/0230dfcb2457db3344f614bf5e3a641e61fb5c27/68747470733a2f2f7777772e64726f70626f782e636f6d2f732f7466746f327038767a30646e796b732f53637265656e73686f74253230323031372d30312d303725323031372e32362e35322e706e673f646c3d31)

**Android**

Unlike iOS, the Android plugin's tracking will **not** pause at all when user terminates the app.  However, only the plugin's native background service continues to operate, **"headless"** (in this case, you should configure an [`#url`](#config-string-url-undefined) in order for the background-service to continue uploading locations to your server).

------------------------------------------------------------------------------

#### `@config {Boolean} startOnBoot [false]`

Defaults to **`false`**.  Set **`true`** to engage background-tracking after the device reboots.

**iOS** 

iOS cannot **immediately** engage tracking after a device reboot.  Just like [`stopOnTerminate:false`](config-boolean-stoponterminate-true-ios), iOS will not re-boot your app until the device moves beyond the **stationary geofence** around the last known location.  In addition, iOS subscribes to "background-fetch" events, which typically fire about every 15 minutes &mdash; these too are capable of rebooting your app after a device reboot.

**Android**

Android will reboot the plugin's background-service *immediately* after device reboot.  However, just like [`stopOnTerminate:false`](config-boolean-stoponterminate-true-android), the plugin will be running "headless" without your Application code.  If you wish for your Application code to boot as well, you may configure [`forceReloadOnBoot: true`](#config-boolean-forcereloadonboot-false)

------------------------------------------------------------------------------

#### `@config {Integer} heartbeatInterval [undefined]`

Controls the rate (in seconds) the [`heartbeat`](#heartbeat) event will fire.  The plugin will **not** provide any updated locations to your **`callbackFn`**, since it will provide only the last-known location.  If you wish for an updated location in your **`callbackFn`**, it's up to you to request one with [`#getCurrentPosition`](#getcurrentpositionsuccessfn-failurefn-options).

:warning: On **iOS** the **`heartbeat`** event will fire only when configured with [`preventSuspend: true`](config-boolean-preventsuspend-false)

```javascript
BackgroundGeolocation.on('heartbeat', function(params) {
  var lastKnownLocation = params.location;
  console.log('- heartbeat: ', lastKnownLocation);
  // Or you could request a new location
  BackgroundGeolocation.getCurrentPosition(function(location) {
    console.log('- current position: ', location);
  });
});
```

------------------------------------------------------------------------------

#### `@config {Array} schedule [undefined]`

Provides an automated schedule for the plugin to start/stop tracking at pre-defined times.  The format is cron-like:

```javascript
  "{DAY(s)} {START_TIME}-{END_TIME}"
```

The `START_TIME`, `END_TIME` are in **24h format**.  The `DAY` param corresponds to the `Locale.US`, such that **Sunday=1**; **Saturday=7**).  You may configure a single day (eg: `1`), a comma-separated list-of-days (eg: `2,4,6`) or a range (eg: `2-6`), eg:


```javascript
BackgroundGeolocation.configure({
  .
  .
  .
  schedule: [
    '1 17:30-21:00',   // Sunday: 5:30pm-9:00pm
    '2-6 9:00-17:00',  // Mon-Fri: 9:00am to 5:00pm
    '2,4,6 20:00-00:00',// Mon, Web, Fri: 8pm to midnight (next day)
    '7 10:00-19:00'    // Sun: 10am-7pm
  ]
}, function(state) {
  // Start the Scheduler
  BackgroundGeolocation.startSchedule(function() {
    console.info('- Scheduler started');
  });
});

// Listen to "schedule" events:
BackgroundGeolocation.on('schedule', function(state) {
  console.log('- Schedule event, enabled:', state.enabled);

  if (!state.schedulerEnabled) {
    BackgroundGeolocation.startSchedule();
  }
});

// Later when you want to stop the Scheduler (eg: user logout)
BackgroundGeolocation.stopSchedule(function() {
  console.info('- Scheduler stopped');
  // You must explicitly stop tracking if currently enabled
  BackgroundGeolocation.stop();
});

// Or modify the schedule with usual #setConfig method
BackgroundGeolocation.setConfig({
  schedule: [
    '1-7 9:00-10:00',
    '1-7 11:00-12:00',
    '1-7 13:00-14:00',
    '1-7 15:00-16:00',
    '1-7 17:00-18:00',
    '2,4,6 19:00-22:00'
  ]
});
```

##### Literal Dates

The schedule can also be configured with a literal start date of the form:

```
  "yyyy-mm-dd HH:mm-HH:mm"
```

eg:

```javascript
BackgroundGeolocation.configure({
  schedule: [
    "2018-01-01 09:00-17:00"
  ]

})
```

Or **two** literal dates to specify both a start **and** stop date (note the format here is a bit ugly):

```
  "yyyy-mm-dd-HH:mm yyyy-mm-dd-HH:mm"
```

```javascript
schedule: [
    "2018-01-01-09:00 2019-01-01-17:00"  // <-- track for 1 year
  ]
```


**iOS**

iOS **cannot** evaluate the Schedule at the *exact* time you configure &mdash; it can only evaluate the **`schedule`** *periodically*, whenever your app comes alive.  When the app is running in a scheduled **off** period, iOS will continue to monitor the low-power, [significant location changes API (SLC)](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc) in order to ensure periodic schedule evaluation.  **SLC** is required in order guarantee periodic schedule-evaluation when you're configured [`stopOnTerminate: false`](#config-boolean-stoponterminate-true), since the [iOS Background Fetch]() is halted if user *manually* terminates the app.  **SLC** will awaken your app whenever a "significant location change" occurs, typically every `1000` meters.  If the schedule is currently in an **off** period, this location will **not** be persisted nor will it be sent to the [`location`](#location) event &mdash; only the **`schedule`** will be evaluated.

When a **`schedule`** is provided on iOS, it will be evaluated in the following cases:

- Application `pause` / `resume` events.
- Whenever a location is recorded (including **SLC**)
- Background fetch event

**Android**

The Android Scheduler uses [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager.html#setExactAndAllowWhileIdle(int, long, android.app.PendingIntent)) and *typically* operates on-the-minute.

------------------------------------------------------------------------------

## :wrench: [Application] iOS Options

#### `@config {Boolean} preventSuspend [false]`

Defaults to **`false`**.  Set **`true`** to prevent **iOS** from suspending after location-services have been switched off while your application is in the background.  Must be used in conjunction with a [`heartbeatInterval`](config-integer-heartbeatinterval-undefined).

:warning: **`preventSuspend: true`** should **only** be used in **very** specific use-cases and should typically **not** be used as it *will* have a **very noticable impact on battery performance.**  You should carefully manage **`preventSuspend`**, engaging it for controlled periods-of-time.  You should **not** expect to run your app in this mode 24 hours / day, 7 days-a-week.

## :wrench: [Application] Android Options


#### `@config {Boolean} forceReloadOn* [false]`

When the user terminates your Android app with **BackgroundGeolocation** configured with [`stopOnTerminate: false`](#config-boolean-stoponterminate-true), the foreground `MainActivity` (where your Javascript app lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background-service *can* optionally **re-launch** your foreground application.

:warning: When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.

To "force reload" your application, set any of the following options to **`true`**:

##### `@config {Boolean} forceReloadOnMotionChange [false]`

Launch your app whenever the [`#motionchange`](#motionchange) event fires.

------------------------------------------------------------------------------

##### `@config {Boolean} forceReloadOnLocationChange [false]`

Launch your app whenever the [`#location`](#location) event fires.

------------------------------------------------------------------------------

##### `@config {Boolean} forceReloadOnGeofence [false]`

Launch your app whenever the [`#geofence`](#geofence) event fires.

------------------------------------------------------------------------------

##### `@config {Boolean} forceReloadOnHeartbeat [false]`

Launch your app whenever the [`#heartbeat`](#heartbeat) event fires.

------------------------------------------------------------------------------

##### `@config {Boolean} forceReloadOnSchedule [false]`

Launch your app whenever a [`schedule`](#schedule) event fires.

------------------------------------------------------------------------------

##### `@config {Boolean} forceReloadOnBoot [false]`

If the user reboots the device with the plugin configured for [`startOnBoot: true`](#config-boolean-startonboot-false), your will app will launch when the device is rebooted.

------------------------------------------------------------------------------

#### `@config {Boolean} foregroundService [false]`

Defaults to **`false`**.  When the Android OS is under memory pressure from other applications (eg: a phone call), the OS can and will free up memory by terminating other processes and scheduling them for re-launch when memory becomes available.  If you find your tracking being **terminated unexpectedly**, *this* is why.

If you set this option to **`true`**, the plugin will run its Android service in the foreground, **supplying the ongoing notification to be shown to the user while in this state**.  Running as a foreground-service makes the tracking-service **much** more inmmune to OS killing it due to memory/battery pressure.  By default services are background, meaning that if the system needs to kill them to reclaim more memory (such as to display a large page in a web browser).

:information_source: See related config options [`notificationTitle`](#config-string-notificationtitle-app-name), [`notificationText`](#config-string-notificationtext-location-service-activated) & [`notificationColor`](#config-string-notificationcolor-null)

:blue_book: For more information, see the [Android Service](https://developer.android.com/reference/android/app/Service.html#startForeground(int,%20android.app.Notification)) docs.

------------------------------------------------------------------------------


#### `@config {Integer} notificationPriority [NOTIFICATION_PRIORITY_DEFAULT]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This will control the **priority** of that notification as well as the position of the notificaiton-bar icon.

:information_source: To completely **hide** the icon in the notification-bar, use `NOTIFICATION_PRIORITY_MIN`

The following `notificationPriority` values defined as **constants** on the `BackgroundGeolocation` object:

| Value                           | Description                           |
|---------------------------------|---------------------------------------|
| `NOTIFICATION_PRIORITY_DEFAULT` | Notification weighted to top of list; notification-bar icon weighted left                                       |
| `NOTIFICATION_PRIORITY_HIGH`    | Notification **strongly** weighted to top of list; notification-bar icon **strongly** weighted to left              |
| `NOTIFICATION_PRIORITY_LOW`     | Notification weighted to bottom of list; notification-bar icon weighted right                                      |
| `NOTIFICATION_PRIORITY_MAX`     | Same as `NOTIFICATION_PRIORITY_HIGH`  |
| `NOTIFICATION_PRIORITY_MIN`     | Notification **strongly** weighted to bottom of list; notification-bar icon **hidden**                          |

```javascript
BackgroundGeolocation.configure({
  foregroundService: true,
  notificationPriority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN
});
```

------------------------------------------------------------------------------


#### `@config {String} notificationTitle [App name]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This will configure the **title** of that notification.  Defaults to the application name.

------------------------------------------------------------------------------

#### `@config {String} notificationText [Location service activated]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This will configure the **text** of that notification.  Defaults to "Location service activated".

------------------------------------------------------------------------------

#### `@config {String} notificationColor [null]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This will configure the **color** of the notification icon (API >= 21).Supported formats are: 
- `#RRGGBB` 
- `#AARRGGBB`

------------------------------------------------------------------------------

#### `@config {String} notificationSmallIcon [app icon]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This allows you customize that icon.  Defaults to your application icon.  **NOTE** You must specify the **`type`** (`drawable|mipmap`) of resource you wish to use in the following format:

`{type}/icon_name`, 

:warning: Do not append the file-extension (eg: `.png`)

eg:

```javascript
// 1. drawable
BackgroundGeolocation.configure({
  notificationSmallIcon: "drawable/my_custom_notification_small_icon"
});

// 2. mipmap
BackgroundGeolocation.configure({
  notificationSmallIcon: "mipmap/my_custom_notification_small_icon"
});
```

------------------------------------------------------------------------------

#### `@config {String} notificationLargeIcon [undefined]`

When running the service with [`foregroundService: true`](#config-boolean-foregroundservice-false), Android requires a persistent notification in the Notification Bar.  This allows you customize that icon.  Defaults to `undefined`.  **NOTE** You must specify the **`type`** (`drawable|mipmap`) of resource you wish to use in the following format:

:warning: Do not append the file-extension (eg: `.png`)

`{type}/icon_name`, 

eg:

```javascript
// 1. drawable
BackgroundGeolocation.configure({
  notificationLargeIcon: "drawable/my_custom_notification_large_icon"
});

// 2. mipmap
BackgroundGeolocation.configure({
  notificationLargeIcon: "mipmap/my_custom_notification_large_icon"
});
```

------------------------------------------------------------------------------


# :wrench: Logging & Debug Options

:blue_book: [Logging & Debugging Guide](../../../wiki/Debugging)

#### `@config {Boolean} debug [false]`

Defaults to **`false`**.  When set to **`true`**, the plugin will emit debugging sounds and notifications for life-cycle events of background-geolocation!

**iOS**:  In you wish to hear debug sounds in the background, you must manually enable the **[x] Audio and Airplay** background mode in *Background Capabilities* of XCode.

![](https://dl.dropboxusercontent.com/s/iplaxheoq63oul6/Screenshot%202017-02-20%2012.10.57.png?dl=1)

:blue_book: See [Debugging Sounds](../../../wiki/Debug-Sounds)

------------------------------------------------------------------------------

#### `@config {Integer} logLevel [5]`

BackgroundGeolocation contains powerful logging features.  By default, the plugin boots with a value of **`LOG_LEVEL_VERBOSE`**, storing **3 days** worth of logs (configurable with [`logMaxDays`](config-integer-logmaxdays-3)) in its SQLite database.

The following log-levels are defined as **constants** on the `BackgroundGeolocation` object:

| logLevel | Label              |
|----------|--------------------|
|`0`       |`LOG_LEVEL_OFF`     |
|`1`       |`LOG_LEVEL_ERROR`   |
|`2`       |`LOG_LEVEL_WARNING` |
|`3`       |`LOG_LEVEL_INFO`    |
|`4`       |`LOG_LEVEL_DEBUG`   |
|`5`       |`LOG_LEVEL_VERBOSE` |

Eg:
```javascript
BackgroundGeolocation.configure({
  logLevel: BackgroundGeolocation.LOG_LEVEL_WARNING
});
```

:information_source: To retrieve the plugin's logs, see [`getLog`](#getlogcallbackfn) & [`emailLog`](#emaillogemail-callbackfn).

:warning: When submitting your app to production, take care to configure the **`logLevel`** appropriately (eg: **`LOG_LEVEL_ERROR`**)

------------------------------------------------------------------------------


#### `@config {Integer} logMaxDays [3]`

Maximum number of days to persist a log-entry in database.  Defaults to **`3`** days.

------------------------------------------------------------------------------

# :zap: Events

### `location`

Your **`successFn`** will be called with the following signature whenever a new location is recorded:

#### `successFn` Paramters

##### `@param {Object} location` The Location data (@see Wiki for [Location Data Schema](../../../wiki/Location-Data-Schema))

:information_source: When performing a `motionchange` or `getCurrentPosition`, the plugin requests **multiple** location *samples* in order to record the most accurate location possible.  These *samples* are **not** persisted to the database but they will be provided to your `location` listener, for your convenience, since it can take some seconds for the best possible location to arrive.  For example, you might use these samples to progressively update the user's position on a map.  You can detect these *samples* in your `callbackFn` via `location.sample === true`.  If you're manually `POST`ing location to your server, you should ignore these locations.

```javascript
BackgroundGeolocation.on('location', function(location) {
  var coords    = location.coords,
    timestamp   = location.timestamp
    latitude    = coords.latitude,
    longitude   = coords.longitude,
    speed       = coords.speed;

  console.log("- Location: ", timestamp, latitude, longitude, speed);
}, function(errorCode) {
  console.warn("- Location error: ", errorCode);
});
```

#### `failureFn` Paramters

##### `@param {Integer} errorCode`

| Code  | Error                       |
|-------|-----------------------------|
| 0     | Location unknown            |
| 1     | Location permission denied  |
| 2     | Network error               |
| 408   | Location timeout            |

------------------------------------------------------------------------------

### `motionchange`

Your **`callbackFn`** will be executed each time the device has changed-state between **MOVING** or **STATIONARY**.  The **`callbackFn`** will be provided with the following parameters:

##### `@param {Boolean} isMoving`
##### `@param {Object} location` The location at the state-change.

```javascript
BackgroundGeolocation.on('motionchange', function(isMoving, location) {
  if (isMoving) {
      console.log('Device has just started MOVING', location);
  } else {
      console.log('Device has just STOPPED', location);
  }  
});
```

------------------------------------------------------------------------------


### `activitychange`

Your **`callbackFn`** will be executed each time the activity-recognition system receives an event (`still, on_foot, in_vehicle, on_bicycle, running`).  

It will be provided an event `{Object}` containing the following parameters:

##### `@param {String} activity [still|on_foot|running|on_bicycle|in_vehicle]`
##### `@param {Integer} confidence [0-100%]`

```javascript
BackgroundGeolocation.on('activitychange', function(event) {
  console.log('- Activity changed: ', event.activity, event.confidence);
});
```

------------------------------------------------------------------------------


### `providerchange`

Your **`callbackFn`** fill be executed when a change in the state of the device's **Location Services** has been detected.  eg: "GPS ON", "Wifi only".  Your **`callbackFn`** will be provided with an **`{Object} provider`** containing the following properties

#### `callbackFn` Paramters

##### `@param {Boolean} enabled` Whether location-services is enabled
##### `@param {Boolean} gps` Whether gps is enabled
##### `@param {Boolean} network` Whether wifi geolocation is enabled.
##### `@param {Integer} status` Location authorization status.

| Name | Value | Platform |
|------|-------|----------|
| `AUTHORIZATION_STATUS_NOT_DETERMINED` | `0` | iOS only |
| `AUTHORIZATION_STATUS_RESTRICTED` | `1` | iOS only |
| `AUTHORIZATION_STATUS_DENIED` | `2` | iOS & Android |
| `AUTHORIZATION_STATUS_ALWAYS` | `3` | iOS & Android |
| `AUTHORIZATION_STATUS_WHEN_IN_USE` | `4` | iOS only |

:information_source: When Android location permission is **granted**, `status == AUTHORIZATION_STATUS_ALWAYS`, otherwise, `AUTHORIZATION_DENIED`.

```javascript
BackgroundGeolocation.on('providerchange', function(provider) {
  console.log('- Provider Change: ', provider);
  console.log('  enabled: ', provider.enabled);
  console.log('  gps: ', provider.gps);
  console.log('  network: ', provider.network);
  console.log('  status: ', provider.status);

  switch(provider.status) {
    case BackgroundGeolocation.AUTHORIZATION_STATUS_DENIED:
      // Android & iOS
      console.log('- Location authorization denied');
      break;
    case BackgroundGeolocation.AUTHORIZATION_STATUS_ALWAYS:
      // Android & iOS
      console.log('- Location always granted');
      break;
    case BackgroundGeolocation.AUTHORIZATION_STATUS_WHEN_IN_USE:
      // iOS only
      console.log('- Location WhenInUse granted');
      break;
  }
});
```

------------------------------------------------------------------------------


### `geofence`

Adds a geofence event-listener.  Your supplied **`callbackFn`** will be called when any monitored geofence crossing occurs.

#### `callbackFn` Paramters

##### `@param {Object} geofence` The geofence data, including `identifier`, `action`, `extras`, `location`

```javascript
BackgroundGeolocation.on('geofence', function(geofence) {
  var location    = geofence.location;
  var identifier  = geofence.identifier;
  var action      = geofence.action;

  console.log('A geofence has been crossed: ', identifier);
  console.log('ENTER or EXIT?: ', action);
  console.log('geofence: ', JSON.stringify(geofence));
});
```

------------------------------------------------------------------------------


### `geofenceschange`

Fired when the list of monitored-geofences changed.  The Background Geolocation contains powerful geofencing features that allow you to monitor any number of circular geofences you wish (thousands even), in spite of limits imposed by the native platform APIs (**20 for iOS; 100 for Android**).

The plugin achieves this by storing your geofences in its database, using a [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to determine those geofences in proximity (@see config [geofenceProximityRadius](#config-integer-meters-geofenceproximityradius-1000)), activating only those geofences closest to the device's current location (according to limit imposed by the corresponding platform).

When the device is determined to be moving, the plugin periodically queries for geofences in proximity (eg. every minute) using the latest recorded location.  This geospatial query is **very fast**, even with tens-of-thousands geofences in the database.

It's when this list of monitored geofences *changes*, the plugin will fire the **`geofenceschange`** event.

:blue_book: For more information, see [Geofencing Guide](./geofencing.md)

#### `callbackFn` Paramters

##### `@param {Array} on` The list of geofences just activated.
##### `@param {Array off` The list of geofences just de-activated

```javascript
BackgroundGeolocation.on('geofenceschange', function(event) {
  var on = event.on;   //<-- new geofences activiated.
  var off = event.off; //<-- geofences that were de-activated.

  // Create map circles
  for (var n=0,len=on.length;n<len;n++) {
    var geofence = on[n];
    createGeofenceMarker(geofence)
  }

  // Remove map circles
  for (var n=0,len=off.length;n<len;n++) {
    var identifier = off[n];
    removeGeofenceMarker(identifier);
  }
});
```

This **`event`** object provides only the *changed* geofences, those which just activated or de-activated.

When **all** geofences have been removed, the event object will provide an empty-array **`[]`** for both **`#on`** and **`#off`** keys, ie:

```javascript
{
  on: [{}, {}, ...],  // <-- Entire geofence objects {}
  off: ['identifier_foo', 'identifier_bar']  <-- just the identifiers
}
```

```javascript
BackgroundGeolocation.on('geofenceschange', function(event) {
  console.log("geofenceschange fired! ", event);
});

// calling remove geofences will cause the `geofenceschange` event to fire
BackgroundGeolocation.removeGeofences();

=> geofenceschange fired! {on: [], off: []}

```

------------------------------------------------------------------------------


### `http`

The **`successFn`** will be executed for each successful HTTP request where the response-code is one of `200`, `201` or `204`.  **`failureFn`** will be executed for all other HTTP response codes.  The **`successFn`** and **`failureFn`** will be provided a single **`response {Object}`** parameter with the following properties:

#### `successFn`, `failureFn` Paramters

##### `@param {Integer} status`.  The HTTP status
##### `@param {String} responseText` The HTTP response as text.

Example:

```javascript
BackgroundGeolocation.onHttp(function(response) {
  var status = response.status;
  var responseText = response.responseText;
  var res = JSON.parse(responseText);  // <-- if your server returns JSON
  console.log("- HTTP success", status, res);
}, function(response) {
  var status = response.status;
  var responseText = response.responseText;
  console.log("- HTTP failure: ", status, responseText);
})
```

------------------------------------------------------------------------------


### `heartbeat`

The **`callbackFn`** will be executed for each [`#heartbeatInterval`](#config-integer-heartbeatinterval-undefined) while the device is in **stationary** state (**iOS** requires [`preventSuspend: true`](#config-boolean-preventsuspend-false) as well).  The **`callbackFn`** will be provided a single **`params {Object}`** parameter with the following properties:

#### `callbackFn` Paramters

##### `@param {String} motionType [still|on_foot|running|on_bicycle|in_vehicle|shaking|unknown]`  The current motion-type.

##### `@param {Object} location`  When the plugin detects movement (iOS only), it will always request a new high-accuracy location in order to determine if the device has moved beyond `stationaryRadius` and if the location has `speed > 0`.  This fresh location will be provided to your `callbackFn`.  Android will simply return the "last known location"

Example:

```javascript
BackgroundGeolocation.on('heartbeat', function(params) {
  console.log('- hearbeat');

  // You could request a new location if you wish.
  BackgroundGeolocation.getCurrentPosition(function(location) {
    console.log('- current location: ', location);
  });
});
```

------------------------------------------------------------------------------


### `schedule`

The **`callbackFn`** will be executed each time a [`schedule`](#schedule) event fires.  Your **`callbackFn`** will be provided with the current **`state`** object (@see [`#getState`](getstatesuccessfn)).  **`state.enabled`** will reflect the state according to your [configured `schedule`](#config-array-schedule-undefined).

#### `callbackFn` Paramters

##### `@param {Object} state` Current plugin state.

```javascript
BackgroundGeolocation.on('schedule', function(state) {
  if (state.enabled) {
    console.log('- BackgroundGeolocation scheduled start tracking');
  } else {
    console.log('- BackgroundGeolocation scheduled stop tracking');
  }
});
```

------------------------------------------------------------------------------


# :large_blue_diamond: Methods

## :small_blue_diamond: Core API Methods

### `configure(config, successFn, failureFn)`

This is the **most** important method of the API.  **`#configure`** must be called **once** (and *only* once) **each time** your application boots, providing the initial [configuration options](#wrench-configuration-options).  The **`successFn`** will be executed after the plugin has successfully configured.

If you later need to re-configure the plugin's [config options](#wrench-configuration-options), use the [`setConfig`](#setconfigconfig-successfn-failurefn) method.

#### `successFn` Paramters

##### `@param {Object} state` Current plugin state.

```javascript
BackgroundGeolocation.configure({
  desiredAccuracy: 0,
  distanceFilter: 50,
  stationaryRadius: 25,
  locationUpdateInterval: 1000,
  foregroundService: true
}, function(state) {
  console.log("Background Geolocation started.  Current state: ", state.enabled);
  if (!state.enabled) {// <-- plugin persists its enabled state.  it may have already started.
    BackgroundGeolocation.start();
  }
}, function(error) {
  console.warn("Background Geolocation failed to configure");
})
```

:information_source: BackgroundGeolocation persists its **`enabled`** state between application terminate or device reboot and **`#configure`** will **automatically** [`#start`](startsuccessfn-failurefn) tracking if it finds **`enabled == true`**.  However, there's no harm in calling [`#start`](startsuccessfn-failurefn) while the plugin is already **`enabled`**, *before* your **`successFn`** is executed.

:warning: You should not execute **any** of the plugin's API methods (other than adding event-listeners with [`#on`](#zap-events) until your **`successFn`** executes.  For example:

```javascript

// OK to add event-listeners before #configure callback fires.
BackgroundGeolocation.on('location', onLocation);
BackgroundGeolocation.on('motionchange', onMotionChange);

BackgroundGeolocation.configure(options, function(state) {
  // YES
  BackgroundGeolocation.getCurrentPosition(succes, fail);
});

// NO!  Wait for #configure callback to execute.
BackgroundGeolocation.getCurrentPosition(success, fail);
```

------------------------------------------------------------------------------


### `setConfig(config, successFn, failureFn)`

Re-configure plugin's [configuration parameters](#wrench-configuration-options).

```javascript
BackgroundGeolocation.setConfig({
  desiredAccuracy: 10,
  distanceFilter: 100
}, function(){
  console.log("- setConfig success");
}, function(){
  console.warn("- Failed to setConfig");
});
```

------------------------------------------------------------------------------


### `on(event, successFn, failureFn)`

Event-listeners can be attached using the method **`#on`**, supplying the **`event`** you wish to listen to. **`#on`** accepts both a **`successFn`** and **`failureFn`**.  See [Events](#zap-events) for a list of available events.

##### `@param {String} event`  The event you wish to listen to
##### `@param {Function} successFn`  The primary event callback function
##### `@param {Function} failureFn`  The failureFn if event failed (ignored for most events)

```javascript
BackgroundGeolocation.on("location", successFn, failureFn);
```

------------------------------------------------------------------------------


### `un(event, callbackFn)`

Event-listeners are removed with the method **`#un`**.  You must supply a reference to the *exact* `successFn` reference used with the **`#on`** method.  See [Events](#zap-events) for a list of available events.

##### `@param {String} event`  The event you wish to un-subscribe.
##### `@param {Function} callbackFn`  The exact `successFn` reference used to originally subscribe to the event with the `#on` method.

```javascript
function onLocation(location) {   // <-- successFn
  console.log('- location: ', location); 
}
function onLocationError(error) {
  console.log('- location error: ', error);
}
// Add a location listener
BackgroundGeolocation.on('location', onLocation, onLocationError);
.
.
.
// Remove a location listener supplying only the successFn (onLocation)
BackgroundGeolocation.un('location', onLocation);
```

------------------------------------------------------------------------------


### `start(successFn, failureFn)`

Enable location tracking.  Supplied **`successFn`** will be executed when tracking is successfully engaged.  This is the plugin's power **ON** button.  The plugin will initially start into its **stationary** state, fetching an initial location before turning off location services.

Android will be monitoring its **Activity Recognition System** while iOS will create a stationary geofence around the current location.  **NOTE** If you've configured a [`#schedule`](#config-array-schedule-undefined), this method will override that schedule and engage tracking immediately.

#### `successFn` Paramters

##### `@param {Object} state` Current plugin state.

```javascript
BackgroundGeolocation.start(function(state) {
  console.log('- BackgroundGeolocation started, state: ', state);
});
```

:blue_book: For more information, see [Philosophy of Operation](../../../wiki/Philosophy-of-Operation)

------------------------------------------------------------------------------


### `stop(successFn, failureFn)`

Disable location tracking.  Supplied **`successFn`** will be executed when tracking is successfully halted.  This is the plugin's power **OFF** button.

```javascript
BackgroundGeolocation.stop();
```

:warning: If you've configured a [`schedule`](config-array-schedule-undefined), **`#stop`** will **not** halt the Scheduler.  You must explicitly stop the Scheduler as well:

```javascript
// Later when you want to stop the Scheduler (eg: user logout)
BackgroundGeolocation.stopSchedule(function() {
  console.info('- Scheduler stopped');
  // You must explicitly stop tracking if currently enabled
  BackgroundGeolocation.stop();
});
```

------------------------------------------------------------------------------


### `getState(successFn)`

Fetch the current-state of the plugin, including all configuration parameters.

#### `successFn` Paramters

##### `@param {Object} state` Current plugin state.

```javascript
BackgroundGeolocation.getState(function(state) {
  console.log(JSON.stringify(state));
});

{
  "stopOnTerminate": true,
  "disableMotionActivityUpdates": false,
  "params": {
    "device": {
      "manufacturer": "Apple",
       "available": true,
       "platform": "iOS",
       "cordova": "3.9.1",
       "uuid": "61CA53C7-BC4B-44D3-991B-E9021AE7F8EE",
       "model": "iPhone8,1",
       "version": "9.0.2"
    }
  },
  "url": "http://192.168.11.120:8080/locations",
  "desiredAccuracy": 0,
  "stopDetectionDelay": 0,
  "activityRecognitionInterval": 10000,
  "distanceFilter": 50,
  "activityType": 2,
  "useSignificantChangesOnly": false,
  "autoSync": false,
  "isMoving": false,
  "maxDaysToPersist": 1,
  "stopTimeout": 2,
  "enabled": false,
  "debug": true,
  "batchSync": false,
  "headers": {},
  "disableElasticity": false,
  "stationaryRadius": 20
}
```

------------------------------------------------------------------------------


### `getCurrentPosition(successFn, failureFn, options)`

Retrieves the current position.  This method instructs the native code to fetch exactly one location using maximum power & accuracy.  The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured [`#url`](#config-string-url-undefined) (if you've enabled the HTTP features).

If an error occurs while fetching the location, the **`failureFn`** will be executed with an **`Integer`** [Error Code](../../../wiki/Location-Error-Codes) as the first argument.

#### Options

##### `@config {Integer} timeout [30]` An optional location-timeout.  If the timeout expires before a location is retrieved, the `failureFn` will be executed.

##### `@config {Integer millis} maximumAge [0]` Accept the last-recorded-location if no older than supplied value in milliseconds.

##### `@config {Boolean} persist [true]` Defaults to `true`.  Set `false` to disable persisting the retrieved location in the plugin's SQLite database.

##### `@config {Integer} samples [3]` Sets the maximum number of location-samples to fetch.  The plugin will return the location having the best accuracy to your `successFn`.  Defaults to `3`.  Only the final location will be persisted.

##### `@config {Integer} desiredAccuracy [stationaryRadius]` Sets the desired accuracy of location you're attempting to fetch.  When a location having `accuracy <= desiredAccuracy` is retrieved, the plugin will stop sampling and immediately return that location.  Defaults to your configured `stationaryRadius`.

##### `@config {Object} extras` Optional extra-data to attach to the location.  These `extras {Object}` will be merged to the recorded `location` and persisted / POSTed to your server (if you've configured the HTTP Layer).

#### `successFn` Parameters

##### `@param {Object} location` The Location data

```javascript
BackgroundGeolocation.getCurrentPosition(function(location) {
  // This location is already persisted to plugin’s SQLite db.  
  // If you’ve configured #autoSync: true, the HTTP POST has already started.
  console.log(“- Current position received: “, location);
}, function(errorCode) {
  alert('An location error occurred: ' + errorCode);
}, {
  timeout: 30,      // 30 second timeout to fetch location
  maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
  desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
  samples: 3,   // How many location samples to attempt.
  extras: {         // [Optional] Attach your own custom `metaData` to this location.  This metaData will be persisted to SQLite and POSTed to your server
    foo: "bar"  
  }
});

```

:information_source: While the **`successFn`** will receive only **one** location, the plugin *does* request **multiple** location [`samples`](#config-integer-samples-3-sets-the-maximum-number-of-location-samples-to-fetch--the-plugin-will-return-the-location-having-the-best-accuracy-to-your-successfn--defaults-to-3--only-the-final-location-will-be-persisted) in order to record the most accurate location possible.  These *samples* are **not** persisted to the database but they will be provided to your [`location`](#location) event-listener, for your convenience, since it can take some seconds for the best possible location to arrive.  For example, you might use these samples to progressively update the user's position on a map.  You can detect these *samples* in your [`location`](#location) `callbackFn` via `location.sample === true`.  If you're manually `POST`ing location to your server, you should ignore these locations.

#### `failureFn` Parameters

##### `@param {Integer} errorCode` If a location failed to be retrieved, one of the following error-codes will be returned

| Code  | Error                       |
|-------|-----------------------------|
| 0     | Location unknown            |
| 1     | Location permission denied  |
| 2     | Network error               |
| 408   | Location timeout            |

Eg:

```javascript
BackgroundGeolocation.getCurrentPosition(succesFn, function(errorCode) {
  switch (errorCode) {
    case 0:
      alert('Failed to retrieve location');
      break;
    case 1:
      alert('You must enable location services in Settings');
      break;
    case 2:
      alert('Network error');
      break;
    case 408:
      alert('Location timeout');
      break;
  }
})
```

------------------------------------------------------------------------------


### `watchPosition(successFn, failureFn, options)`

Start a stream of continuous location-updates.  The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured [`#url`](#config-string-url-undefined) (if you've enabled the HTTP features).

:warning: **`#watchPosition`** is **not** reccommended for **long term** monitoring in the background &mdash; It's primarily designed for use in the foreground **only**.  You might use it for fast-updates of the user's current position on the map, for example.

**iOS**
- **`#watchPosition`** will continue to run in the background, preventing iOS from suspending your application.  Take care to listen to `suspend` event and call [`#stopWatchPosition`](stopwatchpositionsuccessfn-failurefn) if you don't want your app to keep running (TODO make this configurable).

#### Options

##### `@config {Integer millis} interval [1000]` Location update interval
##### `@config {Integer} desiredAccuracy` [0]
##### `@config {Boolean} persist [true]` Whether to persist location to database
##### `@config {Object} extras [undefined]` Optional extras to append to each location

#### `successFn` Parameters

##### `@param {Object} location` The Location data

```javascript
// Start watching position when app comes to foreground
onAppResume() {
  BackgroundGeolocation.watchPosition(function(location) {
    console.log(“- Watch position: “, location);
  }, function(errorCode) {
    alert('An location error occurred: ' + errorCode);
  }, {
    interval: 1000,    // <-- retrieve a location every 5s.
    persist: false,    // <-- default is true
  });
}

// Stop watching position when app moves to background
onAppSuspend() {
  BackgroundGeolocation.stopWatchPosition();
}

```

:information_source: Also see [`#stopWatchPosition`](stopwatchpositionsuccessfn-failurefn)

------------------------------------------------------------------------------


### `stopWatchPosition(successFn, failureFn)`

Halt [`#watchPosition`](watchpositionsuccessfn-failurefn-options) updates.

```javascript
BackgroundGeolocation.stopWatchPosition();  // <-- callbacks are optional
```

------------------------------------------------------------------------------


### `changePace(enabled, successFn, failureFn)`

Manually Toggles the plugin **motion state** between **stationary** and **moving**.  When **`enabled`** is set to **`true`**, the plugin will engage location-services and begin aggressively tracking the device's location *immediately*, bypassing stationary monitoring.  If you were making a "Jogging" application, this would be your **[Start Workout]** button to immediately begin location-tracking.  Send **`false`** to turn **off** location-services and return the plugin to the **stationary** state.

```javascript
BackgroundGeolocation.changePace(true);  // <-- Location-services ON
BackgroundGeolocation.changePace(false); // <-- Location-services OFF
```

------------------------------------------------------------------------------


### `getOdometer(callbackFn, failureFn)`

The plugin constantly tracks distance travelled, computing the distance between the current location and last and maintaining the sum.  To fetch the current **odometer** reading:

```javascript
BackgroundGeolocation.getOdometer(function(distance) {
  console.log("Distance travelled: ", distance);
});
```

:information_source: Also see [`desiredOdometerAccuracy`](config-integer-desiredodometeraccuracy-100) to set discard poor accuracy locations being used in odometer calculations.

:warning: Odometer calculations are dependant upon the accuracy of received locations.  If location accuracy is poor, this will necessarily introduce error into odometer calculations.

------------------------------------------------------------------------------


### `setOdometer(value, callbackFn, failureFn)`

Set the **`odometer`** to *any* arbitrary value.  **NOTE** `setOdometer` will perform a [`getCurrentPosition`](#getcurrentpositionsuccessfn-failurefn-options) in order to record to exact location where odometer was set; as a result, the `callback` signatures are identical to those of [`getCurrentPosition`](#getcurrentpositionsuccessfn-failurefn-options).

```javascript
BackgroundGeolocation.setOdometer(1234.56, function(location) {
  // Callback is called with the location where odometer was set at.
  console.log('- setOdometer success: ', location);
}, function(errorCode) {
  // If the plugin failed to fetch a location, it will still have set your odometer to your desired value.
  console.log('- Error: ', errorCode);
});
```

------------------------------------------------------------------------------


### `resetOdometer(callbackFn, failureFn)`

Reset the **odometer** to `0`.  Alias for [`setOdometer(0)`](#setodometervalue-callbackfn-failurefn)

------------------------------------------------------------------------------


### `startSchedule(callbackFn)`

If a [`#schedule`](#config-array-schedule-undefined) was configured, this method will initiate that schedule.  The plugin will automatically be started or stopped according to the configured [`#schedule`](#config-array-schedule-undefined).

```javascript
BackgroundGeolocation.startSchedule(function() {
  console.log('- Scheduler started');
});
```

------------------------------------------------------------------------------


### `stopSchedule(callbackFn)`

This method will stop the Scheduler service.

```javascript
BackgroundGeolocation.stopSchedule(function() {
  console.log('- Scheduler stopped');
});
```

:warning: **`#stopSchedule`** will not execute **`#stop`** if the plugin is currently tracking.  You must explicitly execute `#stop`.

```javascript
// Later when you want to stop the Scheduler (eg: user logout)
BackgroundGeolocation.stopSchedule(function() {
  // You must explicitly stop tracking if currently enabled
  BackgroundGeolocation.stop();
});
```

------------------------------------------------------------------------------


### `startBackgroundTask(callbackFn)`

Sends a signal to iOS that you wish to perform a long-running task.  The OS will not suspend your app until you signal completion with the [`#finish`](#finishtaskid) method.  The **`callbackFn`** will be provided with a single parameter **`taskId`** which you will send to the [`#finish`](#finishtaskid) method.  

#### `callbackFn` Parameters

##### `@param {Integer} taskId` The taskId to send to the [`#finish`](#finishtaskid) method.

Eg:
```javascript
BackgroundGeolocation.setOdometer(0, function(location) {
  console.log('- setOdometer at location: ', location);

  BackgroundGeolocation.startBackgroundTask(function(taskId) {  // <-- taskId provided to callback
  // Perform some long-running task (eg: HTTP request)
    performLongRunningTask(function() {
      // When long running task is complete, signal completion of taskId.
      BackgroundGeolocation.finish(taskId);
    });
  });
});
```

:warning: iOS provides **exactly** 180s of background-running time.  If your long-running task exceeds this time, the plugin has a fail-safe which will automatically [`#finish`](#finishtaskid) your **`taskId`** to prevent the OS from force-killing your application.

------------------------------------------------------------------------------


### `finish(taskId)`

Sends a signal to the native OS that your long-running task, addressed by `taskId` is complete and the OS may proceed to suspend your application if applicable.

Eg:
```javascript
BackgroundGeolocation.setOdometer(0, function(location) {
  console.log('- setOdometer at location: ', location);

  BackgroundGeolocation.startBackgroundTask(function(taskId) {  // <-- taskId provided to callback
    // Perform some long-running task (eg: HTTP request)
    performLongRunningTask(function() {
      // When long running task is complete, signal completion of taskId.
      BackgroundGeolocation.finish(taskId);
    });
  });
});
```

------------------------------------------------------------------------------


### `removeListeners(successFn, failureFn)`

Remove all event-listeners registered with [`#on`](#zap-events) method.  You're free to add more listeners again after executing **`#removeListeners`**.

```javascript
BackgroundGeolocation.on('location', function(location) {
  console.log('- Location', location);  
})
.
.
.
BackgroundGeolocation.removeListeners();

BackgroundGeolocation.on('location', function(location) {
  console.log('- Location listener added again: ', location);
});
```

------------------------------------------------------------------------------


## :small_blue_diamond: HTTP & Persistence Methods

### `getLocations(successFn, failureFn)`
Fetch all the locations currently stored in native plugin's SQLite database.  Your **`callbackFn`** will receive an `Array` of locations in the 1st parameter.  Eg:

#### `successFn` Parameters:

##### `@param {Array} locations`  The list of locations stored in SQLite database.

```javascript
BackgroundGeolocation.getLocations(function(locations) {
  console.log("locations: ", locations);
});
```

------------------------------------------------------------------------------


### `getCount(successFn, failureFn)`
Fetches count of SQLite locations table `SELECT count(*) from locations`.  The **`successFn`** will be executed with count as the only parameter.

#### `successFn` Parameters:

##### `@param {Integer} count` Number of locations in the database.

```javascript
BackgroundGeolocation.getCount(function(count) {
  console.log('- count: ', count);
});
```

------------------------------------------------------------------------------


### `insertLocation(config, successFn, failureFn)`

Manually insert a location into the native plugin's SQLite database.  Your **`successFn`** will be executed if the operation was successful.  The inserted location's schema must match this plugin's published [Location Data Schema](wiki/Location-Data-Schema).  The plugin will have no problem inserting a location retrieved from the plugin itself.

#### Config Options

##### `@config {Object} config`  The location params/object matching the [Location Data Schema](wiki/Location-Data-Schema).

```javascript
BackgroundGeolocation.insertLocation({
  "uuid": "f8424926-ff3e-46f3-bd48-2ec788c9e761", // <-- required
  "timestamp": "2016-02-10T22:25:54.905Z"     // <-- required
  "coords": {                   // <-- required
    "latitude": 45.5192746,
    "longitude": -73.616909,
    "accuracy": 22.531999588012695,
    "speed": 0,
    "heading": 0,
    "altitude": 0
  }
}, function() {
  console.log('- Inserted location success');
}, function(error) {
  console.warn('- Failed to insert location: ', error);
});

// insertLocation can easily consume any location which it returned.  Note that #getCurrentPosition ALWAYS persists so this example
// will manually persist a 2nd version of the same location.  The purpose here is to show that the plugin can consume any location object which it generated.
BackgroundGeolocation.getCurrentPosition(function(location) {
  location.extras = {foo: 'bar'}; // <-- add some arbitrary extras-data

  // Insert it.
  BackgroundGeolocation.insertLocation(location, function() {
    console.log('- Inserted location success');
  });
});
```

------------------------------------------------------------------------------


### `clearDatabase(successFn, failureFn)`
**DEPRECATED**.  Use `#destroyLocations`.

------------------------------------------------------------------------------


### `destroyLocations(successFn, failureFn)`

Remove all records in plugin's SQLite database.

```javascript
BackgroundGeolocation.destroyLocations(function() {
  console.log('- cleared database'); 
});
```

------------------------------------------------------------------------------


### `sync(successFn, failureFn)`

If the plugin is configured for HTTP with an [`#url`](#config-string-url-undefined) and [`autoSync: false`](#config-string-autosync-true), this method will initiate POSTing the locations currently stored in the native SQLite database to your configured [`#url`](#config-string-url-undefined).  When your HTTP server returns a response of `200 OK`, that record(s) in the database will be DELETED.  

If you configured [`batchSync: true`](#config-string-batchsync-false), all the locations will be sent to your server in a single HTTP POST request, otherwise the plugin will create execute an HTTP post for **each** location in the database (REST-style).  Your **`callbackFn`** will be executed and provided with an Array of all the locations from the SQLite database.  If you configured the plugin for HTTP (by configuring an [`#url`](#config-string-url-undefined), your **`callbackFn`** will be executed after the HTTP request(s) have completed.  If the plugin failed to sync to your server (possibly because of no network connection), the **`failureFn`** will be called with an `errorMessage`.  If you are **not** using the HTTP features, **`sync`** will delete all records from its SQLite datbase.  Eg:

Your callback will be provided with the following params

#### `successFn` Parameters

##### `@param {Array} locations`  The list of locations stored in SQLite database.

```javascript
BackgroundGeolocation.sync(function(locations) {
  // Here are all the locations from the database.  The database is now EMPTY.
  console.log('synced locations: ', locations);  
}, function(errorMessage) {
  console.warn('Sync FAILURE: ', errorMessage);
});

```

:blue_book: For more information, see [HTTP Guide](http.md)

------------------------------------------------------------------------------


## :small_blue_diamond: Geofencing Methods

### `startGeofences(callbackFn)`

Engages the geofences-only `trackingMode`.  In this mode, no active location-tracking will occur -- only geofences will be monitored.  To stop monitoring "geofences" `trackingMode`, simply use the usual `#stop` method.  The `state` object now contains the new key `trackingMode [location|geofence]`.

```javascript

BackgroundGeolocation.configure(config, function(state) {
  // Add some geofences.
  BackgroundGeolocation.addGeofences([
    notifyOnExit: true,
    radius: 200,
    identifier: 'ZONE_OF_INTEREST',
    latitude: 37.234232,
    longitude: 42.234234 
  ]);

  if (!state.enabled) {
    BackgroundGeolocation.startGeofences(function(state) {
      console.log('- Geofence-only monitoring started', state.trackingMode);
    });
  }
});

// Listen to geofences
BackgroundGeolocation.on('geofence', function(params) {
  if (params.identifier == 'ZONE_OF_INTEREST') {
    // If you wish, you can choose to engage location-tracking mode when a 
    // particular geofence event occurs.
    BackgroundGeolocation.start();
  }
});
```

------------------------------------------------------------------------------


### `addGeofence(config, successFn, failureFn)`

Adds a geofence to be monitored by the native plugin.  If a geofence *already exists* with the configured **`identifier`**, the previous one will be **deleted** before the new one is inserted.  

#### Config Options

##### `@config {String} identifier` The name of your geofence, eg: "Home", "Office"

##### `@config {Float} radius` The radius (meters) of the geofence.  In practice, you should make this >= 100 meters.

##### `@config {Float} latitude` Latitude of the center-point of the circular geofence.

##### `@config {Float} longitude` Longitude of the center-point of the circular geofence.

##### `@config {Boolean} notifyOnExit` Whether to listen to EXIT events

##### `@config {Boolean} notifyOnEntry` Whether to listen to ENTER events

##### `@config {Boolean} notifyOnDwell` Whether to listen to DWELL events

##### `@config {Integer milliseconds} loiteringDelay` When `notifyOnDwell` is `true`, the delay before DWELL event is fired after entering a geofence (@see [Creating and Monitoring Geofences](https://developer.android.com/training/location/geofencing.html))

##### `@config {Object} extras` Optional arbitrary meta-data.

```javascript
BackgroundGeolocation.addGeofence({
  identifier: "Home",
  radius: 150,
  latitude: 45.51921926,
  longitude: -73.61678581,
  notifyOnEntry: true,
  notifyOnExit: false,
  notifyOnDwell: true,
  loiteringDelay: 30000,  // 30 seconds
  extras: {               // Optional arbitrary meta-data
    zone_id: 1234
  }
}, function() {
  console.log("Successfully added geofence");
}, function(error) {
  console.warn("Failed to add geofence", error);
});
```

:information_source: When adding a list-of-geofences, it's about **10* faster** to use [`#addGeofences`](#addgeofencesgeofences-callbackfn-failurefn) instead.

:blue_book: See [Geofencing Guide](./geofencing.md) for more information.

#### `successFn` Parameters:

##### `@param {String} identifier` The name of your geofence, eg: "Home", "Office"

#### `failureFn` Parameters

##### `@param {String} errorMessage`

------------------------------------------------------------------------------


### `addGeofences(geofences, successFn, failureFn)`

Adds a list of geofences to be monitored by the native plugin.  If a geofence *already* exists with the configured `identifier`, the previous one will be **deleted** before the new one is inserted.  The `geofences` param is an `Array` of geofence Objects `{}` with the following params:

#### Config Options

##### `@config {Array} geofences` An list of geofences configured with the same parmeters as [`#addGeofence`](#config-options)

##### `@config {Function} callbackFn` Executed when geofences successfully added.

##### `@config {Function} failureFn` Executed when failed to add geofence.

Example:

```javascript
BackgroundGeolocation.addGeofences([{
  identifier: "Home",
  radius: 150,
  latitude: 45.51921926,
  longitude: -73.61678581,
  notifyOnEntry: true,
  notifyOnExit: false,
  notifyOnDwell: true,
  loiteringDelay: 30000,   // 30 seconds
  extras: {                // Optional arbitrary meta-data
    zone_id: 1234
  }
}], function() {
  console.log("Successfully added geofence");
}, function(error) {
  console.warn("Failed to add geofence", error);
});
```

#### `successFn` Parameters:

##### `@param {String} message`

#### `failureFn` Parameters:

##### `@param {String} errorMessage`


------------------------------------------------------------------------------


### `removeGeofence(identifier, successFn, failureFn)`

Removes a geofence having the given `{String} identifier`.

#### Config Options

##### `@config {String} identifier` Identifier of geofence to remove.

##### `@config {Function} callbackFn` successfully removed geofence.

##### `@config {Function} failureFn` failed to remove geofence

```javascript
BackgroundGeolocation.removeGeofence("Home", function() {
  console.log("Successfully removed geofence");
}, function(error) {
  console.warn("Failed to remove geofence", error);
});
```

#### `successFn` Parameters:

##### `@param {String} identifier`

#### `failureFn` Parameters:

##### `@param {String} errorMessage`

------------------------------------------------------------------------------


### `removeGeofences(callbackFn, failureFn)`

Removes all geofences.

##### `@config {Function} callbackFn` successfully removed geofences.

##### `@config {Function} failureFn` failed to remove geofences

```javascript
BackgroundGeolocation.removeGeofences(function() {
  console.log("Successfully removed alll geofences");
}, function(error) {
  console.warn("Failed to remove geofence", error);
});
```

#### `successFn` Parameters:

##### `@param {String} message`

#### `failureFn` Parameters:

##### `@param {String} errorMessage`

------------------------------------------------------------------------------


### `getGeofences(successFn, failureFn)`

Fetch the list of monitored geofences.  Your **`successFn`** will be provided with an `Array` of geofences.  If there are no geofences being monitored, you'll receive an empty Array `[]`.

#### `successFn` Parameters

##### `@param {Array} geofences` List of all geofences in the database.

Example:

```javascript
BackgroundGeolocation.getGeofences(function(geofences) {
  for (var n=0,len=geofences.length;n<len;n++) {
    console.log("Geofence: ", geofence.identifier, geofence.radius, geofence.latitude, geofence.longitude);
  }
}, function(error) {
  console.warn("Failed to fetch geofences from server");
});
```

#### `failureFn` Parameters

------------------------------------------------------------------------------


## :small_blue_diamond: Logging Methods

### `setLogLevel(logLevel, callbackFn)`

#### Config Options

##### `@config {Integer} logLevel`  The desired log level
##### `@config {Function} callbackFn` Executed when `logLevel` is changed.

| logLevel | Label |
|---|---|
|`0`|`LOG_LEVEL_OFF`|
|`1`|`LOG_LEVEL_ERROR`|
|`2`|`LOG_LEVEL_WARNING`|
|`3`|`LOG_LEVEL_INFO`|
|`4`|`LOG_LEVEL_DEBUG`|
|`5`|`LOG_LEVEL_VERBOSE`|

```javascript
BackgroundGeolocation.setLogLevel(BackgroundGeolocation.LOG_LEVEL_VERBOSE,function() {
  console.log("Changed logLevel success");
});
```

------------------------------------------------------------------------------


### `getLog(callbackFn)`

Fetches the entire contents of the current circular-log and return it as a String.

#### `callbackFn` Parameters

##### `@param {String} log`  The complete log in a single string.  You can split this string on `\n` to convert to an Array of lines.

```javascript
BackgroundGeolocation.getLog(function(log) {
  console.log(log);  // <-- send log to console.  copy/paste result into your own text file.
});
```

------------------------------------------------------------------------------

### `emailLog(email, callbackFn)`

Fetch the entire contents of the current circular log and email it to a recipient using the device's native email client.

#### Config Options:

##### `@param {String} email`  Email address to send log to.
##### `@param {Function} callbackFn`  Executed after successfully emailed.

#### `callbackFn` Parameters:

None

```javascript
BackgroundGeolocation.emailLog("foo@bar.com");
```

**Android:**  

1. The following permissions are required in your `AndroidManifest.xml` in order to attach the `.log` file to the email:

```xml
<manifest>
  <application>
  ...
  </application>

  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
</manifest>
```

2. Grant "Storage" permission `Settings->Apps->[Your App]->Permissions: (o) Storage`

![](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/Screenshot_20160218-183345.png)

### `destroyLog(successFn, failureFn)`

Destory the entire contents of Log database.

```javascript
BackgroundGeolocation.destroyLog(function() {
  console.log('- Destroyed log');
}, function() {
  console.log('- Destroy log failure');
});
```

#### `successFn` Parameters

None

#### `failureFn` Parameters

None

------------------------------------------------------------------------------


### `logger`

Send your own log-messages into the plugin's logging database.  The following methods are available on the **`BackgroundGeolocation.logger`** object:

#### Methods

| method     | logLevel | icon                        |
|------------|----------|-----------------------------|
|`error`     |`ERROR`   | :exclamation:               |
|`warn`      |`WARNING` | :warning:                   |
|`debug`     |`DEBUG`   | :beetle:                    |
|`info`      |`INFO`    | :information_source:         |
|`notice`    |`INFO`    | :large_blue_circle:          |
|`header`    |`INFO`    | *message wrapped in box*    |
|`on`        |`INFO`    | :tennis:                    |
|`off`       |`INFO`    | :red_circle:                |
|`ok`        |`INFO`    | :white_check_mark:          |

#### Javascript Caller Method
Log messages will be recorded in the following format, including the name of name of your javascript *caller method* where the log message was executed:

```
2017-08-18 10:12:25.324 ⚠️-[TSLocationManager log:message:caller:] [javascriptCallerMethod] Message
```

#### Examples

```javascript
BackgroundGeolocation.logger.error("Something bad happened");
BackgroundGeolocation.logger.warn("Something weird happened");
BackgroundGeolocation.logger.debug("Debug message");
BackgroundGeolocation.logger.info("Something informative");
BackgroundGeolocation.logger.notice("Something interesting");
BackgroundGeolocation.logger.header("Something bold");
BackgroundGeolocation.logger.on("Something on or positive");
BackgroundGeolocation.logger.off("Something off or negative");
BackgroundGeolocation.logger.ok("Something affirmative happened");
```

------------------------------------------------------------------------------


### `getSensors(callbackFn, failureFn)`

Returns the presense of device sensors *accelerometer*, *gyroscope*, *magnetometer*, in addition to iOS/Android-specific sensors.  These core sensors are used by the motion activity-recognition system &mdash; when any of these sensors are missing from a device (particularly on cheap Android devices), the performance of the motion activity-recognition system will be **severly** degraded and highly inaccurate.

Your `callbackFn` will be provided an event `{Object}` containing the following parameters:

#### `callbackFn` Parameters

##### `@param {String} platform`  "ios" | "android"
##### `@param {Boolean} accelerometer`  Presense of device accelerometer
##### `@param {Boolean} gyroscope`  Presense of device gyroscope
##### `@param {Boolean} magnetometer`  Presense of device magnetometer (compass)

**iOS**
##### `@param {Boolean} motion_hardware`  Presense of device motion hardware (ie: M7 chip)

**Android**
##### `@param {Boolean} significant_motion`  Presense of significant motion sensor

```javascript
BackgroundGeolocation.getSensors(function(sensors) {
  console.log('- has accelerometer? ', sensors.accelerometer);
  console.log('- has gyroscope? ', sensors.gyroscope);
  console.log('- has magnetometer? ', sensors.magnetometer);
  if (sensors.platform === 'ios') {
    console.log('- has motion hardware (M7 chip)?', sensors.motion_hardware);
  } else if (sensors.platform === 'android') {
    console.log('- has significant motion sensor? ', sensors.significant_motion);
  }
});
```

------------------------------------------------------------------------------


### `playSound(soundId)`

Here's a fun one.  The plugin can play a number of OS system sounds for each platform.  For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html).  I offer this API as-is, it's up to you to figure out how this works.

```javascript
// A soundId iOS recognizes
BackgroundGeolocation.playSound(1303);

// An Android soundId
BackgroundGeolocation.playSound(90);
```

------------------------------------------------------------------------------
