# Expo Setup

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
+         "googlePlayServicesLocationVersion": "21.1.0",
+         "appCompatVersion": "1.4.2"
+       }
+     ],
+     "react-native-background-fetch"
    ]
  }
}
```

### Polygon Geofencing Support

If you've purchased the [*Polygon Geofencing* add-on](https://shop.transistorsoft.com/collections/frontpage/products/polygon-geofencing) for creating geofences of *any shape*, add your *Polygon Geofencing* license key:

```diff
{
  "expo": {
    "name": "your-app-name",
    "plugins": [
      [
        "react-native-background-geolocation", {
          "license": "YOUR_LICENSE_KEY_HERE",
+         "polygonLicense": "YOUR_POLYGON_LICENSE_HERE"
        }
      ]
    ]
  }
}
```

> [!WARNING]
> Polygon Geofencing support for *Expo* requires `react-native-background-geolocation >= 4.16.4`.

### Huawei Mobile Services (HMS) Support

If you've [purchased an *HMS Background Geolocation* License](https://shop.transistorsoft.com/collections/frontpage/products/huawei-background-geolocation) for installing the plugin on _Huawei_ devices without *Google Play Services* installed, add your *HMS Background Geolocation* license key:

```diff
{
  "expo": {
    "name": "your-app-name",
    "plugins": [
      [
        "react-native-background-geolocation", {
          "license": "YOUR_LICENSE_KEY_HERE",
+         "hmsLicense": "YOUR_HMS_LICENSE_HERE"
        }
      ]
    ]
  }
}
```

> [!WARNING]
> Huawei HMS support requires `react-native-background-geolocation >= 3.11.0`.

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
+       "NSMotionUsageDescription": "[CHANGEME] This app uses motion-detection to determine the motion-activity of the device (walking, vehicle, bicycle, etc)"
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
+         "com.transistorsoft.customtask"
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
}
```

### Re-build

You must rebuild your Android app for the added plugins to be evaluated.
- If you're developing locally:

```bash
npx expo prebuild
```

> [!NOTE]
> When using `prebuild`, you must run your app as follows:

```console
$ npx expo run:android
$ npx expo run:ios
```

- If you're using *Expo EAS*, you must first run `eas build`.
- Adjust `--profile` as desired.
- You must build __ALL__ platforms, both *iOS* and *Android*:

```bash
 eas build --profile development
```

## [`react-native-background-fetch`](https://github.com/transistorsoft/react-native-background-fetch)

> [!TIP]
> [`react-native-background-fetch`](https://github.com/transistorsoft/react-native-background-fetch) is helpful for executing a periodic task (eg: every 15 minutes).  You could use `background-fetch` to periodically request the current location:

```dart
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
})
```

