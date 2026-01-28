import { Platform } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SOUND_MAP: Record<string, Record<string, any>> = {
  ios: {
    LONG_PRESS_ACTIVATE: 1113,
    LONG_PRESS_CANCEL: 1075,
    ADD_GEOFENCE: 1114,
    BUTTON_CLICK: 1104,
    MESSAGE_SENT: 1303,
    ERROR: 1006,
    OPEN: 1502,
    CLOSE: 1503,
    FLOURISH: 1509,
    TEST_MODE_CLICK: 1130,
    TEST_MODE_SUCCESS: 1114,
  },
  android: {
    LONG_PRESS_ACTIVATE: 'DOT_START',
    LONG_PRESS_CANCEL: 'DOT_STOP',
    ADD_GEOFENCE: 'DOT_SUCCESS',
    BUTTON_CLICK: 'BUTTON_CLICK',
    MESSAGE_SENT: 'WHOO_SEND_SHARE',
    ERROR: 'ERROR',
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    FLOURISH: 'MOTIONCHANGE_TRUE',
    TEST_MODE_CLICK: 'POP',
    TEST_MODE_SUCCESS: 'BEEP_ON',
  },
};

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const playSound = (soundName: string, haptic?: string | boolean): void => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  const soundId = SOUND_MAP[platform][soundName];

  if (soundId !== undefined) {
    BackgroundGeolocation.playSound(soundId);
  } else {
    console.warn(`[playSound] Sound not found: ${soundName} for platform: ${platform}`);
  }

  // Handle haptic feedback
  if (haptic) {
    if (typeof haptic === 'string') {
      // Custom haptic type
      ReactNativeHapticFeedback.trigger(haptic as any, hapticOptions);
    } else {
      // Default haptic for the sound
      const defaultHaptic = getDefaultHaptic(soundName);
      if (defaultHaptic) {
        ReactNativeHapticFeedback.trigger(defaultHaptic, hapticOptions);
      }
    }
  }
};

// Helper to get default haptic for each sound
const getDefaultHaptic = (soundName: string): string | null => {
  const hapticMap: Record<string, string> = {
    LONG_PRESS_ACTIVATE: 'impactLight',
    LONG_PRESS_CANCEL: 'impactMedium',
    ADD_GEOFENCE: 'notificationSuccess',
    BUTTON_CLICK: 'impactLight',
    MESSAGE_SENT: 'notificationSuccess',
    ERROR: 'notificationError',
    OPEN: 'impactLight',
    CLOSE: 'impactLight',
    FLOURISH: 'notificationSuccess',
    TEST_MODE_CLICK: 'impactLight',
    TEST_MODE_SUCCESS: 'notificationSuccess',
  };
  return hapticMap[soundName] || null;
};

// Convenience function for just haptic
export const triggerHaptic = (type: string = 'impactLight'): void => {
  ReactNativeHapticFeedback.trigger(type as any, hapticOptions);
};

// Export sound names as constants for type safety
export const SOUNDS = {
  LONG_PRESS_ACTIVATE: 'LONG_PRESS_ACTIVATE',
  LONG_PRESS_CANCEL: 'LONG_PRESS_CANCEL',
  ADD_GEOFENCE: 'ADD_GEOFENCE',
  BUTTON_CLICK: 'BUTTON_CLICK',
  MESSAGE_SENT: 'MESSAGE_SENT',
  ERROR: 'ERROR',
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  FLOURISH: 'FLOURISH',
  TEST_MODE_CLICK: 'TEST_MODE_CLICK',
  TEST_MODE_SUCCESS: 'TEST_MODE_SUCCESS',
} as const;

// Export haptic types
export const HAPTICS = {
  IMPACT_LIGHT: 'impactLight',
  IMPACT_MEDIUM: 'impactMedium',
  IMPACT_HEAVY: 'impactHeavy',
  RIGID: 'rigid',
  SOFT: 'soft',
  NOTIFICATION_SUCCESS: 'notificationSuccess',
  NOTIFICATION_WARNING: 'notificationWarning',
  NOTIFICATION_ERROR: 'notificationError',
  SELECTION: 'selection',
} as const;