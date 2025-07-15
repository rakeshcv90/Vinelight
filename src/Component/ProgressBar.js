// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';
// import {useSelector} from 'react-redux';
// import {AppState} from 'react-native';
// import ActivityLoader from './ActivityLoader';
// import Toast from 'react-native-toast-message';
// import NetInfo from '@react-native-community/netinfo';
// import {useNavigation} from '@react-navigation/native';

// const {width} = Dimensions.get('window');

// const ProgressBar = ({
//   type,
//   data,
//   defaultMusic,
//   setDefaultMusic,
//   onUpdateTime,
//   pauseSound,
//   ttsOpen,
//   setTtsOpen,
//   totalDUration,
//   musicTime,
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [musicPlay, setMusicPlay] = useState(true);
//   const [musicPlay2, setMusicPlay2] = useState(true);
//   const [position, setPosition] = useState(0);
//   const intervalRef = useRef(null);
//   const [timer, setTimer] = useState(0);
//   const appState = useRef(AppState.currentState);
//   const [userPaused, setUserPaused] = useState(false);
//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const [isLoadingMusic, setIsLoadingMusic] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);
//   const navigation = useNavigation();
//   const [stopMusicPlayer, setstopMusicPlayer] = useState(false);
//   const medatationData = useSelector(
//     state => state?.user?.advanceMeditationData,
//   );

//   const {
//     pauseMusic,
//     playMusic,
//     releaseMusic,
//     seekTo,
//     stopMusic,
//     duration,
//     currentTime,
//   } = useNativeMusicPlayer({
//     song1: medatationData?.data,
//     song2: data?.lyrics_path,
//     pause: isPlaying,
//     getSoundOffOn: true,
//     restStart: false,
//   });
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (
//         appState.current.match(/active/) &&
//         nextAppState.match(/inactive|background/)
//       ) {
//         console.log('App moved to background');
//         pauseMusic('player1');
//         pauseMusic('player2');
//       } else if (
//         appState.current.match(/inactive|background/) &&
//         nextAppState === 'active'
//       ) {
//         console.log('App moved to foreground');
//         if (!userPaused) {
//           if (musicPlay) playMusic('player1');
//           playMusic('player2');
//         }
//       }
//       appState.current = nextAppState;
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, [musicPlay, playMusic, pauseMusic, userPaused]);
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
//     if (!isConnected) {
//       Toast.show({
//         type: 'custom',
//         position: 'top',
//         props: {
//           icon: IconData.ERR,
//           text: 'Poor internet connection or not working',
//         },
//       });

//       setTimeout(() => {
//         stopMusic('player1');
//         stopMusic('player2');
//         navigation.goBack();
//       }, 1000); // adjust delay if needed
//     }
//   }, [isConnected]);

//   useEffect(() => {
//     return () => {
//       releaseMusic();
//       clearInterval(intervalRef.current);
//     };
//   }, []);
//   useEffect(() => {
//     if (isPlaying) {
//       if (isPlaying && musicPlay) {
//         playMusic('player1');
//       }
//       if(isPlayerReady){
//       playMusic('player2');
//       }
//     }
//   }, [isPlaying, timer, isConnected]);

//   useEffect(() => {
//     if (isPlaying && isPlayerReady && initialLoadDone && isConnected) {
//       if (intervalRef.current) clearInterval(intervalRef.current);

//       intervalRef.current = setInterval(() => {
//         setPosition(prev => {
//           const next = prev + 1;
//           setTimer(next);
//           return next;
//         });
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, [isPlaying, isPlayerReady, initialLoadDone, isConnected]);

//   useEffect(() => {
//     if (position >= musicTime) {
//       clearInterval(intervalRef.current);
//       try {
//         stopMusic('player1');
//         stopMusic('player2');
//         setIsPlaying(false);
//         setTtsOpen(false);
//         seekTo(0);
//         setPosition(0);
//          setstopMusicPlayer(false);
//       } catch (err) {
//         console.warn('Error stopping music:', err);
//       }
//     } else {
//       if (position >= duration?.player2) {
//         console.log('🟢 Position less than duration — stopping only player2');
//         stopMusic('player2');
//         setstopMusicPlayer(true);
//         // setIsPlaying(false);
//         // setTtsOpen(false);
//       }
//     }
//   }, [position, musicTime]);

//   useEffect(() => {
//     if (onUpdateTime) {
//       onUpdateTime(position);
//     }
//   }, [position]);

//   useEffect(() => {
//     totalDUration(duration.player2);
//   }, [duration.player2]);

//   const formatTime = sec => {
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const progressWidth =
//     musicTime > 0 ? (position / musicTime) * width * 0.75 : 0;

//   const loadSongAndCheckReady = async (songPath, playerKey) => {
//     try {
//       await playMusic(playerKey); // you might need to use `setCustomSong` if applicable
//       setIsPlayerReady(true);
//       setInitialLoadDone(true);
//     } catch (err) {
//       console.error('Error loading song:', err);
//       setIsPlayerReady(false);
//     }
//   };

//   const handlePlayPause = async () => {
//     if (isPlaying) {
//       console.log('check it ', isPlaying, isPlayerReady);
//       pauseMusic('player1');
//       pauseMusic('player2');
//       setTtsOpen(false);
//       clearInterval(intervalRef.current);
//     } else {
//       if (position >= musicTime) {
//         seekTo(0);
//         setPosition(0);
//       }

//       if (!initialLoadDone) {
//         console.log('check it working ', isPlaying, isPlayerReady);
//         setIsLoadingMusic(true); // 👈 Start loading
//         setIsPlayerReady(false);

//         await loadSongAndCheckReady(data?.lyrics_path, 'player2');
//         setIsLoadingMusic(false); // 👈 Done loading
//         setIsPlaying(true);
//       } else {
//         console.log('check it working not ', isPlaying, isPlayerReady);

//         if (musicPlay) {
//           playMusic('player1');
//         }

//         playMusic('player2');

//         setTtsOpen(true);
//       }
//     }

//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Time Row */}
//       <View style={styles.timeRow}>
//         <Text style={styles.timeText}>{formatTime(position)}</Text>
//         <Text style={styles.timeText}>{formatTime(musicTime)}</Text>
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

//       {/* <ActivityLoader visible={isLoadingMusic} /> */}
//       <ActivityLoader visible={!isConnected || (!isPlayerReady && isPlaying)} />
//       {/* Controls */}
//       <View style={styles.controls}>
//         <View style={styles.iconCircle}></View>

//         <TouchableOpacity
//           style={styles.mainCircle}
//           onPress={handlePlayPause}
//           activeOpacity={0.7}>
//           <Image
//             source={isPlaying ? IconData.PAUSE : IconData.PLAY}
//             style={styles.playIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.iconCircle}
//           activeOpacity={0.7}
//           onPress={() => {
//             if (isPlaying) {
//               if (musicPlay) {
//                 pauseMusic('player1');
//               } else {
//                 playMusic('player1');
//               }
//               setMusicPlay(!musicPlay);
//             }
//           }}>
//           <Image
//             source={musicPlay ? IconData.MUSIC : IconData.MUSICCLOSE}
//             style={styles.icon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timeRow: {
//     width: '95%',
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
//   icon: {
//     width: 45,
//     height: 45,
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
// });

// export default ProgressBar;

// Optimized and enhanced ProgressBar component

// Optimized ProgressBar.js

// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   AppState,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';
// import {useSelector} from 'react-redux';
// import ActivityLoader from './ActivityLoader';
// import Toast from 'react-native-toast-message';
// import NetInfo from '@react-native-community/netinfo';
// import {useNavigation} from '@react-navigation/native';

// const {width} = Dimensions.get('window');

// const ProgressBar = ({
//   data,
//   pauseSound,
//   ttsOpen,
//   setTtsOpen,
//   totalDUration,
//   musicTime,
//   onUpdateTime,
// }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [musicPlay, setMusicPlay] = useState(true);
//   const [position, setPosition] = useState(0);
//   const intervalRef = useRef(null);
//   const appState = useRef(AppState.currentState);
//   const [userPaused, setUserPaused] = useState(false);
//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);
//   const [isLoadingMusic, setIsLoadingMusic] = useState(false);
//   const navigation = useNavigation();

//   const medatationData = useSelector(
//     state => state?.user?.advanceMeditationData,
//   );

//   const {pauseMusic, playMusic, releaseMusic, seekTo, stopMusic, duration} =
//     useNativeMusicPlayer({
//       song1: medatationData?.data,
//       song2: data?.lyrics_path,
//       pause: isPlaying,
//       getSoundOffOn: true,
//       restStart: false,
//     });

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (
//         appState.current.match(/active/) &&
//         nextAppState.match(/inactive|background/)
//       ) {
//         pauseMusic('player1');
//         pauseMusic('player2');
//       } else if (
//         appState.current.match(/inactive|background/) &&
//         nextAppState === 'active'
//       ) {
//         if (!userPaused && initialLoadDone && isPlayerReady) {
//           if (musicPlay) playMusic('player1');
//           playMusic('player2');
//           setIsPlaying(true);
//         }
//       }
//       appState.current = nextAppState;
//     });
//     return () => subscription.remove();
//   }, [
//     musicPlay,
//     pauseMusic,
//     playMusic,
//     userPaused,
//     initialLoadDone,
//     isPlayerReady,
//   ]);

//   useEffect(() => {
//     if (pauseSound) {
//       pauseMusic('player1');
//     }
//   }, [pauseSound]);

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
//       setTimeout(() => {
//         stopMusic('player1');
//         stopMusic('player2');
//         navigation.goBack();
//       }, 1000);
//     }
//   }, [isConnected]);

//   useEffect(() => {
//     return () => {
//       releaseMusic();
//       clearInterval(intervalRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (isPlaying && isPlayerReady && initialLoadDone && isConnected) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = setInterval(() => {
//         setPosition(prev => prev + 1);
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [isPlaying, isPlayerReady, initialLoadDone, isConnected]);

//   useEffect(() => {
//     if (position >= musicTime) {
//       clearInterval(intervalRef.current);
//       stopMusic('player1');
//       stopMusic('player2');
//       setIsPlaying(false);
//       setTtsOpen(false);
//       seekTo(0);
//       setPosition(0);
//     } else if (position >= duration?.player2) {
//       stopMusic('player2');
//     }
//   }, [position, musicTime, duration?.player2]);

//   useEffect(() => {
//     if (onUpdateTime) onUpdateTime(position);
//   }, [position]);

//   useEffect(() => {
//     totalDUration(duration?.player2);
//   }, [duration?.player2]);

//   const loadSongAndCheckReady = async (songPath, playerKey) => {
//     let didLoad = false;
//     const timeout = setTimeout(() => {
//       if (!didLoad) {
//         Toast.show({
//           type: 'custom',
//           position: 'top',
//           props: {
//             icon: IconData.ERR,
//             text: 'Meditation music not loaded due to low internet',
//           },
//         });
//         stopMusic('player1');
//         stopMusic('player2');
//         navigation.goBack();
//       }
//     }, 10000);

//     try {
//       await playMusic(playerKey);
//       didLoad = true;
//       clearTimeout(timeout);
//       setIsPlayerReady(true);
//       setInitialLoadDone(true);
//     } catch (err) {
//       console.error('Error loading song:', err);
//       clearTimeout(timeout);
//     }
//   };

//   const handlePlayPause = async () => {
//     if (isPlaying) {
//       pauseMusic('player1');
//       pauseMusic('player2');
//       setTtsOpen(false);
//       setUserPaused(true);
//       setIsPlaying(false);
//       clearInterval(intervalRef.current);
//     } else {
//       if (position >= musicTime) {
//         seekTo(0);
//         setPosition(0);
//       }

//       if (!initialLoadDone) {
//         setIsLoadingMusic(true);
//         setIsPlayerReady(false);
//         await loadSongAndCheckReady(data?.lyrics_path, 'player2');
//         setIsLoadingMusic(false);
//       }

//       if (musicPlay) playMusic('player1');
//       playMusic('player2');
//       setTtsOpen(true);
//       setUserPaused(false);
//       setIsPlaying(true);
//     }
//   };

//   const formatTime = sec => {
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const progressWidth =
//     musicTime > 0 ? (position / musicTime) * width * 0.75 : 0;

//   return (
//     <View style={styles.container}>
//       <View style={styles.timeRow}>
//         <Text style={styles.timeText}>{formatTime(position)}</Text>
//         <Text style={styles.timeText}>{formatTime(musicTime)}</Text>
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

//       <ActivityLoader visible={!isConnected || (!isPlayerReady && isPlaying)} />

//       <View style={styles.controls}>
//         <View style={styles.iconCircle} />

//         <TouchableOpacity
//           style={styles.mainCircle}
//           onPress={handlePlayPause}
//           activeOpacity={0.7}>
//           <Image
//             source={isPlaying ? IconData.PAUSE : IconData.PLAY}
//             style={styles.playIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.iconCircle}
//           activeOpacity={0.7}
//           onPress={() => {
//             if (isPlaying) {
//               if (musicPlay) pauseMusic('player1');
//               else playMusic('player1');
//               setMusicPlay(!musicPlay);
//             }
//           }}>
//           <Image
//             source={musicPlay ? IconData.MUSIC : IconData.MUSICCLOSE}
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
//     width: '95%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   timeText: {fontSize: 16, color: '#3B4F2C', fontWeight: '600'},
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
//   icon: {width: 45, height: 45},
//   playIcon: {width: 55, height: 55},
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
//   patternImage: {width: '100%', height: '100%'},
// });

// export default ProgressBar;
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
import LinearGradient from 'react-native-linear-gradient';
import useNativeMusicPlayer from './NativeusicPlayer';
import {useSelector} from 'react-redux';
import ActivityLoader from './ActivityLoader';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ProgressBar = ({
  data,
  pauseSound,
  ttsOpen,
  setTtsOpen,
  totalDUration,
  musicTime,
  onUpdateTime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicPlay, setMusicPlay] = useState(true);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isPlayer2Finished, setIsPlayer2Finished] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const navigation = useNavigation();

  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );

  const {pauseMusic, playMusic, releaseMusic, seekTo, stopMusic, duration} =
    useNativeMusicPlayer({
      song1: medatationData?.data,
      song2: data?.lyrics_path,
      pause: isPlaying,
      getSoundOffOn: true,
      restStart: false,
    });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        pauseMusic('player1');
        pauseMusic('player2');
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (!userPaused && initialLoadDone && isPlayerReady) {
          if (musicPlay) playMusic('player1');
          if (!isPlayer2Finished) playMusic('player2');
          setIsPlaying(true);
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [
    musicPlay,
    pauseMusic,
    playMusic,
    userPaused,
    initialLoadDone,
    isPlayerReady,
    isPlayer2Finished,
  ]);

  useEffect(() => {
    if (pauseSound) {
      pauseMusic('player1');
    }
  }, [pauseSound]);

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
        stopMusic('player1');
        stopMusic('player2');
        navigation.goBack();
      }, 1000);
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      releaseMusic();
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      isPlaying &&
      isPlayerReady &&
      initialLoadDone &&
      isConnected &&
      !isFinished
    ) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setPosition(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isPlayerReady, initialLoadDone, isConnected, isFinished]);

  useEffect(() => {
    if (position >= musicTime) {
      clearInterval(intervalRef.current);
      stopMusic('player1');
      stopMusic('player2');
      setIsPlaying(false);
      setTtsOpen(false);
      seekTo(0);
      setPosition(0);
      setIsFinished(true);
        navigation.goBack();
    } else if (
      duration?.player2 &&
      position >= duration.player2 &&
      !isPlayer2Finished
    ) {
      stopMusic('player2');
      setIsPlayer2Finished(true);
    }
  }, [position, musicTime, duration?.player2, isPlayer2Finished]);

  useEffect(() => {
    if (onUpdateTime) onUpdateTime(position);
  }, [position]);

  useEffect(() => {
    totalDUration(duration?.player2);
  }, [duration?.player2]);

  const loadSongAndCheckReady = async (songPath, playerKey) => {
    let didLoad = false;
    const timeout = setTimeout(() => {
      if (!didLoad) {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR,
            text: 'Meditation music not loaded due to low internet',
          },
        });
        stopMusic('player1');
        stopMusic('player2');
        navigation.goBack();
      }
    }, 10000);

    try {
      await playMusic(playerKey);
      didLoad = true;
      clearTimeout(timeout);
      setIsPlayerReady(true);
      setInitialLoadDone(true);
    } catch (err) {
      console.error('Error loading song:', err);
      clearTimeout(timeout);
    }
  };

  const handlePlayPause = async () => {
    if (isFinished) return;

    if (isPlaying) {
      pauseMusic('player1');
      pauseMusic('player2');
      setTtsOpen(false);
      setUserPaused(true);
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else {
      if (position >= musicTime) return;

      if (!initialLoadDone && !isPlayer2Finished) {
        setIsLoadingMusic(true);
        setIsPlayerReady(false);
        await loadSongAndCheckReady(data?.lyrics_path, 'player2');
        setIsLoadingMusic(false);
      }

      if (musicPlay) playMusic('player1');
      if (!isPlayer2Finished) playMusic('player2');

      setTtsOpen(true);
      setUserPaused(false);
      setIsPlaying(true);
    }
  };

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressWidth =
    musicTime > 0 ? (position / musicTime) * width * 0.75 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(musicTime)}</Text>
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

      <ActivityLoader visible={!isConnected || (!isPlayerReady && isPlaying)} />

      <View style={styles.controls}>
        <View style={styles.iconCircle} />

        <TouchableOpacity
          style={styles.mainCircle}
          onPress={handlePlayPause}
          activeOpacity={0.7}>
          <Image
            source={isPlaying ? IconData.PAUSE : IconData.PLAY}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => {
            if (isPlaying) {
              if (musicPlay) pauseMusic('player1');
              else playMusic('player1');
              setMusicPlay(!musicPlay);
            }
          }}>
          <Image
            source={musicPlay ? IconData.MUSIC : IconData.MUSICCLOSE}
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
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeText: {fontSize: 16, color: '#3B4F2C', fontWeight: '600'},
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
  icon: {width: 45, height: 45},
  playIcon: {width: 55, height: 55},
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
  patternImage: {width: '100%', height: '100%'},
});

export default ProgressBar;
