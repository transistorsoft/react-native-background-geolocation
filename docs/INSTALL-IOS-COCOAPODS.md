# iOS Installation with CocoaPods

```shell
$ npm install --save react-native-background-geolocation
```

If you use already [CocoaPods](https://cocoapods.org/) in your react-native
project, you can also add the react-native-background-geolocation project to your Podfile.

**NOTE** The path to `node_modules` depends on your Podfile location, whether in `{root}` of the react-native project (`node_modules`) or `{root}/ios` (`../node_modules`).  The following instructions assume `{root}/ios`

- In your `Podfile`, make sure that `platform :ios, '8.0'` is set to `8.0`
- Add the following Pods (**Including `React` if it's not already there**)

```Ruby
platform :ios, '8.0'

#use_frameworks!  # <-- comment this out!
pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundGeolocation', :path => '../node_modules/react-native-background-geolocation'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch'
```

- Install the new CocoaPods dependency with:

```shell
$ pod install
```

## XCode Configuration

- Open your `App.xcworkspace`

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

### BackgroundFetch AppDelegate extension

BackgroundFetch implements an `AppDelegate` method `didPerformFetchWithCompletionHandler`.  You must manually add this file to the same folder where your `AppDelegate.m` lives:

- Right click your app's root folder.  Select **`Add files to...`**.  Select **Other**.
![](https://www.dropbox.com/s/gpsmz1ul1wyrhrs/Screenshot%202016-09-21%2016.17.35.png?dl=1)

- Browse to **`{YourApp}/node_modules/react-native-background-fetch/ios/RNBackgroundFetch`**.  
- Add the file **`RNBackgroundFetch+AppDelegate.m`**:
![](https://www.dropbox.com/s/uvi6nlx6xrl13fa/Screenshot%202016-09-21%2016.20.42.png?dl=1)

## Troubleshooting with CocoaPods

Because react-native is only available as npm module (and not as "regular"
CocoaPods dependency, see [v0.13 release notes](https://github.com/facebook/react-native/releases/tag/v0.13.0)
for more informations).

So it is required that you import react-native also from a local path.
Ensure that you include `React` before you include `react-native-background-fetch` in
your `Podfile`. Here is a complete working example if you want add your Podfile
in the project root while your generated Xcode project is still in the `ios`
folder:

```Ruby
platform :ios, '8.0'

pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundGeolocation', :path => '../node_modules/react-native-background-geolocation'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch'
```
