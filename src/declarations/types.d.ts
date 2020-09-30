declare module "react-native-background-geolocation" {
	/**
	* Controls the volume of [[Config.logLevel]] log-entries recorded to database.
	*
	* | Label                      |
	* |----------------------------|
	* | [[LOG_LEVEL_OFF]]     |
	* | [[LOG_LEVEL_ERROR]]   |
	* | [[LOG_LEVEL_WARNING]] |
	* | [[LOG_LEVEL_INFO]]    |
	* | [[LOG_LEVEL_DEBUG]]   |
	* | [[LOG_LEVEL_VERBOSE]] |
	*/
	type LogLevel = 0 | 1 | 2 | 3 | 4 | 5;

	/**
	 * Used for [[Config.desiredAccuracy]].
	 *
	 * | Name                                 | Location Providers           | Description                             |
	 * |--------------------------------------|------------------------------|-----------------------------------------|
	 * | [[DESIRED_ACCURACY_NAVIGATION]]      | (**iOS only**) GPS + Wifi + Cellular | Highest power; highest accuracy.|
	 * | [[DESIRED_ACCURACY_HIGH]]            | GPS + Wifi + Cellular | Highest power; highest accuracy.               |
	 * | [[DESIRED_ACCURACY_MEDIUM]]          | Wifi + Cellular | Medium power; Medium accuracy;                       |
	 * | [[DESIRED_ACCURACY_LOW]]             | Wifi (low power) + Cellular | Lower power; No GPS.                     |
	 * | [[DESIRED_ACCURACY_VERY_LOW]]        | Cellular only | Lowest power; lowest accuracy.                         |
	 * | [[DESIRED_ACCURACY_LOWEST]]          | (**iOS only**) | Lowest power; lowest accuracy.                        |
	 */
	type LocationAccuracy = -2 | -1 | 0 | 10 | 100 | 1000 | 3000;

	/**
	 * Used for [[Notification.priority]].
	 *
	 * | Value                             | Description                                                                                            |
	 * |-----------------------------------|--------------------------------------------------------------------------------------------------------|
	 * | [[NOTIFICATION_PRIORITY_DEFAULT]] | Notification weighted to top of list; notification-bar icon weighted left.                             |
	 * | [[NOTIFICATION_PRIORITY_HIGH]]    | Notification **strongly** weighted to top of list; notification-bar icon **strongly** weighted to left.|
	 * | [[NOTIFICATION_PRIORITY_LOW]]     | Notification weighted to bottom of list; notification-bar icon weighted right.                         |
	 * | [[NOTIFICATION_PRIORITY_MAX]]     | Same as `NOTIFICATION_PRIORITY_HIGH`.                                                                  |
	 * | [[NOTIFICATION_PRIORITY_MIN]]     | Notification **strongly** weighted to bottom of list; notification-bar icon **hidden**.                |
	 */
	type NotificationPriority = 0 | 1 | -1 | 2 | -2;

	/**
	 * Used for [[Config.activityType]].
	 *
	 * | Name                                     |
	 * |------------------------------------------|
	 * | [[ACTIVITY_TYPE_OTHER]]                  |
	 * | [[ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION]]  |
	 * | [[ACTIVITY_TYPE_FITNESS]]                |
	 * | [[ACTIVITY_TYPE_OTHER_NAVIGATION]]       |
	 *
	 * ℹ️  For more information, see [Apple docs](https://developer.apple.com/reference/corelocation/cllocationmanager/1620567-activitytype?language=objc).
	 */
	type ActivityType = 1 | 2 | 3 | 4;
	/**
	* | Name                                    | Platform      |
	* |-----------------------------------------|---------------|
	* | [[AUTHORIZATION_STATUS_NOT_DETERMINED]] | iOS only      |
	* | [[AUTHORIZATION_STATUS_RESTRICTED]]     | iOS only      |
	* | [[AUTHORIZATION_STATUS_DENIED]]         | iOS & Android |
	* | [[AUTHORIZATION_STATUS_ALWAYS]]         | iOS & Android |
	* | [[AUTHORIZATION_STATUS_WHEN_IN_USE]]    | iOS only      |
	*/
	type AuthorizationStatus = 0 | 1 | 2 | 3 | 4;

	/**
	* | Name                                    | Value     |
	* |-----------------------------------------|-----------|
	* | [[ACCURACY_AUTHORIZATION_FULL]] 		| 0     	|
	* | [[ACCURACY_AUTHORIZATION_REDUCED]]     	| 1         |
	*/
	type AccuracyAuthorization = 0 | 1;

	/**
	* | Value    | Description                                                           |
	* |----------|-----------------------------------------------------------------------|
	* | `0`      | Geofences-only monitoring ([[BackgroundGeolocation.startGeofences]]). |
	* | `1`      | Both location & Geofence monitoring.                                  |
	*/
	type TrackingMode = 0 | 1;

	/**
	* When native location API fails to fetch a location, one of the following error-codes will be returned.
	*
	* | Code  | Error                       |
    * |-------|-----------------------------|
    * | 0     | Location unknown            |
    * | 1     | Location permission denied  |
    * | 2     | Network error               |
    * | 408   | Location timeout            |
    * | 499   | Location request cancelled  |
	*/
	type LocationError = 0 | 1 | 2 | 408 | 499;

	/**
	* iOS Location authorization request.
	* This is used to express the location authorization you *expect* the user have enabled.
	*/
	type LocationAuthorizationRequest = "Always" | "WhenInUse" | "Any";

	/**
	* Desired HTTP method to use when uploading data to your configured [[url]].
	*/
	type HttpMethod = "POST" | "PUT" | "OPTIONS";

	type PersistMode = -1 | 0 | 1 | 2;

	type Extras = {[key: string]: string|null|number|boolean|Extras|string[]|number[]|boolean[]|Extras[]};

	/**
	* Controls ordering of [[SQLQuery.order]]
	*
	* | Name                 | Value |
	* |----------------------|-------|
	* | [[Logger.ORDER_ASC]] | `1`   |
	* | [[Logger.ORDER_DESC]]| `-1`  |
	*/
	type SQLQueryOrder = -1 | 1;

}
