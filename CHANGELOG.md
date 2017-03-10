# Change Log
## [Unreleased]

## [2.7.0] - 2017-03-09
- [Fixed] iOS bug when composing geofence data for peristence.  Sometimes it appended a `location.geofence.location` due to a shared `NSDictionary`
- [Changed] The licensing model of Android now enforces license only for **release** builds.  If an invalid license is configured while runningin **debug** mode, a Toast warning will appear **"BackgroundGeolocation is running in evaluation mode."**, but the plugin *will* work.
- [Fixed] iOS bug with HTTP `401` handling.
- [Fixed] Forgot to post updated (backwards-compatible) version of `#getCurrentPosition` method, re-arranging the order of params according to docs: `#getCurrentPosition(successFn, failureFn, config)`

## [2.6.1] - 2017-03-01
- [Changed] Refactor Settings Management.

## [2.6.0] - 2017-02-22
- [Fixed] `geofence` event not passing Geofence `#extras`.
- [Fixed] iOS geofence identifiers containing ":" character were split and only the last chunk returned.  The plugin itself prefixes all geofences it creates with the string `TSGeofenceManager:` and the string-splitter was too naive.  Uses a `RegExp` replace to clear the plugin's internal prefix. 
- [Changed] Refactored API Documentation
- [Added] HTTP JSON template features.  See [HTTP Features](./docs/http.md).  You can now template your entire JSON request data sent to the server by the plugin's HTTP layer.

## [2.4.3] - 2017-02-07
- [Fixed] Incorrect `peerDependencies` specified `react-native >= 0.40.0`

## [2.4.2] - 2017-02-07
- [Changed] Module now works for all versions of react-native, both pre and post `0.40.0`.

## [2.4.1] - 2017-01-16
- [Fixed] Fix issue with Location Authorization alert popup up when not desired.

## [2.4.0] - 2017-01-11
- [Fixed] Support for `react-native-0.40.0`

## [2.3.0] - 2017-01-09
- [Added] Ability to provide optional arbitrary meta-data `extras` on geofences.
- [Changed] Location parameters `heading`, `accuracy`, `odometer`, `speed`, `altitude`, `altitudeAccuracy` are now fixed at 2 decimal places.
- [Changed] When adding a geofence (either `#addGeofence` or `#addGeofences`), if a geofence already exists with the provided `identifier`, the plugin will first destroy the existing one before creating the new one.what was configured.
- [Fixed] Improve odometer accuracy.  Introduce `desiredOdometerAccuracy` for setting a threshold of location accuracy for calculating odometer.  Any location having `accuracy > desiredOdometerAccuracy` will not be used for odometer calculation.
- [Fixed] When configured with a schedule, the Schedule parser wasn't ordering the schedule entries by start-time.  Since the scheduler seeks the first matching schedule-entry, it could fail to pick the latest entry.
- [Changed] Add ability to set odometer to any arbitrary value.  Before, odometer could only be reset to `0` via `resetOdometer`.  The plugin now uses `setOdometer(Float, successFn, failureFn`.  `resetOdometer` is now just an alias for `setOdometer(0)`.  `setOdometer` will now internally perform a `#getCurrentPosition`, so it can know the exact location where the odometer was set at.  As a result, using `#setOdometer` is exactly like performing a `#getCurrentPosition` and the `success` / `failure` callbacks use the same method-signature, where the `success` callback is provided the `location`

## [1.6.0] - 2016-11-18
- [Fixed] Logic bug in `TSGeofenceManager`; was not performing geospatial query when changing state from **MOVING -> STATIONARY**.
- [Added] Geofences-only mode for both iOS and Android **BETA**.  Start geofences-only mode with method `#startGeofences`.
- [Changed] Add some intelligence to iOS motion-detection system:  Use a Timer of `activityRecognitionInterval` seconds before engaging location-services after motion is detected.  This helps to reduce false-positives, particularly when using `preventSuspend` while walking around one's house or office.
- [Changed] Add more intelligence to iOS motion-detection system:  The plugin will be **eager** to engage the stop-detection, as soon as it detects `still`, regardless of confidence.  When the plugin is currently in the **moving** state and detects `still`, it will engage a timer of `activityRecognitionInterval` milliseconds -- when this timer expires and the motion-detector still reports `still`, the stop-detection system will be engaged.  If any *moving* type activity occurs during this time, the timer will be cancelled.
- [Changed] With `preventSuspend: true`, the plugin will no longer immediately engage location-services as soon as it sees a "moving"-type motion-activity:  it will now calculate if the current position is beyond stationary geofence. This helps reduce false-positives engaging location-services while simply walking around one's home or office.
- [Fixed] iOS `batchSync`: When only 1 record in batch, iOS fails to pack the records in a JSON `location: []`, appending to a `location: {}` instead.

## [1.5.4] - 2016-11-07
- [Changed] The plugin will ignore `autoSyncThreshold` when a `motionchange` event occurs.
- [Fixed] Fixed ui-blocking issue when plugin boots with locations in its database with `autoSync: true`.  Found a case where the plugin was executing HTTP Service on the UI thread.
- [Fixed] iOS Scheduler puked when provided with a `null` or `[]` schedule.
- [Changed] iOS Scheduler behaviour changed to match Android, where `#stopSchedule` does **not** execute `#stop` on the plugin itself.

## [1.5.3] - 2016-11-04
- [Fixed] `getGeofences` issue #158.  `getGeofences` wasn't migrated to accept the new data-format provided by `TSLocationManager`, which now returns an `NSArray` of `NSDictionary` -- not `CLCircularRegion`.
- [Changed] Remove `CocoaLumberjack` static lib from `TSLocationManager`.  Compiling it into `TSLocationManager` causes conflicts with others also using this popular logging framework.
- [Fixed] Bug exposed with `batchSync`.  The plugin was failing to destroy records after successful HTTP request due to bug in FMDB binding array params for `DELETE FROM location WHERE id IN(?)`.

## [1.5.2 - 2016-10-26]
- [Added] Implement a mechanism for removing listeners `removeListener` (@alias `un`).  This is particularly important for Android when using `stopOnTerminate: false`.  Listeners on `BackgroundGeolocation` should be removed in `componentDidUnmount`:
```Javascript
  componentDidMount() {
    BackgroundGeolocation.on('location', this.onLocation);
  }
  onLocation(location) {
    console.log('- Location: ', location);
  }
  componentDidUnmount() {
    BackgroundGeolocation.un('location', this.onLocation);
  }
```

- [Fixed] iOS issue when multiple geofences trigger simultaneously, where only the last one was fired to the client and persisted.
- [Added] Implemented ability for iOS to trigger a geofence `ENTER` event immediately when device is already inside the geofence (Android has always done this).  This behaviour can be controlled with the new config `@param {Boolean} geofenceInitialTriggerEntry [true]`.  This behaviour defaults to `true`.

## [1.5.1] - 2016-10-17
- [Fixed] Bug in `stopDetectionDelay` logic
- [Fixed] Geofencing transistion event logging wouldn't occur when configured for `debug: false`

## [1.5.0] - 2016-10-04
- [Changed] Refactor iOS Logging system to use popular CocoaLumberjack library.  iOS logs are now stored in the database!  By default, logs are stored for 3 days, but is configurable with `logMaxDays`.  Logs can now be filtered by logLevel:

| logLevel | Label |
|---|---|
|`0`|`LOG_LEVEL_OFF`|
|`1`|`LOG_LEVEL_ERROR`|
|`2`|`LOG_LEVEL_WARNING`|
|`3`|`LOG_LEVEL_INFO`|
|`4`|`LOG_LEVEL_DEBUG`|
|`5`|`LOG_LEVEL_VERBOSE`|

fetch logs with `#getLog` or `#emailLog` methods.  Destroy logs with `#destroyLog`.
- [Fixed] `#emailLog` now finally works.
- [Fixed] If user declines "Motion Activity" permission, plugin failed to detect this authorization failure and fallback to the accelerometer-based motion-detection system.

- [Changed] Refactored Geolocation system.  The plugin is no longer bound by native platform limits on number of geofences which can be monitored (iOS: 20; Android: 100).  You may now monitor infinite geofences.  The plugin now stores geofences in its SQLite db and performs a geospatial query, activating only those geofences in proximity of the device (@config #geofenceProximityRadius, @event `geofenceschange`).  See the new [Geofencing Guide](./docs/geofencing.md)

## [1.4.3] - 2016-09-25
- [Fixed] Bug in preventSuspend during background-fetch event where plugin was left in preventSuspend mode after being rebooted in background.

## [1.4.2] - 2016-09-25
- [Fixed] Bug in preventSuspend during background-fetch event where plugin was left in preventSuspend mode when not configured to do so.
## [1.4.1] - 2016-09-22
- [Fixed] Bug in prevent-suspend where the plugin failed to re-start its prevent-suspend timer if no MotionActivity event occurred during that interval.  Prevent-suspend system should now operate completely independently of MotionDetector.
- [Fixed] `#stop` method wasn't calling `stopMonitoringSignificantChanges`, resulting in location-services icon failing to toggle OFF.  Fixes issue #908

## [1.4.0] - 2016-09-21
- [Fixed] `#removeGeofences` was removing the stationary-geofence.  This would prevent stationary-exit if executed while plugin is in stationary-mode.
- [Fixed] Accept callbacks to `#stop` method.  Fixes #122
- [Added] Add new config `@param {Integer} autoSyncThreshold [0]`.  Allows you to specify a minimum number of persisted records to trigger an auto-sync action.
- [Fixed] Crash when url configured to `null`.  Issue #119
- [Fixed] Missing Javascript API method `beginBackgroundTask`.  Issue #109
- [Added] iOS `watchPosition` mechanism.
- [Changed] Refactored iOS motion-detection system.  Improved iOS motion-triggering when using `CMMotionActivityManager` (ie: when not using `disableMotionActivityUpdates: true`).  iOS can now trigger out of stationary-mode just like android, where it sees a 'moving-type' motion-activity (eg: 'on_foot', 'in_vehicle', etc).  Note: this will still occur only when your app isn't suspended (eg: app is in foreground, `preventSuspend: true`, or `#watchPosition` is engaged).
- [Changed] Refactored iOS "prevent suspend" system to be more robust.
- [Fixed] iOS locations sent to Javascript client had a different `uuid` than the one persisted to database (and synced to server).

## [1.3.2] - 2016-08-16
- [Fixed] Incorrect param signature send to `motionchange` event.  Was sending just location-object.  Should have been `{location: Object, isMoving: Boolean}`
- [Added] Stub `#stopWatchPosition` method until it's implemented
- [Fixed] Documentation bugs with `addGeofence`, `removeGeofence`
 
## [1.3.1] - 2016-08-08
- [Fixed] Scheduler parsing bug.

## [1.3.0] - 2016-08-07
- [Added] Add new dependency react-native-background-fetch for improved handling of background-geolocation while app is suspended.  `react-native-background-fetch` is managed by Transistor Software.  This iOS-only API awakens a suspended iOS app about every 15 min, providing exactly 30s of background running time.  background-geolocation uses these events to sync stored locations, check schedule, samples accelerometer for movement (improves motionchange triggering), and determines whether app should have `stopOnTerminate`

## [1.2.2] - 2016-08-01
- [Changed] Implement improved location-authorization code with automatic native alert popup directing user to settings to fix the problem.  Added new config param `locationAuthorizationAlert` allowing you to configure the strings on the Alert
- [Fixed] iOS setting http `method` not being respected (was always doing `POST`).

## [1.2.0] - 2016-07-22
- [Added] #providerchange method.  Fires when user toggles location-services.
- [Changed] Use `TSLocationManager` as a singleton.  This may help with issues during development where you reload Javascript, causing multiple instances of `TSLocationManager` to begin recording locations.
- [Changed] `#setConfig` accepts `success` and `failure` callbacks

## [1.1.0] - 2016-06-10
- [Changed] `Scheduler` will use `Locale.US` in its Calendar operations, such that the days-of-week correspond to Sunday=1..Saturday=7.
- [Fixed] **iOS** Added `event [motionchange|geofence]` to location-data returned to `onLocation` event. 
- [Changed] Refactor odometer calculation for both iOS and Android.  No longer filters out locations based upon average location accuracy of previous 10 locations; instead, it will only use the current location for odometer calculation if it has accuracy < 100.
- [Fixed] Missing iOS setting `locationAuthorizationRequest` after Settings service refactor
- [Added] new `#getCurrentPosition` options `#samples` and `#desiredAccuracy`. `#samples` allows you to configure how many location samples to fetch before settling sending the most accurate to your `callbackFn`.  `#desiredAccuracy` will keep sampling until an location having accuracy `<= desiredAccuracy` is achieved (or `#timeout` elapses).
- [Added] new `#event` type `heartbeat` added to `location` params (`#is_heartbeat` is **@deprecated**).
- [Fixed] When enabling iOS battery-state monitoring, use setter method `setBatteryMonitoringEnabled` rather than setting property.  This seems to have changed with latest iOS

## [1.0.1] - 2016-05-22
- [Changed] Refactor iOS motion-detection system.  When not set to `disableMotionActivityUpdates` (default), the  plugin will not activate the accelerometer and will rely instead purely upon updates from the **M7** chip.  When `disableMotionActivityUpdates` **is** set to `false`, the pure acceleromoeter based activity-detection has been improved to give more accurate results of the detected activity (ie: `on_foot, walking, stationary`)

## [1.0.0] - 2016-05-17
- [Fixed] Bugs in iOS option `useSignificantChangesOnly`
- [Changed] Refactor HTTP Layer to stop spamming server when it returns an error (used to keep iterating through the entire queue).  It will now stop syncing as soon as server returns an error (good for throttling servers).
- [Added] Migrate iOS settings-management to new Settings service
- [Fixed] bugs in Scheduler
- [Changed] Forward declare `sqlite.h` (#76)
- [Added] Improved functionality with `stopOnTerminate: false`.  Ensure a stationary-geofence is created when plugin is closed while in **moving** state; this seems to improve the time it takes to trigger the iOS app awake after terminate.  When plugin *is* rebooted in background due to geofence-exit, the plugin will briefly sample the accelerometer to see if device is currently moving.

## [0.6.1] - 2016-05-01
- [Added] Add schedule to `#getState`

## [0.6.0] - 2016-05-01
- [Added] Introduce new [Scheduling feature](http://shop.transistorsoft.com/blogs/news/98537665-background-geolocation-scheduler)

## [0.5.1] - 2016-04-15
- [Changed] ios halt stop-detection distance was using `distanceFilter`; changed to use `stationaryRadius`.  This effects users using the accelerometer-based stop-detection system:  after stop is detected, the device must move `stationaryRadius` meters away from location where stop was detected.
- [Changed] When `maxRecordsToPersist == 0`, don't persist any record.
- [Added] Implement `startOnBoot` param for iOS.  iOS always ignored `startOnBoot`.  If you set `startOnBoot: false` now, iOS will not begin tracking when launched in background after device is rebooted (eg: from a background-fetch event, geofence exit or significant-change event)
- [Fixed] Missing `heartbeat` event.

## [0.5.0] - 2016-04-04
- [Fixed] ios `stopOnTerminate` was defaulting to `false`.  Docs say default is `true`.
- [Fixed] ios `useSignificantChangesOnly` was broken.
- [Added] Add odometer to ios location JSON schema
- [Added] Log network reachability flags on connection-type changes.
- [Added] `maxRecordsToPersist` to limit the max number of records persisted in plugin's SQLite database.
- [Added] API methods `#addGeofences` (for adding a list-of-geofences), `#removeGeofences`
- [Changed] The plugin will no longer delete geofences when `#stop` is called; it will merely stop monitoring them.  When the plugin is `#start`ed again, it will start monitoring any geofences it holds in memory.  To completely delete geofences, use new method `#removeGeofences`.
- [Fixed] iOS battery `is_charging` was rendering as `1/0` instead of boolean `true/false`

## [0.4.4] - 2016-03-20
- [Fixed] Issue with timers not running on main-thread.
- [Fixed] Issue with acquriring stationary-location on a stale location.
- [Fixed] Removed some log messages appearing when `{debug: false}`

## [0.4.3] - 2016-03-14
- [Fixed] getState method

## [0.4.2] - 2016-03-14
- [Changed] Standardize the Javascript API methods to send both a `success` as well as `failure` callbacks.
- [Changed] iOS `emailLog` method will attach the log-file as an email attachment rather than rendering the log to the email body.  Email body contains the result of `getState` now.  This standardizes the behaviour between iOS and Android.
- [Added] CHANGELOG

## [0.4.1] - 2016-03-08

- [Added] `@param {Boolean} pausesLocationUpdatesAutomatically [undefined]`.  This option allows you to completely disable the stop-detection system by setting this to `false`.  Location-services will never turn off once engaged.  When set to `true`, you will engage the iOS default of automatically shutting off location-updates after exactly 15min.  When you **don't** provide a value, the plugin's accelerometer-based stop-detection system will be used, where #stopTimeout will be used to determine when to shut off location-services.  This parameter is essentially a tri-state:  `true`, `false`, `undefined`.
- [Added] `@param {String} locationAuthorizationRequest [Always]`  This allows you choose which location-authorization to ask user for:  `WhenInUse` or `Always` (default).  Some developers wish to display the blue top-bar when the app goes to background to show the user their location is being tracked (eg: fitness apps)
- [Changed] Refactored logging.

## [0.4.0] - 2016-02-28

- [Fixed] Bug-fixes and improvements to prevent-suspend mode.
- [Fixed] Refactored iOS persistence layer; better multi-threading support. 
- [Fixed] `getCurrentPosition` timeout. 
- [Changed] `preventSuspend`, `heartbeatInterval` to be changed via `setConfig`. 
- [Changed] `TSReachability` constant `kReachabilityChangedNotification` to `tsReachabilityChangedNotification` to prevent conflicts with other libs. 
- [Fixed] Location-error handling during prevent-suspend mode. 
- [Added] Add methods `#getCount` and `#insertLocation` (for manually adding locations to plugin's SQLite db)
- [Added] Document `#maxBatchSize` config (limits number of records per HTTP request when using `batchSync: true`
- [Fixed] Fixed bug in `maxDaysToPerist`
- [Added] Implemented new `#getLog`, `#emailLog` methods for fetching the current application log at runtime.
