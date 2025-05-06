import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {Color, Font, ImageData} from '../../assets/Image';

const Button2 = ({width, height, onPress, buttonTitle,img,left,size}) => {
  return (
    <View style={[styles.shadowWrapper, { width:width, height:height }]}>
      <TouchableOpacity
      style={[styles.button, { width:width, height:height }]}
        activeOpacity={0.8}
        onPress={() => onPress()}>
        {left && (
        <Image
          source={img}
          resizeMode="contain"
          style={{width: 24, height: 24, right: 20,}}
        />
        )}

        <Text style={[styles.text,{fontSize:size,}]}>{buttonTitle}</Text>
        {!left && (
             <Image source={img} style={{width: 16, height: 14, left: 8}} />
           )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 30,
    backgroundColor: Color.LIGHTGREEN, // Shadow color
    paddingBottom: 5, // Height of bottom shadow
    paddingLeft: 2,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Color.LIGHTGREEN, // Beige background
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 4,

    // Android Shadow
    elevation: 8,
  },
  text: {
    color: Color.BROWN3,
    
    fontWeight: '600',

    fontFamily: Font.EBGaramond_SemiBold,
  },
});
export default Button2;
