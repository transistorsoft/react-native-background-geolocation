
# iOS Manual Installation

### With `yarn`

```shell
yarn add react-native-background-geolocation
yarn add cocoa-lumberjack
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
npm install cocoa-lumberjack --save
```

- In the XCode's **`Project navigator`**, right click on project's name ➜ **`Add Files to <...>`**
![](https://dl.dropboxusercontent.com/s/nmih1sc9hgygpvu/react-native-background-geolocation-install-1.png?dl=1)

- Add **1st of 3** Libraries:
    - **`node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation.xcodeproj`**
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/add-project-RNBackgroundGeolocation.png)

- Add **2nd of 3** Libraries:
    - **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch.xcodeproj`**
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/add-project-RNBackgroundFetch.png)

- Add a **3rd of 3** Libraries:
    - **`node_modules/cocoa-lumberjack/CocoaLumberjack/Lumberjack.xcodeproj`**
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/add-project-CocoaLumberjack.png)

## Build Phases ➜ Link Binary With Libraries

- Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**. Add the following **2** static libraries:
    - **`libRNBackgroundGeolocation.a`**
    - **`libRNBackgroundFetch.a`**.
    - **`libCocoaLumberjack.a`**
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/link-binaries-with-libraries.png)

- Add the following Cocoa framework dependency to your target's `Link Binary With Libraries` build phase:
    - **`libsqlite3.tbd`**
    - **`libz.tbd`**
    - ![](https://dl.dropboxusercontent.com/s/ael6c66br8m4kzt/Screenshot%202016-09-22%2010.03.56.png?dl=1)

- BackgroundGeolocation includes a couple of custom iOS frameworks.  These need to manually added, unfortunately.
    - Click **`[Add Other...]`**.
    - Navigate: **`node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation`**.
    - Add **`TSLocationManager.framework`**.

![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/TSLocationManager.framework.png)

- Add another framework, same process as previous:
    - Click **`[Add Other...]`**.
    - Navigate: **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**
    - Add **`TSBackgroundFetch.framework`**.
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-geolocation/images/Manual%20Installation/TSBackgroundFetch.framework.png)

## Build Settings ➜ Framework Search Paths

- In order to the find the Frameworks you just added, you have to tell Xcode where it can find them:
    - Go to **Build Settings** and search for **"framework search path"**.
    - Add the following paths (select **recursive [v]**):

```
    $(PROJECT_DIR)/../node_modules/react-native-background-geolocation/ios
    $(PROJECT_DIR)/../node_modules/react-native-background-fetch/ios
```

![](https://dl.dropboxusercontent.com/s/6hwo0mk10q2dk71/Screenshot%202016-09-22%2008.49.04.png?dl=1)

## Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following modes:

- [x] Location updates
- [x] Background fetch
- [x] Audio (**optional for debug-mode sound FX**)

![](https://dl.dropboxusercontent.com/s/a4xieyd0h38xklu/Screenshot%202016-09-22%2008.12.51.png?dl=1)

- Edit **`Info.plist`**.  Add the following items (Set **Value** as desired):

| Key | Value | Description |
|-----|-------|-------------|
| NSLocationAlwaysUsageDescription | This app requires background tracking | **Deprecated in iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSLocationAlwaysAndWhenInUseUsageDescription | This app requires background tracking | **New for iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSMotionUsageDescription | Accelerometer use increases battery efficiency by intelligently toggling location-tracking | The value here will be presented to the user when the app requests **Motion Activity** permission.|

![](https://dl.dropboxusercontent.com/s/j7udsab7brlj4yk/Screenshot%202016-09-22%2008.33.53.png?dl=1)

## BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- Expand the **`RNBackgroundFetch`** project and drag/drop the file **`RNBackgroundFetch+AppDelegate.m`** and place the file to exist **in the same folder** as your app's **`AppDelegate.m`**.
![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step7.png?dl=1)

You can now [import and build](../README.md#example).
