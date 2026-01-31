# Advanced Demo App

**react-native-background-geolocation**

This is an **advanced demonstration app** showcasing the full capabilities of the
[react-native-background-geolocation](https://github.com/transistorsoft/react-native-background-geolocation)
plugin, including live tracking, real-time configuration, and geofencing visualization.

The app is intended for **developers** who want to explore advanced features,
inspect runtime behavior, and experiment with configuration changes interactively.

---

## Requirements

- Node.js (LTS recommended)
- React Native CLI environment set up
- Android Studio (for Android)
- Xcode (for iOS)
- CocoaPods (iOS)

Ensure your React Native development environment is properly configured:  
https://reactnative.dev/docs/environment-setup

---

## Installation

### 1. Clone the repository

```console
    git clone https://github.com/transistorsoft/react-native-background-geolocation.git
```

### 2. Navigate to the Advanced demo app
```console
    cd react-native-background-geolocation/example/Advanced
```
### 3. Install dependencies
```console
    npm install
```

---

## Running the App

### Android

Ensure an emulator or device is running, then execute:
```console
    npx react-native run-android
```

### iOS

Install pods (first run only):
```console
    cd ios
    pod install
    cd ..
```

Then run:

```console
    npx react-native run-ios
```

---

## Demo App Overview

The **Advanced Demo App** demonstrates real-world usage patterns and advanced
capabilities of the Background Geolocation SDK.

### UI Controls & SDK Actions

- **Top toolbar toggle**
  - Calls `BackgroundGeolocation.start()` and `BackgroundGeolocation.stop()` to enable or disable tracking.

- **Play / Pause button**
  - Calls `BackgroundGeolocation.changePace(true)` and `BackgroundGeolocation.changePace(false)` to manually toggle the moving / stationary state.
  - The plugin also calls `changePace(isMoving)` automatically when:
    - The device is detected to be moving (typically after ~200 meters of movement), or
    - The device is detected to be stationary for `GeoConfig.stopTimeout` minutes.

- **Location button**
  - Calls `BackgroundGeolocation.getCurrentPosition()` to fetch the current location on demand.

### Advanced Map Screen

- Live location tracking with animated markers
- Motion state visualization (moving / stationary)
- Polylines showing movement paths
- Visual rendering of circular and polygon geofences
- Stationary location indicators

### Advanced Configuration View

- Full configuration UI for the plugin
- Modify **plugin settings in real time**
- Changes are applied immediately without restarting the app
- Explore geolocation, activity recognition, HTTP, persistence, and logging options

### Geofence Creation

- **Long-press on the map** to add geofences
- Choose between:
  - Circular geofences
  - Polygon geofences
- Geofences are rendered instantly on the map
- Entry and exit events are visualized as they occur

### Demo Server Registration

On first launch, the app requires registration with Transistor Software’s demo
tracking server:

https://tracker.transistorsoft.com

You will be prompted to enter:

- Organization
- Username

Once registered:

- A tracker authorization token (JWT) is generated
- Location data is posted to the demo server
- You can view your live tracking results in a browser at:

    https://tracker.transistorsoft.com/<your-organization>

> ⚠️ This demo server is **for testing and demonstration purposes only**.

---

## Notes

- This app is intentionally verbose and feature-rich to expose advanced SDK behavior.
- Configuration changes are persisted and reflected immediately.
- The app is **not intended as a production template**, but as a learning and exploration tool.

---

## Learn More

- Plugin documentation:  
  https://transistorsoft.github.io/react-native-background-geolocation/latest/
- GitHub repository:  
  https://github.com/transistorsoft/react-native-background-geolocation