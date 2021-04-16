/// <reference path="../types.d.ts" />
/// <reference path="./SQLQuery.d.ts" />

declare module "react-native-background-geolocation" {
  /**
  * # Logger API
  *
  * The Background Geolocation SDK includes powerful logging features for debugging location-tracking problems.  The SDK stores log-entries for a period of [[Config.logMaxDays]] (default `3`).  The volume of logging events
  * inserted into the database is controlled via [[Config.logLevel]].
  *
  * For more information, see the 📘[Debugging Guide](github:wiki/Debugging).
  *
  * The `Logger` API is accessed via [[BackgroundGeolocation.logger]] property:
  *
  * @example
  * ```typescript
  * let Logger = BackgroundGeolocation.logger;
  * let log = await Logger.getLog();
  * ```
  *
  * ## Fetching the Logs:
  *
  * Logs can be fetched from the SDK in three ways:
  * 1.  [[getLog]]
  * 2.  [[emailLog]]
  * 3.  [[uploadLog]]
  *
  * ## Inserting your own log messages
  *
  * You can even insert your own log messages into the SDK's Log database using the following methods:
  *
  * | method       | logLevel | icon            |
  * |--------------|----------|-----------------|
  * |[[error]]     |`ERROR`   | ❗️              |
  * |[[warn]]      |`WARNING` | ⚠️              |
  * |[[debug]]     |`DEBUG`   | 🐞              |
  * |[[info]]      |`INFO`    | ℹ️              |
  * |[[notice]]    |`INFO`    | 🔵              |
  *
  * @example
  * ```typescript
  * let Logger = BackgroundGeolocation.logger;
  * BackgroundGeolocation.onLocation((location) => {
  *   Logger.debug("Location received in Javascript: " + location.uuid);
  * });
  * ```
  *
  * ## Example Logs
  * ```
  * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
  * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
  * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
  * 09-19 11:12:18.723 [c.t.l.BackgroundGeolocationService d]
  * 09-19 11:12:18.723   ✅  Started in foreground
  * 09-19 11:12:18.737 [c.t.l.ActivityRecognitionService a]
  * 09-19 11:12:18.737   🎾  Start activity updates: 10000
  * 09-19 11:12:18.761 [c.t.l.BackgroundGeolocationService k]
  * 09-19 11:12:18.761   🔴  Stop heartbeat
  * 09-19 11:12:18.768 [c.t.l.BackgroundGeolocationService a]
  * 09-19 11:12:18.768   🎾  Start heartbeat (60)
  * 09-19 11:12:18.778 [c.t.l.BackgroundGeolocationService a]
  * 09-19 11:12:18.778   🔵  setPace: null → false
  * 09-19 11:12:18.781 [c.t.l.adapter.TSConfig c] ℹ️   Persist config
  * 09-19 11:12:18.794 [c.t.locationmanager.util.b a]
  * 09-19 11:12:18.794   ℹ️  LocationAuthorization: Permission granted
  * 09-19 11:12:18.842 [c.t.l.http.HttpService flush]
  * 09-19 11:12:18.842 ╔═════════════════════════════════════════════
  * 09-19 11:12:18.842 ║ HTTP Service
  * 09-19 11:12:18.842 ╠═════════════════════════════════════════════
  * 09-19 11:12:19.000 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
  * 09-19 11:12:21.314 [c.t.l.l.SingleLocationRequest$2 onLocationResult]
  * 09-19 11:12:21.314 ╔═════════════════════════════════════════════
  * 09-19 11:12:21.314 ║ SingleLocationRequest: 1
  * 09-19 11:12:21.314 ╠═════════════════════════════════════════════
  * 09-19 11:12:21.314 ╟─ 📍  Location[fused 45.519239,-73.617058 hAcc=15]999923706055 vAcc=2 sAcc=??? bAcc=???
  * 09-19 11:12:21.327 [c.t.l.l.TSLocationManager onSingleLocationResult]
  * 09-19 11:12:21.327   🔵  Acquired motionchange position, isMoving: false
  * 09-19 11:12:21.342 [c.t.l.l.TSLocationManager a] 15.243
  * 09-19 11:12:21.405 [c.t.locationmanager.data.a.c persist]
  * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
  * 09-19 11:12:21.423 [c.t.l.http.HttpService flush]
  * 09-19 11:12:21.423 ╔═════════════════════════════════════════════
  * 09-19 11:12:21.423 ║ HTTP Service
  * 09-19 11:12:21.423 ╠═════════════════════════════════════════════
  * 09-19 11:12:21.446 [c.t.locationmanager.data.a.c first]
  * 09-19 11:12:21.446   ✅  Locked 1 records
  * 09-19 11:12:21.454 [c.t.l.http.HttpService a]
  * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
  * 09-19 11:12:22.083 [c.t.l.http.HttpService$a onResponse]
  * 09-19 11:12:22.083   🔵  Response: 200
  * 09-19 11:12:22.100 [c.t.locationmanager.data.a.c destroy]
  * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
  * 09-19 11:12:55.226 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
  * ```
  */
  interface Logger {
    /**
    * `1`.  Used to order results of [[SQLQuery]] descending.
    */
    ORDER_DESC: SQLQueryOrder;
    /**
    * `-1`.  Used to order results of [[SQLQuery]] ascending.
    */
    ORDER_ASC: SQLQueryOrder;
    /**
    * Inserts an "error" log message into the SDK's log database
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.error("Something BAD");
    * ```
    * &nbsp;
    * ```
    * E TSLocationManager: [c.t.l.logger.TSLog log]
    * E TSLocationManager: ‼ Something BAD
    * ```
    */
    error(message:string):void;
    /**
    * Inserts a "warning" log message into the SDK's log database
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.warn("Something WEIRD");
    * ```
    * &nbsp;
    *
    * ```
    * E TSLocationManager: [c.t.l.logger.TSLog log]
    * E TSLocationManager: ⚠️  Something WEIRD
    * ```
    */
    warn(message:string):void;
    /**
    * Inserts a debug log message into the SDK's log database
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.debug("This is a debug message");
    * ```
    * &nbsp;
    * ```
    * D TSLocationManager: [c.t.l.logger.TSLog log] This is a debug message
    * ```
    */
    debug(message:string):void;
    /**
    * Inserts an "info" log message into the SDK's log database
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.info("Something informative");
    * ```
    * &nbsp;
    * ```
    * E TSLocationManager: [c.t.l.logger.TSLog log]
    * I TSLocationManager:   ℹ️  Something informative
    * ```
    */
    info(message:string):void;
    /**
    * Inserts a "notice" log message into the SDK's log database
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.notice("A Notice");
    * ```
    * &nbsp;
    * ```
    * E TSLocationManager: [c.t.l.logger.TSLog log]
    * I TSLocationManager:   🔵  A Notice
    * ```
    */
    notice(message:string):void;

    /**
    * Returns the records from log database as a `String`.  Provide an optional [[SQLQuery]] to contrain results between dates.
    * @break
    *
    * Depending on the configured [[Config.logLevel]], the plugin can store an *immense* amount of helpful logging information for debugging location-tracking
    * problems.
    *
    * ### ℹ️ See also:
    * - [[Config.logMaxDays]] (default `3` days)
    * - [[Config.logLevel]]   (default [[BackgroundGeolocation.LOG_LEVEL_OFF]])
    * - [[emailLog]]
    * - [[uploadLog]]
    * - [[getLog]]
    * - 📘[Debugging Guide](github:wiki/Debugging)
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.getLog().then((log) => {
    *   // Warning:  this string could be several megabytes.
    *   console.log("[log] success: ", log);
    * });
    *
    * // Or constrain results by providing a SQLQuery
    * let Logger = BackgroundGeolocation.logger;
    *
    * let log = await Logger.getLog({
    *   start: Date.parse("2019-09-19 11:12"),
    *   end: Date.parse("2019-09-19 11:13"),
    *   order: Logger.ORDER_ASC,
    *   limit: 100
    * });
    * ```
    * ```
    * 09-19 11:12:18.716 ╔═════════════════════════════════════════════
    * 09-19 11:12:18.716 ║ BackgroundGeolocation Service started
    * 09-19 11:12:18.716 ╠═════════════════════════════════════════════
    * 09-19 11:12:18.723 [c.t.l.BackgroundGeolocationService d]
    * 09-19 11:12:18.723   ✅  Started in foreground
    * 09-19 11:12:18.737 [c.t.l.ActivityRecognitionService a]
    * 09-19 11:12:18.737   🎾  Start activity updates: 10000
    * 09-19 11:12:18.761 [c.t.l.BackgroundGeolocationService k]
    * 09-19 11:12:18.761   🔴  Stop heartbeat
    * 09-19 11:12:18.768 [c.t.l.BackgroundGeolocationService a]
    * 09-19 11:12:18.768   🎾  Start heartbeat (60)
    * 09-19 11:12:18.778 [c.t.l.BackgroundGeolocationService a]
    * 09-19 11:12:18.778   🔵  setPace: null → false
    * 09-19 11:12:18.781 [c.t.l.adapter.TSConfig c] ℹ️   Persist config
    * 09-19 11:12:18.794 [c.t.locationmanager.util.b a]
    * 09-19 11:12:18.794   ℹ️  LocationAuthorization: Permission granted
    * 09-19 11:12:18.842 [c.t.l.http.HttpService flush]
    * 09-19 11:12:18.842 ╔═════════════════════════════════════════════
    * 09-19 11:12:18.842 ║ HTTP Service
    * 09-19 11:12:18.842 ╠═════════════════════════════════════════════
    * 09-19 11:12:19.000 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
    * 09-19 11:12:21.314 [c.t.l.l.SingleLocationRequest$2 onLocationResult]
    * 09-19 11:12:21.314 ╔═════════════════════════════════════════════
    * 09-19 11:12:21.314 ║ SingleLocationRequest: 1
    * 09-19 11:12:21.314 ╠═════════════════════════════════════════════
    * 09-19 11:12:21.314 ╟─ 📍  Location[fused 45.519239,-73.617058 hAcc=15]999923706055 vAcc=2 sAcc=??? bAcc=???
    * 09-19 11:12:21.327 [c.t.l.l.TSLocationManager onSingleLocationResult]
    * 09-19 11:12:21.327   🔵  Acquired motionchange position, isMoving: false
    * 09-19 11:12:21.342 [c.t.l.l.TSLocationManager a] 15.243
    * 09-19 11:12:21.405 [c.t.locationmanager.data.a.c persist]
    * 09-19 11:12:21.405   ✅  INSERT: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:21.423 [c.t.l.http.HttpService flush]
    * 09-19 11:12:21.423 ╔═════════════════════════════════════════════
    * 09-19 11:12:21.423 ║ HTTP Service
    * 09-19 11:12:21.423 ╠═════════════════════════════════════════════
    * 09-19 11:12:21.446 [c.t.locationmanager.data.a.c first]
    * 09-19 11:12:21.446   ✅  Locked 1 records
    * 09-19 11:12:21.454 [c.t.l.http.HttpService a]
    * 09-19 11:12:21.454   🔵  HTTP POST: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:22.083 [c.t.l.http.HttpService$a onResponse]
    * 09-19 11:12:22.083   🔵  Response: 200
    * 09-19 11:12:22.100 [c.t.locationmanager.data.a.c destroy]
    * 09-19 11:12:22.100   ✅  DESTROY: bca5acc8-e358-4d8f-827f-b8c0d556b7bb
    * 09-19 11:12:55.226 [c.t.l.BackgroundGeolocationService onActivityRecognitionResult] still (100%)
    *```
    */
    getLog(query?:SQLQuery): Promise<string>;

    /**
    * Email the result of [[getLog]] using device's mail client.
    *
    * @example
    * ```typescript
    * let Logger = BackgroundGeolocation.logger;
    * Logger.emailLog("foo@bar.com").then((success) => {
    *   console.log("[emailLog] success");
    * }).catch((error) => {
    *   console.log("[emailLog] FAILURE: ", error);
    * });
    *
    * // Or constrain results by providing a SQLQuery
    * Logger.emailLog("foo@bar.com", {
    *   start: Date.parse("2019-09-19"),
    *   end: Date.parse("2019-09-20"),
    *   order: Logger.ORDER_ASC,
    *   limit: 1000
    * });
    * ```
    * ### ℹ️ See also:
    * - [[Config.logLevel]]
    * - [[getLog]]
    * - [[uploadLog]]
    * - 📘[Debugging Guide](github:wiki/Debugging).
    */
    emailLog(email:string, query?:SQLQuery): Promise<boolean>;

    /**
    * Upload the result of [[getLog]] to provided url.  Provide an optional [[SQLQuery]] to contrain results between dates.  The file-upload
    * request will attach your configured [[Config.headers]] for authentication.
    *
    * ## Example
    *
    * ```typescript
    * BackgroundGeolocation.logger.uploadLog("https://my.server.com/users/123/logs").then((success) => {
    *   console.log("[uploadLog] success");
    * }).catch((error) => {
    *   console.log("[uploadLog] FAILURE:", error);
    * });
    *
    * // Or constrain results by providing a [SQLQuery]:
    * BackgroundGeolocation.logger.uploadLog("https://my.server.com/users/123/logs", {
    *   start: Date.parse("2019-10-20 09:00"),
    *   end: Date.parse("2019-10-20 11:59")
    * }).then((success) => {
    *   console.log("[uploadLog] success");
    * }).catch((error) => {
    *   console.log("[uploadLog] FAILURE:", error);
    * });
    * ```
    *
    * ## MultiPart File Upload
    * The SDK will upload the gzipped log-file to your server as a *Multi-part* file upload, the same log-file as used in [[emailLog]].  This is what I see with my [Node server](https://github.com/transistorsoft/background-geolocation-console) at `request.files`:
    *
    * ```typescript
    * app.post("/log", async function(req, res) {
    *   console.log("[body]: ", req.body);
    *   console.log("[files]: ", req.files);
    *   res.status(200).send();
    * });
    * ```
    * ![](https://dl.dropbox.com/s/cn86cu0vieor0j4/uploadLog-npm-server-request.png?dl=1)
    *
    * ## Form Part
    *
    * In addition to the log-file, the SDK will upload a form as well, containing the following parameters:
    *
    * | Key                 | Value                                                            |
    * |--------------|------------------------------------------|
    * | **`state`**    | *JSON-encoded result of SDK's `#getState`*|
    * | **`model`** | *Device model* |
    * | **`manufacturer`** | *Device manufacturer* |
    * | **`platform`** | *iOS or Android* |
    * | **`version`** | *OS version* |
    *
    * ### ℹ️ See also:
    * - [[Config.logLevel]]
    * - [[getLog]]
    * - [[emailLog]]
    * - [[destroyLog]]
    * - 📘[Debugging Guide](github:wiki/Debugging).
    */
    uploadLog(url:string, query?:SQLQuery): Promise<boolean>;

    /**
    * Destroy the entire contents of SDK's log database.
    *
    * @example
    * ```typescript
    * BackgroundGeolocation.logger.destroyLog();
    * ```
    *
    * ### ℹ️ See also:
    * - [[Config.logLevel]]
    * - [[getLog]]
    * - [[emailLog]]
    * - [[uploadLog]]
    * - 📘[Debugging Guide](github:wiki/Debugging)
    */
    destroyLog(): Promise<boolean>;
  }
}
