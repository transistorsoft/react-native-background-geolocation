// (WO-007) JS-side marshaling for the per-permission requestPermission API: does the
// JavaScript layer forward the Permission selector to the native bridge boundary, and
// normalize native rejections to the bare AuthorizationStatus value the cross-platform
// contract documents?  The native module is a jest spy standing in for the bridge.

const { NativeModules } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;
const { Permission, AuthorizationStatus } = require('../src/index.js');

const native = NativeModules.RNBackgroundGeolocation;

describe('named runtime exports (WO-007 regression)', () => {
  // index.d.ts has always promised `export *` of the shared types package, but the
  // runtime module exported only the default class — named VALUE imports were
  // silently undefined (field: "Cannot read property 'Location' of undefined").
  test('Permission and AuthorizationStatus are real values, importable by name', () => {
    expect(Permission).toBeDefined();
    expect(Permission.Location).toBe('location');
    expect(Permission.Motion).toBe('motion');
    expect(AuthorizationStatus).toBeDefined();
    expect(AuthorizationStatus.DeniedAlways).toBe(5);
    // The class statics remain, unchanged.
    expect(BG.Permission).toBe(Permission);
    expect(BG.AuthorizationStatus).toBe(AuthorizationStatus);
  });
});

describe('requestPermission — JS -> native bridge marshaling (WO-007)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('forwards the permission selector to the native module', async () => {
    const request = jest.spyOn(native, 'requestPermission').mockResolvedValue(3);

    await expect(BG.requestPermission('location')).resolves.toBe(3);
    expect(request).toHaveBeenLastCalledWith('location');

    await expect(BG.requestPermission('motion')).resolves.toBe(3);
    expect(request).toHaveBeenLastCalledWith('motion');
  });

  test('the no-argument form passes an explicit null (both bridge architectures expect the slot)', async () => {
    const request = jest.spyOn(native, 'requestPermission').mockResolvedValue(4);

    await expect(BG.requestPermission()).resolves.toBe(4);
    expect(request).toHaveBeenLastCalledWith(null);
  });

  test('normalizes a native rejection to the bare AuthorizationStatus carried in the error code', async () => {
    // Both natives reject with code = String(status).
    const error = new Error('5');
    error.code = '5';
    jest.spyOn(native, 'requestPermission').mockRejectedValue(error);

    await expect(BG.requestPermission('motion')).rejects.toBe(5); // DeniedAlways
  });

  test('passes an unparseable native error through unchanged', async () => {
    const error = new Error('bridge exploded');
    error.code = 'E_UNEXPECTED';
    jest.spyOn(native, 'requestPermission').mockRejectedValue(error);

    await expect(BG.requestPermission()).rejects.toBe(error);
  });
});
