declare module "react-native-background-geolocation" {
  /**
  * Used for selecting a range of records from the SDK"s database.
  * Used with the methods:
  * - [[Logger.getLog]]
  * - [[Logger.emailLog]]
  * - [[Logger.uploadLog]]
  *
  * ```typescript
  * // Constrain results between optionl start/end dates using a SQLQuery
  * let log = await BackgroundGeolocation.logger.getLog({
  *   start: Date.parse("2019-10-21 13:00"),  // <-- optional HH:mm:ss
  *   end: Date.parse("2019-10-22")
  * });
  *
  * // Or just a start date
  * let log = await BackgroundGeolocation.logger.getLog({
  *   start: Date.parse("2019-10-21 13:00")
  * });
  *
  * // Or just an end date
  * BackgroundGeolocation.logger.uploadLog("http://my.server.com/users/123/logs", {
  *   end: Date.parse("2019-10-21")
  * ));
  *
  * // Select first 100 records from log
  * let Logger = BackgroundGeolocation.logger;
  * Logger.emailLog("foo@bar.com", {
  *   order: Logger.ORDER_ASC,
  *   limit: 100
  * ));
  *
  * // Select most recent 100 records from log
  * let Logger = BackgroundGeolocation.logger;
  * Logger.emailLog("foo@bar.com", {
  *   order: Logger.ORDER_DESC,
  *   limit: 100
  * ));
  * ```
  */
  interface SQLQuery {
  	/**
  	* Start date of logs to select (unix timestamp)
  	*/
    start?:number;
    /**
    * End date of logs to select (unix timestamp)
    */
    end?:number;
    /**
    * Limit number of records returned.
    */
    limit?:number;
    /**
    * Order of results [[Logger.ORDER_ASC]] or [[Logger.ORDER_DESC]].
    * `1` = `ASC`; `-1` = `DESC`.
    */
    order?:SQLQueryOrder;
  }
}
