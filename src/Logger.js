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
    query = validateQuery(query);
    return new Promise((resolve, reject) => {
      let success = (log) => { resolve(log) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.getLog(query, success, failure);
    });
  }

  static emailLog(email, query) {
    query = validateQuery(query);
    return new Promise((resolve, reject) => {
      let success = (success) => { resolve(success) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.emailLog(email, query, success, failure);
    });
  }

  static uploadLog(url, query) {
    query = validateQuery(query);
    return new Promise((resolve, reject) => {
      let success = (success) => { resolve(success) }
      let failure = (error) => { reject(error) }
      RNBackgroundGeolocation.uploadLog(url, query, success, failure);
    });
  }

  static destroyLog() {
    return new Promise((resolve, reject) => {
      let success = (success) => { resolve(success) }
      let failure = (error)  => { reject(error) }
      RNBackgroundGeolocation.destroyLog(success, failure);
    });
  }
}