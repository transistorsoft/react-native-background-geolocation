var React = require('react-native');

var {
  DeviceEventEmitter
} = React;

var BackgroundGeolocationManager = React.NativeModules.RNBackgroundGeolocation;

var BackgroundGeolocation = {
  configure: function(config) {
    BackgroundGeolocationManager.configure(config);
  },
  setConfig: function(config) {
    BackgroundGeolocationManager.setConfig(config);
  },
  on: function(event, callback) {
    DeviceEventEmitter.addListener(event, callback);
  },
  start: function(callback) {
    BackgroundGeolocationManager.start(callback);
  },
  stop: function() {
    BackgroundGeolocationManager.stop();
  },
  onMotionChange: function(callback) {
    DeviceEventEmitter.addListener("motionchange", callback);
  },
  onLocation: function(callback) {
    DeviceEventEmitter.addListener("location", callback);
  },
  onGeofence: function(callback) {
    DeviceEventEmitter.addListener("geofence", callback);
  },
  sync: function(callback) {
    BackgroundGeolocation.sync(callback);
  },
  changePace: function(value) {
    BackgroundGeolocationManager.changePace(value);
  },
  finish: function(taskId) {
    BackgroundGeolocationManager.finish(taskId);
  },
  getCurrentPosition: function(callback) {
    BackgroundGeolocationManager.getCurrentPosition(callback);
  },
  getOdometer: function(callback) {
    BackgroundGeolocationManager.getOdometer(callback);
  },
  resetOdometer: function(callback) {
    BackgroundGeolocationManager.resetOdometer(callback);
  },
  addGeofence: function(config, callbackFn, failureFn) {
    BackgroundGeolocationManager.addGeofence(
      config.identifier,
      config.radius,
      config.latitude,
      config.longitude,
      config.notifyOnEntry,
      config.notifyOnExit);
  },
  getGeofences: function(callback) {
    BackgroundGeolocationManager.getGeofences(callback);
  }
};

module.exports = BackgroundGeolocation;
