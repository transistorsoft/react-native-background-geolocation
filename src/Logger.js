'use strict';

import { NativeModules } from "react-native"

const { RNBackgroundGeolocation } = NativeModules;

const LOG_LEVEL_DEBUG = "debug";
const LOG_LEVEL_NOTICE = "notice";
const LOG_LEVEL_INFO = "info";
const LOG_LEVEL_WARN = "warn";
const LOG_LEVEL_ERROR = "error";

const ORDER_ASC = 1;
const ORDER_DESC = -1;

function log(level, msg) {
  RNBackgroundGeolocation.log(level, msg);
}

function validateQuery(query) {
  if (typeof(query) !== 'object') return {};

  if (query.hasOwnProperty('start') && isNaN(query.start)) {
    throw new Error('Invalid SQLQuery.start.  Expected unix timestamp but received: ' + query.start);
  }
  if (query.hasOwnProperty('end') && isNaN(query.end)) {
    throw new Error('Invalid SQLQuery.end.  Expected unix timestamp but received: ' + query.end);
  }
  return query;
}

export default class Logger {
  static get ORDER_ASC() { return ORDER_ASC; }
  static get ORDER_DESC() { return ORDER_DESC; }

  static debug(msg) {
    log(LOG_LEVEL_DEBUG, msg);
  }

  static error(msg) {
    log(LOG_LEVEL_ERROR, msg);
  }

  static warn(msg) {
    log(LOG_LEVEL_WARN, msg);
  }

  static info(msg) {
    log(LOG_LEVEL_INFO, msg);
  }

  static notice(msg) {
    log(LOG_LEVEL_NOTICE, msg);
  }

  static getLog(query) {
    return RNBackgroundGeolocation.getLog(validateQuery(query), success, failure);    
  }

  static emailLog(email, query) {
    return RNBackgroundGeolocation.emailLog(email, validateQuery(query));
  }

  static uploadLog(url, query) {
    return RNBackgroundGeolocation.uploadLog(url, validateQuery(query));
  }

  static destroyLog() {
    return RNBackgroundGeolocation.destroyLog();      
  }
}