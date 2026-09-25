// JS-side marshaling test for removeGeofences (WO-047): the identifiers list must reach the native
// bridge boundary intact. Both cores read an empty list as "remove all", so before WO-047 — when
// every layer dropped the list — removeGeofences(['home']) deleted every geofence. The native module
// is a jest spy standing in for the bridge; we assert on what crosses JS -> native.

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
    ['an empty list', [[]]],
  ])('%s reaches native as [] (remove all)', async (_label, args) => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await BG.removeGeofences(...args);

    expect(remove).toHaveBeenCalledWith([]);
  });

  test.each([
    ['a string', 'home'],
    ['an object', { identifier: 'home' }],
    ['a number', 42],
    ['a list with a non-string element', ['home', 42]],
    ['a list with a null element', ['home', null]],
  ])('%s rejects without calling native — never coerced to [] (WO-047)', async (_label, arg) => {
    const remove = jest.spyOn(native, 'removeGeofences').mockResolvedValue(true);

    await expect(BG.removeGeofences(arg)).rejects.toThrow('removeGeofences');

    expect(remove).not.toHaveBeenCalled();
  });

  test('propagates a native rejection to the caller', async () => {
    jest.spyOn(native, 'removeGeofences').mockRejectedValue(new Error('remove_geofences_error'));

    await expect(BG.removeGeofences(['missing'])).rejects.toThrow('remove_geofences_error');
  });
});
