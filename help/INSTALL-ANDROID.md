# Android Manual Installation

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation--save
```

## Gradle Configuration

### :open_file_folder: **`android/settings.gradle`**

```diff
+include ':react-native-background-geolocation'
+project(':react-native-background-geolocation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-background-geolocation/android')

+include ':react-native-background-fetch'
+project(':react-native-background-fetch').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-background-fetch/android')
```

-------------------------------------------------------------------------------


### :open_file_folder: **`android/build.gradle`**

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


#### :information_source: Project-wide Configuration Properties

The technique of **defining project-wide properties** can be found in the **Android Developer Document** [Gradle Tip &amp; Tricks](https://developer.android.com/studio/build/gradle-tips.html) (see *Configure project-wide properties*) and another good explanation [here](https://segunfamisa.com/posts/android-gradle-extra-properties).  The *BackgroundGeolocation* plugin [is aware of the presense of these configuration properties](../android/build.gradle#L3-L18).

-------------------------------------------------------------------------------


## AndroidManifest.xml

If you've **not** [purchased a license](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans), **ignore this step** &mdash; the plugin is fully functional in *DEBUG* builds so you can try before you [buy](https://www.transistorsoft.com/shop/products/react-native-background-geolocation#plans).

:open_file_folder: **`android/app/src/main/AndroidManifest.xml`**

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

:information_source: [Purchase a License](http://www.transistorsoft.com/shop/products/react-native-background-geolocation)

## MainApplication.java

### :open_file_folder: `android/app/main/java/com/.../MainApplication.java`

```diff
+import com.transistorsoft.rnbackgroundgeolocation.*;
+import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
public class MainApplication extends ReactApplication {
  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
+     new RNBackgroundGeolocation(),
+     new RNBackgroundFetchPackage(),
      new MainReactPackage()
    );
  }
}
```

## Proguard Config

If you've enabled **`def enableProguardInReleaseBuilds = true`** in your `app/build.gradle`, be sure to add the following items to your `proguard-rules.pro`:

### :open_file_folder: `proguard-rules.pro` (`android/app/proguard-rules.pro`)

```proguard
-keepnames class com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation
-keepnames class com.facebook.react.ReactActivity

# BackgroundGeolocation
-keep class com.transistorsoft.** { *; }
-dontwarn com.transistorsoft.**

# OkHttp
-dontwarn okio.**

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
```
