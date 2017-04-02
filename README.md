Background Geolocation for React Native (iOS & Android)
============================================================================

The *most* sophisticated background **location-tracking & geofencing** module with battery-conscious motion-detection intelligence for **iOS** and **Android**.

Also available for [Cordova](https://github.com/transistorsoft/cordova-background-geolocation-lt), [NativeScript](https://github.com/transistorsoft/nativescript-background-geolocation-lt) and pure native apps.

----------------------------------------------------------------------------

:warning: The **[Android module](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)** requires [purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).  However, it *will* work for **DEBUG** builds.  It will **not** work with **RELEASE** builds [without purchasing a license](http://www.transistorsoft.com/shop/products/react-native-background-geolocation).

----------------------------------------------------------------------------

[![Google Play](https://dl.dropboxusercontent.com/u/2319755/cordova-background-geolocaiton/google-play-icon.png)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

![Home](https://www.dropbox.com/s/byaayezphkwn36h/home-framed-350.png?dl=1)
![Settings](https://www.dropbox.com/s/8lvnpp0gowitagq/settings-framed-350.png?dl=1)

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


## :large_blue_diamond: Installing the Plugin

```
$ npm install react-native-background-geolocation --save
```


## :large_blue_diamond: Setup Guides

### iOS
- [Cocoapods](docs/INSTALL-IOS-COCOAPODS.md)
- [rnpm link](docs/INSTALL-IOS-RNPM.md)
- [Manual Installation](docs/INSTALL-IOS.md)

### Android
* [RNPM Setup](docs/INSTALL-ANDROID-RNPM.md)
* [Manual Setup](docs/INSTALL-ANDROID.md)


## :large_blue_diamond: Using the plugin ##

```javascript
import BackgroundGeolocation from "react-native-background-geolocation";
```


## :large_blue_diamond: Example

```Javascript

import BackgroundGeolocation from "react-native-background-geolocation";

var Foo = React.createClass({
  componentWillMount() {
    // 1.  Wire up event-listeners

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

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 25,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
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

## :large_blue_diamond: [Advanced Demo Application for Field-testing](https://github.com/transistorsoft/rn-background-geolocation-demo)

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


