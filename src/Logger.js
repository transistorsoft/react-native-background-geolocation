// Logger.js
'use strict';

import NativeModule from "./NativeModule";

const LOG_LEVEL_DEBUG = "debug";
const LOG_LEVEL_NOTICE = "notice";
const LOG_LEVEL_INFO = "info";
const LOG_LEVEL_WARN = "warn";
const LOG_LEVEL_ERROR = "error";

const ORDER_ASC = 1;
const ORDER_DESC = -1;

function log(level, msg) {
  return NativeModule.log(level, msg);
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

  static debug(msg)  { return log(LOG_LEVEL_DEBUG, msg);  }
  static error(msg)  { return log(LOG_LEVEL_ERROR, msg);  }
  static warn(msg)   { return log(LOG_LEVEL_WARN, msg);   }
  static info(msg)   { return log(LOG_LEVEL_INFO, msg);   }
  static notice(msg) { return log(LOG_LEVEL_NOTICE, msg); }

  static getLog(query) {
    return NativeModule.getLog(validateQuery(query));
  }

  static emailLog(email, query) {    
    return NativeModule.emailLog(email, validateQuery(query));
  }

  static uploadLog(url, query) {
    return NativeModule.uploadLog(url, validateQuery(query));
  }

  static destroyLog() {
    return NativeModule.destroyLog();
  }
}