// Logger.js
'use strict';

import NativeModule from "./NativeModule";

const RNBackgroundGeolocation = NativeModule; // uses the same getNativeBGGeo() under the hood

const LOG_LEVEL_DEBUG = "debug";
const LOG_LEVEL_NOTICE = "notice";
const LOG_LEVEL_INFO = "info";
const LOG_LEVEL_WARN = "warn";
const LOG_LEVEL_ERROR = "error";

const ORDER_ASC = 1;
const ORDER_DESC = -1;

function log(level, msg) {
  // You can either:
  // 1) call the native logger via NativeModule.logger
  //    NativeModule.logger[level](msg);
  // or
  // 2) just use the native `log` directly if exposed:
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

  static debug(msg)  { log(LOG_LEVEL_DEBUG, msg);  }
  static error(msg)  { log(LOG_LEVEL_ERROR, msg);  }
  static warn(msg)   { log(LOG_LEVEL_WARN, msg);   }
  static info(msg)   { log(LOG_LEVEL_INFO, msg);   }
  static notice(msg) { log(LOG_LEVEL_NOTICE, msg); }

  static getLog(query) {
    return RNBackgroundGeolocation.getLog(validateQuery(query));
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