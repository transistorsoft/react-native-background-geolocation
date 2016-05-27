# Change Log

## [Unreleased]
- [Changed] `Scheduler` will use `Locale.US` in its Calendar operations, such that the days-of-week correspond to Sunday=1..Saturday=7.
- [Fixed] **iOS** Added `event [motionchange|geofence]` to location-data returned to `onLocation` event. 
- [Changed] Refactor odometer calculation for both iOS and Android.  No longer filters out locations based upon average location accuracy of previous 10 locations; instead, it will only use the current location for odometer calculation if it has accuracy < 100.
- [Fixed] Missing iOS setting `locationAuthorizationRequest` after Settings service refactor

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
