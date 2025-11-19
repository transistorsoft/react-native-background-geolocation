const BG = require('../src/index.js').default;

test('ready resolves and returns state', async () => {
  const state = await BG.ready({ logger: { logLevel: BG.LogLevel.Verbose } });
  expect(state.enabled).toBe(false);
});
