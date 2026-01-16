'use strict';

import { NativeModules } from "react-native"

const { RNBackgroundGeolocation } = NativeModules;

const IGNORE_BATTERY_OPTIMIZATIONS = "IGNORE_BATTERY_OPTIMIZATIONS";
const POWER_MANAGER = "POWER_MANAGER";

let resolveSettingsRequest = function(resolve, request) {
  if (request.lastSeenAt > 0) {
    request.lastSeenAt = new Date(request.lastSeenAt);
  }
  resolve(request);
}

export default class DeviceSettings {
  isIgnoringBatteryOptimizations() {
    return RNBackgroundGeolocation.isIgnoringBatteryOptimizations();
  }

  showIgnoreBatteryOptimizations() {    
    const args = {action: IGNORE_BATTERY_OPTIMIZATIONS};
    return RNBackgroundGeolocation.requestSettings(args);
  }

  showPowerManager() {
    const args = {action: POWER_MANAGER};
    return RNBackgroundGeolocation.requestSettings(args);
  }

  show(request) {
    return RNBackgroundGeolocation.showSettings(args);
  }
}