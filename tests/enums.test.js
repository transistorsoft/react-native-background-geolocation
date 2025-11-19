const BG = require('../src/index.js').default;

test('exposes attached enum namespaces', () => {
  const BG = require('../src/index.js').default;

  // Core enums
  expect(BG.LogLevel.Verbose).toBeDefined();
  expect(BG.DesiredAccuracy.High).toBeDefined();
  expect(BG.PersistMode.All).toBeDefined();
  expect(BG.AuthorizationStrategy.Jwt).toBe('jwt');
  expect(BG.LocationFilterPolicy.Adjust).toBeDefined();
  expect(BG.KalmanProfile.Default).toBeDefined();

  // Notification priority & activity
  expect(BG.NotificationPriority.Default).toBeDefined();
  expect(BG.NotificationPriority.Min).toBeDefined();
  expect(BG.ActivityType.Other).toBeDefined();
  expect(BG.ActivityType.AutomotiveNavigation).toBeDefined();

  // HTTP + trigger activity
  expect(BG.HttpMethod.Post).toBeDefined();
  expect(BG.TriggerActivity.Walking).toBeDefined();
});
