declare module "react-native-background-geolocation" {
	/**
  * Options provided to [[BackgroundGeolocation.watchPosition]].
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.watchPosition((location) => {
	*   console.log("[watchPosition] -", location);
  * }, (errorCode) => {
	*   console.log("[watchPosition] ERROR -", errorCode);
  * }, {
	*   interval: 1000,
	*   desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
	*   persist: true,
	*   extras: {foo: "bar"},
	*   timeout: 60000
  * });
  * ```
  */
	interface WatchPositionRequest {
		/**
		* Location update interval in `milliseconds`.  Defaults to `1000`.
		*/
    interval?: number;
    /**
    * Specifies the accuracy required.  See [[Config.desiredAccuracy]].  Only [[BackgroundGeolocation.DESIRED_ACCURACY_HIGH]] uses GPS.
    * Defaults to [[DESIRED_ACCURACY_HIGH]].
    */
    desiredAccuracy?: LocationAccuracy;
    /**
    * Set `true` to persist each recorded location to the plugin's database.
    * Defaults to `true` when [[State.enabled]], `false` otherwise.
    */
    persist?: boolean;
    /**
    * Arbitrary key/values to append to each recorded location.
    */
    extras?: Extras;
    /**
    * Time in `milliseconds` to wait before firing error callback when location fails to arrive.
    * Defaults to `60000`.
    */
    timeout?: number;
  }
}
