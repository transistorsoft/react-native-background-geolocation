const { React, DeviceEventEmitter} = require('react-native');
const { RNBackgroundGeolocation } = require('react-native').NativeModules;

const TAG = "TSLocationManager";

var emptyFn = function() {};

var API = {
  events: ['heartbeat', 'http', 'location', 'error', 'motionchange', 'geofence', 'schedule', 'activitychange', 'providerchange', 'watchposition'],

  configure: function(config, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.configure(config, success, failure);
  },
  setConfig: function(config, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.setConfig(config, success, failure);
  },
  getState: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getState(success, failure);
  },
  on: function(event, callback) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundGeolocation: Unknown event '" + event + '"';
    }
    return DeviceEventEmitter.addListener(TAG + ':' + event, callback);
  },
  start: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.start(success, failure);
  },
  stop: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.stop(success, failure);
  },
  startSchedule: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.startSchedule(success, failure);
  },
  stopSchedule: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.stopSchedule(success, failure);
  },
  startGeofences: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.startGeofences(success, failure);
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
  onHeartbeat: function(callback) {
    return DeviceEventEmitter.addListener(TAG + ":heartbeat", callback);    
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
  watchPosition: function(success, failure, options) {
    if (typeof(failure) === 'object') {
      options = failure;
      failure = emptyFn;
    }
    options = options || {};
    failure = failure || emptyFn;
    RNBackgroundGeolocation.watchPosition(options, function() {
      DeviceEventEmitter.addListener(TAG + ":watchposition", success);
    }, failure);
  },
  stopWatchPosition: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    DeviceEventEmitter.removeAllListeners(TAG + ":watchposition");
    RNBackgroundGeolocation.stopWatchPosition(success, failure);
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
  addGeofences: function(geofences, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.addGeofences(geofences, success, failure);
  },
  removeGeofence: function(identifier, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.removeGeofence(identifier, success, failure);
  },
  removeGeofences: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.removeGeofences(success, failure);
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