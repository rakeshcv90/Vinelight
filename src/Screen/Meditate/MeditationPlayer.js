import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import ProgressBar from '../../Component/ProgressBar';
import Tts from 'react-native-tts';
import {InteractionManager} from 'react-native';
const {width, height} = Dimensions.get('window');

const MeditationPlayer = ({route, navigation}) => {
  const [defaultMusic, setDefaultMusic] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [pauseSound, setPauseSound] = useState(false);
  const scrollRef = useRef(null);
  const [ttsOpen, setTtsOpen] = useState(false);

  const handleUpdateTime = useCallback(time => {
    setCurrentTime(time);
  }, []);
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const TextSpeech = `${route?.params?.itemData?.description}`;
  const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
  const words = cleanText.match(/\S+/g);
  const iosIntervalRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const wordRefs = useRef([]);
  useEffect(() => {
    wordRefs.current = words.map(
      (_, i) => wordRefs.current[i] || React.createRef(),
    );
  }, [words]);

  // useEffect(() => {
  //   const initTts = async () => {
  //     try {
  //       await Tts.setDefaultLanguage('en-IN');
  //       await Tts.setDucking(true);
  //       await Tts.setIgnoreSilentSwitch('ignore');
  //       setTtsInitialized(true);

  //       // Event for tracking current word
  //       Tts.addEventListener('tts-progress', event => {
  //         const {start} = event;

  //         if (typeof start !== 'number') {
  //           console.log('❌ Invalid event:', event);
  //           return;
  //         }

  //         const partial = cleanText.substring(0, start);
  //         const index = partial.trim().split(/\s+/).filter(Boolean).length - 1;

  //         console.log('📍 Word index:', index, '→', words[index]);
  //         setCurrentWordIndex(index);

  //         // Scroll to current word
  //         InteractionManager.runAfterInteractions(() => {
  //           const wordRef = wordRefs.current[index];
  //           if (wordRef?.current && scrollRef.current) {
  //             wordRef.current.measureLayout(
  //               scrollRef.current,
  //               (x, y) => {
  //                 scrollRef.current.scrollTo({y: y - 50, animated: true});
  //               },
  //               err => console.log('📛 measureLayout error:', err),
  //             );
  //           }
  //         });
  //       });

  //       Tts.addEventListener('tts-finish', () => {
  //         setCurrentWordIndex(-1);
  //       });
  //     } catch (error) {
  //       console.log('TTS Init Error:', error);
  //     }
  //   };

  //   initTts();

  //   return () => {
  //     Tts.removeAllListeners('tts-progress');
  //     Tts.removeAllListeners('tts-finish');
  //   };
  // }, []);

  useEffect(() => {
    const initTts = async () => {
      try {
        await Tts.setDefaultLanguage('en-IN');
        await Tts.setDucking(true);
        await Tts.setIgnoreSilentSwitch('ignore');
        setTtsInitialized(true);

        if (Platform.OS === 'android') {
          Tts.addEventListener('tts-progress', event => {
            const {start} = event;

            if (typeof start !== 'number') {
              console.log('❌ Invalid event:', event);
              return;
            }

            const partial = cleanText.substring(0, start);
            const index =
              partial.trim().split(/\s+/).filter(Boolean).length - 1;

            setCurrentWordIndex(index);
            scrollToWord(index);
          });

          Tts.addEventListener('tts-finish', () => {
            setCurrentWordIndex(-1);
          });
        }
      } catch (error) {
        console.log('TTS Init Error:', error);
      }
    };

    initTts();

    return () => {
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-finish');
      if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
    };
  }, []);

  const scrollToWord = index => {
    InteractionManager.runAfterInteractions(() => {
      const wordRef = wordRefs.current[index];
      if (wordRef?.current && scrollRef.current) {
        wordRef.current.measureLayout(
          scrollRef.current,
          (x, y) => {
            scrollRef.current.scrollTo({y: y - 50, animated: true});
          },
          err => console.log('📛 measureLayout error:', err),
        );
      }
    });
  };

  // useEffect(() => {
  //   // if (ttsInitialized) {
  //   if (ttsOpen) {
  //     Tts.speak(cleanText);
  //   } else {
  //     // Tts.stop();
  //     setCurrentWordIndex(-1);
  //   }
  //   // }
  // }, [ttsOpen]);

  useEffect(() => {
    // if (!ttsInitialized) return;

    if (ttsOpen) {
      // Tts.stop();
      setCurrentWordIndex(-1);
      Tts.speak(cleanText);

      if (Platform.OS === 'ios') {
        let index = 0;
        const wpm = 180;
        const delay = 60000 / wpm; // milliseconds per word

        iosIntervalRef.current = setInterval(() => {
          if (index < words.length) {
            setCurrentWordIndex(index);
            scrollToWord(index);
            index++;
          } else {
            clearInterval(iosIntervalRef.current);
            setCurrentWordIndex(-1);
          }
        }, delay);
      }
    } else {
      Platform.OS == 'android' && Tts.stop();
      //
      setCurrentWordIndex(-1);
      if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
    }
  }, [ttsOpen]);
  const formatDuration = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
              setPauseSound(true);
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
                  <Text style={styles.subText}>
                    {route?.params?.itemData?.name}
                  </Text>
                  {/* <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {formatDuration(route?.params?.itemData?.time)} Min
                    </Text>
                  </View> */}
                </View>

                <View
                  style={{
                    width: '96%',
                    height: '58%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    top: -height * 0.04,
                    padding: 10,
                  }}>
                  <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{paddingBottom: 40}}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.textBlock}>
                      {words.map((word, index) => (
                        <View key={index} ref={wordRefs.current[index]}>
                          <Text
                            style={[
                              styles.textBlock,
                              {
                                color:
                                  index === currentWordIndex
                                    ? Color.LIGHTGREEN
                                    : '#60723E',
                                fontWeight:
                                  index === currentWordIndex
                                    ? Font.EBGaramond_SemiBold
                                    : Font.EB_Garamond,
                              },
                            ]}>
                            {word + ' '}
                          </Text>
                        </View>
                      ))}
                    </Text>
                  </ScrollView>
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
                  <ProgressBar
                    type={'Dynamic'}
                    data={route?.params?.itemData}
                    defaultMusic={defaultMusic}
                    setDefaultMusic={setDefaultMusic}
                    onUpdateTime={handleUpdateTime}
                    pauseSound={pauseSound}
                    ttsOpen={ttsOpen}
                    setTtsOpen={setTtsOpen}
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
      </ImageBackground>
    </View>
  );
};

export default MeditationPlayer;
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
  lyricsBox: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  textBlock: {
    fontSize: 32,
    fontFamily: Font.EBGaramond_Regular,
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  highlightedWord: {
    backgroundColor: '#fff200',
    color: 'black',
    borderRadius: 4,
  },
});
