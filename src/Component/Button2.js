import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Color, Font, ImageData} from '../../assets/Image';
import FastImage from 'react-native-fast-image';

const Button2 = ({width, height, onPress, buttonTitle, img, left, size}) => {
  return (
    <View style={[styles.shadowWrapper,{width:width,height:height}]}>
      <TouchableOpacity
        style={[styles.button,{width:width,height:height}]}
        activeOpacity={0.8}
        onPress={() => onPress()}>
        {left && (
          <FastImage
            source={img}
           
             resizeMode={FastImage.resizeMode.contain}
            style={{width: 24, height: 24}}
          />
        )}

        <Text style={[styles.text, {fontSize: size}]}>{buttonTitle}</Text>
        {!left && <Image source={img} style={{width: 24, height: 24}} />}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  shadowWrapper: {
    width: 250,
    height: 50,
    borderRadius: 30,
    backgroundColor: Color.LIGHTGREEN,
    // paddingBottom: 5,
    // paddingLeft: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 250,
    height: 50,
    flexDirection: 'row',
    backgroundColor: Color.LIGHTGREEN,
    borderRadius: 30,
    // padding: 15,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS Shadow
    shadowColor: Color.LIGHTGREEN,
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 4,

    // Android Shadow
    elevation: 8,
  },
  text: {
    color: '#FAF5FF',
    fontWeight: '600',
    fontFamily: Font.EBGaramond_SemiBold,
  },
});
export default Button2;
