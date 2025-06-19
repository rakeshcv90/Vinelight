import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';
import {Color, Font, IconData} from '../../assets/Image';
const {width, height} = Dimensions.get('window');
const ProfileGoalComponent = ({image, count, title}) => {
  return (
    <View
      style={{
        width: width * 0.42,
        height: 96,
        borderRadius: 8,
        padding: 8,
        backgroundColor: Color?.BROWN3,
      }}>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 40,
            fontFamily: Font.EBGaramond_SemiBold,
            color: Color.BROWN,
          }}>
          {count}
        </Text>
        <Image
          source={image}
          tintColor={'#B1915E'}
          style={{width: 24, height: 24}}
          resizeMode="contain"
        />
      </View>
      <View style={{width: '100%', marginTop: 5}}></View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: Font.EBGaramond_Medium,
          color: Color.LIGHTGREEN,
        }}>
        {title}
      </Text>
    </View>
  );
};

export default ProfileGoalComponent;
