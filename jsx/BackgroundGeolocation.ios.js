var React = require('react-native');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var BackgroundGeolocationManager = require('NativeModules').RNBackgroundGeolocation;
var listeners = [];
var BackgroundGeolocation = {
  configure: function(config) {
    BackgroundGeolocationManager.configure(config);
  },
  on: function(event, callback) {
  	var listener = RCTDeviceEventEmitter.addListener(event, callback);
  	listeners.push(listener);
  },
  start: function() {
  	BackgroundGeolocationManager.start();
  },
  stop: function() {
  	BackgroundGeolocationManager.stop();
  },
  changePace: function(value) {
  	BackgroundGeolocationManager.changePace(value);
  }
};

module.exports = BackgroundGeolocation;

