import React, {useEffect, useState} from 'react';
import {
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Alert,
  Modal,
  Platform
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BackgroundGeolocation, {
  Location

} from 'react-native-background-geolocation';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('unknown');
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [odometer, setOdometer] = useState(0);

  useEffect(() => {
  
    // 1. Subscribe to events
    const onLocation = BackgroundGeolocation.onLocation((location) => {
      console.log('-> [location]', location);
      setLastLocation(location);
      if (location.odometer) {
        setOdometer(location.odometer);
      }
    }, (error) => {
      console.warn('-> [location] ERROR:', error);
    });

    const onGeofence = BackgroundGeolocation.onGeofence((geofenceEvent) => {
      console.log('-> [geofence]', geofenceEvent.geofence);

      Alert.alert(
        'Geofence Event',
        `Identifier: ${geofenceEvent.identifier}\nAction: ${geofenceEvent.action}`
      );
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange(event => {
      console.log('[motionchange]', event.isMoving, event.location);
      setIsMoving(event.isMoving);
      if (event.location) {
        setLastLocation(event.location);
        if (event.location.odometer) {
          setOdometer(event.location.odometer);
        }
      }
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange(activity => {
      console.log('-> [activitychange]', activity);
      setCurrentActivity(activity.activity);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange(provider => {
      console.log('-> [providerchange]', provider.enabled, provider.status);
      setProviderEnabled(provider.enabled);
    });    

    //BackgroundGeolocation.destroyTransistorAuthorizationToken('https://tracker.transistorsoft.com');
    
    BackgroundGeolocation.findOrCreateTransistorAuthorizationToken('_transistor-rn-test', 'crs').then(async (token) => {
      const state = await BackgroundGeolocation.ready({
        reset: true,
        transistorAuthorizationToken: token,
        logger: {
          debug: true,
          logLevel: BackgroundGeolocation.LogLevel.Verbose
        },
        geolocation: {
          desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
          distanceFilter: 50,
          locationUpdateInterval: 1000,
          stopTimeout: 1,
        },
        http: {
          autoSync: true,
        },
        app: {
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
        }
      });
      console.log('-> [ready] BackgroundGeolocation is configured and ready:', state.enabled);
      setTrackingEnabled(state.enabled === true);
      setIsMoving(state.isMoving === true);
      if (state.odometer) {
        setOdometer(state.odometer);
      }
    });
    
    // 3. Cleanup when component unmounts
    return () => {
      console.log("** CLEANUP CALLED ***");
      onLocation.remove();
      onGeofence.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, []);

  // Handler for toggling tracking
  const handleToggleTracking = async (value: boolean) => {
    setTrackingEnabled(value);
    if (value) {
      try {
        await BackgroundGeolocation.start();
      } catch (e) {
        console.warn('Failed to start tracking:', e);
        Alert.alert('Error', 'Failed to start tracking');
      }
    } else {
      try {
        await BackgroundGeolocation.stop();
        setIsMoving(false);
      } catch (e) {
        console.warn('Failed to stop tracking:', e);
        Alert.alert('Error', 'Failed to stop tracking');
      }
    }
  };

  // Handler for changePace (play/pause button)
  const handleChangePace = async () => {
    if (!trackingEnabled) {
      Alert.alert('Info', 'Please enable tracking first');
      return;
    }
    
    try {
      const newState = !isMoving;
      await BackgroundGeolocation.changePace(newState);
      // State will be updated via onMotionChange event
    } catch (e) {
      console.warn('changePace error:', e);
      Alert.alert('Error', 'Failed to change pace');
    }
  };

  // Handler for getCurrentPosition
  const handleGetCurrentPosition = async () => {
    try {
      const location = await BackgroundGeolocation.getCurrentPosition({
        timeout: 30,
        maximumAge: 5000,
        desiredAccuracy: 0,
        samples: 3,
      });
      console.log('[getCurrentPosition] -', location);
      setLastLocation(location);
      
      const result = await BackgroundGeolocation.addGeofence({
        identifier: 'TestGeofence',
        radius: 200,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyOnDwell: false
      });
      console.log('[addGeofence] -', result);
            
      //Alert.alert('Success', `Position: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`);
    } catch (e) {
      console.error('getCurrentPosition error:', e);
      Alert.alert('Error', 'Failed to get current position');
    }
  };

  // Menu action handlers
  const handleDestroyLog = async () => {
    try {
      await BackgroundGeolocation.logger.destroyLog();
      Alert.alert('Success', 'Log file destroyed');
      //setMenuVisible(false);
    } catch (e) {
      console.warn('destroyLog error:', e);
      Alert.alert('Error', 'Failed to destroy log');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const status = await BackgroundGeolocation.requestPermission();
      Alert.alert('Permission Status', `Status: ${status}`);
      //setMenuVisible(false);
    } catch (e) {
      console.warn('requestPermission error:', e);
      Alert.alert('Error', 'Failed to request permission');
    }
  };

  const handleResetOdometer = async () => {
    try {
      const location = await BackgroundGeolocation.resetOdometer();
      setOdometer(0);
      Alert.alert('Success', 'Odometer reset to 0');
      //setMenuVisible(false);
    } catch (e) {
      console.warn('resetOdometer error:', e);
      Alert.alert('Error', 'Failed to reset odometer');
    }
  };

  const handleEmailLog = async () => {
    try {
      await BackgroundGeolocation.logger.emailLog('chris@transistorsoft.com');      
    } catch (e) {
      console.warn('emailLog error:', e);
      Alert.alert('Error', 'Failed to email log');
    }
  };

  const handleSync = async () => {
    const count = await BackgroundGeolocation.getCount();
    if (count === 0) {
      Alert.alert('Info', 'Database is empty. No locations to sync.');
      return;
    }
    Alert.alert(
      'Confirm', 
      `Upload ${count} locations?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upload',           
          onPress: async () => {
            try {      
              const locations = await BackgroundGeolocation.sync();
              Alert.alert('Sync Complete', `Synced ${locations.length} locations`);
              //setMenuVisible(false);
            } catch (e) {
              console.warn('sync error:', e);
              Alert.alert('Error', 'Failed to sync');
            }
          }
        }
      ]
    );    
  };

  const handleDestroyLocations = async () => {
    const count = await BackgroundGeolocation.getCount();
    if (count === 0) {
      Alert.alert('Info', 'Database is empty. No locations to destroy.');
      return;
    }
    Alert.alert(
      'Confirm', 
      `Destroy ${count} locations?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Destroy', 
          style: 'destructive',
          onPress: async () => {
            try {
              await BackgroundGeolocation.destroyLocations();
              Alert.alert('Success', 'All locations destroyed');
              //setMenuVisible(false);
            } catch (e) {
              console.warn('destroyLocations error:', e);
              Alert.alert('Error', 'Failed to destroy locations');
            }
          }
        }
      ]
    );
  };

  const handleGetState = async () => {
    try {
      const state = await BackgroundGeolocation.getState();
      Alert.alert('Current State', JSON.stringify(state, null, 2));
      setMenuVisible(false);
    } catch (e) {
      console.warn('getState error:', e);
      Alert.alert('Error', 'Failed to get state');
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={{flex: 1}}>
      <ScrollView 
        style={[styles.container, {backgroundColor: theme.background}]}
        contentContainerStyle={{paddingBottom: safeAreaInsets.bottom + 20}}
      >
        {/* Header with Menu Button */}
        <View style={[styles.header, {paddingTop: safeAreaInsets.top + 20}]}>
          <View>
            <Text style={[styles.headerTitle, {color: theme.text}]}>Background Geolocation</Text>
            <Text style={[styles.headerSubtitle, {color: theme.secondaryText}]}>Demo Application</Text>
          </View>
          <TouchableOpacity
            style={[styles.menuButton, {backgroundColor: theme.cardBackground}]}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={[styles.menuButtonText, {color: theme.text}]}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Status Cards */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusCard, {backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.statusLabel, {color: theme.secondaryText}]}>GPS Provider</Text>
            <View style={[styles.statusIndicator, {backgroundColor: providerEnabled ? '#4CAF50' : '#FF5252'}]} />
            <Text style={[styles.statusValue, {color: theme.text}]}>
              {providerEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          <View style={[styles.statusCard, {backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.statusLabel, {color: theme.secondaryText}]}>Activity</Text>
            <Text style={[styles.activityIcon, {fontSize: 24}]}>
              {getActivityIcon(currentActivity)}
            </Text>
            <Text style={[styles.statusValue, {color: theme.text}]}>
              {currentActivity}
            </Text>
          </View>

          <View style={[styles.statusCard, {backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.statusLabel, {color: theme.secondaryText}]}>Odometer</Text>
            <Text style={[styles.odometerValue, {color: theme.primary}]}>
              {(odometer / 1000).toFixed(1)}
            </Text>
            <Text style={[styles.statusValue, {color: theme.text}]}>km</Text>
          </View>
        </View>

        {/* Main Controls */}
        <View style={[styles.controlsCard, {backgroundColor: theme.cardBackground}]}>
          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, {color: theme.text}]}>Tracking</Text>
              <Text style={[styles.switchDescription, {color: theme.secondaryText}]}>
                {trackingEnabled ? 'Location updates active' : 'Location updates paused'}
              </Text>
            </View>
            <Switch
              value={trackingEnabled}
              onValueChange={handleToggleTracking}
              trackColor={{ false: '#767577', true: '#81C784' }}
              thumbColor={trackingEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {/* Play/Pause Button for changePace */}
          <View style={styles.paceContainer}>
            <Text style={[styles.paceLabel, {color: theme.secondaryText}]}>Motion State</Text>
            <TouchableOpacity
              style={[
                styles.paceButton,
                {
                  backgroundColor: trackingEnabled 
                    ? (isMoving ? '#FF5722' : '#4CAF50')
                    : '#9E9E9E'
                }
              ]}
              onPress={handleChangePace}
              disabled={!trackingEnabled}
            >
              <Text style={styles.paceButtonText}>
                {isMoving ? '❚❚' : '▶'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.paceStatus, {color: theme.text}]}>
              {isMoving ? 'Moving' : 'Stationary'}
            </Text>
          </View>
        </View>

        {/* Location Info */}
        {lastLocation && (
          <View style={[styles.locationCard, {backgroundColor: theme.cardBackground}]}>
            <Text style={[styles.cardTitle, {color: theme.text}]}>Last Location</Text>
            <View style={styles.locationRow}>
              <Text style={[styles.locationLabel, {color: theme.secondaryText}]}>Latitude:</Text>
              <Text style={[styles.locationValue, {color: theme.text}]}>
                {lastLocation.coords.latitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={[styles.locationLabel, {color: theme.secondaryText}]}>Longitude:</Text>
              <Text style={[styles.locationValue, {color: theme.text}]}>
                {lastLocation.coords.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={[styles.locationLabel, {color: theme.secondaryText}]}>Speed:</Text>
              <Text style={[styles.locationValue, {color: theme.text}]}>
                {(lastLocation.coords.speed || 0).toFixed(1)} m/s
              </Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={[styles.locationLabel, {color: theme.secondaryText}]}>Accuracy:</Text>
              <Text style={[styles.locationValue, {color: theme.text}]}>
                {lastLocation.coords.accuracy.toFixed(0)}m
              </Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: theme.primary}]}
          onPress={handleGetCurrentPosition}
        >
          <Text style={styles.actionButtonText}>📍 Get Current Position</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={[styles.modalContent, {backgroundColor: theme.cardBackground}]}
          >
            <View style={[styles.modalHeader, {borderBottomColor: theme.secondaryText + '30'}]}>
              <Text style={[styles.modalTitle, {color: theme.text}]}>Actions</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={[styles.closeButton, {color: theme.secondaryText}]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={handleRequestPermission}>
                <Text style={styles.menuItemIcon}>🔐</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Request Permission</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Request location permission
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleResetOdometer}>
                <Text style={styles.menuItemIcon}>🔄</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Reset Odometer</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Reset distance counter to 0
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleSync}>
                <Text style={styles.menuItemIcon}>🔄</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Sync</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Sync cached locations to server
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleGetState}>
                <Text style={styles.menuItemIcon}>📊</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Get State</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    View current plugin state
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleEmailLog}>
                <Text style={styles.menuItemIcon}>📧</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Email Log</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Send debug log via email
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleDestroyLog}>
                <Text style={styles.menuItemIcon}>🗑️</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: theme.text}]}>Destroy Log</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Clear debug log file
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleDestroyLocations}>
                <Text style={styles.menuItemIcon}>⚠️</Text>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, {color: '#FF5252'}]}>Destroy Locations</Text>
                  <Text style={[styles.menuItemDescription, {color: theme.secondaryText}]}>
                    Delete all cached locations
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function getActivityIcon(activity: string): string {
  switch(activity) {
    case 'still': return '🧍';
    case 'on_foot': return '🚶';
    case 'walking': return '🚶';
    case 'running': return '🏃';
    case 'on_bicycle': return '🚴';
    case 'in_vehicle': return '🚗';
    default: return '❓';
  }
}

const lightTheme = {
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  text: '#212121',
  secondaryText: '#757575',
  primary: '#2196F3',
};

const darkTheme = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#FFFFFF',
  secondaryText: '#B0B0B0',
  primary: '#2196F3',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityIcon: {
    marginBottom: 8,
  },
  odometerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  controlsCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
  },
  paceContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  paceLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  paceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  paceButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  paceStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    padding: 4,
  },
  menuItems: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
  },
});

export default App;
