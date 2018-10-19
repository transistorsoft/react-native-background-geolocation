declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onHeartbeat]]
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onHeartbeat(heartbeatEvent => {
  *   console.log('[heartbeat] ', heartbeatEvent);
  * });
  * ```
  */
  interface HeartbeatEvent {
    location: Location;
  }
}
