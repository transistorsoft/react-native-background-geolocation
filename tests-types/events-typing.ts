import BackgroundGeolocation, {
  type Location,
  type GeofenceEvent
} from 'react-native-background-geolocation';


// callbacks should see the bridged types
BackgroundGeolocation.onLocation((location: Location) => {
  const loc: Location = location;
  console.log(loc.coords.latitude, loc.is_moving);
});

BackgroundGeolocation.onGeofence((event: GeofenceEvent) => {
  const gfEvent: GeofenceEvent = event;
  console.log(gfEvent.identifier, gfEvent.location.coords.longitude);
});

// Ensure that invalid usage fails if uncommented:
// BackgroundGeolocation.onLocation((location) => {
//   const bad: string = location; // should be type error
// });

export {};