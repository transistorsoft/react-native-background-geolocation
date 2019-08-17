# iOS Installation with `react-native link`

## `react-native <= 0.59`

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

## `react-native link`
```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
react-native link cocoa-lumberjack
```

## `pod install`
```shell
$ cd ios
$ pod install
```

## XCode Configuration

- Edit **`Info.plist`**.  The plugin adds default values for the following `plist` elements.  You will need to change these values as desired.

| Key | Value | Description |
|-----|-------|-------------|
| NSLocationAlwaysUsageDescription | This app requires background tracking | **Deprecated in iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSLocationAlwaysAndWhenInUseUsageDescription | This app requires background tracking | **New for iOS 11** The value here will be presented to the user when the plugin requests **Background Location** permission |
| NSMotionUsageDescription | Accelerometer use increases battery efficiency by intelligently toggling location-tracking | The value here will be presented to the user when the app requests **Motion Activity** permission.|

![](https://dl.dropboxusercontent.com/s/j7udsab7brlj4yk/Screenshot%202016-09-22%2008.33.53.png?dl=1)



