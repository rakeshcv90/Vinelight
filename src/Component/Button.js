import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Color, Font} from '../../assets/Image';

const Button = ({
  img,
  text,
  onPress,
  left,
  disabled,
  width,
  height,
  size,
  font,
  backgroundColor,
  color,
  tintColor,
}) => {
  return (
    <View style={[styles.shadowWrapper, {width: width, height: height,backgroundColor: backgroundColor}]}>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: backgroundColor}]}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => onPress()}>
        {left && (
          <Image
            source={img}
            style={{width: 20, height: 20, right: 8, tintColor: tintColor,top:3}}
            tintColor={'#671AAF'}
            resizeMode="contain"
          />
        )}

        <Text
          style={[
            styles.text,
            {fontSize: size, fontFamily: font, color: color},
          ]}>
          {text}
        </Text>
        {!left && (
          <Image
            source={img}
            style={{width: 16, height: 14, left: 8, tintColor: tintColor,top:3}}
            resizeMode="contain"
            tintColor={'#671AAF'}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#D5C69C', // Beige background
    borderRadius: 30,
    // paddingVertical: 11,
    // paddingHorizontal: 20,
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text: {
    color: Color.GREEN,
    fontSize: 16,
    top:2
  },
});
