import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from 'react-native';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}


const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  value,
  onValueChange,
}) => {
  const onToggle = (newValue: boolean) => {
    hapticFeedback('impactLight', {});
    onValueChange(newValue);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: '#34C759' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
});

export default ToggleField;