
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   AppState,
//   BackHandler,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';
// import {useSelector} from 'react-redux';
// import {callApi} from './ApiCall';
// import {Api} from '../Api';
// import ActivityLoader from './ActivityLoader';
// import NetInfo from '@react-native-community/netinfo';
// import {useNavigation} from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// const {width} = Dimensions.get('window');

// const ProgressBar2 = ({musicTime, pauseSound, onEnd}) => {
//   const musicTimer = musicTime * 60; // Convert minutes to seconds
//   const medatationData = useSelector(
//     state => state?.user?.advanceMeditationData,
//   );
//   const [isConnected, setIsConnected] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [position, setPosition] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [sound, setSound] = useState();
//   const [sound2, setSound2] = useState();
//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [initialLoadDone, setInitialLoadDone] = useState(false); // <-- NEW
//   const navigation = useNavigation();
//   const [soundsLoading, setSoundsLoading] = useState(false); 
//   const appState = useRef(AppState.currentState);
//   const [isBellPlayedOnce, setIsBellPlayedOnce] = useState(false);

//   const {
//     pauseMusic,
//     playMusic,
//     stopMusic,
//     seekTo,
//     currentTime,
//     setVolume,
//     setCustomSong,
//   } = useNativeMusicPlayer({
//     song1: medatationData?.data,
//     pause: isPlaying,
//     getSoundOffOn: true,
//     restStart: false,
//   });


//   useEffect(() => {
//   const subscription = BackHandler.addEventListener(
//     'hardwareBackPress',
//     () => {
//       console.log('Back button pressed');
//       return true;
//     }
//   );

//   return () => {
//     if (typeof subscription.remove === 'function') {
//       subscription.remove(); // RN ≤ 0.70
//     } else if (typeof subscription === 'function') {
//       subscription(); // RN ≥ 0.71
//     }
//   };
// }, []);
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (
//         appState.current === 'active' &&
//         nextAppState.match(/inactive|background/)
//       ) {
//         pauseMusic('player1');
//         pauseMusic('player2');
//       } else if (
//         appState.current.match(/inactive|background/) &&
//         nextAppState === 'active'
//       ) {
//         playMusic('player1');
//         if (position >= musicTimer) {
//           setCustomSong(sound2?.[0]?.music_path, 'player2');
//           playMusic('player2');
//         } else if (position < 1) {
//           playMusic('player2');
//         }
//       }
//       appState.current = nextAppState;
//     });

//     return () => subscription.remove();
//   }, [pauseMusic, playMusic, setCustomSong, position]);

  
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!isConnected) {
//       Toast.show({
//         type: 'custom',
//         position: 'top',
//         props: {
//           icon: IconData.ERR,
//           text: 'Poor internet connection or not working',
//         },
//       });

//       // Navigate back after short delay to allow toast to show
//       setTimeout(() => {
//          stopMusic();
//         navigation.goBack();
//       }, 3000); // adjust delay if needed
//     }
//   }, [isConnected]);

//   useEffect(() => {
//     if (pauseSound) {
//       pauseMusic('player1');
//     }
//   }, [pauseSound, pauseMusic]);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => unsubscribe();
//   }, []);
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
    
//     try {
//       setSoundsLoading(true); 
//       const data = await callApi(Api.SOUND);
//       const bell = data?.filter(item => item?.name === 'Bell');
//       const bowl = data?.filter(item => item?.name === 'Bowl');
//       setSound(bell);
//       setSound2(bowl);
//     } catch (error) {
//       console.error('Sound fetch error:', error.message);
//     }finally {
//      setSoundsLoading(false);         // stop spinner
//     }
//   };

//   useEffect(() => {
//     setPosition(currentTime.player1 || 0);
//   }, [currentTime.player1]);

//   useEffect(() => {
//     if (currentTime.player1 >= musicTimer) {
//       stopMusic();
//       callEnd();
//       setIsPlaying(false);
//     }
//   }, [currentTime.player1]);

//   const callEnd = async () => {
//     await setCustomSong(sound2?.[0]?.music_path, 'player2');
//     playMusic('player2');
//     if (onEnd) {
//       setTimeout(() => onEnd(), 3000);
//     }
//   };

//   useEffect(() => {
//     if (pauseSound) {
//       pauseMusic('player1');
//       pauseMusic('player2');
//       setIsPlaying(false);
//     }
//   }, [pauseSound]);

//   const loadSongAndCheckReady = async (songPath, playerKey) => {
//     try {
//       await setCustomSong(songPath, playerKey);
//       setIsPlayerReady(true);
//       setInitialLoadDone(true); // ✅ mark load done
//     } catch (err) {
//       console.error('Error loading song:', err);
//       setIsPlayerReady(false);
//     }
//   };

//   useEffect(() => {
//     if (isPlayerReady && isPlaying) {
//       playMusic('player2');
//       playMusic('player1');
//     }
//   }, [isPlayerReady, isPlaying]);

//   const handlePlayPause = async () => {
//     if (!sound || !sound[0]?.music_path) {
//       console.log('Zfffffffffffffff');
//       return;
//     }

//     if (isPlaying) {
//       pauseMusic('player1');
//       pauseMusic('player2');
//       setIsPlaying(false);
//     } else {
//       if (position >= musicTimer) {
//         seekTo(0);
//         setPosition(0);
//       }

//       if (!initialLoadDone) {
//         setIsPlayerReady(false);
//         setIsPlaying(true);
//         await loadSongAndCheckReady(sound[0]?.music_path, 'player2');
//       } else {
//         playMusic('player2');
//         playMusic('player1');
//         setIsPlaying(true);
//       }
//     }
//   };


//   const formatTime = sec => {
//     if (sec < 0 || isNaN(sec)) return '00:00'; // fallback
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };
//   const progressWidth =
//     musicTimer > 0 ? (position / musicTimer) * width * 0.75 : 0;

//   return (
//     <View style={styles.container}>
//       <View style={styles.timeRow}>
//         <Text style={styles.timeText}>{formatTime(position)}</Text>
//         <Text style={styles.timeText}>{formatTime(musicTimer)}</Text>
//       </View>

//       <View style={styles.progressWrapper}>
//         <View style={styles.unfilledBar} />
//         {PLATFORM_IOS ? (
//           <View style={[styles.filledBar, {width: progressWidth}]}>
//             <Image
//               source={IconData.PROGRESS}
//               resizeMode="repeat"
//               style={styles.patternImage}
//             />
//           </View>
//         ) : (
//           <View style={[styles.filledBar, {width: progressWidth}]}>
//             <LinearGradient
//               colors={['#3B4F2C', '#5A7C45']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={StyleSheet.absoluteFill}
//             />
//           </View>
//         )}
//       </View>

//       <ActivityLoader visible={soundsLoading||(!isPlayerReady && isPlaying)} />

//       <View style={styles.controls}>
//         <View style={styles.iconCircle} />
//         <TouchableOpacity
//           style={styles.mainCircle}
//           activeOpacity={0.7}
//           onPress={handlePlayPause}>
//           <Image
//             source={!isPlaying ? IconData.PLAY : IconData.PAUSE}
//             style={styles.playIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.iconCircle}
//           onPress={async () => {
//             try {
//               const newVolume = isMuted ? 1.0 : 0.0;
//               await setVolume(newVolume, 'player1');
//               setIsMuted(prev => !prev);
//             } catch (err) {
//               console.error('Volume toggle error:', err);
//             }
//           }}>
//           <Image
//             source={isMuted ? IconData.MUSICCLOSE : IconData.MUSIC}
//             style={styles.icon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   timeRow: {
//     width: '90%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 16,
//     color: '#3B4F2C',
//     fontWeight: '600',
//   },
//   controls: {
//     flexDirection: 'row',
//     top: -15,
//     justifyContent: 'space-between',
//     width: '70%',
//     alignItems: 'center',
//   },
//   iconCircle: {
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mainCircle: {
//     width: 80,
//     height: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   playIcon: {
//     width: 55,
//     height: 55,
//   },
//   progressWrapper: {
//     width: width * 0.75,
//     height: 24,
//     borderRadius: 36,
//     overflow: 'hidden',
//     backgroundColor: Color.BROWN3,
//     marginBottom: 20,
//   },
//   unfilledBar: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: Color.BROWN3,
//   },
//   filledBar: {
//     height: '100%',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     overflow: 'hidden',
//   },
//   patternImage: {
//     width: '100%',
//     height: '100%',
//   },
//   icon: {
//     width: 45,
//     height: 45,
//   },
// });

// export default ProgressBar2;


import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  AppState,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
import LinearGradient from 'react-native-linear-gradient';
import useNativeMusicPlayer from './NativeusicPlayer';
import {useSelector} from 'react-redux';
import {callApi} from './ApiCall';
import {Api} from '../Api';
import ActivityLoader from './ActivityLoader';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

const ProgressBar2 = ({musicTime, pauseSound, onEnd}) => {
  const musicTimer = musicTime * 60;
  const medatationData = useSelector(state => state?.user?.advanceMeditationData);
  const [isConnected, setIsConnected] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState();
  const [sound2, setSound2] = useState();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [bellPlayed, setBellPlayed] = useState(false);
  const navigation = useNavigation();
  const [soundsLoading, setSoundsLoading] = useState(false);
  const appState = useRef(AppState.currentState);

  const {
    pauseMusic,
    playMusic,
    stopMusic,
    seekTo,
    currentTime,
    setVolume,
    setCustomSong,
  } = useNativeMusicPlayer({
    song1: medatationData?.data,
    pause: isPlaying,
    getSoundOffOn: true,
    restStart: false,
  });

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      if (typeof subscription.remove === 'function') {
        subscription.remove();
      } else if (typeof subscription === 'function') {
        subscription();
      }
    };
  }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (
  //       appState.current === 'active' &&
  //       nextAppState.match(/inactive|background/)
  //     ) {
  //       pauseMusic('player1');
  //       pauseMusic('player2');
  //     } else if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === 'active'
  //     ) {
  //       if (position < musicTimer) {
  //         playMusic('player1');
  //       }
  //     }
  //     appState.current = nextAppState;
  //   });
  //   return () => subscription.remove();
  // }, [pauseMusic, playMusic, position]);


  useEffect(() => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App is going to background: pause music
      pauseMusic('player1');
      pauseMusic('player2');
      setIsPlaying(false);
    }

    // App is coming back to foreground
    // Do NOT auto-play anything
    appState.current = nextAppState;
  });

  return () => subscription.remove();
}, [pauseMusic]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

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
      setTimeout(() => {
        stopMusic();
        navigation.goBack();
      }, 3000);
    }
  }, [isConnected]);

  useEffect(() => {
    if (pauseSound) {
      pauseMusic('player1');
      pauseMusic('player2');
      setIsPlaying(false);
    }
  }, [pauseSound]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setSoundsLoading(true);
      const data = await callApi(Api.SOUND);
      const bell = data?.filter(item => item?.name === 'Bell');
      const bowl = data?.filter(item => item?.name === 'Bowl');
      setSound(bell);
      setSound2(bowl);
    } catch (error) {
      console.error('Sound fetch error:', error.message);
    } finally {
      setSoundsLoading(false);
    }
  };

  useEffect(() => {
    setPosition(currentTime.player1 || 0);
  }, [currentTime.player1]);

  useEffect(() => {
    if (currentTime.player1 >= musicTimer) {
      stopMusic();
      callEnd();
      setIsPlaying(false);
    }
  }, [currentTime.player1]);

  const callEnd = async () => {
    await setCustomSong(sound2?.[0]?.music_path, 'player2');
    playMusic('player2');
    setBellPlayed(true);
    if (onEnd) {
      setTimeout(() => onEnd(), 3000);
    }
  };

  const loadSongAndCheckReady = async (songPath, playerKey) => {
    try {
      await setCustomSong(songPath, playerKey);
      setIsPlayerReady(true);
      setInitialLoadDone(true);

      if (!bellPlayed) {
        playMusic('player2');
        setBellPlayed(true);
      }
    } catch (err) {
      console.error('Error loading song:', err);
      setIsPlayerReady(false);
    }
  };

  useEffect(() => {
    if (isPlayerReady && isPlaying) {
      playMusic('player1');
    }
  }, [isPlayerReady, isPlaying]);

  const handlePlayPause = async () => {
    if (!sound || !sound[0]?.music_path) return;

    if (isPlaying) {
      pauseMusic('player1');
      pauseMusic('player2');
      setIsPlaying(false);
    } else {
      if (position >= musicTimer) {
        seekTo(0);
        setPosition(0);
        setBellPlayed(false);
      }

      if (!initialLoadDone) {
        setIsPlayerReady(false);
        setIsPlaying(true);
        await loadSongAndCheckReady(sound[0]?.music_path, 'player2');
      } else {
        playMusic('player1');
        setIsPlaying(true);
      }
    }
  };

  const formatTime = sec => {
    if (sec < 0 || isNaN(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressWidth =
    musicTimer > 0 ? (position / musicTimer) * width * 0.75 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(musicTimer)}</Text>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.unfilledBar} />
        {PLATFORM_IOS ? (
          <View style={[styles.filledBar, {width: progressWidth}]}>
            <Image
              source={IconData.PROGRESS}
              resizeMode="repeat"
              style={styles.patternImage}
            />
          </View>
        ) : (
          <View style={[styles.filledBar, {width: progressWidth}]}>
            <LinearGradient
              colors={['#3B4F2C', '#5A7C45']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </View>

      <ActivityLoader visible={soundsLoading || (!isPlayerReady && isPlaying)} />

      <View style={styles.controls}>
        <View style={styles.iconCircle} />
        <TouchableOpacity
          style={styles.mainCircle}
          activeOpacity={0.7}
          onPress={handlePlayPause}>
          <Image
            source={!isPlaying ? IconData.PLAY : IconData.PAUSE}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={async () => {
            try {
              const newVolume = isMuted ? 1.0 : 0.0;
              await setVolume(newVolume, 'player1');
              setIsMuted(prev => !prev);
            } catch (err) {
              console.error('Volume toggle error:', err);
            }
          }}>
          <Image
            source={isMuted ? IconData.MUSICCLOSE : IconData.MUSIC}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  timeRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
  color: '#671AAF', 
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    top: -15,
    justifyContent: 'space-between',
    width: '70%',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 55,
    height: 55,
  },
  progressWrapper: {
    width: width * 0.75,
    height: 24,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: Color.BROWN3,
    marginBottom: 20,
  },
  unfilledBar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Color.BROWN3,
  },
  filledBar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  icon: {
    width: 45,
    height: 45,
  },
});

export default ProgressBar2;

