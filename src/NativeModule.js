'use strict';

import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  AppRegistry
} from "react-native"

const { RNBackgroundGeolocation } = NativeModules;
const EventEmitter = new NativeEventEmitter(RNBackgroundGeolocation);

import TransistorAuthorizationToken from "./TransistorAuthorizationToken";

import * as Events from "./Events";

const TAG               = "TSLocationManager";
const PLATFORM_ANDROID  = "android";
const PLATFORM_IOS      = "ios";

/**
* Logging API
*/
const LOGGER = {
  error: function(msg) {
    RNBackgroundGeolocation.log('error', msg);
  },
  warn: function(msg) {
    RNBackgroundGeolocation.log('warn', msg);
  },
  debug: function(msg) {
    RNBackgroundGeolocation.log('debug', msg);
  },
  info: function(msg) {
    RNBackgroundGeolocation.log('info', msg);
  },
  notice: function(msg) {
    RNBackgroundGeolocation.log('notice', msg);
  },
  header: function(msg) {
    RNBackgroundGeolocation.log('header', msg);
  },
  on: function(msg) {
    RNBackgroundGeolocation.log('on', msg);
  },
  off: function(msg) {
    RNBackgroundGeolocation.log('off', msg);
  },
  ok: function(msg) {
    RNBackgroundGeolocation.log('ok', msg);
  }
}

// Plugin event listener subscriptions
let EVENT_SUBSCRIPTIONS = [];

// Validate provided config for #ready, #setConfig
const validateConfig = (config) => {
  // Detect obsolete notification* fields and re-map to Notification instance.
  if (
    (config.notificationPriority) ||
    (config.notificationText) ||
    (config.notificationTitle) ||
    (config.notificationChannelName) ||
    (config.notificationColor) ||
    (config.notificationSmallIcon) ||
    (config.notificationLargeIcon)
  ) {
    console.warn('[BackgroundGeolocation] WARNING: Config.notification* fields (eg: notificationText) are all deprecated in favor of notification: {title: "My Title", text: "My Text"}  See docs for "Notification" class');
    config.notification = {
      text: config.notificationText,
      title: config.notificationTitle,
      color: config.notificationColor,
      channelName: config.notificationChannelName,
      smallIcon: config.notificationSmallIcon,
      largeIcon: config.notificationLargeIcon,
      priority: config.notificationPriority
    };
  }

  config = TransistorAuthorizationToken.applyIf(config);

  return config;
};

class Subscription {
  constructor(subscription, callback) {
    this.subscription = subscription;
    this.callback = callback;
  }
}

// Cached copy of DeviceInfo.
let deviceInfo = null;
/**
* Native API
*/
export default class NativeModule {
  /**
  * Core API Methods
  */
  static ready(config) {
    return new Promise((resolve, reject) => {
      let success = (state) => { resolve(state) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.ready(validateConfig(config), success, failure);
    });
  }

  static configure(config) {
    console.warn('[BackgroundGeolocation] Method #configure is deprecated in favor of #ready');
    return new Promise((resolve, reject) => {
      let success = (state) => { resolve(state) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.configure(validateConfig(config), success, failure);
    });
  }

  static requestPermission() {
    return new Promise((resolve, reject) => {
      let success = (status) => { resolve(status) }
      let failure = (status) => { reject(status) }
      RNBackgroundGeolocation.requestPermission(success, failure);
    });
  }

  static requestTemporaryFullAccuracy(purpose) {
    return new Promise((resolve, reject) => {
      let success = (status) => { resolve(status) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.requestTemporaryFullAccuracy(purpose, success, failure);
    });
  }

  static getProviderState() {
    return new Promise((resolve, reject) => {
      let success = (state) => { resolve(state) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.getProviderState(success, failure);
    });
  }

  static setConfig(config) {
    return new Promise((resolve, reject) => {
      let success = (state) => { resolve(state) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.setConfig(validateConfig(config), success, failure);
    });
  }

  static reset(config) {
    config = config || {};
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.reset(validateConfig(config), success, failure);
    });
  }

  static addListener(event, success, failure) {
    if (!Events[event.toUpperCase()]) {
      throw (TAG + "#addListener - Unknown event '" + event + "'");
    }
    let handler = (response) => {
      if (response.hasOwnProperty("error") && (response.error != null)) {
        if (typeof(failure) === 'function') {
          failure(response.error);
        } else {
          success(response);
        }
      } else {
        success(response);
      }
    }
    let subscription = new Subscription(EventEmitter.addListener(event, handler), success);
    EVENT_SUBSCRIPTIONS.push(subscription);
    RNBackgroundGeolocation.addEventListener(event);
  }

  static removeListener(event, callback, success, failure) {
    let found = null;
    for (let n=0,len=EVENT_SUBSCRIPTIONS.length;n<len;n++) {
      let sub = EVENT_SUBSCRIPTIONS[n];
      if ((sub.subscription.eventType === event) && (sub.callback === callback)) {
          found = sub;
          break;
      }
    }
    if (found !== null) {
      EVENT_SUBSCRIPTIONS.splice(EVENT_SUBSCRIPTIONS.indexOf(found), 1);
      RNBackgroundGeolocation.removeListener(event);
      EventEmitter.removeListener(event, found.subscription.listener);
    }
  }

  static removeListeners() {
    return new Promise((resolve, reject) => {
      let success = async () => {
        for (const event in Events) {
          EventEmitter.removeAllListeners(Events[event.toUpperCase()]);
        }
        EVENT_SUBSCRIPTIONS = [];
        resolve();
      }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.removeAllListeners(success, failure);
    });
  }

  static getState() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.getState(success, failure);
    });
  }

  static start() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.start(success, failure);
    });
  }

  static stop() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.stop(success, failure);
    });
  }

  static startSchedule() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.startSchedule(success, failure);
    });
  }

  static stopSchedule() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.stopSchedule(success, failure);
    });
  }

  static startGeofences() {
    return new Promise((resolve, reject) => {
      let success = (state)  => { resolve(state) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.startGeofences(success, failure);
    });
  }

  static startBackgroundTask() {
    return new Promise((resolve, reject) => {
      let success = (taskId)  => { resolve(taskId) }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.beginBackgroundTask(success, failure);
    });
  }

  // TODO Rename native methods #finish -> #stopBackgroundTask
  static stopBackgroundTask(taskId) {
    return new Promise((resolve, reject) => {
      if (!taskId) {
        reject('INVALID_TASK_ID: ' + taskId);
        return;
      }
      let success = (taskId) => { resolve(taskId) }
      let failure = (error) =>  { reject(error) }
      RNBackgroundGeolocation.finish(taskId, success, failure);
    });
  }

  /**
  * Geolocation Methods
  */

  static changePace(isMoving) {
    return new Promise((resolve, reject) => {
      let success = ()        => { resolve() }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.changePace(isMoving, success, failure);
    });
  }

  static getCurrentPosition(options) {
    options = options || {};
    return new Promise((resolve, reject) => {
      let success = (location)  => { resolve(location) }
      let failure = (error)     => { reject(error) }
      RNBackgroundGeolocation.getCurrentPosition(options, success, failure);
    });
  }

  static watchPosition(success, failure, options) {
    let callback = ()  => {
      EventEmitter.addListener("watchposition", success);
    };
    RNBackgroundGeolocation.watchPosition(options, callback, failure);
  }

  static stopWatchPosition() {
    return new Promise((resolve, reject) => {
      EventEmitter.removeAllListeners("watchposition");
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.stopWatchPosition(success, failure);
    });
  }

  static getOdometer() {
    return new Promise((resolve, reject) => {
      let success = (value) => { resolve(value) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.getOdometer(success, failure);
    });
  }

  static setOdometer(value) {
    return new Promise((resolve, reject) => {
      let success = (location)      => { resolve(location) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.setOdometer(value, success, failure);
    });
  }

  /**
  * HTTP & Persistence Methods
  */

  static getLocations() {
    return new Promise((resolve, reject) => {
      let success = (result)  => { resolve(result) }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.getLocations(success, failure);
    });
  }

  static getCount() {
    return new Promise((resolve, reject) => {
      let success = (count) => { resolve(count) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.getCount(success, failure);
    });
  }

  static destroyLocations() {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.destroyLocations(success, failure);
    });
  }

  static destroyLocation(uuid) {
    return new Promise((resolve, reject) => {
      let success = () => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.destroyLocation(uuid, success, failure);
    });
  }

  static insertLocation(params) {
    return new Promise((resolve, reject) => {
      let success = (location)  => { resolve(location) }
      let failure = (error)     => { reject(error) }
      RNBackgroundGeolocation.insertLocation(params, success, failure);
    });
  }

  static sync() {
    return new Promise((resolve, reject) => {
      let success = (result)  => { resolve(result) }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.sync(success, failure);
    });
  }

  /**
  * Geofencing Methods
  */

  static addGeofence(config) {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.addGeofence(config, success, failure);
    });
  }

  static removeGeofence(identifier) {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.removeGeofence(identifier, success, failure);
    });
  }

  static addGeofences(geofences) {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.addGeofences(geofences, success, failure);
    });
  }

  static removeGeofences() {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.removeGeofences(success, failure);
    });
  }

  static getGeofences() {
    return new Promise((resolve, reject) => {
      let success = (result)  => { resolve(result) }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.getGeofences(success, failure);
    });
  }

  static getGeofence(identifier) {
    return new Promise((resolve, reject) => {
      let success = (result) => { resolve(result) }
      let failure = (error) => { reject(error) }
      if ((typeof(identifier) !== 'string') || (identifier.length == 0)) {
        failure('Invalid identifier: ' + identifier);
        return;
      }
      RNBackgroundGeolocation.getGeofence(identifier, success, failure);
    });
  }

  static geofenceExists(identifier) {
    return new Promise((resolve, reject) => {
      let callback = (result) => { resolve(result) }
      if ((typeof(identifier) !== 'string') || (identifier.length == 0)) {
        reject('Invalid identifier: ' + identifier);
        return;
      }
      RNBackgroundGeolocation.geofenceExists(identifier, callback);
    });
  }
  /**
  * Logging & Debug Methods
  */

  static setLogLevel(value) {
    return new Promise((resolve, reject) => {
      let success = (state)      => { resolve(state) }
      let failure = (error) => { reject(error) }
      let config = {logLevel: value};
      RNBackgroundGeolocation.setConfig(config, success, failure);
    });
  }

  static getLog() {
    return new Promise((resolve, reject) => {
      let success = (log)   => { resolve(log) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.getLog(success, failure);
    });
  }

  static destroyLog() {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.destroyLog(success, failure);
    });
  }

  static emailLog(email) {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.emailLog(email, success, failure);
    });
  }

  static isPowerSaveMode() {
    return new Promise((resolve, reject) => {
      let success = (isPowerSaveMode)   => { resolve(isPowerSaveMode) }
      let failure = (error)             => { reject(error) }
      RNBackgroundGeolocation.isPowerSaveMode(success, failure);
    });
  }

  static getSensors() {
    return new Promise((resolve, reject) => {
      let success = (result)  => { resolve(result) }
      let failure = (error)   => { reject(error) }
      RNBackgroundGeolocation.getSensors(success, failure);
    });
  }

  static getDeviceInfo() {
    return new Promise((resolve, reject) => {
      if (deviceInfo != null) {
        return resolve(deviceInfo);
      }
      let success = (result) => {
        // Cache DeviceInfo
        deviceInfo = result;
        resolve(result)
      }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.getDeviceInfo(success, failure);
    });
  }

  static playSound(soundId) {
    return new Promise((resolve, reject) => {
      let success = ()      => { resolve() }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.playSound(soundId);
      success();
    });
  }

  static get logger() { return LOGGER; }
}