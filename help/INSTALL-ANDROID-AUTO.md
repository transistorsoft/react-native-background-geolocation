# Android Auto-linking Installation

### `react-native >= 0.60`

### With `yarn`

```shell
yarn add react-native-background-geolocation

yarn add react-native-background-fetch@^4.2.6
```

### With `npm`
```shell
npm install react-native-background-geolocation --save

npm install react-native-background-fetch@^4.2.6
```

## Configure `react-native-background-fetch`

You must perform the [Android Setup](https://github.com/transistorsoft/react-native-background-fetch/blob/master/docs/INSTALL-AUTO-ANDROID.md) for `react-native-background-fetch`.

## Gradle Configuration

Add the following `ext` variables to control the version of Google dependency versions the plugin will align to.

:information_source: You should always strive to use the latest available Google Play Services libraries.  You can determine the latest available version [here](https://developers.google.com/android/guides/setup).

In addition, custom `maven url` for both `background-geolocation` and `background-fetch` are required.

:information_source: __Note:__ Some recent versions of the React Native Android template may not include the __`allprojects`__ section. You should add this manually as a separate section along with the nested repositories section in the same __`android/build.gradle file`__.

### :open_file_folder: **`android/build.gradle`**

```diff
buildscript {
    ext {
+       minSdkVersion 		= 24	      // Required minimum
+       targetSdkVersion 	= 35          // Or as-desired.
+       compileSdkVersion 	= 34          // Or as-desired
+       appCompatVersion 	= "1.4.2"      // Or higher.  Required for new AndroidX compatibility.
+       googlePlayServicesLocationVersion = "21.0.1"  // Or higher.
    }
    repositories {
        ...
    }
    ...
}

allprojects {   // <-- NOTE:  allprojects container -- If you don't see this, create it.
    repositories {
        .
        .
        .
+       // Required for react-native-background-geolocation
+       maven { url("${project(':react-native-background-geolocation').projectDir}/libs") }
+       // Required for react-native-background-fetch
+       maven { url("${project(':react-native-background-fetch').projectDir}/libs") }
    }
}
```

### :open_file_folder: **`android/app/build.gradle`**

>[!CAUTION]
> __DO NOT OMIT ANY OF THE FOLLOWING INSTRUCTIONS__.  If you ignore any of the following lines, your license key will __fail to validate__.

```diff
apply plugin: "com.android.application"
apply plugin: "com.facebook.react"

+// background-geolocation
+Project background_geolocation = project(':react-native-background-geolocation')
+apply from: "${background_geolocation.projectDir}/app.gradle"

android {
    .
    .
    .
    buildTypes {
        release {
            .
            .
            .
            minifyEnabled enableProguardInReleaseBuilds
+           shrinkResources false
        }
    }
}

```


## AndroidManifest.xml (License Configuration)

> [!NOTE]
> If you've **not** [purchased a license](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans), **ignore this step** &mdash; the plugin is fully functional in *DEBUG* builds so you can try before you [buy](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans).

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
+   <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

### Polygon Geofencing Add-on

> [!NOTE]
> If you've purchased a license for the [Polygon Geofencing add-on](https://shop.transistorsoft.com/products/polygon-geofencing), add the following license key to your __`AndroidManifest`__ (Polygon Geofencing is fully functional in DEBUG builds so you can try before you buy):

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.your.package.id">

  <application>
    <!-- flutter_background_geolocation licence -->
    <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_LICENCE_KEY_HERE" />
    <!-- Background Geolocation Polygon Geofencing Licence -->
+   <meta-data android:name="com.transistorsoft.locationmanager.polygon.license" android:value="YOUR_POLYGON_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

### Huawei Mobile Services (HMS) Support

:warning: Huawei HMS support ended in `v4.19.0` since they failed to release their SDKs with *Android 16KB page size* support.

<!--
> [!NOTE]
> If you've [purchased an *HMS Background Geolocation* License](https://shop.transistorsoft.com/collections/frontpage/products/huawei-background-geolocation) for installing the plugin on _Huawei_ devices without *Google Play Services* installed, add your *HMS Background Geolocation* license key:
-->

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.your.package.id">

  <application>
    <!-- react-native-background-geolocation licence -->
    <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_LICENCE_KEY_HERE" />
    <!-- HMS Background Geolocation licence -->
+   <meta-data android:name="com.transistorsoft.locationmanager.hms.license" android:value="YOUR_HMS_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

## [Configure `react-native-background-fetch`](https://github.com/transistorsoft/react-native-background-fetch/blob/master/docs/INSTALL-AUTO-IOS.md#configure-background-capabilities)

The BackgroundGeolocation SDK makes use internally on __`react-native-background-fetch`__.  Regardless of whether you instend to implement the BackgroundFetch Javascript API in your app, you **must** perform the [Background Fetch iOS Setup](https://github.com/transistorsoft/react-native-background-fetch/blob/master/docs/INSTALL-AUTO-IOS.md#configure-background-capabilities) at __`react-native-background-fetch`__.

> [!TIP]
> `background-fetch` is helpful for executing a periodic task (eg: every 15 minutes).  You could use `background-fetch` to periodically request the current location:

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


