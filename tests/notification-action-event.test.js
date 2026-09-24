jest.mock('../src/NativeModule', () => ({
  addListener: jest.fn(() => ({ remove: jest.fn() })),
}));

const NativeModule = require('../src/NativeModule');
const BG = require('../src/index.js').default;
const Shared = require('@transistorsoft/background-geolocation-types');

// onNotificationAction threw "BackgroundGeolocation#on must be provided a {String} event as 1st
// argument." in every 5.x release: the shared Event enum had no NotificationAction key, so the
// event name was undefined.
test('exposes the notificationaction event name', () => {
  expect(Shared.Event.NotificationAction).toBe('notificationaction');
  expect(BG.EVENT_NOTIFICATIONACTION).toBe('notificationaction');
});

test('onNotificationAction routes through the native bridge with the notificationaction event', () => {
  NativeModule.addListener.mockClear();
  const cb = jest.fn();

  const subscription = BG.onNotificationAction(cb);

  expect(NativeModule.addListener).toHaveBeenCalledWith('notificationaction', cb);
  expect(typeof subscription.remove).toBe('function');
});

// The same defect for any other event: a key read from the shared enum that it does not define.
test('every EVENT_* getter is an event name addListener accepts', () => {
  const getters = Object.getOwnPropertyNames(BG).filter((n) => n.startsWith('EVENT_'));
  expect(getters.length).toBeGreaterThan(0);
  for (const getter of getters) {
    expect([getter, typeof BG[getter]]).toEqual([getter, 'string']);
    expect(() => BG.addListener(BG[getter], jest.fn())).not.toThrow();
  }
});

test('every on* subscription method subscribes without throwing', () => {
  const methods = Object.getOwnPropertyNames(BG).filter((n) => /^on[A-Z]/.test(n));
  expect(methods.length).toBeGreaterThan(0);
  for (const method of methods) {
    NativeModule.addListener.mockClear();
    expect(() => BG[method](jest.fn())).not.toThrow();
    expect([method, typeof NativeModule.addListener.mock.calls[0][0]]).toEqual([method, 'string']);
  }
});
