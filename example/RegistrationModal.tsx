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

import BackgroundGeolocation, {
  TransistorAuthorizationToken
} from 'react-native-background-geolocation';

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
          <View style={styles.header}>
            <Text style={styles.title}>Background Geolocation</Text>
            <Text style={styles.subtitle}>Demo Registration</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              This demo app posts data to Transistor Software's demo server so you can view live tracking results:
            </Text>
            <Text style={[styles.infoText, {marginTop: 8}]}>
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

        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    height: 52,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 28,
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