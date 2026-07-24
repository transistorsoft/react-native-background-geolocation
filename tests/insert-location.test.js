// JS-side marshaling test for insertLocation: does the JavaScript API layer forward the caller's
// location to the native bridge boundary *unchanged*, and pass the returned uuid back — with no
// real SDK and no device? The native module is a jest spy standing in for the bridge; we assert on
// what it receives (the args that crossed JS -> native) and what the caller ultimately gets back.
//
// This is the JS half of the two-halves bridge-marshaling strategy. The native half (ReadableMap ->
// JSONObject) is covered by the Android Robolectric test `RNBackgroundGeolocationModuleTest`.

const { NativeModules } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;

const native = NativeModules.RNBackgroundGeolocation;

describe('insertLocation — JS -> native bridge marshaling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('forwards the location to the native module unchanged and resolves its uuid', async () => {
    const insert = jest.spyOn(native, 'insertLocation').mockResolvedValue('uuid-abc');

    const location = {
      coords: { latitude: 45.5152, longitude: -73.6104 },
      timestamp: 1705314600000, // numeric epoch
      extras: { source: 'import' },
    };

    const uuid = await BG.insertLocation(location);

    // The exact object reaches the native boundary — no mangling by index.js / NativeModule.
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(location);

    // Type/shape preserved across the JS layers: numeric timestamp stays a number, coords/extras nested.
    const [passed] = insert.mock.calls[0];
    expect(typeof passed.timestamp).toBe('number');
    expect(passed.coords).toEqual({ latitude: 45.5152, longitude: -73.6104 });
    expect(passed.extras).toEqual({ source: 'import' });

    // The uuid string flows back out through NativeModule + index.js.
    expect(uuid).toBe('uuid-abc');
  });

  test('propagates a native rejection to the caller', async () => {
    jest.spyOn(native, 'insertLocation').mockRejectedValue(new Error('insert_location_error'));

    await expect(
      BG.insertLocation({ coords: { latitude: 0, longitude: 0 }, timestamp: 0 })
    ).rejects.toThrow('insert_location_error');
  });
});
