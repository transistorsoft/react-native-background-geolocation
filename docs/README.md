# API Documentation

## Geolocation Options

The following **Options** can all be provided to the plugin's `#configure` method:

```Javascript
bgGeo.configure({
    desiredAccuracy: 0,
    distanceFilter: 50,
    .
    .
    .
}, function(state) {
    console.log('- Configure success.  Current state: ', state);
});

// Use #setConfig if you need to change options after you've executed #configure

bgGeo.setConfig({
    desiredAccuracy: 10,
    distanceFilter: 10
});

```

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| [`desiredAccuracy`](#param-integer-desiredaccuracy-0-10-100-1000-in-meters) | `Integer` | Required | 0 | Specify the desired-accuracy of the geolocation system with 1 of 4 values, `0`, `10`, `100`, `1000` where `0` means **HIGHEST POWER, HIGHEST ACCURACY** and `1000` means **LOWEST POWER, LOWEST ACCURACY** |
| [`distanceFilter`](#param-integer-distancefilter) | `Integer` | Required | `30`| The minimum distance (measured in meters) a device must move horizontally before an update event is generated. @see Apple docs. However, #distanceFilter is elastically auto-calculated by the plugin: When speed increases, #distanceFilter increases; when speed decreases, so does distanceFilter (disabled with `disableElasticity: true`) |
| [`stopAfterElapsedMinutes`](#param-integer-stopafterelapsedminutes) | `Integer`  |  Optional | `0`  | Stop monitoring location after a set number of minutes have elasped since #start method was called. |
| [`stationaryRadius`](#param-integer-stationaryradius-meters) | `Integer`  |  Required (**iOS**)| `20`  | When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage. Note, since the plugin uses iOS significant-changes API, the plugin cannot detect the exact moment the device moves out of the stationary-radius. In normal conditions, it can take as much as 3 city-blocks to 1/2 km before staionary-region exit is detected. |
| [`disableElasticity`](#param-boolean-disableelasticity-false) | `bool`  |  Optional | `false`  | Set true to disable automatic speed-based `#distanceFilter` elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km. |
| [`disableElasticity`](#param-boolean-disableelasticity-false) | `bool`  |  Optional | `false`  | Set `true` disables automatic speed-based `#distanceFilter` elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km. |
| [`activityType`](#param-string-activitytype-automotivenavigation-othernavigation-fitness-other) | `String` | Required (**iOS**)| `Other` | Presumably, this affects iOS GPS algorithm. See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information | Set the desired interval for active location updates, in milliseconds. |
| [`useSignificantChangesOnly`](#param-boolean-usesignificantchangesonly-false) | `Boolean` | Optional (**iOS**)| `false` | Set `true` in order to disable constant background-tracking and use only the iOS [Significant Changes API](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges). If Apple has denied your application due to background-tracking, this can be a solution. **NOTE** The Significant Changes API will report a location only when a significant change from the last location has occurred. Many of the configuration parameters **will be ignored**, such as `#distanceFilter`, `#stationaryRadius`, `#activityType`, etc. |
| [`pausesLocationUpdatesAutomatically`](#param-boolean-pauseslocationupdatesautomatically-true) | `Boolean` | Optional (**iOS**)| `true` | The default behaviour of the plugin is to turn off location-services automatically when the device is detected to be stationary.  When set to `false`, location-services will **never** be turned off (and `disableStopDetection` will automatically be set to `true`) -- it's your responsibility to turn them off when you no longer need to track the device.  This feature should **not** generally be used.  `preventSuspend` will no longer work either.| 
| [`locationAuthorizationRequest`](#param-string-locationauthorizationrequest-always) | `Always`,`WhenInUse` | Optional | `Always` | The desired iOS location-authorization request, either `Always` or `WhenInUse`.  You'll have to edit the corresponding key in your app's `Info.plist`, `NSLocationAlwaysUsageDescription` or `NSWhenInUseUsageDescription`.  `WhenInUse` will display a **blue bar** at top-of-screen informing user that location-services are on.
| [`locationAuthorizationAlert`](#param-object-locationauthorizationalert) | `{}` | Optional (**iOS**)| `{}` | When you configure the plugin location-authorization `Always` or `WhenInUse` and the user changes the value in the app's location-services settings or disabled location-services, the plugin will display an Alert directing the user to the **Settings** screen.  This config allows you to configure all the Strings for that Alert popup. |

## Activity Recognition Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| [`activityRecognitionInterval`](#param-integer-millis-10000-activityrecognitioninterval) | `Integer` | Required | `10000` | The desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of 0 will result in activity detections at the fastest possible rate. |
| [`stopTimeout`](#param-integer-minutes-stoptimeout) | `Integer` | Required | `5 minutes` | The number of miutes to wait before turning off the GPS after the ActivityRecognition System (ARS) detects the device is `STILL` (**Android:** defaults to 0, no timeout, **iOS:** defaults to 5min). If you don't set a value, the plugin is eager to turn off the GPS ASAP. An example use-case for this configuration is to delay GPS OFF while in a car waiting at a traffic light. |
| [`stopDetectionDelay`](#param-integer-minutes-stopdetectiondelay-0) | `Integer` | Optional | 0 | Allows the stop-detection system to be delayed from activating. When the stop-detection system is engaged, the GPS is off and only the accelerometer is monitored. Stop-detection will only engage if this timer expires. The timer is cancelled if any movement is detected before expiration |
| [`disableMotionActivityUpdates`](#param-boolean-disablemotionactivityupdates-false) | `Boolean` | Optional (**iOS**)| 0 | Set `true` to disable iOS [`CMMotionActivity`](https://developer.apple.com/reference/coremotion/cmmotionactivitymanager) updates (eg: "walking", "in_vehicle").  This feature requires a device having the **M7** co-processor (ie: iPhone 5s and up).  **NOTE** This feature will ask the user for "Health updates".  :warning: The plugin is **HIGHLY** optimized for motion-activity-updates.|
| [`disableStopDetection`](#param-boolean-disablestopdetection-false) | `Boolean` | Optional (**iOS**)| `false` | Disable iOS accelerometer-based **Stop-detection System**.  When disabled, the plugin will use the default iOS behaviour of automatically turning off location-services when the device has stopped for exactly 15 minutes.  When disabled, you will no longer have control over `stopTimeout`| 

## Geofencing Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| [`geofenceProximityRadius`](#param-integer-geofenceproximityradius-meters) | `Integer`  |  Optional | `1000`  | When using Geofences, the plugin activates only thoses in proximity (the maximim geofences allowed to be simultaneously monitored is limited by the platform, where **iOS** allows only 20 and **Android**.  However, the plugin allows you to create as many geofences as you wish (thousands even).  It stores these in its database and uses spatial queries to determine which **20** or **100** geofences to activate. |
| [`geofenceInitialTriggerEntry`](#param-boolean-geofenceinitialtriggerentry-true) | `Boolean` | Optional | `true` | Defaults to `true`.  Set `false` to disable triggering a geofence immediately if device is already inside it.|

## HTTP / Persistence Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| [`url`](#param-string-url) | `String` | Optional | `null` | Your server url where you wish to HTTP POST recorded locations to. |
| [`params`](#param-object-params) | `Object` | Optional | `null` | Optional HTTP params sent along in HTTP request to above `#url`. |
| [`headers`](#param-object-headers) | `Object` | Optional | `null` | Optional HTTP headers sent along in HTTP request to above `#url` |
| [`extras`](#param-object-extras) | `Object` | Optional | | Optional `null` to attach to each recorded location |
| [`method`](#param-string-method-post) | `String` | Optional | `POST` | The HTTP method. Some servers require `PUT`.
| [`autoSync`](#param-string-autosync-true) | `Boolean` | Optional | `true` | If you've enabled the HTTP feature by configuring an `#url`, the plugin will attempt to HTTP POST each location to your server **as it is recorded**. If you set `autoSync: false`, it's up to you to **manually** execute the `#sync` method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute `#sync`). |
| [`autoSyncThreshold`](#param-integer-autosyncthreshold-0) | `Integer` | Optional | `0` | The minimum number of persisted records to trigger an `autoSync` action. |
| [`batchSync`](#param-string-batchsync-false) | `Boolean` | Optional | `false` | If you've enabled HTTP feature by configuring an `#url`, `batchSync: true` will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request. With `batchSync: false`, an HTTP POST request will be initiated for **each** location in database. |
| [`maxBatchSize`](#param-integer-maxbatchsize-undefined) | `Integer` | Optional | `-1` | If you've enabled HTTP feature by configuring an `#url` and `batchSync: true`, this parameter will limit the number of records attached to each batch.  If the current number of records exceeds the `maxBatchSize`, multiple HTTP requests will be generated until the location queue is empty. |
| [`maxDaysToPersist`](#param-integer-maxdaystopersist) | `Integer` | Optional | `1` | Maximum number of days to store a geolocation in plugin's SQLite database when your server fails to respond with `HTTP 200 OK`. The plugin will continue attempting to sync with your server until `maxDaysToPersist` when it will give up and remove the location from the database. |

## Application Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| [`debug`](#param-boolean-debug-false) | `Boolean` | Optional | `false` | When enabled, the plugin will emit sounds for life-cycle events of background-geolocation! **NOTE iOS**: In addition, you must manually enable the *Audio and Airplay* background mode in *Background Capabilities* to hear these debugging sounds. |
| [`logLevel`](#param-integer-loglevel-5) | `Integer` | Optional **iOS** | `LOG_LEVEL_VERBOSE` | Filters the logs by `logLevel`: `LOG_LEVEL_OFF`, `LOG_LEVEL_ERROR`, `LOG_LEVEL_WARNING`, `LOG_LEVEL_INFO`, `LOG_LEVEL_DEBUG`, `LOG_LEVEL_VERBOSE` |
| [`logMaxDays`](#param-integer-logmaxdays-3) | `Integer` | Optional **iOS** | `3` | Maximum days to persist a log-entry in database. |
| [`stopOnTerminate`](#param-boolean-stoponterminate-true) | `Boolean` | Optional | `true` | Enable this in order to force a stop() when the application is terminated |
| [`startOnBoot`](#param-boolean-startonboot-false) | `Boolean` | Optional | `true` | Set to `false` to enable background-tracking after the device reboots. |
| [`preventSuspend`](#param-boolean-preventsuspend-false) | `Boolean` | Optional | `false` | Enable this to prevent **iOS** from suspending.  Must be used in conjunction with a `heartbeatInterval`.  **WARNING**: `preventSuspend` should only be used in **very** specific use-cases and should typically **not** be used as it will have a **very serious impact on battery performance.** |
| [`heartbeatInterval`](#param-integer-heartbeatinterval-60) | `Integer(seconds)` | Optional **iOS** | `60` | Used in conjunction with `preventSuspend`, an **iOS** app can continue to monitor the accelerometer while in the **stationary-state**.  If the *slightest* movement is detected during a `hearbeatInterval`, the plugin will request a high-accuracy location in order to determine if the device has begun moving.  If the plugin *is* moving, it will immediately switch state to **moving-state**.|
| [`schedule`](#param-array-schedule-undefined) | `Array` | Optional | `undefined` | Defines a schedule to automatically start/stop tracking at configured times |

## Events

The following events can all be listened-to via the method `#on(eventName, callback)`, eg:
```Javascript
var onLocation = function(location) {
    console.log('- Location changed: ', location);
};
bgGeo.on('location', onLocation);
```

As well as corresponding `#un` method for removing listeners:
```Javascript
bgGeo.un('location', onLocation);
```

| Event Name | Notes
|---|---|
| [`location`](#location) | Fired whenever a new location is recorded. |
| [`error`](#error) | Fired whenever an error occurs (eg: `location`, `geofence`) |
| [`motionchange`](#motionchange) | Fired when the device changes stationary / moving state. |
| [`activitychange`](#activitychange) | Fired when the activity-recognition system detects a *change* in detected-activity (`still, on_foot, in_vehicle, on_bicycle, running`) |
| [`providerchange`](#providerchange)| Fired when a change in the state of the device's **Location Services** has been detected.  eg: "GPS ON", "Wifi only".|
| [`geofence`](#geofence) | Fired when a geofence crossing event occurs. |
| [`geofenceschange`](#geofenceschange) | Fired when the lists of monitored geofences changed.|
| [`http`](#http) | Fired after a successful HTTP response. `response` object is provided with `status` and `responseText`. |
| [`heartbeat`](#heartbeat) | Fired each `heartbeatInterval` while the plugin is in the **stationary** state with.  Your callback will be provided with a `params {}` containing the parameters `shakes {Integer}` (#shakes not implemented for Android), `motionType {String}`,  `location {Object}` |
| [`schedule`](#schedule) | Fired when a schedule event occurs.  Your `callbackFn` will be provided with the current `state` Object. | 

## Methods

| Method Name | Arguments | Notes
|---|---|---|
| [`on`](#oncallback) | `Function` | Add an event-listener |
| [`un`](#uncallback) | `Function` | Remove an event-listener |
| [`configure`](#configureobject-callback) | `{config}` | Configures the plugin's parameters (@see following Config section for accepted config params. The locationCallback will be executed each time a new Geolocation is recorded and provided with the following parameters. |
| [`setConfig`](#setconfigobject) | `{config}` | Re-configure the plugin with new values. |
| [`start`](#startcallbackfn) | `callbackFn`| Enable location tracking. Supplied `callbackFn` will be executed when tracking is successfully engaged. |
| [`stop`](#stop) | `callbackFn` | Disable location tracking. Supplied `callbackFn` will be executed when tracking is successfully engaged. |
| [`startSchedule`](#stopschedulecallbackfn) | `callbackFn` | If a `schedule` was configured, this method will initiate that schedule.  The plugin will automatically be started or stopped according to the configured `schedule`.    Supplied `callbackFn` will be executed once the Scheduler has parsed and initiated your `schedule` |
| [`stopSchedule`](#stopschedulecallbackfn) | `callbackFn` | This method will stop the Scheduler service.  It will also execute the `#stop` method and **cease all tracking**.  Your `callbackFn` will be executed after the Scheduler has stopped |
| [`startGeofences`](#startgeofencescallbackfn) | `callbackFn` | Engages the geofences-only `trackingMode`.  In this mode, no active location-tracking will occur -- only geofences will be monitored|
| [`getState`](#getstatecallbackfn) | `callbackFn` | Fetch the current-state of the plugin, including `enabled`, `isMoving`, as well as all other config params. |
| [`getCurrentPosition`](#getcurrentpositionoptions-successfn-failurefn) | `{options}, `successFn`, `failureFn` | Retrieves the current position. This method instructs the native code to fetch exactly one location using maximum power & accuracy. |
| [`watchPosition`](#watchpositionsuccessfn-failurefn-options) | `successFn`, `failureFn`, `{options}` | Start a stream of continuous location-updates.  The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured `#url` (if you've enabled the HTTP features).|
| [`stopWatchPosition`](#stopwatchpositionsuccessfn-failurefn-options) | `successFn`, `failureFn`, `{options}` | Halt `watchPosition` updates. |
| [`changePace`](#changepaceboolean) | `isMoving` | Initiate or cancel immediate background tracking. When set to true, the plugin will begin aggressively tracking the devices Geolocation, bypassing stationary monitoring. If you were making a "Jogging" application, this would be your [Start Workout] button to immediately begin GPS tracking. Send false to disable aggressive GPS monitoring and return to stationary-monitoring mode. |
| [`getLocations`](#getlocationscallbackfn) | `callbackFn` | Fetch all the locations currently stored in native plugin's SQLite database. Your callbackFn`` will receive an `Array` of locations in the 1st parameter. |
| [`getCount`](#getcountcallbackfn-failurefn) | `callbackFn` | Fetches count of SQLite locations table `SELECT count(*) from locations` |
| [`clearDatabase`](#cleardatabasecallbackfn-failurefn) | `callbackFn` | Delete all records in plugin's SQLite database |
| [`insertLocation`](#insertlocationcallbackfn-failurefn) | `callbackFn` | Manually insert a location into the native plugin's SQLite database.  Your `callbackFn`` will be executed if the operation was successful.  The inserted location's schema must match this plugin's published [Location Data Schema](wiki/Location-Data-Schema).  The plugin will have no problem inserting a location retrieved from the plugin itself. |
| [`sync`](#synccallbackfn) | - | If the plugin is configured for HTTP with an `#url` and `#autoSync: false`, this method will initiate POSTing the locations currently stored in the native SQLite database to your configured `#url`. |
| [`getOdometer`](#getodometercallbackfn) | `callbackFn` | The plugin constantly tracks distance travelled. The supplied callback will be executed and provided with a `distance` as the 1st parameter. |
| [`setOdometer`](#setodometervalue-callbackfn-failurefn) | `callbackFn` | Set the `odometer` to *any* arbitrary value.  **NOTE** `setOdometer` will perform a `getCurrentPosition` in order to record to exact location where odometer was set; as a result, the `callback` signatures are identical to those of `getCurrentPosition`.|
| [`resetOdometer`](#resetodometercallbackfn) | `callbackFn` | Reset the **odometer** to `0`.  Alias for [`setOdometer(0)`](#setodometervalue-callbackfn-failurefn)|
| [`playSound`](#playsoundsoundid) | `soundId` | Here's a fun one. The plugin can play a number of OS system sounds for each platform. For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html). I offer this API as-is, it's up to you to figure out how this works. |
| [`addGeofence`](#addgeofenceobject) | `{config}` | Adds a geofence to be monitored by the native plugin. Monitoring of a geofence is halted after a crossing occurs. |
| [`addGeofences`](#addgeofencesgeofences-callbackfn-failurefn) | `{geofences}` | Adds a list geofences to be monitored by the native plugin. Monitoring of a geofence is halted after a crossing occurs.|
| [`removeGeofence`](#removegeofenceidentifier-successfn-failurefn) | `identifier`, `successFn`, `failureFn` | Removes a geofence identified by the provided `identifier`. |
| [`removeGeofences`](#removegeofences-callbackfn-failurefn) |  | Removes all geofences |
| [`getGeofences`](#getgeofencescallbackfn) | `callbackFn` | Fetch the list of monitored geofences. Your callbackFn will be provided with an Array of geofences. If there are no geofences being monitored, you'll receive an empty `Array []`.|
| [`getLog`](#getlogcallbackfn) | `calbackFn` | Fetch the entire contents of the current circular log and return it as a String.|
| [`destroyLog`](#destroylogcallbackfnfailurefn) | `calbackFn`,`failureFn` | Destroy the contents of the Log database. |
| [`emailLog`](#emaillogemail-callbackfn) | `email`, `callbackFn` | Fetch the entire contents of the current circular log and email it to a recipient using the device's native email client.|
| [`beginBackgroundTask`](#beginBackgroundTaskcallbackfn) | `callbackFn`| Begins a native background-task (180s maximum allowed time).  For long-running methods which may execute asynchronous XHR requests, such as #sync or #getLocations, you should wrap your method-calls in a backgroundTask so that iOS does not suspend the app before your async request is complete. |
| [`finish`](#finishtaskId) | `taskId`| Signal completion of a background-task initiated from #beginBackgroundTask.  It's **crucial** that you finish background-tasks because iOS will kill your app if you exceed the 180s limit.|


# Geolocation Options

####`@param {Integer} desiredAccuracy [0, 10, 100, 1000] in meters`

Specify the desired-accuracy of the geolocation system with 1 of 4 values, `0, 10, 100, 1000` where `0` means HIGHEST POWER, HIGHEST ACCURACY and `1000` means LOWEST POWER, LOWEST ACCURACY

- [iOS](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instp/CLLocationManager/desiredAccuracy)

####`@param {Integer} distanceFilter`

The minimum distance (measured in meters) a device must move horizontally before an update event is generated. @see [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/distanceFilter). However, #distanceFilter is elastically auto-calculated by the plugin:  When speed increases, #distanceFilter increases;  when speed decreases, so does distanceFilter.

`distanceFilter` is auto calculated by rounding speed to the nearest `5 m/s` and adding `distanceFilter` meters for each `5 m/s` increment.

For example, at biking speed of 7.7 m/s with a configured `distanceFilter: 30`:
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

Note the following real example of background-geolocation on highway 101 towards San Francisco as the driver slows down as he runs into slower traffic (geolocations become compressed as distanceFilter decreases).

![distanceFilter at highway speed](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/distance-filter-highway.png)

Compare now background-geolocation in the scope of a city. In this image, the left-hand track is from a cab-ride, while the right-hand track is walking speed.

![distanceFilter at city scale](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/distance-filter-city.png)

####`@param {Integer} stopAfterElapsedMinutes`

The plugin can optionally auto-stop monitoring location when some number of minutes elapse after being the #start method was called.

####`@param {Integer} stationaryRadius (meters)`

When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage. Note, since the plugin uses iOS significant-changes API, the plugin cannot detect the exact moment the device moves out of the stationary-radius. In normal conditions, it can take as much as 3 city-blocks to 1/2 km before staionary-region exit is detected.

####`@param {Boolean} disableElasticity [false]`

Defaults to `false`. Set `true` to disable automatic speed-based `#distanceFilter` elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km.

####`@param {String} activityType [AutomotiveNavigation, OtherNavigation, Fitness, Other]`

Presumably, this affects ios GPS algorithm. See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information

####`@param {Boolean} useSignificantChangesOnly [false]`

Defaults to `false`. Set `true` in order to disable constant background-tracking and use only the iOS [Significant Changes API](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges). If Apple has denied your application due to background-tracking, this can be a solution. **NOTE** The Significant Changes API will report a location only when a significant change from the last location has occurred. Many of the configuration parameters **will be ignored**, such as `#distanceFilter`, `#stationaryRadius`, `#activityType`, etc.

Set `true` to disable iOS `CMMotionActivity` updates (eg: walking, running, vehicle, biking, stationary)

# Activity Recognition Options

####`@param {Integer millis} [10000] activityRecognitionInterval`

Defaults to `10000` (10 seconds). The desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of 0 will result in activity detections at the fastest possible rate.

####`@param {Integer millis} minimumActivityRecognitionConfidence`

Each activity-recognition-result returned by the API is tagged with a "confidence" level expressed as a %. You can set your desired confidence to trigger a state-change. Defaults to `80`.

####`@param {Integer minutes} stopTimeout`

The number of miutes to wait before turning off the GPS after the ActivityRecognition System (ARS) detects the device is `STILL` (**iOS:** defaults to 5min). If you don't set a value, the plugin is eager to turn off the GPS ASAP. An example use-case for this configuration is to delay GPS OFF while in a car waiting at a traffic light. **iOS Stop-detection timing**
![](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/ios-stop-detection-timing.png)

####`@param {Integer minutes} stopDetectionDelay [0]`

Allows the stop-detection system to be delayed from activating. When the stop-detection system is engaged, the GPS is off and only the accelerometer is monitored. Stop-detection will only engage if this timer expires. The timer is cancelled if any movement is detected before expiration. If a value of `0` is specified, the stop-detection system will engage as soon as the device is detected to be stationary.

####`@param {Boolan} disableMotionActivityUpdates [false]`

Set `true` to disable iOS [`CMMotionActivity`](https://developer.apple.com/reference/coremotion/cmmotionactivitymanager) updates (eg: "walking", "in_vehicle").  This feature requires a device having the **M7** co-processor (ie: iPhone 5s and up).  **NOTE** This feature will ask the user for "Health updates".  :warning: The plugin is **HIGHLY** optimized for motion-activity-updates.  If you **do** disable this, the plugin *will* drain more battery power.  You are **STRONGLY** advised against disabling this.  You should explain to your users with the `NSMotionUsageDescription` in the iOS `.plist`, for example:
> "Accelerometer use increases battery efficiency by intelligently toggling location-tracking"

If you do not wish to ask the user for the "Health updates", set this option to `true`; However, you will no longer receive accurate activity data in the recorded locations.

####`@param {Boolean} disableStopDetection [false]`

Disable iOS accelerometer-based **Stop-detection System**.  When disabled, the plugin will use the default iOS behaviour of automatically turning off location-services when the device has stopped for exactly 15 minutes.  When disabled, you will no longer have control over `stopTimeout`.

####`@param {Boolean} pausesLocationUpdatesAutomatically [true]`

The default behaviour of the plugin is to turn **off** location-services *automatically* when the device is detected to be stationary.  When set to `false`, location-services will **never** be turned off (and `disableStopDetection` will automatically be set to `true`) -- it's your responsibility to turn them off when you no longer need to track the device.  This feature should **not** generally be used.  `preventSuspend` will no longer work either.

####`@param {String} locationAuthorizationRequest [Always]`

The desired iOS location-authorization request, either `Always` or `WhenInUse`.  Defaults to `Always`.  You'll have to edit the corresponding key in your app's `Info.plist`, `NSLocationAlwaysUsageDescription` or `NSWhenInUseUsageDescription`.  `WhenInUse` will display a **blue bar** at top-of-screen informing user that location-services are on.

####`@param {Object} locationAuthorizationAlert`
When you configure the plugin location-authorization `Always` or `WhenInUse` and the user changes the value in the app's location-services settings or disabled location-services, the plugin will display an Alert directing the user to the **Settings** screen.  This config allows you to configure all the Strings for that Alert popup and accepts an `{Object}` containing the following keys:

######@param {String} titleWhenOff [Location services are off] 
The title of the alert if user changes, for example, the location-request to `WhenInUse` when you requested `Always`.
######@param {String} titleWhenNotEnabled [Background location is not enabled] 
The title of the alert when user disables location-services or changes the authorization request to `Never`
######@param {String} instructions [To use background location, you must enable '{locationAuthorizationRequest}' in the Location Services settings]
The body text of the alert.
######@param {String} cancelButton [Cancel]
######@param {String} settingsButton [Settings]

![](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/docs-locationAuthorizationAlert.jpg)

```Javascript
bgGeo.configure({
  locationAuthorizationAlert: {
    titleWhenNotEnabled: "Yo, location-services not enabled",
    titleWhenOff: "Yo, location-services OFF",
    instructions: "You must enable 'Always' in location-services, buddy",
    cancelButton: "Cancel",
    settingsButton: "Settings"
  }
})
```

# Geofencing Options

####`@param {Integer} geofenceProximityRadius (meters)`

Also see [geofenceschange](#geofenceschange).  When using Geofences, the plugin activates only thoses in proximity (the maximim geofences allowed to be simultaneously monitored is limited by the platform, where **iOS** allows only 20 and **Android**.  However, the plugin allows you to create as many geofences as you wish (thousands even).  It stores these in its database and uses spatial queries to determine which **20** or **100** geofences to activate.

![](https://dl.dropboxusercontent.com/u/2319755/background-geolocation/images/geofenceProximityRadius_iphone6_spacegrey_portrait.png)

####`@param {Boolean} geofenceInitialTriggerEntry [true]`

Defaults to `true`.  Set `false` to disable triggering a geofence immediately if device is already inside it.

# HTTP / Persistence Options

####`@param {String} url [undefined]`

Your server url where you wish to HTTP POST location data to.

####`@param {String} method [POST]`

The HTTP method to use when creating an HTTP request to your configured `#url`. Defaults to `POST`. Valid values are `POST`, `PUT` and `OPTIONS`.

####`@param {String} batchSync [false]`

Default is `false`. If you've enabled HTTP feature by configuring an `#url`, `batchSync: true` will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request. With `batchSync: false`, an HTTP POST request will be initiated for **each** location in database.

####`@param {Integer} maxBatchSize [undefined]`

If you've enabled HTTP feature by configuring an `#url` with `batchSync: true`, this parameter will limit the number of records attached to **each** batch request.  If the current number of records exceeds the `maxBatchSize`, multiple HTTP requests will be generated until the location queue is empty.

####`@param {String} autoSync [true]`

Default is `true`. If you've enabeld HTTP feature by configuring an `#url`, the plugin will attempt to HTTP POST each location to your server **as it is recorded**. If you set `autoSync: false`, it's up to you to **manually** execute the `#sync` method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute `#sync`).

####`@param {String} autoSync [true]`

Default is `true`. If you've enabeld HTTP feature by configuring an `#url`, the plugin will attempt to HTTP POST each location to your server **as it is recorded**. If you set `autoSync: false`, it's up to you to **manually** execute the `#sync` method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute `#sync`).

####`@param {Object} params`

Optional HTTP params sent along in HTTP request to above `#url`.

####`@param {Object} headers`

Optional HTTP params sent along in HTTP request to above `#url`.

####`@param {Object} extras`

Optional arbitrary key/value `{}` to attach to each recorded location

Eg: Every recorded location will have the following `extras` appended:
```Javascript
bgGeo.configure(success, fail, {
  .
  .
  .
  extras: {route_id: 1234}
});
```

####`@param {Integer} maxDaysToPersist [1]`

Maximum number of days to store a geolocation in plugin's SQLite database when your server fails to respond with `HTTP 200 OK`. The plugin will continue attempting to sync with your server until `maxDaysToPersist` when it will give up and remove the location from the database.

####`@param {Integer} maxRecordsToPersist [-1]`

Maximum number of records to persist in plugin's SQLite database.  Default `-1` means no limit.

# Application Options

####`@param {Boolean} debug [false]`

When enabled, the plugin will emit sounds for life-cycle events of background-geolocation!  **NOTE iOS**:  In addition, you must manually enable the *Audio and Airplay* background mode in *Background Capabilities* to hear these [debugging sounds](../../../wiki/Debug-Sounds). See the [Debug Sounds](../../../wiki/Debug-Sounds) for a detailed description of these sounds.

####`@param {Integer} logLevel [5]`

Set the log-filter `logLevel`.  @see [`getLog`](#getlogcallbackfn) / [`emailLog`](#emaillogemail-callbackfn).

| logLevel | Label |
|---|---|
|`0`|`LOG_LEVEL_OFF`|
|`1`|`LOG_LEVEL_ERROR`|
|`2`|`LOG_LEVEL_WARNING`|
|`3`|`LOG_LEVEL_INFO`|
|`4`|`LOG_LEVEL_DEBUG`|
|`5`|`LOG_LEVEL_VERBOSE`|

These log-levels are defined as **constants** on the `BackgroundGeolocation` object:

```Javascript
bgGeo.configure({
  logLevel: bgGeo.LOG_LEVEL_WARNING
});
```

####`@param {Integer} logMaxDays [3]`

Maximum number of days to persist a log-entry in database.  Defaults to `3` days.

####`@param {Boolean} stopOnTerminate [true]`
Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app). On Android, `stopOnTerminate: false` will cause the plugin to operate as a headless background-service (in this case, you should configure an #url in order for the background-service to send the location to your server)

####`@param {Boolean} startOnBoot [false]`

Set to `true` to enable background-tracking after the device reboots.

**iOS** 
iOS cannot immediately engage tracking after a device reboot since it requires either a "significant-change" event or geofence exit before iOS will awaken your app.  One can also use the [background-fetch plugin](https://github.com/christocracy/cordova-plugin-background-fetch) to *at least* awaken your app within 15 min of being rebooted.

####`@param {Boolean} preventSuspend [false]`

Enable this to prevent **iOS** from suspending after location-services have been switch off.  Must be used in conjunction with a `heartbeatInterval`.  **WARNING**: `preventSuspend` should **only** be used in **very** specific use-cases and should typically **not** be used as it will have a **very serious impact on battery performance.**

####`@param {Integer} heartbeatInterval [60]`

Used in conjunction with `preventSuspend`, an **iOS** app can continue to monitor the accelerometer while in the **stationary-state** (ie: after location-services have been turned off).  If the *slightest* movement is detected during a `hearbeatInterval`, the plugin will request a high-accuracy location in order to determine if the device has begun moving.  If the device *is* moving, it will immediately switch state to **moving-state**.

####`@param {Array} schedule [undefined]`

Provides an automated schedule for the plugin to start/stop tracking at pre-defined times.  The format is cron-like:

```Javascript
  "{DAY(s)} {START_TIME}-{END_TIME}"
```

The `START_TIME`, `END_TIME` are in **24h format**.  The `DAY` param corresponds to the `Locale.US`, such that Sunday=1; Saturday=7).  You may configure a single day (eg: `1`), a comma-separated list-of-days (eg: `2,4,6`) or a range (eg: `2-6`), eg:

```Javascript
bgGeo.configure({
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
    bgGeo.startSchedule(function() {
        console.info('- Scheduler started');
    });
});

// Listen to "schedule" events:
bgGeo.on('schedule', function(state) {
  console.log('- Schedule event, enabled:', state.enabled);
  
  if (state.enabled) {
    // tracking started!
  } else {
    // tracking stopped
  }
});

// Later when you want to stop the Scheduler (eg: user logout)
bgGeo.stopSchedule(function() {
  console.info('- Scheduler stopped');
});

// Or modify the schedule with usual #setConfig method
bgGeo.setConfig({
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

# Events

The following events can all be listened-to via the method `#on(eventName, callback)`, supplying `location`, `motionchange`, `error`, `geofence` or `http`, `activitychange` for `eventName`.

####`location`
Your `callbackFn` will be executed each time the plugin records a new location. The `callbackFn` will be provided with the following parameters:

:exclamation: When performing a `motionchange` or `getCurrentPosition`, the plugin requests **multiple** location *samples* in order to record the most accurate location possible.  These *samples* are **not** persisted to the database but they will be provided to your `location` listener, for your convenience, since it can take some seconds for the best possible location to arrive.  For example, you might use these samples to progressively update the user's position on a map.  You can detect these *samples* in your `callbackFn` via `location.sample === true`.  If you're manually `POST`ing location to your server, you should ignore these locations.

######@param {Object} location (see Wiki [Location Data Schema](../../..//wiki/Location-Data-Schema))

```Javascript
bgGeo.on('location', (function(location) {
    var coords = location.coords;

    console.log("- Location: " + JSON.stringify(location));
});

```

####`error`
Your `callbackFn` will be executed each time an error occurs. The `callbackFn` will be provided a single `{Object}` parameter containing the following properties:

######@param {String} type ["location" | "geofence"] The type of error
######@param {Number} code See Wiki [Error Codes](../../../wiki/Error-Codes) for details.

eg:
```Javascript
bgGeo.on('error', function(error) {
  var type = error.type;
  var code = error.code;
  alert(type + " Error: " + code);
});

// or using alternate syntax:

bgGeo.on("error", function(error) {
    alert(error.type + " error: " + error.code);
});

```

####`motionchange`
Your `callbackFn` will be executed each time the device has changed-state between **MOVING** or **STATIONARY**. The `callbackFn` will be provided with a `Location` object as the 1st param, with the usual params (`latitude, longitude, accuracy, speed, bearing, altitude`).

######@param {Boolean} isMoving `false` if entered **STATIONARY** mode; `true` if entered **MOVING** mode.
######@param {Object} location The location at the state-change.

```Javascript
bgGeo.on('motionchange', function(isMoving, location) {
    if (isMoving) {
        console.log('Device has just started MOVING', location);
    } else {
        console.log('Device has just STOPPED', location);
    }
})

```

####`activitychange`
Your `callbackFn` will be executed each time the activity-recognition system detects a *change* in detected-activity (`still, on_foot, in_vehicle, on_bicycle, running`).

######@param {String still | on_foot | in_vehicle | on_bicycle | running | unknown} activityName 

```Javascript
bgGeo.on('activitychange', function(activityName) {
    console.log('- Activity changed: ', activityName);
});
```

####`providerchange`
Fired when a change in the state of the device's **Location Services** has been detected.  eg: "GPS ON", "Wifi only".  Your `callbackFn` will be provided with an `{Object} provider` containing the following properties.  The plugin will **automatically** fetch the current location where the `providerchange` occurred and persist that location to the database, appending the `#provider` information to the JSON object.  This will be synced to your configured `#url` just like any other recorded location.

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Screenshot_20160718-223448.png)

######@param {Boolean} enabled Whether location-services is enabled
######@param {Boolean} gps Whether gps is enabled (**Not supported on iOS**)
######@param {Boolean} wifi Whether wifi geolocation is enabled (**Not supported on iOS**)

```Javascript
bgGeo.on('providerchange', function(provider) {
    console.log('- Provider Change: ', provider);
    console.log('  enabled: ', provider.enabled);
    console.log('  gps: ', provider.gps);
    console.log('  wifi: ', provider.wifi);
});
```

####`geofence`
Adds a geofence event-listener. Your supplied callback will be called when any monitored geofence crossing occurs. The `callbackFn` will be provided the following parameters:

######@param {Object} params. This object contains 2 keys: `@param {String} identifier`, `@param {String} action [ENTER|EXIT]` and `@param {Object} location`.

```Javascript
bgGeo.on('geofence', function(params) {
    try {
        var location = params.location;
        var identifier = params.identifier;
        var action = params.action;

        console.log('A geofence has been crossed: ', identifier);
        console.log('ENTER or EXIT?: ', action);
        console.log('location: ', JSON.stringify(location));
    } catch(e) {
        console.error('An error occurred in my application code', e);
    }
});
```

####`geofenceschange`

Your `callbackFn` will be provided a single `{Object} event` parameter:

######@param {Array} on. This list of new geofences which just became monitored
######@param {Array} off. This list of geofences which stop being monitored.

Fired when the list of monitored-geofences changed.  For more information, see [Geofencing](./geofencing.md).  The Background Geolocation plugin contains powerful geofencing features that allow you to monitor any number of circular geofences you wish (thousands even), in spite of limits imposed by the native platform APIs (**20 for iOS; 100 for Android**).

The plugin achieves this by storing your geofences in its database, using a [geospatial query](https://en.wikipedia.org/wiki/Spatial_query) to determine those geofences in proximity (@see config [geofenceProximityRadius](#param-integer-geofenceproximityradius-meters)), activating only those geofences closest to the device's current location (according to limit imposed by the corresponding platform).

When the device is determined to be moving, the plugin periodically queries for geofences in proximity (eg. every minute) using the latest recorded location.  This geospatial query is **very fast**, even with tens-of-thousands geofences in the database.

It's when this list of monitored geofences *changes*, the plugin will fire the `geofenceschange` event.

```Javascript
bgGeo.on('geofenceschange', function(event) {
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

This `event` object provides only the *changed* geofences, those which just activated or de-activated.

When **all** geofences have been removed, the event object will provide an empty-array `[]` for both `#on` and `#off` keys, ie:
```Javascript
{
    on: [{}, {}, ...],  // <-- Entire geofence objects {}
    off: ['identifier_foo', 'identifier_bar']  <-- just the identifiers
}
```

```Javascript
bgGeo.on('geofenceschange', function(event) {
  console.log("geofenceschange fired! ", event);
});

// calling remove geofences will cause the `geofenceschange` event to fire
bgGeo.removeGeofences();

=> geofenceschange fired! {on: [], off: []}

```

####`http`

The `callbackFn` will be executed for each HTTP request. The `callbackFn` will be provided a single `response {Object}` parameter with the following properties:

######@param {Integer} status. The HTTP status
######@param {String} responseText The HTTP response as text.

Example:
```Javascript
bgGeo.on('http', function(response) {
    var status = response.status;
    var responseText = response.responseText;
    var res = JSON.parse(responseText);  // <-- if your server returns JSON

    console.log("- HTTP success", status, res);

})
```

####`heartbeat`

The `callbackFn` will be executed for each `heartbeatInterval` while the device is in **stationary** state (**iOS** requires `{preventSuspend: true}` as well).  The `successFn` will be provided a single `params {Object}` parameter with the following properties:

######@param {Integer} shakes (iOS only).  A measure of the device movement.  Shakes is a measure of accelerometer data crossing over a threshold where the device is decided to be moving.  The higher the shakes, the more the device is moving.  When shakes is **0**, the device is completely still.
######@param {String} motionType.  The current motion-type `still, on_foot, running, on_bicycle, in_vehicle, shaking, unknown`
######@param {Object} location.  When the plugin detects `shakes > 0` (iOS only), it will always request a new high-accuracy location in order to determine if the device has moved beyond `stationaryRadius` and if the location has `speed > 0`.  This fresh location will be provided to your `successFn`.  If `shakes == 0`, the current **stationary location** will be provided.  Android will simply return the "last known location"

Example:
```Javascript
bgGeo.on('heartbeat', function(params) {
    console.log('- hearbeat');

    var shakes = params.shakes;
    var location = params.location;

    // Attach some arbitrary data to the location extras.
    location.extras = {
        foo: 'bar',
        shakes: shakes
    };

    // You can manually insert a location if you wish.
    bgGeo.insertLocation(location, function() {
        console.log('- inserted location during heartbeat');
    });

    // OR you could request a new location:
    bgGeo.getCurrentPosition(function(location, taskId) {
        console.log('- current location: ', location);
        bgGeo.finish(taskId);
    });
})
```

####`schedule`

The `callbackFn` will be executed for each time a `schedule` event occurs.  Your `callbackFn` will be provided with the current `state` object (@see [#getState](#getstatecallbackfn)).  `state.enabled` will reflect the state according to your configured `schedule`.

######@param {Object} State

Example:
```Javascript
bgGeo.on('schedule', function(state) {
    console.log('- A schedule event fired: ', state.enabled);
    console.log('- Current state: ', state);
})
```

# Methods

####`on(callback)`

Add an event-listener

```Javascript
    componentWillMount() {
        BackgroundGeolocation.on("location", this.onLocation);
        .
        .
        .
    }
    onLocation(location) {
        console.log('- Location: ', location);
    }
```

####`un(callback)`

Remove an event-listener.

```Javascript
    componentWillUnmount() {
        BackgroundGeolocation.un("location", this.onLocation);
    }
```

####`configure({Object}, callback)`

Configures the plugin's initial parameters. You must call this method **before** using the plugin and call it **only once**.  The `callback` will be called after the configuration has been applied and provided with the current `state` object.  **NOTE** The plugin persists its `enabled` state between app restarts/device reboots and will automatically call `#start` upon itself once `#configure` is executed.  You can check the current state in the `callback` with `state.enabled`.

```Javascript
bgGeo.configure({
    distanceFilter: 50,
    desiredAccuracy: 0,
    stationaryRadius: 25
}, function(state) {
    console.log('- Configure success.  Current state: ', state);
});
```

####`setConfig({Object})`
Reconfigure plugin's configuration.

```Javascript
bgGeo.setConfig({
    desiredAccuracy: 10,
    distanceFilter: 100
}, function(state) {
    console.log('- setConfig success.  Current state: ', state);
});
```

####`start(callbackFn)`

Enable background geolocation tracking. `callbackFn` will be executed after plugin has been started.

```Javascript
bgGeo.start(function() {
  alert('Background Geolocation has started');
});
```

####`stop`

Disable background geolocation tracking.

```Javascript
bgGeo.stop();
```

####`startSchedule(callbackFn)`

If a `schedule` was configured, this method will initiate that schedule.  The plugin will automatically be started or stopped according to the configured `schedule`.  

```Javascript
bgGeo.startSchedule(function() {
    console.log('- Scheduler started');
});
```

####`stopSchedule(callbackFn)`

This method will stop the Scheduler service.  It will also execute the `#stop` method and **cease all tracking**.

```Javascript
bgGeo.stopSchedule(function() {
    console.log('- Scheduler stopped');
});
```

####`startGeofences(callbackFn)`

Engages the geofences-only `trackingMode`.  In this mode, no active location-tracking will occur -- only geofences will be monitored.  To stop monitoring "geofences" `trackingMode`, simply use the usual `#stop` method.  The `state` object now contains the new key `trackingMode [location|geofence]`.

Your `callbackFn` will be provided with the current state `{Object}`.

```Javascript

bgGeo.configure(config, function(state) {
    // Add some geofences.
    bgGeo.addGeofences([
        notifyOnExit: true,
        radius: 200,
        identifier: 'ZONE_OF_INTEREST',
        latitude: 37.234232,
        longitude: 42.234234 
    ]);

    if (!state.enabled) {
        bgGeo.startGeofences(function(state) {
            console.log('- Geofence-only monitoring started', state.trackingMode);
        });
    }
});

// Listen to geofences
bgGeo.on('geofence', function(params) {
    if (params.identifier == 'ZONE_OF_INTEREST') {
        // If you wish, you can choose to engage location-tracking mode when a 
        // particular geofence event occurs.
        bgGeo.start();
    }
    bgGeo.finish();
});
```

####`getState(callbackFn)`

Fetch the current-state of the plugin, including all configuration parameters.

```Javascript
bgGeo.getState(function(state) {
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

####`getCurrentPosition({options}, successFn, failureFn)`
Retrieves the current position. This method instructs the native code to fetch exactly one location using maximum power & accuracy. The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured `#url` (if you've enabled the HTTP features). In addition to your supplied `callbackFn`, the plugin will also execute the `callback` provided to `#configure`.

If an error occurs while fetching the location, the `failureFn` will be executed with an `Integer` [Error Code](../../../wiki/Location-Error-Codes) as the first argument.

#### Options

######@param {Integer} timeout [30]
An optional location-timeout.  If the timeout expires before a location is retrieved, the `failureFn` will be executed.
######@param {Integer millis} maximumAge [0]
Accept the last-recorded-location if no older than supplied value in milliseconds.
######@param {Boolean} persist [true]
Defaults to `true`.  Set `false` to disable persisting the retrieved location in the plugin's SQLite database.
######@param {Integer} samples [3]
Sets the maximum number of location-samples to fetch.  The plugin will return the location having the best accuracy to your `successFn`.  Defaults to `3`.  Only the final location will be persisted.
######@param {Integer} desiredAccuracy [stationaryRadius]
Sets the desired accuracy of location you're attempting to fetch.  When a location having `accuracy <= desiredAccuracy` is retrieved, the plugin will stop sampling and immediately return that location.  Defaults to your configured `stationaryRadius`.
######@param {Object} extras
Optional extra-data to attach to the location.  These `extras {Object}` will be merged to the recorded `location` and persisted / POSTed to your server (if you've configured the HTTP Layer).

#### Callback

######@param {Object} location The Location data

```Javascript
bgGeo.getCurrentPosition({
  persist: true,
  timeout: 30,      // 30 second timeout to fetch location
  samples: 5,       // Fetch maximum 5 location samples
  maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
  desiredAccuracy: 10,  // Fetch a location with a minimum accuracy of `10` meters.
  extras: {       // [Optional] Attach your own custom `metaData` to this location. This metaData will be persisted to SQLite and POSTed to your server
    foo: "bar"
  }
}, function(location) {
    // This location is already persisted to plugin’s SQLite db.
    // If you’ve configured #autoSync: true, the HTTP POST has already started.
    console.log(“- Current position received: “, location);
}, function(errorCode) {
    alert('A location error occurred: ' + errorCode);
});

```

If a location failed to be retrieved, you `failureFn` will be executed with an error-code parameter

| Error | Reason | Code |
|---|---|---|
| kCLErrorLocationUnknown | Could not fetch location | 0 |
| kCLErrorDenied | The user disabled location-services in Settings | 1 |
| kCLErrorNetwork | Network error | 2 |
| kCLErrorHeadingFailure | - | 3 |
| kCLErrorRegionMonitoringDenied | User disabled region-monitoring in Settings | 4 |
| kCLErrorRegionMonitoringFailure | Installed in a device with no region-monitoring capability | 5 |
| kCLErrorRegionMonitoringSetupDelayed | - | 6 |
| kCLErrorRegionMonitoringResponseDelayed | - | 7 |
| kCLErrorDeferredFailed | - | 11 |
| kCLErrorDeferredNotUpdatingLocation | - | 12 |
| kCLErrorDeferredAccuracyTooLow | - | 13 |
| kCLErrorDeferredDistanceFiltered | - | 14 |
| kCLErrorDeferredCanceled | - | 15 |

####`watchPosition(successFn, failureFn, options)`
Start a stream of continuous location-updates.  The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured `#url` (if you've enabled the HTTP features).

**WARNING** 
- `watchPosition` will continue to run in the background.  Take care to listen to `suspend` event and call `#stopWatchPosition` if you don't want your app to keep running (TODO make this configurable).

#### Options
######@param {Integer millis} `[1000]` Location update interval
######@param {Integer} `[0]` desiredAccuracy
######@param {Boolean} `[true]` persist 
######@param {Object} `[undefined]` extras Optional extras to append to each location

#### Callback

######@param {Object} location The Location data

```Javascript
bgGeo.watchPosition(function(location) {
    console.log(“- Watch position: “, location);
}, function(errorCode) {
    alert('An location error occurred: ' + errorCode);
}, {
    interval: 30000,    // <-- retrieve a location every 30s.
    persist: false,    // <-- default is true
    extras: {
        route_id: 12345
    }
});

```

####`stopWatchPosition(successFn, failureFn)`

Halt `watchPosition` updates.  **NOTE** Due to the nature of Cordova callbacks, your `failureFn` provided to `#watchPosition` will be executed with a code of `-1` when you execute. `#stopWatchPosition` -- this is **normal**.  This simply provides a signal to Cordova that it can delete the `callback`, preventing a memory leak.

```Javascript
bgGeo.stopWatchPosition();  // <-- callbacks are optional
```

####`changePace({Boolean})`
Initiate or cancel immediate background tracking. When set to `true`, the plugin will begin aggressively tracking the devices Geolocation, bypassing stationary monitoring. If you were making a "Jogging" application, this would be your [Start Workout] button to immediately begin GPS tracking. Send `false` to disable aggressive GPS monitoring and return to stationary-monitoring mode.

```Javascript
bgGeo.changePace(true);  // <-- Aggressive GPS monitoring immediately engaged.
bgGeo.changePace(false); // <-- Disable aggressive GPS monitoring. Engages stationary-mode.
```

####`addGeofence({Object})`
Adds a geofence to be monitored by the native plugin. Monitoring of a geofence is halted after a crossing occurs. The `config` object accepts the following params.

######@config {String} identifier The name of your geofence, eg: "Home", "Office"
######@config {Float} radius The radius (meters) of the geofence. In practice, you should make this >= 100 meters.
######@config {Float} latitude Latitude of the center-point of the circular geofence.
######@config {Float} longitude Longitude of the center-point of the circular geofence.
######@config {Boolean} notifyOnExit Whether to listen to EXIT events
######@config {Boolean} notifyOnEntry Whether to listen to ENTER events

```Javascript
bgGeo.addGeofence({
    identifier: "Home",
    radius: 150,
    latitude: 45.51921926,
    longitude: -73.61678581,
    notifyOnEntry: true,
    notifyOnExit: false
});
```

####`addGeofences(geofences, callbackFn, failureFn)`
Adds a list of geofences to be monitored by the native plugin.  Monitoring of a geofence is halted after a crossing occurs.  The `geofences` param is an `Array` of geofence Objects `{}` with the following params:

######@config {String} identifier The name of your geofence, eg: "Home", "Office"
######@config {Float} radius The radius (meters) of the geofence.  In practice, you should make this >= 100 meters.
######@config {Float} latitude Latitude of the center-point of the circular geofence.
######@config {Float} longitude Longitude of the center-point of the circular geofence.
######@config {Boolean} notifyOnExit Whether to listen to EXIT events
######@config {Boolean} notifyOnEntry Whether to listen to ENTER events
######@config {Boolean} notifyOnDwell (Android only) Whether to listen to DWELL events
######@config {Integer milliseconds} loiteringDelay (Android only) When `notifyOnDwell` is `true`, the delay before DWELL event is fired after entering a geofence.

```Javascript
bgGeo.addGeofences([{
    identifier: "Home",
    radius: 150,
    latitude: 45.51921926,
    longitude: -73.61678581,
    notifyOnEntry: true,
    notifyOnExit: false,
    notifyOnDwell: true,
    loiteringDelay: 30000   // <-- 30 seconds
}], function() {
    console.log("Successfully added geofence");
}, function(error) {
    console.warn("Failed to add geofence", error);
});
```

####`removeGeofence(identifier, successFn, failureFn)`
Removes a geofence having the given `{String} identifier`.

######@config {String} identifier The name of your geofence, eg: "Home", "Office"
######@config {Function} successFn successfully removed geofence.
######@config {Function} failureFn failed to remove geofence

```Javascript
bgGeo.removeGeofence("Home", function() {
    console.log('- remove geofence success');
}, function(error) {
    console.log('- remove geofence failure: ', error);
});
```

####`removeGeofences(callbackFn, failureFn)`
Removes all geofences.

######@config {Function} callbackFn successfully removed geofences.
######@config {Function} failureFn failed to remove geofences

```Javascript
bgGeo.removeGeofences(function() {
    console.log("Successfully removed alll geofences");
}, function(error) {
    console.warn("Failed to remove geofence", error);
});
```

####`getGeofences(callbackFn)`

Fetch the list of monitored geofences. Your `callbackFn` will be provided with an `Array` of geofences. If there are no geofences being monitored, you'll receive an empty Array `[]`.

```Javascript
bgGeo.getGeofences(function(geofences) {
    for (var n=0,len=geofences.length;n<len;n++) {
        console.log("Geofence: ", geofence.identifier, geofence.radius, geofence.latitude, geofence.longitude);
    }
});
```

####`getLocations(callbackFn)`
Fetch all the locations currently stored in native plugin's SQLite database. Your `callbackFn`` will receive an `Array` of locations in the 1st parameter. Eg:

The `callbackFn` will be executed with following params:

######@param {Array} locations. The list of locations stored in SQLite database.


```Javascript
    bgGeo.getLocations(function(locations) {
        try {
            console.log("locations: ", locations);
        } catch(e) {
            console.error("An error occurred in my application code");
        }
    });
```


####`getCount(callbackFn, failureFn)`
Fetches count of SQLite locations table `SELECT count(*) from locations`.  The `callbackFn` will be executed with count as the only parameter.

######@param {Integer} count

```Javascript
    bgGeo.getCount(function(count) {
        console.log('- count: ', count);
    });
```

####`insertLocation(params, callbackFn, failureFn)`
Manually insert a location into the native plugin's SQLite database.  Your `callbackFn` will be executed if the operation was successful.  The inserted location's schema must match this plugin's published [Location Data Schema](wiki/Location-Data-Schema).  The plugin will have no problem inserting a location retrieved from the plugin itself.

######@param {Object} params.  The location params/object matching the [Location Data Schema](wiki/Location-Data-Schema).

```Javascript
    bgGeo.insertLocation({
    "uuid": "f8424926-ff3e-46f3-bd48-2ec788c9e761", // <-- required
    "coords": {                   // <-- required
      "latitude": 45.5192746,
      "longitude": -73.616909,
      "accuracy": 22.531999588012695,
      "speed": 0,
      "heading": 0,
      "altitude": 0
    },
    "timestamp": "2016-02-10T22:25:54.905Z"     // <-- required
    }, function() {
        console.log('- Inserted location success');
    }, function(error) {
      console.warn('- Failed to insert location: ', error);
    });

    // insertLocation can easily consume any location which it returned.  Note that #getCurrentPosition ALWAYS persists so this example
    // will manually persist a 2nd version of the same location.  The purpose here is to show that the plugin can consume any location object which it generated.
    bgGeo.getCurrentPosition(function(location, taskId) {
      location.extras = {foo: 'bar'}; // <-- add some arbitrary extras-data

      // Insert it.
      bgGeo.insertLocation(location, function() {
        bgGeo.finish(taskId);
      });
    });
```

####`clearDatabase(callbackFn, failureFn)`
**DEPRECATED**.  Use `#destroyLocations`.

####`destroyLocations(callbackFn, failureFn)`
Remove all records in plugin's SQLite database.

```Javascript
    bgGeo.clearDatabase(function() {
      console.log('- cleared database'); 
    });
```

####`sync(callbackFn)`

If the plugin is configured for HTTP with an `#url` and `#autoSync: false`, this method will initiate POSTing the locations currently stored in the native SQLite database to your configured `#url`. All records in the database will be DELETED. If you configured `batchSync: true`, all the locations will be sent to your server in a single HTTP POST request, otherwise the plugin will create execute an HTTP post for **each** location in the database (REST-style). Your `callbackFn` will be executed and provided with an Array of all the locations from the SQLite database. If you configured the plugin for HTTP (by configuring an `#url`, your `callbackFn` will be executed after the HTTP request(s) have completed. If the plugin failed to sync to your server (possibly because of no network connection), the `failureFn` will be called with an `errorMessage`. If you are **not** using the HTTP features, `sync` is the only way to clear the native SQLite datbase. Eg:

Your callback will be provided with the following params

######@param {Array} locations. The list of locations stored in SQLite database.

```Javascript
    bgGeo.sync(function(locations) {
        try {
            // Here are all the locations from the database. The database is now EMPTY.
            console.log('synced locations: ', locations);
        } catch(e) {
            console.error('An error occurred in my application code', e);
        }
    });

```

####`beginBackgroundTask(callbackFn)`

Begins a native background-task (180s maximum allowed time).  For long-running methods which may execute asynchronous XHR requests, such as #sync or #getLocations, you should wrap your method-calls in a backgroundTask so that iOS does not suspend the app before your async request is complete.  iOS will prevent suspending the app until you `#finish` the task.

```Javascript
  bgGeo.beginBackgroundTask(function(taskId) {

    bgGeo.getLocations(function(locations) {
      // Perform an Async XHR requests.
      $.post({
        url: 'http://your.server.com/locations',
        method: 'POST',
        success: function(response) {
          bgGeo.finish(taskId); // <-- Signal to iOS that your background-task is complete.
        }
      });
    });
  });
```

####`finish(taskId)`

Signal completion of a background-task initiated by #beginBackgroundTask.  It's **crucial** that you finish background-tasks because iOS will kill your app if you exceed the 180s limit.

```Javascript
  bgGeo.beginBackgroundTask(function(taskId) {
    bgGeo.finish(taskId);
  });
```

####`getOdometer(callbackFn)`

The plugin constantly tracks distance travelled. To fetch the current **odometer** reading:

```Javascript
    bgGeo.getOdometer(function(distance) {
        console.log("Distance travelled: ", distance);
    });
```

####`setOdometer(value, callbackFn, failureFn)`

Set the `odometer` to *any* arbitrary value.  **NOTE** `setOdometer` will perform a [`getCurrentPosition`](#getcurrentpositionoptions-successfn-failurefn) in order to record to exact location where odometer was set; as a result, the `callback` signatures are identical to those of [`getCurrentPosition`](#getcurrentpositionoptions-successfn-failurefn).

```Javascript
    bgGeo.setOdometer(1234.56, function(location) {
        // Callback is called with the location where odometer was set at.
        console.log('- setOdometer success: ', location);
    }, function(errorCode) {
        // If the plugin failed to fetch a location, it will still have set your odometer to your desired value.
        console.log('- Error: ', errorCode);
    });
```

####`resetOdometer(callbackFn)`

Reset the **odometer** to `0`.  Alias for [`setOdometer(0)`](#setodometervalue-callbackfn-failurefn)

####`getLog(callbackFn)`

Fetches the entire contents of the current circular-log and return it as a String.

```Javascript
    bgGeo.getLog(function(log) {
        console.log(log);
    });
```

####`destroyLog(callbackFn, failureFn)`

Destory the entire contents of Log database.

```Javascript
    bgGeo.destroyLog(function() {
        console.log('- Destroyed log');
    }, function() {
        console.log('- Destroy log failure');
    });
```

####`emailLog(email, callbackFn)`

Fetch the entire contents of the current circular log and email it to a recipient using the device's native email client.

```Javascript
    bgGeo.emailLog("foo@bar.com");
```

####`playSound(soundId)`

Here's a fun one. The plugin can play a number of OS system sounds for each platform. For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html). I offer this API as-is, it's up to you to figure out how this works.

```Javascript
    // A soundId iOS recognizes
    bgGeo.playSound(1303);

    // An Android soundId
    bgGeo.playSound(90);
```


