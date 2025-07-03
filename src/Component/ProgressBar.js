// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import React, {use, useEffect, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';
// import {useSelector} from 'react-redux';

// const {width} = Dimensions.get('window');

// const ProgressBar = ({
//   type,
//   data,
//   defaultMusic,
//   setDefaultMusic,
//   onUpdateTime,
//   pauseSound,
//   // stopMusic,
//   ttsOpen,
//   setTtsOpen,
//   totalDUration,
//   musicTime,
// }) => {
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [musicPlay, setMusicPlay] = useState(true);
//   const [musicPlay2, setMusicPlay2] = useState(true);
//   const [position, setPosition] = useState(0);
//   const [timer, setTimer] = useState(0);
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
//     if (pauseSound) {
//       pauseMusic('player1');
//     }
//   }, [pauseSound, pauseMusic]);

//   useEffect(() => {
//     return () => {
//       releaseMusic();
//     };
//   }, []);
//   useEffect(() => {

//     if (isPlaying) {
//       if (isPlaying && musicPlay && timer > 10) {
//         playMusic('player1');
//       }

//       playMusic('player2');
//     }
//   }, [isPlaying, timer]);
//   useEffect(() => {
//     if (onUpdateTime) {
//       onUpdateTime(currentTime.player2);
//       setTimer(currentTime.player2);
//     }
//   }, [currentTime.player2]);
//   useEffect(() => {
//     // if (onUpdateTime) {
//     //   onUpdateTime(currentTime.player2);
//     // }
//     totalDUration(duration.player2);
//   }, [duration.player2]);

//   const formatTime = sec => {
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   // const progressWidth =
//   //   duration.player1 > 0 ? (currentTime.player1 / duration.player1) * 300 : 0;
//   const progressWidth = musicTime > 0 ? (position / musicTime) * 300 : 0;

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       pauseMusic('player1');
//       pauseMusic('player2');
//       setTtsOpen(false);
//     } else {
//       if (position >= musicTime) {
//         seekTo(0);
//         setPosition(0);
//       }
//       if (musicPlay) {
//         playMusic('player1');
//       }
//       // playMusic('player1');
//       playMusic('player2');
//       setTtsOpen(true);
//     }
//     setIsPlaying(!isPlaying);
//   };
//   useEffect(() => {
//     setPosition(currentTime.player2 || 0);
//   }, [currentTime.player2]);
//   useEffect(() => {
//     if (currentTime.player2 >= musicTime) {
//       // stopMusic();
//       stopMusic('player1');
//       stopMusic('player2');
//       setIsPlaying(false);
//       seekTo(0);
//     }
//   }, [currentTime.player1]);
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

//       {/* Controls */}
//       <View style={styles.controls}>
//         <View
//           style={styles.iconCircle}
//           // activeOpacity={0.7}
//           // onPress={() => {
//           //   if (musicPlay2) {
//           //     pauseMusic('player2');
//           //   } else {
//           //     playMusic('player2');
//           //   }
//           //   setMusicPlay2(!musicPlay2);
//           //    setTtsOpen(!ttsOpen);
//           // }}
//         >
//           {/* <Image
//             resizeMode="contain"
//             source={musicPlay2 ? IconData.SPEAK : IconData.SPEAKCLOSE}
//             style={styles.icon}
//           /> */}
//         </View>

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
//             if (musicPlay) {
//               pauseMusic('player1');
//             } else {
//               playMusic('player1');
//             }
//             setMusicPlay(!musicPlay);
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
//     width: 300,
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
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
import LinearGradient from 'react-native-linear-gradient';
import useNativeMusicPlayer from './NativeusicPlayer';
import {useSelector} from 'react-redux';
import {AppState} from 'react-native';
import ActivityLoader from './ActivityLoader';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const ProgressBar = ({
  type,
  data,
  defaultMusic,
  setDefaultMusic,
  onUpdateTime,
  pauseSound,
  ttsOpen,
  setTtsOpen,
  totalDUration,
  musicTime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicPlay, setMusicPlay] = useState(true);
  const [musicPlay2, setMusicPlay2] = useState(true);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const appState = useRef(AppState.currentState);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );

  const {
    pauseMusic,
    playMusic,
    releaseMusic,
    seekTo,
    stopMusic,
    duration,
    currentTime,
  } = useNativeMusicPlayer({
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
        console.log('App moved to background');
        pauseMusic('player1');
        pauseMusic('player2');
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App moved to foreground');
        if (!userPaused) {
          if (musicPlay) playMusic('player1');
          playMusic('player2');
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [musicPlay, playMusic, pauseMusic, userPaused]);
  useEffect(() => {
    if (pauseSound) {
      pauseMusic('player1');
    }
  }, [pauseSound, pauseMusic]);

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

      // Navigate back after short delay to allow toast to show
      setTimeout(() => {
        stopMusic('player1');
        stopMusic('player2');
        navigation.goBack();
      }, 1000); // adjust delay if needed
    }
  }, [isConnected]);

  useEffect(() => {
    return () => {
      releaseMusic();
      clearInterval(intervalRef.current);
    };
  }, []);
  useEffect(() => {
    if (isPlaying) {
      if (isPlaying && musicPlay) {
        playMusic('player1');
      }

      playMusic('player2');
    }
  }, [isPlaying, timer, isConnected]);

  // Toast.show({
  //   type: 'custom',
  //   position: 'top',
  //   props: {
  //     icon: IconData.ERR, // ✅ Your image source
  //     text: `isPlaying: ${isPlaying}, initialLoadDone: ${initialLoadDone}, isPlayerReady: ${isPlayerReady}`,
  //   },
  // });
  // useEffect(() => {
  //   if (isPlaying) {
  //     if (intervalRef.current) clearInterval(intervalRef.current);

  //     intervalRef.current = setInterval(() => {
  //       setPosition(prev => {
  //         const next = prev + 1;
  //         setTimer(next);
  //         return next;
  //       });
  //     }, 1000);
  //   } else {
  //     clearInterval(intervalRef.current);
  //   }

  //   return () => {
  //     clearInterval(intervalRef.current);
  //   };
  // }, [isPlaying]);
  useEffect(() => {
    if (
      isPlaying &&
      isPlayerReady &&
      initialLoadDone &&
      isConnected
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setPosition(prev => {
          const next = prev + 1;
          setTimer(next);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    isPlaying,
    isPlayerReady,
    initialLoadDone,
    isConnected,
  ]);

  useEffect(() => {
    if (position >= musicTime) {
      clearInterval(intervalRef.current);
      try {
        stopMusic('player1');
        stopMusic('player2');
        setIsPlaying(false);
        setTtsOpen(false);
        seekTo(0);
        setPosition(0);
      } catch (err) {
        console.warn('Error stopping music:', err);
      }
    }
  }, [position, musicTime]);
  useEffect(() => {
    if (onUpdateTime) {
      onUpdateTime(position);
    }
  }, [position]);

  useEffect(() => {
    totalDUration(duration.player2);
  }, [duration.player2]);

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressWidth =
    musicTime > 0 ? (position / musicTime) * width * 0.75 : 0;

  const loadSongAndCheckReady = async (songPath, playerKey) => {
    try {
      await playMusic(playerKey); // you might need to use `setCustomSong` if applicable
      setIsPlayerReady(true);
      setInitialLoadDone(true);
    } catch (err) {
      console.error('Error loading song:', err);
      setIsPlayerReady(false);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      pauseMusic('player1');
      pauseMusic('player2');
      setTtsOpen(false);
      clearInterval(intervalRef.current);
    } else {
      if (position >= musicTime) {
        seekTo(0);
        setPosition(0);
      }

      if (!initialLoadDone) {
        setIsLoadingMusic(true); // 👈 Start loading
        setIsPlayerReady(false);

        await loadSongAndCheckReady(data?.lyrics_path, 'player2');
        setIsLoadingMusic(false); // 👈 Done loading
        setIsPlaying(true);
      } else {
        if (musicPlay) {
          playMusic('player1');
        }
        playMusic('player2');
        setTtsOpen(true);
      }
    }

    setIsPlaying(!isPlaying);
  };
  // const handlePlayPause = () => {
  //   if (isPlaying) {
  //     pauseMusic('player1');
  //     pauseMusic('player2');
  //     setTtsOpen(false);
  //     clearInterval(intervalRef.current);
  //   } else {
  //     if (position >= musicTime) {
  //       seekTo(0);
  //       setPosition(0);
  //     }
  //     if (musicPlay) {
  //       playMusic('player1');
  //     }
  //     playMusic('player2');
  //     setTtsOpen(true);
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  return (
    <View style={styles.container}>
      {/* Time Row */}
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

      {/* <ActivityLoader visible={isLoadingMusic} /> */}
      <ActivityLoader visible={!isConnected || (!isPlayerReady && isPlaying)} />
      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.iconCircle}></View>

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
            if (musicPlay) {
              pauseMusic('player1');
            } else {
              playMusic('player1');
            }
            setMusicPlay(!musicPlay);
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRow: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#3B4F2C',
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
  icon: {
    width: 45,
    height: 45,
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
});

export default ProgressBar;
