declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onGeofence]] when a geofence transition event occurs.
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onGeofence(geofenceEvent => {
  *   console.log("[geofence] ", geofenceEvent.identifier, geofence.action, geofenceEvent.location);
  * });
  * ```
  */
  interface GeofenceEvent {
    /**
     * The device system time when the Geofence event was received by the OS.
     * __Note__: this can differ from the timestamp of the triggering location responsible for the geofence (the triggering location can be from the past).
     */
    timestamp: string;
    /**
    * The identifier of the geofence which fired.
    */
    identifier: string;
    /**
    * The transition type: `ENTER`, `EXIT`, `DWELL`
    */
    action: string;
    /**
    * The [[Location]] where the geofence transition occurred.
    */
    location: Location;
    /**
    * Optional [[Geofence.extras]]
    */
    extras?: Extras;
  }
}
