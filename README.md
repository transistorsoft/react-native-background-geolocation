Background Geolocation for React Native
==============================

Cross-platform background geolocation for React Native with battery-saving "circular region monitoring" and "stop detection".

Follows the [React Native Modules spec](https://facebook.github.io/react-native/docs/native-modules-ios.html#content).

## Installing the Plugin

[See Wiki](https://github.com/transistorsoft/react-native-background-geolocation/wiki/Installation)

## Using the plugin ##

```
var BackgroundGeolocation = require('react-native-background-geolocation');
```

## Common Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| `desiredAccuracy` | `Integer` | Required | 0 | Specify the desired-accuracy of the geolocation system with 1 of 4 values, `0`, `10`, `100`, `1000` where `0` means **HIGHEST POWER, HIGHEST ACCURACY** and `1000` means **LOWEST POWER, LOWEST ACCURACY** |
| `distanceFilter` | `Integer` | Required | `30`| The minimum distance (measured in meters) a device must move horizontally before an update event is generated. @see Apple docs. However, #distanceFilter is elastically auto-calculated by the plugin: When speed increases, #distanceFilter increases; when speed decreases, so does distanceFilter (disabled with `disableElasticity: true`) |
| `stopOnTerminate` | `Boolean` | Optional | `true` | Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app). On Android, stopOnTerminate: false will cause the plugin to operate as a headless background-service (in this case, you should configure an #url in order for the background-service to send the location to your server) |
| `stopAfterElapsedMinutes` | `Integer`  |  Optional | `0`  | The plugin can optionally auto-stop monitoring location when some number of minutes elapse after being the #start method was called. |
| `debug` | `Boolean` | Optional | `false` | When enabled, the plugin will emit sounds for life-cycle events of background-geolocation!  **NOTE iOS**:  In addition, you must manually enable the *Audio and Airplay* background mode in *Background Capabilities* to hear these debugging sounds. |
| `url` | `String` | Optional | - | Your server url where you wish to HTTP POST recorded locations to |
| `params` | `Object` | Optional | `{}` | Optional HTTP params sent along in HTTP request to above `#url` |
| `headers` | `Object` | Optional | `{}` | Optional HTTP headers sent along in HTTP request to above `#url` |
| `autoSync` | `Boolean` | Optional | `true` | If you've enabeld HTTP feature by configuring an `#url`, the plugin will attempt to HTTP POST each location to your server **as it is recorded**.  If you set `autoSync: false`, it's up to you to **manually** execute the `#sync` method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute `#sync`). |
| `batchSync` | `Boolean` | Optional | `false` | Default is `false`.  If you've enabled HTTP feature by configuring an `#url`, `batchSync: true` will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request.  With `batchSync: false`, an HTTP POST request will be initiated for **each** location in database. |
| `maxDaysToPersist` | `Integer` | Optional | `1` |  Maximum number of days to store a geolocation in plugin's SQLite database when your server fails to respond with `HTTP 200 OK`.  The plugin will continue attempting to sync with your server until `maxDaysToPersist` when it will give up and remove the location from the database. |

## iOS Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| `stationaryRadius` | `Integer`  |  Required | `20`  | When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage. Note, since the plugin uses iOS significant-changes API, the plugin cannot detect the exact moment the device moves out of the stationary-radius. In normal conditions, it can take as much as 3 city-blocks to 1/2 km before staionary-region exit is detected. |
| `disableElasticity` | `bool`  |  Optional | `false`  | Set true to disable automatic speed-based `#distanceFilter` elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km. |
| `activityType` | `String` | Required | `Other` | Presumably, this affects ios GPS algorithm.  See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information | Set the desired interval for active location updates, in milliseconds.

## Android Options

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
| `locationUpdateInterval` | `Integer(ms)` | Required | `5000` | The location client will actively try to obtain location updates for your application at this interval, so it has a direct influence on the amount of power used by your application. Choose your interval wisely. |
| `fastestLocationUpdateInterval` | `Integer` | Required | `1000` | This controls the fastest rate at which your application will receive location updates, which might be faster than `#locationUpdateInterval` in some situations (for example, if other  applications are triggering location updates). |
| `activityRecognitionInterval` | `Integer` | Required | `10000` | the desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of 0 will result in activity detections at the fastest possible rate. |
| `minimumActivityRecognitionConfidence` | `Integer %` | Optional | `80` | Each activity-recognition-result returned by the API is tagged with a "confidence" level expressed as a %.  You can set your desired confidence to trigger a state-change. |
| `triggerActivities` | `String` | Optional | `all` | These are the comma-delimited list of [activity-names](https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity) returned by the `ActivityRecognition` API which will trigger a state-change from **stationary** to **moving**.  By default, this list is set to all five **moving-states**:  `"in_vehicle, on_bicycle, on_foot, running, walking"`.  If you wish, you could configure the plugin to only engage **moving-mode** for vehicles by providing only `"in_vehicle"`. |
| `stopTimeout` | `Integer (minutes)` | Optional | `0` | The number of miutes to wait before turning off the GPS after the ActivityRecognition System (ARS) detects the device is `STILL` (defaults to 0, no timeout).  If you don't set a value, the plugin is eager to turn off the GPS ASAP.  An example use-case for this configuration is to delay GPS OFF while in a car waiting at a traffic light. |
| `forceReloadOnMotionChange` | `Boolean` | Optional | `false` | If the user closes the application while the background-tracking has been started,  location-tracking will continue on if `stopOnTerminate: false`.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnMotionChange: true` will reload the app only when a state-change occurs from **stationary -> moving** or vice-versa. (**WARNING** possibly disruptive to user). |
| `forceReloadOnLocationChange` | `Boolean` | Optional | `false` | If the user closes the application while the background-tracking has been started,  location-tracking will continue on if `stopOnTerminate: false`.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnLocationChange: true` will reload the app when a new location is recorded. |
| `forceReloadOnGeofence` | `Boolean` | Optional | `false` | If the user closes the application while the background-tracking has been started,  location-tracking will continue on if `stopOnTerminate: false`.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnGeolocation: true` will reload the app only when a geofence crossing event has occurred. |
| `startOnBoot` | `Boolean` | Optional | `false` | Set to `true` to start the background-service whenever the device boots.  Unless you configure the plugin to `forceReload` (ie: boot your app), you should configure the plugin's HTTP features so it can POST to your server in "headless" mode. |

## Events

| Event Name | Returns | Notes
|---|---|---|
| `onMotionChange` | `{location}, `taskId` | Fired when the device changes stationary / moving state. |
| `onGeofence` | `{geofence}`, `taskId` | Fired when a geofence crossing event occurs |

## Methods 

| Method Name | Arguments | Notes
|---|---|---|
| `configure` | `{config}` | Configures the plugin's parameters (@see following Config section for accepted config params. The locationCallback will be executed each time a new Geolocation is recorded and provided with the following parameters |
| `setConfig` | `{config}` | Re-configure the plugin with new values |
| `start` | `callbackFn`| Enable location tracking.  Supplied `callbackFn` will be executed when tracking is successfully engaged |
| `stop` | `callbackFn` | Disable location tracking.  Supplied `callbackFn` will be executed when tracking is successfully engaged |
| `getCurrentPosition` | `callbackFn` | Retrieves the current position. This method instructs the native code to fetch exactly one location using maximum power & accuracy. |
| `changePace` | `isMoving` | Initiate or cancel immediate background tracking. When set to true, the plugin will begin aggressively tracking the devices Geolocation, bypassing stationary monitoring. If you were making a "Jogging" application, this would be your [Start Workout] button to immediately begin GPS tracking. Send false to disable aggressive GPS monitoring and return to stationary-monitoring mode. |
| `getLocations` | `callbackFn` | Fetch all the locations currently stored in native plugin's SQLite database. Your callbackFn`` will receive an `Array` of locations in the 1st parameter |
| `sync` | - | If the plugin is configured for HTTP with an `#url` and `#autoSync: false`, this method will initiate POSTing the locations currently stored in the native SQLite database to your configured `#url`|
| `getOdometer` | `callbackFn` | The plugin constantly tracks distance travelled. The supplied callback will be executed and provided with a `distance` as the 1st parameter.|
| `resetOdometer` | `callbackFn` | Reset the **odometer** to `0`.  The plugin never automatically resets the odometer -- this is **up to you** |
| `playSound` | `soundId` | Here's a fun one.  The plugin can play a number of OS system sounds for each platform.  For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html).  I offer this API as-is, it's up to you to figure out how this works. |
| `addGeofence` | `{config}` | Adds a geofence to be monitored by the native plugin. Monitoring of a geofence is halted after a crossing occurs.|
| `removeGeofence` | `identifier` | Removes a geofence identified by the provided `identifier` |
| `getGeofences` | `callbackFn` | Fetch the list of monitored geofences. Your callbackFn will be provided with an Array of geofences. If there are no geofences being monitored, you'll receive an empty `Array []`.|
  
## Help

[See the Wiki](https://github.com/transistorsoft/react-native-background-geolocation/wiki)

## Example

```

var BackgroundGeolocation = require('react-native-background-geolocation');

var Foo = React.createClass({
  getInitialState() {
    
    BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 50,
      distanceFilter: 50,
      disableElasticity: false, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
      locationUpdateInterval: 5000,
      minimumActivityRecognitionConfidence: 80,   // 0-100%.  Minimum activity-confidence for a state-change 
      fastestLocationUpdateInterval: 5000,
      activityRecognitionInterval: 10000,
      stopTimeout: 0,
      activityType: 'AutomotiveNavigation',

      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user) 
      forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user) 
      forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user) 
      stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
      startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.
        
      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      batchSync: true,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      maxDaysToPersist: 1,    // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
      headers: {
        "X-FOO": "bar"
      },
      params: {
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    });
    
    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', function(location) {
      console.log('- [js]location: ', JSON.stringify(location);
    });
    
    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', function(location) {
        console.log('- [js]motionchanged: ', JSON.stringify(location));
    });
    
    BackgroundGeolocation.start(function() {
      console.log('- [js] BackgroundGeolocation started successfully');
      
      // Fetch current position
      BackgroundGeolocation.getCurrentPosition(function(location) {
        console.log('- [js] BackgroundGeolocation received current position: ', JSON.stringify(location));
      });
    });

    // Call #stop to halt all tracking
    // BackgroundGeolocation.stop();
  }
});

```

## Advanced Demo Application for Field-testing

A fully-featured [Demo App](https://github.com/transistorsoft/rn-background-geolocation-demo) is available in its own public repo.  After first cloning that repo, follow the installation instructions in the **README** there.  This demo-app includes a settings-screen allowing you to quickly experiment with all the different settings available for each platform.

![Home](https://www.dropbox.com/s/4cggjacj68cnvpj/screenshot-iphone5-geofences-framed.png?dl=1)
![Settings](https://www.dropbox.com/s/mmbwgtmipdqcfff/screenshot-iphone5-settings-framed.png?dl=1)

## Help!  It doesn't work!

Yes it does.  [See the Wiki](https://github.com/transistorsoft/cordova-background-geolocation/wiki)

- on iOS, background tracking won't be engaged until you travel about **2-3 city blocks**, so go for a walk or car-ride (or use the Simulator with ```Debug->Location->City Drive```)
- Android is much quicker detecting movements; typically several meters of walking will do it.
- When in doubt, **nuke everything**:  First delete the app from your device (or simulator)

## Behaviour

The plugin has features allowing you to control the behaviour of background-tracking, striking a balance between accuracy and battery-usage.  In stationary-mode, the plugin attempts to descrease its power usage and accuracy by setting up a circular stationary-region of configurable #stationaryRadius.  

iOS has a nice system  [Significant Changes API](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges), which allows the os to suspend your app until a cell-tower change is detected (typically 2-3 city-block change) 

Android uses the Google Play Services APIs [FusedLocationProvider API](https://developer.android.com/reference/com/google/android/gms/location/FusedLocationProviderApi.html) as well as the [ActivityRecognition API](https://developer.android.com/reference/com/google/android/gms/location/ActivityRecognitionApi.html) (for movement/stationary detection). Windows Phone does not have such a API.

The plugin will execute your configured ```callback``` provided to the ```#configure(callback, config)``` method.  Both iOS & Android use a SQLite database to persist **every** recorded geolocation so you don't have to worry about persistence when no network is detected.  The plugin provides a Javascript API to fetch and destroy the records in the database.  In addition, the plugin has an optional HTTP layer allowing allowing you to automatically HTTP POST recorded geolocations to your server.

The function ```changePace(isMoving, success, failure)``` is provided to force the plugin to enter "moving" or "stationary" state.

## iOS

The plugin uses iOS Significant Changes API, and starts triggering your configured ```callback``` only when a cell-tower switch is detected (i.e. the device exits stationary radius). 

When the plugin detects the device has moved beyond its configured #stationaryRadius, it engages the native platform's geolocation system for aggressive monitoring according to the configured `#desiredAccuracy`, `#distanceFilter`.  The plugin attempts to intelligently scale `#distanceFilter` based upon the current reported speed.  Each time `#distanceFilter` is determined to have changed by 5m/s, it recalculates it by squaring the speed rounded-to-nearest-five and adding #distanceFilter (I arbitrarily came up with that formula.  Better ideas?).

  `(round(speed, 5))^2 + distanceFilter`

### Android

Using the ActivityRecognition API, Android will constantly monitor [the nature](https://developer.android.com/reference/com/google/android/gms/location/DetectedActivity.html) of the device's movement at a sampling-rate configured by ```#activityRecognitionRate```.  When the plugin sees a DetectedActivity of [STILL](https://developer.android.com/reference/com/google/android/gms/location/DetectedActivity.html), location-updates will be halted -- when it sees ```IN_VEHICLE, ON_BICYCLE, ON_FOOT, RUNNING, WALKING```, location-updates will be initiated.

## Methods

####`configure(locationCallback, failureCallback, config)`

Configures the plugin's parameters (@see following [Config](https://github.com/transistorsoft/cordova-background-geolocation/blob/edge/README.md#config) section for accepted ```config``` params.  The ```locationCallback``` will be executed each time a new Geolocation is recorded and provided with the following parameters:

######@param {Object} location The Location data
######@param {Integer} taskId The taskId used to send to bgGeo.finish(taskId) in order to signal completion of your callbackFn

```
bgGeo.configure({
    distanceFilter: 50,
    desiredAccuracy: 0,
    stationaryRadius: 25
});
```

####`setConfig(config)`
Reconfigure plugin's configuration (@see followign ##Config## section for accepted ```config``` params.

```
bgGeo.setConfig({
    desiredAccuracy: 10,
    distanceFilter: 100
});
```

####`start(successFn, failureFn)`

Enable background geolocation tracking.

```
bgGeo.start()
```

####`stop(successFn, failureFn)`

Disable background geolocation tracking.

```
bgGeo.stop();
```

####`getCurrentPosition(successFn, failureFn)`
Retrieves the current position.  This method instructs the native code to fetch exactly one location using maximum power & accuracy.  **NOTE:** The plugin **MUST** be enabled via `#start` to use this method (otherwise the plugin will call your `failureFn` with a status-code `401` (UNAUTHORIZED).  The native code will persist the fetched location to its SQLite database just as any other location in addition to POSTing to your configured `#url` (if you've enabled the HTTP features).  In addition to your supplied `callbackFn`, the plugin will also execute the `callback` provided to `#configure`.  Your provided `successFn` will be executed with the same signature as that provided to `#configure`:

######@param {Object} location The Location data
######@param {Integer} taskId The taskId used to send to bgGeo.finish(taskId) in order to signal completion of your callbackFn

```
bgGeo.getCurrentPosition(function(location, taskId) {
    // This location is already persisted to plugin’s SQLite db.  
    // If you’ve configured #autoSync: true, the HTTP POST has already started.

    console.log(“- Current position received: “, location);
    bgGeo.finish(taskId);
});

```

####`changePace(enabled, successFn, failureFn)`
Initiate or cancel immediate background tracking.  When set to ```true```, the plugin will begin aggressively tracking the devices Geolocation, bypassing stationary monitoring.  If you were making a "Jogging" application, this would be your [Start Workout] button to immediately begin GPS tracking.  Send ```false``` to disable aggressive GPS monitoring and return to stationary-monitoring mode.

```
bgGeo.changePace(true);  // <-- Aggressive GPS monitoring immediately engaged.
bgGeo.changePace(false); // <-- Disable aggressive GPS monitoring.  Engages stationary-mode.
```

####`onMotionChange(callbackFn, failureFn)`
Your ```callbackFn``` will be executed each time the device has changed-state between **MOVING** or **STATIONARY**.  The ```callbackFn``` will be provided with a ```Location``` object as the 1st param, with the usual params (```latitude, longitude, accuracy, speed, bearing, altitude```), in addition to a ```taskId``` used to signal that your callback is finished.

######@param {Boolean} isMoving `false` if entered **STATIONARY** mode; `true` if entered **MOVING** mode.
######@param {Object} location The location at the state-change.
######@param {Integer} taskId The taskId used to send to bgGeo.finish(taskId) in order to signal completion of your callbackFn

```
bgGeo.onMotionChange(function(isMoving, location, taskId) {
    if (isMoving) {
        console.log('Device has just started MOVING', location);
    } else {
        console.log('Device has just STOPPED', location);
    }
    bgGeo.finish(taskId);
})

```

####`addGeofence(config, callbackFn, failureFn)`
Adds a geofence to be monitored by the native plugin.  Monitoring of a geofence is halted after a crossing occurs.  The `config` object accepts the following params.

######@config {String} identifier The name of your geofence, eg: "Home", "Office"
######@config {Float} radius The radius (meters) of the geofence.  In practice, you should make this >= 100 meters.
######@config {Float} latitude Latitude of the center-point of the circular geofence.
######@config {Float} longitude Longitude of the center-point of the circular geofence.
######@config {Boolean} notifyOnExit Whether to listen to EXIT events
######@config {Boolean} notifyOnEntry Whether to listen to ENTER events

```
bgGeo.addGeofence({
    identifier: "Home",
    radius: 150,
    latitude: 45.51921926,
    longitude: -73.61678581,
    notifyOnEntry: true,
    notifyOnExit: false
}, function() {
    console.log("Successfully added geofence");
}, function(error) {
    console.warn("Failed to add geofence", error);
});
```

####`removeGeofence(identifier, callbackFn, failureFn)`
Removes a geofence having the given `{String} identifier`.

######@config {String} identifier The name of your geofence, eg: "Home", "Office"
######@config {Function} callbackFn successfully removed geofence.
######@config {Function} failureFn failed to remove geofence

```
bgGeo.removeGeofence("Home", function() {
    console.log("Successfully removed geofence");
}, function(error) {
    console.warn("Failed to remove geofence", error);
});
```

####`getGeofences(callbackFn, failureFn)`

Fetch the list of monitored geofences.  Your `callbackFn` will be provided with an `Array` of geofences.  If there are no geofences being monitored, you'll receive an empty Array `[]`.

```
bgGeo.getGeofences(function(geofences) {
    for (var n=0,len=geofences.length;n<len;n++) {
        console.log("Geofence: ", geofence.identifier, geofence.radius, geofence.latitude, geofence.longitude);
    }
}, function(error) {
    console.warn("Failed to fetch geofences from server");
});
```

####`onGeofence(callbackFn)`
Adds a geofence event-listener.  Your supplied callback will be called when any monitored geofence crossing occurs.  The `callbackFn` will be provided the following parameters:

######@param {Object} params.  This object contains 2 keys: `@param {String} identifier` and `@param {String} action [ENTER|EXIT]`.
######@param {Integer} taskId The background taskId which you must send back to the native plugin via `bgGeo.finish(taskId)` in order to signal that your callback is complete.

```
bgGeo.onGeofence(function(params, taskId) {
    try {
        console.log('A geofence has been crossed: ', params.identifier);
        console.log('ENTER or EXIT?: ', params.action);
    } catch(e) {
        console.error('An error occurred in my application code', e);
    }
    // The plugin runs your callback in a background-thread:  
    // you MUST signal to the native plugin when your callback is finished so it can halt the thread.
    // IF YOU DON'T, iOS WILL KILL YOUR APP
    bgGeo.finish(taskId);
});
```

####`getLocations(callbackFn, failureFn)`
Fetch all the locations currently stored in native plugin's SQLite database.  Your ```callbackFn`` will receive an ```Array``` of locations in the 1st parameter.  Eg:

The `callbackFn` will be executed with following params:

######@param {Array} locations.  The list of locations stored in SQLite database.
######@param {Integer} taskId The background taskId which you must send back to the native plugin via `bgGeo.finish(taskId)` in order to signal the end of your background thread.


```
    bgGeo.getLocations(function(locations, taskId) {
        try {
            console.log("locations: ", locations);
        } catch(e) {
            console.error("An error occurred in my application code");
        }
        bgGeo.finish(taskId);
    });
```

####`sync(callbackFn, failureFn)`

If the plugin is configured for HTTP with an ```#url``` and ```#autoSync: false```, this method will initiate POSTing the locations currently stored in the native SQLite database to your configured ```#url```.  All records in the database will be DELETED.  If you configured ```batchSync: true```, all the locations will be sent to your server in a single HTTP POST request, otherwise the plugin will create execute an HTTP post for **each** location in the database (REST-style).  Your ```callbackFn``` will be executed and provided with an Array of all the locations from the SQLite database.  If you configured the plugin for HTTP (by configuring an `#url`, your `callbackFn` will be executed after the HTTP request(s) have completed.  If the plugin failed to sync to your server (possibly because of no network connection), the ```failureFn``` will be called with an ```errorMessage```.  If you are **not** using the HTTP features, ```sync``` is the only way to clear the native SQLite datbase.  Eg:

Your callback will be provided with the following params

######@param {Array} locations.  The list of locations stored in SQLite database.
######@param {Integer} taskId The background taskId which you must send back to the native plugin via `bgGeo.finish(taskId)` in order to signal the end of your background thread.

```
    bgGeo.sync(function(locations, taskId) {
        try {
        	// Here are all the locations from the database.  The database is now EMPTY.
        	console.log('synced locations: ', locations);
        } catch(e) {
            console.error('An error occurred in my application code', e);
        }

        // Be sure to call finish(taskId) in order to signal the end of the background-thread.
        bgGeo.finish(taskId);
    }, function(errorMessage) {
        console.warn('Sync FAILURE: ', errorMessage);
    });

```

####`getOdometer(callbackFn, failureFn)`

The plugin constantly tracks distance travelled.  To fetch the current **odometer** reading:

```
    bgGeo.getOdometer(function(distance) {
        console.log("Distance travelled: ", distance);
    });
```

####`resetOdometer(callbackFn, failureFn)`

Reset the **odometer** to zero.  The plugin never automatically resets the odometer so it's up to you to reset it as desired.

####`playSound(soundId)`

Here's a fun one.  The plugin can play a number of OS system sounds for each platform.  For [IOS](http://iphonedevwiki.net/index.php/AudioServices) and [Android](http://developer.android.com/reference/android/media/ToneGenerator.html).  I offer this API as-is, it's up to you to figure out how this works.

```
    // A soundId iOS recognizes
    bgGeo.playSound(1303);
    
    // An Android soundId
    bgGeo.playSound(90);
```


## Config

Use the following config-parameters with the #configure method:

####`@param {Boolean} debug`

When enabled, the plugin will emit sounds for life-cycle events of background-geolocation!  **NOTE iOS**:  In addition, you must manually enable the *Audio and Airplay* background mode in *Background Capabilities* to hear these debugging sounds.

- Exit stationary region:  **[ios]** Calendar event notification sound
- GeoLocation recorded:  **[ios]** SMS-sent sound, **[android]** "blip", *[WP8]* High beep, 1 sec.
- Aggressive geolocation engaged:  **[ios]** SIRI listening sound, **[android]** "Doodly-doo"
- Acquiring stationary location sound: **[ios]** "tick,tick,tick" sound, *[android]* none
- Stationary location acquired sound:  **[ios]** "bloom" sound, **[android]** long "beeeeeep"

![Enable Background Audio](/enable-background-audio.png "Enable Background Audio")

####`@param {Integer} desiredAccuracy [0, 10, 100, 1000] in meters`

Specify the desired-accuracy of the geolocation system with 1 of 4 values, ```0, 10, 100, 1000``` where ```0``` means HIGHEST POWER, HIGHEST ACCURACY and ```1000``` means LOWEST POWER, LOWEST ACCURACY

- [Android](https://developer.android.com/reference/com/google/android/gms/location/LocationRequest.html#PRIORITY_BALANCED_POWER_ACCURACY)
- [iOS](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/index.html#//apple_ref/occ/instp/CLLocationManager/desiredAccuracy) 

####`@param {Integer} stationaryRadius (meters)`

When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.  Note, since the plugin uses iOS significant-changes API, the plugin cannot detect the exact moment the device moves out of the stationary-radius.  In normal conditions, it can take as much as 3 city-blocks to 1/2 km before staionary-region exit is detected.

####`@param {Integer} distanceFilter`

The minimum distance (measured in meters) a device must move horizontally before an update event is generated.  @see [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/distanceFilter).  However, #distanceFilter is elastically auto-calculated by the plugin:  When speed increases, #distanceFilter increases;  when speed decreases, so does distanceFilter.

distanceFilter is calculated as the square of speed-rounded-to-nearest-5 and adding configured #distanceFilter.

  `(round(speed, 5))^2 + distanceFilter`

For example, at biking speed of 7.7 m/s with a configured distanceFilter of 30m:

  `=> round(7.7, 5)^2 + 30`
  `=> (10)^2 + 30`
  `=> 100 + 30`
  `=> 130`

A gps location will be recorded each time the device moves 130m.

At highway speed of 30 m/s with distanceFilter: 30,

  `=> round(30, 5)^2 + 30`
  `=> (30)^2 + 30`
  `=> 900 + 30`
  `=> 930`

A gps location will be recorded every 930m

Note the following real example of background-geolocation on highway 101 towards San Francisco as the driver slows down as he runs into slower traffic (geolocations become compressed as distanceFilter decreases)

![distanceFilter at highway speed](/distance-filter-highway.png "distanceFilter at highway speed")

Compare now background-geolocation in the scope of a city.  In this image, the left-hand track is from a cab-ride, while the right-hand track is walking speed.

![distanceFilter at city scale](/distance-filter-city.png "distanceFilter at city scale")

####`@param {Boolean} stopOnTerminate`
Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app).  On Android, ```stopOnTerminate: false``` will cause the plugin to operate as a headless background-service (in this case, you should configure an #url in order for the background-service to send the location to your server)

####`@param {Boolean} stopAfterElapsedMinutes`

The plugin can optionally auto-stop monitoring location when some number of minutes elapse after being the #start method was called.

### In-Plugin SQLite Storage

The plugin will cache **every** recorded geolocation to its internal SQLite database -- when you sync the locations and your server responds with HTTP ```200, 201 or 204```, the plugin will **DELETE** the stored location from cache.  The plugin has a cache-pruning feature with ```@config {Integer} maxDaysToPersist``` -- If the plugin hasn't successfully synced these these records in the database before  ```maxDaysToPersist``` expires, the plugin will give up and those geolocation records will be pruned from the database.

If you **don't** configure the optional HTTP feature, the only way to delete the SQLite database is by executing the ```#sync``` method.

```
    bgGeo.sync(function(locations) {
    	// The SQLite database is now EMPTY.  
        console.log('locations: ', locations);
    });
```

### HTTP Features

####`@param {String} url`

Your server url where you wish to HTTP POST location data to.

####`@param {String} batchSync [false]`

Default is ```false```.  If you've enabled HTTP feature by configuring an ```#url```, ```batchSync: true``` will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request.  With ```batchSync: false```, an HTTP POST request will be initiated for **each** location in database.

####`@param {String} autoSync [true]`

Default is ```true```.  If you've enabeld HTTP feature by configuring an ```#url```, the plugin will attempt to HTTP POST each location to your server **as it is recorded**.  If you set ```autoSync: false```, it's up to you to **manually** execute the ```#sync``` method to initate the HTTP POST (**NOTE** The plugin will continue to persist **every** recorded location in the SQLite database until you execute ```#sync```).

####`@param {Object} params`

Optional HTTP params sent along in HTTP request to above ```#url```.

####`@param {Object} headers`

Optional HTTP params sent along in HTTP request to above ```#url```.

####`@param {Integer} maxDaysToPersist`

Maximum number of days to store a geolocation in plugin's SQLite database when your server fails to respond with ```HTTP 200 OK```.  The plugin will continue attempting to sync with your server until ```maxDaysToPersist``` when it will give up and remove the location from the database.

Both iOS and Android can send the Geolocation to your server simply by configuring an ```#url``` in addition to optional ```#headers``` and ```#params```.  This is the preferred way to send the Geolocation to your server, rather than doing it yourself with Ajax in your javascript.  

#### Sample HTTP Request arriving at your server

```
bgGeo.configure(callbackFn, failureFn, {
    .
    .
    .
    url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
    autoSync: true,
    batchSync: false,
    maxDaysToPersist: 1,
    headers: {
        "X-FOO": "bar"
    },
    params: {
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
    }
});

...

Headers (Some may be inserted by server)

REQUEST_URI = /post.php?dir=cordova-background-geolocation
QUERY_STRING = dir=cordova-background-geolocation
REQUEST_METHOD = POST
GATEWAY_INTERFACE = CGI/1.1
REMOTE_PORT = 38380
REMOTE_ADDR = 198.84.250.106
HTTP_USER_AGENT = Apache-HttpClient/UNAVAILABLE (java 1.4)
HTTP_CONNECTION = close
HTTP_HOST = posttestserver.com
CONTENT_LENGTH = 243
CONTENT_TYPE = application/json
HTTP_ACCEPT = application/json
UNIQUE_ID = VS-YI9Bx6hIAABctKDoAAAAB
REQUEST_TIME_FLOAT = 1429198883.9584
REQUEST_TIME = 1429198883

No Post Params.

== Begin post body ==
{
  "location":{
    "timestamp":"2015-05-05T04:31:54Z",  // <-- ISO-8601, UTC
    "coords":{
      "latitude":45.519282,
      "longitude":-73.6169562,
      "accuracy":12.850000381469727,
      "speed":0,
      "heading":0,
      "altitude":0
    },
    "activity":{  // <-- Android-only currently
      "type":"still",
      "confidence":48
    },
    "battery": {  // <-- Battery charge-state
      "level": 0.87,
      "is_charging": false
    }
  },
  "android_id":"39dbac67e2c9d80"
}
== End post body ==
```

### Android Config

####`@param {Integer millis} locationUpdateInterval`

Set the desired interval for active location updates, in milliseconds.

The location client will actively try to obtain location updates for your application at this interval, so it has a direct influence on the amount of power used by your application. Choose your interval wisely.

This interval is inexact. You may not receive updates at all (if no location sources are available), or you may receive them slower than requested. You may also receive them faster than requested (if other applications are requesting location at a faster interval). 

Applications with only the coarse location permission may have their interval silently throttled.

####`@param {Integer millis} fastestLocationUpdateInterval`

Explicitly set the fastest interval for location updates, in milliseconds.

This controls the fastest rate at which your application will receive location updates, which might be faster than ```#locationUpdateInterval``` in some situations (for example, if other applications are triggering location updates).

This allows your application to passively acquire locations at a rate faster than it actively acquires locations, saving power.

Unlike ```#locationUpdateInterval```, this parameter is exact. Your application will never receive updates faster than this value.

If you don't call this method, a fastest interval will be set to **30000 (30s)**. 

An interval of 0 is allowed, but not recommended, since location updates may be extremely fast on future implementations.

If ```#fastestLocationUpdateInterval``` is set slower than ```#locationUpdateInterval```, then your effective fastest interval is ```#locationUpdateInterval```.

========
An interval of 0 is allowed, but not recommended, since location updates may be extremely fast on future implementations.

####`@param {Integer millis} activityRecognitionInterval`

the desired time between activity detections. Larger values will result in fewer activity detections while improving battery life. A value of 0 will result in activity detections at the fastest possible rate.

####`@param {Integer millis} minimumActivityRecognitionConfidence` 

Each activity-recognition-result returned by the API is tagged with a "confidence" level expressed as a %.  You can set your desired confidence to trigger a state-change.  Defaults to `80`.

####`@param {String} triggerActivities`

These are the comma-delimited list of [activity-names](https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity) returned by the `ActivityRecognition` API which will trigger a state-change from **stationary** to **moving**.  By default, this list is set to all five **moving-states**:  `"in_vehicle, on_bicycle, on_foot, running, walking"`.  If you wish, you could configure the plugin to only engage **moving-mode** for vehicles by providing only `"in_vehicle"`.

####`@param {Integer minutes} stopTimeout`

The number of miutes to wait before turning off the GPS after the ActivityRecognition System (ARS) detects the device is ```STILL``` (defaults to 0, no timeout).  If you don't set a value, the plugin is eager to turn off the GPS ASAP.  An example use-case for this configuration is to delay GPS OFF while in a car waiting at a traffic light.

####`@param {Boolean} forceReloadOnMotionChange`

If the user closes the application while the background-tracking has been started,  location-tracking will continue on if ```stopOnTerminate: false```.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnMotionChange: true` will reload the app only when a state-change occurs from **stationary -> moving** or vice-versa. (**WARNING** possibly disruptive to user).

####`@param {Boolean} forceReloadOnLocationChange`

If the user closes the application while the background-tracking has been started,  location-tracking will continue on if ```stopOnTerminate: false```.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnLocationChange: true` will reload the app when a new location is recorded.

####`@param {Boolean} forceReloadOnGeofence`

If the user closes the application while the background-tracking has been started,  location-tracking will continue on if ```stopOnTerminate: false```.  You may choose to force the foreground application to reload (since this is where your Javascript runs).  `forceReloadOnGeolocation: true` will reload the app only when a geofence crossing event has occurred.

####`@param {Boolean} startOnBoot`

Set to ```true``` to start the background-service whenever the device boots.  Unless you configure the plugin to ```forceReload``` (ie: boot your app), you should configure the plugin's HTTP features so it can POST to your server in "headless" mode.



### iOS Config

####`@param {Boolean} disableElasticity [false]`

Defaults to ```false```.  Set ```true``` to disable automatic speed-based ```#distanceFilter``` elasticity.  eg:  When device is moving at highway speeds, locations are returned at ~ 1 / km.

####`@param {String} activityType [AutomotiveNavigation, OtherNavigation, Fitness, Other]`

Presumably, this affects ios GPS algorithm.  See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information

### WP8 Config

####`{Integer [0, 10, 100, 1000]} desiredAccuracy`

##### Windows Phone
The underlying GeoLocator you can choose to use 'DesiredAccuracy' or 'DesiredAccuracyInMeters'. Since this plugins default configuration accepts meters, the default desiredAccuracy is mapped to the Windows Phone DesiredAccuracyInMeters leaving the DesiredAccuracy enum empty. For more info see the [MS docs](http://msdn.microsoft.com/en-us/library/windows/apps/windows.devices.geolocation.geolocator.desiredaccuracyinmeters) for more information.

# Geofence Features

![Geofence Features](https://www.dropbox.com/s/609iibr6ofzoq7p/Screenshot%202015-06-06%2017.05.33.png?dl=1)

The plugin includes native **geofencing** features.  You may add, remove and query the list of monitored geofences from the native plugin.  The native plugin will persist monitored geofences and re-initiate them when the app boots or the device is restarted.

A monitored geofence **will remain active** until you explicity remove it via `bgGeo.removeGeofence(identifier)`.

#### Geofence Model

#####`@param {String} identifier`

A unique `String` to identify your Geofence, eg: "Home", "Office".

#####`@param {Integer} radius`

The radius of the circular geofence.  A radius of >100 meters works best.

#####`@param {Boolean} notifyOnEntry`

Transitioning **into** the geofence will generate an event.

#####`@param {Boolean} notifyOnExit`

Transitioning **out of** the geofence will generate an event.

#### Listening to Geofence Events

Listen to geofence transition events using the method `#onGeofence`.  You may set up any number of `#onGeofence` event-listeners throughout your code -- they will all be executed.

```
    bgGeo.addGeofence({
        identifier: "Home",
        radius: 200,
        latitude: 47.2342323,
        longitude: -57.342342,
        notifyOnEntry: true
    });
    
    bgGeo.onGeofence(function(geofence, taskId) {
        try {
            console.log("- A Geofence transition occurred");
            console.log("  identifier: ", geofence.identifier);
            console.log("  action: ", geofence.action);
        } catch(e) {
            console.error("An error occurred in my code!", e);
        }
        // Be sure to call #finish!!
        bgGeo.finish(taskId);
    });
```

#### Removing Geofences

The native plugin will continue to monitor geofences and fire transition-events until you explicity tell the plugin to remove a geofence via `#removeGeofence(identifier)`.

```
    bgGeo.removeGeofence("Home");

```

#### Querying Geofences

The native plugin persists monitored geofences between application boots and device restarts.  When your app boots, you can fetch the currently monitored geofences from the native plugin and, for example, re-draw markers on your map.

```
    bgGeo.getGeofences(function(geofences) {
        for (var n=0,len=geofences.length;n<len;n++) {
            var geofence = geofences[n];
            var marker = new google.maps.Circle({
                radius: parseInt(geofence.radius, 10),
                center: new google.maps.LatLng(geofence.latitude, geofence.longitude),
                map: myMapInstance
            });
        }
    });
```

# Test new docs format



