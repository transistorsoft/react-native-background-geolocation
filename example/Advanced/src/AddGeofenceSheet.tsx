import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { XMarkIcon } from 'react-native-heroicons/solid';

import BackgroundGeolocation from 'react-native-background-geolocation';
import StepperField from './components/StepperField';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export type AddGeofenceForm = {
  identifier: string;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  notifyOnDwell: boolean;
  loiteringDelay: string; // ms as string for TextInput
};

export type AddGeofenceCoordinate = {
  latitude: number;
  longitude: number;
};

interface Props {
  visible: boolean;
  coordinate: AddGeofenceCoordinate | null;   // used for circular
  vertices?: AddGeofenceCoordinate[];         // used for polygon
  onClose: () => void;
  onAdded?: () => void;
}

const IDENTIFIER_ERROR = 'Please enter a unique identifier';
const LOITERING_DELAY_ERROR = 'Please enter a valid number (milliseconds)';

const AddGeofenceSheet: React.FC<Props> = ({
  visible,
  coordinate,
  vertices,
  onClose,
  onAdded,
}) => {
  const isPolygon = !!(vertices && vertices.length > 0);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [SCREEN_HEIGHT - 80], []);

  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');

  const [radius, setRadius] = useState<number>(200);
  const [radiusError, setRadiusError] = useState('');

  const [notifyOnEntry, setNotifyOnEntry] = useState(true);
  const [notifyOnExit, setNotifyOnExit] = useState(true);
  const [notifyOnDwell, setNotifyOnDwell] = useState(false);

  const [loiteringDelay, setLoiteringDelay] = useState<number>(10000);
  const [loiteringDelayError, setLoiteringDelayError] = useState('');
  
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
      onPress={onClose}
    />
  );

  const validateIdentifier = (value: string) => value.trim().length > 0;

  const validateRadius = (value: number) => Number.isFinite(value) && value > 0;

  const validateLoiteringDelay = (value: number) => Number.isFinite(value) && value >= 0;

  const resetForm = () => {
    setIdentifier('');
    setIdentifierError('');
    setNotifyOnEntry(true);
    setNotifyOnExit(true);
    setNotifyOnDwell(false);
    setLoiteringDelay(1000);
    setLoiteringDelayError('');
    setRadius(200);
    setRadiusError('');
  };

  const onPressAdd = async () => {
    const okId = validateIdentifier(identifier);
    const okDelay = validateLoiteringDelay(loiteringDelay);

    setIdentifierError(okId ? '' : IDENTIFIER_ERROR);
    setLoiteringDelayError(okDelay ? '' : LOITERING_DELAY_ERROR);

    if (!okId || !okDelay) return;

    // Circular geofence requires a coordinate (long-press the map first).
    if (!isPolygon && !coordinate) {
      setIdentifierError('No coordinate selected (long-press the map first).');
      return;
    }

    try {
      const geofence: any = {
        identifier: identifier.trim(),
        notifyOnEntry,
        notifyOnExit,
        notifyOnDwell,
        loiteringDelay: loiteringDelay
      };

      if (isPolygon) {
        setRadiusError('');
        geofence.vertices = (vertices || []).map(v => [v.latitude, v.longitude]);
      } else {
        if (!coordinate) {
          setIdentifierError('No coordinate selected (long-press the map first).');
          return;
        }
        if (!validateRadius(radius)) {
          setRadiusError('Please enter a valid radius (meters)');
          return;
        }
        geofence.radius = radius;
        geofence.latitude = coordinate.latitude;
        geofence.longitude = coordinate.longitude;
      }

      await BackgroundGeolocation.addGeofence(geofence);

      resetForm();
      onClose();
      onAdded?.();
    } catch (e: any) {
      console.warn('[AddGeofenceSheet] addGeofence ERROR', e);
      setIdentifierError(String(e?.message || e));
    }
  };

  if (!visible) return null;

  return (
    <BottomSheetModal
      name="AddGeofenceSheet"
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
        <Text style={styles.title}>Add Geofence</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.addButton} onPress={onPressAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>          
        </View>        
      </View>
    
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>Identifier</Text>
            <TextInput
              placeholder="Geofence identifier"
              value={identifier}
              onChangeText={(v) => {
                setIdentifier(v);
                setIdentifierError(validateIdentifier(v) ? '' : IDENTIFIER_ERROR);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
            />
            {identifierError ? <Text style={styles.errorText}>{identifierError}</Text> : null}
          </View>
          {!isPolygon ? (
          <View style={styles.card}>
            <StepperField
              label="Radius"
              unit="m"
              value={radius}
              values={[150, 200, 300, 500, 1000, 2000, 5000, 10000]}
              onValueChange={(v) => {
                setRadius(v);
                setRadiusError(validateRadius(v) ? '' : 'Please enter a valid radius (meters)');
              }}
            />
            {radiusError ? <Text style={styles.errorText}>{radiusError}</Text> : null}
          </View>
        ) : null}

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>notifyOnEntry</Text>
              <Switch value={notifyOnEntry} onValueChange={setNotifyOnEntry} />
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.label}>notifyOnExit</Text>
              <Switch value={notifyOnExit} onValueChange={setNotifyOnExit} />
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <Text style={styles.label}>notifyOnDwell</Text>
              <Switch value={notifyOnDwell} onValueChange={setNotifyOnDwell} />
            </View>
            <View style={styles.separator} />
            <StepperField
              label="Loitering Delay"
              unit="ms"
              value={loiteringDelay}
              values={[1000, 5000, 10000, 30000, 60000]}
              disabled={!notifyOnDwell}
              onValueChange={(v) => {
                setLoiteringDelay(v);
                setLoiteringDelayError(
                  validateLoiteringDelay(v) ? '' : LOITERING_DELAY_ERROR
                );
              }}
            />

            {loiteringDelayError ? (
              <Text style={styles.errorText}>{loiteringDelayError}</Text>
            ) : null}

          </View>
          
          <View style={styles.hint}>            
          {coordinate ? (
            <Text style={styles.hintText}>
              Target: {coordinate.latitude.toFixed(6)}, {coordinate.longitude.toFixed(6)}
            </Text>
          ) : null}
          </View>
        </BottomSheetView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#F5F5F5',
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
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  errorText: {
    marginTop: 8,
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 12,
  },
  hint: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default AddGeofenceSheet;
