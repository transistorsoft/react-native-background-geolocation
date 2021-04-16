declare module "react-native-background-geolocation" {
	/**
	* The event-object provided to [[BackgroundGeolocation.onMotionChange]] when the SDK changes state between *moving* and *stationary*.
	*/
	interface MotionChangeEvent {
		/**
		* `true` when the device has begun *moving* and the SDK engaged location-tracking.  `false` when *stationary*.
		*/
		isMoving: boolean;
		/**
		* The corresponding [[Location]] where the event occurred.
		*/
		location: Location;
	}
}
