import BackgroundGeolocation, {
  Event,
  type Location,
  type GeofenceEvent,
  type HeadlessEvent
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

BackgroundGeolocation.onNotificationAction((buttonId: string) => {
  console.log(buttonId);
});

// Every name Android delivers to a headless task must be a valid case (TS2678 otherwise).
BackgroundGeolocation.registerHeadlessTask(async (event: HeadlessEvent) => {
  switch (event.name) {
    case Event.NotificationAction:
    case 'locationerror':
      console.log(event.name, event.params);
      break;
  }
});

// Ensure that invalid usage fails if uncommented:
// BackgroundGeolocation.onLocation((location) => {
//   const bad: string = location; // should be type error
// });

export {};