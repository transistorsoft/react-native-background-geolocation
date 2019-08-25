# iOS Installation with `react-native link`

## `react-native <= 0.59`

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

## `react-native link`
```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

---------------------------------------------------------------

:warning: For those **not** using Cocoapods (you *should* be), where your iOS app does **not** have a `Podfile`:
```shell
yarn add cocoa-lumberjack
// <or npm>
npm install cocoa-lumberjack

react-native link cocoa-lumberjack
```

The `cocoa-lumberjack` package is **deprecated** &mdash; it is no longer required when using *Cocoapods*.  If you have `cocoa-lumberjack` installed and you're using `Cocoapods`, **remove and `unlink`** `cocoa-lumberjack`.

---------------------------------------------------------------

## `pod install`

If you're using `Cocoapods` with your app:

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



