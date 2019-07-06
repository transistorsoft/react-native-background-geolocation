# iOS Installation with `react-native link`

React Native `>= 0.60` has introduced significant changes to component setup.  Be sure to follow the directions according to the version of `react-native` you're using.  If you haven't yet upgraded to `0.60`, it is **highly reccommended** to do so **now**.

## 🆕 `react-native >= 0.60`

### With `yarn`

```shell
yarn add react-native-background-geolocation
yarn add react-native-background-fetch
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
npm install react-native-background-fetch --save
```

### `react-native link`
```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

-------------------------------------------------------------------------------------

## `react-native <= 0.59`

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

### `react-native link`
```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
react-native link cocoa-lumberjack
```

## XCode Configuration

- Edit **`Info.plist`**.  The plugin adds default values for the following `plist` elements.  You will need to change these values as desired.

| Key | Value | Description |
|-----|-------|-------------|
| NSLocationAlwaysUsageDescription | This app requires background tracking | **Deprecated in iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSLocationAlwaysAndWhenInUseUsageDescription | This app requires background tracking | **New for iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSMotionUsageDescription | Accelerometer use increases battery efficiency by intelligently toggling location-tracking | The value here will be presented to the user when the app requests **Motion Activity** permission.|

![](https://dl.dropboxusercontent.com/s/j7udsab7brlj4yk/Screenshot%202016-09-22%2008.33.53.png?dl=1)



