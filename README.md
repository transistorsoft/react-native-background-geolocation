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

Also available for [Flutter](https://github.com/transistorsoft/flutter_background_geolocation), [Cordova](https://github.com/transistorsoft/cordova-background-geolocation-lt), [NativeScript](https://github.com/transistorsoft/nativescript-background-geolocation-lt) and pure native apps.

> [!NOTE]
> The **[Android module](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)** requires [purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).  However, it *will* work for **DEBUG** builds.  It will **not** work with **RELEASE** builds [without purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).  This plugin is supported **full-time** and field-tested **daily** since 2013.

----------------------------------------------------------------------------

[![Google Play](https://dl.dropboxusercontent.com/s/80rf906x0fheb26/google-play-icon.png?dl=1)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

![Home](https://dl.dropboxusercontent.com/s/wa43w1n3xhkjn0i/home-framed-350.png?dl=1)
![Settings](https://dl.dropboxusercontent.com/s/8oad228siog49kt/settings-framed-350.png?dl=1)

# Contents
- ### 😫 [Help!](../../wiki/Help)
- ### :books: [API Documentation](https://transistorsoft.github.io/react-native-background-geolocation)
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

2. Add your license-key to `android/app/src/main/AndroidManifest.xml`:

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
+     <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

## :large_blue_diamond: Using the plugin ##

```javascript
import BackgroundGeolocation from "react-native-background-geolocation";
```

### [Typescript](https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native) API:

For those using [Typescript](https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native) (__recommended__), you can also `import` the interfaces:
```javascript
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  HttpEvent,
  MotionActivityEvent,
  MotionChangeEvent,
  ProviderChangeEvent,
  ConnectivityChangeEvent
} from "react-native-background-geolocation";

```

For more information, see [this blog post](https://medium.com/@transistorsoft/new-feature-typescript-api-4a160a2c853b)

## :large_blue_diamond: Example

There are three main steps to using `BackgroundGeolocation`
1. Wire up event-listeners.
2. `.ready(config)` the plugin.
3. `.start()` the plugin.

> [!WARNING]
> Do not execute *any* API method which will require accessing location-services until the **[`.ready(config)`](https://transistorsoft.github.io/react-native-background-geolocation/classes/backgroundgeolocation.html#ready)** method resolves ([Read its API docs](https://transistorsoft.github.io/react-native-background-geolocation/classes/backgroundgeolocation.html#ready)), For example: 
>- `.getCurrentPosition` 
>- `.watchPosition`
>- `.start`

```javascript
// NO!  .ready() has not resolved.
BackgroundGeolocation.getCurrentPosition(options);
BackgroundGeolocation.start();

BackgroundGeolocation.ready(config).then((state) => {
  // YES -- .ready() has now resolved.
  BackgroundGeolocation.getCurrentPosition(options);
  BackgroundGeolocation.start();  
});

// NO!  .ready() has not resolved.
BackgroundGeolocation.getCurrentPosition(options);
BackgroundGeolocation.start();
```


### Example 1. &mdash; React *Functional Component*

<details>
  <summary>Show Source</summary>

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
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
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

</details>

### Example 2. &mdash; React *Class Component*

<details>
  <summary>Show Source</summary>

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

export default class HelloWorld extends React.Component {
  subscriptions:Subscription[] = [];
  state:any = {};
  constructor(props:any) {
    super(props);
    this.state = {
      enabled: false,
      location: ''
    }
  }

  componentDidMount() {
    /// 1.  Subscribe to BackgroundGeolocation events.
    this.subscriptions.push(BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      this.setState({location: JSON.stringify(location, null, 2)})
    }, (error) => {
      console.log('[onLocation] ERROR:', error);
    }))

    this.subscriptions.push(BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    }))

    this.subscriptions.push(BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
    }))

    this.subscriptions.push(BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    }))

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }).then((state) => {
      this.setState({enabled: state.enabled});
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
    })
  }

  /// When view is destroyed (or refreshed during development live-reload),
  /// remove BackgroundGeolocation event subscriptions.
  componentWillUnmount() {
    this.subscriptions.forEach((subscription) => subscription.remove());
  }

  onToggleEnabled(value:boolean) {
    console.log('[onToggleEnabled]', value);
    this.setState({enabled: value})
    if (value) {
      BackgroundGeolocation.start();
    } else {
      this.setState({location: ''});
      BackgroundGeolocation.stop();
    }
  }

  render() {
    return (
      <View style={{alignItems:'center'}}>
        <Text>Click to enable BackgroundGeolocation</Text>
        <Switch value={this.state.enabled} onValueChange={this.onToggleEnabled.bind(this)} />
        <Text style={{fontFamily:'monospace', fontSize:12}}>{this.state.location}</Text>
      </View>
    )
  }
}
```
</details>

### Promise API

The `BackgroundGeolocation` Javascript API supports [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for *nearly* every method (the exceptions are **`#watchPosition`** and adding event-listeners via **`#onXXX`** method (eg: `onLocation`).  For more information, see the [API Documentation](https://transistorsoft.github.io/react-native-background-geolocation-android)

```javascript
BackgroundGeolocation.ready({
  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH, 
  distanceFilter: 50
}).then(state => {
  console.log('- BackgroundGeolocation is ready: ', state);
}).catch(error => {
  console.warn('- BackgroundGeolocation error: ', error);
});

// Or use await in an async function
try {
  const state = await BackgroundGeolocation.ready({
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH, 
    distanceFilter: 50
  })
  console.log('- BackgroundGeolocation is ready: ', state);
} catch (error) {
  console.warn('- BackgroundGeolocation error: ', error);
}
```

## :large_blue_diamond: [Demo Application](https://github.com/transistorsoft/rn-background-geolocation-demo)

A fully-featured [Demo App](https://github.com/transistorsoft/rn-background-geolocation-demo) is available in its own public repo.  After first cloning that repo, follow the installation instructions in the **README** there.  This demo-app includes a settings-screen allowing you to quickly experiment with all the different settings available for each platform.

![Home](https://dl.dropboxusercontent.com/s/wa43w1n3xhkjn0i/home-framed-350.png?dl=1)
![Settings](https://dl.dropboxusercontent.com/s/8oad228siog49kt/settings-framed-350.png?dl=1)


## :large_blue_diamond: [Simple Testing Server](https://github.com/transistorsoft/background-geolocation-console)

A simple Node-based [web-application](https://github.com/transistorsoft/background-geolocation-console) with SQLite database is available for field-testing and performance analysis.  If you're familiar with Node, you can have this server up-and-running in about **one minute**.

![](https://dl.dropboxusercontent.com/s/px5rzz7wybkv8fs/background-geolocation-console-map.png?dl=1)

![](https://dl.dropboxusercontent.com/s/tiy5b2oivt0np2y/background-geolocation-console-grid.png?dl=1)

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


