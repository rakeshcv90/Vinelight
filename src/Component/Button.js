import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Color, Font} from '../../assets/Image';

const Button = ({img, text, onPress, left, disabled, width, height,size,font}) => {
  return (
    <View style={[styles.shadowWrapper, {width: width, height: height}]}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => onPress()}>
        {left && (
          <Image source={img} style={{width: 24, height: 24, right: 8}} resizeMode='contain'/>
        )}

        <Text style={[styles.text,{fontSize: size,fontFamily:font}]}>{text}</Text>
        {!left && (
          <Image source={img} style={{width: 16, height: 14, left: 8}} resizeMode='contain'/>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  shadowWrapper: {
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
   
  },
});
