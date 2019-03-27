# Android Installation with `react-native link`

### With `yarn`

```shell
yarn add react-native-background-geolocation

react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

### With `npm`
```shell
npm install react-native-background-geolocation--save

react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

## Gradle Configuration

react-native link does a nice job, but we need to do a bit of manual setup.

### :open_file_folder: **`android/build.gradle`**

Add the `googlePlayServicesLocation` Gradle variable.  This controls the version of `play-services:location` the SDK will use.

:information_source: You should always strive to use the latest available Google Play Services libraries.  You can determine the latest available version [here](https://developers.google.com/android/guides/setup).

```diff
buildscript {
    ext {
        buildToolsVersion = "28.0.3"
        minSdkVersion = 16
        compileSdkVersion = 28
        targetSdkVersion = 27
        supportLibVersion = "28.0.0"
        // You can control the SDK's version of play-services:location
        // You should always use the latest available version.
+       googlePlayServicesLocationVersion = "16.0.0"
    }
    .
    .
    .
}

allprojects {
    repositories {
        mavenLocal()
        google()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
+       maven {
+           url "$rootDir/../node_modules/react-native-background-geolocation/android/libs"
+       }
+       maven {
+           url "$rootDir/../node_modules/react-native-background-fetch/android/libs"
+       }
    }
}
```

## AndroidManifest.xml

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

### :open_file_folder: `proguard-rules.pro` (`android/app/proguard-rules.pro`)

```proguard
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

