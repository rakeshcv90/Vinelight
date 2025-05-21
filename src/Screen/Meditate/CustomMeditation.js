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
import React, {useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';

const {width, height} = Dimensions.get('window');
const CustomMeditation = ({navigation}) => {
  const presetTimes = [5, 10, 15, 20, 25, 30];
  const [selectedTime, setSelectedTime] = useState(25);
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
                    // justifyContent:'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    top: -height * 0.07,
                  }}>
                  <Image
                    source={ImageData.MEDATATION}
                    resizeMode="contain"
                    style={{width: '50%', height: '50%'}}
                  />
                  <View style={styles.containerBox}>
                    <View style={styles.buttonGrid}>
                      {[...Array(Math.ceil(presetTimes.length / 3))].map(
                        (_, rowIndex) => (
                          <View key={rowIndex} style={styles.row}>
                            {presetTimes
                              .slice(rowIndex * 3, rowIndex * 3 + 3)
                              .map(time => (
                                <TouchableOpacity
                                  key={time}
                                  style={[
                                    styles.timeButton,
                                    selectedTime === time &&
                                      styles.activeTimeButton,
                                  ]}
                                  onPress={() => setSelectedTime(time)}>
                                  <Text
                                    style={[
                                      styles.timeButtonText,
                                      selectedTime === time &&
                                        styles.activeTimeButtonText,
                                    ]}>
                                    {time} Mins
                                  </Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        ),
                      )}
                    </View>

                    <View style={styles.timerDisplay}>
                      <View
                        style={{
                          width: 100,
                          height: 79,
                          backgroundColor: Color.BROWN3,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.timerText}>00</Text>
                      </View>

                      <Text style={styles.timerText}>:</Text>
                      <View
                        style={{
                          width: 100,
                          height: 79,
                          backgroundColor: Color.BROWN3,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.timerText}>
                          {selectedTime < 10
                            ? `0${selectedTime}`
                            : selectedTime}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('AdvanceSetting');
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: height * 0.02,
                        gap: 5,
                      }}>
                      <Text style={styles.advancedSettings}>
                        Advanced Settings
                      </Text>
                      <Image
                        source={IconData.SETTING}
                        style={{width: 24, height: 24}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{width: '100%', marginTop: 10}}>
                    <Button2
                      width={300}
                      height={50}
                      buttonTitle={'Start Meditation'}
                      img={IconData.MED}
                      left={true}
                      size={20}
                      onPress={() =>
                        navigation.navigate('CustomMeditationPlayer', {
                          timer: selectedTime,
                        })
                      }
                    />
                  </View>
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
                  {/* <ProgressBar duration={200} type={'Custom'}/> */}
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

export default CustomMeditation;

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
  containerBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGrid: {
    // marginBottom: 20,
    // marginTop: height * 0.06,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    backfaceVisibility: 'red',
  },
  timeButton: {
    backgroundColor: '#CBBB92',
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 10,
    width: width * 0.2,
    alignItems: 'center',
    shadowColor: Color.LIGHTGREEN,
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 4,

    // Android Shadow
    elevation: 8,
  },
  activeTimeButton: {
    backgroundColor: '#B1915E',
  },
  timeButtonText: {
    fontSize: 16,
    color: Color.GREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  activeTimeButtonText: {
    color: '#fff',

    fontFamily: Font.EBGaramond_SemiBold,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  timerText: {
    fontSize: 48,
    fontFamily: Font.EBGaramond_Medium,
    color: Color.LIGHTGREEN,
    marginHorizontal: 8,
  },
  advancedSettings: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
  },
});
