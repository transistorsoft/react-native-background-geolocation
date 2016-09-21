# Installation process with CocoaPods

If you use already [CocoaPods](https://cocoapods.org/) in your react-native
project, you can also add the react-native-mapbox-gl project to your Podfile.

**NOTE** The path to `node_modules` depends on your Podfile location, whether in `{root}` of the react-native project (`node_modules`) or `{root}/ios` (`../node_modules`).  The following instructions assume `{root}/ios`

- Run `npm install --save react-native-background-geolocation`
- In your `Podfile`, make sure that `platform :ios, '8.0'` is set to `8.0`
- Add the following Pods (**Including `React` if it's not already there**)

```Ruby
pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundGeolocation', :path => '../node_modules/react-native-background-geolocation/ios'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch/ios'
```

- Open your Xcode project and ensure that the "Build Settings" parameter
   "Other linker flags" (`OTHER_LDFLAGS`) contains the CocoaPods generated
   linker options!
   * If you have used `react-native init` to setup your project you can just
     remove this parameter. Just select the line and press the Delete key.
   * Alternative, if you setup your Xcode project yourself, ensure that the
     parent configuration was included with a `$(inherited)` variable.
- Install the new CocoaPods dependency with:

```Bash
$ pod install
```

- Open `YourProject.xcworkspace`.  Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the mode **`Background fetch`**.![](https://dl.dropboxusercontent.com/u/2319755/react-native-background-fetch/INSTALL/step6.png?dl=1)

- Edit **`Info.plist`**.  Add a new key **`NSLocationAlwaysUsageDescription`**.  The value here will be presented to the user when the app first requests location updates in background (eg: `App requires background location tracking`).![](https://www.dropbox.com/s/1hlneo42ybok0rc/react-native-background-geolocation-install-6.png?dl=1)

- Add another key `NSMotionUsageDescription` .  Same idea as `NSLocationAlwaysUsageDescription`.  For example:  "Accelerometer is used to increase battery efficiency by intelligently toggling location-services"

- Select the root of your project.  Select **Capabilities** tab.  Enable **Background Modes** and enable the modes `Location updates` (optionally enable `Audio and AirPlay` when running in debug mode:  the plugin emits sounds during life-cycle events when running on a device).![](https://www.dropbox.com/s/rn045iboqs7pe12/react-native-background-geolocation-install-7.png?dl=1)

- Perform Installation instructions for [BackgroundFetch](https://github.com/transistorsoft/react-native-background-fetch/blob/master/INSTALL-COCOAPODS.md#installation-process-with-cocoapods);

## Troubleshooting with CocoaPods

Because react-native is only available as npm module (and not as "regular"
CocoaPods dependency, see [v0.13 release notes](https://github.com/facebook/react-native/releases/tag/v0.13.0)
for more informations).

So it is required that you import react-native also from a local path.
Ensure that you include `React` before you include `react-native-background-fetch` in
your `Podfile`. Here is a complete working example if you want add your Podfile
in the project root while your generated Xcode project is still in the `ios`
folder:

```ruby
source 'https://github.com/CocoaPods/Specs.git'

pod 'React', :path => '../node_modules/react-native'
pod 'RNBackgroundFetch', :path => '../node_modules/react-native-background-fetch/ios'
```

