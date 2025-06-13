import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');
const CustomMeditation = ({navigation}) => {
  const presetTimes = [5, 10, 15, 20, 25, 30];
  const [selectedTime, setSelectedTime] = useState(25);
  const memoizedBackground = useMemo(() => ImageData.BACKGROUND, []);
  const memoizedBackground1 = useMemo(() => ImageData.MAINBACKGROUND, []);
  const [hour, setHour] = useState();
  const [minute, setMinute] = useState(25);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardOpen(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? undefined : undefined} // no behavior to avoid shifting
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          // scrollEnabled={!keyboardOpen} // disable scrolling when keyboard is open
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <FastImage
            source={memoizedBackground}
            style={styles.primaryBackground}
            resizeMode={FastImage.resizeMode.cover}>
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
              <FastImage
                source={memoizedBackground1}
                style={styles.secondaryBackground}
                resizeMode={FastImage.resizeMode.stretch}>
                <View
                  style={{
                    width: '100%',
                    height: '76%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: '35%',
                    // paddingBottom: 30,
                  }}>
                  <View
                    style={{
                      width: '90%',

                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: Color.LIGHTGREEN,
                      backgroundColor: Color?.LIGHTBROWN,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        // height: '10%',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}>
                      <FastImage
                        source={ImageData.LEFT}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{width: 31, height: 31}}
                      />
                      <FastImage
                        source={ImageData.RIGHT}
                        resizeMode={FastImage.resizeMode.contain}
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
                        top: -20,

                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.subText}>Meditations</Text>
                      <FastImage
                        source={ImageData.MEDATATION}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{width: 150, height: 150}}
                      />
                    </View>
                    <View style={styles.containerBox}>
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
                                  onPress={() => {
                                    setMinute(time);
                                    setSelectedTime(time);
                                  }}>
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
                        <TextInput
                          value={hour?.toString()}
                          onChangeText={text => {
                            const digitsOnly = text.replace(/[^0-9]/g, '');
                            setHour(Number(digitsOnly.slice(0, 2)));
                          }}
                          style={{
                            width: '100%',
                            height: 79,
                            color: Color.LIGHTGREEN,
                            fontSize: 48,
                            borderRadius: 8,
                            backgroundColor: Color.BROWN3,
                            textAlign: 'center',
                          }}
                          keyboardType="numeric"
                          placeholder="HH"
                          placeholderTextColor={Color.BROWN2}
                          underlineColorAndroid="transparent"
                        />
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
                        <TextInput
                          value={minute?.toString()}
                          onChangeText={text => {
                            const digitsOnly = text.replace(/[^0-9]/g, '');
                            setMinute(Number(digitsOnly.slice(0, 2)));
                          }}
                          style={{
                            width: '100%',
                            height: 79,
                            color: Color.LIGHTGREEN,
                            fontSize: 48,
                            borderRadius: 8,
                            backgroundColor: Color.BROWN3,
                            textAlign: 'center',
                          }}
                          keyboardType="numeric"
                          placeholder="MM"
                          placeholderTextColor={Color.BROWN2}
                          underlineColorAndroid="transparent"
                        />
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
                    <View
                      style={{
                        width: '100%',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Button2
                        width={300}
                        height={50}
                        buttonTitle={'Start Meditation'}
                        img={IconData.MED}
                        left={true}
                        size={20}
                        onPress={() => {
                          console.log("DFdfdffd",0 * 60 + minute)
                          if (hour == undefined) {
                            navigation.navigate('CustomMeditationPlayer', {
                              timer: 0 * 60 + minute,
                            });
                          } else {
                            console.log("cxvcvcvcx")
                            // navigation.navigate('CustomMeditationPlayer', {
                            //   timer: hour * 60 + minute,
                            // });
                          }
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                      }}>
                      <FastImage
                        source={ImageData.BACKLEFT}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                          width: 31,
                          height: 31,
                        }}
                      />

                      <FastImage
                        source={ImageData.BACKRIGHT}
                        resizeMode={FastImage.resizeMode.contain}
                        style={{
                          width: 31,
                          height: 31,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </FastImage>
            </View>
          </FastImage>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginTop: height * 0.03,
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    // textAlign: 'center',
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
