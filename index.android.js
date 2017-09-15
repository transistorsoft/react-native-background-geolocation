import {
  PermissionsAndroid
} from "react-native"

import API from "./RNBackgroundGeolocation";

const ACCESS_FINE   = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
const ACCESS_COARSE = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

async function requestPermission(success, failure) {
  try {      
    const granted = await PermissionsAndroid.requestMultiple([ACCESS_FINE, ACCESS_COARSE]);

    if ((granted[ACCESS_FINE] === PermissionsAndroid.RESULTS.GRANTED) && (granted[ACCESS_COARSE] === PermissionsAndroid.RESULTS.GRANTED)) {
      success();
    } else {
      console.warn("ACCESS_FINE_LOCATION permission denied");
      failure(1);
    }
  } catch (err) {
    console.warn(err);
  }
}

async function checkPermission(success, failure) {
  PermissionsAndroid.check(ACCESS_FINE).then(isAuthorized => {
    if (isAuthorized) { return success(); }
    requestPermission(success, failure);    
  });
}

API.setPermissionsHandler(checkPermission);

module.exports = API;
