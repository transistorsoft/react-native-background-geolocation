# Android Manual Installation

```bash
$ npm install --save react-native-background-geolocation
```

## Gradle Configuration

:open_file_folder: **`android/settings.gradle`**

```diff
+include ':react-native-background-geolocation'
+project(':react-native-background-geolocation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-background-geolocation/android')
```

* :open_file_folder: **`android/build.gradle`**

```diff
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        // Google now hosts their latest API dependencies on their own maven  server.  
        // React Native will eventually add this to their app template.
+        maven {
+            url 'https://maven.google.com'
+        }
    }
}
```

:open_file_folder: **`android/app/build.gradle`**

```diff
+repositories {
+   flatDir {
+       dirs "../../node_modules/react-native-background-geolocation/android/libs"
+   }
+}

dependencies {
+   compile project(':react-native-background-geolocation')
+   compile(name: 'tslocationmanager', ext: 'aar')
}
```

:information_source: If you have a different play serivces than the one included in this library, use the following instead (switch **`11.2.0`** for the desired version):

:warning: The plugin requires a minimum play-services version of **`11.2.0`**.

```
compile(project(':react-native-background-geolocation')) {
  exclude group: 'com.google.android.gms', module: 'play-services-location'
}
compile 'com.google.android.gms:play-services-location:11.2.0'
```

## AndroidManifest.xml

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

:open_file_folder: **`android/app/main/java/com/.../MainApplication.java`**

```diff
+import com.transistorsoft.rnbackgroundgeolocation.*;
public class MainApplication extends ReactApplication {
  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
+     new RNBackgroundGeolocation(),
      new MainReactPackage()
    );
  }
}
```

## Proguard Config

:open_file_folder: **`android/app/proguard-rules.pro`**

```proguard
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
