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


## AndroidManifest.xml (License Configuration)

If you've **not** [purchased a license](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans), **ignore this step** &mdash; the plugin is fully functional in *DEBUG* builds so you can try before you [buy](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans).

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


## Proguard Config

If you've enabled **`def enableProguardInReleaseBuilds = true`** in your `app/build.gradle`, be sure to add the following items to your `proguard-rules.pro`:

### :open_file_folder: `proguard-rules.pro` (`android/app/proguard-rules.pro`)

```proguard
-keepnames class com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation
-keepnames class com.facebook.react.ReactActivity

# BackgroundGeolocation lib tslocationmanager.aar is *already* proguarded
-keep class com.transistorsoft.** { *; }
-dontwarn com.transistorsoft.**

# BackgroundGeolocation (EventBus)
-keepclassmembers class * extends de.greenrobot.event.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}
-keepattributes *Annotation*
-keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
-keepclassmembers class * extends org.greenrobot.eventbus.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}

# logback
-keep class ch.qos.** { *; }
-keep class org.slf4j.** { *; }
-dontwarn ch.qos.logback.core.net.*

# OkHttp3
-dontwarn okio.**
```



