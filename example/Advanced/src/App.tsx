import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegistrationModal from './RegistrationModal';
import { MapPinIcon, PlayIcon, PauseIcon } from 'react-native-heroicons/solid';
import FABMenu from './FABMenu';
import TSMapView from './TSMapView';
import ConfigView from './ConfigView';

import BackgroundGeolocation from 'react-native-background-geolocation';

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [configViewVisible, setConfigViewVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [registrationVisible, setRegistrationVisible] = useState(false);
  const [odometer, setOdometer] = useState<number>(0);
  const [odometerError, setOdometerError] = useState<number>(0);
  
  React.useEffect(() => {
    // 1.  [BackgroundGeolocation] Event listeners
    const onLocation = BackgroundGeolocation.onLocation(location => {
      console.log('[location] -', location);      
      setOdometer(location.odometer);
      setOdometerError(location.odometer_error);
    }, error => {
      console.warn('[location] ERROR -', error);
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange(event => {
      console.log('[motionchange] -', event.isMoving, event.location);
      setIsMoving(event.isMoving);
    });

    const onEnabledChange = BackgroundGeolocation.onEnabledChange(enabled => {
      console.log('[enabledchange] -', enabled);
      setIsEnabled(enabled);
    });

    // 2. Bootstrap registration + initialize BackgroundGeolocation
    bootstrap();
    
    return () => {
      console.log('App unmounted');
      onLocation.remove();
      onMotionChange.remove();
      onEnabledChange.remove();
    };
  }, []);
  
  const bootstrap = async () => {
    try {
      const registered = await AsyncStorage.getItem('@transistor_registered');

      if (!registered) {
        // First launch: wait for RegistrationModal to collect org/username.
        setRegistrationVisible(true);
        return;
      }

      const [org, username] = await Promise.all([
        AsyncStorage.getItem('@transistor_org'),
        AsyncStorage.getItem('@transistor_username'),
      ]);

      if (!org || !username) {
        console.warn('[App] Registration data missing/corrupt. Showing RegistrationModal');
        setRegistrationVisible(true);
        return;
      }

      await initializeBackgroundGeolocation(org, username);
    } catch (e) {
      console.warn('[App] bootstrap ERROR', e);
      setRegistrationVisible(true);
    }
  };

  const initializeBackgroundGeolocation = async (org: string, username: string) => {
    try {
      setIsInitialized(true);
      // 1) Fetch/create tracker JWT
      const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(org, username);

      // 2) Configure plugin WITH token (like old demo app)
      const state = await BackgroundGeolocation.ready({
        reset: false, // <-- NO NOT USE reset: false IN YOUR APP UNLESS YOU KNOW WHAT IT DOES.  THIS IS ONLY FOR THIS DEMO APP
        transistorAuthorizationToken: token, // <-- For authorization with Transistor Software demo server ONLY.

        geolocation: {
          distanceFilter: 10,
          desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
        },
        http: {
          autoSync: true
        },
        persistence: {
          maxDaysToPersist: 14,
        }, 
        app: {
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
        },
        logger: {
          debug: true,
          logLevel: BackgroundGeolocation.LogLevel.Verbose,
        },
      });

      setOdometer(state.odometer);
      setOdometerError(state.odometerError);
      setIsEnabled(state.enabled);
      setIsMoving(state.isMoving);

      // Success: hide registration if it was showing
      setRegistrationVisible(false);
    } catch (error) {
      console.error('[BackgroundGeolocation] initialize ERROR', error);
      setRegistrationVisible(true);
    }
  };

  const renderOdometer = () => {
    const km = odometer / 1000;
    const kmText = `${km.toFixed(2)} km`;
    
    return `${kmText} (± ${Math.round(odometerError)} m)`    
  };

  const handleMenuItemPress = (action: string) => {
    console.log('Menu action:', action);
    
    if (action === 'config') {
      console.log('Setting configViewVisible to true');
      if (registrationVisible) {
        console.log('[App] Ignoring ConfigView while RegistrationModal is visible');
        return;
      }
      setConfigViewVisible(true);
    }
    // Handle other menu actions here
  };

  const onClickChangePace = () => {    
    if (!isEnabled) {
      console.log('Ignoring changePace: BackgroundGeolocation is disabled');
      return;
    }
    const nowMoving = !isMoving;
    setIsMoving(nowMoving);
    BackgroundGeolocation.changePace(nowMoving);
    console.log('Tracking state changed:', nowMoving);
  };

  const onClickGetCurrentPosition = async () => {
    console.log('Get current position clicked');
    try {
      const location = await BackgroundGeolocation.getCurrentPosition({
        timeout: 30,          // 30 second timeout to fetch location
        maximumAge: 0,    // Accept the last-known-location if not older than 5s.
        desiredAccuracy: 10, // Try to fetch a location with an accuracy of 10 meters.
        samples: 3,           // Fetch 3 location samples in attempt to improve accuracy.
        extras: { getCurrentPosition: true }
      });
      console.log('Current position:', location);
      BackgroundGeolocation.logger.debug("BackgroundGeolocation.logger.debug test: location received: " + location.uuid);
    } catch (error) {
      console.warn('Error getting current position:', error);
    }
    // Your get current position logic will go here
  };

  const onToggleEnabled = async () => {
    const enabled = !isEnabled;
    setIsEnabled(enabled);
    
    if (enabled) {
      try {
        await BackgroundGeolocation.start();        
      } catch (error) {
        console.warn('Error starting BackgroundGeolocation:', error);
      } 
      
      
    } else {
      setIsMoving(false);      
      BackgroundGeolocation.stop();      
    }

    console.log('Enabled state changed:', !isEnabled);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFD500" />
      
      {/* Top Toolbar */}
      <View style={styles.topToolbar}>
        <Text style={styles.appTitle}>BG Geo Demo</Text>
        <TouchableOpacity onPress={onToggleEnabled}>
          <View style={[
            styles.toggle,
            { backgroundColor: isEnabled ? '#34C759' : '#E0E0E0' }
          ]}>
            <View style={[
              styles.toggleThumb,
              { alignSelf: isEnabled ? 'flex-end' : 'flex-start' }
            ]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Map Content Area */}
      <TSMapView hideAddGeofencePrompt={configViewVisible} />

      {/* Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        {/* Get Current Position Button */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onClickGetCurrentPosition}
        >
          <MapPinIcon size={24} color="#000000" />
        </TouchableOpacity>

        {/* Motion Status / Odometer - Centered */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            {isMoving ? 'MOVING' : 'STATIONARY'}
          </Text>
          <Text style={styles.statusDistance}>
            {renderOdometer()}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity
          disabled={!isEnabled}
          style={[
            styles.playButton,
            {
              backgroundColor: isMoving ? '#FF3B30' : '#34C759',
              opacity: isEnabled ? 1 : 0.4,
            },
          ]}
          onPress={onClickChangePace}
        >
  {isMoving ? (
    <PauseIcon size={24} color="#FFFFFF" />
  ) : (
    <PlayIcon size={24} color="#FFFFFF" />
  )}
</TouchableOpacity>
      </View>

      {/* FAB Menu */}
      <FABMenu onMenuItemPress={handleMenuItemPress} />
      
      {/* Config View */}
      <ConfigView 
        visible={configViewVisible}
        onClose={() => {
          console.log('Closing ConfigView');
          setConfigViewVisible(false);
        }}
        onRequestRegistration={() => {
          console.log('[App] Showing RegistrationModal (requested by ConfigView)');
          setRegistrationVisible(true);
        }}
      />
      <RegistrationModal
        visible={registrationVisible}
        onComplete={async ({ organization, username }) => {
          console.log('[App] Registration complete:', organization, username);
          setRegistrationVisible(false);
          if (!isInitialized) {
            await initializeBackgroundGeolocation(organization, username);
          }          
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#FFD500',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
    backgroundColor: '#FFD500',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  statusDistance: {
    fontSize: 11,
    color: '#000000',
    marginTop: 2,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default App;