jest.mock('../src/NativeModule', () => ({
  ready: jest.fn().mockResolvedValue({ enabled: false })
}));

const NativeModule = require('../src/NativeModule');
const BG = require('../src/index.js').default;

test('ready forwards compound config to native', async () => {
  const cfg = {
    logger: { logLevel: BG.LogLevel.Verbose },
    geolocation: {
      desiredAccuracy: BG.DesiredAccuracy.High,
      distanceFilter: 10,
    },
    http: {
      url: 'https://example.com',
      autoSync: true,
    },
  };

  await BG.ready(cfg);

  expect(NativeModule.ready).toHaveBeenCalledTimes(1);
  const [arg] = NativeModule.ready.mock.calls[0];

  // Same object shape (or deep-equal)
  expect(arg).toMatchObject(cfg);
});