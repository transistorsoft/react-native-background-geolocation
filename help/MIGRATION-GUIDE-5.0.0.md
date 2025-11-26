# 🚀 Migration Guide: Flat Config → Compound Config

> **Version:** 5.0.0  
> **Applies to:** `react-native-background-geolocation` v5.0.0 and above

---

## 📢 Overview

Version 5 introduces a new **Compound Config** format that replaces the legacy “flat” config structure. This guide explains how to migrate, shows before/after examples, and highlights key differences for the **React Native** SDK.

---

## ⚙️ Compatibility

The legacy **flat config** style remains fully supported for backward compatibility.  
You can continue using your existing flat configuration if you prefer, though new features may only appear in the compound structure.

> **Recommendation:** New apps and major refactors should migrate to the compound config to stay aligned with the native SDKs and shared type system.

---

## ⏩ Why Compound Config?

- **Clarity:** Groups related settings together (geolocation, HTTP, logging, app lifecycle, etc).
- **Extensibility:** Easier to add new config domains without polluting the top-level.
- **Consistency:** Aligns with native SDKs and shared TypeScript types across platforms.
- **Tooling:** Better IntelliSense / autocomplete when using `@transistorsoft/background-geolocation-types`.

---

## 🏗️ Old vs. New Config Structure (React Native)

### Before (Flat Config – JS/TS)

```ts
import BackgroundGeolocation from 'react-native-background-geolocation';

BackgroundGeolocation.ready({
  desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
  distanceFilter: 50,
  stopOnTerminate: false,
  startOnBoot: true,
  url: 'https://my.server.com/locations',
  headers: { Authorization: 'Bearer TOKEN' },
  logLevel: BackgroundGeolocation.LogLevel.Verbose,
  debug: true,
});
```

### After (Compound Config)

```ts
import BackgroundGeolocation from 'react-native-background-geolocation';

BackgroundGeolocation.ready({
  geolocation: {
    desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
    distanceFilter: 50,
  },
  app: {
    stopOnTerminate: false,
    startOnBoot: true,
  },
  http: {
    url: 'https://my.server.com/locations',
    headers: { Authorization: 'Bearer TOKEN' },
  },
  logger: {
    logLevel: BackgroundGeolocation.LogLevel.Verbose,
    debug: true,
  },
});
```

---

## 🗺️ Mapping Table: Flat → Compound

| Flat Key                | Compound Group | Compound Property         | Example                                      |
|-------------------------|---------------|--------------------------|----------------------------------------------|
| `desiredAccuracy`       | `geolocation` | `desiredAccuracy`        | `geolocation: GeoConfig(desiredAccuracy: ...)` |
| `distanceFilter`        | `geolocation` | `distanceFilter`         |                                              |
| `stopOnTerminate`       | `app`         | `stopOnTerminate`        | `app: AppConfig(stopOnTerminate: ...)`        |
| `startOnBoot`           | `app`         | `startOnBoot`            |                                              |
| `url`                   | `http`        | `url`                    | `http: HttpConfig(url: ...)`                  |
| `headers`               | `http`        | `headers`                |                                              |
| `logLevel`              | `logger`      | `logLevel`               | `logger: LoggerConfig(logLevel: ...)`         |
| `debug`                 | `logger`      | `debug`                  |                                              |
| ...                     | ...           | ...                      |                                              |

> See the [full mapping table](#full-mapping-table) below for all properties.

---

## 🧑‍💻 Migration Steps

1. **Update your dependency:**  
   Ensure you are using `flutter_background_geolocation` v5.0.0 or later.

2. **Import new config classes:**  
   ```dart
   import 'package:flutter_background_geolocation/flutter_background_geolocation.dart';
   ```

3. **Group related options:**  
   - Move geolocation-related keys into `GeoConfig`
   - Move HTTP-related keys into `HttpConfig`
   - Move logging/debug keys into `LoggerConfig`
   - Move app lifecycle keys into `AppConfig`
   - Move activity-recognition keys into `ActivityConfig`
   - Move persistence keys into `PersistenceConfig`

4. **Replace flat keys:**  
   - Instead of passing all options to `Config(...)` directly, pass the relevant compound config objects.
   - Remove any duplicate or conflicting flat keys.

5. **Check for breaking changes:**  
   - Some keys may have been renamed, moved, or refactored.
   - See [Breaking Changes](#breaking-changes) below.

---

## 📝 Example Migration

### Flat Config (Old)
```dart
BackgroundGeolocation.ready(Config(
  desiredAccuracy: Config.DESIRED_ACCURACY_HIGH,
  distanceFilter: 10,
  stopOnTerminate: false,
  startOnBoot: true,
  url: "https://my.server.com/locations",
  headers: { "Authorization": "Bearer TOKEN" },
  logLevel: Config.LOG_LEVEL_DEBUG,
  debug: true,
  autoSync: true,
  batchSync: false,
));
```

### Compound Config (New)
```dart
BackgroundGeolocation.ready(Config(
  geolocation: GeoConfig(
    desiredAccuracy: Config.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
  ),
  app: AppConfig(
    stopOnTerminate: false,
    startOnBoot: true,
  ),
  http: HttpConfig(
    url: "https://my.server.com/locations",
    headers: { "Authorization": "Bearer TOKEN" },
    autoSync: true,
    batchSync: false,
  ),
  logger: LoggerConfig(
    logLevel: LogLevel.debug,
    debug: true,
  ),
));
```

---

## 🧩 Compound Config Groups

| Group         | Class Name         | Description                                 |
|---------------|-------------------|---------------------------------------------|
| `geolocation` | `GeoConfig`       | Location and geofencing options             |
| `app`         | `AppConfig`       | App lifecycle and scheduling                |
| `http`        | `HttpConfig`      | HTTP sync, batching, headers, etc.          |
| `logger`      | `LoggerConfig`    | Debug, log-level, log retention             |
| `activity`    | `ActivityConfig`  | Activity recognition, stop detection        |
| `persistence` | `PersistenceConfig`| Data storage, max days, max records        |

Each group is a separate Dart class. See API docs for details.

---

## 🛠️ Full Mapping Table

| Flat Key                        | Compound Group   | Compound Property                  | Notes                                 |
|----------------------------------|------------------|-------------------------------------|---------------------------------------|
| `desiredAccuracy`                | `geolocation`    | `desiredAccuracy`                   |                                       |
| `distanceFilter`                 | `geolocation`    | `distanceFilter`                    |                                       |
| `stationaryRadius`               | `geolocation`    | `stationaryRadius`                  |                                       |
| `stopTimeout`                    | `geolocation`    | `stopTimeout`                       |                                       |
| `stopAfterElapsedMinutes`        | `geolocation`    | `stopAfterElapsedMinutes`           |                                       |
| `geofenceProximityRadius`        | `geolocation`    | `geofenceProximityRadius`           |                                       |
| `geofenceInitialTriggerEntry`    | `geolocation`    | `geofenceInitialTriggerEntry`       |                                       |
| `geofenceModeHighAccuracy`       | `geolocation`    | `geofenceModeHighAccuracy`          |                                       |
| `pausesLocationUpdatesAutomatically` | `geolocation`| `pausesLocationUpdatesAutomatically`|                                       |
| `showsBackgroundLocationIndicator`| `geolocation`   | `showsBackgroundLocationIndicator`  |                                       |
| `activityType`                   | `geolocation`    | `activityType`                      | iOS only                              |
| `locationAuthorizationAlert`     | `geolocation`    | `locationAuthorizationAlert`        | iOS only                              |
| `maxMonitoredGeofences`          | `geolocation`    | `maxMonitoredGeofences`             |                                       |
| `filter`                         | `geolocation`    | `filter`                            | Advanced filtering                    |
| `stopOnTerminate`                | `app`            | `stopOnTerminate`                   |                                       |
| `startOnBoot`                    | `app`            | `startOnBoot`                       |                                       |
| `enableHeadless`                 | `app`            | `enableHeadless`                    | Android only                          |
| `heartbeatInterval`              | `app`            | `heartbeatInterval`                 |                                       |
| `schedule`                       | `app`            | `schedule`                          |                                       |
| `scheduleUseAlarmManager`        | `app`            | `scheduleUseAlarmManager`           | Android only                          |
| `notification`                   | `app`            | `notification`                      | Android only                          |
| `backgroundPermissionRationale`  | `app`            | `backgroundPermissionRationale`     | Android only                          |
| `preventSuspend`                 | `app`            | `preventSuspend`                    | iOS only                              |
| `url`                            | `http`           | `url`                               |                                       |
| `autoSync`                       | `http`           | `autoSync`                          |                                       |
| `autoSyncThreshold`              | `http`           | `autoSyncThreshold`                 |                                       |
| `disableAutoSyncOnCellular`      | `http`           | `disableAutoSyncOnCellular`         |                                       |
| `batchSync`                      | `http`           | `batchSync`                         |                                       |
| `maxBatchSize`                   | `http`           | `maxBatchSize`                      |                                       |
| `method`                         | `http`           | `method`                            |                                       |
| `params`                         | `http`           | `params`                            |                                       |
| `headers`                        | `http`           | `headers`                           |                                       |
| `rootProperty`/`httpRootProperty`| `http`           | `rootProperty`                      |                                       |
| `timeout`/`httpTimeout`          | `http`           | `timeout`                           |                                       |
| `debug`                          | `logger`         | `debug`                             |                                       |
| `logLevel`                       | `logger`         | `logLevel`                          | Now an enum: `LogLevel`               |
| `logMaxDays`                     | `logger`         | `logMaxDays`                        |                                       |
| `activityRecognitionInterval`     | `activity`       | `activityRecognitionInterval`        | Android only                          |
| `minimumActivityRecognitionConfidence` | `activity`  | `minimumActivityRecognitionConfidence` | Android only                      |
| `disableStopDetection`           | `activity`       | `disableStopDetection`              |                                       |
| `stopOnStationary`               | `activity`       | `stopOnStationary`                  |                                       |
| `motionTriggerDelay`             | `activity`       | `motionTriggerDelay`                | Android only                          |
| `triggerActivities`              | `activity`       | `triggerActivities`                 | Android only                          |
| `disableMotionActivityUpdates`    | `activity`       | `disableMotionActivityUpdates`       | iOS only                              |
| `stopDetectionDelay`             | `activity`       | `stopDetectionDelay`                | iOS only                              |
| `persistMode`                    | `persistence`    | `persistMode`                       |                                       |
| `maxDaysToPersist`               | `persistence`    | `maxDaysToPersist`                  |                                       |
| `maxRecordsToPersist`            | `persistence`    | `maxRecordsToPersist`               |                                       |
| `locationsOrderDirection`        | `persistence`    | `locationsOrderDirection`           |                                       |

> Not all legacy keys are shown above. See API docs for full details.

---

## ⚠️ Breaking Changes

- **Some keys have new enum types:**  
  - `logLevel` is now a `LogLevel` enum (e.g., `LogLevel.info`), but legacy integer values are still supported for backward compatibility. You may use either the new enum or the legacy integer type.
- **Some keys have moved to new groups:**  
  - E.g., `debug` is now in `LoggerConfig`.
- **Legacy flat config remains supported but deprecated:**  
  - Using the legacy flat config will show warnings at runtime, but will **not** result in an error. Migration to the new grouped config is recommended for future compatibility.

---

## 🧪 Testing Your Migration

1. **Run your app after migration.**
2. **Check for errors or warnings** about missing or misplaced config keys.
3. **Review logs** to ensure config is applied as expected.
4. **Consult the API docs** for each config group if unsure.

---

## 🆘 Need Help?

- See the [API Reference](https://transistorsoft.github.io/react-native-background-geolocation/5.0.0-beta/) for each config class.
- Ask questions on [GitHub Discussions](https://github.com/transistorsoft/react-native-background-geolocation/discussions) or [open an issue](https://github.com/transistorsoft/react-native-background-geolocation/issues).

---

## 📚 Resources

- [Full API Reference](https://transistorsoft.github.io/react-native-background-geolocation/5.0.0-beta/)
- [GitHub Project](https://github.com/transistorsoft/react-native-background-geolocation/)
- [Changelog](https://github.com/transistorsoft/react-native-background-geolocation/tree/5.0.0-beta/CHANGELOG.md)

---

## 🎉 Happy Migrating!

If you have suggestions for improving this guide, please open a PR or issue.
