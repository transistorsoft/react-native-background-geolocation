'use strict'

import {
  Platform,
  AppRegistry
} from "react-native"

import * as Events from './Events';
import NativeModule from './NativeModule';
import DeviceSettings from './DeviceSettings';
import Logger from './Logger';
import TransistorAuthorizationToken from './TransistorAuthorizationToken';

let _deviceSettingsInstance = null;

const TAG = "BackgroundGeolocation";

const LOG_LEVEL_OFF     =  0;
const LOG_LEVEL_ERROR   =  1;
const LOG_LEVEL_WARNING =  2;
const LOG_LEVEL_INFO    =  3;
const LOG_LEVEL_DEBUG   =  4;
const LOG_LEVEL_VERBOSE =  5;

// This is a test.
const DESIRED_ACCURACY_NAVIGATION = -2;
const DESIRED_ACCURACY_HIGH       = -1;
const DESIRED_ACCURACY_MEDIUM     = 10;
const DESIRED_ACCURACY_LOW        = 100;
const DESIRED_ACCURACY_VERY_LOW   = 1000;
const DESIRED_ACCURACY_LOWEST     = 3000;

const AUTHORIZATION_STATUS_NOT_DETERMINED = 0;
const AUTHORIZATION_STATUS_RESTRICTED     = 1;
const AUTHORIZATION_STATUS_DENIED         = 2;
const AUTHORIZATION_STATUS_ALWAYS         = 3;
const AUTHORIZATION_STATUS_WHEN_IN_USE    = 4;

const NOTIFICATION_PRIORITY_DEFAULT       = 0;
const NOTIFICATION_PRIORITY_HIGH          = 1;
const NOTIFICATION_PRIORITY_LOW           =-1;
const NOTIFICATION_PRIORITY_MAX           = 2;
const NOTIFICATION_PRIORITY_MIN           =-2;

const ACTIVITY_TYPE_OTHER                 = 1;
const ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION = 2;
const ACTIVITY_TYPE_FITNESS               = 3;
const ACTIVITY_TYPE_OTHER_NAVIGATION      = 4;

const LOCATION_AUTHORIZATION_ALWAYS       = "Always";
const LOCATION_AUTHORIZATION_WHEN_IN_USE  = "WhenInUse";
const LOCATION_AUTHORIZATION_ANY          = "Any";

const PERSIST_MODE_ALL                    = 2;
const PERSIST_MODE_LOCATION               = 1;
const PERSIST_MODE_GEOFENCE               = -1;
const PERSIST_MODE_NONE                   = 0;

const ACCURACY_AUTHORIZATION_FULL        = 0;
const ACCURACY_AUTHORIZATION_REDUCED     = 1;

const emptyFn = function() {}

export default class BackgroundGeolocation {
  static get LOG_LEVEL_OFF()                { return LOG_LEVEL_OFF; }
  static get LOG_LEVEL_ERROR()              { return LOG_LEVEL_ERROR; }
  static get LOG_LEVEL_WARNING()            { return LOG_LEVEL_WARNING; }
  static get LOG_LEVEL_INFO()               { return LOG_LEVEL_INFO; }
  static get LOG_LEVEL_DEBUG()              { return LOG_LEVEL_DEBUG; }
  static get LOG_LEVEL_VERBOSE()            { return LOG_LEVEL_VERBOSE; }

  static get ACTIVITY_TYPE_OTHER()                  { return ACTIVITY_TYPE_OTHER;}
  static get ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION()  { return ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION;}
  static get ACTIVITY_TYPE_FITNESS()                { return ACTIVITY_TYPE_FITNESS;}
  static get ACTIVITY_TYPE_OTHER_NAVIGATION()       { return ACTIVITY_TYPE_OTHER_NAVIGATION;}

  static get DESIRED_ACCURACY_NAVIGATION()  { return DESIRED_ACCURACY_NAVIGATION; }
  static get DESIRED_ACCURACY_HIGH()        { return DESIRED_ACCURACY_HIGH; }
  static get DESIRED_ACCURACY_MEDIUM()      { return DESIRED_ACCURACY_MEDIUM; }
  static get DESIRED_ACCURACY_LOW()         { return DESIRED_ACCURACY_LOW; }
  static get DESIRED_ACCURACY_VERY_LOW()    { return DESIRED_ACCURACY_VERY_LOW; }
  static get DESIRED_ACCURACY_LOWEST()      { return DESIRED_ACCURACY_LOWEST; }

  static get AUTHORIZATION_STATUS_NOT_DETERMINED()  { return AUTHORIZATION_STATUS_NOT_DETERMINED; }
  static get AUTHORIZATION_STATUS_RESTRICTED()      { return AUTHORIZATION_STATUS_RESTRICTED; }
  static get AUTHORIZATION_STATUS_DENIED()          { return AUTHORIZATION_STATUS_DENIED; }
  static get AUTHORIZATION_STATUS_ALWAYS()          { return AUTHORIZATION_STATUS_ALWAYS; }
  static get AUTHORIZATION_STATUS_WHEN_IN_USE()     { return AUTHORIZATION_STATUS_WHEN_IN_USE; }

  static get NOTIFICATION_PRIORITY_DEFAULT()        { return NOTIFICATION_PRIORITY_DEFAULT; }
  static get NOTIFICATION_PRIORITY_HIGH()           { return NOTIFICATION_PRIORITY_HIGH; }
  static get NOTIFICATION_PRIORITY_LOW()            { return NOTIFICATION_PRIORITY_LOW; }
  static get NOTIFICATION_PRIORITY_MAX()            { return NOTIFICATION_PRIORITY_MAX; }
  static get NOTIFICATION_PRIORITY_MIN()            { return NOTIFICATION_PRIORITY_MIN; }

  static get LOCATION_AUTHORIZATION_ALWAYS()        { return LOCATION_AUTHORIZATION_ALWAYS}
  static get LOCATION_AUTHORIZATION_WHEN_IN_USE()   { return LOCATION_AUTHORIZATION_WHEN_IN_USE}
  static get LOCATION_AUTHORIZATION_ANY()           { return LOCATION_AUTHORIZATION_ANY}

  static get PERSIST_MODE_ALL()       { return PERSIST_MODE_ALL; }
  static get PERSIST_MODE_LOCATION()  { return PERSIST_MODE_LOCATION; }
  static get PERSIST_MODE_GEOFENCE()  { return PERSIST_MODE_GEOFENCE; }
  static get PERSIST_MODE_NONE()      { return PERSIST_MODE_NONE; }

  static get ACCURACY_AUTHORIZATION_FULL()      { return ACCURACY_AUTHORIZATION_FULL; }
  static get ACCURACY_AUTHORIZATION_REDUCED()   { return ACCURACY_AUTHORIZATION_REDUCED; }

  static get deviceSettings() {
    if (_deviceSettingsInstance === null) {
      _deviceSettingsInstance = new DeviceSettings();
    }
    return _deviceSettingsInstance;
  }

  /**
  * Register HeadlessTask
  */
  static registerHeadlessTask(task) {
    AppRegistry.registerHeadlessTask(TAG, () => task);
  }

  /**
  * Core Plugin Control Methods
  */
  static ready(config, success, failure) {
    if (arguments.length <= 1) {
      return NativeModule.ready(config||{});
    } else {
      NativeModule.ready(config).then(success).catch(failure);
    }
  }
  /**
  * Reset plugin confg to default
  */
  static reset(config, success, failure) {
    if ((typeof(config) == 'function') ||  (typeof(success) === 'function')) {
      if (typeof(config) === 'function') {
        success = config;
      }
      NativeModule.reset(config).then(success).catch(failure);
    } else {
      return NativeModule.reset(config);
    }
  }
  /**
  * Perform initial configuration of plugin.  Reset config to default before applying supplied configuration
  */
  static configure(config, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.configure(config);
    } else {
      NativeModule.configure(config).then(success).catch(failure);
    }
  }

  static requestPermission(success, failure) {
    if (!arguments.length) {
      return NativeModule.requestPermission();
    } else {
      NativeModule.requestPermission().then(success).catch(failure);
    }
  }

  static requestTemporaryFullAccuracy(purpose) {
    return NativeModule.requestTemporaryFullAccuracy(purpose);
  }

  static getProviderState(success, failure) {
    if (!arguments.length) {
      return NativeModule.getProviderState();
    } else {
      NativeModule.getProviderState().then(success).catch(failure);
    }
  }

  /**
  * Listen to a plugin event
  */
  static addListener(event, success, failure) {
    if (typeof(event) != 'string')      { throw "BackgroundGeolocation#on must be provided a {String} event as 1st argument." }
    if (Events[event])      { throw "BackgroundGeolocation#on - Unknown event '" + event + "'" }
    if (typeof(success) != 'function')  { throw "BackgroundGeolocation#on must be provided a callback as 2nd argument.  If you're attempting to use the Promise API to listen to an event, it won't work, since a Promise can only evaluate once, while the callback function must be executed for each event." }
    NativeModule.addListener.apply(NativeModule, arguments);
  }
  // @alias #removeListener
  static on(event, success, failure) {
    this.addListener.apply(this, arguments);
  }

  static onLocation(success, failure) {
    this.addListener(Events.LOCATION, success, failure);
  }

  static onMotionChange(callback) {
    this.addListener(Events.MOTIONCHANGE, callback);
  }

  static onHttp(callback) {
    this.addListener(Events.HTTP, callback);
  }

  static onHeartbeat(callback) {
    this.addListener(Events.HEARTBEAT, callback);
  }

  static onProviderChange(callback) {
    this.addListener(Events.PROVIDERCHANGE, callback);
  }

  static onActivityChange(callback) {
    this.addListener(Events.ACTIVITYCHANGE, callback);
  }

  static onGeofence(callback) {
    this.addListener(Events.GEOFENCE, callback);
  }

  static onGeofencesChange(callback) {
    this.addListener(Events.GEOFENCESCHANGE, callback);
  }

  static onSchedule(callback) {
    this.addListener(Events.SCHEDULE, callback);
  }

  static onEnabledChange(callback) {
    this.addListener(Events.ENABLEDCHANGE, callback);
  }

  static onConnectivityChange(callback) {
    this.addListener(Events.CONNECTIVITYCHANGE, callback);
  }

  static onPowerSaveChange(callback) {
    this.addListener(Events.POWERSAVECHANGE, callback);
  }

  static onNotificationAction(callback) {
    this.addListener(Events.NOTIFICATIONACTION, callback);
  }

  static onAuthorization(callback) {
    this.addListener(Events.AUTHORIZATION, callback);
  }

  /**
  * Remove a single plugin event-listener, supplying a reference to the handler initially supplied to #un
  */
  static removeListener(event, handler, success, failure) {
    if (typeof(event) != 'string')      { throw "BackgroundGeolocation#un must be provided a {String} event as 1st argument" }
    if (!Events[event.toUpperCase()])      { throw "BackgroundGeolocation#un - Unknown event '" + event + "'" }
    NativeModule.removeListener.apply(NativeModule, arguments);
  }
  // @alias #removeListener
  static un(event, handler, success, failiure) {
    this.removeListener.apply(this, arguments);
  }

  /**
  * Remove all event listeners
  */
  static removeListeners(success, failure) {
    if (!arguments.length) {
      return NativeModule.removeListeners();
    } else {
      NativeModule.removeListeners().then(success).catch(failure);
    }
  }
  // @alias -> #removeListeners
  static removeAllListeners(success, failure) {
    this.removeListeners.apply(this, arguments);
  }
  /**
  * Fetch current plugin configuration
  */
  static getState(success, failure) {
    if (!arguments.length) {
      return NativeModule.getState();
    } else {
      NativeModule.getState().then(success).catch(failure);
    }
  }
  /**
  * Start the plugin
  */
  static start(success, failure) {
    if (!arguments.length) {
      return NativeModule.start();
    } else {
      NativeModule.start().then(success).catch(failure);
    }
  }
  /**
  * Stop the plugin
  */
  static stop(success, failure) {
    if (!arguments.length) {
      return NativeModule.stop();
    } else {
      NativeModule.stop().then(success).catch(failure);
    }
  }
  /**
  * Start the scheduler
  */
  static startSchedule(success, failure) {
    if (!arguments.length) {
      return NativeModule.startSchedule();
    } else {
      NativeModule.startSchedule().then(success).catch(failure);
    }
  }
  /**
  * Stop the scheduler
  */
  static stopSchedule(success, failure) {
    if (!arguments.length) {
      return NativeModule.stopSchedule();
    } else {
      NativeModule.stopSchedule().then(success).catch(failure);
    }
  }
  /**
  * Initiate geofences-only mode
  */
  static startGeofences(success, failure) {
    if (!arguments.length) {
      return NativeModule.startGeofences();
    } else {
      NativeModule.startGeofences().then(success).catch(failure);
    }
  }
  /**
  * Start an iOS background-task, provding 180s of background running time
  */
  static startBackgroundTask(success, failure) {
    if (!arguments.length) {
      return NativeModule.startBackgroundTask();
    } else {
      if (typeof(success) !== 'function') {
        throw TAG + "#startBackgroundTask must be provided with a callback to recieve the taskId";
      }
      NativeModule.startBackgroundTask().then(success).catch(failure);
    }
  }
  /**
  * Signal to iOS that your background-task from #startBackgroundTask is complete
  * TODO Rename native method #finish -> #stopBackgroundTask.
  */
  static stopBackgroundTask(taskId,  success, failure) {
    // No taskId?  Ignore it.
    if (arguments.length == 1) {
      return NativeModule.stopBackgroundTask(taskId);
    } else {
      NativeModule.stopBackgroundTask(taskId).then(success).catch(failure);
    }
  }
  /**
  * @deprecated Use #stopBackgroundTask
  */
  static finish(taskId, success, failure) {
    this.stopBackgroundTask.apply(this, arguments);
  }
  /**
  * Toggle motion-state between stationary <-> moving
  */
  static changePace(isMoving, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.changePace(isMoving);
    } else {
      NativeModule.changePace(isMoving).then(success).catch(failure);
    }
  }
  /**
  * Provide new configuration to the plugin.  This configuration will be *merged* to current configuration
  */
  static setConfig(config, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.setConfig(config);
    } else {
      NativeModule.setConfig(config).then(success).catch(failure);
    }
  }
  /**
  * HTTP & Persistence
  *
  */
  static getLocations(success, failure) {
    if (!arguments.length) {
      return NativeModule.getLocations();
    } else {
      NativeModule.getLocations().then(success).catch(failure);
    }
  }
  /**
  * Fetch the current count of location records in database
  */
  static getCount(success, failure) {
    if (!arguments.length) {
      return NativeModule.getCount();
    } else {
      NativeModule.getCount().then(success).catch(failure);
    }
  }
  /**
  * Destroy all records in locations database
  */
  static destroyLocations(success, failure) {
    if (!arguments.length) {
      return NativeModule.destroyLocations();
    } else {
      NativeModule.destroyLocations().then(success).catch(failure);
    }
  }
  /**
  * Destroy a single location by uuid
  */
  static destroyLocation(uuid) {
    return NativeModule.destroyLocation(uuid);
  }
  /**
  * Destroy a single record by uuid
  */
  // @deprecated
  static clearDatabase(success, failure) {
    return this.destroyLocations.apply(this, arguments);
  }
  /**
  * Insert a single record into locations database
  */
  static insertLocation(location, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.insertLocation(location);
    } else {
      NativeModule.insertLocation(location).then(success).catch(failure);
    }
  }
  /**
  * Manually initiate an HTTP sync operation
  */
  static sync(success, failure) {
    if (!arguments.length) {
      return NativeModule.sync();
    } else {
      NativeModule.sync().then(success).catch(failure);
    }
  }
  /**
  * Fetch the current value of odometer
  */
  static getOdometer(success, failure) {
    if (!arguments.length) {
      return NativeModule.getOdometer();
    } else {
      NativeModule.getOdometer().then(success).catch(failure);
    }
  }
  /**
  * Set the value of the odometer
  */
  static setOdometer(value, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.setOdometer(value);
    } else {
      NativeModule.setOdometer(value).then(success).catch(failure);
    }
  }
  /**
  * Reset the value of odometer to 0
  */
  static resetOdometer(success, failure) {
    if (!arguments.length) {
      return NativeModule.setOdometer(0);
    } else {
      NativeModule.setOdometer(0).then(success).catch(failure);
    }
  }

  /**
  * Geofencing Methods
  */

  /**
  * Add a single geofence
  */
  static addGeofence(config, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.addGeofence(config);
    } else {
      NativeModule.addGeofence(config).then(success).catch(failure);
    }
  }
  /**
  * Remove a single geofence by identifier
  */
  static removeGeofence(identifier, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.removeGeofence(identifier);
    } else {
      NativeModule.removeGeofence(identifier).then(success).catch(failure);
    }
  }
  /**
  * Add a list of geofences
  */
  static addGeofences(geofences, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.addGeofences(geofences);
    } else {
      NativeModule.addGeofences(geofences).then(success).catch(failure);
    }
  }
  /**
  * Remove geofences.  You may either supply an array of identifiers or nothing to destroy all geofences.
  * 1. removeGeofences() <-- Promise
  * 2. removeGeofences(['foo'])  <-- Promise
  *
  * 3. removeGeofences(success, [failure])
  * 4. removeGeofences(['foo'], success, [failure])
  */
  static removeGeofences(success, failure) {
    if (!arguments.length)  {
      return NativeModule.removeGeofences();
    } else {
      NativeModule.removeGeofences().then(success).catch(failure);
    }
  }
  /**
  * Fetch all geofences from database
  */
  static getGeofences(success, failure) {
    if (!arguments.length) {
      return NativeModule.getGeofences();
    } else {
      NativeModule.getGeofences().then(success).catch(failure);
    }
  }
  /**
  * Fetch a single geofence
  */
  static getGeofence(identifier, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.getGeofence(identifier);
    } else {
      NativeModule.getGeofence(identifier).then(success).catch(failure);
    }
  }
  /**
  * Return true if geofence was added
  */
  static geofenceExists(identifier, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.geofenceExists(identifier);
    } else {
      NativeModule.geofenceExists(identifier).then(success).catch(failure);
    }
  }
  /**
  * Fetch the current position from location-services
  */
  static getCurrentPosition(options, success, failure) {
    if (typeof(options) === 'function') {
      throw "#getCurrentPosition requires options {} as first argument";
    }
    if (typeof(success) === 'function') {
      NativeModule.getCurrentPosition(options).then(success).catch(failure);
    } else {
      return NativeModule.getCurrentPosition.apply(NativeModule, arguments);
    }
  }
  /**
  * Begin watching a stream of locations
  */
  static watchPosition(success, failure, options) {
    if (typeof(success) === 'undefined') {
      throw TAG + '#watchPosition cannot use Promises since a Promise can only evaluate once while the supplied callback must be executed for each location';
    }
    failure = failure || emptyFn;
    options = options || {};

    NativeModule.watchPosition(success, failure, options);
  }
  /**
  * Stop watching location
  */
  static stopWatchPosition(success, failure) {
    if (!arguments.length) {
      return NativeModule.stopWatchPosition();
    } else {
      NativeModule.stopWatchPosition().then(success).catch(failure);
    }
  }
  /**
  * Set the logLevel.  This is just a helper method for setConfig({logLevel: level})
  */
  static setLogLevel(value, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.setLogLevel(value);
    } else {
      NativeModule.setLogLevel(value).then(success).catch(failure);
    }
  }
  /**
  * Fetch the entire contents of log database returned as a String
  */
  static getLog(success, failure) {
    console.warn('[' + TAG + ' getLog] Deprecated.  Use BackgroundGeolocation.logger.getLog');
    if (!arguments.length) {
      return Logger.getLog();
    } else {
      Logger.getLog().then(success).catch(failure);
    }
  }
  /**
  * Destroy all contents of log database
  */
  static destroyLog(success, failure) {
    console.warn('[' + TAG + ' destroyLog] Deprecated.  Use BackgroundGeolocation.logger.destroyLog');
    if (!arguments.length) {
      return Logger.destroyLog();
    } else {
      Logger.destroyLog().then(success).catch(failure);
    }
  }
  /**
  * Open deafult email client on device to email the contents of log database attached as a compressed file attachement
  */
  static emailLog(email, success, failure) {
    console.warn('[' + TAG + ' emailLog] Deprecated.  Use BackgroundGeolocation.logger.emailLog');
    if (typeof(email) != 'string') { throw TAG + "#emailLog requires an email address as 1st argument"}
    if (arguments.length == 1) {
      return Logger.emailLog(email);
    } else {
      Logger.emailLog(email).then(success).catch(failure);
    }
  }
  /**
  * Has device OS initiated power-saving mode?
  */
  static isPowerSaveMode(success, failure) {
    if (!arguments.length) {
      return NativeModule.isPowerSaveMode();
    } else {
      NativeModule.isPowerSaveMode().then(success).catch(failure);
    }
  }
  /**
  * Fetch the state of this device's available motion-sensors
  */
  static getSensors(success, failure) {
    if (!arguments.length) {
      return NativeModule.getSensors();
    } else {
      NativeModule.getSensors().then(success).catch(failure);
    }
  }
  /**
  * Play a system sound via the plugin's Sound API
  */
  static playSound(soundId, success, failure) {
    if (arguments.length == 1) {
      return NativeModule.playSound(soundId);
    } else {
      NativeModule.playSound(soundId).then(success).catch(failure);
    }
  }

  static findOrCreateTransistorAuthorizationToken(orgname, username, url) {
    return TransistorAuthorizationToken.findOrCreate(orgname, username, url);
  }

  static destroyTransistorAuthorizationToken(url) {
    return TransistorAuthorizationToken.destroy(url);
  }

  /**
  * Insert a log message into the plugin's log database
  */
  static get logger() { return Logger; }

  static getDeviceInfo() {
    return NativeModule.getDeviceInfo();
  }

  static async transistorTrackerParams() {
    let deviceInfo = await NativeModule.getDeviceInfo();
    deviceInfo.uuid = deviceInfo.model;
    return {
      device: deviceInfo
    };
  }

  /**
  * Iterate and execute API methods to test validity of method signature for both Standard and Promise API
  */
  static test(delay) {
    test(this, delay);
  }
}

/**
* Iterate and execute API methods to test validity of method signature for both Standard and Promise API
*/
var test = function(bgGeo, delay) {
    delay = delay || 250;

    var methods = [
        ['reset', {debug: true, logLevel: 5}],
        ['setConfig', {distanceFilter: 50}],
        ['setLogLevel', 5],
        ['getLog', null],
        ['emailLog', 'foo@bar.com'],
        ['on', 'location'],
        ['ready', {}],
        ['configure', {debug: true, logLevel: 5, schedule: ['1-7 00:00-23:59']}],
        ['getState', null],
        ['startSchedule', null],
        ['stopSchedule', null],
        ['startGeofences', null],
        ['stop', null],
        ['start', null],
        ['startBackgroundTask', null],
        ['finish', 0],
        ['changePace', true],
        ['getLocations', null],
        ['insertLocation', {}],
        ['sync', null],
        ['getOdometer', null],
        ['setOdometer', 0],
        ['resetOdometer'],
        ['addGeofence', {identifier: 'test-geofence-1', radius: 100, latitude: 0, longitude:0, notifyOnEntry:true}],
        ['addGeofences', [{identifier: 'test-geofence-2', radius: 100, latitude: 0, longitude:0, notifyOnEntry:true}, {identifier: 'test-geofence-3', radius: 100, latitude: 0, longitude:0, notifyOnEntry:true}]],
        ['getGeofences', null],
        ['removeGeofence', 'test-geofence-1'],
        ['removeGeofences', null],
        ['getCurrentPosition', {}],
        ['watchPosition', {}],
        ['stopWatchPosition', null],
        ['isPowerSaveMode', null],
        ['getSensors', null],
        ['playSound', 1509],
        ['destroyLocations', null],
        ['clearDatabase', null],
        ['destroyLog', null],
        ['removeListeners', null]
    ];

    var createCallback = function(type, method, params) {
        return function(result) {
            console.log('- ' + method + '(' + params + ') - ' + type + ': ', result);
        }
    }
    var executeMethod = function(record) {
        console.log('* Execute method: ', record)
        var method = '' + record[0];
        var params = record[1];

        var success = createCallback('success', method, params);
        var failure = createCallback('failure', method, params);

        // Execute Standard API
        try {
            console.log('- Standard API: ' + method);
            if (params == null) {
                bgGeo[method](success, failure);
            } else {
                // Adjust params for different signatures.
                switch (method) {
                    case 'watchPosition':
                    case 'getCurrentPosition':
                        bgGeo[method](success, failure, params);
                        break;
                    default:
                        bgGeo[method](params, success, failure);
                        break;
                }
            }
        } catch (e) {
            console.warn(e);
        }
        // Execute Promise API
        setTimeout(function() {
            console.log('- Promise API: ' + method);
            try {
                if (params == null) {
                    bgGeo[method]().then(success).catch(failure);
                } else {
                    bgGeo[method](params).then(success).catch(failure);
                }
            } catch (e) {
                console.warn(e);
            }
        }, 10);
    }
    // Begin fetching methods.
    var intervalId = setInterval(function() {
        var record = methods.shift();
        if (!record || !methods.length) {
            clearInterval(intervalId);
            console.log('*** TEST COMPLETE ***');
            return;
        }
        executeMethod(record);
    }, delay);
}
