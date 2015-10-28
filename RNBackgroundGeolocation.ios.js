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
  getState: function(callback) {
    BackgroundGeolocationManager.getState(callback);
  },
  on: function(event, callback) {
    return DeviceEventEmitter.addListener(event, callback);
  },
  start: function(callback) {
    BackgroundGeolocationManager.start(callback);
  },
  stop: function() {
    BackgroundGeolocationManager.stop();
  },
  onHttp: function(callback) {
    return DeviceEventEmitter.addListener("http", callback);
  },
  onMotionChange: function(callback) {
    return DeviceEventEmitter.addListener("motionchange", callback);
  },
  onLocation: function(callback) {
    return DeviceEventEmitter.addListener("location", callback);
  },
  onGeofence: function(callback) {
    return DeviceEventEmitter.addListener("geofence", callback);
  },
  onError: function(callback) {
    return DeviceEventEmitter.addListener("error", callback);
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
  getCurrentPosition: function(options, success, failure) {
    if (typeof(options) === 'function') {
      success = options;
      options = {};
    }
    options = options || {};
    failure = failure || function() {};
    BackgroundGeolocationManager.getCurrentPosition(options, success, failure);
  },
  getOdometer: function(callback) {
    BackgroundGeolocationManager.getOdometer(callback);
  },
  resetOdometer: function(callback) {
    BackgroundGeolocationManager.resetOdometer(callback);
  },
  addGeofence: function(config) {
    BackgroundGeolocationManager.addGeofence(config);
  },
  removeGeofence: function(identifier) {
    BackgroundGeolocationManager.removeGeofence(identifier);
  },
  getGeofences: function(callback) {
    BackgroundGeolocationManager.getGeofences(callback);
  }
};

module.exports = BackgroundGeolocation;
