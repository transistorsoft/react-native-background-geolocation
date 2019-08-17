/// <reference path="./Config.d.ts" />

declare module "react-native-background-geolocation" {
	/**
	* This `State` object contains all the provided [[Config]] options in addition to:
	* - [[enabled]].
	* - [[schedulerEnabled]].
	* - [[trackingMode]].
	* - [[odometer]].
	*/
  interface State extends Config {
  	/**
  	* `true` when the SDK has been enabled via methods [[start]] or [[startGeofences]].  When `false`, the
  	* SDK is completely __OFF__.  No tracking of any kind will occur.  The SDK will consume no energy.
  	*/
    enabled: boolean;
    /**
    * `true` when the SDK is currently configured with a [[schedule]] and [[startSchedule]] has been executed.
    * [[stopSchedule]] will set this to `false`.
    */
    schedulerEnabled: boolean;
    /**
    | Value      | Description                       |
  	|------------|-----------------------------------|
  	| __`0`__    | Monitoring geofences only         |
  	| __`1`__    | Monitoring location + geofences   |
    */
    trackingMode: TrackingMode;
    /**
    * The current distance-traveled.
    * ### ℹ️ See also:
    * - [[resetOdometer]], [[setOdometer]]
    * - [[getOdometer]]
    */
    odometer: number;
    /**
    * `true` when the iOS app was launched in the background.  Always `false` for Android.
    * iOS apps can be launched in the background due to a background-fetch event, geofence events or exiting the [[Config.stationaryRadius]].
    *
    * One might use this flag to choose to load only minimal resources until the iOS app is determined to have launched into the foreground.
    *
    */
    didLaunchInBackground: boolean;
  }
}
