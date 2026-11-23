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

# (WO-200) Not the R classes: keeping every R field keeps every SDK resource, and resource
# shrinking could never remove the debug sounds.
-keep class !com.transistorsoft.**.R, !com.transistorsoft.**.R$*, com.transistorsoft** { *; }
-dontwarn com.transistorsoft.**

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