import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { 
  TrashIcon,
  CloudIcon,
  ArrowPathIcon,
  MapPinIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  PlusIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';

import AsyncStorage from '@react-native-async-storage/async-storage';

import BackgroundGeolocation, {
  Subscription
} from 'react-native-background-geolocation';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";

interface FABMenuProps {
  onMenuItemPress?: (action: string) => void;
}

const FABMenu: React.FC<FABMenuProps> = ({ onMenuItemPress }) => {
  const EMAIL_LOG_STORAGE_KEY = '@transistor:email_log_address';

  const [fabOpen, setFabOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const watchPositionSubRef = useRef<Subscription | null>(null);
  const [isWatchingPosition, setIsWatchingPosition] = useState(false);
  const [emailLogVisible, setEmailLogVisible] = useState(false);
  const [emailLogAddress, setEmailLogAddress] = useState('');
  const [emailLogSending, setEmailLogSending] = useState(false);


  React.useEffect(() => {
    return () => {
      // cleanup on unmount
      try {
        watchPositionSubRef.current?.remove();
      } catch {}
      watchPositionSubRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const impact = (fabOpen) ? 'impactHeavy' : 'impactLight';
    hapticFeedback(impact, {});
  }, [fabOpen]);  
  
  const toggleFab = () => {
    setFabOpen(!fabOpen);
  };

  const handleMenuItemPress = async (action: string) => {
    console.log(`[FABMenu] handleMenuItemPress: ${action}`);
    hapticFeedback('impactHeavy', {});

    if (onMenuItemPress) {
      onMenuItemPress(action);      
    }
    switch (action) {
      case 'destroyLocations':        
        destroyLocations();
        break;
      case 'sync':
        sync();
        break;
      case 'resetOdometer':
        resetOdometer();
        break;
      case 'watchPosition':
        toggleWatchPosition();
        break;
      case 'requestPermission':
        const providerState = await BackgroundGeolocation.getProviderState();
        Alert.alert("Request Location Permission", `Current authorization status: ${providerState.status}`, [
          {text: 'When in Use', onPress: () => {requestPermission('WhenInUse')}},
          {text: 'Always', onPress: () => {requestPermission('Always')}},
        ], { cancelable: false });

        break;
      case 'emailLog':
        openEmailLogDialog();
        break;
      case 'config':
        console.log('[FABMenu] Config');
        break;
      default:
        console.log('[FABMenu] Unknown action:', action);
    } 
    // Disabled to keep FAB menu open for multiple actions
    //
    //setFabOpen(false);
  };

  /**
   * BackgroundGeolocation.destroyLocations()
   */
  const destroyLocations = async () => {
    try {
      const count = await BackgroundGeolocation.getCount();

      if (!count) {
        Alert.alert('Destroy Locations', 'Locations database is empty');
        return;
      }

      Alert.alert(
        'Confirm Destroy Locations',
        `Destroy ${count} records?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await BackgroundGeolocation.destroyLocations();
                console.log('[FABMenu] Destroy locations complete');
              } catch (e) {
                console.warn('[FABMenu] Destroy locations error:', e);
                Alert.alert('Destroy locations error', String(e));
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      console.warn('[FABMenu] getCount error:', e);
      Alert.alert('Destroy locations error', String(e));
    }
  }

  /**
   * BackgroundGeolocation.sync()
   */
  const sync = async () => {
    try {
      if (isSyncing) {
        console.log('[FABMenu] Sync already in progress (ignored)');
        return;
      }

      const count = await BackgroundGeolocation.getCount();

      if (!count) {
        Alert.alert('Sync', 'Locations database is empty');
        return;
      }

      Alert.alert(
        'Confirm Sync',
        `Sync ${count} records?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                setIsSyncing(true);
                await BackgroundGeolocation.sync();
                console.log('[FABMenu] Sync complete');
              } catch (e) {
                console.warn('[FABMenu] Sync error:', e);
                Alert.alert('Sync error', String(e));
              } finally {
                setIsSyncing(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (e) {
      console.warn('[FABMenu] getCount/sync error:', e);
      Alert.alert('Sync error', String(e));
    }
  };

  /**
   * BackgroundGeolocation.resetOdometer()
   */
  const resetOdometer = async () => {
    try {
      await BackgroundGeolocation.setOdometer(0);
    } catch (error) {
      console.warn('[FABMenu] Reset Odometer error:', error);
    }
  };

  /**
   * BackgroundGeolocation.watchPosition()
   */
  const toggleWatchPosition = async () => {
    // STOP
    if (watchPositionSubRef.current) {
      console.log('[FABMenu] stop watchPosition:', watchPositionSubRef.current.id);
      watchPositionSubRef.current.remove();
      watchPositionSubRef.current = null;
      setIsWatchingPosition(false);
      return;
    }
    // START
    console.log('[FABMenu] start watchPosition');
    try {
      const sub = await BackgroundGeolocation.watchPosition({
          timeout: 30000,
          interval: 1000,
          persist: false,
        }, (location) => {
          console.log('[watchPosition]', location.coords.latitude, location.coords.longitude);
        }, (error) => {
          console.warn('[watchPosition] ERROR:', error);
        }
      );

      watchPositionSubRef.current = sub;
      setIsWatchingPosition(true);
      console.log('[FABMenu] watchPosition started');
    } catch (e) {
      console.warn('[FABMenu] watchPosition start error:', e);
      Alert.alert('watchPosition error', String(e));
      watchPositionSubRef.current = null;
      setIsWatchingPosition(false);
    }
  };

  /**
   * BackgroundGeolocation.requestPermission()
   */
  const requestPermission = async (request: 'WhenInUse' | 'Always') => {
    await BackgroundGeolocation.setConfig({
      geolocation: {
        locationAuthorizationRequest: request
      }
    });
    try {
      const status = await BackgroundGeolocation.requestPermission();
      console.log(`[requestPermission] status: ${status}`);

      setTimeout(() => {
        Alert.alert("Request Permission Result", `Authorization status: ${status}`, [
          {text: 'Ok', onPress: () => {}},
        ], { cancelable: false });
      }, 10);
    } catch (error) {
      console.warn('[FABMenu] requestPermission error:', error);
    }  
  };

  const validateEmail = (value: string) => {
    const v = (value || '').trim();
    if (!v) return false;
    const at = v.indexOf('@');
    const dot = v.lastIndexOf('.');
    return at > 0 && dot > at + 1 && dot < v.length - 1;
  };

  const openEmailLogDialog = async () => {
    try {
      const cached = await AsyncStorage.getItem(EMAIL_LOG_STORAGE_KEY);
      if (cached) setEmailLogAddress(cached);
    } catch (e) {
      console.warn('[FABMenu] Failed to load cached emailLog address:', e);
    }
    setEmailLogVisible(true);
  };

  const closeEmailLogDialog = () => {
    if (emailLogSending) return;
    setEmailLogVisible(false);
  };

  /**
   * BackgroundGeolocation.logger.emailLog()
   * @param emailAddress 
   */
  const emailLog = async (emailAddress: string) => {
    const email = (emailAddress || '').trim();

    if (!validateEmail(email)) {
      Alert.alert('Email Log', 'Please enter a valid email address');
      return;
    }

    setEmailLogSending(true);

    try {
      // Cache address for next time (non-fatal if it fails)
      try {
        await AsyncStorage.setItem(EMAIL_LOG_STORAGE_KEY, email);
      } catch (e) {
        console.warn('[FABMenu] Failed to cache emailLog address:', e);
      }

      await BackgroundGeolocation.logger.emailLog(email);
    } catch (e) {
      console.warn('[FABMenu] Email Log error:', e);
      Alert.alert('Email Log error', String(e));
      return;
    } finally {
      setEmailLogSending(false);
    }

    setEmailLogVisible(false);
  };

  return (
    <>
      {/* FAB Menu Items */}
      {fabOpen && (
        <View style={styles.fabMenu}>
          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('destroyLocations')}
          >
            <Text style={styles.fabMenuLabel}>Destroy locations</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FF6B6B' }]}>
              <TrashIcon size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('sync')}
          >
            <Text style={styles.fabMenuLabel}>Sync</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <CloudIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('resetOdometer')}
          >
            <Text style={styles.fabMenuLabel}>Reset odometer</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <ArrowPathIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('watchPosition')}
          >
            <Text style={styles.fabMenuLabel}>{isWatchingPosition ? 'Stop WatchPosition' : 'Watch Position'}</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <MapPinIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('requestPermission')}
          >
            <Text style={styles.fabMenuLabel}>requestPermission</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <ShieldCheckIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('emailLog')}
          >
            <Text style={styles.fabMenuLabel}>Email Log</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <EnvelopeIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.fabMenuItem}
            onPress={() => handleMenuItemPress('config')}
          >
            <Text style={styles.fabMenuLabel}>Config</Text>
            <View style={[styles.fabMenuButton, { backgroundColor: '#FFD500' }]}>
              <Cog6ToothIcon size={24} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={toggleFab}>
        {fabOpen ? (
          <XMarkIcon size={28} color="#000000" />
        ) : (
          <PlusIcon size={28} color="#000000" />
        )}
      </TouchableOpacity>
      <Modal
        visible={emailLogVisible}
        transparent
        animationType="fade"
        onRequestClose={closeEmailLogDialog}
      >
        <Pressable style={styles.emailBackdrop} onPress={closeEmailLogDialog}>
          <Pressable style={styles.emailCard} onPress={() => {}}>
            <Text style={styles.emailTitle}>Email Log</Text>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <TextInput
                value={emailLogAddress}
                onChangeText={setEmailLogAddress}
                placeholder="Email address"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.emailInput}
                editable={!emailLogSending}
              />
            </KeyboardAvoidingView>

            <View style={styles.emailButtons}>
              <TouchableOpacity
                style={[styles.emailBtn, styles.emailBtnCancel]}
                onPress={closeEmailLogDialog}
                disabled={emailLogSending}
              >
                <Text style={styles.emailBtnText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.emailBtn,
                  styles.emailBtnOk,
                  (!validateEmail(emailLogAddress) || emailLogSending) && styles.emailBtnDisabled,
                ]}
                onPress={() => emailLog(emailLogAddress)}
                disabled={!validateEmail(emailLogAddress) || emailLogSending}
              >
                <Text style={[styles.emailBtnText, styles.emailBtnTextOk]}>
                  {emailLogSending ? 'SENDING…' : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </>    
  );
};

const styles = StyleSheet.create({
  fabMenu: {
    position: 'absolute',
    right: 17,
    bottom: 170,
    alignItems: 'flex-end',
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fabMenuLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabMenuButton: {
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
  fab: {
    position: 'absolute',
    right: 12,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD500',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
    emailBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  emailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  emailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  emailInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
    marginBottom: 14,
  },
  emailButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emailBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  emailBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  emailBtnOk: {
    backgroundColor: '#007AFF',
  },
  emailBtnDisabled: {
    opacity: 0.5,
  },
  emailBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.3,
  },
  emailBtnTextOk: {
    color: '#FFFFFF',
  },
});

export default FABMenu;