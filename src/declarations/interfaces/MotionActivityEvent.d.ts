declare module "react-native-background-geolocation" {
  
 /**
  * The detected device motion activity.
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
  type Activity = 'still' | 'on_foot' | 'walking' | 'running' | 'in_vehicle' | 'on_bicycle';
  
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
    type: Activity;
    /**
    * Confidence of the reported device motion activity in %.
    */
    confidence: number;
  }
}
