import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Color, Font} from '../../assets/Image';

const Button = ({img, text, onPress, left, disabled}) => {
  return (
    <View style={styles.shadowWrapper}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => onPress()}>
        {left && (
          <Image source={img} style={{width: 20, height: 20, right: 8}} />
        )}

        <Text style={styles.text}>{text}</Text>
        {!left && (
          <Image source={img} style={{width: 16, height: 14, left: 8}} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  shadowWrapper: {
    width: 91,
    height: 44,
    borderRadius: 30,
    backgroundColor: '#CBBB92', // Shadow color
    paddingBottom: 5, // Height of bottom shadow
    paddingLeft: 2,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#D5C69C', // Beige background
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 4,

    // Android Shadow
    elevation: 8,
  },
  text: {
    color: Color.GREEN,
    fontSize: 16,
    fontWeight: '600',

    fontFamily: Font.EB_Garamond,
  },
});
