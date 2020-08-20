/// <reference path="../types.d.ts" />

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
    /**
    * __`[iOS 14+]`__ iOS 14 has introduced a new __`[Precise: On]`__ switch on the location authorization dialog allowing users to disable high-accuracy location.
    *
    * This attribute shows the state of that switch:
    * - Enabled:  [[BackgroundGeolocation.ACCURACY_AUTHORIZATION_FULL]].
    * - Disabled, [[BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED]].
    *
    * ![](https://dl.dropbox.com/s/dj93xpg51vspqk0/ios-14-precise-on.png?dl=1)
    *
    * @example
    *
    * ```javascript
    * BackgroundGeolocation.onProviderChange((event) => {
    *   let authorizationStatus = event.authorizationStatus;
    *   if (authorizationStatus == BackgroundGeolocation.ACCURACY_AUTHORIZATION_REDUCED) {
    *     // Supply "Purpose" key from Info.plist as 1st argument.
    *     BackgroundGeolocaiton.requestTemporaryFullAccuracy("Delivery").then((accuracyAuthorization) => {
    *       console.log("[requestTemporaryFullAccuracy]: ", accuracyAuthorization);
    *     }).catch((error) => {
    *       console.warn("[requestTemporaryFullAccuracy] ERROR:", error);
    *     });
    *   }
    * });
    * ```
    *
    * __See also:__
    * - [[BackgroundGeolocation.requestTemporaryFullAccuracy]]
    * - [What's new in iOS 14 `CoreLocation`](https://levelup.gitconnected.com/whats-new-with-corelocation-in-ios-14-bd28421c95c4)
    *
    */
    accuracyAuthorization: AccuracyAuthorization;
  }
}
