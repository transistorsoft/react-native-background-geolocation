const BG = require('../src/index.js').default;
const Shared = require('@transistorsoft/background-geolocation-types');

test('RN enum namespaces mirror shared enum values', () => {
  // Spot-check full object equality for safety
  expect(BG.LogLevel).toEqual(Shared.LogLevel);
  expect(BG.DesiredAccuracy).toEqual(Shared.DesiredAccuracy);
  expect(BG.PersistMode).toEqual(Shared.PersistMode);
  expect(BG.AuthorizationStrategy).toEqual(Shared.AuthorizationStrategy);
  expect(BG.LocationFilterPolicy).toEqual(Shared.LocationFilterPolicy);
  expect(BG.KalmanProfile).toEqual(Shared.KalmanProfile);
  expect(BG.NotificationPriority).toEqual(Shared.NotificationPriority);
  expect(BG.HttpMethod).toEqual(Shared.HttpMethod);
  expect(BG.TriggerActivity).toEqual(Shared.TriggerActivity);
  expect(BG.ActivityType).toEqual(Shared.ActivityType);
});