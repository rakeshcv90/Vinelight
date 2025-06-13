import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Color, Font, IconData, ImageData } from '../../../assets/Image';
import FastImage from 'react-native-fast-image';
import Button2 from '../../Component/Button2';
import useNativeMusicPlayer from '../../Component/NativeusicPlayer';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');
const AdvanceMediaPlayer = ({ navigation, route }) => {
  const [song, setsong] = useState(route.params?.itemData?.pre?.song);
  const [song2, setsong2] = useState(route.params?.itemData?.int?.song);
  const [song3, setsong3] = useState(route.params?.itemData?.res?.song);
  const [song4, setsong4] = useState(route.params?.itemData?.end?.song);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalPhaseTime, setTotalPhaseTime] = useState(0);

  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );

  const [lastIntervalSecond, setLastIntervalSecond] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('Meditations');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTimestamp, setPauseTimestamp] = useState(null);

  const {
    pauseMusic,
    playMusic,
    releaseMusic,
    seekTo,
    duration,
    currentTime,
    stopMusic,
  } = useNativeMusicPlayer({
    song1: song,
    song2: medatationData?.data,
    pause: false,
    getSoundOffOn: true,
    restStart: false,
  });

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0; // force zero
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);



  useEffect(() => {
    const int = route.params?.itemData?.int;
    const med = route.params?.itemData?.med;

    const medDuration = (Number(med?.minute || 0) * 60) + Number(med?.second || 0);
    // const intTime = Number(int?.second || 0);
   const intTime = (Number(int?.minute || 0) * 60) + Number(int?.second || 0)
    console.log('Time duration ', intTime, medDuration, int?.song);

    if (!int?.song || !intTime || !medDuration || intTime >= medDuration) return;

    const timePassed = medDuration - timeLeft;
    console.log('Time duration ......   ', timePassed);

    // Repeating interval logic
    if (
      timeLeft > 0 &&
      timePassed > 0 &&
      timePassed % intTime === 0 &&
      lastIntervalSecond !== timePassed
    ) {
      setLastIntervalSecond(timePassed);
      playRepeatingInterval();
    }
  }, [timeLeft]);

  const startCountdown = durationInSec => {
    setTimeLeft(durationInSec);
    setTotalPhaseTime(durationInSec);
  };

  const playRepeatingInterval = async () => {
    try {
      console.log('Interval SONG');
      pauseMusic('player2'); // Pause main meditation
      setsong(song2);        // Optional: update UI
      playMusic('player1');  // Play interval
      await new Promise(res => setTimeout(res, 3000)); // Play for 3 seconds
      stopMusic('player1');  // Stop interval
      playMusic('player2');  // Resume meditation
    } catch (e) {
      console.error('Interval play error:', e);
    }
  };

  const playMeditationFlow = async () => {
    const { pre, med, int, res, end } = route.params?.itemData || {};
    const wait = seconds =>
      new Promise(resolve => setTimeout(resolve, seconds * 1000));

    try {
      if (pre?.song) {
        setCurrentPhase('Preparation Time');
        const preTime = Number(pre.second || 0);
        setsong(pre.song);
        startCountdown(preTime);
        setIsPlaying(true);
        playMusic('player1');
        await wait(preTime);
        // setIsPlaying(false);
        stopMusic('player1');
        // releaseMusic('player1');
      }

      const medDuration =
        Number(med?.minute || 0) * 60 + Number(med?.second || 0);
      // const intTime = Number(int?.minute || 0) * 60 + Number(int?.second || 0);
      // const intDuration =
      //   intTime > 0
      //     ? Number(int?.minute || 0) * 60 + Number(int?.second || 0)
      //     : 0;
      console.log('Meditation', medDuration,med?.song);
      // if (med?.song) {
      //   setCurrentPhase('Meditation Time');
        
      //   console.log('MED SONG');
      //   // console.log('XCvcxvxcvcvx', intDuration);

      //   startCountdown(medDuration);
      //   playMusic('player2');
      //   await wait(medDuration);
      //   stopMusic('player2');
      //   // }
      // }

      if(medDuration >0){
        setCurrentPhase('Meditation Time');
        
        console.log('MED SONG');
        // console.log('XCvcxvxcvcvx', intDuration);

        startCountdown(medDuration);
        playMusic('player2');
        await wait(medDuration);
        stopMusic('player2');
        // }
      }

      const timePassed = medDuration - timeLeft;
      if (res?.song && timePassed === medDuration) {
        setCurrentPhase('Rest Time');
        console.log('RES SONG  ',res.second);
        setsong(song3);
        playMusic('player1');
        const resTime = Number(res.second || 0);
        startCountdown(resTime); // Optional: show rest countdown
        await wait(resTime);
        if (end?.song) {
          setCurrentPhase('End Time');
          console.log('End SONG');
          setsong(song4);
          playMusic('player1');
          const endTime = Number(3 || 0);
          // startCountdown(endTime); // Optional: show end countdown
          await wait(endTime);
          stopMusic('player1');
          setCurrentPhase('Meditation Completed');
        } else {
          stopMusic('player1');
        }
      }

      // ✅ Only start END after rest timer is 0

    } catch (error) {
      console.error('❌ Error in meditation flow:', error);
    }
  };

  const handlePauseResume = () => {
    console.log("paused or not ", isPaused);
    if (isPaused) {
      console.log("play...... ",pauseTimestamp);
      // Resume music and timer
      if (pauseTimestamp !== null) {
        setTimeLeft(pauseTimestamp); // resume countdown
      }
      playMusic('player1');
      playMusic('player2');
      setIsPaused(false);
    } else {
      console.log("paused...... ", timeLeft);
      // Pause music and timer
      pauseMusic('player1');
      pauseMusic('player2');
      setPauseTimestamp(timeLeft); // remember remaining time
      setTimeLeft(0); // will stop the timer useEffect
      setIsPaused(true);
    }
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
                style={{ width: 24, height: 24 }}
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
                  // backgroundColor: Color?.LIGHTBROWN,
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
                    style={{ width: 31, height: 31 }}
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
                  <Text style={styles.subText}>{route.params?.itemData?.user?.name}</Text>
                  <FastImage
                    source={ImageData.MEDATATION}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{ width: width * 0.5, height: height * 0.2 }}
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

                <TouchableOpacity
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
                </TouchableOpacity>

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
    shadowOffset: { width: 2, height: 3 },
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
