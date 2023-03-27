# Android Auto-linking Installation

### `react-native >= 0.60`

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

- __For `background-geolocation >= 4.0.0`:__
```
yarn add react-native-background-fetch@^4.1.0
```

- __For `background-geolocation >= 3.6.0 < 4.0.0`:__
```
yarn add react-native-background-fetch@3.1.0
```

- For __`background-geolocation <= 3.5.0`__
```
yarn add react-native-background-fetch@2.7.1
```


### With `npm`
```shell
npm install react-native-background-geolocation --save
```

- __For `background-geolocation >= 4.0.0`:__
```
npm install react-native-background-fetch@^4.1.0
```

- For __`background-geolocation >= 3.6.0 < 4.0.0`:__
```
npm install react-native-background-fetch@3.1.0 --save
```

- For __`background-geolocation <= 3.5.0`:__
```
npm install react-native-background-fetch@2.7.1 --save
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
        minSdkVersion = 16
        targetSdkVersion = 31           // Or higher.
+       compileSdkVersion = 31          // Or higher.
+       appCompatVersion = "1.4.2"      // Or higher.  Required for new AndroidX compatibility.
+       googlePlayServicesLocationVersion = "20.0.0"  // Or higher.
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
+       maven {
+           // Required for react-native-background-geolocation
+           url("${project(':react-native-background-geolocation').projectDir}/libs")
+       }
+       maven {
+           // Required for react-native-background-fetch
+           url("${project(':react-native-background-fetch').projectDir}/libs")
+       }
+    }
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

+Project background_geolocation = project(':react-native-background-geolocation')
+apply from: "${background_geolocation.projectDir}/app.gradle"
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

### Huawei Mobile Services (HMS) Support

If you've [purchased an *HMS Background Geolocation* License](https://shop.transistorsoft.com/collections/frontpage/products/huawei-background-geolocation) for installing the plugin on _Huawei_ devices without *Google Play Services* installed, add your *HMS Background Geolocation* license key:

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
:warning: Huawei HMS support requires `react-native-background-geolocation >= 3.11.0`.

## Proguard Config

If you've enabled **`def enableProguardInReleaseBuilds = true`** in your `app/build.gradle`, be sure to add the BackgroundGeolocation SDK's `proguard-rules.pro` to your **`proguardFiles`**:

### :open_file_folder: `android/app/build.gradle`)

```diff
/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = true
.
.
.
android {
    .
    .
    .
    buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            // Add following proguardFiles (leave existing one above untouched)
+           proguardFiles "${background_geolocation.projectDir}/proguard-rules.pro"
            signingConfig signingConfigs.release
        }
    }
}
```

:warning: If you get error `"ERROR: Could not get unknown property 'background_geolocation' for project ':app'"`, see [above](#open_file_folder-androidappbuildgradle) and make sure to define the `Project background_geolocation`.



