// @flow
// @ts-nocheck
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import type {Int32, Double} from 'react-native/Libraries/Types/CodegenTypes';

/**
 * TurboModule spec for RNBackgroundGeolocation.
 * This matches the Promise-based @ReactMethod signatures in
 * RNBackgroundGeolocationModule.java.
 */
export interface Spec extends TurboModule {
  // Core / config
  +registerPlugin: (name: string) => void;

  +ready: (params: Object) => Promise<Object>;
  +configure: (params: Object) => Promise<Object>;
  +setConfig: (params: Object) => Promise<Object>;
  +reset: (defaultConfig: Object) => Promise<Object>;

  +start: () => Promise<Object>;
  +startSchedule: () => Promise<Object>;
  +stopSchedule: () => Promise<Object>;
  +startGeofences: () => Promise<Object>;
  +stop: () => Promise<Object>;

  +changePace: (moving: boolean) => Promise<boolean>;
  +getState: () => Promise<Object>;

  // Locations / persistence
  +getLocations: () => Promise<Array<Object>>;
  +getCount: () => Promise<Int32>;
  +insertLocation: (params: Object) => Promise<string>;

  // Deprecated alias -> destroyLocations
  +clearDatabase: () => Promise<boolean>;

  +destroyLocations: () => Promise<boolean>;
  +destroyLocation: (uuid: string) => Promise<boolean>;

  +destroyLog: () => Promise<boolean>;
  +sync: () => Promise<Array<Object>>;

  // Geolocation
  +getCurrentPosition: (options: Object) => Promise<Object>;
  +watchPosition: (options: Object) => Promise<Int32>;
  +stopWatchPosition: (watchId: Int32) => Promise<boolean>;

  +getOdometer: () => Promise<Double>;
  +setOdometer: (value: Double) => Promise<Object>;

  // Geofences
  +addGeofence: (config: Object) => Promise<boolean>;
  +addGeofences: (geofences: Array<Object>) => Promise<boolean>;
  +removeGeofence: (identifier: string) => Promise<boolean>;
  +removeGeofences: () => Promise<boolean>;
  +getGeofences: () => Promise<Array<Object>>;
  +getGeofence: (identifier: string) => Promise<Object>;
  +geofenceExists: (identifier: string) => Promise<boolean>;

  // Background tasks
  +beginBackgroundTask: () => Promise<Int32>;
  +finish: (taskId: Int32) => Promise<Int32>;
  +finishHeadlessTask: (taskId: Int32) => Promise<boolean>;

  // Transistor auth token
  +getTransistorToken: (
    orgname: string,
    username: string,
    url: string,
  ) => Promise<Object>;

  +destroyTransistorToken: (url: string) => Promise<boolean>;

  // Logging

  +playSound: (soundId: string) => Promise<boolean>;
  +getLog: (query: Object) => Promise<string>;
  +emailLog: (email: string, query: Object) => Promise<boolean>;
  +uploadLog: (url: string, query: Object) => Promise<boolean>;
  +log: (level: string, message: string) => Promise<boolean>;

  // Device / sensors / settings
  +getSensors: () => Promise<Object>;
  +getDeviceInfo: () => Promise<Object>;
  +isPowerSaveMode: () => Promise<boolean>;
  +isIgnoringBatteryOptimizations: () => Promise<boolean>;

  +requestSettings: (args: Object) => Promise<Object>;
  +showSettings: (args: Object) => Promise<boolean>;

  +getProviderState: () => Promise<Object>;
  +requestPermission: () => Promise<Int32>;
  +requestTemporaryFullAccuracy: (purpose: string) => Promise<Int32>;

  // Required by NativeEventEmitter
  +addListener: (eventName: string) => void;
  +removeListeners: (count: Int32) => void;
}

// Default export used by RN at runtime (for Turbo path).
export default (TurboModuleRegistry.getEnforcing<Spec>(
  'RNBackgroundGeolocation',
): Spec);
