declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onHeartbeat]]
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onHeartbeat(heartbeatEvent => {
  *   console.log("[heartbeat] ", heartbeatEvent);
  * });
  * ```
  */
  interface HeartbeatEvent {
    /**
    * The last-known location.
    * ### ⚠️ Note:
    * - The *heartbeat* event does not actively engage location-services.  If you wish to get the current location in your `callback`, use [[getCurrentPosition]].
    */
    location: Location;
  }
}
