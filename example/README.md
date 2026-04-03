# Example Apps

This directory contains example applications demonstrating different levels of
usage of the
[react-native-background-geolocation](https://github.com/transistorsoft/react-native-background-geolocation)
SDK.

Each app is intended to showcase a specific learning path, from minimal
integration to advanced, feature-rich usage.

---

## Available Examples

### Advanced Demo App

**Path:** `./Advanced`

A full-featured demonstration app showcasing advanced capabilities of the SDK,
including:

- Live map visualization
- Real-time configuration editing
- Circular and polygon geofences
- Motion state management
- Demo server registration and tracking

👉 See: [Advanced Demo App](./Advanced)

---

### HelloWorld Demo App

**Path:** `./HelloWorld`

A minimal, stripped-down demo app focused on core SDK concepts, including:

- Starting and stopping tracking
- Manually controlling motion state
- Requesting the current location
- Displaying basic tracking and event state

This app contains **no map view** and **no configuration UI**, making it ideal for
first-time users.

👉 See: [HelloWorld Demo App](./HelloWorld)

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [React Native CLI](https://reactnative.dev/docs/getting-started-without-a-framework)
- Android SDK and/or Xcode

### Clone and install

```bash
git clone https://github.com/transistorsoft/react-native-background-geolocation.git
cd react-native-background-geolocation

# Install SDK dependencies (required — examples reference the SDK via file link)
npm install
```

### Run an example

```bash
cd example/Advanced    # or example/HelloWorld

# Install example dependencies
npm install

# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

### Release builds

```bash
npx react-native run-android --mode=release
npx react-native run-ios --mode Release
```

---

## Which Should I Use?

- Start with **HelloWorld** if you want to understand the basics quickly.
- Use **Advanced** if you want to explore the SDK’s full capabilities and UI
  patterns.

---

## Learn More

- Documentation:  
  https://transistorsoft.github.io/react-native-background-geolocation/latest/
- GitHub repository:  
  https://github.com/transistorsoft/react-native-background-geolocation