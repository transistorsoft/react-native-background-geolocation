const { React, DeviceEventEmitter} = require('react-native');
const { RNBackgroundGeolocation } = require('react-native').NativeModules;

const TAG = "TSLocationManager";

var emptyFn = function() {};

var API = {
  configure: function(config, callback) {
    callback = callback || function() {};
    RNBackgroundGeolocation.configure(config, callback);
  },
  setConfig: function(config) {
    RNBackgroundGeolocation.setConfig(config);
  },
  getState: function(callback, failure) {
    callback = callback || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getState(callback, failure);
  },
  on: function(event, callback) {
    return DeviceEventEmitter.addListener(TAG + ':' + event, callback);
  },
  start: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.start(success, failure);
  },
  stop: function() {
    RNBackgroundGeolocation.stop();
  },
  onHttp: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":http", callback);
  },
  onMotionChange: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":motionchange", callback);
  },
  onLocation: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":location", callback);
  },
  onGeofence: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":geofence", callback);
  },
  onError: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":error", callback);
  },
  sync: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.sync(success, failure);
  },
  changePace: function(value, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.changePace(value, success, failure);
  },
  finish: function(taskId) {
    RNBackgroundGeolocation.finish(taskId);
  },
  getCurrentPosition: function(options, success, failure) {
    if (typeof(options) === 'function') {
      success = options;
      options = {};
    }
    options = options || {};
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getCurrentPosition(options, success, failure);
  },
  getLocations: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getLocations(success, failure);
  },
  getCount: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getCount(success, failure);
  },
  insertLocation: function(params, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.insertLocation(params, success, failure);
  },
  clearDatabase: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.clearDatabase(success, failure);
  },
  getOdometer: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getOdometer(success, failure);
  },
  resetOdometer: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.resetOdometer(success, failure);
  },
  addGeofence: function(config, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.addGeofence(config, success, failure);
  },
  removeGeofence: function(identifier, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.removeGeofence(identifier, success, failure);
  },
  getGeofences: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getGeofences(success, failure);
  },
  getLog: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getLog(success, failure);
  },
  emailLog: function(email, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.emailLog(email, success, failure);
  },
  playSound: function(soundId) {
    RNBackgroundGeolocation.playSound(soundId);
  }
};

module.exports = API