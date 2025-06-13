import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions} from 'react-native';
import React from 'react';
import { Color, Font } from '../../assets/Image';
const {width, height} = Dimensions.get('window');
const DropDown = ({visible, onClose, selectedOptions, onSelect}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {[1,3,5]?.map((option, index) => {
              const isSelected = selectedOptions === option;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelect(option)}
                  style={[styles.option, isSelected && styles.selectedOption]}>
                  
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectecText,
                    ]}>
                    {option}
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
const styles = StyleSheet.create({
  overlay: {
    // flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', // show at bottom
    alignItems: 'center',
    // paddingBottom: 70,
    marginTop:height*0.45,
  },
  container: {
    backgroundColor: '#37412a',
    padding: 15,
    borderRadius: 10,
    width: 200,
    // maxHeight: 400,
    borderWidth: 2,
    borderColor: '#bfb68c',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    padding: 10,

    // paddingHorizontal: 10,
  },

  optionText: {
    fontSize: 16,
    color: '#f0f0dc',
    fontFamily: Font.EBGaramond_SemiBold,
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
  selectedOption: {
    backgroundColor: Color.BROWN3,
    borderRadius: 6,
  },
  selectecText: {
    fontSize: 16,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
});
export default DropDown;
