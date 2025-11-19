import BackgroundGeolocation, { type Geofence } from 'react-native-background-geolocation';
import type { Config as SharedConfig } from '@transistorsoft/background-geolocation-types';

const gf: Geofence = {
  identifier: 'home',
  latitude: 1,
  longitude: 2,
  radius: 150,
  notifyOnEntry: true,
};

const compoundConfig: SharedConfig = {
  logger: { logLevel: BackgroundGeolocation.LogLevel.Verbose },
  geolocation: {
    desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
    distanceFilter: 10,
  },
};

BackgroundGeolocation.ready(compoundConfig);