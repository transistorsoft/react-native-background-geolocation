# Android Installation with `react-native link`

## `react-native <= 0.59`

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

### `react-native link`
```shell
react-native link react-native-background-geolocation
react-native link react-native-background-fetch
```

## Gradle Configuration

The `react-native link` command has automatically added a new Gradle `ext` parameter **`googlePlayServicesLocationVersion`**.  You can Use this to control the version of `play-services:location` used by the Background Geolocation SDK.

:information_source: You should always strive to use the latest available Google Play Services libraries.  You can determine the latest available version [here](https://developers.google.com/android/guides/setup).

### :open_file_folder: **`android/build.gradle`**

```diff
buildscript {
    ext {
+       googlePlayServicesLocationVersion = "16.0.0"
        buildToolsVersion = "28.0.3"
        minSdkVersion = 16
        compileSdkVersion = 28
        targetSdkVersion = 28
        supportLibVersion = "28.0.0"
    }
    .
    .
    .
}
```

### :open_file_folder: **`android/app/build.gradle`**

Background Geolocation requires a gradle extension for your `app/build.gradle`.

```diff
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

