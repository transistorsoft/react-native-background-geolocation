# iOS Auto-linking Installation

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

## `pod install`

```bash
$ cd ios
$ pod install
```

## Swift Package Manager (React Native 0.88 or later)

React Native 0.88 can build an app's iOS dependencies with Swift Package Manager instead of CocoaPods
(experimental in React Native). The plugin ships `ios/Package.swift` for this mode, so there is nothing
to configure for it:

```bash
$ npx react-native spm add --deintegrate   # an existing CocoaPods app: removes CocoaPods, adds the packages
```

- Xcode resolves `native-background-geolocation` (TSLocationManager 4.9.x) and `transistor-background-fetch`
  from GitHub at build time; allow `github.com` if you build behind a proxy.
- Your app's iOS deployment target must be 15.0 or later.
- Use one package manager for the whole app. In Swift Package Manager mode every plugin builds through it,
  including react-native-background-fetch 4.5.0 and later, which ships its own `Package.swift`: both plugins
  then share one TSBackgroundFetch.
- To go back to CocoaPods: `npx react-native spm deinit`, restore `ios/Podfile` from version control, then
  `cd ios && pod install`. `spm add --deintegrate` removed React Native's lines from the Podfile, and
  `spm deinit` doesn't put them back. Reverting all of `ios/` with git does the same.
- Expo apps stay on CocoaPods.

## Permissions & Background Modes

Open the Xcode project `ios/Runner/Runner.xcworkspace`

- Enable the background modes:
    - [x] Location updates
    - [x] Background fetch
    - [x] Audio ( ℹ️ **optional for debug-mode sound FX** )

![](https://dl.dropboxusercontent.com/scl/fi/muwq6wwor83acl64w4214/setup-ios-background-modes.png?rlkey=cbbuz0pg5j3ql1z4sttxpufyl&dl=1)


## Configure Usage Strings in `Info.plist`

Edit **`Info.plist`**.  Add the following items (Set **Value** as desired):

| Key | Type | Value |
|-----|-------|-------------|
| *`Privacy - Location Always and When in Use Usage Description`* | `String` | *CHANGEME: Location required in background* |
| *`Privacy - Location When in Use Usage Description`* | `String` | *CHANGEME: Location required when app is in use* |
| *`Privacy - Motion Usage Description`* | `String` | *CHANGEME: Motion permission helps detect when device in in-motion* |

![](https://dl.dropboxusercontent.com/scl/fi/dh0sen3wxsgp1hox41le0/iOS-permissions-plist.png?rlkey=i3fipjdcpu7p1eez4mapukkpl&dl=1)


## Configure Your License

> [!NOTE]
> If you've **not** [purchased a license](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans), **ignore this step** &mdash; the plugin is fully functional in *DEBUG* builds so you can try before you [buy](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans).

In your __`Info.plist`__, add the following key: 

|      Key     |     Type     |     Value     |
|-----|-------|-------------|
| *`TSLocationManagerLicense`* | `String` | `                    <PASTE YOUR LICENSE KEY HERE>                     ` |


## Background Fetch

The *Background Geolocation* SDK has internal handling for periodic *Background Fetch* events (if enabled).  It can use these periodic events to gather current state information (*is the device moving?*), evaluating the `schedule` (if you've configured one) or checking if there are any location records in the queue, waiting to be uploaded to your configured `url`:

1.  Open your __`Info.plist`__ and add the key *"Permitted background task scheduler identifiers"*

|      Key     |     Type     |     Value     |
|-----|-------|-------------|
| *`Permitted background task scheduler identifiers          `* | `Array` |  |
| *`    Item 0                                                 `* | `String` | `com.transistorsoft.fetch` |


![](https://dl.dropboxusercontent.com/s/t5xfgah2gghqtws/ios-setup-permitted-identifiers.png?dl=1)

2.  Add the **required identifier `com.transistorsoft.fetch`**.

![](https://dl.dropboxusercontent.com/s/kwdio2rr256d852/ios-setup-permitted-identifiers-add.png?dl=1)

3.  Configure in your __`AppDelegate`__ (find `AppDelegate.swift` __OR__ `AppDelegate.m`):

#### `AppDelegate.swift`

```diff
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
+import TSBackgroundFetch

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    .
    .
    .    
+   // [REQUIRED] Transistorsoft
+   TSBackgroundFetch.sharedInstance()?.didFinishLaunching()
    .
    .
    .    
    return true
  }
}
```

#### `AppDelegate.m` (for older apps using Obj-c)

```diff
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

+#import <TSBackgroundFetch/TSBackgroundFetch.h>

@implementation AppDelegate

(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  .
  .
  .
+ // [REQUIRED] Transistorsoft
+ [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  return YES;
}
```

[Transistor Software](https://www.transistorsoft.com) manages a helpful free plugin you can optionally add to your app named [`react-native-background-fetch`](https://github.com/transistorsoft/react-native-background-fetch).

> [!TIP]
> `react-native-background-fetch` is helpful for executing a periodic task (eg: every 15 minutes).  You could use it to periodically request the current location, for example:

```ts
// Execute a task about every 15 minutes:
BackgroundFetch.configure({
  minimumFetchInterval: 15
}, async (taskId) => { // <-- This is your periodic-task callback
  const location = await BackgroundGeolocation.getCurrentPosition({
    samples: 3,
    extras: {   // <-- your own arbitrary meta-data
      "event": "getCurrentPosition"
    }
  });
  console.log('[getCurrentPosition]', location);
  BackgroundFetch.finish(taskId);   // <-- signal that your task is complete
});
```

