import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

// @ts-expect-error: SVG modules are provided by react-native-svg-transformer at build-time.
import TransistorLogo from '../images/transistor-logo.svg';

import BackgroundGeolocation from 'react-native-background-geolocation';


type Props = {
  visible: boolean;
  onComplete: (data: { organization: string; username: string }) => void;
};

const TRACKER_HOST = 'https://tracker.transistorsoft.com';

const RegistrationModal = ({ visible, onComplete }: Props) => {
  const [organization, setOrganization] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDefaultsFromStorage = useCallback(async () => {
    try {
      const [storedOrg, storedUser] = await Promise.all([
        AsyncStorage.getItem('@transistor_org'),
        AsyncStorage.getItem('@transistor_username'),
      ]);

      // Only overwrite when values exist in storage.
      if (storedOrg) {
        setOrganization(storedOrg);
      }
      if (storedUser) {
        setUsername(storedUser);
      }
    } catch (e) {
      console.warn('[RegistrationModal] Failed to load defaults from AsyncStorage:', e);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadDefaultsFromStorage();
    }
  }, [visible, loadDefaultsFromStorage]);

  const handleRegister = async () => {
    setLoading(true);
    
    // Ensure any current cached token is destroyed.
    await BackgroundGeolocation.destroyTransistorAuthorizationToken(TRACKER_HOST);

    // Register device with tracker.transistorsoft.com to receive a JSON Web Token (JWT).
    const token = await BackgroundGeolocation.findOrCreateTransistorAuthorizationToken(organization, username);

    await Promise.all([
      AsyncStorage.setItem('@transistor_registered', 'true'),
      AsyncStorage.setItem('@transistor_org', organization),
      AsyncStorage.setItem('@transistor_username', username),
    ]);

    await BackgroundGeolocation.setConfig({
      transistorAuthorizationToken: token
    });

    setLoading(false);
    onComplete({ organization, username });
    
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      presentationStyle="fullScreen" // iOS fullscreen
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <TransistorLogo width={300} />
              </View>
              <Text style={styles.title}>Background Geolocation</Text>
              <Text style={styles.subtitle}>Demo Registration</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                This demo app posts data to Transistor Software's demo server so you can view live tracking results:
              </Text>
              <Text selectable style={[styles.infoText, {marginTop: 8}]}>
                <Text style={styles.infoLink}>{TRACKER_HOST}/{organization || 'organization'}</Text>
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Organization</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organization name"
                placeholderTextColor="#999"
                value={organization}
                onChangeText={setOrganization}
                autoCapitalize="words"
                autoCorrect={false}
              />

              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!organization || !username || loading) && styles.buttonDisabled
              ]}
              onPress={handleRegister}
              disabled={!organization || !username || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4f4f50ff',    
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,    
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 12,
    paddingVertical: 5,    
    paddingHorizontal: 5,
    borderRadius: 14,
    backgroundColor: '#4f4f50ff',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  form: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 18,
  },
  button: {
    height: 54,
    backgroundColor: '#007AFF',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  infoLink: {
    fontWeight: '700',
    color: '#007AFF',
  },
});

export default RegistrationModal;