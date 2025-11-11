# JNI surface
-keepnames class com.transistorsoft.locationmanager.a.A
-keepclassmembers class com.transistorsoft.locationmanager.a.A {
    public static void r(boolean);
    public static boolean getDBFlag();
}
#######################################################################
# TSConfig reflection (metadata + state + editors)
#######################################################################
-keepattributes *Annotation*,Signature,EnclosingMethod,InnerClasses

# Keep the annotation TYPES so they exist at runtime
-keep class com.transistorsoft.locationmanager.config.meta.ConfigProp { *; }
-keep class com.transistorsoft.locationmanager.config.meta.ConfigSpec { *; }
-keep class com.transistorsoft.locationmanager.config.meta.ConfigGroup { *; }
-keep class com.transistorsoft.locationmanager.config.meta.CtorOrder { *; }

# Keep field names + ctors for state modules; FieldIndex uses getters/ctors by name/signature
-keepnames class com.transistorsoft.locationmanager.config.state.** { *; }
-keepclassmembers class com.transistorsoft.locationmanager.config.state.** {
    <fields>;
    <init>(...);
}

# Keep module field names on the aggregate ConfigState
-keepnames class com.transistorsoft.locationmanager.config.state.ConfigState {
    <fields>;
    <init>(...);
}

# Keep Editor and sub-editors members that routing may reflect
-keepnames class com.transistorsoft.locationmanager.config.edit.Editor { *; }
-keepclassmembers class com.transistorsoft.locationmanager.config.edit.Editor {
    <fields>;
    <init>(...);
}
-keepclassmembers class com.transistorsoft.locationmanager.config.edit.** {
    public <init>(...);
    public ** set*(...);
    <fields>;
}
-keepnames class com.transistorsoft.locationmanager.config.TSConfig
-keepclassmembers class com.transistorsoft.locationmanager.config.TSConfig { public static void r(boolean); }
-keepnames class com.transistorsoft.locationmanager.logger.TSLog
-keepclassmembers class com.transistorsoft.locationmanager.logger.TSLog { public static void r(boolean); }
-keepnames class com.transistorsoft.locationmanager.service.AbstractService
-keepclassmembers class com.transistorsoft.locationmanager.service.AbstractService { public static void r(boolean); }

# Services (names + ctors)
-keep class com.transistorsoft.locationmanager.service.** extends com.transistorsoft.locationmanager.service.AbstractService
-keepclassmembers class com.transistorsoft.locationmanager.service.** extends com.transistorsoft.locationmanager.service.AbstractService { <init>(...); }

# Scheduler components
-keep class com.transistorsoft.locationmanager.scheduler.ScheduleAlarmReceiver
-keep class com.transistorsoft.locationmanager.scheduler.ScheduleJobService
-keep class com.transistorsoft.locationmanager.scheduler.ScheduleService
-keepclassmembers class com.transistorsoft.locationmanager.scheduler.ScheduleAlarmReceiver { <init>(...); }
-keepclassmembers class com.transistorsoft.locationmanager.scheduler.ScheduleJobService { <init>(...); }
-keepclassmembers class com.transistorsoft.locationmanager.scheduler.ScheduleService { <init>(...); }

# Cross-module DTOs
-keepnames class com.transistorsoft.locationmanager.data.SQLQuery
-keepclassmembers class com.transistorsoft.locationmanager.data.SQLQuery { public static *; }
-keepnames class com.transistorsoft.locationmanager.data.LocationModel
-keepclassmembers class com.transistorsoft.locationmanager.data.LocationModel { public *; }

# EventBus reflection
-keepattributes *Annotation*
-keepclassmembers class * { @org.greenrobot.eventbus.Subscribe <methods>; }
-keep enum org.greenrobot.eventbus.ThreadMode { *; }
-keep class org.greenrobot.eventbus.android.AndroidComponentsImpl

# (Optional) Flutter plugin entry
-keepnames class com.transistorsoft.flutter.backgroundgeolocation.FLTBackgroundGeolocationPlugin

# OkHttp/logging quiets (unchanged)
-dontwarn okio.**
-dontwarn okhttp3.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-keep class ch.qos** { *; }
-keep class org.slf4j** { *; }
-dontwarn ch.qos.logback.core.net.*
