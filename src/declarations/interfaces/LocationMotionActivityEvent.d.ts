declare module "react-native-background-geolocation" {
  /**
   * Type of activity.
   */
  type LocationMotionActivityType =
    | "still"
    | "walking"
    | "on_foot"
    | "running"
    | "on_bicycle"
    | "in_vehicle";

  /**
   * The `activity` field which is part of the `Location` type that gets passed to [[BackgroundGeolocation.onLocation]].
   *
   * @example
   * ```typescript
   * BackgroundGeolocation.onLocatione(location => {
   *   console.log("[location] ", location.activity.type, location.activity.confidence);
   * });
   * ```
   */
  interface LocationMotionActivityEvent {
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
    type: LocationMotionActivityType;
    /**
     * Confidence of the reported device motion activity in %.
     */
    confidence: number;
  }
}
