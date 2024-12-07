/// <reference path="../types.d.ts" />


declare module "react-native-background-geolocation" {
  /**
   * This is the event-object provided to Android headless-tasks registered via [[BackgroundGeolocation.registerHeadlessTask]].
   * 
   * @example
   * ```typescript
   * const BackgroundGeolocationHeadlessTask = async (event) => {
   *   const params = event.params;
   *   console.log("[BackgroundGeolocation HeadlessTask] -", event.name, params);
   *
   *   switch (event.name) {
   *     case "terminate":
   *       // Use await for async tasks
   *       const location = await BackgroundGeolocation.getCurrentPosition({
   *         samples: 1,
   *         persist: false
   *       });
   *       console.log("[BackgroundGeolocation HeadlessTask] - getCurrentPosition:", location);
   *       break;
   *   }
   *   // You must await all work you do in your task.  
   *   // Headless-tasks are automatically terminated after executing the last line of your function.
   *   await doWork();
   * }
   *
   * BackgroundGeolocation.registerHeadlessTask(BackgroundGeolocationHeadlessTask);
   * ```   
   * 
   * ### ℹ️ See also:
   * - 📘 [Android Headless Mode](github:wiki/Android-Headless-Mode).
   * - [[BackgroundGeolocation.registerHeadlessTask]]
   * - [[Config.enableHeadless]]
   * 
   */
  interface HeadlessEvent {    
    /**
     * BackgroundGeolocation event name (eg: `location`, `motionchange`, `terminate`, `http`, etc).
     */
    name: Event;
    /**
     * General event params according to the context of the event name.
     */
    params: Map;
  }
}

