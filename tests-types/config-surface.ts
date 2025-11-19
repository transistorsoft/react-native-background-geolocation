import BackgroundGeolocation, {
  type Config as RNConfig,
  type State
} from 'react-native-background-geolocation';

const config: RNConfig = {
  logger: {
    logLevel: BackgroundGeolocation.LogLevel.Verbose,
  },
  geolocation: {
    desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
    distanceFilter: 10,
  },
  http: {
    url: 'https://example.com',
    autoSync: true,
  },
  persistence: {
    persistMode: BackgroundGeolocation.PersistMode.All,
    maxDaysToPersist: 7,
  },
  app: {
    stopOnTerminate: false,
    startOnBoot: true,
  },
  activity: {
    disableStopDetection: false,
  },
};

// Ensure `ready` accepts RNConfig and returns a Promise-like thing
BackgroundGeolocation.ready(config).then((state: State) => {
  const enabled: boolean = state.enabled;
  void enabled;
});

// no runtime; compile-only
export {};