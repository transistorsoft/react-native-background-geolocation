// (WO-144) The deprecated removeListener(event, callback) must remove the listener it names. In every 5.x
// release before this it threw "Cannot read properties of undefined (reading 'apply')": index.js still called
// NativeModule.removeListener, which the 5.0 refactor had deleted. The EventEmitter is a jest spy that records
// each listener it is given and whether it still holds it, as in remove-listeners.test.js.

const { NativeEventEmitter } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;

describe('removeListener (WO-144)', () => {
  // One entry per listener the EventEmitter was given: its event, the emitter's own remove(), and
  // whether the emitter still holds it.
  let emitter;
  let warn;

  const held = () => emitter.filter((entry) => entry.held).map((entry) => entry.event);

  beforeEach(() => {
    emitter = [];
    jest.spyOn(NativeEventEmitter.prototype, 'addListener').mockImplementation((event) => {
      const entry = { event, held: true };
      entry.remove = jest.fn(() => { entry.held = false; });
      emitter.push(entry);
      return { remove: entry.remove };
    });
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    await BG.removeListeners();
    jest.restoreAllMocks();
  });

  test('WO-144 removes the listener it names, once, and returns nothing', () => {
    const cb = jest.fn();
    BG.onLocation(cb);

    expect(BG.removeListener('location', cb)).toBeUndefined();

    expect(held()).toEqual([]);
    expect(emitter[0].remove).toHaveBeenCalledTimes(1);
  });

  test('WO-144 leaves another handler on the same event registered', () => {
    const cb = jest.fn();
    BG.onLocation(jest.fn());
    BG.onLocation(cb);
    BG.onLocation(jest.fn());

    BG.removeListener('location', cb);

    expect(emitter.map((entry) => entry.held)).toEqual([true, false, true]);
  });

  test('WO-144 one function on two events: only the named event loses it', () => {
    const cb = jest.fn();
    BG.onLocation(cb);
    BG.onMotionChange(cb);

    BG.removeListener('location', cb);

    expect(held()).toEqual(['motionchange']);
  });

  test('WO-144 one function subscribed twice to an event: each call removes one registration', () => {
    const cb = jest.fn();
    BG.onLocation(cb);
    BG.onLocation(cb);

    BG.removeListener('location', cb);
    expect(emitter.map((entry) => entry.held)).toEqual([false, true]);

    BG.removeListener('location', cb);
    expect(held()).toEqual([]);
  });

  test('WO-144 a callback that was never subscribed removes nothing and does not throw', () => {
    BG.onLocation(jest.fn());

    expect(() => BG.removeListener('location', jest.fn())).not.toThrow();

    expect(held()).toEqual(['location']);
  });

  test('WO-144 removeListeners() afterwards does not remove that listener a second time', async () => {
    const cb = jest.fn();
    BG.onLocation(cb);
    BG.onMotionChange(jest.fn());
    BG.removeListener('location', cb);

    await BG.removeListeners();

    expect(held()).toEqual([]);
    emitter.forEach((entry) => expect([entry.event, entry.remove.mock.calls.length]).toEqual([entry.event, 1]));
  });

  test('WO-144 warns that the method is deprecated', () => {
    const cb = jest.fn();
    BG.onLocation(cb);

    BG.removeListener('location', cb);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('BackgroundGeolocation.removeListener is deprecated');
  });

  test('WO-144 an unknown event name still throws the validation message', () => {
    expect(() => BG.removeListener('nosuchevent', jest.fn())).toThrow("BackgroundGeolocation#un - Unknown event 'nosuchevent'");
    expect(() => BG.removeListener(42, jest.fn())).toThrow('BackgroundGeolocation#un must be provided a {String} event');
  });
});
