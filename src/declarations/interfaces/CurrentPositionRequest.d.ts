declare module "react-native-background-geolocation" {
  /**
  * Options provided to [[getCurrentPosition]].
  *
  * @example
  * ```typescript
  * let location = await BackgroundGeolocation.getCurrentPosition({
  *   timeout: 30,          // 30 second timeout to fetch location
  *   persist: true,        // Defaults to state.enabled
  *   maximumAge: 5000,     // Accept the last-known-location if not older than 5000 ms.
  *   desiredAccuracy: 10,  // Try to fetch a location with an accuracy of `10` meters.
  *   samples: 3,           // How many location samples to attempt.
  *   extras: {             // Custom meta-data.
  *     "route_id": 123
  *   }
  * });
  * ```
  */
  interface CurrentPositionRequest {
    /**
    * Sets the maximum number of location-samples to fetch before returning the best possible location to your `callback`.  Default is `3`.  Only the final Location will be persisted.
    */
    samples?: number;
    /**
    * Sets the desired accuracy of location you're attempting to fetch. When a location having `accuracy <= desiredAccuracy` is retrieved, the plugin will stop sampling and immediately return that location. Defaults to your configured [[Config.stationaryRadius]].
    */
    desiredAccuracy?: number;
    /**
    * Location-timeout in `seconds`.  Default: `30`.  If the timeout expires before a [[Location]] is retrieved, a [[LocationError]] will fire.
    */
    timeout?: number;
    /**
    * Defaults to `true` when plugin is `enabled`; `false`, otherwise.  Set `false` to disable persisting the retrieved Location in the plugin's SQLite database.
    */
    persist?: boolean;
    /**
    * Accept the last-recorded-location if no older than supplied value in `milliseconds`.  Default is `0`.
    */
    maximumAge?: number;
    /**
    * Optional meta-data to attach to the location. These `extras` will be merged to the configured [[Config.extras]] and persisted / POSTed to your server (if you've configured a [[Config.url]].
    */
    extras?: Extras;
  }
}
