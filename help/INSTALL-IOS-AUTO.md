# iOS Auto-linking Installation
### `react-native >= 0.60`

### With `yarn`

```shell
yarn add react-native-background-geolocation

yarn add react-native-background-fetch@^4.2.1
```

### With `npm`
```shell
npm install react-native-background-geolocation --save

npm install react-native-background-fetch@^4.2.1
```

## `pod install`

```bash
$ cd ios
$ pod install
```

## Configure Background Capabilities

Open your App in **XCode** and select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the following modes:

- [x] Location updates
- [x] Background fetch
- [x] Audio (**optional for debug-mode sound FX**)

![](https://dl.dropboxusercontent.com/s/a4xieyd0h38xklu/Screenshot%202016-09-22%2008.12.51.png?dl=1)

## Configure Usage Strings in `Info.plist`

Edit **`Info.plist`**.  Add the following items (Set **Value** as desired):

| Key | Type | Value |
|-----|-------|-------------|
| *Privacy - Location Always and When in Use Usage Description* | `String` | *CHANGEME: Location required in background* |
| *Privacy - Location When in Use Usage Description* | `String` | *CHANGEME: Location required when app is in use* |
| *Privacy - Motion Usage Description* | `String` | *CHANGEME: Motion permission helps detect when device in in-motion* |

![](https://dl.dropboxusercontent.com/scl/fi/dh0sen3wxsgp1hox41le0/iOS-permissions-plist.png?rlkey=i3fipjdcpu7p1eez4mapukkpl&dl=1)

## [Configure `react-native-background-fetch`](https://github.com/transistorsoft/react-native-background-fetch/blob/master/docs/INSTALL-AUTO-IOS.md#ios-auto-linking-setup)

The BackgroundGeolocation SDK makes use internally on __`react-native-background-fetch`__.  Regardless of whether you intend to implement the BackgroundFetch Javascript API in your app, you **must** perform the [Background Fetch iOS Setup](https://github.com/transistorsoft/react-native-background-fetch/blob/master/docs/INSTALL-AUTO-IOS.md#configure-background-capabilities) at __`react-native-background-fetch`__.
