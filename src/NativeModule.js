'use strict';

import {
  NativeEventEmitter,
  NativeModules,
  TurboModuleRegistry,
  Platform,
  AppRegistry,
} from "react-native";

function getNativeBGGeo() {
  // Prefer TurboModule when the new architecture is enabled.
  
  if (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function') {
    try {
      const turbo = TurboModuleRegistry.get('RNBackgroundGeolocation');
      if (turbo) {        
        return turbo;
      }
    } catch (e) {
      // If Turbo lookup fails for any reason, fall through to classic bridge.
    }
  }

  // Fallback to classic bridge (old architecture).
  const legacy = NativeModules && NativeModules.RNBackgroundGeolocation;
  if (legacy) {    
    return legacy;
  }

  // If we reach here, the native module is not installed or not linked.
  throw new Error(
    '[react-native-background-geolocation] Native module "RNBackgroundGeolocation" not found. ' +
      'Make sure the library is properly installed and linked for your platform.'
  );
}

const RNBackgroundGeolocation = getNativeBGGeo();

const EventEmitter = new NativeEventEmitter(RNBackgroundGeolocation);


import TransistorAuthorizationService from "./TransistorAuthorizationService";

const TAG               = "TSLocationManager";
const PLATFORM_ANDROID  = "android";
const PLATFORM_IOS      = "ios";

/**
* Logging API
*/
const LOGGER = {
  error: function(msg) {
    return RNBackgroundGeolocation.log('error', msg);
  },
  warn: function(msg) {
    return RNBackgroundGeolocation.log('warn', msg);
  },
  debug: function(msg) {
    return RNBackgroundGeolocation.log('debug', msg);
  },
  info: function(msg) {
    return RNBackgroundGeolocation.log('info', msg);
  },
  notice: function(msg) {
    return RNBackgroundGeolocation.log('notice', msg);
  },
  header: function(msg) {
    return RNBackgroundGeolocation.log('header', msg);
  },
  on: function(msg) {
    return RNBackgroundGeolocation.log('on', msg);
  },
  off: function(msg) {
    return RNBackgroundGeolocation.log('off', msg);
  },
  ok: function(msg) {
    return RNBackgroundGeolocation.log('ok', msg);
  }
}

/// Internal Subscription instance
/// @deprecated.
class Subscription {
  constructor(event, subscription, callback) {
    this.event = event;
    this.subscription = subscription;
    this.callback = callback;
  }
}

// Plugin event listener subscriptions
// @deprecated.
let EVENT_SUBSCRIPTIONS = [];

const findEventSubscriptionByEvent = (event, callback) => {
  let found = null;
  for (let n=0,len=EVENT_SUBSCRIPTIONS.length;n<len;n++) {
    let sub = EVENT_SUBSCRIPTIONS[n];
    if ((sub.event === event) && (sub.callback === callback)) {
        found = sub;
        break;
    }
  }
  return found;
}

const findEventSubscription = (subscription) => {
  let found = null;
  for (let n=0,len=EVENT_SUBSCRIPTIONS.length;n<len;n++) {
    let sub = EVENT_SUBSCRIPTIONS[n];
    if (sub.subscription === subscription) {
        found = sub;
        break;
    }
  }
  return found;
}

const removeEventSubscription = (subscription) => {
  const found = findEventSubscription(subscription);
  if (found !== null) {
    EVENT_SUBSCRIPTIONS.splice(EVENT_SUBSCRIPTIONS.indexOf(found), 1);
  }
}

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

  config = TransistorAuthorizationService.applyIf(config);

  return config;
};

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
    return RNBackgroundGeolocation.ready(validateConfig(config));    
  }

  static configure(config) {
    console.warn('[BackgroundGeolocation] Method #configure is deprecated in favor of #ready');    
    return RNBackgroundGeolocation.configure(validateConfig(config));    
  }

  static requestPermission() {
    return RNBackgroundGeolocation.requestPermission();
  }

  static requestTemporaryFullAccuracy(purpose) {
    return RNBackgroundGeolocation.requestTemporaryFullAccuracy(purpose);     
  }

  static getProviderState() {
    return RNBackgroundGeolocation.getProviderState();     
  }

  static setConfig(config) {    
    return RNBackgroundGeolocation.setConfig(validateConfig(config));
  }

  static reset(config) {
    config = config || {};
    return RNBackgroundGeolocation.reset(validateConfig(config));   
  }

  static addListener(event, success, failure) {      
    const handler = (response) => {
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
    const subscription = EventEmitter.addListener(event, handler);

    if (typeof(subscription.remove) === 'function') {
      // React Native 0.65+ altered EventEmitter
      //
      // Wrap .remove() to remove from our own local EVENT_SUBSCRIPTIONS cache.
      // Eventually we can remove this local cache entirely once people are trained
      // to not use removeListener.
      const originalRemove = subscription.remove;
      subscription.remove = () => {
        originalRemove.call(subscription);
        removeEventSubscription(subscription);
      }
    } else {
      // Old RN API?  Create a .remove() method.
      subscription.remove = () => {
        EventEmitter.removeListener(event, handler);
        removeEventSubscription(subscription);
      }
    }
    EVENT_SUBSCRIPTIONS.push(new Subscription(event, subscription, success));
    return subscription;
  }

  static removeListeners() {
    return new Promise((resolve, reject) => {
      EVENT_SUBSCRIPTIONS.forEach((sub) => {
        sub.subscription.remove();
      });
      EVENT_SUBSCRIPTIONS = [];
      resolve();
    });
  }

  static getState() {    
    return RNBackgroundGeolocation.getState();    
  }

  static start() {
    return RNBackgroundGeolocation.start();      
  }

  static stop() {
    return RNBackgroundGeolocation.stop();        
  }

  static startSchedule() {
    return RNBackgroundGeolocation.startSchedule();    
  }

  static stopSchedule() {
    return RNBackgroundGeolocation.stopSchedule();   
  }

  static startGeofences() {
    return RNBackgroundGeolocation.startGeofences();      
  }

  static startBackgroundTask() {
    return RNBackgroundGeolocation.beginBackgroundTask();      
  }

  static stopBackgroundTask(taskId) {
    return RNBackgroundGeolocation.finish(taskId);    
  }

  static finishHeadlessTask(taskId) {
    return RNBackgroundGeolocation.finishHeadlessTask(taskId);     
  }
  
  /**
  * Geolocation Methods
  */

  static changePace(isMoving) {
    return RNBackgroundGeolocation.changePace(isMoving);
  }

  static getCurrentPosition(options) {
    options = options || {};
    return RNBackgroundGeolocation.getCurrentPosition(options);    
  }

  static async watchPosition(options, success, failure) {

    if (typeof success !== 'function') {
      throw `${TAG}#watchPosition requires a success callback`;
    }
    return new Promise(async (resolve, reject) => {
      options = options || {};
      failure = failure || (() => {});
      // Register listener immediately.
      const subscription = EventEmitter.addListener('watchposition', success);
      let watchId;
      try {
        watchId = await RNBackgroundGeolocation.watchPosition(options);
        // Resolve with our wrapped Subscription instance.
        resolve({
          id: watchId,
          remove: () => {
            subscription.remove();
            RNBackgroundGeolocation.stopWatchPosition(watchId);
          }
        });
      } catch (error) {
        subscription.remove();
        reject(error);
      }
    });    
  }

  static stopWatchPosition(watchId) {
    return RNBackgroundGeolocation.stopWatchPosition(watchId);
  }

  static getOdometer() {
    return RNBackgroundGeolocation.getOdometer();
  }

  static setOdometer(value) {
    return RNBackgroundGeolocation.setOdometer(value);      
  }

  /**
  * HTTP & Persistence Methods
  */

  static getLocations() {    
    return RNBackgroundGeolocation.getLocations();    
  }

  static getCount() {
    return RNBackgroundGeolocation.getCount();
  }

  static destroyLocations() {
    return RNBackgroundGeolocation.destroyLocations();
  }

  static destroyLocation(uuid) {
    return RNBackgroundGeolocation.destroyLocation(uuid);      
  }

  static insertLocation(params) {
    return RNBackgroundGeolocation.insertLocation(params);      
  }

  static sync() {
    return RNBackgroundGeolocation.sync();      
  }

  /**
  * Geofencing Methods
  */

  static addGeofence(config) {
    return RNBackgroundGeolocation.addGeofence(config);
  }

  static removeGeofence(identifier) {
    return RNBackgroundGeolocation.removeGeofence(identifier);
  }

  static addGeofences(geofences) {
    return RNBackgroundGeolocation.addGeofences(geofences);    
  }

  static removeGeofences() {
    return RNBackgroundGeolocation.removeGeofences();      
  }

  static getGeofences() {
    return RNBackgroundGeolocation.getGeofences();      
  }

  static getGeofence(identifier) {
    return RNBackgroundGeolocation.getGeofence(identifier);
  }

  static geofenceExists(identifier) {
    return RNBackgroundGeolocation.geofenceExists(identifier);
  }
  /**
  * Logging & Debug Methods
  */

  static log(level, message) {
    return RNBackgroundGeolocation.log(level, message);
  }

  static setLogLevel(value) {
    return RNBackgroundGeolocation.setLogLevel(value);
  }

  static getLog(query) {
    return RNBackgroundGeolocation.getLog(query);
  }

  static destroyLog() {
    return RNBackgroundGeolocation.destroyLog();
  }

  static emailLog(email, query) {
    return RNBackgroundGeolocation.emailLog(email, query);
  }

  static uploadLog(url, query) {
    return RNBackgroundGeolocation.uploadLog(url, query);
  }

  static isPowerSaveMode() {
    return RNBackgroundGeolocation.isPowerSaveMode();
  }

  static getSensors() {
    return RNBackgroundGeolocation.getSensors();
  }

  static getDeviceInfo() {
    return RNBackgroundGeolocation.getDeviceInfo();
  }

  static playSound(soundId) {
    return RNBackgroundGeolocation.playSound(soundId);  
  }

  static get logger() { return LOGGER; }
}