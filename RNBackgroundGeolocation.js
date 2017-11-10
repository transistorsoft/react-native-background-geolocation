'use strict';

import {
  NativeEventEmitter,
  NativeModules,
  Platform
} from "react-native"

const { RNBackgroundGeolocation } = NativeModules;
const EventEmitter = new NativeEventEmitter(RNBackgroundGeolocation);
const TAG = "TSLocationManager";

const PLATFORM_ANDROID  = "android";
const PLATFORM_IOS      = "ios";

// Android permissions handler.  iOS manages this automatically within TSLocationManager
let permissionsHandler = null;

function withPermission(success, failure) {
  if (!permissionsHandler) { return success(); }
  permissionsHandler(success, failure);
}

let emptyFn = function() {};

/**
* Client log method
*/
function log(level, msg) {
  RNBackgroundGeolocation.log(level, msg);
}

let API = {
  subscriptions: [],
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
    'watchposition',
    'powersavechange'
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

  AUTHORIZATION_STATUS_NOT_DETERMINED: 0,
  AUTHORIZATION_STATUS_RESTRICTED: 1,
  AUTHORIZATION_STATUS_DENIED: 2,
  AUTHORIZATION_STATUS_ALWAYS: 3,
  AUTHORIZATION_STATUS_WHEN_IN_USE: 4,

  NOTIFICATION_PRIORITY_DEFAULT: 0,
  NOTIFICATION_PRIORITY_HIGH: 1,
  NOTIFICATION_PRIORITY_LOW: -1,
  NOTIFICATION_PRIORITY_MAX: 2,
  NOTIFICATION_PRIORITY_MIN: -2,

  setPermissionsHandler(handler) {
    permissionsHandler = handler;
  },
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
  addListener: function(event, callback, failure) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundGeolocation: Unknown event '" + event + '"';
    }
    this.subscriptions.push(EventEmitter.addListener(event, callback));
    if (typeof(failure) === 'function') {
      this.subscriptions.push(EventEmitter.addListener("error", failure));
    }
    RNBackgroundGeolocation.addEventListener(event);
  },
  on: function(event, callback, failure) {
    return this.addListener(event, callback, failure);
  },
  removeListener: function(event, callback) {
    if (this.events.indexOf(event) < 0) {
      throw "RNBackgroundGeolocation: Unknown event '" + event + '"';
    }
    var found = null;
    for (var n=0,len=this.subscriptions.length;n<len;n++) {
      var subscription = this.subscriptions[n];
      if ((subscription.eventType === event) && (subscription.listener === callback)) {
          found = subscription;
          break;
      }
    }
    if (found !== null) {
      this.subscriptions.splice(this.subscriptions.indexOf(found), 1);
      RNBackgroundGeolocation.removeListener(event);
    }
    EventEmitter.removeListener(event, callback);
  },  
  removeAllListeners: function() {
    for (var n=0,len=API.events.length;n<len;n++) {
      EventEmitter.removeAllListeners(API.events[n]);
    }
    this.subscriptions = [];
    RNBackgroundGeolocation.removeAllListeners();
  },
  // @alias #removeAllListeners
  removeListeners: function() {
    this.removeAllListeners();
  },
  un: function(event, callback) {
    this.removeListener(event, callback);
  },
  start: async function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    withPermission(() => {
      RNBackgroundGeolocation.start(success, failure);
    }, failure);
  },
  stop: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.stop(success, failure);
  },
  startSchedule: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;

    withPermission(() => {
      RNBackgroundGeolocation.startSchedule(success, failure);
    }, failure);
  },
  stopSchedule: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.stopSchedule(success, failure);
  },
  startGeofences: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;

    withPermission(() => {
      RNBackgroundGeolocation.startGeofences(success, failure);
    }, failure);
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
    if (!taskId) {
      // No taskId?  Ignore it.
      return;
    }
    RNBackgroundGeolocation.finish(taskId);
  },
  // new
  getCurrentPosition: function(success, failure, options) {
    var _success = emptyFn,
       _failure = emptyFn,
       _options = {};

    // Detect old API: getCurrentPosition(options, success, failure)
    if (typeof(success) === 'object') {
      _options = success;
      if (typeof(options) === 'function') {
        _failure = options;
      }
      if (typeof(failure) === 'function') {
        _success = failure;
      }
    } else {  // New API getCurrentPosition(success, failure, options);
      _success = success || emptyFn;
      _failure = failure || emptyFn;
      _options = options || {};
    }
    withPermission(() => {
      RNBackgroundGeolocation.getCurrentPosition(_options, _success, _failure);
    }, _failure);
  },
  watchPosition: function(success, failure, options) {
    if (typeof(failure) === 'object') {
      options = failure;
      failure = emptyFn;
    }
    options = options || {};
    failure = failure || emptyFn;

    withPermission(() => {
      RNBackgroundGeolocation.watchPosition(options, function() { EventEmitter.addListener("watchposition", success); }, failure);
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

    withPermission(() => {
      RNBackgroundGeolocation.setOdometer(value, success, failure);
    }, failure);
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
  logger: {
    error: function(msg) {
      log('error', msg);
    },
    warn: function(msg) {
      log('warn', msg);
    },
    debug: function(msg) {
      log('debug', msg);
    },
    info: function(msg) {
      log('info', msg);
    },
    notice: function(msg) {
      log('notice', msg);
    },
    header: function(msg) {
      log('header', msg);
    },
    on: function(msg) {
      log('on', msg);
    },
    off: function(msg) {
      log('off', msg);
    },
    ok: function(msg) {
      log('ok', msg);
    }
  },
  getSensors: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.getSensors(success, failure);
  },
  isPowerSaveMode: function(success, failure) {
    success = success || emptyFn;
    failure = failure || emptyFn;
    RNBackgroundGeolocation.isPowerSaveMode(success, failure);
  },
  playSound: function(soundId) {
    RNBackgroundGeolocation.playSound(soundId);
  }
};

module.exports = API