# Change Log

## 4.18.7 &mdash; 2025-05-19
* [Android] Fix `java.util.ConcurrentModificationException at com.transistorsoft.locationmanager.location.SingleLocationRequest.getBestLocation`.
* For `Config.authorization`, add `id_token` as an accepted synonym for "`access_token`" received from authorization server (Google Cloud format).

## 4.18.6 &mdash; 2025-02-20
* [iOS] Fix `ProviderChangeEvent.enabled` not showing the result of global *Privacy -> Location Services -> Enabled* switch

## 4.18.5 &mdash; 2025-02-13
* [Android] Re-compile library with jdk 17 instead of 22
* [Android] Fix `ConcurrentModificationException` in `StopTimeoutEvaluator`.

## 4.18.4 &mdash; 2025-02-10
* [Android] Catch database exceptions hydrating records from SQLite.

## 4.18.3 &mdash; 2024-12-19
* [Android] Fix `ObjectAlreadyConsumedException`.
* [Android] Address phenomenon of UI freezing.

## 4.18.2 &mdash; 2024-12-07
* [Android] Oops, accidentally removed deprecated `package` attribute from plugin's `AndroidManifest` -- this is required by RN's auto-linking!

## 4.18.1 &mdash; 2024-12-07
* [Android] Re-factor HeadlessTask.java.  Introduce HeadlessTaskManager class.
* [Android] remove previous requirement in `4.18.1` to call `BackgroundGeolocation.finishHeadlessTask(taskId)`.

## 4.18.0 &mdash; 2024-12-02
* [Android] implement support for new "Bridgeless Architecture"

## 4.17.6 &mdash; 2024-11=12
* [Android] Remove enforcement of minimum Geofence radius `150`
* [Android] Fix issue with `TSLocationManagerActivity` (responsible for showing location permission / authorization dialogs).  Minimizing the app with an active permission dialog would cause the app's `MainActivity` to terminate on some devices.

## 4.17.5 &mdash; 2024-11-08
* [Android] Fix reported "screen flickering" issue on some devices when SDK requests permissions.
* [Android] Address Android synchronization issue with `TSLocation.toMap`.
* [iOS] Address crash in `TSConfig` due to "uncaught exception NSInvalidArgumentException"
* [Android] Change `foregroundServiceType` on `LocationRequestService` from `shortService` -> `location`.
* [iOS] Address inconsistent location-tracking performance on iOS.

## 4.17.4 &mdash; 2024-10-23
* [iOS] Fix bug with `triggerActivites` preventing motion-triggering in iOS simulator with simulated location.

## 4.17.3 &mdash; 2024-10-21
* [Android] Implement `Service.onTimeout` to handle `foregroundServiceType="shortService"` timeouts.
* [iOS] Add new `Config.activityType` `ACTIVITY_TYPE_AIRBORNE`.
* [iOS] Implement `Config.triggerActivities` for iOS.
* [Android] Guard against `NullPointerException` receiving a null location in `PolygonGeofenceService` event.
* Fix crash in RPC action for `addGeofence` when adding polygon geofence.
* Add two new RPC actions `setOdometer`, `resetOdometer`.
* [iOS] Fix broken linking to Settings screen in `locationAuthorizationAlert` on iOS 18.

## 4.17.2 &mdash; 2024-10-01
* [Android] Address possible leak of `Activity` reference when terminating the app.  Ensure internal reference to `Activity` is nullified when app is terminated.
* [Android] Add improvements to Android geofencing-only mode with `goefenceModeHighAccuracy: true` where motion-activity updates disabled.
* [Android] Add error-checking in polygon-geofencing to handle a possible `NullPointerException`.

## 4.17.1 &mdash; 2024-09-05
* [Expo] Fix bug in Expo plugin adding unused license keys for "polygon geofencing" with a value of `UNDEFINED`, causing license-validation error.  Add logic to automatically remove license keys from `AndroidManifest` when corresponding keys are not found in your `app.json` (eg: `polygonLicense`).

## 4.17.0 &mdash; 2024-09-04
* [iOS] Fix bug in iOS *Polygon Geofencing* when running in geofences-only mode (`.startGeofences`).  iOS would mistakenly turn off location updates exactly 3 samples into the containing circular geofence of a polygon.
* Implement `notifyOnDwell` for polygon-geofences.

## 4.16.6 &mdash; 2024-09-05
* [Expo] Backport Expo license-key fix from `4.17.1`.

## 4.16.5 &mdash; 2024-07-12 
* [Android][Expo] Conditionally add polygonLicense only if provided in Config.  Do not write to AndroidManifest unless provided.

## 4.16.4 &mdash; 2024-07-08
* [Android][Expo] Implement polygonLicense Config option

## 4.16.3 &mdash; 2024-06-12
* [Android] Remove permission `FOREGROUND_SERVICE_HEALTH`.  It turns out that this permission is no longer required whe
n the `ActivityRecognitionServivce` is defined with a `foregroundServiceType="shortservice"`, instead of `"health"`, which allows a background
-launched foreground-service to stay active for up to 3 minutes, which is sufficient for the `ActivityRecognitionServic
e`, which typically stays activated only for a few milliseconds.
* [Android] Fix "Multiple geofence events triggered for a single geofence registration when registered individually".

## 4.16.2 &mdash; 2024-05-14
* [Android] Fix bug in .getCurrentPosition not returning or throwing an error in a condition where Network OFF and GPS ON.

## 4.16.1 &mdash; 2024-04-22
* [iOS] Code-sign `TSLocationManager.xcframework` with new Apple Organization (*9224-2932 Quebec Inc*) certificate.

## 4.16.0 &mdash; 2024-03-28
* [iOS] codesign `TSLocationManage.xcframework`
* [iOS] Update `CocoaLumberjack` version -> `3.8.5` (version which includes its own `PrivacyInfo`)
* [iOS] Implement new [iOS Privacy Manifest](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files?language=objc)
* Add property `AuthorizationEvent.status`, provding the HTTP status code from the `refreshUrl`.

## 4.15.2 &mdash; 2024-03-18
* [iOS] Fix bug in iOS scheduler, triggering ON incorrectly.  For example, given a `schedule: ['1 00:00-23:59'], the plu
gin was trigging on for `DAY 2`.

## 4.15.1 &mdash; 2024-03-15
* [iOS] Fix bug in polygon-geofencing:  monitoredIdentifiers not being cleared when `.removeGeofences()` is called, can result in null-pointer exception.
* [Android] Change `foregroundServiceType` of the SDK's `GeofencingService` definition in its `AndroidManifest` from `shortService` -> `location`.

## 4.15.0 &mdash; 2024-02-27
* [iOS] Modify behaviour of stop-detection system to NOT turn off location-services but merely adjust desiredAccuracy as high as possible.  There were problems reported using `locationAuthorizationRequest: 'WhenInUse'` with recent versions
of iOS where the stop-detection system could put the app to sleep during tracking if the motion API reported the device
became momentarily stationary.

## 4.14.6 &mdash; 2024-01-29
* [Expo][Android] Fix bug for Expo v50 "Invalid regular expression".

## 4.14.5 &mdash; 2023-11-16
* [Android] Fix problem with polygon-geofencing license-validation not working in DEBUG builds when configured with pro
duct flavors.

## 4.14.4 &mdash; 2023-11-06
* [Android] HMS geolocation event does not provide a timestamp for the triggering location!!  Use System current time.
* [Android] Guard against Geofence SQLite query returning null in `GeofencingService`.
* [Android] Fix `ConcurrentModificationException` in `SingleLocationRequest.getBestLocation`

## 4.14.3 &mdash; 2023-10-12
* [Android] Fix `IllegalStateException` calling addGeofences when number of geofences exceeds platform maximum (100).

## 4.14.2 &mdash; 2023-10-05
* [Android] `getGeofence` / `getGeofences` not returning new `Geofence.vertices` property.

## 4.14.1 &mdash; 2023-10-03
* [iOS] Fix "*Duplicate symbol error DummyPods_TSLocationManager*".
* [Android] Fix timeout issue in `.watchPosition`.

## 4.14.0 &mdash; 2023-09-29
* **Polygon Geofencing**:  The Background Geolocation SDK now supports *Polygon Geofences* (Geofences of any shape).  For more information, see API docs [`Geofence.vertices`](https://transistorsoft.github.io/react-native-background-geolocation/interfaces/geofence.html#vertices).  ℹ️ __*Polygon Geofencing*__ is [sold as a separate add-on](https://shop.transistorsoft.com/products/polygon-geofencing) (fully functional in *DEBUG* builds).

![](https://dl.dropbox.com/scl/fi/sboshfvar0h41azmb4tyv/polygon-geofencing-parc-outremont-400.png?rlkey=d2s0n3zbzu72e7s2gch9kxd4a&dl=1)
![](https://dl.dropbox.com/scl/fi/xz48myvjnpp8ko0l2tufg/polygon-geofencing-parc-lafontaine-400.png?rlkey=sf20ns959uj0a0fq0atmj55bz&dl=1)

* Remove `backup_rules.xml` from `AndroidManifest.xml` &mdash; it's causing conflicts with other plugins.
* [Android] Add proguard-rule for compilation of the android library to prevent from obfuscating the `BuildConfig` class to `a.a.class`, conflicting with other libraries.

## 4.13.3 &mdash; 2023-09-05
* [Android] Performance enhancements and error-checking.
* [Typescript] Add missing `LocationError` value `3`;

## 4.13.2 &mdash; 2023-08-24

* [Android] Fix memory-leak in `.startBackgroundTask`:  If a `Task` timed-out and is "FORCE KILLED", it was never removed from a `List<Task>`.
* [Android] Fix `Exception NullPointerException:at com.transistorsoft.locationmanager.util.BackgroundTaskWorker.onStopped`

## 4.13.1 &mdash; 2023-08-24
* [Android] :warning: If you have the following elements defined in your __`AndroidManifest.xml`__, __DELETE__ them:
```diff
-       <service android:name="com.transistorsoft.locationmanager.service.TrackingService" android:foregroundServiceType="location" />
-       <service android:name="com.transistorsoft.locationmanager.service.LocationRequestService" android:foregroundServiceType="location" />
```
* [iOS] Fix build failure "Use of '@import' when C++ modules are disabled"
* [Android] Modify Foreground-service management to use `stopSelfResult(startId)` instead of `stopSelf()`.  This could improve reports of Android ANR
`Context.startForeground`.
* [Android] Re-factor getCurrentPosition to prefer more recent location vs more accuracy (within limits)
* [Android] Android 14 (API 34) support:  Android 14 is more strict with scheduling `AlarmManager` "exact alarms" (which the plugin does take advantage of).  If you wish the plugin to use `AlarmManager` "exact alarms" in your app, you must now explicitly define that permission in your own `AndroidManifest`:
```xml
<manifest>
    <uses-permission android:minSdkVersion="34" android:name="android.permission.USE_EXACT_ALARM" />
</manifest>
```

* [Android] Android 14 (API 34) support:  Re-factor BackgroundTaskService to use `WorkManager` instead of a foreground-service.
* [Android] Android 14 (API 34) support: Due to new runtime permission requirements on `AlarmManager` exact alarms (`android.permission.SCHEDULE_EXACT_ALARM`), the plugin can no longer rely upon launching a foreground-service using an exact alarm.  Instead, the plugin will create a geofence around the current position (configured with `initialTriggerEntry`) to hopefully immediately launch a foreground-service to handle the fake geofence event, since Android allows foreground-service launches due to Geofencing events.
* [Android] Android 14 (API 34) support:  All foreground-services now require an `android:foregroundServiceType` in the plugin's `AndroidManifest` (handled automatically by the plugin).
* [Android] Android 14 (API 34) support: Fix error "*One of RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED should be specified*" in `DeviceSettings.startMonitoringPowerSaveChanges`.
* [Android] Add sanity-check for invalid `Geofence` arguments (eg: invalid latitude/longitude).
* [Android] Add safety-checks in ForegroundService stop-handling.  There was a report of a *reproducible* crash while aggressively calling `.getCurrentPosition` in a `Timer` (eg: every second).
* [Android] Demote `HeartbeatService` from a Foreground Service to `AlarmManager` ONESHOT.  :warning: In your `onHeartbeat` event, if you intend to perform any kind of asynchronous function, you should wrap it inside `BackgroundGeolocation.startBackgroundTask` in order to prevents the OS from suspending your app before your task is complete:

```javascript
BacckgroundGeolocation.onHeartbeat(async (event) => {
  console.log("[onHeartbeat] $event");
  // First register a background-task.
  const taskId = await BackgroundGeolocation.startBackgroundTask();
  try {
    // Now you're free to perform long-running tasks, such as getCurrentPosition()
    const location = await BackgroundGeolocation.getCurrentPosition({
      samples: 3,
      timeout: 30,
      extras: {
        "event": "heartbeat"
      }
    });
    console.log("[onHeartbeat] location:", $location);
  } catch(error) {
    console.log("[getCurrentPosition] ERROR:", error);
  }
  // Be sure to singal completion of your background-task:
  BackgroundGeolocation.stopBackgroundTask(taskId);
});
```

* [Android] Fix NPE iterating a `List` in `AbstractService`.
* [Android] If a `SingleLocationRequest` error occurs and at least one sample exits, prefer to resolve the request successfully rather than firing the error (eg: `getCurrentPosition`, `motionchange`, `providerchange` requests).

## 4.12.1 &mdash; 2023-05-19
* [Android][Expo] Adjust Expo plugin with Support for monorepos where the module may not exist in the expected node_modules path.
* [Android] Introduce gradle config ext vars for `logbackAndroidVersion` and `slf4jVersion`.
 
## 4.12.0 &mdash; 2023-05-04
* [Android] Gradle v8 now requires `namespace` attribute in gradle files.
* [iOS] iOS 16.4 made a major change to location-services, exposed only when `Config.showsBackgroundLocationIndicator` is `false` (the default).  As a result of this change, `Config.showsBackgroundLocationIndicator` will now default to `true`.

## 4.11.4 &mdash; 2023-04-28
* Add [Huawei HMS License](https://shop.transistorsoft.com/collections/frontpage/products/huawei-background-geolocation) support for the Expo plugin.

## 4.11.3 &mdash; 2023-04-19
* [Android] Upgrade `logback-android` dependency to `3.0.0` (`org.slf4j-api` to `2.0.7).

## 4.11.2 &mdash; 2023-04-12
* [Android] Fix String concatenation issue on Turkish devices where method-name composed for use with reflection is in
correctly capitalized (ie: `isMoving -> setIsMoving` is incorrectly capitalized with Turkish capital as `setİsMoving`
.  Simply enforce `Locale.ENGLISH` when performing `String.toUpperCase(Locale.ENGLISH)`.

* [iOS] Fix bug in TSScheduler.  When schedule was cleared via .setConfig, only the State.schedulerEnabled property was set to false, but the TSScheduler singleton contained an internal 'enabled' property which was not reset to false.  Solution was to simply call stop() method upon TSScheduler singleton.

## 4.11.1 &mdash; 2023-03-30
* [Android] Bump default `hmsLocationVersion = 6.9.0.300`.  There are reports of Google rejecting apps due to older huawei HMS dependencies.
* [Android] Fix `ClassCastException` related to Motion API error

## 4.11.0 &mdash; 2023-03-29
* [Android] Introduce __Huawei HMS Support__.  Requires a separate license key [purchased here](https://shop.transistorsoft.com/collections/frontpage/products/huawei-background-geolocation).
* [iOS] Fix for iOS 16.4.  iOS 16.4 introduces changes to CoreLocation behaviour when using Config.showsBackgroundLocationIndi
cator: false.
* [Android] Added extra logic in a location error-handler to mitigate against a possible edge-case where a location-error fetching the onMotionChange position could possibly result in an infinite loop, causing a stackoverflow exception:
```
at com.transistorsoft.locationmanager.service.TrackingService.changePace(TrackingService.java:264)
at com.transistorsoft.locationmanager.service.TrackingService$c.onError(TrackingService.java:69)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.onError(SingleLocationRequest.java:18)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.start(SingleLocationRequest.java:71)
at com.transistorsoft.locationmanager.location.TSLocationManager.getCurrentPosition(TSLocationManager.java:3)
at com.transistorsoft.locationmanager.service.TrackingService.changePace(TrackingService.java:321)
at com.transistorsoft.locationmanager.service.TrackingService$c.onError(TrackingService.java:69)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.onError(SingleLocationRequest.java:18)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.start(SingleLocationRequest.java:71)
at com.transistorsoft.locationmanager.location.TSLocationManager.getCurrentPosition(TSLocationManager.java:3)
at com.transistorsoft.locationmanager.service.TrackingService.changePace(TrackingService.java:321)
at com.transistorsoft.locationmanager.service.TrackingService$c.onError(TrackingService.java:69)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.onError(SingleLocationRequest.java:18)
at com.transistorsoft.locationmanager.location.SingleLocationRequest.start(SingleLocationRequest.java:71)
.
.
.
```

## 4.10.1 &mdash; 2023-03-13
* [Android] Fix expo plugin failing on Expo SDK >= 48.  Regular expressions failed because Expo changed lines in the build.gradle files that the Expo plugin was using for anchors for where to inject new src.  Changed to use more fundamental anchor elements for regular expressions that must exist.

## 4.10.0 &mdash; 2023-02-01
* [Fixed][Android] Implement support for `play-services-location v21` (`ext.playServicesLocationVersion` in your `android/build.gradle`).  The plugin can now work with either `<= v20` or `>= v21`.

## 4.9.5 &mdash; 2023-01-19
* [Fixed] Fixed inconsistency in API docs with `location.activity` (`location.activity.type`) and `MotionChangeEvent` provided to `onActivityChange` (`motionActivityEvent.activity`).
* [Changed] __Android__ Update `logback-android` version.

## 4.9.4 &mdash; 2022-12-12
* [Fixed] __Android__: Catch `Fatal Exception: java.lang.IllegalArgumentException: NetworkCallback was already unregistered`
* [Fixed] __Android__ It has been discovered that the Android logger `logback-android` has not been automatically clearing all expired records (`Config.logMaxDays`) from the log database.  The `logback-android` database consists of three tables and only *one* was being cleared (see https://github.com/tony19/logback-android/pull/214), resulting in a constantly growing database (where `logLevel > LOG_LEVEL_OFF`).  This version of the plugin will alter the `logback-android` database tables with `ON DELETE CASCADE` to ensure all log-data is properly removed.
* [Added] Added two new *HTTP RPC* commands `stopSchedule` and `startSchedule` (See API docs *HTTP Guide* for more information).

## 4.9.3 &mdash; 2022-10-26
* [Android] Fix logic error with `getCurrentPosition` not respecting `timeout`.

## 4.9.2 &mdash; 2022-10-25
* [Android] `play-services:location` has [introduced a breaking change](https://developers.google.com/android/guides/releases#october_13_2022) in `v21`, breaking the plugin.  `googlePlayServicesLocationVersion` will be capped with a maximum of `v20`.  The next major release (`4.10.0`) will set a minimum required version of `v21`.
* [Expo] The plugin now implements an Expo plugin for automated Setup.
* [iOS] Fix bug in iOS scheduler firing on days where it should not.
* [iOS] Rebuild `TSLocationManager.xcframework` with *XCode 13* (instead of *XCode 14*).
* [Android] Add new Config `Notification.channelId` for custom customizing the `NotificationChannel` id.  Some use
rs have an existing foreground-service and `NotificationChannel` so wish to have the plugin's foreground-service
s share the same notification and channel.  This option should generally not be used.
* [Android] Add permission `android.permission.POST_NOTIFICATIONS` for Android 13 (targetSdkVersion 33).  Requ
ired to allow enabling notifications in Settings->Apps.
* [Android] Add new Config option `Authorization.refreshHeaders` for full control over HTTP headers sent to `Author
ization.refreshUrl` when refreshing auth token.
* [Android] Add `null` check when executing `PowerManager.isPowerSaveMode()`
* [Android] Add new `Config.disableProviderChangeRecord (default false)` to allow disabling the automatical HTTP POST of the `onProviderChange` location record.  Some users do not want this automatically uploaded locatio
n whenever the state of location-services is changed (eg: Location-services disabled, Airplane mode, etc).
* [Android] Fix bug with `disableMotionActivityUpdates: true` and calling `.start()` followed immediately by `.changePace(true)`.  The SDK would fail to enter the moving state, entering the stationary state instead.
* [iOS] Add new iOS 15 `CLLocation` attribute `Location.ellipsoidal_altitude` *The altitude as a height above the World Geodetic System 1984 (WGS84) ellipsoid, measured in meters*.  Android `Location.altitude` has always returned *ellipsoidal altutude*, so both `Location.altitude` and `Location.ellipsoidal_altitude` will return the same value.

## 4.8.2 &mdash; 2022-08-08
* [Android] Fix `java.lang.IllegalArgumentException `TSProviderManager.handleProviderChangeEvent`.
* [Android] `startOnBoot: false` with `stopOnTerminate: false` could start-on-boot.
* [Android] `State.enabled` returned by calling `.stop()` returns `true` due to implementation running in a background-thread but `callback` executed immediately on the main-thread.  However, requesting `.getState()` immediately after calling `.stop` *would* return the correct value of `State.enabled`
* [Android] Fix `notification.sticky` not being respected.

## 4.8.1 &mdash; 2022-06-28
* Fix issue for react-native 0.69:  They made a breaking change with the old, unused react-native.config.js, causing builds to fail.  Simply delete the file `react-native.config.js`.

## 4.8.0 &mdash; 2022-06-21
* [Android] Fix bug in `onProviderChange` event:  not properly detecting when location-services disabled.
* [Android] __Android 12__:  Guard `Context.startForegroundService` with `try / catch`: the plugin will now catch exception `ForegroundServiceStartNotAllowedException` and automatically retry with an `AlarmManager` *oneShot* event.
* [Android] __Android 12__: Refactor foreground-service management for Android 12:  A way has been found to restore the traditional behaviour of foreground-services, allowing them to stop when no longer required (eg: where the plugin is in the stationary state).
* [Android] Refactor application life-cycle management.  Remove deprecated permission `android.permission.GET_TASKS` traditionally used for detecting when the app has been terminated.  The new life-cycle mgmt system can detect Android headless-mode in a much more elegant manner.
* [Android] Better handling for `WhenInUse` behaviour:  The plugin will not allow `.changePace(true)` to be executed when the app is in the background (since Android forbids location-services to initiated in the background with `WhenInUse`).
* [Android] Refactor `useSignificantChangesOnly` behaviour.  Will use a default `motionTriggerDelay` with minimum 60000ms, minimum `distanceFilter: 250` and enforced `stopTimeout: 20`.
* [iOS] iOS 15 has finally implemented *Mock Location Detection*.  `location.mock` will now be present for iOS when the location is mocked, just like Android.
* [Android] Re-factor onProviderChange.  Add broadcast-receiver for `AIRPLANE_MODE` detection.
* [Android] Add guard against Android 12 issue where location-services fail to turn off after terminate and plugin enters stationary state.
* [Android] Prevent recording motionchange position from running after onProviderChange.
* [Android] Fix bug in Android 12 support for executing `.start()` in background while terminated.  Used `JobScheduler` ONESHOT instead of `AlarmManager`.
* [Android] Plugin could be placed into an infinite loop requesting motionchange position in some cases.
* [Android] Address `ConcurrentModificationException` in `onPermissionGranted`.

## 4.7.1 &mdash; 2022-05-12
* [Android] If on device reboot location-services fails to provide a location (eg: timeout, airplane mode), the plugin would rely on motion API events to try again.  This is a problem if the motion api is disabled.  Instead, the SDK will keep trying to retrieve a location.
* [Android] Android 12 support for `ForegroundServiceStartNotAllowedException`:  immediately launch the SDK's `TrackingService` as soon as `.start()` executes.  If a location-timeout occurs while fetching the onMotionChange position after device reboot with `startOnBoot: true`, the `ForegroundServiceStartNotAllowedException` could be raised.
* [Android] Add two new attributes `android:enabled` and `android:permission` to the SDK's built-in `BootReceiver`:
```xml
<receiver android:name="com.transistorsoft.locationmanager.BootReceiver" android:enabled="true" android:exported="false" android:permission="android.permission.RECEIVE_BOOT_COMPLETED">
```
* [Android] Android 12 support for executing `.start()` and `.getCurrentPosition()` while the plugin is disabled and in the background.  This is a bypass of new Android 12 restrictions for starting foreground-services in the background by taking advantage of AlarmManager.
```
Fatal Exception: android.app.ForegroundServiceStartNotAllowedException: startForegroundService() not allowed due to mAllowStartForeground false: service
```
* [Android] Added two new `androidx.lifecycle` dependencies to plugin's `build.gradle`, in addition to corresponding `ext` vars `ext.lifeCycleRunTimeVersion` and `ext.lifeCycleRuntimeVersion`
- `"androidx.lifecycle:lifecycle-runtime"`
- `"androidx.lifecycle:lifecycle-extensions"`

## 4.6.0 &mdash; 2022-04-29
* [Android] Add a few extra manufacturer-specific `Intent` for `DeviceSettings.showPowerManager()`.
* [Android] Minimum `compileSdkVersion 31` is now required.
* [Android] Now that a minimum `targetSdkVersion 29` is required to release an Android app to *Play Store*, the SDK's `AndroidManifest` now automatically applies `android:foregroundServiceType="location"` to all required `Service` declarations.  You no longer need to manually provide overrides in your own `AndroidManifest`, ie:
```diff
<manifest>
    <application>
-       <service android:name="com.transistorsoft.locationmanager.service.TrackingService" android:foregroundServiceType="location" />
-       <service android:name="com.transistorsoft.locationmanager.service.LocationRequestService" android:foregroundServiceType="location" />
    </application>
</manifest>
```
* [Android] Upgrade `android-permissions` dependency from 0.1.8 -> 2.1.6.
* [iOS] Rebuild `TSLocationManager.xcframework` with XCode 13.3

## 4.4.6 &mdash; 2022-03-29
* [Android] While testing adding 20k geofences, the Logger can cause an `OutOfMemory` error.  Define a dedicated thread executor `Executors.newFixedThreadPool(2)` for posting log messages in background.
* [iOS] remote event-listeners in onAppTerminate to prevent onEnabledChange event being fired in a dying app configured for `stopOnTerminate: true`

## 4.4.5 &mdash; 2022-01-20
* [Fixed][iOS] Regression bug in iOS SAS authorization strategy
* [Fixed][Android] Android logger defaulting to LOG_LEVEL_VERBOSE when initially launched configured for LOG_LEVEL_OFF
* [Changed][iOS] Rebuild with latest XCode `13.2.1`

## 4.4.4 &mdash; 2021-11-11
* [Fixed][iOS] More issues with iOS plugin 'invalidate' method.  Get rid of this method.  Implement startObserving, stopObserving.

## 4.4.3 &mdash; 2021-11-10
* [Fixed][iOS] Backwards compatibility issue:  react-native@0.66 does have this method.  `No visible @interface for 'RCTEventEmitter' declares the selector 'invalidate' in RNBackgroundGeolocation.m`.  

## 4.4.2 &mdash; 2021-10-29
* [Fixed][Android] Android 12 behaviour changes mean that foreground-services remain running.  When an Android app is terminated, the app process does not terminate (since the foreground-service is active) and `RNBackgroundGeolocationModule` remains in memory.  Given that, the plugin cannot rely on registering its event-listeners in the `RNBackgroundGeolocationModule` constructor, but must perform that task when `.ready()` is called.  This also requires resetting `mReady = false` when the `MainActivity` is destroyed, so that the next time `.ready()` is called, the event-listeners are re-registered.
* [Fixed][Android] When `.ready()` is called __`reset: false`__, the `success` callback was not invoked with the current `State`.  This bug was introduced in previous `v4.4.1`.

## 4.4.1 &mdash; 2021-10-29
* [Added] Added a `Subscription` interface to Typescript API.  Added helpful docs to Subscription for new event-handler subscriptions.

```typescript
import BackgroundGeolocation, {
  Subscription
} from "...";
.
.
.
const subscription:Subscription = BacckgroundGeolocation.onLocation(myHandler);
```

## 4.4.0 &mdash; 2021-10-25
* [Added] New `Authorization.strategy "SAS"` (alternative to default `JWT`).
* [Fixed] Fixed __`RCTEventEmitter`__ warning "addListener", "removeListeners".  A corresponding fix has also been released for [react-native-background-fetch](https://github.com/transistorsoft/react-native-background-fetch/blob/master/CHANGELOG.md#404--2021-10-22) so be sure to update to `background-fetch >= 4.0.4`.
* [Changed] **Deprecated** `BackgroundGeolocation.removeListener`.  All event-handlers now return a `react-native` `Subscription` instance containing a `.remove()` method.  You will keep track of your own `subscription` instances and call `.remove()` upon them when you wish to remove an event listener.  Eg:

```javascript
/// OLD
const onLocation = (location) => {
    console.log('[onLocation');
}
BackgroundGeolocation.onLocation(onLocation);
...
// deprecated: removeListener
BackgroundGeolocation.removeListener('location', onLocation);

/// NEW:  capture returned subscription instance.
const onLocationSubscription = BackgroundGeolocation.onLocation(onLocation);
...
// Removing an event-listener.
onLocationSubscription.remove();
```

## 4.3.0 &mdash; 2021-09-14

* [Added][Android] Implement new Android 12 "reduced accuracy" mechanism `requestTemporaryFullAccuracy`.
* [Fixed][iOS] `Authorization.refreshPayload refreshToken` was not performing a String replace on the `{refreshToken}` template, instead over-writing the entire string.  Eg:  if provided with `'refresh_token': 'Bearer {refreshToken}`, `Bearer ` would be over-written and replaced with only the refresh-token.
* [Fixed][Android] Fixed crash reported by Huawei device, where verticalAccuracy returns NaN.

## [4.2.2] &mdash; 2021-08-23
* [Fixed][iOS] add config change listeners for `heartbeatInterval` and `preventSuspend` to dynamically update interval when changed with `setConfig`.
* [Fixed][Android] Add `accuracyAuthorization` param to event data provided to `onProviderChange` event.
* [Changed][Android] Update Android default `okhttp` version to `3.12.13`.
* [Changed][Android] Update Android `eventbus` version to `3.2.0`.
* [Changed][Android] Update Android `android-permissions` to import from *MavenCentral* instead of deprecated `jCenter`.
* [Fixed][Android] Fix an edge-case requesting motion permission.  If `getCurrentPosition()` is executed before `.start()`, the Android SDK fails to request motion permission.

## 4.1.2 &mdash; 2021-07-05
* [Changed] Build iOS TSLocationManager.xcframework with XCode 12.4 instead of 12.5

## 4.1.1 &mdash; 2021-06-11
* [Fixed][iOS] Reports 2 reports of iOS crash `NSInvalidArgumentException (TSLocation.m line 178)` with iOS 14
.x.  Wrap JSON serialization in @try/@catch block.  iOS JSON serialization docs state the supplied NSError err
or ref should report problems but it seems this is only "sometimes" now.

## 4.1.0 &mdash; 2021-06-07
* [Changed] `Config.authorization` will perform regexp on the received response, searching for keys such as `accessToken`, `access_token`, `refreshToken`, `refresh_token`.
* [Fixed] Typescript definition for interface `HeadlessEvent` was missing `timeout: boolean` attribute.  Thanks @mikehardy.
* [Added] Add typescript constants for plugin events, eg: `BackgroundGeolocation.EVENT_MOTIONCHANGE`.

## 4.0.3 &mdash; 2021-04-08
* [Fixed][iOS] `"OBJC_IVAR$_DDLogMessage._tag"`.  CocoaLumberjack pushed a breaking change to 3.7.1 on 04/08.  Pins CocoaLumberjack@3.7.0

## 4.0.2 &mdash; 2021-03-25

* [Changed] Re-generate docs with latest typedoc.  The docs search feature now actually works.
* [Changed][iOS] Update `pod CocoaLumberjack` to latest `~> 3.7.0`.

## 4.0.01 &mdash; 2021-03-16

* [Changed][iOS] Simply apply a cocoapods version constraint of `1.10.0` in podspec.

## 4.0.0 &mdash; 2021-03-09

* [Changed][iOS] Migrate `TSLocationManager.framework` to new `.xcframework` for *MacCatalyst* support with new Apple silcon.

### :warning: Breaking Change:  Requires `cocoapods >= 1.10+`.

*iOS'* new `.xcframework` requires *cocoapods >= 1.10+*:

```console
$ pod --version
// if < 1.10.0
$ sudo gem install cocoapods
```

### :warning: Requires `react-native-background-fetch@4.0.1`.

- See [Breaking Changes with `react-native-background-fetch@4.0.0`](https://github.com/transistorsoft/react-native-background-fetch/blob/master/CHANGELOG.md#401--2021-02-18)

```console
$ yarn add react-native-background-fetch@4.0.1
```

## 3.10.0 &mdash; 2021-03-09
- [Fixed][iOS] `startOnBoot: false` was not being respected.
- [Fixed][Android] If multiple simultaneous calls to `getCurrentPosition` are executed, the location permission handler could hang and not return, causing neither `getCurrentPosition` request to execute.
- [Changed] Remove `Config.encrypt` feature.  This feature has always been flagging a Security Issue with Google Play Console and now the iOS `TSLocationManager` is being flagged for a virus by *Avast* *MacOS:Pirrit-CS[PUP]*.  This seems to be a false-positive due to importing [RNCryptor](https://github.com/RNCryptor/RNCryptor) package.
- [Fixed][Android] If `stopAfterElapsedMinutes` was configured with a value greater-than `stopTimeout`, the event would fail to fire.

## 3.9.3 &mdash; 2020-11-06

- [Fixed][iOS] Fix issue with iOS buffer-timer with requestPermission.  Could execute callback twice.
- [Fixed][iOS] When requesting `WhenInUse` location permission, if user grants "Allow Once" then you attempt to upgrade to `Always`, iOS simply does nothing and the `requestPermission` callback would not be called.  Implemented a `500ms` buffer timer to detect if the iOS showed a system dialog (signalled by the firing of `WillResignActive` life-cycle notification).  If the app does *not* `WillResignActive`, the buffer timer will fire, causing the callback to `requestPermission` to fire.
- [Fixed][Android] Issue with `requestPermission` not showing `backgroundPermissionRationale` dialog on `targetSdkVersion 29` when using `locationAuthorizationRequest: 'WhenInUse'` followed by upgrade to `Always`.
- [Added] Added two new `Location.coords` attributes `speed_accuracy` and `heading_accuracy`.
- [Fixed][iOS] fix bug providing wrong Array of records to `sync` method when no HTTP service is configured.
- [Fixed][Android] Add extra logic for `isMainActivityActive` to detect when `TSLocationManagerActivity` is active.

## 3.9.1 &mdash; 2020-10-02

- [Fixed][Android] `isMainActivityActive` reported incorrect results for Android apps configured with "product flavors".  This would cause the SDK to fail to recognize app is in "headless" state and fail to transmit headless events.
- [Added][Android] `Location.coords.altitude_accuracy` was not being returned.
- [Added][Android] _Android 11_, `targetSdkVersion 30` support for new Android background location permission with new `Config.backgroundLocationRationale`.  Android 11 has [changed location authorization](https://developer.android.com/preview/privacy/location) and no longer offers the __`[Allow all the time]`__ button on the location authorization dialog.  Instead, Android now offers a hook to present a custom dialog to the user where you will explain exactly why you require _"Allow all the time"_ location permission.  This dialog can forward the user directly to your application's __Location Permissions__ screen, where the user must *explicity* authorize __`[Allow all the time]`__.  The Background Geolocation SDK will present this dialog, which can be customized with `Config.backgroundPermissionRationale`.

```javascript
BackgroundGeolocation.ready({
  locationAuthorizationRequest: 'Always',
  backgroundPermissionRationale: {
    title: "Allow access to this device's location in the background?",
    message: "In order to allow X, Y and Z in the background, please enable 'Allow all the time' permission",
    positiveAction: "Change to Allow all the time",
    negativeAction: "Cancel"
  }
});
```
![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)

- [Fixed][iOS] Add intelligence to iOS preventSuspend logic to determine distance from stationaryLocation using configured stationaryRadius rather than calculated based upon accuracy of stationaryLocation.  If a stationaryLocation were recorded having a poor accuracy (eg: 1000), the device would have to walk at least 1000 meters before preventSuspend would engage tracking-state.
- [Fixed][Android] Android LocationRequestService, used for getCurrentPosition and motionChange position, could remain running after entering stationary state if a LocationAvailability event was received before the service was shut down.
- [Fixed][iOS] Ignore didChangeAuthorizationStatus events when disabled and no requestPermissionCallback exists.  The plugin could possibly respond to 3rd-party permission plugin events.
- [Added] Huawei-specific implementation for method isPowerSaveMode.  Was always returning true.
- [Changed] Remove unnecessary android.exported on several AndroidManifest elements.

## 3.9.0 &mdash; 2020-08-20

- [Added][iOS] iOS 14 introduces a new switch on the initial location authorization dialog, allowing the user to "disable precise location".  In support of this, a new method `BackgroundGeolocation.requestTemporaryFullAccuracy` has been added for requesting the user enable "temporary high accuracy" (until the next launch of your app), in addition to a new attribute `ProviderChangeEvent.accuracyAuthorization` for learning its state in the event `onProviderChange`:
![](https://dl.dropbox.com/s/dj93xpg51vspqk0/ios-14-precise-on.png?dl=1)

```javascript
BackgroundGeolocation.onProviderChange((event) => {
  print("[providerchange]", event);
  // Did the user disable precise locadtion in iOS 14+?
  if (event.accuracyAuthorization == BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED) {
    // Supply "Purpose" key from Info.plist as 1st argument.
    BackgroundGeolocation.requestTemporaryFullAccuracy("DemoPurpose").then((accuracyAuthorization) => {
      if (accuracyAuthorization == BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL) {
        console.log("[requestTemporaryFullAccuracy] GRANTED:", accuracyAuthorization);
      } else {
        console.log("[requestTemporaryFullAccuracy] DENIED:", accuracyAuthorization);
      }
    }).catch((error) => {
      console.log("[requestTemporaryFullAccuracy] FAILED TO SHOW DIALOG:", error);
    });
  }
}
```
These changes are fully compatible with Android, which will always return `BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL`

- [Added][Android] Add `onChange` listener for `Config.locationAuthorizationRequest` to request location-authorization.
- [Changed][iOS] If `locationAuthorizationRequest == 'WhenInUse'` and the user has granted the higher level of `Always` authorization, do not show `locationAuthorizationAlert`.
- [Changed][iOS] When `locationAuthorizationRequest: 'Always'`, the SDK will now initially request `WhenInUse` followed immediately with another request for `Always`, rather than having to wait an unknown length of time for iOS to show the authorization upgrade dialog:
- [Added][iOS] Apple has changed the behaviour of location authorization &mdash; if an app initially requests `When In Use` location authorization then later requests `Always` authorization, iOS will *immediately* show the authorization upgrade dialog (`[Keep using When in Use`] / `[Change to Always allow]`).

__Example__
```javascript
componentDidMount() {
  BackgroundGeolocation.ready({
    locationAuthorizationRequest: 'WhenInUse',
    .
    .
    .
  });
}

async onClickStartTracking() {
  await BackgroundGeolocation.start();

  //
  // some time later -- could be immediately after, hours later, days later, etc.
  //
  // Simply update `locationAuthorizationRequest` to "Always" -- the SDK will cause iOS to automatically show the authorization upgrade dialog.
  BackgroundGeolocation.setConfig({
    locationAuthorizationRequest: 'Always'
  });
}
```

![](https://dl.dropbox.com/s/0alq10i4pcm2o9q/ios-when-in-use-to-always-CHANGELOG.gif?dl=1)

- [Fixed][iOS] when `getCurrentPosition` is provided with `extras`, those `extras` overwrite any configured `Config.extras` rather than merging.
- [Fixed][Android] When cancelling Alarms, use `FLAG_UPDATE_CURRENT` instead of `FLAG_CANCEL_CURRENT` -- there are [reports](https://stackoverflow.com/questions/29344971/java-lang-securityexception-too-many-alarms-500-registered-from-pid-10790-u) of older Samsung devices failing to garbadge-collect Alarms, causing the number of alarms to exceed maximum 500, generating an exception.
[Fixed][Android] Modify `isMainActivityActive` code to look specifically for `MainActivity` instead of any activity.  Some apps might use their own custom activity during headless operation.

## 3.8.1 - 2020-07-13
- [Fixed][iOS] Geofence `EXIT` sometimes not firing when using `notifyOnDwell`.
- [Changed][Android] Refactor geofencing-only mode to not initiate "Infinite Geofencing" when the total number of added geofences is `< 99` (the maximum number of simultaneous geofences that can be monitored on Android).  This prevents the SDK from periodically requesting location to query "geofences within `geofenceProximityRadius`".  iOS already has this behaviour (where its maximum simultaneous geofences is `19`).
- [Fixed][iOS] When using `#ready` with `reset: true` (the default), and `autoSync: false`, the SDK could initiate HTTP service if any records exist within plugin's SQLite database, since `reset: true` causes `autoSync: true` for a fraction of a millisecond, initiating the HTTP Service.
- [Fixed][Android] :warning: `com.android.tools.build:gradle:4.0.0` no longer allows "*direct local aar dependencies*".  The Android Setup now requires a custom __`maven url`__ to be added to your app's root __`android/build.gradle`__:
```diff
allprojects {
    repositories {
        mavenLocal()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
+       maven {
+           // Required for react-native-background-geolocation
+           url("${project(':react-native-background-geolocation-android').projectDir}/libs")
+       }
+       maven {
+           // Required for react-native-background-fetch
+           url("${project(':react-native-background-fetch').projectDir}/libs")
+       }
+    }
}
```
- [Fixed][Android] `onConnectivityChange` can report incorrect value for `enabled` when toggling between Wifi Off / Airplane mode.
- [Added][Android] New Config option `Notification.sticky` (default `false`) for allowing the Android foreground-service notification to be always shown.  The default behavior is the only show the notification when the SDK is in the *moving* state, but Some developers have expressed the need to provide full disclosure to their users when the SDK is enabled, regardless if the device is stationary with location-services OFF.
- [Added] Support for providing a native "beforeInsert" block in iOS `AppDelegate.m` and Android `MainApplication.java`.  The returned object will be inserted into the SDK's SQLite database and uploaded to your `Config.url`.
__iOS__ `AppDelegate.m`
```obj-c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    .
    .
    .
    // [OPTIONAL] This block is called before a location is inserted into the background_geolocation SQLite database.
    // - The returned NSDictionary will be inserted.
    // - If you return nil, no record will be inserted.
    TSLocationManager *bgGeo = [TSLocationManager sharedInstance];
    bgGeo.beforeInsertBlock = ^NSDictionary *(TSLocation *tsLocation) {
        CLLocation *location = tsLocation.location;

        NSLog(@"[beforeInsertBlock] %@: %@", tsLocation.uuid, location);

        // Return a custom schema or nil to cancel SQLite insert.
        return @{
            @"lat": @(location.coordinate.latitude),
            @"lng": @(location.coordinate.longitude),
            @"battery": @{
                @"level": tsLocation.batteryLevel,
                @"is_charging": @(tsLocation.batteryIsCharging)
            }
        };
    };

    return YES;
}
```
__Android__ `MainApplication.java`
```java
public class MainApplication extends Application implements ReactApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        .
        .
        .
        // [OPTIONAL] This block is called before a location is inserted into the background_geolocation SQLite database.
        // - The returned NSDictionary will be inserted.
        // - If you return nil, no record will be inserted.
        BackgroundGeolocation.getInstance(this).setBeforeInsertBlock(new TSBeforeInsertBlock() {
            @Override
            public JSONObject onBeforeInsert(TSLocation tsLocation) {
                Location location = tsLocation.getLocation();
                JSONObject json = new JSONObject();
                JSONObject battery = new JSONObject();
                try {
                    json.put("lat", location.getLatitude());
                    json.put("lng", location.getLongitude());

                    battery.put("level", tsLocation.getBatteryLevel());
                    battery.put("is_charging", tsLocation.getBatteryIsCharging());
                    json.put("battery", battery);
                    return json;
                } catch (JSONException e) {
                    e.printStackTrace();
                    return null;
                }
            }
        });
    }
}
```


## 3.7.0 - 2020-05-28

- [Fixed][Android] `onGeofence` event-handler fails to be fired when `maxRecordsToPersist: 0`.
- [Fixed][Android] `requestPermission` method was always returning `AUTHORIZATION_STATUS_ALWAYS` even when *When in Use* was selected.
- [Fixed][Android] Android plugin was importing an `androidx` dependency `localbroadcastmanager` without first checking if `useAndroidX` was set to `true`.
- [Fixed][iOS] When using `disableStopDetection: true` with `pausesLocationUpdatesAutomatically: true`, the `CLLocationManagerDelegate didPauseLocationUpdates` the `motionchange` event reported `isMoving: true`.
- [Fixed][Android] Ensure location failure callback is executed on main-thread.
- [Changed][Android] Gradle import `tslocationmanager.aar` using `api` rather than `implementation` in order to allow overrides in `AndroidManifest.xml`.
- [Fixed][iOS] When upgrading from a version previous to `3.4.0`, if any records exist within plugin's SQLite database, those records could fail to be properly migrated to new schema.
- [Added] New method `BackgroundGeolocation.destroyLocation(uuid)` for destroying a single location by `Location.uuid`.
- [Fixed] Allow firebase-adapter to validate license flavors on same key (eg: .development, .staging).
- [Fixed] iOS geofence listeners on `onGeofence` method *could possibly* fail to be called when a geofence event causes iOS to re-launch the app in the background (this would **not** prevent the plugin posting the geofence event to your `Config.url`, only a failure of the Javascript `onGeofence` to be fired).
- [Changed] Android library `tslocationmanager.aar` is now compiled using `androidx`.  For backwards-compatibility with those how haven't migrated to `androidX`, a *reverse-jetified* build is included.  Usage is detected automatically based upon `android.useAndroidX` in one's `gradle.properties`.

## 3.6.2 - 2020-04-08
- [Added] [Android] Add new `Config.motionTriggerDelay (milliseconds)` for preventing false-positive triggering of location-tracking (while walking around one's house, for example).  If the motion API triggers back to `still` before `motionTriggerDelay` expires, triggering to the *moving* state will be cancelled.
- [Fixed] Address issue with rare reports of iOS crashing with error referencing `SOMotionDetector.m`.
- [Fixed] Odometer issue with Android/iOS:  Do not persist `lastOdometerLocation` when plugin is disabled.
- [Added] iOS `Config.showsBackgroundLocationIndicator`, A Boolean indicating whether the status bar changes its appearance when an app uses location services in the background.
- [Changed] `cordova-plugin-background-fetch` dependency updated to `3.x` with new iOS 13 `BGTaskScheduler` API.
- [Fixed] `synchronize` methods in `TSLocationManager` to address Android NPE related to `buildTSLocation`.
- [Fixed] Typescript declaration for `Location.isMoving` should be `Location.is_moving`.
- [Fixed] iOS:  Bug in `accessToken` RegExp in Authorization token-refresh handler.
- [Fixed] Part of the raw Javascript API contained typescript, which would cause an error on older mobile browser versions.
- [Added] Implement four new RPC commands `addGeofence`, `removeGeofence`, `addGeofences`, `removeGeofences`.  Document available RPC commands in "HttpGuide".
- [Fixed] Android: launch-Intent for foreground-service notification was causing notification-click to re-launch the Activity rather than show existing.
- [Changed] Android: Modify behaviour of geofences-only mode to not periodically request location-updates.  Will use a stationary-geofence of radius geofenceProximityRadius/2 as a trigger to re-evaluate geofences in proximity.
- [Changed] iOS: Prefix FMDB method-names `databasePool` -> `ts_databasePool` after reports of apps being falsely rejected by Apple for "private API usage".
- [Fixed] Android: Ensure that `location.hasSpeed()` before attempting to use it for distanceFilter elasticity calculations.  There was a report of a Device returning `Nan` for speed.
- [Fixed] Android:  Do not throttle http requests after http connect failure when configured with `maxRecordsToPersist`.
- [Fixed] Android: Respect `disableLocationAuthorizationAlert` for all cases, including `getCurrentPosition`.
- [Changed] Android: Modify behaviour of geofences-only mode to not periodically request location-updates.  Will use a stationary-geofence of radius geofenceProximityRadius/2 as a trigger to re-evaluate geofences in proximity.
- [Changed] Authorization `refreshUrl` will post as application/x-www-form-urlencoded instead of form/multipart
- [Changed] iOS geofencing mode will not engage Significant Location Changes API when total geofence count <= 18 in order to prevent new iOS 13 "Location summary" popup from showing frequent location access.
- [Fixed] Android:  Add hack for older devices to fix "GPS Week Rollover" bug where incorrect timestamp is recorded from GPS (typically where year is older by 20 years).
- [Fixed] When determining geofences within `geofenceProximityRadius`, add the `location.accuracy` as a buffer against low-accuracy locations.
- [Changed] Increase default `geofenceProximityRadius: 2000`.

## 3.4.2 - 2019-12-03
- [Fixed] iOS crash when launching first time `-[__NSDictionaryM setObject:forKey:]: object cannot be nil (key: authorization)'`
- [Changed] Remove Android warning `In order to enable encryption, you must provide the com.transistorsoft.locationmanager.ENCRYPTION_PASSWORD` when using `encrypt: false`.
- [Fixed] Added headless implementation for `geofenceschange` event.

## 3.4.1 - 2019-12-02
- [Fixed] Android bug rendering `Authorization.toJson` when no `Config.authorization` defined.

## 3.4.0 - 2019-12-02
- [Added] New `Config.authorization` option for automated authorization-token support.  If the SDK receives an HTTP response status `401 Unauthorized` and you've provided an `authorization` config, the plugin will automatically send a request to your configured `refreshUrl` to request a new token.  The SDK will take care of adding the required `Authorization` HTTP header with `Bearer accessToken`.  In the past, one would manage token-refresh by listening to the SDK's `onHttp` listener for HTTP `401`.  This can now all be managed by the SDK by providing a `Config.authorization`.
- [Added] Implemented strong encryption support via `Config.encrypt`.  When enabled, the SDK will encrypt location data in its SQLite datbase, as well as the payload in HTTP requests.  See API docs `Config.encrypt` for more information, including the configuration of encryption password.
- [Added] New JSON Web Token API for the Demo server at http://tracker.transistorsoft.com.  It's now easier than ever to configure the plugin to post to the demo server.  See API docs `Config.transistorAuthorizationToken`.  The old method using `BackgroundGeolocation.transistorTrackerParams` is now deprecated.
- [Added] New `DeviceInfo` module for providing simple device-info (`model`, `manufacturer`, `version`, `platform`).

## 3.3.2 - 2019-10-25
- [Fixed] Android bug in params order to getLog.  Thanks @mikehardy.
- [Fixed] Typo in Javascript API callback in `destroyLog`.  Thanks @mikehardy.

## 3.3.1 - 2019-10-23
- [Fixed] Android NPE
```
Caused by: java.lang.NullPointerException:
  at com.transistorsoft.locationmanager.service.TrackingService.b (TrackingService.java:172)
  at com.transistorsoft.locationmanager.service.TrackingService.onStartCommand (TrackingService.java:135)
```
- [Added] new `uploadLog` feature for uploading logs directly to a server.  This is an alternative to `emailLog`.
- [Changed] Migrated logging methods `getLog`, `destroyLog`, `emailLog` to new `Logger` module available at `BackgroundGeolocation.logger`.  See docs for more information.  Existing log methods on `BackgroundGeolocation` are now `@deprecated`.
- [Changed] All logging methods (`getLog`, `emailLog` and `uploadLog`) now accept an optional `SQLQuery`.  Eg:
```javascript
let query = {
  start: Date.parse('2019-10-23 09:00'),
  end: Date.parse('2019-10-23 19:00'),
  limit: 1000,
  order: Logger.ORDER_ASC
};
let Logger = BackgroundGeolocation.logger;

let log = await Logger.getLog(query)
Logger.emailLog('foo@bar.com', query);
Logger.uploadLoad('http://your.server.com/logs', query);
```


## 3.3.0 - 2019-10-17
- [Fixed] Android: Fixed issue executing `#changePace` immediately after `#start`.
- [Fixed] Android:  Add guard against NPR in `calculateMedianAccuracy`
- [Added] Add new Geofencing methods: `#getGeofence(identifier)` and `#geofenceExists(identifier)`.
- [Fixed] iOS issue using `disableMotionActivityUpdates: false` with `useSignificantChangesOnly: true` and `reset: true`.  Plugin will accidentally ask for Motion Permission.  Fixes #1992.
- [Fixed] Resolved a number of Android issues exposed by booting the app in [StrictMode](https://developer.android.com/reference/android/os/StrictMode).  This should definitely help alleviate ANR issues related to `Context.startForegroundService`.
- [Added] Android now supports `disableMotionActivityUpdates` for Android 10 which now requires run-time permission for "Physical Activity".  Setting to `true` will not ask user for this permission.  The plugin will fallback to using the "stationary geofence" triggering, like iOS.
- [Changed] Android:  Ensure all code that accesses the database is performed in background-threads, including all logging (addresses `Context.startForegroundService` ANR issue).
- [Changed] Android:  Ensure all geofence event-handling is performed in background-threads (addresses `Context.startForegroundService` ANR issue).
- [Added] Android: implement logic to handle operation without Motion API on Android 10.  v3 has always used a "stationary geofence" like iOS as a fail-safe, but this is now crucial for Android 10 which now requires run-time permission for "Physical Activity".  For those users who [Deny] this permission, Android will trigger tracking in a manner similar to iOS (ie: requiring movement of about 200 meters).  This also requires handling to detect when the device has become stationary.

## [3.2.2] - 2019-09-18
- [Changed] Android:  move more location-handling code into background-threads to help mitigate against ANR referencing `Context.startForegroundService`
- [Changed] Android:  If BackgroundGeolocation adapter is instantiated headless and is enabled, force ActivityRecognitionService to start.
- [Added] Add `mock` to `locationTemplate` data.
- [Changed] Android now hosts its own `proguard-rules.pro`.  See Android setup docs for new integration of plugin's required Proguard Rules into your app.
Replace `@available` macro with `SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO`.
- [Fixed] iOS 13 preventSuspend was not working with iOS 13.  iOS has once again decreased the max time for UIApplication beginBackgroundTask from 180s down to 30s.
- [Changed] Upgrade `android-logback` dependency to `2.0.0`
- [Changed] Android: move some plugin initialization into background-threads (eg: `performLogCleanup`) to help mitigate against ANR "`Context.startForegroundService` did not then call `Service.startForeground`".
- [Fixed] Android Initial headless events can be missed when app booted due to motion transition event.
- [Fixed] Android crash with EventBus `Subscriber already registered error`.
- [Fixed] iOS `Crash: [TSHttpService postBatch:error:] + 6335064 (TSHttpService.m:253)`
- [Changed] Minor changes to `build.gradle`: fetch `minSdkVersion` from `ext` instead of hard-coding, use `implementation` with `react` instead of `compileOnly`.

## [3.2.0] - 2019-08-16
- [Added] iOS 13 support.
- [Added] Auto-linking support.  Do not use `react-native link` anymore.  See the Setup docs for Android and iOS.  Before installing `3.2.0`, first `react-native unlink` both `background-geolocation` and `background-fetch`.

:warning: If you have a previous version of **`react-native-background-geolocation < 3.2.0`** installed into **`react-native >= 0.60`**, you should first `unlink` your previous version as `react-native link` is no longer required.

```bash
$ react-native unlink react-native-background-geolocation
```

- [Fixed] Android Geofence `DWELL` transition (`notifyOnDwell: true`) not firing.
- [Fixed] iOS `logMaxDays` was hard-coded to `7`; Config option not being respected.
- [Added] Android `Q` support (API 29) with new iOS-like location permission model which now requests `When In Use` or `Always`.  Android now supports the config option `locationAuthorizationRequest` which was traditionally iOS-only.  Also, Android Q now requires runtime permission from user for `ACTIVITY_RECOGNITION`.
- [Changed] Another Android tweak to mitigate against error `Context.startForegroundService() did not then call Service.startForeground()`.
- [Added] Add new Android gradle config parameter `appCompatVersion` to replace `supportLibVersion` for better AndroidX compatibility.  If `appCompatVersion` is not found, the plugin's gradle file falls back to `supportLibVersion`.  For react-native@0.60, you should start using the new `appCompatVersion`.

## [3.0.9] - 2019-07-06
[Changed] Implement `react-native.config.js` ahead of deprecated `rnpm` config.
- [Fixed] Added logic to detect when app is configured to use **AndroidX** dependencies, adjusting the required `appcompat` dependency accordingly.  If the gradle config `ext.supportLibVersion` corresponds to an AndroidX version (eg: `1.0.0`), the plugin assumes AndroidX.
- [Changed] Remove `cocoa-lumberjack` as a dependency since `react-native >= 0.60.0` iOS apps are all Cocoapods now.  There's no longer a need for this dependency now since the plugin's podspec can import `CocoaLumberjack` pod directly.  This is going to cause short-term pain for those using `< 0.60.0`, forcing one to manually install `cocao-lumberjack`.
- [Fixed] iOS / Android issues with odometer and `getCurrentPosition` when used with `maximumAge` constraint.  Incorrect, old location was being returned instead of latest available.
- [Fixed] Some Android methods were executing the callback in background-thread, exposed when using flutter dev channel (`#insertLocation`, `#getLocations`, `#getGeofences`, `#sync`).
- [Fixed] Add `intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)` to `DeviceSettings` request for Android 9 compatibility.
- [Changed] Tweaks to Android services code to help guard against error `Context.startForegroundService() did not then call Service.startForeground()`.
- [Fixed] iOS manual `sync` crash in simulator while executing callback when error response is returned from server.

## [3.0.7] - 2019-06-17
- [Fixed] iOS & Android:  Odometer issues:  clear odometer reference location on `#stop`, `#startGeofences`.
- [Fixed] Odometer issues: Android must persist its odometer reference location since the foreground-service is no longer long-lived and the app may be terminated between motionchange events.
- [Fixed] Return `Service.START_REDELIVER_INTENT` from `HeartbeatService` to prevent `null` Intent being delivered to `HeartbeatService`, causing a crash.
- [Added] Implement Android [LocationSettingsRequest](https://developer.android.com/training/location/change-location-settings#get-settings).  Determines if device settings is currently configured according to the plugin's desired-settings (eg: gps enabled, location-services enabled).  If the device settings differs, an automatic dialog will perform the required settings changes automatically when user clicks [OK].
- [Fixed] Android `triggerActivities` was not implemented refactor of `3.x`.

## [3.0.6] - 2019-06-04
- [Changed] Bump `CocoaLumberjack` dependency to `~> 3.5.1`.
- [Fixed] Android `destroyLocations` callback was being executed in background-thread.
- [Fixed] When Android geofence API receives a `GEOFENCE_NOT_AVAILABLE` error (can occur if Wifi is disabled), geofences must be re-registered.
- [Fixed] Android `Config.disableStopDetection` was not implemented.
- [Added] Add new Android Config options `scheduleUseAlarmManager` for forcing scheduler to use `AlarmManager` insead of `JobService` for more precise scheduling.

## [3.0.5] - 2019-05-10
- [Changed] Rollback `android-permissions` version back to `0.1.8`.  It relies on `support-annotations@28`.  This isn't a problem if one simply upgrades their `targetSdkVersion` but the support calls aren't worth the hassle, since the latest version doesn't offer anything the plugin needs.

## [3.0.4] - 2019-05-08
- [Fixed] iOS: changing `pauseslocationUpdatesAutomatically` was not being applied.
- [Changed] `reset` parameter provided to `#ready` has now been default to `true`.  This causes too many support issues for people using the plugin the first time.
- [Fixed] Android threading issue where 2 distinct `SingleLocationRequest` were issued the same id.  This could result in the foreground service quickly starting/stopping until `locationTimeout` expired.
- [Fixed] Android issue where geofences could fail to query for new geofences-in-proximity after a restart.
- [Fixed] Android issues re-booting device with location-services disabled or location-authorization revoked.
- [Added] Implement support for [Custom Android Notification Layouts](/../../wiki/Android-Custom-Notification-Layout).
- [Fixed] Android bug where service repeatedly starts/stops after rebooting the device with plugin in *moving* state.
- [Fixed] Android headless `heartbeat` events were failing (incorrect `Context` was supplied to the event).

## [3.0.2] - 2019-04-18
- [Fixed] Windows bug in new `react-native link` script.
- [Fixed] Android scheduler bug.  When app is terminated & restarted during a scheduled ON period, tracking-service does not restart.

## [3.0.1] - 2019-04-15
- [Added] Added android implementation for `react-native link` script to automatically add the required `maven url` and `ext.googlePlayServicesLocationVersion`.

## [3.0.0]
- [Changed] Promote `3.0.0-rc.5` to `3.0.0`.

## [3.0.0-rc.5] - 2019-03-31
- [Fixed] Android: Another `NullPointerException` with `Bundle#getExtras`.

## [3.0.0-rc.4] - 2019-03-29

- [Fixed] Android `NullPointerException` with `Bundle#getExtras`.
- [Fixed] Android not persisting `providerchange` location when location-services re-enabled.

## [3.0.0-rc.3] - 2019-03-27

- [Fixed] An Android foreground-service is launched on first install and fails to stop.

## [3.0.0-rc.2] - 2019-03-27

- [Changed] Remove unused Gradle function.

## [3.0.0-rc.1] - 2019-03-27

------------------------------------------------------------------------------
### :warning: Breaking Changes

#### [Changed] The license format has changed.  New `3.0.0` licenses are now available for customers in the [product dashboard](https://www.transistorsoft.com/shop/customers).
![](https://dl.dropbox.com/s/3ohnvl9go4mi30t/Screenshot%202019-03-26%2023.07.46.png?dl=1)

- For versions `< 3.0.0`, use *old* license keys.
- For versions `>= 3.0.0`, use *new* license keys.

#### [Changed] Proguard Rules.
- For those minifying their generated Android APK by enabling the following in your `app/build.gradle`,

```
/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = true
```

You must add the following line to your `proguard-rules.pro`:
```
-keepnames class com.facebook.react.ReactActivity
```

See the full required Proguard config in the Android Setup Doc.


------------------------------------------------------------------------------

### Fixes
- [Fixed] Logic bugs in MotionActivity triggering between *stationary* / *moving* states.
- [Fixed] Remove iOS react-native `#include` cruft `if __has_include(“XXX.h”)` for support RN libs during their transition to using Frameworks.  Fixes #669.
- [Fixed] iOS crash with configured `schedule`: `index 2 beyond bounds [0 .. 1]' was thrown`.  Fixes #666.
- [Fixed] `NullPointerException in logger`.  References #661.

### New Features

- [Added] Android implementation for `useSignificantChangesOnly` Config option.  Will request Android locations **without the persistent foreground service**.  You will receive location updates only a few times per hour:

#### `useSignificantChangesOnly: true`:
![](https://dl.dropboxusercontent.com/s/wdl9e156myv5b34/useSignificantChangesOnly.png?dl=1)

#### `useSignificantChangesOnly: false`:
![](https://dl.dropboxusercontent.com/s/hcxby3sujqanv9q/useSignificantChangesOnly-false.png?dl=1)

- [Added] Android now implements a "stationary geofence", just like iOS.  It currently acts as a secondary triggering mechanism along with the current motion-activity API.  You will hear the "zap" sound effect when it triggers.  This also has the fortunate consequence of allowing mock-location apps (eg: Lockito) of being able to trigger tracking automatically.

- [Added] The SDK detects mock locations and skips trigging the `stopTimeout` system, improving location simulation workflow.
- [Added] Android-only Config option `geofenceModeHighAccuracy` for more control over geofence triggering responsiveness.  Runs a foreground-service during geofences-only mode (`#startGeofences`).  This will, of course, consume more power.
```dart
await BackgroundGeolocation.ready({
  geofenceModeHighAccuracy: true,
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
  locationUpdateInterval: 5000,
  distanceFilter: 50
));

BackgroundGeolocation.startGeofences();
```

#### `geofenceModeHighAccuracy: false` (Default)

- Transition events are delayed in favour of lower power consumption.

![](https://dl.dropboxusercontent.com/s/6nxbuersjcdqa8b/geofenceModeHighAccuracy-false.png?dl=1)

#### `geofenceModeHighAccuracy: true`

- Transition events are nearly instantaneous at the cost of higher power consumption.

![](https://dl.dropbox.com/s/w53hqn7f7n1ug1o/geofenceModeHighAccuracy-true.png?dl=1)

- [Added] Android implementation of `startBackgroundTask` / `stopBackgroundTask`.
```dart
  int taskId = await BackgroundGeolocation.startBackgroundTask();

  // Do any work you like -- it's guaranteed to run, regardless of background/terminated.
  // Your task has exactly 30s to do work before the service auto-stops itself.

  getDataFromServer('https://foo.bar.com').then((result) => {
    // Be sure to always signal completion of your taskId.
    BackgroundGeolocation.stopBackgroundTask(taskId);
  }).catch((error) => {
    // Be sure to always signal completion of your taskId.
    BackgroundGeolocation.stopBackgroundTask(taskId);
  });
```
Logging for Android background-tasks looks like this (when you see an hourglass, a foreground-service is active)
```
 [BackgroundTaskManager onStartJob] ⏳ startBackgroundTask: 6
 .
 .
 .
 [BackgroundTaskManager$Task stop] ⏳ stopBackgroundTask: 6
```
- [Added] New custom Android debug sound FX.  See the [Config.debug](https://transistorsoft.github.io/cordova-background-geolocation/interfaces/_cordova_background_geolocation_.config.html#debug) for a new decription of iOS / Android sound FX **including a media player to play each.**
![](https://dl.dropbox.com/s/zomejlm9egm1ujl/Screenshot%202019-03-26%2023.10.50.png?dl=1)

:warning: These debug sound FX consume about **1.4MB** in the plugin's `tslocationmanager.aar`.  These assets can easily be stripped in your `release` builds by adding the following gradle task to your `app/build.gradle` (I'm working on an automated solution within the context of the plugin's `build.gradle`; so far, no luck).  [Big thanks](https://github.com/transistorsoft/react-native-background-geolocation/issues/667#issuecomment-475928108) to @mikehardy.
```gradle
/**
 * Purge Background Geolocation debug sounds from release build.
 */
def purgeBackgroundGeolocationDebugResources(applicationVariants) {
    applicationVariants.all { variant ->
        if (variant.buildType.name == 'release') {
            variant.mergeResources.doLast {
                delete(fileTree(dir: variant.mergeResources.outputDir, includes: ['raw_tslocationmanager*']))

            }
        }
    }
}

android {
    //Remove debug sounds from BackgroundGeolocation plugin
    purgeBackgroundGeolocationDebugResources(applicationVariants)

    compileSdkVersion rootProject.ext.compileSdkVersion
    .
    .
    .
}
```

### Removed
- [Changed] Removed Android config option **`activityRecognitionInterval`** and **`minimumActivityRecognitionConfidence`**.  The addition of the new "stationary geofence" for Android should alleviate issues with poor devices failing to initiate tracking.  The Android SDK now uses the more modern [ActivityTransistionClient](https://medium.com/life360-engineering/beta-testing-googles-new-activity-transition-api-c9c418d4b553) API which is a higher level wrapper for the traditional [ActivityReconitionClient](https://developers.google.com/android/reference/com/google/android/gms/location/ActivityRecognitionClient).  `AcitvityTransitionClient` does not accept a polling `interval`, thus `actiivtyRecognitionInterval` is now unused.  Also, `ActivityTransitionClient` emits similar `on_foot`, `in_vehicle` events but no longer provides a `confidence`, thus `confidence` is now reported always as `100`.  If you've been implementing your own custom triggering logic based upon `confidence`, it's now pointless.  The `ActivityTransitionClient` will open doors for new features based upon transitions between activity states.

```
╔═════════════════════════════════════════════
║ Motion Transition Result
╠═════════════════════════════════════════════
╟─ 🔴  EXIT: walking
╟─ 🎾  ENTER: still
╚═════════════════════════════════════════════
```

### Maintenance
- [Changed] Update `android-permissions` dependency to `0.1.8`.

## [3.0.0-beta.5] - 2019-03-20
- [Fixed] Logic bugs in MotionActivity triggering between *stationary* / *moving* states.
- [Added] Android-only Config option `geofenceModeHighAccuracy` for more control over geofence triggering accuracy.  Runs a foreground-service during geofences-only mode (`#startGeofences`).
- [Added] Android implementation for `useSignificantChangesOnly` Config option.  Will request Android locations **without the persistent foreground service**.  You will receive location updates only a few times per hour.
- [Changed] Update `android-permissions` dependency to `0.1.8`.

## [3.0.0-beta.4] - 2019-03-02
- [Fixed] Android bug in Config dirty-fields mechanism.

## [3.0.0-beta.3] - 2019-03-02
- [Changed] Improve trackingMode state-changes between location -> geofences-only.
- [Changed] Improvements to geofences-only tracking.
- [Changed] Improvements to stationary-geofence monitoring, detecting mock locations to prevent stopTimeout triggering.

## [3.0.0-beta.2] - 2019-02-28
- [Changed] Tweaking stationary region monitoring.
- [Changed] Tweaking bad vendor detection to force stopTimeout timer when device is stationary for long periods and motion api hasn't respon
ded.

## [3.0.0-beta.1] - 2019-02-27
- [Changed] Major refactor of Android Service architecture.  The SDK no longer requires a foreground-service active at all times.  The foreground-service (and cooresponding persistent notification) will only be active while the SDK is in the *moving* state.  No breaking dart api changes.
- [Changed] Improved Android debug notifications.

- [Added] Added new Config options `persistMode` for specifying exactly which events get persisted: location | geofence | all | none.
- [Added] Experimental Android-only Config option `speedJumpFilter (default 300 meters/second)` for detecting location anomalies.  The plugin will measure the distance and apparent speed of the current location relative to last location.  If the apparent speed is > `speedJumpFilter`, the location will be ignored.  Some users, particularly in Australia, curiously, have had locations suddenly jump hundreds of kilometers away, into the ocean.
- [Changed] iOS and Android will not perform odometer updates when the calculated distance is less than the average accuracy of the current and previous location.  This is to prevent small odometer changes when the device is lingering around the same position.
- [Fixed] Added Android gradle dependency `appcompat-v7`
- [Fixed] Minor change to Android `HeadlessTask` to fix possible issue with `Looper`.

- [Added] New `DeviceSettings` API for redirecting user to Android Settings screens, including vendor-specific screens (eg: Huawei, OnePlus, Xiaomi, etc).  This is an attempt to help direct the user to appropriate device-settings screens for poor Android vendors as detailed in the site [Don't kill my app](https://dontkillmyapp.com/).
- [Added] `schedule` can now be configured to optionally execute geofences-only mode (ie: `#startGeofences`) per schedule entry.  See `schedule` docs.
- [Changed] Update Gradle config to use `implementation` instead of deprecated `compile`
- **[BREAKING]** Change Gradle `ext` configuration property `googlePlayServicesVersion` -> `googlePlayServicesLocationVersion`.  Now that Google has decoupled all their libraries, `play-services:location` now has its own version, independant of all other libs.

`android/build.gradle`:
```diff
buildscript {
    ext {
        buildToolsVersion = "28.0.3"
        minSdkVersion = 16
        compileSdkVersion = 28
        targetSdkVersion = 27
        supportLibVersion = "28.0.0"
-       googlePlayServicesVersion = "16.0.0"
+       googlePlayServicesLocationVersion = "16.0.0"
    }
}
```

- [Changed] Android Service: Return `START_STICKY` instead of `START_REDELIVER_INTENT`.
- [Changed] Android: `setShowBadge(false)` on Android `NotificationChannel`.  Some users reporting that Android shows a badge-count on app icon when service is started / stopped.

- [Fixed] Android `extras` provided to `watchPosition` were not being appended to location data.

- [Fixed] Android NPE in `watchPosition`
- [Added] Added method `getProviderState` for querying current state of location-services.
- [Added] Added method `requestPermission` for manually requesting location-permission (`#start`, `#getCurrentPosition`, `#watchPosition` etc, will already automatically request permission.

- [Changed] Upgrade Android logger dependency to latest version (`logback`).
- [Fixed] Prevent Android foreground-service from auto-starting when location permission is revoked via Settings screen.
- [Fixed] NPE in Android HTTP Service when manual sync is called.  Probably a threading issue with multiple sync operations executed simultaneously.


## [2.14.2] 2018-11-20
- [Added] Android SDK 28 requires new permission to use foreground-service.
- [Fixed] Do not calculate odometer with geofence events.  Android geofence event's location timestamp does not correspond with the actual time the geofence fires since Android is performing some heuristics in the background to ensure the potential geofence event is not a false positive.  The actual geofence event can fire some minutes in the future (ie: the location timestamp will be some minutues in the past).  Using geofence location in odometer calculations will corrupt the odometer value.
- [Fixed] Android could not dynamically update the `locationTemplate` / `geofenceTemplate` without `#stop` and application restart.
- [Fixed] Android `startGeofences` after revoking & re-granting permission would fail to launch the plugin's Service.
- [Fixed] iOS HTTP crash when using `batchSync: true`.  At application boot, there was a threading issue if the server returned an HTTP error, multiple instances of the HTTP service could run, causing a crash.

## [2.14.1] 2018-10-29
- [Fixed] react-native link on Windows.

## [2.14.0] 2018-10-29
- [Fixed] Android `NullPointerException` on `WatchPositionCallback` with `watchPosition`.

## [2.14.0-beta.3] 2018-10-26
- [Fixed] Mistake in module-name in index.d.ts

## [2.14.0-beta.2] 2018-10-24
- [Fixed] Documentation issue with method signature `getCurrentPosition`.
- [iOS] Catch `NSInvalidArgumentException` when decoding `TSConfig`.
- [Fixed] `react-native link` scripts were accidentally `.npmignore`d causing error `Unhandled 'error' event` when linking.

## [2.14.0-beta.1] 2018-10-19

- [Added] Implement [Typescript API](https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native)
- [Added] Refactor documentation.  Now auto-generated from Typescript api with [Typedoc](https://typedoc.org/) and served from https://transistorsoft.github.io/react-native-background-geolocation
- [Breaking] Change event-signature of `location` event:  location-errors are now received in new `failure` callback rather than separate `error` event.  The `error` event has been removed.
```javascript
BackgroundGeolocation.onLocation((location) => {
  console.log('[location] -', location);
}, (errorCode) => {
  // Location errors received here.
  console.log('[location] ERROR -', errorCode);
});
```
- [Added] With the new Typescript API, it's necessary to add dedicated listener-methods for each method (in order for code-assist to work).
```javascript
// Old:  No code-assist for event-signature with new Typescript API
BackgroundGeolocation.on('location', (location) => {}, (error) => {});
// New:  use dedicated listener-method #onLocation
BackgroundGeolocation.onLocation((location) => {}, (error) => {});
// And every other event:
BackgroundGeolocation.onMotionChange(callback);
BackgroundGeolocation.onMotionProviderChange(callback);
BackgroundGeolocation.onActivityChange(callback);
BackgroundGeolocation.onHttp(callback);
BackgroundGeolocation.onGeofence(callback);
BackgroundGeolocation.onGeofencesChange(callback);
BackgroundGeolocation.onSchedule(callback);
BackgroundGeolocation.onConnectivityChange(callback);
BackgroundGeolocation.onPowerSaveChange(callback);
BackgroundGeolocation.onEnabledChange(callback);
```
- [Breaking] Change event-signature of `enabledchange` event to return simple `boolean` instead of `{enabled: true}`:  It was pointless to return an `{}` for this event.
```javascript
// Old
BackgroundGeolocation.onEnabledChange((enabledChangeEvent) => {
  console.log('[enabledchange] -' enabledChangeEvent.enabled);
})
// New
BackgroundGeolocation.onEnabledChange((enabled) => {
  console.log('[enabledchange] -' enabled);
})
```
- [Breaking] Change signature of `#getCurrentPosition` method:  Options `{}` is now first argument rather than last:
```javascript
// Old (Options as 3rd argument)
BackgroundGeolocation.getCurrentPosition((location) => {
  console.log('[getCurrentPosition] -', location);
}, (error) => {
  console.log('[getCurrentPosition] ERROR -', error);
}, {  // <-- Options as 3rd argument
  samples: 3,
  extras: {foo: 'bar'}
})

// New (Options as 1st argument)
BackgroundGeolocation.getCurrentPosition({
  samples: 3,
  extras: {foo: 'bar'}
}, (location) => {
  console.log('[getCurrentPosition] -', location);
}, (error) => {
  console.log('[getCurrentPosition] ERROR -', error);
})
```
## [2.13.4] - 2018-10-01
- [Fixed] iOS was missing Firebase adapter hook for persisting geofences.
- [Changed] Android headless events are now posted with using `EventBus` instead of `JobScheduler`.  Events posted via Android `JobScheduler` are subject to time-slicing by the OS so events could arrive late.
- [Fixed] Missing `removeListeners` for `connectivitychange`, `enabledchange` events.
- [Fixed] iOS was not calling `success` callback for `removeListeners`.
- [Fixed] iOS plugin was not parsing schedule in `#ready` event.

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
