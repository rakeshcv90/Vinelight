import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
// import ColorPicker from 'react-native-wheel-color-picker';

const { width } = Dimensions.get('window');

const ColorModal = ({ visible, onClose, colorData, setColorData }) => {
  const pickerRef = useRef(null);

  const [swatchesOnly] = useState(false);
  const [swatchesLast] = useState(true);
  const [swatchesEnabled] = useState(true);
  const [disc] = useState(false);

  const handleColorChange = color => {
    setColorData(color);
  };

  const handleColorChangeComplete = color => {
    
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.backdrop}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Select a Color</Text>

        {/* <ColorPicker
          ref={pickerRef}
          color={colorData}
          swatchesOnly={swatchesOnly}
          onColorChange={handleColorChange}
          onColorChangeComplete={handleColorChangeComplete}
          thumbSize={40}
          sliderSize={40}
          noSnap={true}
          row={false}
          swatchesLast={swatchesLast}
          swatches={swatchesEnabled}
          discrete={disc}
          wheelLoadingIndicator={<ActivityIndicator size={40} />}
          sliderLoadingIndicator={<ActivityIndicator size={20} />}
          useNativeDriver={false}
          useNativeLayout={false}
          style={styles.colorPicker}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => pickerRef.current?.revert()}
            style={[styles.button, styles.revertButton]}
          >
            <Text style={styles.buttonText}>Revert</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.closeButton]}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  </Modal>
  );
};

export default ColorModal;

const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: '#fff',
      paddingVertical: 20,
      paddingHorizontal: 16,
      width: width * 0.9,
      borderRadius: 16,
      alignItems: 'center',
    //   elevation: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
      color: '#333',
    },
    colorPicker: {
      width: '100%',
      
    },
    buttonRow: {
      flexDirection: 'row',
  marginTop: 400,
      width: '100%',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    revertButton: {
      backgroundColor: '#000',
    },
    closeButton: {
      backgroundColor: '#888',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
