import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import {trigger as hapticFeedback} from "react-native-haptic-feedback";

import { ChevronDownIcon } from 'react-native-heroicons/solid';

interface DropdownFieldProps {
  label: string;
  value: any;
  items: { label: string; value: any }[];
  onValueChange: (value: any) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  value,
  items,
  onValueChange,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = items.find(i => i.value === value);
    return found ? found.label : 'Select…';
  }, [items, value]);

  React.useEffect(() => {
    if (visible) {
      hapticFeedback('impactLight', {});
    }
    
  }, [visible])

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={styles.dropdownButton}
      >
        <Text style={styles.dropdownValue} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <ChevronDownIcon size={18} color="#000000" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* Backdrop */}
        <Pressable style={styles.menuBackdrop} onPress={() => setVisible(false)}>
          {/* Stop propagation */}
          <Pressable style={styles.menuContainer} onPress={() => {}}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>{label}</Text>
            </View>

            {items.map((item, idx) => (
              <React.Fragment key={`dd:${label}:${idx}:${String(item.value)}`}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    onValueChange(item.value);
                  }}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
                {idx < items.length - 1 ? (
                  <View style={styles.menuSeparator} />
                ) : null}
              </React.Fragment>
            ))}

            
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingRight: 10,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#E6E6E6',
  },
});

export default DropdownField;