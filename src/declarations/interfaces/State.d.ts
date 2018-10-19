/// <reference path="./Config.d.ts" />

declare module "react-native-background-geolocation" {
  interface State extends Config {
    enabled: boolean;
    schedulerEnabled: boolean;
    trackingMode: TrackingMode;
    odometer: number;
  }
}
