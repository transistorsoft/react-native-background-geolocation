# Expo Installation

```bash
npx expo install react-native-background-geolocation
npx expo install react-native-background-fetch
npx expo install expo-gradle-ext-vars
```

### :open_file_folder: **`app.json`**

- Add the following *three* __`plugins`__:

```diff
{
  "expo": {
    "name": "your-app-name",
    "plugins": [
+     [
+       "react-native-background-geolocation", {
+         "license": "YOUR_LICENSE_KEY_HERE"
+       }
+     ],
+     [
+       "expo-gradle-ext-vars", {
+         "googlePlayServicesLocationVersion": "20.0.0",
+         "appCompatVersion": "1.4.2"
+       }
+     ],
+     "react-native-background-fetch",
    ]
  }
}
```

### `Info.plist`:  *Usage Descriptions*

- Add the following *Usage Descriptions* to the __`ios.infoPlist`__ section:
- These strings are used by the OS when requesting permission from the user.  It's up to you to re-write these strings as-desired.

```diff
{
  "expo": {
    "name": "your-app-name",
    .
    .
    .
    "ios": {
+     "infoPlist": {
+       "NSLocationAlwaysAndWhenInUseUsageDescription": "[CHANGEME] This app requires location in the background",
+       "NSLocationWhenInUseUsageDescription": "[CHANGEME] This app requires location while in use",
+       "NSMotionUsageDescription": "[CHANGEME] This app uses motion-detection to determine the motion-activity of the device (walking, vehicle, bicycle, etc)",
+     }
    }
  }
}
```

- If you configure the plugin with `locationAuthorizationRequest: 'WhenInUse'`, you can omit __`NSLocationAlwaysAndWhenInUseUsageDescription`__
- If you configure the plugin with `disableMotionActivityUpdates: true`, you can omit __`NSMotionUsageDescription`__


### `Info.plist`:  `UIBackgroundModes`:

- Add the following __`UIBackgroundModes`__ to the __`ios.infoPlist`__ section:

```diff
{
  "expo": {
    "name": "your-app-name",
    .
    .
    .
    "ios": {
      "infoPlist": {
        "NSLocationAlwaysAndWhenInUseUsageDescription": "[CHANGEME] This app requires location in the background",
        "NSLocationWhenInUseUsageDescription": "[CHANGEME] This app requires location while in use",
        "NSMotionUsageDescription": "[CHANGEME] This app uses motion-detection to determine the motion-activity of the device (walking, vehicle, bicycle, etc)",
+       "UIBackgroundModes": [
+         "location",
+         "fetch",
+         "processing"
+       ],
+       "BGTaskSchedulerPermittedIdentifiers": [
+         "com.transistorsoft.fetch",
+         "com.transistorsoft.customtask",
+       ]
      }
    }
  }
}
```

- While field-testing the plugin configured with __`debug: true`__ (to enable debug found FX), you can __optionally add__ the __`UIBackgroundMode`__ `audio` so you can *hear* debug sounds while your app is in the background:

```diff
{
  "expo": {
    "name": "your-app-name",
    .
    .
    .
    "ios": {
      "infoPlist": {
        "NSLocationAlwaysAndWhenInUseUsageDescription": "[CHANGEME] This app requires location in the background",
        "NSLocationWhenInUseUsageDescription": "[CHANGEME] This app requires location while in use",
        "NSMotionUsageDescription": "[CHANGEME] This app uses motion-detection to determine the motion-activity of the device (walking, vehicle, bicycle, etc)",
        "UIBackgroundModes": [
          "location",
          "fetch",
          "processing",
+         "audio"
        ]
    }
  }
}
```
