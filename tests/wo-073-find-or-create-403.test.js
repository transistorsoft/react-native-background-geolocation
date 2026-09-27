// (WO-073) findOrCreateTransistorAuthorizationToken rejects on a 403 and resolves a DUMMY_TOKEN on
// any other failure. React Native's rejections carry `code` and `message`, never the `status` the
// JavaScript tested, so a 403 resolved a DUMMY_TOKEN. The native spy rejects with the keys React
// Native copies onto the Error (code, message); the fixed natives put the HTTP status in `code`.

const { NativeModules } = require('react-native'); // mapped to mocks/react-native.js via jest config
const BG = require('../src/index.js').default;

const native = NativeModules.RNBackgroundGeolocation;

function nativeError(code, message) {
  return Object.assign(new Error(message), { code, message });
}

describe('findOrCreateTransistorAuthorizationToken (WO-073)', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const findOrCreate = () => BG.findOrCreateTransistorAuthorizationToken('o', 'u', 'https://x');

  test('WO-073 a 403 rejects', async () => {
    jest.spyOn(native, 'getTransistorToken').mockRejectedValue(nativeError('403', 'Forbidden'));
    await expect(findOrCreate()).rejects.toMatchObject({ status: '403', code: '403', message: 'Forbidden' });
  });

  test('WO-073 another status resolves a DUMMY_TOKEN', async () => {
    jest.spyOn(native, 'getTransistorToken').mockRejectedValue(nativeError('500', 'Server error'));
    await expect(findOrCreate()).resolves.toMatchObject({ accessToken: 'DUMMY_TOKEN', url: 'https://x' });
  });

  test('WO-073 the pre-fix iOS code resolves a DUMMY_TOKEN', async () => {
    jest.spyOn(native, 'getTransistorToken')
      .mockRejectedValue(nativeError('get_transistor_token_error', 'Forbidden'));
    await expect(findOrCreate()).resolves.toMatchObject({ accessToken: 'DUMMY_TOKEN' });
  });

  test('WO-073 an Android JSONException message resolves a DUMMY_TOKEN', async () => {
    const text = 'Value <html> of type java.lang.String cannot be converted to JSONObject';
    jest.spyOn(native, 'getTransistorToken').mockRejectedValue(nativeError(text, text));
    await expect(findOrCreate()).resolves.toMatchObject({ accessToken: 'DUMMY_TOKEN' });
  });

  test('WO-073 success sets the url', async () => {
    const spy = jest.spyOn(native, 'getTransistorToken')
      .mockResolvedValue({ accessToken: 'a', refreshToken: 'r', expires: 42 });
    await expect(findOrCreate()).resolves.toEqual({ accessToken: 'a', refreshToken: 'r', expires: 42, url: 'https://x' });
    expect(spy).toHaveBeenCalledWith('o', 'u', 'https://x');
  });
});
