import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const TooltipModal = ({
  visible,
  onClose,
  options = [],
  selectedOptions = [],
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const checked = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelect(option)}
                  style={styles.option}>
                  <View style={styles.checkbox}>
                    {checked && <View style={styles.checked} />}
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TooltipModal;

const styles = StyleSheet.create({
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'flex-end',   // show at bottom
  alignItems: 'center',
  paddingBottom: 70,  
  },
  container: {
    backgroundColor: '#37412a',
    padding: 15,
    borderRadius: 10,
    width: 250,
    // maxHeight: 400,
    borderWidth: 2,
    borderColor: '#bfb68c',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#f0f0dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#f0f0dc',
    borderRadius: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#f0f0dc',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#dcd6b4',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#2e2e1f',
    fontWeight: 'bold',
  },
});
