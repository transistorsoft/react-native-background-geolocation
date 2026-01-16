// Type-only smoke test to ensure static enum members on BackgroundGeolocation
// align with the shared @transistorsoft/background-geolocation-types definitions.
// This test runs via `pnpm run test:types` using tsc --noEmit.

import BackgroundGeolocation from 'react-native-background-geolocation';

// Accessors — ensure all enum namespaces exist and have valid members.
const logLevelVerbose = BackgroundGeolocation.LogLevel.Verbose;
const desiredAccuracyHigh = BackgroundGeolocation.DesiredAccuracy.High;
const persistModeAll = BackgroundGeolocation.PersistMode.All;
const authJwt = BackgroundGeolocation.AuthorizationStrategy.Jwt;
const policyAdjust = BackgroundGeolocation.LocationFilterPolicy.Adjust;
const kalmanDefault = BackgroundGeolocation.KalmanProfile.Default;
const httpPost = BackgroundGeolocation.HttpMethod.Post;
const triggerWalking = BackgroundGeolocation.TriggerActivity.Walking;
const notificationDefault = BackgroundGeolocation.NotificationPriority.Default;
const activityOther = BackgroundGeolocation.ActivityType.Other;

// Assignments to typed constants to ensure they match the exported type shapes.
let testLogLevel: typeof BackgroundGeolocation.LogLevel = BackgroundGeolocation.LogLevel;
let testDesiredAccuracy: typeof BackgroundGeolocation.DesiredAccuracy = BackgroundGeolocation.DesiredAccuracy;
let testPersistMode: typeof BackgroundGeolocation.PersistMode = BackgroundGeolocation.PersistMode;
let testAuthorizationStrategy: typeof BackgroundGeolocation.AuthorizationStrategy = BackgroundGeolocation.AuthorizationStrategy;
let testLocationFilterPolicy: typeof BackgroundGeolocation.LocationFilterPolicy = BackgroundGeolocation.LocationFilterPolicy;
let testKalmanProfile: typeof BackgroundGeolocation.KalmanProfile = BackgroundGeolocation.KalmanProfile;
let testHttpMethod: typeof BackgroundGeolocation.HttpMethod = BackgroundGeolocation.HttpMethod;
let testTriggerActivity: typeof BackgroundGeolocation.TriggerActivity = BackgroundGeolocation.TriggerActivity;

let testNotificationPriority: typeof BackgroundGeolocation.NotificationPriority =
  BackgroundGeolocation.NotificationPriority;
let testActivityType: typeof BackgroundGeolocation.ActivityType =
  BackgroundGeolocation.ActivityType;
  
// No runtime code — this is a static type check only.
export {};