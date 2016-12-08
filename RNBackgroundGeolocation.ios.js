const {NativeEventEmitter} = require('react-native');
const { RNBackgroundGeolocation } = require('react-native').NativeModules;
const EventEmitter = new NativeEventEmitter(RNBackgroundGeolocation);

const TAG = "TSLocationManager";

var emptyFn = function() {};

var API = {
  events: [
    'heartbeat',
    'http',
    'location',
    'error',
    'motionchange',
    'geofence',
    'schedule',
    'activitychange',
    'providerchange',
    'geofenceschange',
    'watchposition'
  ],

  LOG_LEVEL_OFF: 0,
  LOG_LEVEL_ERROR: 1,
  LOG_LEVEL_WARNING: 2,
  LOG_LEVEL_INFO: 3,
  LOG_LEVEL_DEBUG: 4,
  LOG_LEVEL_VERBOSE: 5,

  DESIRED_ACCURACY_HIGH: 0,
  DESIRED_ACCURACY_MEDIUM: 10,
  DESIRED_ACCURACY_LOW: 100,
  DESIRED_ACCURACY_VERY_LOW: 1000,

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
  addListener: function(event, callback) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundGeolocation: Unknown event '" + event + '"';
    }
    return EventEmitter.addListener(event, callback);
  },
  on: function(event, callback) {
    return this.addListener(event, callback);
  },
  removeListener: function(event, callback) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundGeolocation: Unknown event '" + event + '"';
    }
    return EventEmitter.removeListener(event, callback);
  },
  un: function(event, callback) {
    this.removeListener(event, callback);
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
    return EventEmitter.addListener("http", callback);
  },
  onMotionChange: function(callback) {
    return EventEmitter.addListener("motionchange", callback);
  },
  onLocation: function(callback) {
    return EventEmitter.addListener("location", callback);
  },
  onGeofence: function(callback) {
    return EventEmitter.addListener("geofence", callback);
  },
  onHeartbeat: function(callback) {
    return EventEmitter.addListener("heartbeat", callback);
  },
  onError: function(callback) {
    return EventEmitter.addListener("error", callback);
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
  beginBackgroundTask: function(success) {
    if (typeof(success) !== 'function') {
      throw "beginBackgroundTask must be provided with a callback";
    }
    RNBackgroundGeolocation.beginBackgroundTask(success);
  },
  /**
  * @alias beginBackgroundTask
  */
  startBackgroundTask: function(success) {
    this.beginBackgroundTask(success);
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
      EventEmitter.addListener("watchposition", success);
    }, failure);
  },
  stopWatchPosition: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    EventEmitter.removeAllListeners("watchposition");
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
    this.destroyLocations(success, failure);
  },
  destroyLocations: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.destroyLocations(success, failure);
  },
  getOdometer: function(success, failure) {
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getOdometer(success, failure);
  },
  setOdometer: function(value, success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.setOdometer(value, success, failure);
  },
  resetOdometer: function(success, failure) {
    this.setOdometer(0, success, failure);
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
  destroyLog: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.destroyLog(success, failure);
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