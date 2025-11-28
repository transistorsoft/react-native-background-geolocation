//'use strict'

import {
  Platform,
  AppRegistry
} from "react-native"

import NativeModule from './NativeModule';
import DeviceSettings from './DeviceSettings';
import Logger from './Logger';
import TransistorAuthorizationService from './TransistorAuthorizationService';

import {
  LogLevel,
  DesiredAccuracy,
  PersistMode,
  AuthorizationStatus,
  AccuracyAuthorization,
  LocationRequest,
  AuthorizationStrategy,
  LocationFilterPolicy,
  KalmanProfile,
  NotificationPriority,
  HttpMethod,
  TriggerActivity,
  ActivityType,
  Event
} from '@transistorsoft/background-geolocation-types';

// Build a lookup table of allowed event names (runtime)
const VALID_EVENT_NAMES = new Set(Object.values(Event));

let _deviceSettingsInstance = null;

const TAG = "BackgroundGeolocation";

const LOG_LEVEL_OFF     = LogLevel.Off;
const LOG_LEVEL_ERROR   = LogLevel.Error;
const LOG_LEVEL_WARNING = LogLevel.Warning;
const LOG_LEVEL_INFO    = LogLevel.Info;
const LOG_LEVEL_DEBUG   = LogLevel.Debug;
const LOG_LEVEL_VERBOSE = LogLevel.Verbose;

const DESIRED_ACCURACY_NAVIGATION = DesiredAccuracy.Navigation;
const DESIRED_ACCURACY_HIGH       = DesiredAccuracy.High;
const DESIRED_ACCURACY_MEDIUM     = DesiredAccuracy.Medium;
const DESIRED_ACCURACY_LOW        = DesiredAccuracy.Low;
const DESIRED_ACCURACY_VERY_LOW   = DesiredAccuracy.VeryLow;
const DESIRED_ACCURACY_LOWEST     = DesiredAccuracy.Lowest;

const AUTHORIZATION_STATUS_NOT_DETERMINED = AuthorizationStatus.NotDetermined;
const AUTHORIZATION_STATUS_RESTRICTED     = AuthorizationStatus.Restricted;
const AUTHORIZATION_STATUS_DENIED         = AuthorizationStatus.Denied;
const AUTHORIZATION_STATUS_ALWAYS         = AuthorizationStatus.Always;
const AUTHORIZATION_STATUS_WHEN_IN_USE    = AuthorizationStatus.WhenInUse;

const NOTIFICATION_PRIORITY_DEFAULT       = NotificationPriority.Default;
const NOTIFICATION_PRIORITY_HIGH          = NotificationPriority.High;
const NOTIFICATION_PRIORITY_LOW           = NotificationPriority.Low;
const NOTIFICATION_PRIORITY_MAX           = NotificationPriority.Max;
const NOTIFICATION_PRIORITY_MIN           = NotificationPriority.Min;

const ACTIVITY_TYPE_OTHER                 = ActivityType.Other;
const ACTIVITY_TYPE_AUTOMOTIVE_NAVIGATION = ActivityType.AutomotiveNavigation;
const ACTIVITY_TYPE_FITNESS               = ActivityType.Fitness;
const ACTIVITY_TYPE_OTHER_NAVIGATION      = ActivityType.OtherNavigation;
const ACTIVITY_TYPE_AIRBORNE              = ActivityType.Airborne;

const LOCATION_AUTHORIZATION_ALWAYS       = LocationRequest.Always;
const LOCATION_AUTHORIZATION_WHEN_IN_USE  = LocationRequest.WhenInUse;
const LOCATION_AUTHORIZATION_ANY          = LocationRequest.Any;

const PERSIST_MODE_ALL                    = PersistMode.All;
const PERSIST_MODE_LOCATION               = PersistMode.Location;
const PERSIST_MODE_GEOFENCE               = PersistMode.Geofence;
const PERSIST_MODE_NONE                   = PersistMode.None;

const ACCURACY_AUTHORIZATION_FULL         = AccuracyAuthorization.Full;
const ACCURACY_AUTHORIZATION_REDUCED      = AccuracyAuthorization.Reduced;

const emptyFn = function() {}

export default class BackgroundGeolocation {
  static get EVENT_BOOT()                  { return Event.Boot; }
  static get EVENT_TERMINATE()             { return Event.Terminate; }
  static get EVENT_LOCATION()              { return Event.Location; }
  static get EVENT_MOTIONCHANGE()          { return Event.MotionChange; }
  static get EVENT_HTTP()                  { return Event.Http; }
  static get EVENT_HEARTBEAT()             { return Event.Heartbeat; }
  static get EVENT_PROVIDERCHANGE()        { return Event.ProviderChange; }
  static get EVENT_ACTIVITYCHANGE()        { return Event.ActivityChange; }
  static get EVENT_GEOFENCE()              { return Event.Geofence; }
  static get EVENT_GEOFENCESCHANGE()       { return Event.GeofencesChange; }
  static get EVENT_ENABLEDCHANGE()         { return Event.EnabledChange; }
  static get EVENT_CONNECTIVITYCHANGE()    { return Event.ConnectivityChange; }
  static get EVENT_SCHEDULE()              { return Event.Schedule; }
  static get EVENT_POWERSAVECHANGE()       { return Event.PowerSaveChange; }
  static get EVENT_NOTIFICATIONACTION()    { return Event.NotificationAction; }
  static get EVENT_AUTHORIZATION()         { return Event.Authorization; }

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
  static get ACTIVITY_TYPE_AIRBORNE()               { return ACTIVITY_TYPE_AIRBORNE; }

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

  // Enum namespaces (mirroring @transistorsoft/background-geolocation-types)
  static get LogLevel() {
    return LogLevel;
  }

  static get DesiredAccuracy() {
    return DesiredAccuracy;
  }

  static get PersistMode() {
    return PersistMode;
  }

  static get AuthorizationStatus() {
    return AuthorizationStatus;
  }

  static get AccuracyAuthorization() {
    return AccuracyAuthorization;
  }

  static get LocationRequest() {
    return LocationRequest;
  }

  static get AuthorizationStrategy() {
    return AuthorizationStrategy;
  }

  static get LocationFilterPolicy() {
    return LocationFilterPolicy;
  }

  static get KalmanProfile() {
    return KalmanProfile;
  }

  static get NotificationPriority() {
    return NotificationPriority;
  }

  static get HttpMethod() {
    return HttpMethod;
  }

  static get TriggerActivity() {
    return TriggerActivity;
  }

  static get ActivityType() {
    return ActivityType;
  }

  static get Event() {
    return Event;
  }

  static get deviceSettings() {
    if (_deviceSettingsInstance === null) {
      _deviceSettingsInstance = new DeviceSettings();
    }
    return _deviceSettingsInstance;
  }

  /**
  * Core Plugin Control Methods
  */
  static ready(config) {    
    return NativeModule.ready(config||{});    
  }
  /**
  * Reset plugin confg to default
  */
  static reset(config) {    
    return NativeModule.reset(config);    
  }
  /**
  * Perform initial configuration of plugin.  Reset config to default before applying supplied configuration
  */
  static configure(config) {
    return NativeModule.configure(config);
  }

  static requestPermission() {
    return NativeModule.requestPermission();
  }

  static requestTemporaryFullAccuracy(purpose) {
    return NativeModule.requestTemporaryFullAccuracy(purpose);
  }

  static getProviderState() {
    return NativeModule.getProviderState();    
  }

  /**
  * Listen to a plugin event
  */
  static addListener(event, success, failure) {
    if (typeof(event) != 'string')      { throw "BackgroundGeolocation#on must be provided a {String} event as 1st argument." }
    
    if (!VALID_EVENT_NAMES.has(event)) {
      throw `BackgroundGeolocation#on - Unknown event '${event}'`;
    } 

    if (typeof(success) != 'function')  { throw "BackgroundGeolocation#on must be provided a callback as 2nd argument.  If you're attempting to use the Promise API to listen to an event, it won't work, since a Promise can only evaluate once, while the callback function must be executed for each event." }
    return NativeModule.addListener.apply(NativeModule, arguments);
  }
  
  static onLocation(success, failure) {
    return this.addListener(Event.Location, success, failure);
  }

  static onMotionChange(callback) {
    return this.addListener(Event.MotionChange, callback);
  }

  static onHttp(callback) {
    return this.addListener(Event.Http, callback);
  }

  static onHeartbeat(callback) {
    return this.addListener(Event.Heartbeat, callback);
  }

  static onProviderChange(callback) {
    return this.addListener(Event.ProviderChange, callback);
  }

  static onActivityChange(callback) {
    return this.addListener(Event.ActivityChange, callback);
  }

  static onGeofence(callback) {
    return this.addListener(Event.Geofence, callback);
  }

  static onGeofencesChange(callback) {
    return this.addListener(Event.GeofencesChange, callback);
  }

  static onSchedule(callback) {
    return this.addListener(Event.Schedule, callback);
  }

  static onEnabledChange(callback) {
    return this.addListener(Event.EnabledChange, callback);
  }

  static onConnectivityChange(callback) {
    return this.addListener(Event.ConnectivityChange, callback);
  }

  static onPowerSaveChange(callback) {
    return this.addListener(Event.PowerSaveChange, callback);
  }

  static onNotificationAction(callback) {
    return this.addListener(Event.NotificationAction, callback);
  }

  static onAuthorization(callback) {
    return this.addListener(Event.Authorization, callback);
  }

  /**
  * Remove a single plugin event-listener, supplying a reference to the handler initially supplied to #un
  */
  static removeListener(event, handler, success, failure) {
    if (typeof(event) != 'string')      { throw "BackgroundGeolocation#un must be provided a {String} event as 1st argument" }
    if (!VALID_EVENT_NAMES.has(event))      { throw "BackgroundGeolocation#un - Unknown event '" + event + "'" }
    NativeModule.removeListener.apply(NativeModule, arguments);
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
    return NativeModule.getState();    
  }
  /**
  * Start the plugin
  */
  static start() {
    return NativeModule.start();   
  }
  /**
  * Stop the plugin
  */
  static stop() {
    return NativeModule.stop();
  }
  /**
  * Start the scheduler
  */
  static startSchedule() {
    return NativeModule.startSchedule();
  }
  /**
  * Stop the scheduler
  */
  static stopSchedule() {
    return NativeModule.stopSchedule();
  }
  /**
  * Initiate geofences-only mode
  */
  static startGeofences() {
    return NativeModule.startGeofences();    
  }
  /**
  * Start an iOS background-task, provding 180s of background running time
  */
  static startBackgroundTask() {
    return NativeModule.startBackgroundTask();
  }
  /**
  * Signal to iOS that your background-task from #startBackgroundTask is complete
  * TODO Rename native method #finish -> #stopBackgroundTask.
  */
  static stopBackgroundTask(taskId) {    
    return NativeModule.stopBackgroundTask(taskId);
  }
  /**
  * @deprecated Use #stopBackgroundTask
  */
  static finish(taskId) {
    this.stopBackgroundTask.apply(this, arguments);
  }

  /**
  * Register HeadlessTask
  * Have to wrap execution to finish our own headless-task because there's an unknown issue with TurboModules in new arch
  * where RN's HeadlessJsTaskSupport is null.  That module can automatically finish RN headless-tasks.
  */
  static registerHeadlessTask(taskProvider) {
    AppRegistry.registerHeadlessTask(TAG, () => {
      // return to RN's AppRegistry a Function that returns a Promise.
      return (event) => {
        return new Promise((resolve, reject) => {          
          const taskId = event._transistorHeadlessTaskId;
          delete(event._transistorHeadlessTaskId);
          taskProvider(event).then(() => {
            BackgroundGeolocation.finishHeadlessTask(taskId);
            resolve();
          }).catch(reason => {
            BackgroundGeolocation.finishHeadlessTask(taskId);
            reject(reason);
          });  
        });
      }
    });
  }

  /**
   * @private 
   * Signal completion of a react-native headless-task.  This helps RN free-up resources allocated to the headless-task execution.
   */
  static finishHeadlessTask(taskId) {    
    return NativeModule.finishHeadlessTask(taskId);    
  }
  /**
  * Toggle motion-state between stationary <-> moving
  */
  static changePace(isMoving) {
    return NativeModule.changePace(isMoving);  
  }

  /**
  * Provide new configuration to the plugin.  This configuration will be *merged* to current configuration
  */
  static setConfig(config) {
    return NativeModule.setConfig(config);
  }
  /**
  * HTTP & Persistence
  *
  */
  static getLocations() {
    return NativeModule.getLocations();
  }

  /**
  * Fetch the current count of location records in database
  */
  static getCount() {
    return NativeModule.getCount();
  }
  
  /**
  * Destroy all records in locations database
  */
  static destroyLocations() {
    return NativeModule.destroyLocations();  
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
  static clearDatabase() {
    return this.destroyLocations();
  }
  /**
  * Insert a single record into locations database
  */
  static insertLocation(location) {
    return NativeModule.insertLocation(location);
  }

  /**
  * Manually initiate an HTTP sync operation
  */
  static sync() {
    return NativeModule.sync();
  }

  /**
  * Fetch the current value of odometer
  */
  static getOdometer() {
    return NativeModule.getOdometer();
  }

  /**
  * Set the value of the odometer
  */
  static setOdometer(value) {
    return NativeModule.setOdometer(value);
  }
  /**
  * Reset the value of odometer to 0
  */
  static resetOdometer() {
    return NativeModule.setOdometer(0);
  }

  /**
  * Geofencing Methods
  */

  /**
  * Add a single geofence
  */
  static addGeofence(config) {
    return NativeModule.addGeofence(config);
  }
  /**
  * Remove a single geofence by identifier
  */
  static removeGeofence(identifier) {
    return NativeModule.removeGeofence(identifier);   
  }
  
  /**
  * Add a list of geofences
  */
  static addGeofences(geofences) {
    return NativeModule.addGeofences(geofences);
  }

  /**
  * Remove geofences.  You may either supply an array of identifiers or nothing to destroy all geofences.
  * 1. removeGeofences() <-- Promise
  * 2. removeGeofences(['foo'])  <-- Promise
  *
  * 3. removeGeofences(success, [failure])
  * 4. removeGeofences(['foo'], success, [failure])
  */
  static removeGeofences() {
    return NativeModule.removeGeofences();    
  }
  
  /**
  * Fetch all geofences from database
  */
  static getGeofences() {
    return NativeModule.getGeofences();

  }
  /**
  * Fetch a single geofence
  */
  static getGeofence(identifier) {
    return NativeModule.getGeofence(identifier);
  }
  /**
  * Return true if geofence was added
  */
  static geofenceExists(identifier) {
    return NativeModule.geofenceExists(identifier);
  }
  /**
  * Fetch the current position from location-services
  */
  static getCurrentPosition(options) {  
    return NativeModule.getCurrentPosition(options)
  }

  /**
  * Begin watching a stream of locations
  */
  static watchPosition(options, success, failure) {
    if (typeof success !== 'function') {
      throw TAG + '#watchPosition requires a success callback';
    }
    options = options || {};
    failure = failure || emptyFn;
    return NativeModule.watchPosition(options, success, failure);
  }

  /**
  * Stop watching location
  */
  static stopWatchPosition(watchId) {
    return NativeModule.stopWatchPosition(watchId);
  }

  /**
  * Set the logLevel.  This is just a helper method for setConfig({logLevel: level})
  */
  static setLogLevel(value) {  
    return NativeModule.setLogLevel(value);    
  }

  /**
  * Fetch the entire contents of log database returned as a String
  */
  static getLog() {    
    return Logger.getLog();
  }

  /**
  * Destroy all contents of log database
  */
  static destroyLog() {
    return Logger.destroyLog();
  }

  /**
  * Open deafult email client on device to email the contents of log database attached as a compressed file attachement
  */
  static emailLog(email, query) {
    query = query || {};
    return Logger.emailLog(email, query);
  }

  /**
  * Has device OS initiated power-saving mode?
  */
  static isPowerSaveMode() {
    return NativeModule.isPowerSaveMode();
  }
  
  /**
  * Fetch the state of this device's available motion-sensors
  */
  static getSensors() {
    return NativeModule.getSensors();
  }
  /**
  * Play a system sound via the plugin's Sound API
  */
  static playSound(soundId) {
    return NativeModule.playSound(soundId);
  }

  static findOrCreateTransistorAuthorizationToken(orgname, username, url) {
    return TransistorAuthorizationService.findOrCreate(orgname, username, url);
  }

  static destroyTransistorAuthorizationToken(url) {
    return TransistorAuthorizationService.destroy(url);
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
}


