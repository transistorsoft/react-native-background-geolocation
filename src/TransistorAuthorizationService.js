'use strict';

import { NativeModules } from "react-native"

const DEFAULT_URL  = 'https://tracker.transistorsoft.com';

const DUMMY_TOKEN 	= 'DUMMY_TOKEN';

const REFRESH_PAYLOAD = {
	refresh_token: '{refreshToken}'
}

const LOCATIONS_PATH = '/api/locations';

const REFRESH_TOKEN_PATH = '/api/refresh_token';

const { RNBackgroundGeolocation } = NativeModules;

export default class TransistorAuthorizationService {
	static findOrCreate(orgname, username, url=DEFAULT_URL) {
		return new Promise((resolve, reject) => {
			RNBackgroundGeolocation.getTransistorToken(orgname, username, url).then((token) => {
				token.url = url;
				resolve(token)
			}).catch((error) => {
				console.warn('[TransistorAuthorizationService findOrCreate] ERROR: ', error);
				// Return a dummy token on error.  this is a weird thing to do but it probably failed due to no network connection to demo server.
				// Once app will request the token once again after restarting one's app.
				if (error.status == '403') {
					reject(error);
					return;
				}
				resolve({
					accessToken: DUMMY_TOKEN,
					refreshToken: DUMMY_TOKEN,
					expires: -1,
					url:url
				});
			});
		});
	}

  static destroy(url=DEFAULT_URL) {  	
	return RNBackgroundGeolocation.destroyTransistorToken(url);	
  }

  static applyIf(config) {	
  	if (!config.transistorAuthorizationToken) return config;

  	let token = config.transistorAuthorizationToken;
  	delete config.transistorAuthorizationToken;

	if (config.url) {
		delete config.url;
	}
	if (!config.http) {
		config.http = {};
	}
  	config.http.url = token.url + LOCATIONS_PATH
		
  	config.authorization = {
  		strategy: 'jwt',
  		accessToken: token.accessToken,
  		refreshToken: token.refreshToken,
  		refreshUrl: token.url + REFRESH_TOKEN_PATH,
  		refreshPayload: REFRESH_PAYLOAD,
  		expires: token.expires
  	}
  	return config;
  }
}