declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onActivityChange]].  Also attached to each recorded [[Location]].
  *
  * @example
  * ```typescript
  * BackgroundGeolocation.onActivityChange(activityChangeEvent => {
  *   console.log("[activitychange] ", activityChangeEvent.activity, activityChangeEvent.confidence);
  * });
  * ```
  */
  interface MotionActivityEvent {
    /**
    * The reported device motion activity.
    *
    * | Activity Name  |
    * |----------------|
    * | `still`        |
    * | `walking`      |
    * | `on_foot`      |
    * | `running`      |
    * | `on_bicycle`   |
    * | `in_vehicle`   |
    */
    activity: string;
    /**
    * Confidence of the reported device motion activity in %.
    */
    confidence: number;
  }
}
