import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";
import { MinusIcon, PlusIcon } from 'react-native-heroicons/solid';

interface StepperFieldProps {
  label: string;
  value: number;
  unit?: string;
  onValueChange: (value: number) => void;
  // Option 1: Array of specific values (preferred for your use case)
  values?: number[];
  // Option 2: Min/max with step increment
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const StepperField: React.FC<StepperFieldProps> = ({
  label,
  value,
  unit = '',
  onValueChange,
  values,
  min,
  max,
  step = 1,
  disabled = false,
}) => {
  // Array-based stepping
  if (values) {
    const currentIndex = values.indexOf(value);

    const handleDecrement = () => {
      if (disabled) return;
      if (currentIndex > 0) {
        onValueChange(values[currentIndex - 1]);
        hapticFeedback('impactLight');
      }
    };

    const handleIncrement = () => {
      if (disabled) return;
      if (currentIndex < values.length - 1) {
        onValueChange(values[currentIndex + 1]);
        hapticFeedback('impactLight');
      }
    };

    const canDecrement = !disabled && currentIndex > 0;
    const canIncrement = !disabled && currentIndex < values.length - 1;

    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}: {value} {unit}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !canDecrement && styles.buttonDisabled]}
            onPress={handleDecrement}
            disabled={!canDecrement}
          >
            <MinusIcon size={20} color={canDecrement ? '#000000' : '#CCCCCC'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !canIncrement && styles.buttonDisabled]}
            onPress={handleIncrement}
            disabled={!canIncrement}
          >
            <PlusIcon size={20} color={canIncrement ? '#000000' : '#CCCCCC'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step-based increment/decrement
  const handleDecrement = () => {
    const newValue = value - step;
    if (min === undefined || newValue >= min) {
      onValueChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onValueChange(newValue);
    }
  };

  const canDecrement = !disabled && (min === undefined || value > min);
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}: {value} {unit}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !canDecrement && styles.buttonDisabled]}
          onPress={handleDecrement}
          disabled={!canDecrement}
        >
          <MinusIcon size={20} color={canDecrement ? '#000000' : '#CCCCCC'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !canIncrement && styles.buttonDisabled]}
          onPress={handleIncrement}
          disabled={!canIncrement}
        >
          <PlusIcon size={20} color={canIncrement ? '#000000' : '#CCCCCC'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  labelDisabled: {
    color: '#999999',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F8F8F8',
  },  
});

export default StepperField;