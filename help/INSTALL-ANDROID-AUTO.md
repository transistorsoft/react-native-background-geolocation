# Android Auto-linking Installation

### With `yarn`

```shell
yarn add react-native-background-geolocation
```

### With `npm`
```shell
npm install react-native-background-geolocation --save
```

## Gradle Configuration

Add the following `ext` variables to control the version of Google dependency versions the plugin will align to.

:information_source: You should always strive to use the latest available Google Play Services libraries.  You can determine the latest available version [here](https://developers.google.com/android/guides/setup).


### :open_file_folder: **`android/build.gradle`**

```diff
buildscript {
    ext {
+       playServicesLocationVersion = "21.3.0"  // Or higher.
    }
}


### :open_file_folder: **`android/app/build.gradle`**

```diff
apply plugin: "com.android.application"
apply plugin: "com.facebook.react"

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




