import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,  // Add this
} from 'react-native';

import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";

import { COLORS } from './util/Colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;  // Add this

export type AddGeofenceType = 'circular' | 'polygon' | 'cancel';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: AddGeofenceType) => void;
}

const AddGeofenceTypeSheet: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);  // Try percentage like you originally had

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={onClose}
      />
    ),
    [onClose]
  );

  const handleSelect = (type: AddGeofenceType) => {
    hapticFeedback('impactMedium', {});
    onSelect(type);
  };

  if (!visible) return null;

  return (
    <BottomSheetModal
      name="AddGeofenceTypeSheet"
      ref={bottomSheetRef}
      index={0}
      //snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={true}      
      onDismiss={onClose}      
      detached={false}      
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      handleIndicatorStyle={{ backgroundColor: '#CCCCCC', width: 40 }}
      topInset={80}  // Add this back like ConfigView has
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: COLORS.black,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E6E6E6',
        }}>
          Add Geofence
        </Text>
        
        <TouchableOpacity
          style={{ paddingHorizontal: 16, paddingVertical: 14 }}
          onPress={() => handleSelect('circular')}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>Circular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ paddingHorizontal: 16, paddingVertical: 14 }}
          onPress={() => handleSelect('polygon')}
        >
          <Text style={{ fontSize: 16, color: COLORS.black }}>Polygon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderTopWidth: 1,
            borderTopColor: '#E6E6E6',
          }}
          onPress={() => handleSelect('cancel')}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.black }}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    zIndex: 999,
    paddingBottom: 50,
    flex: 1    
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
    height: 5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  cancelOption: {
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default AddGeofenceTypeSheet;