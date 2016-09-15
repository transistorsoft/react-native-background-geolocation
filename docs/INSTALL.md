
# Installation

:heavy_exclamation_mark: This plugin includes the dependency **`react-native-background-fetch`** (also created by Transistor Software).  The node_module **has already been installed**, but you must perform its [iOS Setup](https://github.com/transistorsoft/react-native-background-fetch/blob/master/INSTALL.md) as well, in the same manner you're about to do here.  Implementing `react-native-background-fetch` in your *application-code* **is optional** -- this plugin uses its API directly for its own purposes, under-the-hood.

1. `npm install react-native-background-geolocation --save`

2. In the XCode's **`Project navigator`**, right click on project's name ➜ **`Add Files to <...>`**
![](https://www.dropbox.com/s/nmih1sc9hgygpvu/react-native-background-geolocation-install-1.png?dl=1)

3. Add **`node_modules/react-native-background-geolocation/RNBackgroundGeolocation.xcodeproj`** ![](https://www.dropbox.com/s/5rscl79kbrctouq/react-native-background-geolocation-install-2.png?dl=1)

4. Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**. Add **`node_modules/react-native-background-geolocation/RNBackgroundGeolocation/libRNBackgroundGeolocation.a` ![](https://www.dropbox.com/s/her9t33sencaca1/react-native-background-geolocation-install-3.png?dl=1)

5. Add another item to **`Link Binary With Libraries`**, but click **`[Add Other...]`**.  Navigate to **`node_modules/react-native-background-geolocation/RNBackgroundGeolocation`**.  Add **`TSLocationManager.framework`**. ![](https://www.dropbox.com/s/momp8ghaotc3x8l/react-native-background-geolocation-install-4.png?dl=1)

6. Add the following Cocoa framework dependencies to your target's `Link Binary With Libraries` build phase:
  * **`libsqlite3.tbd`**
  * ![](https://www.dropbox.com/s/mysihinrr6c6390/react-native-background-geolocation-install-5.png?dl=1)

7. Edit **`Info.plist`**.  Add a new key **`NSLocationAlwaysUsageDescription`**.  The value here will be presented to the user when the app first requests location updates in background (eg: `App requires background location tracking`).![](https://www.dropbox.com/s/1hlneo42ybok0rc/react-native-background-geolocation-install-6.png?dl=1)

Add another key `NSMotionUsageDescription` .  Same idea as `NSLocationAlwaysUsageDescription`.  For example:  "Accelerometer is used to increase battery efficiency by intelligently toggling location-services"


8. Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the modes `Location updates` (optionally enable `Audio and AirPlay` when running in debug mode:  the plugin emits sounds during life-cycle events when running on a device).![](https://www.dropbox.com/s/rn045iboqs7pe12/react-native-background-geolocation-install-7.png?dl=1)

9. **Framework Search Paths**.  I would hope this step wouldn't be necessary, but I don't see another way around it.  In order to for you app to find `TSLocationManager.framework`, it seems you have to tell Xcode where to find the framework.  Go to **Build Settings** and search for **"framework search path"**.  Add the following item to it (select **recursive**): 

`$(PROJECT_DIR)/../node_modules/react-native-background-geolocation` **[recursive]**

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation-demo/install-step-header-search-paths.png)

You can now [import and build](../README.md#example).
