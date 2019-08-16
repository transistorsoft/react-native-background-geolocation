# Android Auto-linking Installation
### `react-native >= 0.60`

### With `yarn`

```shell
yarn add react-native-background-geolocation

yarn add react-native-background-fetch
```

### With `npm`
```shell
npm install react-native-background-geolocation --save

npm install react-native-background-fetch --save
```

## Gradle Configuration

Add the following `ext` variables to control the version of Google dependency versions the plugin will align to.

:information_source: You should always strive to use the latest available Google Play Services libraries.  You can determine the latest available version [here](https://developers.google.com/android/guides/setup).

### :open_file_folder: **`android/build.gradle`**

```diff
buildscript {
    ext {
+       googlePlayServicesLocationVersion = "17.0.0"
        buildToolsVersion = "28.0.3"
        minSdkVersion = 16
        compileSdkVersion = 28
        targetSdkVersion = 28
        supportLibVersion = "1.0.2"
+       appCompatVersion = "1.0.2"  # <-- IMPORTANT:  For new AndroidX compatibility.
    }
    ...
}
```

### :open_file_folder: **`android/app/build.gradle`**

Background Geolocation requires a gradle extension for your `app/build.gradle`.

```diff
project.ext.react = [
    entryFile: "index.js",
    enableHermes: false,  // clean and rebuild if changing
]

apply from: "../../node_modules/react-native/react.gradle"
+apply from: "../../node_modules/react-native-background-geolocation/android/app.gradle"
```


