-keepnames class com.facebook.react.ReactActivity

# for react-native Headless on new architecture
-keep class com.facebook.react.defaults.DefaultNewArchitectureEntryPoint {
  public <methods>;
}
-keep class com.facebook.react.ReactApplication {
  public <methods>;
}
-keep class com.facebook.react.ReactHost {
  public <methods>;
}
-keep class * extends com.facebook.react.ReactHost {
  public <methods>;
}
-keep class com.facebook.react.fabric.** { *; }

-keepnames class com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation

-keep class com.transistorsoft** { *; }
-dontwarn com.transistorsoft.**

# Huawei HMS Adapter
-dontwarn com.transistorsoft.xms.**
-dontwarn com.huawei.**

-keep class com.google.android.gms.** {*;}
-keep interface com.google.android.gms.** {*;}

# BackgroundGeolocation (EventBus)
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# And if you use AsyncExecutor:
-keepclassmembers class * extends org.greenrobot.eventbus.util.ThrowableFailureEvent {
    <init>(java.lang.Throwable);
}

# logback
-keep class ch.qos** { *; }
-keep class org.slf4j** { *; }
-dontwarn ch.qos.logback.core.net.*

# OkHttp3
-dontwarn okio.**
-dontwarn okhttp3.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
# A resource is loaded with a relative path so the package of this class must be preserved.
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# LifecycleObserver
-keep class androidx.lifecycle.FullLifecycleObserver
