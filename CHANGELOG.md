# Change Log

## [Unreleased]
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
