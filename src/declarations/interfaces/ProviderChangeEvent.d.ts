declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onProviderChange]]
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onProviderChange(providerChangeEvent => {
  *   console.log("[providerchange] ", provider.enabled, provider.status, provider.network, provider.gps);
  * });
  * ```
  */
  interface ProviderChangeEvent {
    /**
    * `true` When device location-services are enabled.
    */
    enabled: boolean;
    /**
    * Authorization status of location-services.  For iOS, this will tell you if the user has enabled "Always" or "When in Use" authorization.
    *
    * | Name                                    | Platform      |
    * |-----------------------------------------|---------------|
    * | [[AUTHORIZATION_STATUS_NOT_DETERMINED]] | iOS only      |
    * | [[AUTHORIZATION_STATUS_RESTRICTED]]     | iOS only      |
    * | [[AUTHORIZATION_STATUS_DENIED]]         | iOS & Android |
    * | [[AUTHORIZATION_STATUS_ALWAYS]]         | iOS & Android |
    * | [[AUTHORIZATION_STATUS_WHEN_IN_USE]]    | iOS only      |
    *
    * ### ℹ️ Note:
    * - When Android location permission is **granted**, `status` == [[AUTHORIZATION_STATUS_ALWAYS]], otherwise [[AUTHORIZATION_STATUS_DENIED]].
    */
    status: AuthorizationStatus;
    /**
    * `true` if network geolocation provider is available.
    */
    network: boolean;
    /**
    * `true` if GPS geolocation provider is available.
    */
    gps: boolean;
  }
}
