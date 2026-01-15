| <img src="https://dl.dropbox.com/s/gxl3sr8znhkrtah/expo-logo.png?dl=1" alt="alt text" width="32" /> | Now with *Expo* support |
| --- | --- |


Background Geolocation for React Native &middot; [![npm](https://img.shields.io/npm/dm/react-native-background-geolocation.svg)]() [![npm](https://img.shields.io/npm/v/react-native-background-geolocation.svg)]()
============================================================================

[![](https://dl.dropboxusercontent.com/s/nm4s5ltlug63vv8/logo-150-print.png?dl=1)](https://www.transistorsoft.com)

-------------------------------------------------------------------------------

The *most* sophisticated background **location-tracking & geofencing** module with battery-conscious motion-detection intelligence for **iOS** and **Android**.

The plugin's [Philosophy of Operation](../../wiki/Philosophy-of-Operation) is to use **motion-detection** APIs (using accelerometer, gyroscope and magnetometer) to detect when the device is *moving* and *stationary*.

- When the device is detected to be **moving**, the plugin will *automatically* start recording a location according to the configured `distanceFilter` (meters).

- When the device is detected be **stationary**, the plugin will automatically turn off location-services to conserve energy.

Also available for [Flutter](https://github.com/transistorsoft/flutter_background_geolocation), [Cordova](https://github.com/transistorsoft/cordova-background-geolocation-lt), [Capacitor](https://github.com/transistorsoft/capacitor-background-geolocation) and pure native apps.

> [!NOTE]
> The **[Android module](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)** requires [purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).  However, it *will* work for **DEBUG** builds.  It will **not** work with **RELEASE** builds [without purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).  This plugin is supported **full-time** and field-tested **daily** since 2013.

----------------------------------------------------------------------------

[![Google Play](https://dl.dropboxusercontent.com/s/80rf906x0fheb26/google-play-icon.png?dl=1)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

![Home](https://dl.dropboxusercontent.com/s/wa43w1n3xhkjn0i/home-framed-350.png?dl=1)
![Settings](https://dl.dropboxusercontent.com/s/8oad228siog49kt/settings-framed-350.png?dl=1)

> [!CAUTION]
> This README references the new  __`v5.x`__ branch of the SDK.  If you're using __`v4.x`__, you must reference [__`v4.x`__](https://github.com/transistorsoft/react-native-background-geolocation/tree/4.19.4) branch.

# Contents
- ### 😫 [Help!](../../wiki/Help)
- ### :books: [API Documentation](https://transistorsoft.github.io/react-native-background-geolocation/latest)
- ### [Installing the Plugin](#large_blue_diamond-installing-the-plugin)
- ### [Setup Guides](#large_blue_diamond-setup-guides)
- ### [Configure your License](#large_blue_diamond-configure-your-license)
- ### [Using the plugin](#large_blue_diamond-using-the-plugin)
- ### [Example](#large_blue_diamond-example)
- ### [Debugging](../../wiki/Debugging)
- ### [Demo Application](#large_blue_diamond-demo-application)
- ### [Testing Server](#large_blue_diamond-simple-testing-server)
- ### [Privacy Policy](help/PRIVACY_POLICY.md)

## :large_blue_diamond: Installing the Plugin


### With *Expo*

```shell
npx expo install react-native-background-geolocation
```

### With `yarn`

```bash
yarn add react-native-background-geolocation
```

### With `npm`
```
$ npm install react-native-background-geolocation --save
```

## :large_blue_diamond: Setup Guides

### Expo
- [Expo Setup](help/INSTALL-EXPO.md)

### iOS
- [Auto-linking Setup](help/INSTALL-IOS-AUTO.md)

### Android
- [Auto-linking Setup](help/INSTALL-ANDROID-AUTO.md)


## :large_blue_diamond: Configure your license

1. Login to Customer Dashboard to generate an application key:
[www.transistorsoft.com/shop/customers](http://www.transistorsoft.com/shop/customers)
![](https://gallery.mailchimp.com/e932ea68a1cb31b9ce2608656/images/b2696718-a77e-4f50-96a8-0b61d8019bac.png)

2. __`[Android]`__ Add your license-key to `android/app/src/main/AndroidManifest.xml`:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.transistorsoft.backgroundgeolocation.react">

  <application
    android:name=".MainApplication"
    android:allowBackup="true"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:theme="@style/AppTheme">

    <!-- react-native-background-geolocation licence -->
+     <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_ANDROID_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

3. __`[iOS]`__ Add your license-key to your __`Info.plist`__

|      Key     |     Type     |     Value     |
|-----|-------|-------------|
| *`TSLocationManagerLicense`* | `String` | `                    <PASTE YOUR IOS LICENSE KEY HERE>                     ` |

 __`TSLocationManagerLicense`__.  Paste the contents of your license key into the __`value`__.

## :large_blue_diamond: Using the plugin ##

```javascript
import BackgroundGeolocation from "react-native-background-geolocation";
```

## :large_blue_diamond: Example

There are three main steps to using `BackgroundGeolocation`
1. Wire up event-listeners.
2. `.ready(config)` the plugin.
3. `.start()` the plugin.

> [!WARNING]
> Do not execute *any* API method which will require accessing location-services until the **[`.ready(config)`](https://transistorsoft.github.io/react-native-background-geolocation/latest/interfaces/BackgroundGeolocation.html#ready)** method resolves ([Read its API docs](https://transistorsoft.github.io/react-native-background-geolocation/latest/interfaces/BackgroundGeolocation.html#ready)), For example: 
>- `.getCurrentPosition` 
>- `.watchPosition`
>- `.start`

```javascript
// NO!  .ready() has not resolved.
await BackgroundGeolocation.getCurrentPosition(options);
await BackgroundGeolocation.start();

// First call .ready(config)
const state = await BackgroundGeolocation.ready(config);
const location = await BackgroundGeolocation.getCurrentPosition(options);
await BackgroundGeolocation.start();  


// NO!  .ready() has not resolved.
const location = await BackgroundGeolocation.getCurrentPosition(options);
await BackgroundGeolocation.start();
```


### Example

```javascript

import React from 'react';
import {
  Switch,
  Text,
  View,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  Subscription
} from "react-native-background-geolocation";

const HelloWorld = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');

  React.useEffect(() => {
    /// 1.  Subscribe to events.
    const onLocation:Subscription = BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      setLocation(JSON.stringify(location, null, 2));
    })

    const onMotionChange:Subscription = BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange:Subscription = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
    })

    const onProviderChange:Subscription = BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    })

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      geolocation: {
        desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High
        distanceFilter: 10,
        stopTimeout: 5
      },
      // Logger Config
      logger: {      
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        logLevel: BackgroundGeolocation.LogLevel.Verbose
      },
      // Application config
      app: {
        stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
        startOnBoot: true         // <-- Auto start tracking when device is powered-up.
      },      
      // Http Config
      http: {
        url: 'http://yourserver.com/locations',
        batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
        headers: {              // <-- Optional HTTP headers
          "X-FOO": "bar"
        },
        params: {               // <-- Optional HTTP params
          "auth_token": "maybe_your_server_authenticates_via_token_YES?"
        }
      }
    }).then((state) => {
      setEnabled(state.enabled)
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    }
  }, []);

  /// 3. start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <View style={{alignItems:'center'}}>
      <Text>Click to enable BackgroundGeolocation</Text>
      <Switch value={enabled} onValueChange={setEnabled} />
      <Text style={{fontFamily:'monospace', fontSize:12}}>{location}</Text>
    </View>
  )
}

export default HelloWorld;
```

## :large_blue_diamond: [Demo Application](example)

Clone this repo and run the [/example](example) app.


# License

The MIT License (MIT)

Copyright (c) 2018 Chris Scott, Transistor Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


