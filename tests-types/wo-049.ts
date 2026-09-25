// Type-surface assertions — compile-only, no runtime.  (WO-049)
//
// The types stop declaring three shapes that no SDK has:
// - stopOnStationary / disableStopDetection under `geolocation` (both cores read them only under `activity`);
// - reset / transistorAuthorizationToken on State (Config inputs that no SDK reports back);
// - a full GeofenceEvent in Location.geofence (the wire carries a trigger summary, no location inside).
// Against types 5.3.4 every @ts-expect-error below is unused (TS2578) and GeofenceTrigger does not exist.
import BackgroundGeolocation, {
  type Config,
  type GeofenceTrigger,
  type Location,
  type State,
} from 'react-native-background-geolocation';

// Item 1: `activity` is the only home.
const activity: Config = {
  activity: { stopOnStationary: true, disableStopDetection: true },
};

const stopOnStationaryUnderGeolocation: Config = {
  // @ts-expect-error stopOnStationary is an ActivityConfig key
  geolocation: { stopOnStationary: true },
};

const disableStopDetectionUnderGeolocation: Config = {
  // @ts-expect-error disableStopDetection is an ActivityConfig key
  geolocation: { disableStopDetection: true },
};

// Item 2: State carries neither input-only key, and is still a valid Config.
async function stateSurface(): Promise<void> {
  const state: State = await BackgroundGeolocation.getState();
  // @ts-expect-error reset is a one-shot ready() input
  void state.reset;
  // @ts-expect-error the token is expanded into http.url and authorization before it reaches native
  void state.transistorAuthorizationToken;
  await BackgroundGeolocation.setConfig(state);
  await BackgroundGeolocation.ready(state);
}

// Item 3: Location.geofence is the trigger summary.
function geofenceSurface(location: Location): void {
  const trigger: GeofenceTrigger | undefined = location.geofence;
  if (trigger) {
    const identifier: string = trigger.identifier;
    const action: string = trigger.action;
    const timestamp: string = trigger.timestamp;
    const extras: Record<string, any> | undefined = trigger.extras;
    void identifier;
    void action;
    void timestamp;
    void extras;
  }
  // @ts-expect-error the cores send no location inside Location.geofence
  void location.geofence?.location;
}

const summary: GeofenceTrigger = {
  identifier: 'home',
  action: 'ENTER',
  timestamp: '2026-09-24T12:00:00.000Z',
};

void activity;
void stopOnStationaryUnderGeolocation;
void disableStopDetectionUnderGeolocation;
void stateSurface;
void geofenceSurface;
void summary;

export {};
