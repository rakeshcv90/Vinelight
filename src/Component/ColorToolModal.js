import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Color, Font} from '../../assets/Image';

// const colorCode = [
//   {id: 1, code: '#000000', name: 'Black'},

//   {id: 5, code: '#800000', name: 'Maroon'},
//   {id: 6, code: '#980000', name: 'Dark Red'},
//   {id: 7, code: '#FF0000', name: 'Red'},
//   {id: 8, code: '#FF6666', name: 'Light Red'},
//   {id: 9, code: '#FF9900', name: 'Orange'},
//   {id: 10, code: '#FFA500', name: 'Amber'},
//   {id: 11, code: '#FFFF00', name: 'Yellow'},
//   {id: 12, code: '#FFFFCC', name: 'Light Yellow'},
//   {id: 13, code: '#00FF00', name: 'Lime'},
//   {id: 14, code: '#008000', name: 'Green'},
//   {id: 15, code: '#90EE90', name: 'Light Green'},
//   {id: 16, code: '#00FFFF', name: 'Cyan'},
//   {id: 17, code: '#40E0D0', name: 'Turquoise'},
//   {id: 18, code: '#4A86E8', name: 'Blue'},
//   {id: 19, code: '#0000FF', name: 'Dark Blue'},
//   {id: 20, code: '#ADD8E6', name: 'Light Blue'},
//   {id: 21, code: '#800080', name: 'Purple'},
//   {id: 22, code: '#9900FF', name: 'Violet'},
//   {id: 23, code: '#FF00FF', name: 'Magenta'},
//   {id: 24, code: '#FFC0CB', name: 'Pink'},
//   {id: 25, code: '#8B4513', name: 'Brown'},
//   {id: 26, code: '#A52A2A', name: 'Dark Brown'},
//   {id: 27, code: '#D2B48C', name: 'Tan'},
// ];
const colorCode = [
  {id: 1, code: '#000000', name: 'Black'},
  {id: 2, code: '#1C1C1C', name: 'Dark Charcoal'},
  {id: 3, code: '#2F4F4F', name: 'Dark Slate Gray'},
  {id: 4, code: '#36454F', name: 'Charcoal'},
  {id: 5, code: '#800000', name: 'Maroon'},
  {id: 6, code: '#8B0000', name: 'Dark Red'},
  {id: 7, code: '#4B0082', name: 'Indigo'},
  {id: 8, code: '#00008B', name: 'Dark Blue'},
  {id: 9, code: '#191970', name: 'Midnight Blue'},
  {id: 10, code: '#006363', name: 'Teal'},
  {id: 11, code: '#006400', name: 'Dark Green'},
  {id: 12, code: '#026802', name: 'Forest Green'},
  {id: 13, code: '#654321', name: 'Dark Brown'},
  {id: 14, code: '#2C1608', name: 'Bistre'},
  {id: 15, code: '#3D2B1F', name: 'Dark Coffee'},
  {id: 16, code: '#2E2E2E', name: 'Jet Gray'},
  {id: 17, code: '#3F3F3F', name: 'Eclipse'},
  {id: 18, code: '#301934', name: 'Deep Purple'},
  {id: 19, code: '#5D3954', name: 'Dark Mauve'},
  {id: 20, code: '#4A0E0E', name: 'Burgundy'},
  {id: 21, code: '#800080', name: 'Purple'},
  {id: 22, code: '#8300DA', name: 'Violet'},
  {id: 23, code: '#9F009F', name: 'Magenta'},
  {id: 24, code: '#1C55B1', name: 'Blue'},
  {id: 25, code: '#FF0000', name: 'Red'},

];
const ColorToolModal = ({visible, onClose, onSelect, selectedColor}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Font Color</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {colorCode.map(option => {
              const isSelected = selectedColor === option.code;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.colorOption,
                    isSelected && styles.selectedColorOption,
                  ]}
                  onPress={() => onSelect(option.code)}>
                  <View
                    style={[styles.colorCircle, {backgroundColor: option.code}]}
                  />
                  <Text
                    style={[
                      styles.colorText,
                      isSelected && styles.selectedText,
                    ]}>
                    {option.name}
                  </Text>
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

export default ColorToolModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 150,
  },
  container: {
    backgroundColor: '#2f2f1f',
    padding: 16,
    borderRadius: 12,
    width: 240,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#bfb68c',
  },
  title: {
    fontSize: 18,
    color: '#f0f0dc',
    fontFamily: Font.EBGaramond_Bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
  },
  selectedColorOption: {
    backgroundColor: '#4d4d33',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#dcd6b4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#2e2e1f',
    fontWeight: 'bold',
  },
});
