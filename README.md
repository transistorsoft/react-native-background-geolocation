Free iOS Version
=============================
This repo hosts the free **iOS** implementation of Background Geolocation for React Native.  The **[Android version](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)** is **on sale now!**

[![Google Play](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/google-play-icon.png)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

Background Geolocation for React Native
==============================

Cross-platform background geolocation module for React Native with battery-saving **"circular stationary-region monitoring"** and **"stop detection"**.

![Home](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/screenshot-iphone5-geofences-framed-README.png)
![Settings](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/screenshot-iphone5-settings-framed-README.png)

Follows the [React Native Modules spec](https://facebook.github.io/react-native/docs/native-modules-ios.html#content).

## Installing the Plugin

### iOS
- [Cocoapods](docs/INSTALL-IOS-COCOAPODS.md)
- [rnpm link](docs/INSTALL-IOS-RNPM.md)
- [Manual Installation](docs/INSTALL-IOS.md)

### Android

## Using the plugin ##

```Javascript
import BackgroundGeolocation from "react-native-background-geolocation";
```

## Documentation
- [API Documentation](docs/README.md)
- [Advanced Geofencing](docs/geofencing.md)
- [Location Data Schema](../../wiki/Location-Data-Schema)
- [Error Codes](../../wiki/Error-Codes)
- [Debugging Sounds](../../wiki/Debug-Sounds)
- [Geofence Features](../../wiki/Geofence-Features)
  
## Help

[See the Wiki](https://github.com/transistorsoft/react-native-background-geolocation/wiki)

## Example

```Javascript

import BackgroundGeolocation from "react-native-background-geolocation";

var Foo = React.createClass({
  componentWillMount() {

    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation
      life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      }
    }, function(state) {
      console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          console.log("- Start success");
        });
      }
    });

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation);

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on('error', this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // This event fires when a chnage in motion activity is detected
    BackgroundGeolocation.on('activitychange', this.onActivityChange);

    // This event fires when the user toggles location-services
    BackgroundGeolocation.on('providerchange', this.onProviderChange);
  }
  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation);
    BackgroundGeolocation.un('error', this.onError);
    BackgroundGeolocation.un('motionchange', this.onMotionChange);
    BackgroundGeolocation.un('activitychange', this.onActivityChange);
    BackgroundGeolocation.un('providerchange', this.onProviderChange);
  }
  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onError(error) {
    var type = error.type;
    var code = error.code;
    alert(type + " Error: " + code);
  }
  onActivityChange(activityName) {
    console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
  }
  onProviderChange(provider) {
    console.log('- Location provider changed: ', provider.enabled);    
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }
});

```

## [Advanced Demo Application for Field-testing](https://github.com/transistorsoft/rn-background-geolocation-demo)

A fully-featured [Demo App](https://github.com/transistorsoft/rn-background-geolocation-demo) is available in its own public repo.  After first cloning that repo, follow the installation instructions in the **README** there.  This demo-app includes a settings-screen allowing you to quickly experiment with all the different settings available for each platform.

## Help!  It doesn't work!

Yes it does.  [See the Wiki](https://github.com/transistorsoft/react-native-background-geolocation/wiki)

- on iOS, background tracking won't be engaged until you travel about **2-3 city blocks**, so go for a walk or car-ride (or use the Simulator with ```Debug->Location->City Drive```)
- Android is much quicker detecting movements; typically several meters of walking will do it.
- When in doubt, **nuke everything**:  First delete the app from your device (or simulator)

## Behaviour

The plugin has features allowing you to control the behaviour of background-tracking, striking a balance between accuracy and battery-usage.  In stationary-mode, the plugin attempts to descrease its power usage and accuracy by setting up a circular stationary-region of configurable #stationaryRadius.  

iOS has a nice system  [Significant Changes API](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges), which allows the os to suspend your app until a cell-tower change is detected (typically 2-3 city-block change) 

The plugin will execute your configured event-listener subscribed to by the `onLocation(callback)` method.  Both iOS & Android use a SQLite database to persist **every** recorded geolocation so you don't have to worry about persistence when no network is detected.  The plugin provides a Javascript API to fetch and destroy the records in the database.  In addition, the plugin has an optional HTTP layer allowing allowing you to automatically HTTP POST recorded geolocations to your server.

The function `changePace({Boolean})` is provided to force the plugin to enter `moving` or `stationary` state.

## iOS

The plugin uses iOS Significant Changes API, and starts triggering your configured `callback` only when a cell-tower switch is detected (i.e. the device exits stationary radius). 

When the plugin detects the device has moved beyond its configured `#stationaryRadius` (typically 2-3 city blocks), it engages the native location API for **aggressive monitoring** according to the configured `#desiredAccuracy`, `#distanceFilter`.

The plugin will continue tracking the device's location even after the user closes the app (`stopOnTerminate: false`) or reboots the device.

# License

The MIT License (MIT)

Copyright (c) 2015 Chris Scott, Transistor Software

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


