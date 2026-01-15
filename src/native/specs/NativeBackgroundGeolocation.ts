import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  // Core lifecycle
  ready(config: Object): Promise<Object>;
  setConfig(config: Object): Promise<Object>;
  reset(config: Object | null): Promise<Object>;
  getState(): Promise<Object>;

  start(): Promise<Object>;
  stop(): Promise<Object>;
  startGeofences(): Promise<Object>;
  startSchedule(): Promise<Object>;
  stopSchedule(): Promise<Object>;

  // Geolocation
  getCurrentPosition(options: Object): Promise<Object>;
  changePace(isMoving: boolean): Promise<void>;
  getOdometer(): Promise<number>;
  setOdometer(value: number): Promise<Object>;

  // HTTP & DB
  getLocations(): Promise<Array<Object>>;
  getCount(): Promise<number>;
  destroyLocations(): Promise<void>;
  sync(): Promise<Array<Object>>;

  // Device / settings
  getProviderState(): Promise<Object>;
  getDeviceInfo(): Promise<Object>;
  isPowerSaveMode(): Promise<boolean>;
  isIgnoringBatteryOptimizations(): Promise<boolean>;
  requestPermission(): Promise<number>;
  requestTemporaryFullAccuracy(purpose: string): Promise<number>;

  // Transistor token helpers
  getTransistorToken(
    orgname: string,
    username: string,
    url: string,
  ): Promise<Object>;
  destroyTransistorToken(url: string): Promise<void>;

  // Logging
  log(level: string, message: string): Promise<void>;
  getLog(query: Object): Promise<string>;
  emailLog(email: string, query: Object): Promise<void>;
  uploadLog(url: string, query: Object): Promise<void>;
  destroyLog(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNBackgroundGeolocation');