declare module "react-native-background-geolocation" {
	/**
	* Detected device sensors related to motion-detection.
	*/
	interface Sensors {
  	/**
  	* `ios` | `android`
  	*/
    platform: string;
    /**
    * `true` when the device has an accelerometer.
    */
    accelerometer: boolean;
    /**
    * `true` when the device has a magnetometer (compass).
    */
    magnetometer: boolean;
    /**
    * `true` when the device has a gyroscope.
    */
    gyroscope: boolean;
    /**
    * __[Android only]__ `true` when the Android device has significant motion hardware.
    */
    significant_motion?: boolean;
    /**
    * __[iOS only]__ `true` when the device has an __M7__ motion co-processor (iPhone 5S and up).
    */
    motion_hardware?: boolean;
  }
}
