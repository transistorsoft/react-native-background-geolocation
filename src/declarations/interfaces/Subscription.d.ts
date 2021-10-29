declare module "react-native-background-geolocation" {
  /**
  * Object returned by BackgroundGeolocation event-listeners.  `Subscription` contains just a single method [[remove]], used for removing an event-listener.
  *
  * - [[BackgroundGeolocation.onLocation]]
  * - [[BackgroundGeolocation.onMotionChange]]
  * - [[BackgroundGeolocation.onHttp]]
  * - [[BackgroundGeolocation.onHeartbeat]]
  * - [[BackgroundGeolocation.onProviderChange]]
  * - [[BackgroundGeolocation.onActivityChange]]
  * - [[BackgroundGeolocation.onGeofence]]
  * - [[BackgroundGeolocation.onGeofencesChange]]
  * - [[BackgroundGeolocation.onEnabledChange]]
  * - [[BackgroundGeolocation.onConnectivityChange]]
  * - [[BackgroundGeolocation.onSchedule]]
  * - [[BackgroundGeolocation.onPowerSaveChange]]
  * - [[BackgroundGeolocation.onNotificationAction]]
  * - [[BackgroundGeolocation.onAuthorization]]
  *
  * In the past, one would remove event-listeners using the __now-deprectated__ [[BackgroundGeolocation.removeListener]].
  *
  * ## Removing an event-listener:
  *
  * @example
  * ```typescript
  * // Event-listeners return a Subscription instance, containing a .remove() method.
  * const subscription = BackgroundGeolocation.onLocation(location => {
  *   console.log("[onLocation] ", location);
  * });
  * .
  * .
  * .
  * // Later, to remove the event-listener:
  * subscription.remove();
  * ```
  *
  * One might typically manage a collection of `Subscription` instances
  *
  * @example
  * ```typescript
  * import BackgroundGeolocation, {
  *   Location,
  *   Subscription
  * } from ...
  *
  * // Your custom Collection of Subscription instances.
  * const SUBSCRIPTIONS = [];
  *
  * // Your custom method to push a Subscription instance.
  * const subscribe = (subscription:Subscription) => {
  *   SUBSCRIPTIONS.push(subscription);
  * }
  *
  * // Your custom method to interate your SUBSCRIPTIONS and .remove each.
  * const unsubscribe = () => {
  *   SUBSCRIPTIONS.forEach((subscription:Subscription) => subscription.remove());
  * }
  *
  * const initBackgroundGeolocation = () {
  *   // Create event-listeners as usual, feeding the returned Subscription into
  *   // your custom  subscribe() method.
  *   subscribe(BackgroundGeolocation.onLocation((location:Location) => {
  *     console.log('[onLocation]', location);
  *   });
  *
  *   subscribe(BackgroundGeolocation.onMotionChange((location:Location) => {
  *     console.log('[onMotionChange]', location);
  *   });
  *
  *   subscribe(BackgroundGeolocation.onEnabledChange((enabled:boolean) => {
  *     console.log('[onEnabledChange]', enabled);
  *   });
  * }
  *
  * const onDestroyView = () => {
  *   // Call your custom unsubscribe method
  *   unsubscribe();
  * }
  *
  * ```
  */
  interface Subscription {
    /**
     * Removes a `BackgroundGeolocation` event-listener.
     * @example
     * ```typescript
     * // Event-listeners return a Subscription instance, containing a .remove() method.
     * const onLocationSubscription = BackgroundGeolocation.onLocation(location => {
     *   console.log("[onLocation] ", location);
     * });
     *
     * const onGeofenceSubscription = BackgroundGeolocation.onGeofence(event => {
     *   console.log("[onGeofence] ", event);
     * });
     * .
     * .
     * .
     * // Later, removing event-listeners.
     * onLocationSubscription.remove();
     * onGeofenceSubscription.remove();
     */
    remove():void;
  }
}