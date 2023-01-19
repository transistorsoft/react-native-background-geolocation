/// <reference path="../types.d.ts" />

declare module "react-native-background-geolocation" {
  /**
  * The event-object provided to [[BackgroundGeolocation.onActivityChange]].
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
    * | `unknown`      |
    */
    activity: MotionActivityType;
    /**
    * Confidence of the reported device motion activity in %.
    */
    confidence: number;
  }
}
