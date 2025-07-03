import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import useNativeMusicPlayer from '../../Component/NativeusicPlayer';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import {useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import KeepAwake from 'react-native-keep-awake';
import Toast from 'react-native-toast-message';
const {width, height} = Dimensions.get('window');

const AdvanceMediaPlayer = ({navigation, route}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTimestamp, setPauseTimestamp] = useState(null);
  const [lastIntervalSecond, setLastIntervalSecond] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('Meditations');
  const [preparationDone, setPreparationDone] = useState(false);
  const [meditationDone, setMeditationDone] = useState(false);
  const [restDone, setRestDone] = useState(false);
  const [endDone, setEndDone] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null); // 'player1' or 'player2'
  const [isMusicActive, setIsMusicActive] = useState(false);
  const isPausedRef = useRef(isPaused);
  const timerRef = useRef(null);
  const [isActive, setIsActive] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );

  const {pre, med, int, res, end, user, start} = route.params?.itemData || {};
  const song1 = pre?.song;
  const song2 = int?.song;
  const song3 = res?.song;
  const song4 = end?.song;
  const song5 = start?.song;
  const song6 = medatationData?.data;
  const {pauseMusic, playMusic, releaseMusic, stopMusic, setCustomSong} =
    useNativeMusicPlayer({song1, song2, pause: false, getSoundOffOn: true});

  const formatTime = sec =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(
      sec % 60,
    ).padStart(2, '0')}`;
  useEffect(() => {
    KeepAwake.activate(); // Prevent screen sleep when this screen is active

    return () => {
      KeepAwake.deactivate(); // Clean up on unmount
    };
  }, []);
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!isConnected) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR,
          text: 'Poor internet connection or not working',
        },
      });

      handleBack()
      
    }
  }, [isConnected]);
  useEffect(() => {
    const medDuration =
      Number(med?.minute || 0) * 60 + Number(med?.second || 0);
    const intTime = Number(int?.minute || 0) * 60 + Number(int?.second || 0);
    const timePassed = medDuration - timeLeft;

    if (
      song2 &&
      intTime &&
      medDuration > intTime &&
      currentPhase === 'Meditation Time'
    ) {
      if (
        timeLeft > 0 &&
        timePassed > 0 &&
        timePassed % intTime === 0 &&
        lastIntervalSecond !== timePassed
      ) {
        console.log('⏳ Interval music trigger');
        setLastIntervalSecond(timePassed);
        playRepeatingInterval();
      }
    }
  }, [timeLeft]);

  // const startCountdown = duration => {
  //   console.log(`⏱️ Countdown started: ${duration} seconds`);
  //   setTimeLeft(duration);
  // };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove(); // ✅ this is the correct cleanup
    }, [currentPlayer, isMusicActive, isPaused]),
  );

  const startCountdown = duration => {
    if (pauseTimestamp !== null && isPaused) {
      console.log(
        `🔁 Resuming countdown from pause: ${pauseTimestamp} seconds`,
      );
      setTimeLeft(pauseTimestamp);
    } else {
      console.log(`⏱️ Countdown started: ${duration} seconds`);
      setTimeLeft(duration);
    }
  };

  const playRepeatingInterval = async () => {
    try {
      console.log('🎵 Playing interval music...');
      await setCustomSong(song2, 'player2');
      playMusic('player2');
      setIsMusicActive(true);
      setCurrentPlayer('player2');
      await new Promise(res => setTimeout(res, 2000));
      if (isActive) {
        setIsMusicActive(true);
        setCurrentPlayer('player1');
      } else {
        setIsMusicActive(false);
      }
      stopMusic('player2');
      console.log('🛑 Stopped interval music');
    } catch (e) {
      console.error('⚠️ Interval play error:', e);
    }
  };

  const playMeditationFlow = async () => {
    console.log('route data ....', route.params?.itemData);
    const wait = async totalSeconds => {
      console.log(`⏳ Starting wait for ${totalSeconds} seconds`);
      return new Promise(resolve => {
        let elapsed = 0;
        timerRef.current = setInterval(() => {
          if (!isPausedRef.current) {
            elapsed++;
            console.log(`⏱️ Elapsed: ${elapsed}/${totalSeconds} seconds`);
            if (elapsed >= totalSeconds) {
              clearInterval(timerRef.current);
              console.log(`✅ Wait completed after ${elapsed} seconds`);
              resolve();
            }
          } else {
            console.log('⏸️ Paused... waiting to resume');
          }
        }, 1000);
      });
    };

    try {
      if (!preparationDone && song1) {
        console.log('🧘‍♂️ Starting Preparation Phase');
        setCurrentPhase('Preparation Time');
        await setCustomSong(song1, 'player1');
        playMusic('player1');
        setCurrentPlayer('player1');
        setIsMusicActive(true);
        const preTime = Number(pre?.second || 0);
        startCountdown(preTime);
        await wait(preTime);
        stopMusic('player1');
        setIsMusicActive(false);
        setPreparationDone(true);
        console.log('✅ Preparation Phase Completed');
      }

      const medDuration =
        Number(med?.minute || 0) * 60 + Number(med?.second || 0);
      if (!meditationDone && medDuration > 0) {
        console.log('🧘 Starting Meditation Phase');
        setCurrentPhase('Meditation Time');
        console.log('start song.. ', song5, ' // med :- ', song6);
        setIsMusicActive(true);
        await setCustomSong(song5, 'player2');
        await setCustomSong(song6, 'player1');
        playMusic('player2');
        playMusic('player1');
        startCountdown(medDuration);
        setCurrentPlayer('player1');
        await wait(medDuration);
        console.log('med is close or not');
        stopMusic('player2');
        stopMusic('player1');
        setIsMusicActive(false);
        setMeditationDone(true);
        console.log('✅ Meditation Phase Completed');
      }

      if (!restDone && song3) {
        console.log('😌 Starting Rest Phase');
        setCurrentPhase('Rest Time');
        await setCustomSong(song3, 'player1');
        playMusic('player1');
        setCurrentPlayer('player1');
        setIsMusicActive(true);
        const resTime = Number(res?.second || 0);
        startCountdown(resTime);
        await wait(resTime);
        stopMusic('player1');
        setIsMusicActive(true);
        setRestDone(true);
        console.log('✅ Rest Phase Completed');
      }

      if (!endDone && song4) {
        console.log('🛑 Starting End Phase');
        setCurrentPhase('End Time');
        console.log('end song.. ', song4);
        await setCustomSong(song4, 'player1');
        playMusic('player1');
        setCurrentPlayer('player1');
        setIsMusicActive(true);
        const endTime = 3;
        await wait(endTime);
        stopMusic('player1');
        setIsMusicActive(true);
        setEndDone(true);
        console.log('✅ End Phase Completed');
      }

      console.log('🎉 Meditation Completed');
      setCurrentPhase('Meditation Completed');
      navigation.goBack();
      setIsPlaying(false);
    } catch (error) {
      console.error('❌ Meditation Flow Error:', error);
    }
  };

  // const handlePauseResume = () => {
  //   if (isPaused) {
  //     console.log('▶️ Resuming...');
  //     if (pauseTimestamp !== null) setTimeLeft(pauseTimestamp);
  //     playMusic('player1');
  //     playMusic('player2');
  //     setIsPlaying(true);
  //   } else {
  //     console.log('⏸️ Pausing...');
  //     pauseMusic('player1');
  //     pauseMusic('player2');
  //     setPauseTimestamp(timeLeft);
  //   }
  //   setIsPaused(!isPaused);
  // };

  const handleMusicPlayback = () => {
    if (!isPaused) {
      if (isActive && currentPhase === 'Meditation Time') {
        // Music should play on player1
        pauseMusic('player1');
      } else {
        playMusic('player1');
      }
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      console.log('▶️ Resuming...');
      if (pauseTimestamp !== null) setTimeLeft(pauseTimestamp);

      // ✅ Resume only if music was active before pause
      console.log('Active player ', currentPlayer, isMusicActive, isPlaying);
      if (currentPlayer && isMusicActive) {
        playMusic(currentPlayer);
        setIsPlaying(true);
      } else {
        console.log(
          '⛔ Music was not active before pausing, so nothing to resume',
        );
      }

      if (pauseTimestamp !== null) {
        setPauseTimestamp(null);
      }
    } else {
      console.log('⏸️ Pausing...');
      if (currentPlayer && isMusicActive) {
        pauseMusic(currentPlayer);
        setPauseTimestamp(timeLeft);
        // setIsMusicActive(false);
      }
    }

    setIsPaused(!isPaused);
  };

  // const handleBack = () => {
  //   navigation.goBack();
  //   stopMusic('player1');
  //   stopMusic('player2');
  //   releaseMusic('player1');
  //   releaseMusic('player2');
  //   setIsPlaying(false);
  // };

  const handleBack = () => {
    // ⏸️ Stop music only if it was active and not already paused
    console.log('🔙 Back pressed — stopping all media and timers');

    // ⏸ Pause any active music
    if (currentPlayer && isMusicActive) {
      console.log(`🛑 Stopping music on ${currentPlayer}`);
      stopMusic(currentPlayer);
      releaseMusic(currentPlayer);
    }

    // Stop both players to be extra safe
    stopMusic('player1');
    stopMusic('player2');
    releaseMusic('player1');
    releaseMusic('player2');

    // 🧹 Reset state
    setIsPlaying(false);
    setIsMusicActive(false);
    setIsPaused(true);

    // 🧨 Clear countdown or wait interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('🛑 Timer cleared on back press');
    }

    // ✅ Navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FastImage
        source={ImageData.BACKGROUND}
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
              // navigation.goBack();
              // stopMusic('player1');
              // stopMusic('player2');
              // releaseMusic('player1');
              // releaseMusic('player2');
              // setIsPlaying(false);
              handleBack();
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
            source={ImageData.MAINBACKGROUND}
            style={styles.secondaryBackground}
            resizeMode={FastImage.resizeMode.stretch}>
            <View
              style={{
                width: '100%',
                // height: '76%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: height * 0.22,
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
                  <Text style={styles.subText}>
                    {route.params?.itemData?.user?.name}
                  </Text>
                  <FastImage
                    source={ImageData.MEDATATION}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{width: width * 0.5, height: height * 0.2}}
                  />
                  <Text style={styles.subText}>{currentPhase}</Text>
                </View>

                <View style={styles.timerDisplay}>
                  <View
                    style={{
                      // width: 100,
                      // height: 79,
                      backgroundColor: Color.BROWN3,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* {console.log("half on med ", formatTime(timeLeft))} */}
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                  </View>
                </View>

                {/* <TouchableOpacity
                  onPress={playMeditationFlow}
                  style={{
                    width: '100%',
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={IconData.PLAY}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                  onPress={() => {
                    if (!isPlaying) {
                      playMeditationFlow();        // Start playback
                      setIsPlaying(true);
                      setIsPaused(false);
                    } else if (isPaused) {
                      handlePauseResume()
                    } else {
                      handlePauseResume()
                    }
                  }}
                  style={{
                    width: '100%',
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={isPlaying ? (isPaused ? IconData.PLAY : IconData.PAUSE) : IconData.PLAY}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity> */}

                <View
                  style={{
                    width: '100%',
                    marginTop: 20,
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(
                        'active players .. ',
                        currentPlayer,
                        ' active ? ',
                        isMusicActive,
                      );
                      if (!isPlaying) {
                        playMeditationFlow();
                        setIsPlaying(true);
                        setIsPaused(false);
                      } else {
                        handlePauseResume();
                      }
                    }}
                    style={{marginRight: 0}}>
                    <Image
                      source={
                        isPlaying
                          ? isPaused
                            ? IconData.PLAY
                            : IconData.PAUSE
                          : IconData.PLAY
                      }
                      style={{width: 40, height: 40}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    onPress={() => {
                      setIsActive(prev => !prev)
                      handleMusicPlayback();
                    }}

                    style={{
                      position: 'absolute',
                      right: 70, // Adjust distance from center
                      top: '25%',
                      transform: [{ translateY: -12 }],
                    }}
                  >
                    <Image
                      source={!isPaused ? (isActive ? IconData.MUSIC : IconData.MUSICCLOSE) : IconData.MUSIC}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity> */}

                  {currentPhase === 'Meditation Time' && (
                    <TouchableOpacity
                      onPress={() => {
                        setIsActive(prev => !prev);
                        handleMusicPlayback();
                      }}
                      style={{
                        position: 'absolute',
                        right: 70, // Adjust distance from center
                        top: '25%',
                        transform: [{translateY: -12}],
                      }}>
                      <Image
                        source={
                          !isPaused
                            ? isActive
                              ? IconData.MUSIC
                              : IconData.MUSICCLOSE
                            : IconData.MUSIC
                        }
                        style={{width: 40, height: 40}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
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
    </View>
  );
};
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
export default AdvanceMediaPlayer;
