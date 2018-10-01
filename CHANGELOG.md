# Change Log

## [2.13.4] - 2018-10-01
- [Fixed] iOS was missing Firebase adapter hook for persisting geofences.
- [Changed] Android headless events are now posted with using `EventBus` instead of `JobScheduler`.  Events posted via Android `JobScheduler` are subject to time-slicing by the OS so events could arrive late.
- [Fixed] Missing `removeListeners` for `connectivitychange`, `enabledchange` events.
- [Fixed] iOS was not calling `success` callback for `removeListeners`.
- [Fixed] iOS plugin was not parsing schedule in `#ready` event.

## [2.13.3] - 2018-08-30
- [Fixed] Minor error in plugin's `build.gradle`.  `DEFAULT_BUILD_TOOLS_VERSION` was set incorrectly.

## [2.13.2] - 2018-08-29
- [Fixed] iOS scheduler not being initialized in `#ready` after reboot.

## [2.13.1] - 2018-08-17
- [Fixed] Android firebase plugin bug in release build.

## [2.13.0] - 2018-08-15
- [Added] New Android config-option `notificationChannelName` for configuring the notification-channel required by the foreground-service notification.  See *Settings->Apps & Notificaitions->Your App->App Notifications*.
- [Added] Support for new [Firebase Adapter](https://github.com/transistorsoft/react-native-background-geolocation-firebase)
- [Added] iOS support for HTTP method `PATCH` (Android already supports it).
- [Fixed] Android was not using `httpTimeout` with latest `okhttp3`.
- [Fixed] Android issue not firing `providerchange` on boot when configured with `stopOnTerminate: true`
- [Fixed] Android `headlessJobService` class could fail to be applied when upgrading from previous version.  Ensure always applied.
- [Fixed] Android `httpTimeout` was not being applied to new `okhttp3.Client#connectionTimeout`
- [Fixed] Apply recommended XCode build settings. 
- [Fixed] XCode warnings 'implicity retain self in block'
- [Changed] Android Removed unnecessary attribute `android:supportsRtl="true"` from `AndroidManifest`
- [Fixed] iOS `preventSuspend` was not working with `useSignificantChangesOnly`
- [Changed] iOS disable encryption on SQLite database file when "Data Protection" capability is enabled with `NSFileProtectionNone` so that plugin can continue to insert records while device is locked.

## [2.12.2] - 2018-05-25
- [Fixed] Fix `react-native link` error when iOS and npm project name are diferent.
- [Fixed] iOS issue when plugin is booted in background in geofences-only mode, could engage location-tracking mode.
- [Fixed] Android `getCurrentPosition` was not respecting `persist: true` when executed in geofences-only mode.

## [2.12.1] - 2018-05-17
- [Fixed] iOS geofence exit was being ignored in a specific case where (1) geofence was configured with `notifyOnDwell: true` AND (2) the app was booted in the background *due to* a geofence exit event.

## [2.12.0] - 2018-05-11
- [Fixed] Android bug where plugin could fail to translate iOS desiredAccuracy value to Android value, resulting in incorrect `desiredAccuracy` value for Android, probably defaulting to `DESIRED_ACCURACY_LOWEST`.

## [2.12.0-beta.4] - 2018-04-19
- [Added] iOS config `disableLocationAuthorizationAlert` for disabling automatic location-authorization alert when location-services are disabled or user changes toggles location access (eg: `Always` -> `WhenInUse`).
- [Fixed] Android was not executing `#getCurrentPosition` `failure` callback.
- [Fixed] Fixed issue executing `#getCurrentPosition` from Headless mode while plugin is current disabled.
- [Added] Add new iOS `locationAuthorizationRequest: "Any"` for allowing the plugin to operate in either `Always` or `WhenInUse` without being spammed by location-authorization dialog.

## [2.12.0-beta.3] - 2018-03-28
- [Fixed] Android `getCurrentPosition` would not work from a HeadlessTask when the plugin was not currently `enabled`.

## [2.12.0-beta.1] - 2018-03-21
- [Changed] Repackage android lib `tslocationmanager.aar` as a Maven Repositoroy.  :warning: Installation procedure has changed slightly.  Please review Android installation docs for your chosen install method (Manual or react-native link).
- [Added] Added new initialization method `#ready`, desigend to replace `#configure` (which is now deprectated).  The new `#ready` method operates in the same manner as `#configure` with a crucial difference -- the plugin will only apply the supplied configuration `{}` at the first launch of your app &mdash; thereafter, it will automatically load the last-known config from persistent storage.
- [Added] Add new method `#reset` for resetting the plugin configuration to documented defaults.
- [Added] Refactor Javascript API to use Promises.  Only `#watchPosition` and adding event-listeners with `#on` will not use promises.
- [Fixed] iOS issue not turning of "keepAlive" system when `#stop` method is executed while stop-detection system is engaged.
- [Added] Android will fire `providerchange` event after the result of user location-authorization (accept/deny).  The result will be available in the `status` key of the event-object.
- [Changed] Refactor native configuration system for both iOS and Android with more traditional Obj-c / Java API.
- [Changed] Create improved Obj-c / Java APIs for location-requests (`#getCurrentPosition`, `#watchPosition`) and geofencing.
- [Added] Added new event `connectivitychange` for detecting network connectivity state-changes.
- [Added] Added new event `enabledchange`, fired with the plugin enabled state changes.  Executing `#start` / `#stop` will cause this event to fire.  This is primarily designed for use with `stopAfterElapsedMinutes`.

## [2.11.0] - 2018-02-03
- [Fixed] Guard usage of `powersavechange` event for iOS < 9
- [Added] Android permissions are now handled completely within `tslocationmanager` library rather than within Cordova Activity.
- [Fixed] iOS `emailLog` issues:  sanity check existence of email client, ensure we have reference to topMost `UIViewController`.
- [Added] New Android "Headless" mechanism allowing you provide a simple custom Java class to receive all events from the plugin when your app is terminated (with `stopOnTerminate: false`).  The headless mechanism is enabled with new `@config {Boolean} enableHeadless`.  See the Wiki "Headless Mode" for details.
- [Fixed] iOS `getCurrentPosition` was applying entire options `{}` as `extras`.
- [Fixed] iOS `watchPosition` / `getCurrentPosition` `@option persist` was being ignored when plugin was disabled (ie: `#stop`ped).
- [Fixed] Implement Android `JobScheduler` API for scheduler (where API_LEVEL) allows it.  Will fallback to existing `AlarmManager` implementation where API_LEVEL doesn't allow `JobScheduler`.  This fixes issues scheduler issues with strict new Android 8 background-operation rules.
- [Added] Added new Android `@config {Boolean} allowIdenticalLocations [false]` for overriding the default behaviour of ignoring locations which are identical to the last location.
- [Added] Add iOS `CLFloor` attribute to `location.coordinate` for use in indoor-tracking when required RF hardware is present in the environment (specifies which floor the device is on).

## [2.10.1] - 2017-11-12
- [Fixed] Rare issue with iOS where **rapidly** toggling executing `start` with `changePace(true)` in the callback followed by `stop`, over and over again, would lock up the main thread.
- [Changed] Android `GEOFENCE_INITIAL_TRIGGER_DWELL` defaulted to `true`.
- [Fixed] `Proguard-Rules` were not ignoring the new `LogFileProvider` used for `#emailLog` method.
- [Fixed] Android issue on some device where callback to `#configure` would not be executed in certain cases.

## [2.10.0] - 2017-11-10
- [Fixed] Android NPE on `Settings.getForegroundService()` when using `foregroundService: false`
- [Fixed] Android 8 error with `emailLog`.  Crash due to `SecurityException` when writing the log-file.  Fixed by implementing `FileProvider` (storage permissions no longer necessary).
- [Fixed] iOS bug when providing non-string `#header` values.  Ensure casted to String.
- [Changed] Android minimum required play-services version is `11.2.0` (required for new `play-services` APis.  Anything less and plugin will crash.
- [Changed] Update Android to use new [`FusedLocationProviderClient`](https://developers.google.com/android/reference/com/google/android/gms/location/FusedLocationProviderClient) instead of now-deprectated `FusedLocationProviderAPI`.  It's the same underlying play-services location API -- just with a much simpler, less error-prone interface to implement.
- [Fixed] On Android, when `changePace(true)` is executed while device is currently `still` (and remains `still`), `stopTimeout` timer would never initiate until device movement is detected.
- [Fixed] iOS manual `#sync` was not executing *any* callback if database was empty.
- [Added] Implement new Android 8 `NotificationChannel` which is now required for displaying the `foregroundService` notification.
- [Added] Android foreground-service notification now uses `id: 9942585`.  If you wish to interact with the foreground-service notification in native code, this is the `id`.
- [Fixed] iOS not always firing location `failure` callback.
- [Fixed] iOS was not forcing an HTTP flush on `motionchange` event when `autoSyncThreshold` was used.
- [Fixed] iOS Add sanity-check for Settings `boolean` type.  It was possible to corrupt the Settings when a `boolean`-type setting was provided with a non-boolean value (eg: `{}`, `[]`).
- [Fixed] Android `getState` could cause an NPE if executed before `#configure`.
- [Fixed] Work around iOS 11 bug with `CLLocationManager#stopMonitoringSignificantLocationChanges` (SLC):  When this method is called upon *any* single `CLLocationManager` instance, it would cause *all* instances to `#stopMonitoringSignificantLocationChanges`.  This caused problems with Scheduler evaluation, since SLC is required to periodically evaluate the schedule.

## [2.9.4] - 2017-09-25
- [Added] Re-build for iOS 11, XCode 9
- [Added] Implement new `powersavechange` event in addition to `isPowerSaveMode` method for determining if OS "Power saving" mode is enabled.
- [Added] New config `elasticityMultiplier` for controlling the scale of `distanceFilter` elasticity calculation.
- [Fixed] Android bug not firing `schedule` Javascript listeners
- [Fixed] Android crash `onGooglePlayServicesConnectdError` when Google Play Services needs to be updated on device.

## [2.9.3] - 2017-09-15
- [Changed] Refactor Android `onDestroy` mechanism attempting to solve nagging and un-reproducible null pointer exceptions.
- [Added] Implement Android location permissions handling using `PermissionsAndroid` API.  You no longer need to use 3rd-party permissions module to obtain Android location permission.
- [Fixed] Fixed bug not where `stopAfterElapsedMinutes` is not evaluated when executing `#getCurrentPosition`.
- [Fixed] Modifications for Android O.  For now, `foregroundService: true` will be enforced when running on Android O (api 26).

## [2.9.2] - 2017-08-21
- [Changed] Reference latest `react-native-background-fetch` version `2.1.0`
- [Added] Javascript API to plugin's logging system.
- [Fixed] Minor issue with iOS flush where multiple threads might create multiple background-tasks, leaving some unfinished.

## [2.9.0] - 2017-08-16
- [Changed] Refactor iOS / Android core library event-subscription API.
- [Added] Removing single event-listeners with `#removeListener` (alias `#un`) is snow fully supported!  There will no longer be warnings "No listeners for event X", since the plugin completely removes event-listeners from the core library.  You will no longer have to create `noop` event-listeners on events you're not using simply to suppress these warnings.

## [2.8.5] - 2017-07-27
- [Changed] Improve iOS/Android acquisition of `motionchange` location to ensure a recent location is fetched.
- [Changed] Implement `#getSensors` method for both iOS & Android.  Returns an object indicating the presense of *accelerometer*, *gyroscope* and *magnetometer*.  If any of these sensors are missing, the motion-detection system for that device will poor.
- [Changed] The `activitychange` success callback method signature has been changed from `{String} activityName` -> `{Object}` containing both `activityName` as well as `confidence`.  This event only used to fire after the `activityName` changed (eg: `on_foot` -> `in_vehicle`), regardless of `confidence`.  This event will now fire for *any* change in activity, including `confidence` changes.
- [Changed] iOS `emailLog` will gzip the attached log file.
- [Added] Implement new Android config `notificationPriority` for controlling the behaviour of the `foregroundService` notification and notification-bar icon.
- [Changed] Tweak iOS Location Authorization to not show locationAuthorizationAlert if user initially denies location permission.
- [Fixed] Android:  Remove isMoving condition from geofence proximity evaluator.
- [Fixed] Android was creating a foreground notification even when `foregroundService: false`
- [Fixed] iOS 11 fix:  Added new location-authorization string `NSLocationAlwaysAndWhenInUseUsageDescription`.  iOS 11 now requires location-authorization popup to allow user to select either `Always` or `WhenInUse`.

## [2.8.4] -  2017-07-10
- [Fixed] Android & iOS will ensure old location samples are ignored with `getCurrentPosition`
- [Fixed] Android `providerchange` event would continue to persist a providerchange location even when plugin was disabled for the case where location-services is disabled by user.
- [Fixed] Don't mutate iOS `url` to lowercase.  Just lowercase the comparison when checking for `301` redirects. 
- [Changed] Android will attempt up to 5 `motionchange` samples instead of 3.  Cheaper devices can take longer to lock onto GPS.
- [Changed] Android foregroundService notification priority set to `PRIORITY_MIN` so that notification doesn't always appear on top.
- [Fixed] Android plugin was not nullifying the odometer reference location when `#stop` method is executed, resulting in erroneous odometer calculations if plugin was stopped, moved some distance then started again.
- [Added] Android plugin will detect presense of Sensors `ACCELEROMETER`, `GYROSCOPE`, `MAGNETOMETER` and `SIGNIFICANT_MOTION`.  If any of these sensors are missing, the Android `ActivityRecognitionAPI` is considered non-optimal and plugin will add extra intelligence to assist determining when device is moving.
- [Fixed] Bug in broadcast event `GEOFENCE` not being fired when `MainActivity` is terminated (only applies to those use `HeadlessJS`).
- [Added] Implement Javascript API for `removeAllListeners` for...you guessed it:  removing all event-listeners.
- [Fixed] Android scheduler issue when device is rebooted and plugin is currently within a scheduled ON period (fails to start)
- [Fixed] (Android) Fix error calling `stopWatchPosition` before `#configure` callback has executed.  Also add support for executing `#getCurrentPosition` before `#configure` callback has fired.
- [Added] (Android) Listen to LocationResult while stopTimeout is engaged and perform manual motion-detection by checking if location distance from stoppedAtLocation is > stationaryRadius
- [Fixed] Bug in literal schedule parsing for both iOS and Android
- [Fixed] Bug in Android scheduler after app terminated.  Configured schedules were not having their `onTime` and `offTime` zeroed, resulting in incorrect time comparison.

## [2.8.3] - 2017-06-15
- [Fixed] Bug in Android scheduler after app terminated.  Configured schedules were not having their `SECOND` and `MILLISECOND` zeroed resulting in incorrect time comparison.

## [2.8.2] - 2017-06-14
- [Added] New config `stopOnStationary` for both iOS and Android.  Allows you to automatically `#stop` tracking when the `stopTimeout` timer elapses.
- [Added] Support for configuring the "Large Icon" (`notificationLargeIcon`) on Android `foregroundService` notification.  `notificationIcon` has now been aliased -> `notificationSmallIcon`.
- [Fixed] iOS timing issue when fetching `motionchange` position after initial `#start` -- since the significant-location-changes API (SLC) is engaged in the `#stop` method and eagerly returns a location ASAP, that first SLC location could sometimes be several minutes old and come from cell-tower triangulation (ie: ~1000m accuracy).  The plugin could mistakenly capture this location as the `motionchange` location instead of waiting for the highest possible accuracy location that was requested.  SLC API will be engaged only after the `motionchange` location has been received. 
- [Fixed] Headless JS `RNBackgroundGeolocationEventReceiver` was broken in `react-native 0.45.0` -- they removed a mechanism for fetching the `ReactApplication`.  Changed to using a much simpler, backwards-compatible mechansim using simple `context.getApplicationContext()`.
- [Fixed] On Android, when adding a *massive* number of geofences (ie: *thousands*), it can take several minutes to perform all `INSERT` queries.  There was a threading issue which could cause the main-thread to be blocked while waiting for the database lock from the geofence queries to be released, resulting in an ANR (app isn't responding) warning.
- [Changed] Changing the Android foreground-service notification is now supported (you no longer need to `#stop` / `#start` the plugin for changes to take effect).
- [Added] New config option `httpTimeout` (milliseconds) for configuring the timeout where the plugin will give up on sending an HTTP request.
- [Added] Improved `react-native link` automation for iOS.  XCode setup is now completely handled!
- [Fixed] Android bug in `RNBackgroundGeolocationEventReceiver`.  Catch errors when `ReactNativeApplication` can not be referenced (this can happen during `startOnBoot` when the react native App has not yet booted, thus no `registerHeadlessTask` has been executed yet.  It can also occur if the plugin has not been configured with `foregroundService: true` -- Headless JS **requires** `foregroundService: true`)
- [Fixed] When iOS engages the `stopTimeout` timer, the OS will pause background-execution if there's no work being performed, in spite of `startBackgroundTask`, preventing the `stopTimeout` timer from running.  iOS will now keep location updates running at minimum accuracy during `stopTimeout` to prevent this.
- [Fixed] Ensure iOS background "location" capability is enabled before asking `CLLocationManager` to `setBackgroundLocationEnabled`.
- [Added] Implement ability to provide literal dates to schedule (eg: `2017-06-01 09:00-17:00`) 
- [Added] When Android motion-activity handler detects `stopTimeout` has expired, it will initiate a `motionchange` without waiting for the `stopTimeout` timer to expire (there were cases where the `stopTimeout` timer could be delayed from firing due likely to vendor-based battery-saving software)

## [2.8.1] - 2017-05-12
- [Fixed] iOS has a new hook to execute an HTTP flush when network reachability is detected.  However, it was not checking if `autoSync: true` or state of `autoSyncThreshold`.

## [2.8.0] - 2017-05-08
- [Added] When iOS detects a network connection with `autoSync: true`, an HTTP flush will be initiated.
- [Fixed] Improve switching between tracking-mode location and geofence.  It's not necessary to call `#stop` before executing `#start` / `#startGeofences`.
- Fixed] iOS `maximumAge` with `getCurrentPosition` wasn't clearing the callbacks when current-location-age was `<= maximumAge`
- [Fixed] iOS when `#stop` is executed, nullify the odometer reference location.
- [Fixed] iOS issue with `preventSuspend: true`:  When a `motionchange` event with `is_moving: false` occurred, the event was incorrectly set to `heartbeat` instead of `motionchange`.
- [Fixed] Android null pointer exception when using `startOnBoot: true, forceReloadOnBoot: true`:  there was a case where last known location failed to return a location.  The lib will check for null location in this case.
- [Changed] iOS minimum version is now `8.4`.  Plugin will log an error when used on versions of iOS that don't implement the method `CLLocationManager#requestLocation`
- [Fixed] iOS bug executing `#setConfig` multiple times too quickly can crash the plugin when multiple threads attempt to modify an `NSMutableDictionary`
- [Fixed] Android was rounding `battery_level` to 1 decimal place.
- [Fixed] iOS geofences-only mode was not using significant-location-change events to evaluate geofences within proximity.
- [Changed] iOS now uses `CLLocationManager requestLocation` to request the `motionchange` position, rather than counting samples.  This is a more robust way to get a single location
- [Fixed] iOS crash when providing `null` values in `Object` config options (ie: `#extras`, `#params`, `#headers`, etc)
- [Fixed] iOS was creating `backgroundTask` in `location` listener even if no listeners were registered, resulting in growing list of background-tasks which would eventually be `FORCE KILLED`.
- [Added] New config option `locationsOrderDirection [ASC|DESC]` for controlling the order that locations are selected from the database (and synced to your server).  Defaults to `ASC`.
- [Added] Support for React Native "Headless JS"
- [Added] Support for iOS geofence `DWELL` transitions.

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
