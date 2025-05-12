import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import ProgressBar from '../../Component/ProgressBar';

const {width, height} = Dimensions.get('window');
const CustomMeditationPlayer = ({navigation,route}) => {
  const timer=(route?.params?.timer)*60

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={ImageData.BACKGROUND}
        style={styles.primaryBackground}
        resizeMode="cover">
        <View
          style={{
            width: '100%',
            height: 70,
            padding: 10,
            position: 'absolute',
            top: height * 0.05,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 1,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: Color?.LIGHTGREEN,
              borderRadius: 25,
              alignSelf: 'center',
              marginVertical: '5%',
              borderWidth: 3,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              borderColor: Color?.BROWN2,
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: Color?.BROWN4,
                borderRadius: 20,
                alignSelf: 'center',
                marginVertical: '5%',
                borderWidth: 3,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Color?.BROWN2,
              }}>
              <Image
                source={IconData.BACK}
                tintColor={Color?.LIGHTGREEN}
                style={{width: 24, height: 24}}
              />
            </View>
          </TouchableOpacity>
        </View>
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
                marginVertical: '35%',
                paddingVertical: '0%',
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
                  <Text style={styles.subText}>Meditations</Text>
                </View>

                <View
                  style={{
                    width: '96%',
                    height: '58%',

                    alignSelf: 'center',
                    top: -height * 0.04,
                  }}>
                  <Image
                    source={ImageData.MEDATATION}
                    resizeMode='contain'
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                <View
                  style={{
                    width: '96%',
                    height: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    top: height * 0.035,
                  }}>
                  <ProgressBar duration={timer} type={'Custom'}/>
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
      </ImageBackground>
    </View>
  );
};

export default CustomMeditationPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    width: '90%',
    height: '90%',
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  durationBadge: {
    backgroundColor: Color.LIGHTBROWN2,
    paddingLeft: 6,
    paddingRight: 6,
    gap: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
});
