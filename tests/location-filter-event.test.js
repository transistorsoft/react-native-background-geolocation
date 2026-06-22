jest.mock('../src/NativeModule', () => ({
  addListener: jest.fn(() => ({ remove: jest.fn() })),
}));

const NativeModule = require('../src/NativeModule');
const BG = require('../src/index.js').default;
const Shared = require('@transistorsoft/background-geolocation-types');

// onLocationFilter event wiring (issue #2585).
test('exposes the locationfilter event name + subscription method', () => {
  // Shared enum carries the new event name.
  expect(Shared.Event.LocationFilter).toBe('locationfilter');

  // Backward-compat static getter mirrors the shared enum.
  expect(BG.EVENT_LOCATIONFILTER).toBe('locationfilter');

  // Subscription method is exposed.
  expect(typeof BG.onLocationFilter).toBe('function');
});

test('onLocationFilter routes through the native bridge with the locationfilter event', () => {
  NativeModule.addListener.mockClear();
  const cb = jest.fn();

  const subscription = BG.onLocationFilter(cb);

  expect(NativeModule.addListener).toHaveBeenCalledWith('locationfilter', cb);
  expect(subscription).toBeDefined();
  expect(typeof subscription.remove).toBe('function');
});
