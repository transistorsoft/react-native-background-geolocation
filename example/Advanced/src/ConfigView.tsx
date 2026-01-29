import React, { useRef, useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import {trigger as hapticFeedback} from "react-native-haptic-feedback";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { EllipsisVerticalIcon } from 'react-native-heroicons/solid';
import BackgroundGeolocation, { State } from 'react-native-background-geolocation';
import { PLUGIN_SETTINGS, SettingOption } from './config/PluginSettings';
import StepperField from './components/StepperField';
import ToggleField from './components/ToggleField';
import TextField from './components/TextField';
import DropdownField from './components/DropdownField';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface ConfigViewProps {
  visible: boolean;
  onClose: () => void;
  onRequestRegistration?: () => void;
}

const ConfigView: React.FC<ConfigViewProps> = ({ visible, onClose, onRequestRegistration }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [SCREEN_HEIGHT - 80], []);
  
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [pluginState, setPluginState] = useState<State | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const fieldChangeBufferRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize settings with default values
  useEffect(() => {
    const initialSettings: Record<string, any> = {};
    
    const platformSettings = Platform.OS === 'ios' 
      ? [...PLUGIN_SETTINGS.common, ...PLUGIN_SETTINGS.ios]
      : [...PLUGIN_SETTINGS.common, ...PLUGIN_SETTINGS.android];

    platformSettings.forEach(setting => {
      initialSettings[setting.name] = setting.defaultValue;
    });

    setSettings(initialSettings);

    // Load current plugin state
    BackgroundGeolocation.getState().then((state: State) => {
      setPluginState(state);
      // Update settings with current values from plugin
      const currentSettings: Record<string, any> = {};
      platformSettings.forEach(setting => {
        currentSettings[setting.name] = (state as any)[setting.name] ?? setting.defaultValue;
      });
      setSettings(currentSettings);
    });
  }, []);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      setMenuVisible(false);
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);
  const onPressMenu = () => {
    hapticFeedback('impactHeavy', {});
    setMenuVisible(true);
  } 

  const onContextMenu = async (option: string) => {
    setMenuVisible(false);
    hapticFeedback('impactHeavy', {});
    switch (option) {
      case 'tracker-authorization':
        console.log('[ConfigView] Tracker Authorization)');
        onRequestRegistration?.();        
        break;

      case 'remove-geofences':
        try {
          console.log('[ConfigView] Removing all geofences');
          await BackgroundGeolocation.removeGeofences();
        } catch (e) {
          console.warn('[ConfigView] removeGeofences ERROR', e);
        }
        break;

      default:
        console.warn('[ConfigView] Unknown context-menu option:', option);
    }
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      onPress={onClose}
    />
  );

  const doSetConfig = async (config: any) => {
    console.log('[doSetConfig]', config);//JSON.stringify(config, null, 2));
    const state = await BackgroundGeolocation.setConfig(config);
    setPluginState(state);    
  };


  const handleSettingChange = (setting: SettingOption, value: any) => {
    // Prevent unnecessary updates
    if (settings[setting.name] === value) {
      return;
    }

    // Update local state
    setSettings(prev => ({
      ...prev,
      [setting.name]: value,
    }));

    // Build config object with proper group structure
    const config: any = {};

    // Special case: trackingMode uses .start() / .startGeofences()
    if (setting.name === 'trackingMode') {
      console.log(`[onFieldChange] trackingMode: ${value}`);
      if (value === 1) {
        BackgroundGeolocation.start();
      } else {
        BackgroundGeolocation.startGeofences();
      }
      return; // Don't call setConfig
    }

    // Special case: notificationPriority
    if (setting.name === 'notificationPriority') {
      const notification: any = pluginState?.notification || {};
      notification.priority = value;
      config['notification'] = notification;
    } else {
      // Map group names to config structure
      const groupMapping: Record<string, string> = {
        'geolocation': 'geolocation',
        'activity': 'activity',
        'http': 'http',
        'persistence': 'persistence',
        'app': 'app',
        'logger': 'logger'
      };

      const configGroup = groupMapping[setting.group];
      
      if (configGroup) {
        // Create nested structure
        config[configGroup] = {
          [setting.name]: value
        };
      } else {
        // Fallback: put at root level
        config[setting.name] = value;
      }
    }

    // Handle buffering for text inputs
    if (setting.inputType === 'text') {
      if (fieldChangeBufferRef.current) {
        clearTimeout(fieldChangeBufferRef.current);
      }
      fieldChangeBufferRef.current = setTimeout(() => {
        doSetConfig(config);
      }, 1000);
    } else {
      // Immediate update for toggle/select/stepper
      doSetConfig(config);
    }
  };


  const renderField = (setting: SettingOption) => {
    const value = settings[setting.name];

    switch (setting.inputType) {
      case 'toggle':
        return (
          <ToggleField
            key={setting.name}
            label={setting.name}
            value={value ?? setting.defaultValue}
            onValueChange={(newValue) => handleSettingChange(setting, newValue)}
          />
        );

      case 'text':
        return (
          <TextField
            key={setting.name}
            label={setting.name}
            value={value ?? setting.defaultValue}
            onValueChange={(newValue) => handleSettingChange(setting, newValue)}
          />
        );

      case 'select':
        const items = setting.values?.map(v => {
          if (typeof v === 'object' && 'label' in v && 'value' in v) {
            return { label: v.label, value: v.value };
          }
          return { label: String(v), value: v };
        }) || [];

        console.log(`[${setting.name}] items:`, items); // Debug log

        return (
          <DropdownField
            key={setting.name}
            label={setting.name}
            value={value ?? setting.defaultValue}
            items={items}
            onValueChange={(newValue) => handleSettingChange(setting, newValue)}
          />
        );

      case 'stepper':
        return (
          <StepperField
            key={setting.name}
            label={setting.name}
            value={value ?? setting.defaultValue}
            values={setting.values as number[]}
            onValueChange={(newValue) => handleSettingChange(setting, newValue)}
          />
        );

      default:
        return null;
    }
  };

  const groupedSettings = useMemo(() => {
    const platformSettings = Platform.OS === 'ios' 
      ? [...PLUGIN_SETTINGS.common, ...PLUGIN_SETTINGS.ios]
      : [...PLUGIN_SETTINGS.common, ...PLUGIN_SETTINGS.android];

    const groups: Record<string, SettingOption[]> = {};
    
    platformSettings.forEach(setting => {
      if (!groups[setting.group]) {
        groups[setting.group] = [];
      }
      groups[setting.group].push(setting);
    });

    return groups;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fieldChangeBufferRef.current) {
        clearTimeout(fieldChangeBufferRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      topInset={80}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Configuration</Text>
          <Text style={styles.subtitle}>Config-changes are applied immediately, in real-time</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onPressMenu}>
          <EllipsisVerticalIcon size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* Backdrop */}
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          {/* Stop propagation */}
          <Pressable style={styles.menuContainer} onPress={() => {}}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onContextMenu('tracker-authorization')}
            >
              <Text style={styles.menuItemText}>Tracker Authorization</Text>
            </TouchableOpacity>
            <View style={styles.menuSeparator} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => onContextMenu('remove-geofences')}
            >
              <Text style={styles.menuItemText}>Remove Geofences</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <BottomSheetScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {Object.entries(groupedSettings).map(([groupName, groupSettings]) => (
          <View key={groupName} style={styles.section}>
            <Text style={styles.sectionTitle}>{groupName}</Text>
            <View style={styles.sectionContent}>
              {groupSettings.map((setting, index) => (
                <View key={setting.name}>
                  {renderField(setting)}
                  {/* Add separator line between fields (not after last one) */}
                  {index < groupSettings.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#F5F5F5', // Light grey background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
    height: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: '#F5F5F5', // Light grey background
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 4,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuContainer: {
    position: 'absolute',
    top: 90,
    right: 16,
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#E6E6E6',
  },
});


export default ConfigView;