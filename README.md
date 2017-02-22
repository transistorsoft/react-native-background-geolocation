Free iOS Version
============================================================================

This repo hosts the free **iOS** implementation of Background Geolocation for React Native.  The **[Android version](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)** is **on sale now!**

[![Google Play](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/google-play-icon.png)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

Background Geolocation for React Native
============================================================================

The *most* sophisticated background **location-tracking & geofencing** module with battery-conscious motion-detection intelligence for **iOS** and **Android**.

![Home](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/screenshot-iphone5-geofences-framed-README.png)
![Settings](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/screenshot-iphone5-settings-framed-README.png)

Follows the [React Native Modules spec](https://facebook.github.io/react-native/docs/native-modules-ios.html#content).

## [:books: API Documentation](./docs/README.md)
- :wrench: [Configuration Options](./docs/README.md#wrench-configuration-options)
  + [Geolocation Options](./docs/README.md#wrench-geolocation-options)
  + [Activity Recognition Options](./docs/README.md#wrench-activity-recognition-options)
  + [HTTP & Persistence Options](./docs/README.md#wrench-http--persistence-options)
  + [Geofencing Options](./docs/README.md#wrench-geofencing-options)
  + [Application Options](./docs/README.md#wrench-application-options)
- :zap: [Events](./docs/README.md#zap-events)
- :small_blue_diamond: [Methods](./docs/README.md#large_blue_diamond-methods)
- :blue_book: Guides
  + [Philosophy of Operation](../../wiki/Philosophy-of-Operation)
  + [Geofencing](./docs/geofencing.md)
  + [HTTP Features](./docs/http.md)
  + [Location Data Schema](../../wiki/Location-Data-Schema)
  + [Debugging](../../wiki/Debugging)


## Installing the Plugin

### iOS
- [Cocoapods](docs/INSTALL-IOS-COCOAPODS.md)
- [rnpm link](docs/INSTALL-IOS-RNPM.md)
- [Manual Installation](docs/INSTALL-IOS.md)

### Android

## Using the plugin ##

```javascript
import BackgroundGeolocation from "react-native-background-geolocation";
```


## Help

[See the Wiki](https://github.com/transistorsoft/react-native-background-geolocation/wiki)


## Example

```Javascript

import BackgroundGeolocation from "react-native-background-geolocation";

var Foo = React.createClass({
  componentWillMount() {

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.on('location', this.onLocation);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // Now configure the plugin.
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable for debug sounds & notifications
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://posttestserver.com/post.php?dir=cordova-background-geolocation',
      autoSync: true,         // <-- POST each location immediately to server
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
  }
  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    BackgroundGeolocation.un('location', this.onLocation);
    BackgroundGeolocation.un('motionchange', this.onMotionChange);
  }
  onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }
});

```

## [Advanced Demo Application for Field-testing](https://github.com/transistorsoft/rn-background-geolocation-demo)

A fully-featured [Demo App](https://github.com/transistorsoft/rn-background-geolocation-demo) is available in its own public repo.  After first cloning that repo, follow the installation instructions in the **README** there.  This demo-app includes a settings-screen allowing you to quickly experiment with all the different settings available for each platform.


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


