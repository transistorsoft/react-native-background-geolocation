# Installation process with rnpm

```shell
npm install react-native-background-geolocation
```

#### With React Native 0.27+

```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

#### With older versions of React Native

You need [`rnpm`](https://github.com/rnpm/rnpm) (`npm install -g rnpm`)

```shell
rnpm link react-native-background-geolocation
rnpm link react-native-background-fetch
```

## XCode Configuration

### Build Phases ➜ Link Binary With Libraries

- Select your project in the **`Project navigator`**. Click **`Build Phases`** then **`Link Binary With Libraries`**

- Add the following Cocoa framework dependency to your target's `Link Binary With Libraries` build phase:
    - **`libsqlite3.tbd`**
    - ![](https://www.dropbox.com/s/mysihinrr6c6390/react-native-background-geolocation-install-5.png?dl=1)

- BackgroundGeolocation includes a couple of custom iOS frameworks.  These need to manually added, unfortunately.
    - Click **`[Add Other...]`**.  
    - Navigate: **`node_modules/react-native-background-geolocation/ios/RNBackgroundGeolocation`**.  
    - Add **`TSLocationManager.framework`**. 

![](https://www.dropbox.com/s/momp8ghaotc3x8l/react-native-background-geolocation-install-4.png?dl=1)

- Add another framework, same process as previous: 
    - Click **`[Add Other...]`**. 
    - Navigate: **`node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**
    - Add **`TSBackgroundFetch.framework`**.

### Build Settings ➜ Framework Search Paths

- In order to the find the Frameworks you just added, you have to tell Xcode where it can find them:  
    - Go to **Build Settings** and search for **"framework search path"**.
    - Add the following paths (select **recursive [v]**): 

```
    $(PROJECT_DIR)/../node_modules/react-native-background-geolocation/ios
    $(PROJECT_DIR)/../node_modules/react-native-background-fetch/ios
```

![](https://www.dropbox.com/s/6hwo0mk10q2dk71/Screenshot%202016-09-22%2008.49.04.png?dl=1)

### Configure Background Capabilities

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following modes:

- [x] Location updates
- [x] Background fetch
- [x] Audio (**optional for debug-mode sound FX**)

![](https://www.dropbox.com/s/a4xieyd0h38xklu/Screenshot%202016-09-22%2008.12.51.png?dl=1)

- Edit **`Info.plist`**.  Add the following items (Set **Value** as desired): 

| Key | Value | Description |
|---|---|---|
| NSLocationAlwaysUsageDescription | This app requires background tracking | The value here will be presented to the user when the plugin requests **Background Location** permission | 
| NSMotionUsageDescription | Accelerometer use increases battery efficiency by intelligently toggling location-tracking | The value here will be presented to the user when the app requests **Motion Activity** permission.|

![](https://www.dropbox.com/s/j7udsab7brlj4yk/Screenshot%202016-09-22%2008.33.53.png?dl=1)

