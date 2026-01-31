# HelloWorld Demo App

**react-native-background-geolocation**

This is a **minimal demonstration app** showcasing the core functionality of the
[react-native-background-geolocation](https://github.com/transistorsoft/react-native-background-geolocation)
plugin.

The app is intentionally **simplified** compared to the Advanced demo and is
designed to demonstrate basic SDK usage, lifecycle control, and event handling
without maps or complex configuration UI.

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

    git clone https://github.com/transistorsoft/react-native-background-geolocation.git

### 2. Navigate to the HelloWorld demo app

    cd react-native-background-geolocation/example/HelloWorld

### 3. Install dependencies

    npm install

---

## Running the App

### Android

Ensure an emulator or device is running, then execute:

    npx react-native run-android

### iOS

Install pods (first run only):

    cd ios
    pod install
    cd ..

Then run:

    npx react-native run-ios

---

## Demo App Overview

The **HelloWorld Demo App** provides a stripped-down example of how to integrate
and interact with the Background Geolocation SDK.

It focuses on **core SDK concepts** without advanced UI, mapping, or live
configuration features.

### UI Controls & SDK Actions

- **Tracking toggle**
  - Calls `BackgroundGeolocation.start()` and `BackgroundGeolocation.stop()` to
    enable or disable location tracking.

- **Play / Pause button**
  - Calls `BackgroundGeolocation.changePace(true)` and
    `BackgroundGeolocation.changePace(false)` to manually toggle the moving /
    stationary state.
  - The plugin also calls `changePace(isMoving)` automatically when:
    - The device is detected to be moving (typically after ~200 meters), or
    - The device is detected to be stationary for `GeoConfig.stopTimeout` minutes.

- **Get Current Position button**
  - Calls `BackgroundGeolocation.getCurrentPosition()` to request a single
    high-accuracy location sample on demand.

### Status & Event Display

- Displays current:
  - Tracking state (enabled / disabled)
  - Motion state (moving / stationary)
  - Activity type (still, walking, running, in_vehicle, etc.)
  - Last recorded location (coordinates, speed, accuracy)
  - Odometer distance

- Subscribes to core SDK events:
  - `onLocation`
  - `onMotionChange`
  - `onActivityChange`
  - `onProviderChange`
  - `onGeofence` (if geofences are configured programmatically)

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
- Tracking results can be viewed in a browser at:

    https://tracker.transistorsoft.com/<your-organization>

> ⚠️ This demo server is **for testing and demonstration purposes only**.

---

## Differences from the Advanced Demo App

The HelloWorld app intentionally omits:

- Map view and geofence visualization
- Live configuration editor
- Polygon and circular geofence creation UI
- Advanced debugging and management actions

For full feature demonstrations, see the **Advanced** demo app.

---

## Notes

- This app is designed for **learning and reference**, not production use.
- SDK configuration is defined in code and is not editable at runtime.
- Ideal as a starting point for understanding SDK lifecycle and event flow.

---

## Learn More

- Plugin documentation:  
  https://transistorsoft.github.io/react-native-background-geolocation/latest/
- GitHub repository:  
  https://github.com/transistorsoft/react-native-background-geolocation