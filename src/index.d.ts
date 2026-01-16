
// 1. Re-export ALL shared types so consumers can do:
//    import BackgroundGeolocation, { Config, Location, GeofenceEvent } from 'react-native-background-geolocation';
export * from '@transistorsoft/background-geolocation-types';

// 2. Import the *canonical* BackgroundGeolocation interface from -types.
import type {
  BackgroundGeolocation as SharedBackgroundGeolocation,
} from '@transistorsoft/background-geolocation-types';

// 3. Alias it as the default export type for this adapter.
declare const BackgroundGeolocation: SharedBackgroundGeolocation;
export default BackgroundGeolocation;