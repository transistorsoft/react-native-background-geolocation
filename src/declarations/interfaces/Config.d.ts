/// <reference path="../types.d.ts" />
/// <reference path="./LocationAuthorizationAlert.d.ts" />
/// <reference path="./PermissionRationale.d.ts" />
///
///
declare module "react-native-background-geolocation" {
  /**
  * ## 🔧 Configuration API.
  *
  * The following configuration options are used to configure the SDK via the methods [[BackgroundGeolocation.ready]] and [[BackgroundGeolocation.setConfig]].
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.ready({
  *   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
  *   distanceFilter: 10,
  *   stopOnTerminate: false,
  *   startOnBoot: true,
  *   url: "http://my.server.com",
  *   params: {
  *     "user_id": 123
  *   },
  *   headers: {
  *     "my-auth-token":"secret-key"
  *   }
  * }).then((state) => {
  *   console.log("[ready] BackgroundGeolocation is configured and ready to use");
  *
  *   BackgroundGeolocation.start();
  * })
  *
  * // Or with #setConfig
  * BackgroundGeolocation.setConfig({
  *   extras: {route_id: 1234},
  *   url: "https://my.new.server.com"
  * })
  * ```
  *
  ## Geolocation Options

  ### [Geolocation] Common Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[desiredAccuracy]] | [[LocationAccuracy]] | __Default: [[BackgroundGeolocation.DESIRED_ACCURACY_HIGH]]__. Specify the desired-accuracy of the geolocation system.  |
  | [[distanceFilter]] | `Integer` | __Default: `10`__.  The minimum distance (measured in meters) a device must move horizontally before an update event is generated. |
  | [[disableElasticity]] | `Boolean` | __Default: `false`__.  Set true to disable automatic speed-based [[distanceFilter]] elasticity. eg: When device is moving at highway speeds, locations are returned at ~ 1 / km. |
  | [[elasticityMultiplier]] | `Float` | __Default: `1`__.  Controls the scale of automatic speed-based `distanceFilter` elasticity.  Increasing `elasticityMultiplier` will result in few location samples as speed increases. |
  | [[stopAfterElapsedMinutes]] | `Integer`  | __Default: `0`__.  The plugin can optionally automatically stop tracking after some number of minutes elapses after the [[BackgroundGeolocation.start]] method was called. |
  | [[stopOnStationary]] | `Boolean`  | __Default: `false`__.  The plugin can optionally automatically stop tracking when the `stopTimeout` timer elapses. |
  | [[desiredOdometerAccuracy]] | `Integer`  | __Default: `100`__.  Location accuracy threshold in **meters** for odometer calculations. |
  | [[useSignificantChangesOnly]] | `Boolean` | __Default: `false`__.  Defaults to `false`.  Set `true` in order to disable constant background-tracking.  A location will be recorded only several times / hour. |
  | [[disableLocationAuthorizationAlert]] | `Boolean` | __Default: `false`__.  Disables automatic authorization alert when plugin detects the user has disabled location authorization.  You will be responsible for handling disabled location authorization by listening to the `providerchange` event.|
  | [[locationAuthorizationRequest]] | [[LocationAuthorizationRequest]] | __Default: `Always`__.  The desired location-authorization request, either `Always`, `WhenInUse` or `Any`. |

  ### [Geolocation] iOS Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[stationaryRadius]] | `Integer`  | __Default: `25`__.  When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage. |
  | [[locationAuthorizationAlert]] | `Object` | When you configure the plugin [[locationAuthorizationRequest]] `Always` or `WhenInUse` and the user *changes* that value in the app's location-services settings or *disables* location-services, the plugin will display an Alert directing the user to the **Settings** screen. |
  | [[showsBackgroundLocationIndicator]] | `Boolean` | A `boolean` indicating whether the status bar changes its appearance when an app uses location services in the background with `Always` authorization. |


  ### [Geolocation] Android Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[locationUpdateInterval]] | `Integer` | __Default: `1000`__.  With [[distanceFilter]]: 0, Sets the desired interval for location updates, in milliseconds.  ⚠️ This setting will be ignored when **`distanceFilter > 0`** |
  | [[fastestLocationUpdateInterval]] | `Integer` | __Default: `10000`__.  Explicitly set the fastest interval for location updates, in milliseconds. |
  | [[deferTime]] | `Integer` | __Default: `0`__.  Sets the maximum wait time in milliseconds for location updates to be delivered to your callback, when they will all be delivered in a batch.|
  | [[allowIdenticalLocations]] | `Boolean` | __Default: `false`__.  The Android plugin will ignore a received location when it is identical to the last location.  Set `true` to override this behaviour and record every location, regardless if it is identical to the last location.|


  ## Activity Recognition Options

  ### [Activity Recognition] Common Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[stopTimeout]] | `Integer` | __Default: `5`__.  The number of **minutes** to wait before turning off location-services after the ActivityRecognition System (ARS) detects the device is `STILL` |
  | [[stopDetectionDelay]] | `Integer` | __Default: `0`__.  Number of **minutes** to delay the stop-detection system from being activated.|
  | [[disableStopDetection]] | `Boolean` | __Default: `false`__.  Disable accelerometer-based **Stop-detection System**. ⚠️ Not recommended|
  | [[disableMotionActivityUpdates]] | `Boolean` | __Default: `false`__.  Disable motion-activity updates (eg: "walking", "in_vehicle"). Requires permission from the user. ⚠️ The plugin is **HIGHLY** optimized to use the Motion API for improved battery performance.  You are **STRONLY** recommended to **NOT** disable this. |

  ### [Activity Recognition] iOS Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[activityType]] | [[ActivityType]] |  __Default: [[BackgroundGeolocation.ACTIVITY_TYPE_OTHER]]__.  Presumably, this affects ios GPS algorithm.  See [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information |


  ## HTTP & Persistence Options

  - 📘 HTTP Guide: [[HttpEvent]].

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[url]] | `String` | __Default: `undefined`__.  Your server url where you wish to HTTP POST locations to |
  | [[httpTimeout]] | `Integer` | __Default: `60000`__.  HTTP request timeout in milliseconds. |
  | [[params]] | `Object` | __Default: `undefined`__.  Optional HTTP params sent along in HTTP request to above [[url]] |
  | [[extras]] | `Object` | __Default: `undefined`__.  Optional meta-data to attach to *each* recorded location |
  | [[headers]] | `Object` | __Default: `undefined`__.  Optional HTTP headers sent along in HTTP request to above [[url]] |
  | [[method]] | `String` | __Default: `POST`__.  The HTTP method.  Defaults to `POST`.  Some servers require `PUT`.|
  | [[httpRootProperty]] | `String` | __Default: `location`__.  The root property of the JSON data where location-data will be appended. |
  | [[locationTemplate]] | `String` | __Default: `undefined`__.  Optional custom location data schema (eg: `{ "lat:<%= latitude %>, "lng":<%= longitude %> }`|
  | [[geofenceTemplate]] | `String` | __Default: `undefined`__.  Optional custom geofence data schema (eg: `{ "lat:<%= latitude %>, "lng":<%= longitude %>, "geofence":"<%= geofence.identifier %>:<%= geofence.action %>" }`|
  | [[autoSync]] | `Boolean` | __Default: `true`__.  If you've enabled HTTP feature by configuring an [[url]], the plugin will attempt to upload each location to your server **as it is recorded**.|
  | [[autoSyncThreshold]] | `Integer` | __Default: `0`__.  The minimum number of persisted records to trigger an [[autoSync]] action. |
  | [[batchSync]] | `Boolean` | __Default: `false`__.  If you've enabled HTTP feature by configuring an [[url]], [[batchSync]]: true will POST all the locations currently stored in native SQLite datbase to your server in a single HTTP POST request.|
  | [[maxBatchSize]] | `Integer` | __Default: `-1`__.  If you've enabled HTTP feature by configuring an [[url]] and [[batchSync]]: true, this parameter will limit the number of records attached to each batch.|
  | [[maxDaysToPersist]] | `Integer` |  __Default: `1`__.  Maximum number of days to store a geolocation in plugin's SQLite database.|
  | [[maxRecordsToPersist]] | `Integer` |  __Default: `-1`__.  Maximum number of records to persist in plugin's SQLite database.  Defaults to `-1` (no limit).  To disable persisting locations, set this to `0`|
  | [[locationsOrderDirection]] | `String` |  __Default: `ASC`__.  Controls the order that locations are selected from the database (and synced to your server).  Defaults to ascending (`ASC`), where oldest locations are synced first.  Descending (`DESC`) syncs latest locations first.|


  ## Application Options

  ### [Application] Common Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[stopOnTerminate]] | `Boolean` |  __Default: `true`__.  Set `false` to continue tracking after user terminates the app. |
  | [[startOnBoot]] | `Boolean` | __Default: `false`__.  Set to `true` to enable background-tracking after the device reboots. |
  | [[heartbeatInterval]] | `Integer` | __Default: `60`__.  Rate in **seconds** to fire [[BackgroundGeolocation.onHeartbeat]] events. |
  | [[schedule]] | `Array` | __Default: `undefined`__.  Defines a schedule to automatically start/stop tracking at configured times |

  ### [Application] iOS Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[preventSuspend]] | `Boolean` | __Default: `false`__.  Enable this to prevent **iOS** from suspending your app in the background while in the **stationary state**.  Must be used in conjunction with a [[heartbeatInterval]].|

  ### [Application] Android Options

  | Option      | Type      | Note                               |
  |-------------|-----------|------------------------------------|
  | [[foregroundService]] | `Boolean` | __Default: `false`__.  Set `true` to make the plugin *mostly* immune to OS termination due to memory pressure from other apps. |
  | [[enableHeadless]] | `Boolean` | __Default: `false`__.  Set to `true` to enable "Headless" mode when the user terminates the application.  In this mode, you can respond to all the plugin's events in the native Android environment.  For more information, see the wiki for [Android Headless Mode](github:wiki/Android-Headless-Mode) |
  | [[notification]]  | [[Notification]] | Configures the required persistent [[Notification]] of the foreground service. |


  ## Geofencing Options

  - 📘 [[Geofence]] Guide.

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[geofenceProximityRadius]] | `Integer`  | __Default: `1000`__.  Radius in **meters** to query for geofences within proximity. |
  | [[geofenceInitialTriggerEntry]] | `Boolean` | __Default: `true`__.  Set `false` to disable triggering a geofence immediately if device is already inside it.|

  ### [Geofencing] Android Options

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[geofenceModeHighAccuracy]] | `Boolean`  | __Default: `false`__.  Runs [[startGeofences]] with a *foreground service* (along with its corresponding persitent [[Notification]]).  This will make geofence triggering **far more consistent** at the expense of higher power usage. |

  ## Logging & Debug Options

  - [Logging & Debugging Guide](github:wiki/Debugging)

  | Option      | Type      | Note                              |
  |-------------|-----------|-----------------------------------|
  | [[debug]] | `Boolean` | __Default: `false`__.  When enabled, the plugin will emit sounds & notifications for life-cycle events of background-geolocation |
  | [[logLevel]] | `Integer` | __Default: `LOG_LEVEL_VERBOSE`__.  Sets the verbosity of the plugin's logs from `LOG_LEVEL_OFF` to `LOG_LEVEL_VERBOSE` |
  | [[logMaxDays]] | `Integer` | __Default: `3`__.  Maximum days to persist a log-entry in database. |
  *
  */
  interface Config {
    /**
    * *Convenience* option to automatically configures the SDK to upload locations to the Transistor Software demo server at http://tracker.transistorsoft.com (or your own local instance of [background-geolocation-console](https://github.com/transistorsoft/background-geolocation-console))
    *
    * See [[TransistorAuthorizationToken]].  This option will **automatically configures** the [[url]] to point at the Demo server as well as well as the required [[Authorization]] configuration.
    *
    * @example
    * ```typescript
    * let token = await
    *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken("my-company-name", "my-username");
    *
    * BackgroundGeolocation.ready({
    *   transistorAuthorizationToken: token
    * });
    * ```
    *
    * This *convenience* option merely performs the following [[Authorization]] configuration *automatically* for you:
    *
    * @example
    * ```typescript
    * // Base url to Transistor Demo Server.
    * const url = "http://tracker.transistorsoft.com";
    *
    * // Register for an authorization token from server.
    * let token = await
    *   BackgroundGeolocation.findOrCreateTransistorAuthorizationToken("my-company-name", "my-username");
    *
    * BackgroundGeolocation.ready({
    *   url: url + "/api/locations",
    *   authorization: {
    *     strategy: "JWT",
    *     accessToken: token.accessToken,
    *     refreshToken: token.refreshToken,
    *     refreshUrl: url + "/v2/refresh_token",
    *     refreshPayload: {
    *       refresh_token: "{refreshToken}"
    *     },
    *     expires: token.expires
    *   }
    * });
    * ```
    *
    */
    transistorAuthorizationToken?: TransistorAuthorizationToken;

    /**
    * Specify the desired-accuracy of the geolocation system.
    *
    * The following constants are defined upon the [[BackgroundGeolocation]] class:
    *
    * | Name                                                  | Location Providers                   | Description                     |
    * |-------------------------------------------------------|--------------------------------------|---------------------------------|
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION]] | (**iOS only**) GPS + Wifi + Cellular | Highest power; highest accuracy |
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_HIGH]]       | GPS + Wifi + Cellular                | Highest power; highest accuracy |
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM]]     | Wifi + Cellular                      | Medium power; Medium accuracy;  |
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_LOW]]        | Wifi (low power) + Cellular          | Lower power; No GPS             |
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_VERY_LOW]]   | Cellular only                        | Lowest power; lowest accuracy   |
    * | [[BackgroundGeolocation.DESIRED_ACCURACY_LOWEST]]     | (**iOS only**)                       | Lowest power; lowest accuracy   |
    *
    * ### ⚠️ Note:
    * -  Only **`DESIRED_ACCURACY_HIGH`** uses GPS.  `speed`, `heading` and `altitude` are available only from GPS.
    *
    * @example
    * ```typescript
    * BackgroundGeoloction.ready({
    *   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH
    * });
    *```
    * For platform-specific information about location accuracy, see the corresponding API docs:
    * - [Android](https://developer.android.com/reference/com/google/android/gms/location/LocationRequest.html#PRIORITY_BALANCED_POWER_ACCURACY)
    * - [iOS](https://developer.apple.com/reference/corelocation/cllocationmanager/1423836-desiredaccuracy?language=objc)
    */
    desiredAccuracy?: LocationAccuracy;

    /**
    * The minimum distance (measured in meters) a device must move horizontally before an update event is generated.
    *
    * However, by default, **`distanceFilter`** is elastically auto-calculated by the plugin:  When speed increases, **`distanceFilter`** increases;  when speed decreases, so too does **`distanceFilter`**.
    * @break
    *
    * ### ℹ️ Note:
    * - To disable this behavior, configure [[disableElasticity]] __`true`__.
    * - To control the scale of the automatic `distanceFilter` calculation, see [[elasticityMultiplier]]
    *
    * `distanceFilter` is auto-scaled by rounding speed to the nearest `5 m/s` and adding `distanceFilter` meters for each `5 m/s` increment.
    *
    * For example, at biking speed of 7.7 m/s with a configured `distanceFilter: 30`:
    * @example
    * ```
    *   rounded_speed = round(7.7, 5)
    *   => 10
    *   multiplier = rounded_speed / 5
    *   => 10 / 5 = 2
    *   adjusted_distance_filter = multiplier * distanceFilter
    *   => 2 * 30 = 60 meters
    * ```
    *
    * At highway speed of `27 m/s` with a configured `distanceFilter: 50`:
    * @example
    * ```
    *   rounded_speed = round(27, 5)
    *   => 30
    *   multiplier = rounded_speed / 5
    *   => 30 / 5 = 6
    *   adjusted_distance_filter = multiplier * distanceFilter * elasticityMultipiler
    *   => 6 * 50 = 300 meters
    * ```
    *
    * Note the following real example of "elasticity" on highway 101 towards San Francisco as the driver slows down while running into
    * slower traffic &mdash; locations become compressed as [[distanceFilter]] decreases.
    *
    * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
    *
    * Compare now background-geolocation in the scope of a city.  In this image, the left-hand track is from a cab-ride, while the right-hand
    * track is walking speed.
    *
    * ![distanceFilter at city scale](https://dl.dropboxusercontent.com/s/yx8uv2zsimlogsp/distance-filter-city.png?dl=1)
    */
    distanceFilter?: number;

    /**
    * __`[iOS only]`__ The minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.
    *
    * ### ⚠️ Note: iOS will not detect the exact moment the device moves out of the stationary-radius.  In normal conditions, it will typically
    * take **~200 meters** of movement before the plugin begins tracking.
    * @break
    *
    * Configuring **`stationaryRadius: 0`** has **NO EFFECT**.  In fact the plugin enforces a minimum **`stationaryRadius`** of `25` and
    * in-practice, the native API won't respond for at least 200 meters.
    *
    * The following image shows the typical distance iOS requires to detect exit of the **`stationaryRadius`**:
    * - *Green polylines*: represent a transition from **stationary** state to **moving** (__~200 meters__).
    * - *Red circles*: locations where the plugin entered the **stationary** state.
    *
    * ![](https://dl.dropboxusercontent.com/s/vnio90swhs6xmqm/screenshot-ios-stationary-exit.png?dl=1)
    *
    * ### ℹ️ See also:
    * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
    *
    */
    stationaryRadius?: number;

    /**
    * The default timeout in _seconds_ when requesting a location before the SDK gives up and fires a [[LocationError]].
    *
    * Defaults to `60` seconds.
    *
    * @example
    * ```typescript
    * // With onLocation event
    * BackgroundGeolocation.onLocation((Location location) => {
    *   console.log('[onLocation] success:', location);
    * }, ((error) => {
    *   if (error.code == 408) {
    *     console.log("[onLocation] error: LOCATION TIMEOUT", error);
    *   }
    * });
    *
    * // With getCurrentPosition:
    * try {
    *   let location = await BackgroundGeolocation.getCurrentPosition({samples: 3});
    * } catch((error) => {
    *   if (error.code == 408) {
    *     console.log("[getCurrentPosition] error: LOCATION TIMEOUT",  error);
    *   }
    * });
    * ```
    *
    * ## See Also:
    * - [[BackgroundGeolocation.getCurrentPosition]]
    * - [[BackgroundGeolocation.onLocation]]
    *
    */
    locationTimeout?: number;

    /**
    * Defaults to **`false`**.  Set **`true`** to disable automatic, speed-based [[distanceFilter]] auto-scaling.  By default, the SDK automatically
    * increases [[distanceFilter]] as speed increases (and decreases it as speed *decreases*) in order to record fewer locations and conserve energy.
    * @break
    *
    * Note the following real example of "elasticity" on highway 101 towards San Francisco as the driver slows down while running into slower
    * traffic &mdash; locations become compressed as [[distanceFilter]] decreases.
    *
    * ![distanceFilter at highway speed](https://dl.dropboxusercontent.com/s/uu0hs0sediw26ar/distance-filter-highway.png?dl=1)
    *
    * ### ℹ️ See also:
    * - [[elasticityMultiplier]]
    * - [[distanceFilter]]
    */
    disableElasticity?: boolean;

    /**
    * Controls the scale of automatic speed-based [[distanceFilter]] elasticity.
    *
    * Increasing `elasticityMultiplier` will result in fewer location samples as speed increases.  A value of `0` has the same effect as
    * [[disableElasticity]] __`true`__.
    */
    elasticityMultiplier?: number;

    /**
    * Automatically [[stop]] tracking after *x* minutes.
    *
    * The plugin can optionally automatically [[stop]] after some number of minutes elapses after the [[start]] method was called.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   stopAfterElapsedMinutes: 30
    * }).then((state) => {
    *   BackgroundGeolocation.start();  // <-- plugin will automatically #stop in 30 minutes
    * });
    * ```
    */
    stopAfterElapsedMinutes?: number;

    /**
    * The radius around current location to query for geofences to activate monitoring upon.
    *
    * The default and *minimum* is `1000` meters.  See related event [[BackgroundGeolocation.onGeofencesChange]].  When using Geofences, the
    * plugin activates only those in proximity (the maximum geofences allowed to be simultaneously monitored is limited by the platform,
    * where **iOS** allows only 20 and **Android**.  However, the plugin allows you to create as many geofences as you wish (thousands even).
    * It stores these in its database and uses spatial queries to determine which **20** or **100** geofences to activate.
    *
    * @break
    *
    * ### ℹ️ See also:
    * - 📘 [[Geofence]] Guide.
    * - [View animation of this behavior](https://www.transistorsoft.com/shop/products/assets/images/background-geolocation-infinite-geofencing.gif)
    *
    * ![](https://dl.dropboxusercontent.com/s/7sggka4vcbrokwt/geofenceProximityRadius_iphone6_spacegrey_portrait.png?dl=1)
    */
    geofenceProximityRadius?: number;

    /**
    * When a device is already within a just-created geofence, fire the **enter** transition immediately.
    *
    * Defaults to `true`.  Set `false` to disable triggering a geofence immediately if device is already inside it.
    * @break
    *
    * ### ℹ️ See also:
    * - 📘 [[Geofence]] Guide.
    */
    geofenceInitialTriggerEntry?: boolean;

    /**
    * __`[Android only]`__ Enable high-accuracy for **geofence-only** mode (See [[BackgroundGeolocation.startGeofences]]).
    *
    * ### ⚠️ Warning: Will consume more power.

    * Defaults to `false`.  Runs Android's [[BackgroundGeolocation.startGeofences]] with a *foreground service* (along with its corresponding persistent [[Notification]].
    *
    * Configuring `geofenceModeHighAccuracy: true` will make Android geofence triggering **far more responsive**.  In this mode, the usual config options to control location-services will be applied:
    *
    * - [[desiredAccuracy]] ([[BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM]] works well).
    * - [[locationUpdateInterval]]
    * - [[distanceFilter]]
    * - [[deferTime]]
    *
    * With the default `geofenceModeHighAccuracy: false`, a device will have to move farther *into* a geofence before the *ENTER* event fires and farther *out of* a geofence before
    * the *EXIT* event fires.
    *
    * The more aggressive you configure the location-update params above (at the cost of power consumption), the more responsive will be your geofence-triggering.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   geofenceModeHighAccuracy: true,
    *   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
    *   locationUpdateInterval: 5000,
    *   distanceFilter: 50
    * }).then((state) => {
    *   BackgroundGeolocation.startGeofences();
    * });
    * ```
    *
    * @example **`geofenceModeHighAccuracy: false`** (Default) &mdash; Transition events **are delayed**.
    * ![](https://dl.dropboxusercontent.com/s/6nxbuersjcdqa8b/geofenceModeHighAccuracy-false.png?dl=1)
    *
    * @example **`geofenceModeHighAccuracy: true`** &mdash; Transition events are **nearly instantaneous**.
    * ![](https://dl.dropbox.com/s/w53hqn7f7n1ug1o/geofenceModeHighAccuracy-true.png?dl=1)
    *
    *
    */
    geofenceModeHighAccuracy?: boolean;

    /**
    * The maximum location accuracy allowed for a location to be used for [[Location.odometer]] calculations.
    *
    * Defaults to `100`.  If a location arrives having **`accuracy > desiredOdometerAccuracy`**, that location will not be used to update the
    * odometer.  If you only want to calculate odometer from GPS locations, you could set **`desiredOdometerAccuracy: 10`**.
    * This will prevent odometer updates when a device is moving around indoors, in a shopping mall, for example.
    */
    desiredOdometerAccuracy?: number;

    /**
    * Configure the initial tracking-state after [[BackgroundGeolocation.start]] is called.
    *
    * The plugin will immediately enter the tracking-state, by-passing the *stationary* state.  If the device is not currently moving, the stop-detection
    * system *will* still engage.  After [[stopTimeout]] minutes without movement, the plugin will enter the *stationary* state, as usual.
    *
    * @example
    * ```typescript
    * let state = await BackgroundGeolocation.ready({
    *   isMoving: true
    * });
    *
    * if (!state.enabled) {
    *   BackgroundGeolocation.start();
    * }
    * // Location-services are now on and the plugin is recording a location
    * // each [[distanceFilter]] meters.
    * ```
    */
    isMoving?: boolean;

    /**
    * Minutes to wait in *moving* state with no movement before considering the device *stationary*.
    *
    * @break
    *
    * Defaults to `5` minutes.  When in the *moving* state, specifies the number of minutes to wait before turning off location-services and
    * transitioning to *stationary* state after the ActivityRecognition System detects the device is `STILL`.  An example use-case for this
    * configuration is to delay GPS OFF while in a car waiting at a traffic light.
    *
    * ### ⚠️ Setting a value > 15 min is **not** recommended, particularly for Android.
    *
    * ### ℹ️ See also:
    * - [[onMotionChange]]
    * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
    */
    stopTimeout?: number;

    /**
    * @deprecated No longer used.
    */
    activityRecognitionInterval?: number;

    /**
    * @deprecated No longer used.
    */
    minimumActivityRecognitionConfidence?: number;

    /**
    * Disable motion-activity related stop-detection.
    * @break
    *
    * ### iOS
    *
    * Disables the accelerometer-based **Stop-detection System**.  When disabled, the plugin will use the default iOS behavior of automatically
    * turning off location-services when the device has stopped for **exactly 15 minutes**.  When disabled, you will no longer have control over [[stopTimeout]].
    *
    * To *completely* disable automatically turning off iOS location-services, you must also provide [[pausesLocationUpdatesAutomatically]] __`false`__.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   disableStopDetection: true,
    *   pausesLocationUpdatesAutomatically: false
    * });
    * ```
    *
    * ### ⚠️ iOS location-services will **never** turn off!
    *
    * With the above configuration, iOS location-services will never turn off and you could **quickly discharge the battery**.  Do **not** do
    * this unless you know *exactly* what you're doing (eg: A jogging app with `[Start workout]` / `[Stop Workout]` buttons
    * executing [[BackgroundGeolocation.changePace]]).
    *
    * ### iOS Stop-detection timing
    *
    * ![](https://dl.dropboxusercontent.com/s/ojjdfkmua15pskh/ios-stop-detection-timing.png?dl=1)
    *
    * ### Android
    *
    * Location-services **will never turn OFF** if you set this to **`true`**!  It will be purely up to you or the user to execute
    * [[BackgroundGeolocation.changePace]] __`false`__ or [[BackgroundGeolocation.stop]] to turn off location-services.
    */
    disableStopDetection?: boolean;

    /**
    * Automatically [[BackgroundGeolocation.stop]] when the [[stopTimeout]] elapses.
    * @break
    *
    * The plugin can optionally automatically stop tracking when the [[stopTimeout]] timer elapses.  For example, when the plugin
    * first fires [[BackgroundGeolocation.onMotionChange]] into the *moving* state, the next time an *onMotionChange* event occurs
    * into the *stationary* state, the plugin will have automatically called [[BackgroundGeolocation.stop]] upon itself.
    *
    * ⚠️ `stopOnStationary` will **only** occur due to [[stopTimeout]] timer elapse.  It will **not** occur by manually executing
    * [[BackgroundGeolocation.changePace]] __`false`__.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   stopOnStationary: true,
    *   isMoving: true
    * }, (state) => {
    *   BackgroundGeolocation.start();
    * });
    * ```
    */
    stopOnStationary?: boolean;

    /**
    * Your server `url` where you wish the SDK to automatically upload location data.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "https://my-server.com/locations"
    * });
    * ```
    *
    * You can observe the plugin performing HTTP requests in the logs for both iOS and Android (_See Wiki [Debugging](github:wiki/Debugging)_):
    *
    * @example
    * ```
    * ╔═════════════════════════════════════════════
    * ║ LocationService: location
    * ╠═════════════════════════════════════════════
    * ╟─ 📍 Location[45.519199,-73.617054]
    * ✅ INSERT: 70727f8b-df7d-48d0-acbd-15f10cacdf33
    * ╔═════════════════════════════════════════════
    * ║ HTTP Service
    * ╠═════════════════════════════════════════════
    * ✅ Locked 1 records
    * 🔵 HTTP POST: 70727f8b-df7d-48d0-acbd-15f10cacdf33
    * 🔵 Response: 200
    * ✅ DESTROY: 70727f8b-df7d-48d0-acbd-15f10cacdf33
    * ```
    *
    * |#| Log entry               | Description                                                           |
    * |-|-------------------------|-----------------------------------------------------------------------|
    * |1| `📍Location`            | Location received from native Location API.                           |
    * |2| `✅INSERT`              | Location record inserted into SDK's SQLite database.                  |
    * |3| `✅Locked`              | SDK's HTTP service locks a record (to prevent duplicate HTTP uploads).|
    * |4| `🔵HTTP POST`           | SDK's HTTP service attempts an HTTP request to your configured `url`. |
    * |5| `🔵Response`            | Response from your server.                                            |
    * |6| `✅DESTROY\|UNLOCK`     | After your server returns a __`20x`__ response, the SDK deletes that record from it SQLite database.  Otherwise, the SDK will __`UNLOCK`__ that record and try again in the future. |
    *
    * ### HTTP Failures
    *
    * If your server does *not* return a `20x` response (eg: `200`, `201`, `204`), the SDK will __`UNLOCK`__ that record.  Another attempt to
    * upload once again in the future until [[maxDaysToPersist]]:
    * - When another location is recorded.
    * - Application `pause` / `resume` events.
    * - Application boot.
    * - [[onHeartbeat]] events.
    * - [[onConnectivityChange]] events.
    * - __[iOS]__ Background `fetch` events.
    *
    * ### ⚠️ Note:
    * It is highly recommended to let the plugin manage uploading locations to your server, **particularly for Android** when configured
    * with **`stopOnTerminate: false`**, since `MainActivity` (where your application code lives) *will* terminate &mdash; only the plugin's
    * native Android background service will continue to operate, recording locations and uploading to your server.  The SDK's native HTTP
    * service *is* better at this task, since the SDK will automatically __retry on server failure__.
    *
    * ### ℹ️ See also:
    *
    * - 📘 HTTP Guide: [[HttpEvent]].
    * - 📘 [Philosophy of Operation](github:wiki/Philosophy-of-Operation)
    *
    */
    url?: string;

    /**
    * The HTTP method to use when creating an HTTP request to your configured [[url]].
    *
    * Defaults to `POST`.  Valid values are `POST`, `PUT` and `OPTIONS`.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "http://my-server.com/locations",
    *   method: "PUT"
    * });
    * ```
    *
    * ### ℹ️ See also:
    * - 📘 See HTTP Guide: [[HttpEvent]]
    *
    */
    method?: HttpMethod;

    /**
    * The root property of the JSON schema where location-data will be attached.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   httpRootProperty: "myData",
    *   url: "https://my.server.com"
    * });
    *
    * ```
    *
    * ```json
    * {
    *     "myData":{
    *         "coords": {
    *             "latitude":23.232323,
    *             "longitude":37.373737
    *         }
    *     }
    * }
    * ```
    *
    * You may also specify the character **`httpRootProperty:"."`** to place your data in the *root* of the JSON:
    *
    * @example
    * ```json
    * {
    *     "coords": {
    *         "latitude":23.232323,
    *         "longitude":37.373737
    *     }
    * }
    * ```
    *
    * ### ℹ️ See also:
    * - [[locationTemplate]]
    * - [[geofenceTemplate]]
    * - 📘 HTTP Guide: [[HttpEvent]].
    *
    */
    httpRootProperty?: string;

    /**
    * Optional HTTP **`params`** appended to the JSON body of each HTTP request.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "https://my-server.com/locations",
    *   params: {
    *     "user_id": 1234,
    *     "device_id": "abc123"
    *   }
    * );
    * ```
    *
    * Observing the HTTP request arriving at your server:
    * @example
    * ```typescript
    * POST /locations
    *  {
    *   "location": {
    *     "coords": {
    *       "latitude": 45.51927004945047,
    *       "longitude": -73.61650072045029
    *       .
    *       .
    *       .
    *     }
    *   },
    *   "user_id": 1234,  // <-- params appended to the data.
    *   "device_id": "abc123"
    * }
    * ```
    *
    * ### ℹ️ See also:
    * - [[headers]]
    * - [[extras]]
    * - 📘 See HTTP Guide: [[HttpEvent]]
    */
    params?: Object;

    /**
    * Optional HTTP headers applied to each HTTP request.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "https://my.server.com",
    *   headers: {
    *     "authorization": "Bearer <a secret key>",
    *     "X-FOO": "BAR"
    *   }
    * });
    * ```
    *
    * Observing incoming requests at your server:
    *
    * ```
    * POST /locations
    * {
    *   "host": "tracker.transistorsoft.com",
    *   "content-type": "application/json",
    *   "content-length": "456"
    *   .
    *   .
    *   .
    *   "authorization": "Bearer <a secret key>",
    *   "X-FOO": "BAR"
    * }
    * ```
    *
    * ### ℹ️ Note:
    * - The plugin automatically applies a number of required headers, including `"content-type": "application/json"`
    */
    headers?: Object;

    /**
    * Optional arbitrary key/values `{}` applied to each recorded location.
    *
    * 📘 See HTTP Guide: [[HttpEvent]]
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "https://my-server.com/locations",
    *   extras: {
    *     "route_id": 1234
    *   },
    *   params: {
    *     "device_id": "abc123"
    *   }
    * });
    * ```
    *
    * Observing incoming requests at your server:
    *
    * @example
    * ```typescript
    * - POST /locations
    * {
    *   "device_id": "abc123" // <-- params appended to root of JSON
    *   "location": {
    *     "coords": {
    *       "latitude": 45.51927004945047,
    *       "longitude": -73.61650072045029,
    *       .
    *       .
    *       .
    *     },
    *     "extras": {  // <-- extras appended to *each* location
    *       "route_id": 1234
    *     }
    *   }
    * }
    * ```
    */
    extras?: Extras;

    /**
    * Immediately upload each recorded location to your configured [[url]].
    * @break
    *
    * Default is `true`.  If you've enabled HTTP feature by configuring an [[url]], the plugin will attempt to HTTP POST each location to your
    * server **as soon as it is recorded**.  If you set [[autoSync]] __`false`__, it's up to you to **manually** execute the
    * [[BackgroundGeolocation.sync]] method to initiate the HTTP POST &mdash; the SDK will continue to persist **every** recorded location in the
    * SQLite database until you execute [[BackgroundGeolocation.sync]].
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "http://my.server.com/locations",
    *   autoSync: true,
    *   params: {
    *     user_id: 1234
    *   }
    * })
    * ```
    * ----------------------------------------------------------------------
    * ### ⚠️ Warning:  [[autoSyncThreshold]]
    *
    * If you've configured [[autoSyncThreshold]], it **will be ignored** during a `onMotionChange` event &mdash; all queued locations will be uploaded, since:
    * - If an `onMotionChange` event fires **into the *moving* state**, the device may have been sitting dormant for a long period of time.  The plugin is *eager* to upload this state-change to the server as soon as possible.
    * - If an `onMotionChange` event fires **into the *stationary* state**, the device may be *about to* lie dormant for a long period of time.  The plugin is *eager* to upload all queued locations to the server before going dormant.
    * ----------------------------------------------------------------------
    *
    * ### ℹ️ See also:
    * - [[autoSyncThreshold]]
    * - [[batchSync]]
    * - [[maxBatchSize]]
    */
    autoSync?: boolean;

    /**
    * The minimum number of persisted records the plugin must accumulate before triggering an [[autoSync]] action.
    * @break
    *
    * Defaults to `0` (no threshold).  If you configure a value greater-than **`0`**, the plugin will wait until that many locations are
    * recorded before executing HTTP requests to your server through your configured [[url]].
    *
    * ℹ️ Configuring [[autoSyncThreshold]] in conjunction with [[batchSync]] __`true`__ **can conserve battery** by reducing the number of HTTP
    * requests, since HTTP requests consume *far* more energy / second than GPS.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   url: "http://my.server.com/locations",
    *   autoSync: true,
    *   autoSyncThreshold: 5,
    *   batchSync: true
    * })
    * ```
    *
    * ```
    *              1  2  3  4  5    1  2  3  4  5
    * Locations: __|__|__|__|__|____|__|__|__|__|___...
    *
    *                         POST             POST
    *   Network: ______________|________________|___...
    * ```
    * ----------------------------------------------------------------------
    * ### ⚠️ Warning
    *
    * `autoSyncThreshold` **will be ignored** during a [[BackgroundGeolocation.onMotionChange]] event &mdash; all queued locations will be uploaded, since:
    * - If an `onMotionChange` event fires **into the *moving* state**, the device may have been sitting dormant for a long period of time.  The plugin is *eager* to upload this state-change to the server as soon as possible.
    * - If an `onMotionChange` event fires **into the *stationary* state**, the device may be *about to* lie dormant for a long period of time.  The plugin is *eager* to upload all queued locations to the server before going dormant.
    * ----------------------------------------------------------------------
    *
    */
    autoSyncThreshold?: number;

    /**
    * POST multiple locations to your [[url]] in a single HTTP request.
    *
    * Default is **`false`**.  If you've enabled HTTP feature by configuring an [[url]], [[batchSync]] __`true`__ will POST *all* the locations
    * currently stored in native SQLite database to your server in a single HTTP POST request.  With [[batchSync]] __`false`__, an HTTP POST
    * request will be initiated for **each** location in database.
    *
    * #### __`batchSync: true`__ &mdash; All accumulated locations POSTed in 1 HTTP request.
    * @example
    * ```typescript
    * // Using batchSync: true
    * BackgroundGeolocation.ready({
    *   url: "http://my.server.com/locations",
    *   autoSync: true,
    *   autoSyncThreshold: 5,
    *   batchSync: true
    * })
    * ```
    *
    * ```
    *              1  2  3  4  5    1  2  3  4  5
    * Locations: __|__|__|__|__|____|__|__|__|__|___...
    *
    *                         POST            POST
    *   Network: ______________|________________|___...
    * ```
    *
    * #### __`batchSync: false`__ &mdash; 1 POST per location
    * @example
    * ```typescript
    * // With batchSync: false
    * BackgroundGeolocation.ready({
    *   url: "http://my.server.com/locations",
    *   autoSync: true,
    *   autoSyncThreshold: 5,
    *   batchSync: false
    * })
    * ```
    *
    * ```
    *              1  2  3  4  5    1  2  3  4  5
    * Locations: __|__|__|__|__|____|__|__|__|__|___...
    *
    *                          POST             POST
    *   Network: ______________|||||____________|||||___...
    * ```
    * ### ℹ️ See also:
    * - [[maxBatchSize]]
    * - [[autoSync]]
    * - [[autoSyncThreshold]]
    * 📘 See HTTP Guide: [[HttpEvent]]
    */
    batchSync?: boolean;

    /**
    * Controls the number of records attached to **each** batch HTTP request.
    * @break
    *
    * Defaults to `-1` (no maximum).  If you've enabled HTTP feature by configuring an [[url]] with [[batchSync]] __`true`__, this parameter
    * will limit the number of records attached to **each** batch request.  If the current number of records exceeds the **[[maxBatchSize]]**,
    * multiple HTTP requests will be generated until the location queue is empty.
    *
    * The plugin can potentially accumulate mega-bytes worth of location-data if operating in a disconnected environment for long periods.
    * You will not want to [[batchSync]] __`true`__ a large amount of data in a single HTTP request.
    *
    * ### ℹ️ See also:
    * - [[batchSync]]
    * 📘 See HTTP Guide: [[HttpEvent]]
    */
    maxBatchSize?: number;

    /**
    * Optional custom template for rendering [[Location]] JSON request data in HTTP requests.
    * @break
    *
    * The [[locationTemplate]] will be evaluated for variables using Ruby `erb`-style tags:
    *
    * ```bash
    * <%= variable_name %>
    * ```
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>,"event":"<%= event %>",isMoving:<%= is_moving %>}'
    * });
    *
    * // Or use a compact [Array] template!
    * BackgroundGeolocation.ready({
    *   locationTemplate: '[<%=latitude%>, <%=longitude%>, "<%=event%>", <%=is_moving%>]'
    * ))
    * ```
    *
    * ### ⚠️  quoting `String` data.
    *
    * The plugin does not automatically apply double-quotes around `String` data.  The plugin will attempt to JSON encode your template exactly
    * as you're configured.
    *
    * The following will generate an error:
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   locationTemplate: '{"timestamp": <%= timestamp %>}'
    * });
    * ```
    *
    * Since the template-tag `timestamp` renders a string, the rendered String will look like this, generating a JSON error:
    *
    * @example
    * ```json
    * {"timestamp": 2018-01-01T12:01:01.123Z}
    * ```
    *
    * The correct `locationTemplate` is:
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   locationTemplate: '{"timestamp": "<%= timestamp %>"}'
    * });
    * ```
    *
    * @example
    * ```json
    * {"timestamp": "2018-01-01T12:01:01.123Z"}
    * ```
    *
    * ### Configured [[extras]]:
    *
    * If you've configured [[extras]], these key-value pairs will be merged *directly* onto your location data.  For example:
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   httpRootProperty: 'data',
    *   locationTemplate: '{"lat":<%= latitude %>,"lng":<%= longitude %>}',
    *   extras: {
    *     "foo": "bar"
    *   }
    * )
    * ```
    *
    * Will result in JSON:
    * @example
    * ```json
    * {
    *     "data": {
    *         "lat":23.23232323,
    *         "lng":37.37373737,
    *         "foo":"bar"
    *     }
    * }
    * ```
    *
    * ### Template Tags
    *
    * | Tag                   | Type     | Description |
    * |-----------------------|----------|-------------|
    * | `latitude`            | `Float`  |             |
    * | `longitude`           | `Float`  |             |
    * | `speed`               | `Float`  | Meters      |
    * | `heading`             | `Float`  | Degrees     |
    * | `accuracy`            | `Float`  | Meters      |
    * | `altitude`            | `Float`  | Meters      |
    * | `altitude_accuracy`   | `Float`  | Meters      |
    * | `timestamp`           | `String` |ISO-8601     |
    * | `uuid`                | `String` |Unique ID    |
    * | `event`               | `String` |`motionchange,geofence,heartbeat,providerchange` |
    * | `odometer`            | `Float`  | Meters      |
    * | `activity.type`       | `String` | `still,on_foot,running,on_bicycle,in_vehicle,unknown`|
    * | `activity.confidence` | `Integer`| 0-100%      |
    * | `battery.level`       | `Float`  | 0-100%      |
    * | `battery.is_charging` | `Boolean`| Is device plugged in?|
    * | `mock`                | `Boolean`| `true` when location was recorded from a Mock location app. |
    * | `is_moving`           | `Boolean`| `true` if location was recorded while device was in *moving* state.|
    *
    * ### ℹ️ See also:
    * - 📘 HTTP Guide: [[HttpEvent]].
    * - [[geofenceTemplate]]
    * - [[httpRootProperty]]
    */
    locationTemplate?: string;

    /**
    * Optional custom template for rendering [[GeofenceEvent]] JSON request data in HTTP requests.
    * @break
    *
    * The `geofenceTemplate` is similar to [[locationTemplate]] with the addition of two extra `geofence.*` tags.
    *
    * The `geofenceTemplate` will be evaluated for variables using Ruby `erb`-style tags:
    *
    * ```bash
    * <%= variable_name %>
    * ```
    * ### ℹ️ See also:
    * - [[locationTemplate]]
    * - [[httpRootProperty]]
    * - 📘 HTTP Guide: [[HttpEvent]].
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   geofenceTemplate: '{ "lat":<%= latitude %>, "lng":<%= longitude %>, "geofence":"<%= geofence.identifier %>:<%= geofence.action %>" }'
    * });
    *
    * // Or use a compact [Array] template!
    * BackgroundGeolocation.{(
    *   geofenceTemplate: '[<%= latitude %>, <%= longitude %>, "<%= geofence.identifier %>", "<%= geofence.action %>"]'
    * )
    * ```
    *
    * ### ⚠️  quoting `String` data.
    *
    * The plugin does not automatically apply double-quotes around `String` data.  The plugin will attempt to JSON encode your template exactly
    * as you're configured.
    *
    * The following will generate an error:
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   locationTemplate: '{"timestamp": <%= timestamp %>}'
    * });
    * ```
    *
    * Since the template-tag `timestamp` renders a string, the rendered String will look like this, generating a JSON error:
    * @example
    * ```json
    * {"timestamp": 2018-01-01T12:01:01.123Z}
    * ```
    *
    * The correct `geofenceTemplate` is:
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   geofenceTemplate: '{"timestamp": "<%= timestamp %>"}'
    * });
    * ```
    *
    * @example
    *
    * ```json
    * {"timestamp": "2018-01-01T12:01:01.123Z"}
    * ```
    *
    * ### Template Tags
    *
    * The tag-list is identical to [[locationTemplate]] with the addition of `geofence.identifier` and `geofence.action`.
    *
    * | Tag                   | Type     | Description |
    * |-----------------------|----------|-------------|
    * | **`geofence.identifier`** | `String` | Which geofence?|
    * | **`geofence.action`** | `String` | `ENTER/EXIT`|
    * | `latitude`            | `Float`  |             |
    * | `longitude`           | `Float`  |             |
    * | `speed`               | `Float`  | Meters      |
    * | `heading`             | `Float`  | Degrees     |
    * | `accuracy`            | `Float`  | Meters      |
    * | `altitude`            | `Float`  | Meters      |
    * | `altitude_accuracy`   | `Float`  | Meters      |
    * | `timestamp`           | `String` |ISO-8601     |
    * | `uuid`                | `String` |Unique ID    |
    * | `event`               | `String` |`motionchange,geofence,heartbeat,providerchange` |
    * | `odometer`            | `Float`  | Meters      |
    * | `activity.type`       | `String` | `still,on_foot,running,on_bicycle,in_vehicle,unknown`|
    * | `activity.confidence` | `Integer`| 0-100%      |
    * | `battery.level`       | `Float`  | 0-100%      |
    * | `battery.is_charging` | `Boolean`| Is device plugged in?|
    * | `mock`                | `Boolean`| `true` when geofence was recorded from a Mock location app. |
    * | `is_moving`           | `Boolean`| `true` if geofence was recorded while device was in *moving* state.|
    */
    geofenceTemplate?: string;

    /**
    * Maximum number of days to store a geolocation in plugin's SQLite database.
    * @break
    *
    * When your server fails to respond with **`HTTP 200 OK`**, the plugin will continue periodically attempting to upload to your server server
    * until **[[maxDaysToPersist]]** when it will give up and remove the location from the database.
    */
    maxDaysToPersist?: number;

    /**
    * Maximum number of records to persist in plugin's SQLite database.
    *
    * Default `-1` means **no limit**.
    *
    * ### ℹ️ See also:
    * - 📘 See HTTP Guide: [[HttpEvent]]
    */
    maxRecordsToPersist?: number;

    /**
    * Allows you to specify which events to persist to the SDK's internal database:  locations | geofences | all (default).
    *
    * Note that all recorded location and geofence events will *always* be provided to your [BackgroundGeolocation.onLocation] and [BackgroundGeolocation.onGeofence] events, just that the
    * persistence of those events in the SDK's internal SQLite database can be limited.  Any event which has not been persisted to the SDK's internal database
    * will also **not** therefore be uploaded to your [url] (if configured).
    *
    * | Name                                 | Description                                             |
    * |--------------------------------------|---------------------------------------------------------|
    * | [[BackgroundGeolocation.PERSIST_MODE_ALL]]                   | (__DEFAULT__) Persist both geofence and location events |
    * | [[BackgroundGeolocation.PERSIST_MODE_LOCATION]]              | Persist only location events (ignore geofence events)   |
    * | [[BackgroundGeolocation.PERSIST_MODE_GEOFENCE]]              | Persist only geofence events (ignore location events)   |
    * | [[BackgroundGeolocation.PERSIST_MODE_NONE]]                  | Persist nothing (neither geofence nor location events)  |
    *
    * ### ⚠️ Warning
    * This option is designed for specializd use-cases and should generally not be used.  For example, some might wish to
    * run the plugin in regular tracking mode with [[BackgroundGeolocation.start]] but only record geofence events.  In this case,
    * one would configure `persistMode: BackgroundGeolocation.PERSIST_MODE_GEOFENCE`.
    */
    persistMode?: PersistMode;
    /**
    * Disable [[autoSync]] HTTP requests when device is connected to a Cellular connection.
    * Defaults to `false`.  Set `true` to allow [[autoSync]] only when device is connected to Wifi.
    *
    * __WARNING__ This option is ignored when manually invoking [[BackgroundGeolocation.sync]].
    *
    */
    disableAutoSyncOnCellular?: boolean;

    /**
    * Configures the SDK for [[Authorization]] with your server (eg: [JSON Web Token](https://jwt.io/)).
    *
    * ### ⚠️ Only [JWT](https://jwt.io/) is currently supported.
    *
    * The SDK will automatically apply the supplied token to HTTP request's Authorization header, eg:
    *
    * `"Authorization": "Bearer abcd1234..."`
    *
    * If provided with [[Authorization.refreshUrl]] and [[Authorization.expires]], the SDK can automatically re-register for a new token after expiration.
    *
    * ### ℹ️ See also:
    * - [[Authorization]].
    * - [[BackgroundGeolocation.onAuthorization]].
    *
    * @example
    * ```
    * // Get a reference to your app's Authorization token.
    * let myToken = this.getMyAuthorizationToken();
    *
    * BackgroundGeolocation.onAuthorization((event:AuthorizationEvent) => {
    *   console.log("[authorization]", authorization.success, authorization.response, authorization.error);
    * });
    *
    * BackgroundGeolocation.ready({
    *   url: "https://app.your.server.com/users/locations",
    *   autoSync: true,
    *   authorization: {
    *     strategy: "JWT",
    *     accessToken: myToken.accessToken,
    *     refreshToken: myToken.refreshToken,
    *     refreshUrl: "https://auth.your.server.com/tokens",
    *     refreshPayload: {
    *       the_refresh_token_field_name: "{refreshToken}"
    *     },
    *     expires: myToken.expiresAt
    *   }
    * });
    * ```
    */
    authorization?: Authorization;

    /**
    * Controls the order that locations are selected from the database (and uploaded to your server).
    *
    * Defaults to ascending (`ASC`), where oldest locations are synced first.  Descending (`DESC`) uploads latest locations first.
    *
    * ### ℹ️ See also:
    * - 📘 See HTTP Guide: [[HttpEvent]]
    */
    locationsOrderDirection?: string;

    /**
    * HTTP request timeout in **milliseconds**.
    *
    * HTTP request timeouts will fire the [[BackgroundGeolocation.onHttp]].  Defaults to `60000 ms`.
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.onHttp((response) => {
    *   let success = response.success;
    *   if (!success) {
    *     console.log("[onHttp] FAILURE: ", response);
    *   }
    * });
    *
    * BackgroundGeolocation.ready({
    *   url: "https://my-server.com/locations",
    *   httpTimeout: 3000
    * );
    * ```
    *
    * ### ℹ️ See also:
    * - 📘 See HTTP Guide: [[HttpEvent]]
    */
    httpTimeout?: number;

    /**
    * Controls whether to continue location-tracking after application is **terminated**.
    * @break
    *
    * Defaults to **`true`**.  When the user terminates the app, the plugin will [[BackgroundGeolocation.stop]] tracking.  Set this to **`false`**
    * to continue tracking after application terminate.
    *
    * If you *do* configure **`stopOnTerminate: false`**, your application **will** terminate at that time.  However, both Android and iOS differ
    * in their behavior *after* this point:
    *
    * ### iOS
    *
    * Before an iOS app terminates, the plugin will ensure that a **stationary geofence** of [[stationaryRadius]] meters is created around the last
    * known position.  When the user moves beyond the stationary geofence (typically ~200 meters), iOS will __completely reboot your application in the background__, and the plugin will resume tracking.  iOS maintains geofence monitoring at the OS level, in spite of application terminate / device reboot.
    *
    * In the following image, imagine the user terminated the application at the **"red circle"** on the right, then continued moving:  Once the
    * device moves __by about 200 meters__, exiting the "stationary geofence", iOS reboots the app and tracking resumes.
    *
    * ℹ️ [Demo Video of `stopOnTerminate: false`](https://www.youtube.com/watch?v=aR6r8qV1TI8&t=214s)
    *
    * ![](https://dl.dropboxusercontent.com/s/1uip231l3gds68z/screenshot-stopOnTerminate-ios.png?dl=0)
    *
    * ### Android
    *
    * Unlike iOS, the Android plugin's tracking will **not** pause at all when user terminates the app.  However, only the plugin's native background
    * service continues to operate, **"headless"** (in this case, you should configure an [[url]] in order for the background-service to continue
    * uploading locations to your server).
    *
    * ### ℹ️ See also:
    * - [Android Headless Mode](github:wiki/Android-Headless-Mode)
    * - [[enableHeadless]]
    */
    stopOnTerminate?: boolean;

    /**
    * Controls whether to resume location-tracking after device is **rebooted**.
    *
    * Defaults to **`false`**.  Set **`true`** to engage background-tracking after the device reboots.
    * @break
    *
    * ### iOS
    *
    * iOS cannot **immediately** engage tracking after a device reboot.  Just like [[stopOnTerminate]] __`false`__, iOS will not re-boot your
    * app until the device moves beyond the **stationary geofence** around the last known location.  In addition, iOS subscribes to
    * "background-fetch" events, which typically fire about every 15 minutes &mdash; these too are capable of rebooting your app after a device
    * reboot.
    *
    * ### Android
    *
    * ### ℹ️ See also:
    * - [[enableHeadless]]
    */
    startOnBoot?: boolean;

    /**
    * Controls the rate (in seconds) the [[BackgroundGeolocation.onHeartbeat]] event will fire.
    * @break
    *
    * ### ⚠️ Warning:
    * - On **iOS** the **[[BackgroundGeolocation.onHeartbeat]]** event will fire only when configured with [[preventSuspend]] __`true`__.
    * - Android *minimum* interval is `60` seconds.  It is **impossible** to have a [[heartbeatInterval]] faster than this on Android.
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   heartbeatInterval: 60
    * });
    *
    * BackgroundGeolocation.onHeartbeat((event) => {
    *   console.log("[onHeartbeat] ", event);
    *
    *   // You could request a new location if you wish.
    *   BackgroundGeolocation.getCurrentPosition({
    *     samples: 1,
    *     persist: true
    *   }).then((location) => {
    *     console.log("[getCurrentPosition] ", location);
    *   });
    * });
    * ```
    *
    * ### ℹ️ See also:
    * - [[BackgroundGeolocation.onHeartbeat]]
    *
    */
    heartbeatInterval?: number;

    /**
    * Configures an automated, cron-like schedule for the plugin to [[start]] / [[stop]] tracking at pre-defined times.
    *
    * @example
  	* ```typescript
    *   "{DAY(s)} {START_TIME}-{END_TIME}"
    * ```
    *
    * - The `START_TIME`, `END_TIME` are in **24h format**.
    * - The `DAY` param corresponds to the `Locale.US`, such that **Sunday=1**; **Saturday=7**).
    * - You may configure a single day (eg: `1`), a comma-separated list-of-days (eg: `2,4,6`) or a range (eg: `2-6`)
    *
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   .
    *   .
    *   .
    *   schedule: [
    *     "1 17:30-21:00",    // Sunday: 5:30pm-9:00pm
    *     "2-6 9:00-17:00",   // Mon-Fri: 9:00am to 5:00pm
    *     "2,4,6 20:00-00:00",// Mon, Web, Fri: 8pm to midnight (next day)
    *     "7 10:00-19:00"     // Sat: 10am-7pm
    *   ]
    * }).then((state) => {
    *   // Start the Scheduler
    *   BackgroundGeolocation.startSchedule();
    * });
    *
    * // Listen to #onSchedule events:
    * BackgroundGeolocation.onSchedule((state) => {
    *   let enabled = state.enabled;
    *   console.log("[onSchedule] - enabled? ", enabled);
    * });
    * .
    * .
    * .
    * // Later when you want to stop the Scheduler (eg: user logout)
    * BackgroundGeolocation.stopSchedule();
    * // You must explicitly stop tracking if currently enabled
    * BackgroundGeolocation.stop();
    *
    * // Or modify the schedule with usual #setConfig method
    * BackgroundGeolocation.setConfig({
    *   schedule: [
    *     "1-7 9:00-10:00",
    *     "1-7 11:00-12:00",
    *     "1-7 13:00-14:00",
    *     "1-7 15:00-16:00",
    *     "1-7 17:00-18:00",
    *     "2,4,6 19:00-22:00"
    *   ]
    * });
    * ```
    *
    * ### Literal Dates
    *
    * The schedule can also be configured with a literal start date of the form:
    * @example
    *
    * ```
    *   "yyyy-mm-dd HH:mm-HH:mm"
    * ```
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   schedule: [
    *     "2018-01-01 09:00-17:00"
    *   ]
    * });
    * ```
    *
    * Or **two** literal dates to specify both a start **and** stop date:
    * @example
    *
    * ```
    *   "yyyy-mm-dd-HH:mm yyyy-mm-dd-HH:mm"
    * ```
    *
    * @example
  	* ```typescript
  	*
    * schedule: [
    *     "2018-01-01-09:00 2019-01-01-17:00"  // <-- track for 1 year
    *   ]
    * ```
    *
    * ## Scheduling Geofences-only or Location + Geofences Tracking
    *
    * You can choose to schedule either geofences-only ([[BackgroundGeolocation.startGeofences]]) or location + geofences ([[BackgroundGeolocation.start]]) tracking with each configured schedule by appending the text `geofence` or `location` (default):
    *
    * In the following schedule, the SDK will engage *location + geofences* tracking between 9am to 5pm.  From 6pm to midnight, only *geofences* will be monitored.
    *
    * ```typescript
    * schedule: [
    *   "1-7 09:00-17:00 location",
    *   "1-7 18:00-12:00 geofence"
    * ]
    * ```
    *
    * Since `location` is the default tracking-mode, it can be omitted:
    *
    * ```typescript
    * schedule: [
    *   "1-7 09:00-10:00",  // <-- location is default
    *   "1-7 10:00-11:00 geofence"
    *   "1-7 12:00-13:00",
    *   "1-7 13:00-14:00 geofence"
    * ```
    *
    * ### iOS
    *
    * - iOS **cannot** evaluate the Schedule at the *exact* time you configure &mdash; it can only evaluate the **`schedule`** *periodically*, whenever your app comes alive.
    * - When the app is running in a scheduled **off** period, iOS will continue to monitor the low-power, [significant location changes API (SLC)](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc) in order to ensure periodic schedule evaluation.  **SLC** is required in order guarantee periodic schedule-evaluation when you're configured [[stopOnTerminate]] __`false`__, since the iOS Background Fetch API is halted if user *manually* terminates the app.  **SLC** will awaken your app whenever a "significant location change" occurs, typically every `1000` meters.  If the `schedule` is currently in an **off** period, this location will **not** be persisted nor will it be sent to the [[BackgroundGeolocation.onLocation]] event &mdash; only the **`schedule`** will be evaluated.
    * - When a **`schedule`** is provided on iOS, it will be evaluated in the following cases:
    *   - Application `pause` / `resume` events.
    *   - Whenever a location is recorded (including **SLC**)
    *   - Background fetch event
    *
    * ### Android
    *
    * The Android Scheduler uses [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager#setExactAndAllowWhileIdle(int,%20long,%20android.app.PendingIntent)) and *typically* operates on-the-minute.
    *
    * ### ℹ️ See also:
    * - [[startSchedule]]
    * - [[stopSchedule]]
    */
    schedule?: Array<string>;

    /**
    * __Android only__ Force the Android scheduler to use `AlarmManager` (more precise) instead of `JobScheduler`.  Defaults to `false`.
    *
    * ```typescript
    * BackgroundGeolocation.ready({
    *   schedule: ["1-7 09:00-17:00"],
    *   scheduleUseAlarmManager: true
    * });
    * ```
    */
    scheduleUseAlarmManager?: boolean;

    /**
    * Configure the plugin to emit sound effects and local-notifications during development.
    * @break
    *
    * Defaults to **`false`**.  When set to **`true`**, the plugin will emit debugging sounds and notifications for life-cycle events of [[BackgroundGeolocation]].
    *
    * ## iOS
    *
    * In you wish to hear debug sounds in the background, you must manually enable the background-mode:
    *
    * **`[x] Audio and Airplay`** background mode in *Background Capabilities* of XCode.
    *
    * ![](https://dl.dropboxusercontent.com/s/fl7exx3g8whot9f/enable-background-audio.png?dl=1)
    *
    * ## Event Debug Sound Effects
    *
    * | Event                      | iOS                     | Android                    |
    * |----------------------------|-------------------------|----------------------------|
    * | `LOCATION_RECORDED`        | <mediaplayer:https://dl.dropbox.com/s/yestzqdb6gzx7an/location-recorded.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/d3e821scn5fppq6/tslocationmanager_ooooiii3_full_vol.wav?dl=0>      |
    * | `LOCATION_SAMPLE`          | <mediaplayer:https://dl.dropbox.com/s/8gp2nkzza2hql4r/location-sample.mp3?dl=0>          | <mediaplayer:https://dl.dropboxusercontent.com/s/8bgiyifowyf9c7n/tslocationmanager_click_tap_done_checkbox5_full_vol.wav?dl=0> |
    * | `LOCATION_ERROR`           | <mediaplayer:https://dl.dropbox.com/s/l3rmf99rj3g5u6b/location-error.mp3?dl=0>           | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0>                         |
    * | `LOCATION_SERVICES_ON`     | <mediaplayer:https://dl.dropbox.com/s/urbjiqn0f4g1jhi/location-services-on.mp3?dl=0>     | n/a                                                                                                                 |
    * | `LOCATION_SERVICES_OFF`    | <mediaplayer:https://dl.dropbox.com/s/0wb7qajfb0yy9w0/location-services-off.mp3?dl=0>    | n/a                                                                                                                 |
    * | `STATIONARY_GEOFENCE_EXIT` | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/gjgv51pot3h2n3t/tslocationmanager_zap_fast.mp3?dl=0>                          |
    * | `MOTIONCHANGE_FALSE`       | <mediaplayer:https://dl.dropbox.com/s/xk00hsfi87nrw3q/motionchange-false.mp3?dl=0>       | <mediaplayer:https://dl.dropboxusercontent.com/s/fm4j2t8nqzd5856/tslocationmanager_marimba_drop.mp3?dl=0>                      |
    * | `MOTIONCHANGE_TRUE`        | <mediaplayer:https://dl.dropbox.com/s/p8ee60qvfgx4vi5/motionchange-true.mp3?dl=0>        | <mediaplayer:https://dl.dropboxusercontent.com/s/n5mn6tr7x994ivg/tslocationmanager_chime_short_chord_up.mp3?dl=0>              |
    * | `MOTION_TRIGGER_DELAY_START` | n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/cb3fa0zp0c4xjmt/tslocationmanager_dot_retry.wav?dl=0>                                                                                                            |
    * | `MOTION_TRIGGER_DELAY_CANCEL`| n/a | <mediaplayer:https://dl.dropboxusercontent.com/s/4pg3r4xooi9pe0g/tslocationmanager_dot_stopaction2.wav?dl=0>                                                                                                      |
    * | `STOP_DETECTION_DELAY_INITIATED` | <mediaplayer:https://dl.dropbox.com/s/y898zopjfolx42d/stopDetectionDelay.mp3?dl=0> | n/a                                                                                                                 |
    * | `STOP_TIMER_ON`            | <mediaplayer:https://dl.dropbox.com/s/7mjcmnszhjo6ywj/stop-timeout-start.mp3?dl=0>       | <mediaplayer:https://dl.dropboxusercontent.com/s/q4a9pf0vlztfafh/tslocationmanager_chime_bell_confirm.mp3?dl=0>                |
    * | `STOP_TIMER_OFF`           | <mediaplayer:https://dl.dropbox.com/s/qnsdu7b6vxic01i/stop-timeout-cancel.mp3?dl=0>      | <mediaplayer:https://dl.dropboxusercontent.com/s/9o9v826was19lyi/tslocationmanager_bell_ding_pop.mp3?dl=0>                     |
    * | `HEARTBEAT`                | <mediaplayer:https://dl.dropbox.com/s/90vyfo3woe52ijo/heartbeat.mp3?dl=0>                | <mediaplayer:https://dl.dropboxusercontent.com/s/bsdtw21hscqqy67/tslocationmanager_peep_note1.wav?dl=0>                        |
    * | `GEOFENCE_ENTER`           | <mediaplayer:https://dl.dropbox.com/s/h3047lybsggats7/geofence-enter.mp3?dl=0>           | <mediaplayer:https://dl.dropboxusercontent.com/s/76up5ik215xwxh1/tslocationmanager_beep_trip_up_dry.mp3?dl=0>                  |
    * | `GEOFENCE_EXIT`            | <mediaplayer:https://dl.dropbox.com/s/2e8bg22c6g9zwxr/geofence-exit.mp3?dl=0>            | <mediaplayer:https://dl.dropboxusercontent.com/s/xuyyagffheyk8r7/tslocationmanager_beep_trip_dry.mp3?dl=0>                     |
    * | `GEOFENCE_DWELL_START`     | <mediaplayer:https://dl.dropbox.com/s/7nysvyjxuxm9pms/geofence-dwell-start.mp3?dl=0>     | n/a                                                                                                                 |
    * | `GEOFENCE_DWELL_CANCEL`    | <mediaplayer:https://dl.dropbox.com/s/sk2hur6nxch1zvm/geofence-dwell-cancel.mp3?dl=0>    | n/a                                                                                                                 |
    * | `GEOFENCE_DWELL`           | `GEOFENCE_ENTER` after `GEOFENCE_DWELL_START`                                            | <mediaplayer:https://dl.dropboxusercontent.com/s/uw5vjuatm3wnuid/tslocationmanager_beep_trip_up_echo.mp3?dl=0>                 |
    * | `ERROR`                    | <mediaplayer:https://dl.dropbox.com/s/h5b52m056pfc734/error.mp3?dl=0>                    | <mediaplayer:https://dl.dropboxusercontent.com/s/32e93c1t4kh69p1/tslocationmanager_music_timpani_error_01.mp3?dl=0>            |
    * | `WARNING`                  | n/a                                                                                      | <mediaplayer:https://dl.dropboxusercontent.com/s/wadrz2x6elhc65l/tslocationmanager_digi_warn.mp3?dl=0>                         |
    * | `BACKGROUND_FETCH`         | <mediaplayer:https://dl.dropbox.com/s/mcsjqye0xx2kapk/background-fetch.mp3?dl=0>         | n/a                                                                                                                 |
    *
    */
    debug?: boolean;

    /**
    * Controls the volume of recorded events in the plugin's logging database.
    *
    * [[BackgroundGeolocation]] contains powerful logging features.  By default, the plugin boots with a value of [[BackgroundGeolocation.LOG_LEVEL_OFF]],
    * storing [[logMaxDays]] (default `3`) days worth of logs in its SQLite database.
    *
    * The following log-levels are defined as **constants** on this [[BackgroundGeolocation]] class:
    *
    * | Label                                       |
    * |---------------------------------------------|
    * | [[BackgroundGeolocation.LOG_LEVEL_OFF]]     |
    * | [[BackgroundGeolocation.LOG_LEVEL_ERROR]]   |
    * | [[BackgroundGeolocation.LOG_LEVEL_WARNING]] |
    * | [[BackgroundGeolocation.LOG_LEVEL_INFO]]    |
    * | [[BackgroundGeolocation.LOG_LEVEL_DEBUG]]   |
    * | [[BackgroundGeolocation.LOG_LEVEL_VERBOSE]] |
    *
    * @break
    *
    * ### Example log data:
    *
    *```
    * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
    * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
    * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
    * 09-19 11:12:18.723 [c.t.l.BackgroundGeolocationService d]
    * 09-19 11:12:18.723   ✅  Started in foreground
    * 09-19 11:12:18.737 [c.t.l.ActivityRecognitionService a]
    * 09-19 11:12:18.737   🎾  Start activity updates: 10000
    * 09-19 11:12:18.761 [c.t.l.BackgroundGeolocationService k]
    * 09-19 11:12:18.761   🔴  Stop heartbeat
    * 09-19 11:12:18.768 [c.t.l.BackgroundGeolocationService a]
    * 09-19 11:12:18.768   🎾  Start heartbeat (60)
    * 09-19 11:12:18.778 [c.t.l.BackgroundGeolocationService a]
    * 09-19 11:12:18.778   🔵  setPace: null → false
    * 09-19 11:12:18.781 [c.t.l.adapter.TSConfig c] ℹ️   Persist config
    * 09-19 11:12:18.794 [c.t.locationmanager.util.b a]
    * 09-19 11:12:18.794   ℹ️  LocationAuthorization: Permission granted
    * 09-19 11:12:18.842 [c.t.l.http.HttpService flush]
    * 09-19 11:12:18.842 ╔═════════════════════════════════════════════
    * 09-19 11:12:18.842 ║ HTTP Service
    * 09-19 11:12:18.842 ╠═════════════════════════════════════════════
    * 09-19 11:12:19.000 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
    * 09-19 11:12:21.314 [c.t.l.l.SingleLocationRequest$2 onLocationResult]
    * 09-19 11:12:21.314 ╔═════════════════════════════════════════════
    * 09-19 11:12:21.314 ║ SingleLocationRequest: 1
    * 09-19 11:12:21.314 ╠═════════════════════════════════════════════
    * 09-19 11:12:21.314 ╟─ 📍  Location[fused 45.519239,-73.617058 hAcc=15]999923706055 vAcc=2 sAcc=??? bAcc=???
    * 09-19 11:12:21.327 [c.t.l.l.TSLocationManager onSingleLocationResult]
    * 09-19 11:12:21.327   🔵  Acquired motionchange position, isMoving: false
    * 09-19 11:12:21.342 [c.t.l.l.TSLocationManager a] 15.243
    * 09-19 11:12:21.405 [c.t.locationmanager.data.a.c persist]
    * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:21.423 [c.t.l.http.HttpService flush]
    * 09-19 11:12:21.423 ╔═════════════════════════════════════════════
    * 09-19 11:12:21.423 ║ HTTP Service
    * 09-19 11:12:21.423 ╠═════════════════════════════════════════════
    * 09-19 11:12:21.446 [c.t.locationmanager.data.a.c first]
    * 09-19 11:12:21.446   ✅  Locked 1 records
    * 09-19 11:12:21.454 [c.t.l.http.HttpService a]
    * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:22.083 [c.t.l.http.HttpService$a onResponse]
    * 09-19 11:12:22.083   🔵  Response: 200
    * 09-19 11:12:22.100 [c.t.locationmanager.data.a.c destroy]
    * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:55.226 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
    *```
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE
    * });
    * ```
    *
    * ### ℹ️ See also:
    * - [[BackgroundGeolocation.getLog]]
    * - [[BackgroundGeolocation.emailLog]]
    * - [[logMaxDays]]
    * - [[destroyLog]]
    *
    * ### ⚠️ Warning:
    * - When submitting your app to production, take care to configure the **`logLevel`** appropriately (eg: **[[BackgroundGeolocation.LOG_LEVEL_ERROR]]**) since the logs can grow to several megabytes over a period of [[logMaxDays]].
    */
    logLevel?: LogLevel;

    /**
    * Maximum number of days to persist a log-entry in database.
    * @break
    *
    * Defaults to **`3`** days.
    *
    *  **See also:**
    * - [[logLevel]]
    */
    logMaxDays?: number;

    /**
    * Controls whether the plugin should first reset the configuration when `#ready` is executed before applying the supplied config `{}`.
    *
    * Defaults to `true`.  The SDK can optionally re-apply its persisted configuration with each boot of your application, ignoring the config `{}`
    * supplied to the `#ready` method.
    *
    * @break
    *
    * Optionally, you can specify **`reset: false`** to [[BackgroundGeolocation.ready]].
    *
    * @example
  	* ```typescript
    * await BackgroundGeolocation.setConfig({
    *   distanceFilter: 100
    * });
    *
    * BackgroundGeolocation.ready({
    *   reset: false,  // <-- set false to ALWAYS re-apply persisted configuration, ignoring config provided to `#ready`
    *   distanceFilter: 50
    * }, (state) => {
    *   console.log("Ready with reset: false: ", state.distanceFilter);  // <-- 100, not 10
    * });
    * ```
    */
    reset?: boolean;

    /**
    * Set `true` in order to disable constant background-tracking.  Locations will be recorded only periodically.
    *
    * Defaults to `false`.  A location will be recorded only every `500` to `1000` meters (can be higher in non urban environments; depends upon the spacing of Cellular towers).  Many of the plugin's configuration parameters **will have no effect**, such as [[distanceFilter]], [[stationaryRadius]], [[activityType]], etc.
    *
    * Using `significantChangesOnly: true` will provide **significant** power-saving at the expense of fewer recorded locations.
    *
    * ### iOS
    *
    * Engages the iOS [Significant Location Changes API](https://developer.apple.com/reference/corelocation/cllocationmanager/1423531-startmonitoringsignificantlocati?language=objc) API for only periodic location updates every 500-1000 meters.
    * @break
    *
    * ⚠️ If Apple has rejected your application, refusing to grant your app the privilege of using the **`UIBackgroundMode: "location"`**, this can be a solution.
    *
    *
    * ### Android
    *
    * A location will be recorded several times per hour while the device is in the *moving* state.  No foreground-service will be run (nor its corresponding persistent [[Notification]]).
    *
    * @example **`useSignificantChangesOnly: true`**
    * ![](https://dl.dropboxusercontent.com/s/wdl9e156myv5b34/useSignificantChangesOnly.png?dl=1)
    *
    * @example **`useSignificantChangesOnly: false` (Default)**
    * ![](https://dl.dropboxusercontent.com/s/hcxby3sujqanv9q/useSignificantChangesOnly-false.png?dl=1)
    */
    useSignificantChangesOnly?: boolean;

    /**
    * __`[iOS only]`__ Configure iOS location API to *never* automatically turn off.
    * @break
    *
    * ### ⚠️ Warning:
    * - This option should generally be left `undefined`.  You should only specify this option if you know *exactly* what you're doing.
    *
    * The default behavior of the plugin is to turn **off** location-services *automatically* when the device is detected to be stationary for [[stopTimeout]] minutes.  When set to `false`, location-services will **never** be turned off (and [[disableStopDetection]] will automatically be set to `true`) &mdash; it's your responsibility to turn them off when you no longer need to track the device.  This feature should **not** generally be used.  [[preventSuspend]] will no longer work either.
    */
    pausesLocationUpdatesAutomatically?: boolean;

    /**
    * [__iOS Only__] A Boolean indicating whether the status bar changes its appearance when an app uses location services in the background with `Always` authorization.
    *
    * The default value of this property is `false`. The background location usage indicator is a blue bar or a blue pill in the status bar on iOS; on watchOS the indicator is a small icon. Users can tap the indicator to return to your app.
    *
    * This property affects only apps that received `Always` authorization. When such an app moves to the background, the system uses this property to determine whether to change the status bar appearance to indicate that location services are in use. Set this value to true to maintain transparency with the user.
    *
    * For apps with When In Use authorization, the system changes the appearance of the status bar when the app uses location services in the background.
    */
    showsBackgroundLocationIndicator?: boolean;
    /**
    * Defines the *desired* location-authorization request you *wish* for the user to authorize:
    * - __`Always`__
    * - __`WhenInUse`__
    * - __`Any`__
    *
    * @break
    *
    * **`locationAuthorizationRequest`** tells the plugin the mode it *expects* to have been authorized with *by the user*.  Defaults to __`Always`__.  If you _don't care_ what the user authorizes, you may configure __`locationAuthorizationRequest: "Any"`__.
    *
    * If you configure __`locationAuthorizationRequest: 'Always'`__ but the user authorizes only __`[When in Use]`__ , the plugin will detect this and show the [[locationAuthorizationAlert]] dialog (see [[disableLocationAuthorizationAlert]] to disable this behaviour).
    *
    * # iOS
    * ----------------------------------------------------------------
    *
    * iOS 13 introduced a significant modification to *location authorization* (See this [blog entry](https://medium.com/@transistorsoft/ios-13-and-android-q-support-beb7595d2c24)).  No longer will the __`[Always allow]`__ option appear on the initial authorization dialog.  Instead, iOS will prompt the user with a second "authorization upgrade" dialog, asking the user if they'd like to grant __`[Keep Only While Using ]`__ or __`[Change to Always Allow]`__.
    *
    * ### 1.  __`locationAuthorizationRequest: 'Always'`__:
    *
    * If your app requests __`locationAuthorizationRequest: 'Always'`__, the user must first authorize __`[Alow While Using App]`__, followed *immediately* by a second dialog prompting the user to upgrade location authorization with __`[Change to Always Allow]`__:
    *
    * ![](https://dl.dropbox.com/s/0alq10i4pcm2o9q/ios-when-in-use-to-always-CHANGELOG.gif?dl=1)
    *
    * If the user __denies__ __`Always`__ authorization, the [[locationAuthorizationAlert]] will be shown (see [[disableLocationAuthorizationAlert]] to disable this behaviour).
    *
    * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
    *
    * ### 2.  __`locationAuthorizationRequest: 'WhenInUse'`__:
    *
    * Only the initial dialog will be shown:
    *
    * ![](https://dl.dropbox.com/s/n38qehw3cjhzngy/ios13-location-authorization.png?dl=1)
    *
    * *However*, if your app *later* uses __`setConfig`__ to change __`locationAuthorizationRequest: 'Always'`__, iOS will *immediately* show the "authorization upgrade" dialog:
    *
    * ![](https://dl.dropbox.com/s/5syokc8rtrc9q35/ios13-location-authorization-upgrade-always.png?dl=1)
    *
    * ### 3.  __`locationAuthorizationRequest: 'Any'`__:
    *
    * The SDK will request `Always` authorization.  The initial location authorization dialog will be shown:
    *
    * ![](https://dl.dropbox.com/s/n38qehw3cjhzngy/ios13-location-authorization.png?dl=1)
    *
    * However, at some *unknown time* in the future, iOS will prompt the user with the location authorization upgrade dialog:
    *
    * ![](https://dl.dropbox.com/s/5syokc8rtrc9q35/ios13-location-authorization-upgrade-always.png?dl=1)
    *
    * @example
    *
    * ```javascript
    * onAppLaunch() {
    *   // Initially configure for 'WhenInUse'.
    *   BackgroundGeolocation.ready({
    *     locationAuthorizationRequest: 'WhenInUse',
    *     .
    *     .
    *     .
    *   });
    * }
    *
    * async onClickStartTracking() {
    *   // Initial location authorization dialog for "When in Use" authotization
    *   // will be shown here.
    *   await BackgroundGeolocation.start();
    *   // some time later -- could be immediately after, hours later, days later, etc.,
    *   // you can upgrade the config to 'Always' whenever you wish:
    *   upgradeToAlwaysAllow();
    * }
    *
    * upgradeToAlwaysAllow() {
    *   // Simply update `locationAuthorizationRequest` to "Always" -- the SDK
    *   // will cause iOS to immediately show the authorization upgrade dialog
    *   // for "Change to Always Allow":
    *   BackgroundGeolocation.setConfig({
    *     locationAuthorizationRequest: 'Always'
    *   });
    * }
    * ```
    *
    * &nbsp;
    * # Android
    * ----------------------------------------------------------------
    *
    * ## Android 10
    *
    * Like iOS 12, Android 10 now forces your app to offer *both* __`[Allow all the time]`__ and __`[Allow only while using]`__ options.
    *
    * ![](https://dl.dropbox.com/s/jv3g2sgap69qhfx/android-10-location-authorization-dialog.png?dl=1)
    *
    *
    * ## Android 11+ (with `targetSdkVersion 30+`)
    *
    * Just as in iOS 13/14, Android 11 has [changed location authorization](https://developer.android.com/preview/privacy/location) and no longer offers the __`[Allow all the time]`__ button on the location authorization dialog.  Instead, Android now offers a hook to present a custom dialog to the user where you will explain exactly why you require _"Allow all the time"_ location permission.
    *
    * This dialog can forward the user directly to your application's __Location Permissions__ screen, where the user must *explicity* authorize __`[Allow all the time]`__.  The Background Geolocation SDK will present this dialog, which can be customized with [[Config.backgroundPermissionRationale]].
    * - Android will offer the [[Config.backgroundPermissionRationale]] dialog __just once__.  Once the user presses the `positiveAction` on the dialog, it will __not__ be shown again (pressing `[Cancel]` button does not count).
    * - If the user resets your application's _Location Permissions_ to __`[Ask every time]`__, the [[Config.backgroundPermissionRationale]] _can_ be shown once again.

    * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
    * ![](https://dl.dropbox.com/s/dy65k8b0sgj5cgy/android11-location-authorization-upgrade-settings.png?dl=1)
    *
    * ```typescript
    * BackgroundGeolocation.ready({
    *  locationAuthorizationRequest: 'Always',
    *  backgroundPermissionRationale: {
    *   title: "Allow access to this device's location in the background?",
    *   message: "In order to allow X, Y and Z, please enable 'Allow all the time permission",
    *   positiveAction: "Change to Allow all the time"
    *  }
    * });
    * ```
    *
    *
    * ### 1.  __`locationAuthorizationRequest: 'Always'`__:
    *
    * If your app requests __`locationAuthorizationRequest: 'Always'`__, the user must first authorize __`[While using the app]`__, followed *immediately* by the [[Config.backgroundPermissionRationale]] dialog prompting the user to upgrade location permission with __`[Allow all the time]`__:
    *
    * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
    *
    * ### 2.  __`locationAuthorizationRequest: 'WhenInUse'`__:
    *
    * Only the initial dialog will be shown:
    *
    * ![](https://dl.dropbox.com/s/ymybwme7fvda0ii/android11-location-when-in-use-system-dialog.png?dl=1)
    *
    * *However*, if your app *later* uses __`setConfig`__ to change __`locationAuthorizationRequest: 'Always'`__, the SDK will *immediately* show the [[Config.backgroundPermissionRationale]] dialog:
    *
    * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
    *
    * ### 3.  __`locationAuthorizationRequest: 'Any'`__:
    *
    * Same as __`Always`__
    *
    * ## Android 11+ (with `targetSdkVersion <=29`)
    *
    * Just to add a bit more confusion, for Android 11+ devices and your app built with __`targetSdkVersion 29`__, Android will present an extra dialog after the user clicks through on the [[Config.backgroundPermissionRationale]] dialog, where the user is prompted with a link _"Allow in Settings"*, rather than forwarding them directly to the _Location Permissions_ screen, as with __`targetSdkVersion 30+`__:
    *
    * ![](https://dl.dropbox.com/s/mp3zykohr95wafq/android11-location-authorization-upgrade.png?dl=1)
    *
    * ![](https://dl.dropbox.com/s/a01e0c6750bqylr/android11-location-authorization-cordova-targetSdkVersion29.gif?dl=1)
    *
    */
    locationAuthorizationRequest?: LocationAuthorizationRequest;

    /**
    * __`[iOS only]`__ Controls the text-elements of the plugin's location-authorization dialog.
    * @break
    *
    * When you configure the plugin [[locationAuthorizationRequest]] __`Always`__ or __`WhenInUse`__ and the user *changes* the mode in the app's location-services settings or disabled location-services, the plugin will display an Alert dialog directing the user to the **Settings** screen.  **`locationAuthorizationAlert`** allows you to configure all the Strings for that Alert popup and accepts an `{}` containing the following keys:
    *
    * ![](https://dl.dropboxusercontent.com/s/wyoaf16buwsw7ed/docs-locationAuthorizationAlert.jpg?dl=1)
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   locationAuthorizationAlert: {
    *     titleWhenNotEnabled: "Yo, location-services not enabled",
    *     titleWhenOff: "Yo, location-services OFF",
    *     instructions: "You must enable 'Always' in location-services, buddy",
    *     cancelButton: "Cancel",
    *     settingsButton: "Settings"
    *   }
    * })
    * ```
    *
    * ### ⚠️ Warning:
    * - If you choose to configure `locationAuthorizationAlert`, you must provide **ALL** the keys of [[LocationAuthorizationAlert]] keys &mdash; not just *some*.
    */
    locationAuthorizationAlert?: LocationAuthorizationAlert;

    /**
    * Disables automatic authorization alert when plugin detects the user has disabled location authorization.
    * @break
    *
    * You will be responsible for handling disabled location authorization by listening to the [[BackgroundGeolocation.onProviderChange]] event.
    *
    * By default, the plugin automatically shows a native alert to the user when location-services are disabled, directing them to the settings screen.  If you **do not** desire this automated behavior, set `disableLocationAuthorizationAlert: true`.
    *
    * ## iOS
    *
    * The iOS alert dialog text elements can be configured via [[locationAuthorizationAlert]] and [[locationAuthorizationRequest]].
    *
    * ![](https://dl.dropbox.com/s/wk66ave2mzq6m6a/ios-locationAuthorizationAlert.jpg?dl=1)
    *
    * ## Android
    *
    * Android can detect when the user has configured the device's *Settings->Location* in a manner that does not match your location request (eg: [[desiredAccuracy]].  For example, if the user configures *Settings->Location->Mode* with *Battery Saving* (ie: Wifi only) but you've specifically requested [[DESIRED_ACCURACY_HIGH]] (ie: GPS), Android will show a dialog asking the user to confirm the desired changes.  If the user clicks `[OK]`, the OS will automcatically modify the Device settings.
    *
    * ![](https://www.dropbox.com/s/3kuw1gzzbnajhgf/android-location-resolution-dialog.png?dl=1)
    *
    * This automated Android dialog will be shown in the following cases:
    * - [[BackgroundGeolocation.onProviderChange]]
    * - [[BackgroundGeolocation.start]]
    * - [[BackgroundGeolocation.requestPermission]]
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.onProviderChange((event) => {
    *   console.log("[onProviderChange] ", event);
    *
    *   if (!provider.enabled) {
    *     alert("Please enable location services");
    *   }
    * });
    *
    * BackgroundGeolocation.ready({
    *   disableLocationAuthorizationAlert: true
    * });
    * ```
    */
    disableLocationAuthorizationAlert?: boolean;

    /**
    * __`[iOS only]`__ Presumably, this affects iOS stop-detect algorithm.  Apple is vague about what exactly this option does.
    *
    * Available values are defined as constants upon the [[BackgroundGeolocation]] class.
    *
    * | Name                                                           |
    * |----------------------------------------------------------------|
    * | [[BackgroundGeolocation.ACTIVITY_TYPE_OTHER]]                  |
    * | [[BackgroundGeolocation.ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION]]  |
    * | [[BackgroundGeolocation.ACTIVITY_TYPE_FITNESS]]                |
    * | [[BackgroundGeolocation.ACTIVITY_TYPE_OTHER_NAVIGATION]]       |
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   activityType: BackgroundGeolocation.ACTIVITY_TYPE_OTHER
    * );
    * ```
    *
    * ### ℹ️ See also:
    * - [Apple docs](https://developer.apple.com/reference/corelocation/cllocationmanager/1620567-activitytype?language=objc).
    *
    */
    activityType?: ActivityType;

    /**
    * __`[iOS only]`__ Allows the iOS stop-detection system to be delayed from activating.
    * @break
    *
    * Defaults to **`0`** (no delay).  Allows the stop-detection system to be delayed from activating.  When the stop-detection system *is* engaged, location-services will be temporarily turned **off** and only the accelerometer is monitored.  Stop-detection will only engage if this timer expires.  The timer is cancelled if any movement is detected before expiration.  If a value of **`0`** is specified, the stop-detection system will engage as soon as the device is detected to be stationary.
    *
    * You can experience the iOS stop-detection system at work by configuring [[debug]] __`true`__.  After the device stops moving (stopped at a traffic light, for example), the plugin will emit a *Lullabye* sound-effect and local-notifications about "Location-services: OFF / ON".
    *
    * #### iOS Stop-detection timing
    *
    * ![](https://dl.dropboxusercontent.com/s/ojjdfkmua15pskh/ios-stop-detection-timing.png?dl=1)
    */
    stopDetectionDelay?: number;

    /**
    * Disable the plugin requesting "Motion & Fitness" (ios) or "Physical Activity" (android >= 10) authorization from the User.
    * @break
    *
    * Defaults to **`false`**.  Set to **`true`** to disable asking the user for this permission.
    *
    * ## iOS
    *
    * ![](https://dl.dropbox.com/s/v3qt7ry1k4b3iir/ios-motion-permission.png?dl=1)
    *
    * The plugin is **HIGHLY** optimized for motion-activity-updates.  If you **do** disable this, the plugin *will* drain more battery power.  You are **STRONGLY** advised against disabling this.  You should explain to your users with an appropriate `NSMotionUsageDescription` in your `Info.plist` file, for example:
    * > "Motion activity detection increases battery efficiency by intelligently toggling location-tracking" off when your device is detected to be stationary.
    *
    * ## Android
    *
    * Android 10+ now requires run-time permission from the user for "Physical Activity".
    * ![](https://dl.dropbox.com/s/6v4391oz592bdjg/android-permission-physical-activity.png?dl=1)
    *
    * Traditionally, the `background-geolocation` Android SDK has relied heavily upon the Motion API for determining when to toggle location-services on/off based upon whether the device is *moving* vs *stationary*.
    * However, the Android SDK has a fallback "stationary geofence" mechanism just like iOS, the exit of which will cause the plugin to change to the *moving* state, toggle location-services and begin tracking.  This will, of course, require the device moves a distance of typically **200-500 meters** before tracking engages.  With the Motion API authorized, the Android SDK typically requires just **a few meters** of movement for tracking to engage.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   disableMotionActivityUpdates: true
    * });
    * ```
    */
    disableMotionActivityUpdates?: boolean;

    /**
    * __`[iOS only]`__ Prevent iOS from suspending your application in the background after location-services have been switched off.
    * @break
    *
    * Defaults to **`false`**.  Set **`true`** to prevent **iOS** from suspending your application after location-services have been switched off while running in the background.  Must be used in conjunction with a [[heartbeatInterval]].
    * ### ⚠️ Warning:
    * - __`preventSuspend: true`__ should **only** be used in **very** specific use-cases and should typically **not** be used as it *will* have a **very noticeable impact on battery performance.**  You should carefully manage **`preventSuspend`**, engaging it for controlled periods-of-time.  You should **not** expect to run your app in this mode 24 hours / day, 7 days-a-week.
    * - When a device is unplugged form power with the screen off, iOS will *still* throttle [[BackgroundGeolocation.onHeartbeat]] events about 2 minutes after entering the background state.  However, if the screen is lit up or even the *slightest* device-motion is detected, [[BackgroundGeolocation.onHeartbeat]] events will immediately resume.
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.onHeartbeat((event) => {
    *   console.log("[onHeartbeat] ", event);
    * });
    *
    * BackgroundGeolocation.ready({
    *   preventSuspend: true,
    *   heartbeatInterval: 60
    * });
    * ```
    *
    * ### ℹ️ See also:
    * - [[heartbeatInterval]]
    * - [[BackgroundGeolocation.onHeartbeat]]
    */
    preventSuspend?: boolean;

    /**
    * __`[Android only]`__ Set the desired interval for active location updates, in milliseconds.
    * @break
    *
    * ### ⚠️ Note:
    * - To use **`locationUpdateInterval`** you **must** also configure [[distanceFilter]] __`0`__, since [[distanceFilter]] *overrides* **`locationUpdateInterval`**.
    *
    * Set the desired interval for active location updates, in milliseconds.
    *
    * The location client will actively try to obtain location updates for your application at this interval, so it has a direct influence on the amount of power used by your application. Choose your interval wisely.
    *
    * This interval is inexact. You may not receive updates at all (if no location sources are available), or you may receive them slower than requested. You may also receive them faster than requested (if other applications are requesting location at a faster interval).
    *
    * Applications with only the coarse location permission may have their interval silently throttled.\
    *
    * @example
  	* ```typescript
    * BackgroundGeolocation.ready({
    *   distanceFilter: 0,            // Must be 0 or locationUpdateInterval is ignored!
    *   locationUpdateInterval: 5000  // Get a location every 5 seconds
    * });
    * ```
    * ### ℹ️ See also:
    * - For more information, see the [Android docs](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setInterval(long))
    *
    */
    locationUpdateInterval?: number;

    /**
    * __`[Android only]`__ Explicitly set the fastest interval for location updates, in milliseconds.
    * @break
    *
    * This controls the fastest rate at which your application will receive location updates, which might be faster than [[locationUpdateInterval]] in some situations (for example, if other applications are triggering location updates).
    *
    * This allows your application to passively acquire locations at a rate faster than it actively acquires locations, saving power.
    *
    * Unlike [[locationUpdateInterval]], this parameter is exact. Your application will never receive updates faster than this value.
    *
    * If you don't call this method, a fastest interval will be set to **30000 (30s)**.
    *
    * An interval of `0` is allowed, but **not recommended**, since location updates may be extremely fast on future implementations.
    *
    * If **`fastestLocationUpdateInterval`** is set slower than [[locationUpdateInterval]], then your effective fastest interval is [[locationUpdateInterval]].
    *
    * ### ℹ️ See also:
    * - [Android docs](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#setFastestInterval(long))
    */
    fastestLocationUpdateInterval?: number;

    /**
    * __`[Android only]`__ Sets the maximum wait time in milliseconds for location updates.
    *
    * Defaults to `0` (no defer).  If you pass a value at least 2x larger than the interval specified with [[locationUpdateInterval]], then location delivery may be delayed and multiple locations can be delivered at once. Locations are determined at the [[locationUpdateInterval]] rate, but can be delivered in batch after the interval you set in this method. This **can consume less battery** and **give more accurate locations**, depending on the device's hardware capabilities. You should set this value to be as large as possible for your needs if you don't need immediate location delivery.
    */
    deferTime?: number;

    /**
    * __`[Android only]`__ Allow recording locations which are duplicates of the previous.
    * @break
    *
    * By default, the Android plugin will ignore a received location when it is *identical* to the previous location.  Set `true` to override this behavior and record *every* location, regardless if it is identical to the last location.
    *
    * In the logs, you will see a location being ignored:
    * ```
    * TSLocationManager:   ℹ️  IGNORED: same as last location
    * ```
    *
    * An identical location is often generated when changing state from *stationary* -> *moving*, where a single location is first requested (the [[BackgroundGeolocation.onMotionChange]] location) before turning on regular location updates.  Changing geolocation config params can also generate a duplicate location (eg: changing [[distanceFilter]]).
    */
    allowIdenticalLocations?: boolean;

    /**
    * __`[Android-only]`__ Enable extra timestamp meta data to be appended to each recorded location, including system-time.
    * @break
    *
    * Some developers have reported GPS [[Location.timestamp]] issues with some Android devices.  This option will append extra meta-data related to the device's system time.
    *
    * ### Java implementation
    *
    * ```Java
    * if (enableTimestampMeta) {
    *     JSONObject timestampMeta = new JSONObject();
    *     timestampMeta.put("time", mLocation.getTime());
    *     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
    *         timestampMeta.put("systemClockElaspsedRealtime", SystemClock.elapsedRealtimeNanos()/1000000);
    *         timestampMeta.put("elapsedRealtime", mLocation.getElapsedRealtimeNanos()/1000000);
    *     } else {
    *         timestampMeta.put("systemTime", System.currentTimeMillis());
    *     }
    *     data.put("timestampMeta", timestampMeta);
    * }
    * ```
    */
    enableTimestampMeta?: boolean;

    /**
    * __`Android-only`__ Experimental filter to ignore anomalous locations that suddenly jump an unusual distance from last.
    * The SDK will calculate an apparent speed and distance relative to last known location.  If the location suddenly
    * teleports from last location, it will be ignored.
    *
    * The measurement is in meters/second.  The default is to throw away any location which apparently moved at 300 meters/second from last known location.
    */
    speedJumpFilter?: number;

    /**

    * __`[Android-only]`__ Configures a comma-separated list of motion-activities which are allow to trigger location-tracking.
    * @break
    *
    * These are the comma-delimited list of [activity-names](https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity) returned by the `ActivityRecognition` API which will trigger a state-change from **stationary** to **moving**.  By default, the plugin will trigger on **any** of the **moving-states**:
    *
    * | Activity Name  |
    * |----------------|
    * | `in_vehicle`   |
    * | `on_bicycle`   |
    * | `on_foot`      |
    * | `running`      |
    * | `walking`      |
    *
    *
    * If you wish, you can configure the plugin to only engage the **moving** state for vehicles-only by providing just `"in_vehicle"`, for example.
    *
    *
    * @example
  	* ```typescript
    * // Only trigger tracking for vehicles
    * BackgroundGeolocation.ready({
    *   triggerActivities: "in_vehicle"
    * );
    *
    * // Only trigger tracking for on_foot, walking and running
    * BackgroundGeolocation.ready({
    *   triggerActivities: "on_foot, walking, running"
    * );
    * ```
    */
    triggerActivities?: string;

    /**
    * __`[Android only]`__  Optionally add a delay in milliseconds to trigger Android into the *moving* state when Motion API reports the device is moving (eg: `on_foot`, `in_vehicle`)
    *
    * This can help prevent false-positive motion-triggering when one moves about their home, for example.  Only if the Motion API stays in the *moving* state for `motionTriggerDelay` milliseconds will the plugin trigger into the *moving* state and begin tracking the location.
    * If the Motion API returns to the `still` state before `motionTriggerDelay` times-out, the trigger to the *moving* state will be cancelled.
    *
    * @example
    * ```typescript
    * // Delay Android motion-triggering by 30000ms
    * BackgroundGeolocation.ready({
    *   motionTriggerDelay: 30000
    * })
    * ```
    * @break
    * The following `logcat` shows an Android device detecting motion __`on_foot`__ but returning to __`still`__ before __`motionTriggerDelay`__ expires, cancelling the transition to the *moving* state (see `⏰ Cancel OneShot: MOTION_TRIGGER_DELAY`):
    * @logcat
    * ```bash
    *  04-08 10:58:03.419 TSLocationManager: ╔═════════════════════════════════════════════
    *  04-08 10:58:03.419 TSLocationManager: ║ Motion Transition Result
    *  04-08 10:58:03.419 TSLocationManager: ╠═════════════════════════════════════════════
    *  04-08 10:58:03.419 TSLocationManager: ╟─ 🔴  EXIT: still
    *  04-08 10:58:03.419 TSLocationManager: ╟─ 🎾  ENTER: on_foot
    *  04-08 10:58:03.419 TSLocationManager: ╚═════════════════════════════════════════════
    *  04-08 10:58:03.416 TSLocationManager:   ⏰ Scheduled OneShot: MOTION_TRIGGER_DELAY in 30000ms
    *  .
    *  . <motionTriggerDelay timer started>
    *  .
    *  04-08 10:58:19.385 TSLocationManager: ╔═════════════════════════════════════════════
    *  04-08 10:58:19.385 TSLocationManager: ║ Motion Transition Result
    *  04-08 10:58:19.385 TSLocationManager: ╠═════════════════════════════════════════════
    *  04-08 10:58:19.385 TSLocationManager: ╟─ 🔴  EXIT: on_foot
    *  04-08 10:58:19.385 TSLocationManager: ╟─ 🎾  ENTER: still
    *  04-08 10:58:19.385 TSLocationManager: ╚═════════════════════════════════════════════
    *  04-08 10:58:19.381 TSLocationManager: [c.t.l.s.TSScheduleManager cancelOneShot]
    *  04-08 10:58:19.381 TSLocationManager:   ⏰ Cancel OneShot: MOTION_TRIGGER_DELAY <-- timer cancelled
    * ```
    */
    motionTriggerDelay?: number;

    /**
    * __`[Android only]`__ Enables "Headless" operation allowing you to respond to events after you app has been terminated with [[stopOnTerminate]] __`false`__.
    * @break
    *
    * Defaults to __`false`__.  In this Android terminated state, where only the plugin's foreground-service remains running, you can respond to all the plugin's events with your own callback.
    *
    * ### ℹ️ Note:
    * - Requires [[stopOnTerminate]] __`false`__.
    * - If you've configured [[stopOnTerminate]] __`false`__, [[BackgroundGeolocation]] will continue to record locations (and post them to your configured [[url]]) *regardless of* __`enabledHeadless: true`__.  You should enable this option *only if* you wish to perform some custom work during the headless state (for example, posting a local notification).
    * - For more information, see the Wiki [Android Headless Mode](github:wiki/Android-Headless-Mode).
    *
    */
    enableHeadless?: boolean;

    /**
    * __`[Android only]`__ Configure the plugin service to run as a more robust "Foreground Service".
    * @break
    *
    * ### ⚠️ Android 8.0+
    *
    * Defaults to `true` and cannot be set to `false`.  Due to strict new [Background Execution Limits](https://www.youtube.com/watch?v=Pumf_4yjTMc) in Android 8, the plugin *enforces* **`foregroundService: true`**.
    *
    * A persistent [[Notification]] is required by the operating-system with a foreground-service.  It **cannot** be hidden.
    *
    * ### Android < 8.0
    *
    * Defaults to **`false`**.  When the Android OS is under memory pressure from other applications (eg: a phone call), the OS can and will free up memory by terminating other processes and scheduling them for re-launch when memory becomes available.  If you find your tracking being **terminated unexpectedly**, *this* is why.
    *
    * If you set this option to **`true`**, the plugin will run its Android service in the foreground, **supplying the ongoing [[Notification]]  to be shown to the user while in this state**.  Running as a foreground-service makes the tracking-service **much** more immune to OS killing it due to memory/battery pressure.  By default services are background, meaning that if the system needs to kill them to reclaim more memory (such as to display a large page in a web browser).
    *
    * ### ℹ️ See also:
    * - [[Notification]]
    * - 📘 For more information, see the [Android Service](https://developer.android.com/reference/android/app/Service.html#startForeground(int,%20android.app.Notification)) docs.
    */
    foregroundService?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a [[BackgroundGeolocation.onLocation]] event.
    * @break
    *
    * When the user terminates your Android app with [[BackgroundGeolocation]] configured with [[stopOnTerminate]] __`false`__, the foreground `MainActivity` (where your Javascript app lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnLocationChange?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a [[BackgroundGeolocation.onMotionChange]] event.
    * @break
    *
    * When the user terminates your Android app with [[BackgroundGeolocation]] configured with [[stopOnTerminate]] __`false`__, the foreground `MainActivity` (where your Javascript app lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnMotionChange?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a [[BackgroundGeolocation.onGeofence]] event.
    * @break
    *
    * When the user terminates your Android app with [[BackgroundGeolocation]] configured with [[stopOnTerminate]] __`false`__, the foreground `MainActivity` (where your Javascript app lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnGeofence?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a device reboot or application update.
    * @break
    *
    * When the user reboots their device with [[BackgroundGeolocation]] configured with [[startOnBoot]] __`true`__, only the plugin's pure native background-service begins running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnBoot?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a [[BackgroundGeolocation.onHeartbeat]] event.
    * @break
    *
    * When the user terminates your Android app with [[BackgroundGeolocation]] configured with [[stopOnTerminate]] __`false`__, the foreground `MainActivity` (where your application code lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnHeartbeat?: boolean;

    /**
    * @deprecated __Banned in Android 10.  Use [[Config.enableHeadless]] instead.__
    *
    * Force launch your terminated App after a [[BackgroundGeolocation.onSchedule]] event.
    * @break
    *
    * When the user terminates your Android app with [[BackgroundGeolocation]] configured with [[stopOnTerminate]] __`false`__, the foreground `MainActivity` (where your Javascript app lives) *will* terminate &mdash; only the plugin's pure native background-service is running, **"headless"**, in this case.  The background service will continue tracking the location.  However, the background service *can* optionally **re-launch** your foreground application.
    *
    * ### ⚠️ Warning:
    * - When the background service re-launches your application, it will *briefly* appear in the foreground before *immediately* minimizing.  If the user has their phone on at the time, they will see a brief flash of your app appearing and minimizing.
    */
    forceReloadOnSchedule?: boolean;

    /**
    * (__Android 11+__) Configure the dialog presented to the user when *Always* location permission is requested.
    *
    * Just as in iOS 13/14, Android 11 has [changed location authorization](https://developer.android.com/preview/privacy/location) and no longer offers the __`[Allow all the time]`__ button on the location authorization dialog.  Instead, Android now offers a hook to present a custom dialog to the user where you will explain exactly why you require _"Allow all the time"_ location permission.
    *
    * This dialog can forward the user directly to your application's __Location Permissions__ screen, where the user must *explicity* authorize __`[Allow all the time]`__.  The Background Geolocation SDK will present this dialog, which can be customized with [[backgroundPermissionRationale]].
    *
    * ![](https://dl.dropbox.com/s/343nbrzpaavfser/android11-location-authorization-rn.gif?dl=1)
    *
    * - Android will offer the [[backgroundPermissionRationale]] dialog __just once__.  Once the user presses the `positiveAction` on the dialog, it will __not__ be shown again (pressing `[Cancel]` button does not count).
    * - If the user resets your application's _Location Permissions_ to __`[Ask every time]`__, the [[backgroundPermissionRationale]] _can_ be shown once again.
    *
    * ![](https://dl.dropbox.com/s/4fq4erz2lpqz00m/android11-location-permission-rationale-dialog.png?dl=1)
    * ![](https://dl.dropbox.com/s/dy65k8b0sgj5cgy/android11-location-authorization-upgrade-settings.png?dl=1)
    *
    * @example
    * ```javascript
    * BackgroundGeolocation.ready({
    *  locationAuthorizationRequest: 'Always',
    *  backgroundPermissionRationale: {
    *    title: "Allow {applicationName} to access to this device's location in the background?",
    *    message: "In order to track your activity in the background, please enable {backgroundPermissionOptionLabel} location permission",
    *    positiveAction: "Change to {backgroundPermissionOptionLabel}",
    *    negativeAction: "Cancel"
    *  }
    * });
    * ```
    *
    * ## Template Tags
    *
    * A limited number of template-tags are supported in each of the attributes, by wrapping with __`{tagName}`__:
    *
    * | Template Tag                            | Default value         | Description                                                            |
    * |-----------------------------------------|-----------------------|------------------------------------------------------------------------|
    * | __`{backgroundPermissionOptionLabel}`__ | *Allow all the time*  | (*API Level 30*) Gets the localized label that corresponds to the option in settings for granting background access. |
    * | __`{applicationName}`__                 | *Your App Name*       | Returns the localized name of your application from `AndroidManifest` |
    *
    * &nbsp;
    *
    * __See also:__
    * - [[locationAuthorizationRequest]]
    * - [[BackgroundGeolocation.requestPermission]]
    * - [Location udpates in Android 11](https://developer.android.com/about/versions/11/privacy/location)
    *
    *
    */
    backgroundPermissionRationale?: PermissionRationale;

    /**
    * [__Android only]__ Configures the persistent foreground-service [[Notification]] required by Android.
    *
    * ![](https://dl.dropbox.com/s/acuhy5cu4p7uofr/android-foreground-service-default.png?dl=1)
    *
    * See [[Notification]] for detailed usage.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.ready({
    *   notification: {
    *     title: "Background tracking engaged",
    *     text: "My notification text"
    *   }
    * })
    * ```
    */
    notification?: Notification;

    /**
    * ⚠️ DEPRECATED [[Notification.priority]]
    * @deprecated
    */
    notificationPriority?: NotificationPriority;

    /**
    * ⚠️ DEPRECATED:  Use [[Notification.title]]
    * @deprecated
    */
    notificationTitle?: string;

    /**
    * ⚠️ DEPRECATED:  Use [[Notification.text]]
    * @deprecated
    */
    notificationText?: string;

    /**
    * ⚠️ DEPRECATED:  Use [[Notification.color]]
    * @deprecated
    */
    notificationColor?: string;

    /**
    * ⚠️ DEPRECATED:  Use [[Notification.smallIcon]]
    * @deprecated
    */
    notificationSmallIcon?: string;

    /**
    * ⚠️ DEPRECATED:  [[Notification.largeIcon]]
    * @deprecated
    */
    notificationLargeIcon?: string;

    /**
    * ⚠️ DEPRECATED:  [[Notification.channelName]]
    * @deprecated
    */
    notificationChannelName?: string;
  }
}
