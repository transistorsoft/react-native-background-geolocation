const listeners = new Set();

class NativeEventEmitter {
  addListener(event, cb) {
    const sub = { remove: () => listeners.delete(sub) };
    listeners.add(sub);
    return sub;
  }
  removeAllListeners() { listeners.clear(); }
}

const RNBackgroundGeolocation = {
  // Minimal surface your JS calls in tests:
  ready: (cfg, ok) => ok?.({ enabled: false }),
  configure: (cfg, ok) => ok?.({}),
  setConfig: (cfg, ok) => ok?.({}),
  reset: (cfg, ok) => ok?.({ enabled: false }),
  getState: (ok) => ok?.({ enabled: false }),
  beginBackgroundTask: (ok) => ok?.(1),
  finish: (id, ok) => ok?.(id),
  addGeofence: (_cfg, ok) => ok?.(),
  addGeofences: (_list, ok) => ok?.(),
  removeGeofence: (_id, ok) => ok?.(),
  removeGeofences: (ok) => ok?.(),
  getGeofences: (ok) => ok?.([]),
  getGeofence: (_id, ok) => ok?.(null),
  geofenceExists: (_id, cb) => cb(false),
  changePace: (_b, ok) => ok?.(),
  getLog: (ok) => ok?.(''),
  destroyLog: (ok) => ok?.(),
  emailLog: (_email, ok) => ok?.(),
  getOdometer: (ok) => ok?.(0),
  setOdometer: (_v, ok) => ok?.({}),
  getLocations: (ok) => ok?.([]),
  getCount: (ok) => ok?.(0),
  destroyLocations: (ok) => ok?.(),
  insertLocation: (_p, ok) => ok?.({}),
  sync: (ok) => ok?.({ success: true }),
  getProviderState: (ok) => ok?.({ enabled: true }),
  requestPermission: (ok) => ok?.(1),
  requestTemporaryFullAccuracy: (_p, ok) => ok?.(1),
  log: () => {},
  getDeviceInfo: (ok) => ok?.({ model: 'mock' }),
  playSound: () => {},
};

module.exports = {
  NativeModules: { RNBackgroundGeolocation },
  NativeEventEmitter,
  Platform: { OS: 'ios' },
  AppRegistry: { registerHeadlessTask: () => {} },
};
