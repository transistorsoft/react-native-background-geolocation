const listeners = new Set();

class NativeEventEmitter {
  addListener(event, cb) {
    const sub = { remove: () => listeners.delete(sub) };
    listeners.add(sub);
    return sub;
  }
  removeAllListeners() { listeners.clear(); }
}

// The native module is a TurboModule: every data method returns a Promise (not the pre-migration
// callback convention). NativeModule.js returns these calls directly, so the mocks must resolve a
// Promise. `log`/`playSound` are fire-and-forget (void).
const RNBackgroundGeolocation = {
  // Minimal surface your JS calls in tests:
  ready: () => Promise.resolve({ enabled: false }),
  configure: () => Promise.resolve({}),
  setConfig: () => Promise.resolve({}),
  reset: () => Promise.resolve({ enabled: false }),
  getState: () => Promise.resolve({ enabled: false }),
  beginBackgroundTask: () => Promise.resolve(1),
  finish: (id) => Promise.resolve(id),
  addGeofence: () => Promise.resolve(),
  addGeofences: () => Promise.resolve(),
  removeGeofence: () => Promise.resolve(),
  removeGeofences: () => Promise.resolve(),
  getGeofences: () => Promise.resolve([]),
  getGeofence: () => Promise.resolve(null),
  geofenceExists: () => Promise.resolve(false),
  changePace: () => Promise.resolve(),
  getLog: () => Promise.resolve(''),
  destroyLog: () => Promise.resolve(),
  emailLog: () => Promise.resolve(),
  getOdometer: () => Promise.resolve(0),
  setOdometer: () => Promise.resolve({}),
  getLocations: () => Promise.resolve([]),
  getCount: () => Promise.resolve(0),
  destroyLocations: () => Promise.resolve(),
  insertLocation: () => Promise.resolve('00000000-0000-0000-0000-000000000000'),
  sync: () => Promise.resolve({ success: true }),
  getProviderState: () => Promise.resolve({ enabled: true }),
  requestPermission: () => Promise.resolve(1),
  requestTemporaryFullAccuracy: () => Promise.resolve(1),
  log: () => {},
  getDeviceInfo: () => Promise.resolve({ model: 'mock' }),
  playSound: () => {},
};

module.exports = {
  NativeModules: { RNBackgroundGeolocation },
  NativeEventEmitter,
  Platform: { OS: 'ios' },
  AppRegistry: { registerHeadlessTask: () => {} },
};
