declare module "react-native-background-geolocation" {
  /**
  * Simple device information, much simpler than other 3rd party libraries.
  *
  * @example
  * ```typescript
  * let deviceInfo = await BackgroundGeolocation.getDeviceInfo();
  * ```
  */
  interface DeviceInfo {
  	/**
  	* Device model
  	*/
    model:string;
    /**
    * Device manufacturer.
    */
    manufacturer:string;
    /**
    * OS Version code.
    */
    version:string;
    /**
    * Platform:  iOS or Android
    */
    platform:string;
    /**
    * Development framework (react-native or cordova)
    */
    framework:string;
  }
}

