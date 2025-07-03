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
  Animated,
  Easing,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import ProgressBar from '../../Component/ProgressBar';
import Tts from 'react-native-tts';
import {InteractionManager} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ActivityLoader from '../../Component/ActivityLoader';
const {width, height} = Dimensions.get('window');

const startZoomAnimation = () => {
  animationRef.current = Animated.loop(
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
  animationRef.current.start();
  setIsAnimating(true);
};

const stopZoomAnimation = () => {
  animationRef.current?.stop();
  setIsAnimating(false);
};

function parseLRC(lrcText) {
  const lines = lrcText.split('\n');
  const result = [];

  const timeRegex = /\[(\d{2}):(\d{2}(?:\.\d{2})?)\]/g;

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)];
    const text = line.replace(timeRegex, '').trim();

    for (const match of matches) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      result.push({time, text});
    }
  }

  // Optional: Sort by time (important!)
  result.sort((a, b) => a.time - b.time);

  return result;
}

const MeditationPlayer = ({route, navigation}) => {
  const timer = route?.params?.itemData?.time / 60;
  // console.log("Item Data",timer)
  const [defaultMusic, setDefaultMusic] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalduration, setTotalDuration] = useState(0);
  const [pauseSound, setPauseSound] = useState(false);
  const scrollRef = useRef(null);
  const [ttsOpen, setTtsOpen] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    KeepAwake.activate(); // Prevent screen sleep when this screen is active

    return () => {
      KeepAwake.deactivate(); // Clean up on unmount
    };
  }, []);

  //   const initTts = async () => {
  //     try {
  //       if (Platform.OS == 'ios') {
  //         await new Promise(resolve => setTimeout(resolve, 500));
  //         const voices = await Tts.voices();

  //         const femaleVoice = voices.find(
  //           voice =>
  //             voice.language.startsWith('en') &&
  //             voice.name === 'Samantha' &&
  //             !voice.notInstalled,
  //         );

  //         // if (femaleVoice) {
  //         //   await Tts.setDefaultLanguage(femaleVoice.language);
  //         //   await Tts.setDefaultVoice(femaleVoice.id);
  //         // } else {
  //         //   await Tts.setDefaultLanguage('en'); // fallback
  //         // }
  //         await Tts.setDefaultRate(0.4);
  //         Tts.setDucking(true);
  //       } else {
  //         await Tts.setDefaultLanguage('en-IN');
  //         await Tts.setDefaultRate(0.35);
  //       }
  //       await Tts.setDucking(true);
  //       await Tts.setIgnoreSilentSwitch('ignore');

  //       setTtsInitialized(true);

  //       if (Platform.OS === 'android') {
  //         Tts.addEventListener('tts-progress', event => {
  //           const {start} = event;

  //           if (typeof start !== 'number') {
  //             console.log('❌ Invalid event:', event);
  //             return;
  //           }

  //           const partial = cleanText.substring(0, start);
  //           const index =
  //             partial.trim().split(/\s+/).filter(Boolean).length - 1;

  //           setCurrentWordIndex(index);
  //           scrollToWord(index);
  //         });

  //         Tts.addEventListener('tts-finish', () => {
  //           setCurrentWordIndex(-1);
  //         });
  //       }
  //     } catch (error) {
  //       console.log('TTS Init Error:', error);
  //     }
  //   };

  //   initTts();

  //   return () => {
  //     Tts.removeAllListeners('tts-progress');
  //     Tts.removeAllListeners('tts-finish');
  //     if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
  //   };
  // }, []);

  // const scrollToWord = index => {
  //   InteractionManager.runAfterInteractions(() => {
  //     const wordRef = wordRefs.current[index];
  //     if (wordRef?.current && scrollRef.current) {
  //       wordRef.current.measureLayout(
  //         scrollRef.current,
  //         (x, y) => {
  //           scrollRef.current.scrollTo({y: y - 80, animated: true});
  //         },
  //         err => console.log('📛 measureLayout error:', err),
  //       );
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (ttsOpen) {
  //     setCurrentWordIndex(-1);
  //     Tts.speak(cleanText);

  //     if (Platform.OS === 'ios') {
  //       let index = 0;
  //       const wpm = 190;
  //       const delay = 60000 / wpm;

  //       iosIntervalRef.current = setInterval(() => {
  //         if (index < words.length) {
  //           setCurrentWordIndex(index);
  //           scrollToWord(index);
  //           index++;
  //         } else {
  //           clearInterval(iosIntervalRef.current);
  //           setCurrentWordIndex(-1);
  //         }
  //       }, delay);
  //     }
  //   } else {
  //     Platform.OS == 'android' ? Tts.stop() : Tts.stop();
  //     //
  //     setCurrentWordIndex(-1);
  //     if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
  //   }
  // }, [ttsOpen]);
  // useEffect(() => {
  //   if (ttsOpen) {
  //     setCurrentWordIndex(-1);

  //     const speakChunks = text => {
  //       // Function to split string into chunks
  //       const splitNChars = (txt, num) => {
  //         const result = [];
  //         for (let i = 0; i < txt.length; i += num) {
  //           result.push(txt.substr(i, num));
  //         }
  //         return result;
  //       };

  //       // If too long for Android, split and speak
  //       if (Platform.OS === 'android' && text.length >= 3999) {
  //         const chunks = splitNChars(text, 3999);

  //         const speakChunk = index => {
  //           if (index < chunks.length) {
  //             Tts.speak(chunks[index], {
  //               androidParams: {
  //                 KEY_PARAM_STREAM: 'STREAM_MUSIC',
  //               },
  //             });
  //             // Wait for the current chunk to finish (basic delay approach)
  //             setTimeout(() => speakChunk(index + 1), 2000); // Adjust delay based on chunk length
  //           }
  //         };

  //         speakChunk(0); // Start speaking chunks
  //       } else {
  //         Tts.speak(text, {
  //           iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
  //           rate: 0.5,
  //         });
  //       }
  //     };

  //     speakChunks(cleanText); // Call function for Android or iOS

  //     if (Platform.OS === 'ios') {
  //       let index = 0;
  //       const wpm = 155;
  //       const delay = 60000 / wpm;
  //       iosIntervalRef.current = setInterval(() => {
  //         if (index < words.length) {
  //           setCurrentWordIndex(index);
  //           scrollToWord(index);
  //           index++;
  //         } else {
  //           clearInterval(iosIntervalRef.current);
  //           setCurrentWordIndex(-1);
  //         }
  //       }, delay);
  //     }
  //   } else {
  //     Tts.stop();
  //     setCurrentWordIndex(-1);
  //     if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
  //   }
  // }, [ttsOpen]);
  // const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const handleUpdateTime = useCallback(time => {
    setCurrentTime(time);
    if (time > 0) {
      setLoader(false);
    } else {
      setLoader(false);
    }
  }, []);

  const handletotalTime = useCallback(time => {
    setTotalDuration(time);
  }, []);

  const startZoomAnimation = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animationRef.current.start();
    setIsAnimating(true);
  };

  const stopZoomAnimation = () => {
    animationRef.current?.stop();
    setIsAnimating(false);
  };

  useEffect(() => {
    if (ttsOpen) {
      startZoomAnimation();
    } else {
      stopZoomAnimation();
    }
  }, [ttsOpen]);

  // const lineRefs = useRef([]);
  // const [activeIndex, setActiveIndex] = useState(-1);
  // const lrcLines = useMemo(() => parseLRC(route?.params?.itemData?.lyrics_text), []);
  // const scrollDebounce = useRef(null);
  // const lastScrolledIndex = useRef(-1);

  // useEffect(() => {
  //   const syncTime = currentTime - 2;

  //   const index = lrcLines.findIndex((item, i) => {
  //     return (
  //       syncTime >= item.time &&
  //       (i === lrcLines.length - 1 || syncTime < lrcLines[i + 1].time)
  //     );
  //   });

  //   if (index !== -1 && index !== activeIndex) {
  //     setActiveIndex(index);

  //     // Avoid redundant scroll to the same index
  //     if (lastScrolledIndex.current === index) return;

  //     if (scrollDebounce.current) {
  //       clearTimeout(scrollDebounce.current);
  //     }

  //     scrollDebounce.current = setTimeout(() => {
  //       const ref = lineRefs.current[index];
  //       if (ref && scrollRef.current) {
  //         InteractionManager.runAfterInteractions(() => {
  //           ref.measureLayout(
  //             scrollRef.current,
  //             (x, y) => {
  //               scrollRef.current.scrollTo({y: y - 80, animated: true});
  //               lastScrolledIndex.current = index;
  //             },
  //             err => console.warn('⚠️ measureLayout error:', err),
  //           );
  //         });
  //       }
  //     }, 120); // debounce delay
  //   }
  // }, [currentTime, lrcLines, activeIndex]);
  // useEffect(() => {
  //   const syncTime = currentTime - 2;

  //   const index = lrcLines.findIndex((item, i) => {
  //     return (
  //       syncTime >= item.time &&
  //       (i === lrcLines.length - 1 || syncTime < lrcLines[i + 1].time)
  //     );
  //   });

  //   if (index !== -1 && index !== activeIndex) {
  //     setActiveIndex(index);

  //     if (lastScrolledIndex.current === index) return;

  //     if (scrollDebounce.current) {
  //       clearTimeout(scrollDebounce.current);
  //     }

  //     scrollDebounce.current = setTimeout(() => {
  //       const ref = lineRefs.current[index];
  //       if (ref && scrollRef.current) {
  //         InteractionManager.runAfterInteractions(() => {
  //           ref.measureLayout(
  //             scrollRef.current,
  //             (x, y) => {
  //               scrollRef.current.scrollTo({ y: y - 80, animated: true });
  //               lastScrolledIndex.current = index;
  //             },
  //             err => console.warn('⚠️ measureLayout error:', err)
  //           );
  //         });
  //       }
  //     }, 120);
  //   }
  // }, [currentTime, lrcLines, activeIndex]);
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
          <ActivityLoader visible={loader} />
          <TouchableOpacity
            onPress={() => {
              Tts.stop();
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
                    top: -height * 0.05,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subText}>
                    {route?.params?.itemData?.name}
                  </Text>
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
                  <Animated.Image
                    source={ImageData.LOGO}
                    tintColor={Color.LIGHTGREEN}
                    style={[
                      styles.image,
                      {
                        transform: [{scale: scaleAnim}],
                      },
                    ]}
                  />
                  {/* <ScrollView ref={scrollRef} style={styles.container}>
                    <View style={styles.innerContainer}>
                      {lrcLines.map((line, index) => (
                        <Text
                          key={index}
                          ref={el => (lineRefs.current[index] = el)}
                          style={[
                            styles.line,
                            index === activeIndex && styles.activeLine,
                          ]}>
                          {line.text}
                        </Text>
                      ))}
                    </View>
                  </ScrollView> */}
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
                    totalDUration={handletotalTime}
                    musicTime={route?.params?.itemData?.time}
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
    marginTop: height * 0.03,
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 20,
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
  innerContainer: {
    paddingBottom: 200,
  },
  line: {
    fontSize: 20,
    color: '#60723E',
    marginBottom: 12,
    fontFamily: 'EBGaramond-Regular',
  },
  activeLine: {
    color: Color.LIGHTGREEN,
    fontFamily: 'EBGaramond-SemiBold',
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
});
