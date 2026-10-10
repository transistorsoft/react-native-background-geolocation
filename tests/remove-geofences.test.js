// JS-side marshaling test for removeGeofences (WO-047): the identifiers list must reach the native
// bridge boundary intact. Before WO-047, when every layer dropped the list, removeGeofences(['home'])
// deleted every geofence. (WO-055) "All" crosses as null and an empty list as [], which removes none.
// The native module is a jest spy standing in for the bridge; we assert on what crosses JS -> native.

const { NativeModules } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;

const native = NativeModules.RNBackgroundGeolocation;

describe('removeGeofences — JS -> native bridge marshaling (WO-047)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('forwards the identifiers to the native module unchanged', async () => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await expect(BG.removeGeofences(['a', 'b'])).resolves.toBe(true);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(['a', 'b']);
  });

  test.each([
    ['no argument', []],
    ['undefined', [undefined]],
    ['null', [null]],
  ])('%s reaches native as null (remove all) (WO-055)', async (_label, args) => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await BG.removeGeofences(...args);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(null);
  });

  test('an empty list reaches native as [] (remove none) (WO-055)', async () => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await expect(BG.removeGeofences([])).resolves.toBe(true);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith([]);
  });

  test.each([
    ['a string', 'home'],
    ['an object', { identifier: 'home' }],
    ['a number', 42],
    ['a list with a non-string element', ['home', 42]],
    ['a list with a null element', ['home', null]],
    ['a sparse list', ['home', , 'work']], // eslint-disable-line no-sparse-arrays
  ])('%s rejects without calling native — never coerced to null or [] (WO-047)', async (_label, arg) => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await expect(BG.removeGeofences(arg)).rejects.toThrow('removeGeofences');

    expect(remove).not.toHaveBeenCalled();
  });

  test('the v4 callback form removeGeofences(success, failure) removes all and calls success (WO-047)', async () => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);
    const success = jest.fn();
    const failure = jest.fn();

    BG.removeGeofences(success, failure);
    await new Promise(setImmediate);

    expect(remove).toHaveBeenCalledWith(null);   // (WO-055)
    expect(success).toHaveBeenCalledWith(true);
    expect(failure).not.toHaveBeenCalled();
  });

  test('the v4 callback form calls failure on a native rejection (WO-047)', async () => {
    jest.spyOn(native, 'removeGeofences').mockRejectedValue(new Error('remove_geofences_error'));
    const success = jest.fn();
    const failure = jest.fn();

    BG.removeGeofences(success, failure);
    await new Promise(setImmediate);

    expect(success).not.toHaveBeenCalled();
    expect(failure).toHaveBeenCalledWith(new Error('remove_geofences_error'));
  });

  test('propagates a native rejection to the caller', async () => {
    jest.spyOn(native, 'removeGeofences').mockRejectedValue(new Error('remove_geofences_error'));

    await expect(BG.removeGeofences(['missing'])).rejects.toThrow('remove_geofences_error');
  });
});
