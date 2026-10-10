// (WO-096) removeListeners() must remove every on* subscription. It walked EVENT_SUBSCRIPTIONS with
// forEach while each remove() spliced that same array, so it skipped every other subscription, then
// dropped the cache: the skipped ones stayed live in the EventEmitter and out of reach of any later
// removeListeners(). The EventEmitter is a jest spy that records each listener it is given and
// whether it still holds it; nothing here reaches the native module except watchPosition.

const { NativeEventEmitter } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;

const ON_METHODS = ['onLocation', 'onMotionChange', 'onHttp', 'onHeartbeat', 'onProviderChange', 'onEnabledChange'];
const ON_EVENTS = ['location', 'motionchange', 'http', 'heartbeat', 'providerchange', 'enabledchange'];

describe('removeListeners (WO-096)', () => {
  // One entry per listener the EventEmitter was given: its event, the emitter's own remove(), and
  // whether the emitter still holds it.
  let emitter;

  const held = () => emitter.filter((entry) => entry.held).map((entry) => entry.event);

  beforeEach(() => {
    emitter = [];
    jest.spyOn(NativeEventEmitter.prototype, 'addListener').mockImplementation((event) => {
      const entry = { event, held: true };
      entry.remove = jest.fn(() => { entry.held = false; });
      emitter.push(entry);
      return { remove: entry.remove };
    });
  });

  afterEach(async () => {
    await BG.removeListeners();
    jest.restoreAllMocks();
  });

  test.each(['removeListeners', 'removeAllListeners'])('WO-096 %s() removes all six on* subscriptions', async (method) => {
    ON_METHODS.forEach((on) => BG[on](jest.fn()));
    expect(held()).toEqual(ON_EVENTS);

    await BG[method]();

    expect(held()).toEqual([]);
    emitter.forEach((entry) => expect([entry.event, entry.remove.mock.calls.length]).toEqual([entry.event, 1]));
  });

  test('WO-096 several handlers on one event are all removed', async () => {
    BG.onLocation(jest.fn());
    BG.onLocation(jest.fn());
    BG.onLocation(jest.fn());

    await BG.removeListeners();

    expect(held()).toEqual([]);
  });

  test('WO-096 a subscription the app removed itself is not removed again', async () => {
    BG.onLocation(jest.fn());
    const subscription = BG.onMotionChange(jest.fn());
    BG.onHttp(jest.fn());
    subscription.remove();

    await BG.removeListeners();

    expect(held()).toEqual([]);
    emitter.forEach((entry) => expect([entry.event, entry.remove.mock.calls.length]).toEqual([entry.event, 1]));
  });

  test('WO-096 subscribing again after removeListeners() leaves no earlier listener behind', async () => {
    ON_METHODS.forEach((on) => BG[on](jest.fn()));
    await BG.removeListeners();

    ON_METHODS.forEach((on) => BG[on](jest.fn()));
    expect(held()).toEqual(ON_EVENTS);

    await BG.removeListeners();
    expect(held()).toEqual([]);
  });

  // watchPosition adds its listener straight to the EventEmitter, outside EVENT_SUBSCRIPTIONS:
  // removeListeners() leaves an active watch delivering.
  test('WO-096 an active watchPosition listener stays registered', async () => {
    const watch = await BG.watchPosition({ interval: 1000 }, jest.fn());
    ON_METHODS.forEach((on) => BG[on](jest.fn()));

    await BG.removeListeners();

    expect(held()).toEqual(['watchposition']);
    watch.remove();
    expect(held()).toEqual([]);
  });
});
