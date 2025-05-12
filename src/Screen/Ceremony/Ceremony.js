import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color, Font, IconData, ImageData } from '../../../assets/Image'
import Button2 from '../../Component/Button2'

const {width, height} = Dimensions.get('window');
const Ceremony = () => {
  return (
     <View style={styles.secondaryContainer}>
      <ImageBackground
        source={ImageData.MAINBACKGROUND}
        style={styles.secondaryBackground}
        resizeMode="stretch">
        <View
          style={{
            width: '100%',
            height: '76%',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '30%',
          }}>
          <View
            style={{
              width: '90%',
              height: '100%',
              alignItems: 'center',
              marginTop: '10%',
              borderWidth: 1,
              borderColor: Color.LIGHTGREEN,
              backgroundColor: Color?.LIGHTBROWN,
            }}>
            <View
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <Image
                source={ImageData.LEFT}
                resizeMode="contain"
                style={{width: 31, height: 31}}
              />
              <Image
                source={ImageData.RIGHT}
                resizeMode="contain"
                style={{
                  width: 31,
                  height: 31,
                  backgroundColor: 'transparent',
                }}
              />
            </View>
            <View
              style={{
                width: '100%',
                height: '7%',

                flexDirection: 'row',
                top: -height * 0.065,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subText}>Ceremonies</Text>
            </View>

            <View
              style={{
                width: '96%',
                height: '63%',

                alignItems: 'center',
                alignSelf: 'center',
                top: -height * 0.055,
              }}></View>
            <View
              style={{
                width: '96%',
                height: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                top: height * 0.035,
                gap: 20,
                flexDirection: 'row',
              }}>
              <Button2
                width={300}
                height={50}
                buttonTitle={'Add New Ceremony'}
                img={IconData.PLUS}
                left={true}
                size={20}
                onPress={() => {}}
              />
            </View>

            <View
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',

                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <Image
                source={ImageData.BACKLEFT}
                resizeMode="contain"
                style={{
                  width: 31,
                  height: 31,
                }}
              />

              <Image
                source={ImageData.BACKRIGHT}
                resizeMode="contain"
                style={{
                  width: 31,
                  height: 31,
                }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Ceremony

const styles = StyleSheet.create({
  secondaryContainer: {
    // flex:1,
    width: '90%',
    height: '85%',
  },
  secondaryBackground: {
    width: '100%',
    height: '100%',
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
});