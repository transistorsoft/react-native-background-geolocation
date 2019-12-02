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
