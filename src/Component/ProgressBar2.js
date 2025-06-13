// import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';
// import {useSelector} from 'react-redux';

// const ProgressBar2 = ({musicTime, pauseSound}) => {
//   const musicTimer = musicTime * 60;
//   const medatationData = useSelector(
//     state => state?.user?.advanceMeditationData,
//   );

//   const [isMuted, setIsMuted] = useState(false);
//   const [position, setPosition] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const intervalRef = useRef(null);

//   const {
//     pauseMusic,
//     playMusic,
//     releaseMusic,
//     stopMusic,
//     seekTo,
//     setVolume,
//     duration,
//     currentTime,
//   } = useNativeMusicPlayer({
//     song1: medatationData?.data,
//     pause: isPlaying,
//     getSoundOffOn: true,
//     restStart: false,
//   });
//   useEffect(() => {
//     return () => clearInterval(intervalRef.current);
//   }, []);

//   const formatTime = sec => {
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const startTimer = () => {
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setPosition(prev => {
//         const next = prev + 1;
//         if (next >= musicTimer) {
//           clearInterval(intervalRef.current);
//           stopMusic(); // stop or pause
//           setIsPlaying(false);
//           return musicTimer;
//         }
//         return next;
//       });
//     }, 1000);
//   };
//   useEffect(() => {
//     setPosition(currentTime.player1 || 0);
//   }, [currentTime.player1]);
//   const handlePlayPause = () => {
//     if (isPlaying) {
//       pauseMusic('player1')
//       clearInterval(intervalRef.current);
//     } else {
//       if (position >= musicTimer) {
//         seekTo(0); // restart from beginning
//         setPosition(0);
//       }
//       playMusic();
//       startTimer();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   // const progressWidth = (position / musicTimer) * 300;
//   const progressWidth =
//   musicTimer > 0 ? (position / musicTimer) * 300 : 0;

//   console.log("cxvcxvcxvcxvxcvcx",position,musicTimer)
//   // const progressWidth =
//   //   duration.player1 > 0 ? (currentTime.player1 / duration.player1) * 300 : 0;
//   useEffect(() => {
//     if (pauseSound) {
//       pauseMusic('player1')
//       setIsMuted(false);
//     }
//   }, [pauseSound, pauseMusic]);
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
//       {/* Controls */}
//       <View style={styles.controls}>
//         <View style={styles.iconCircle} activeOpacity={0.7}></View>

//         <TouchableOpacity
//           style={styles.mainCircle}
//           activeOpacity={0.7}
//           onPress={handlePlayPause}>
//           <Image
//             source={!isPlaying ? IconData.PAUSE : IconData.PLAY}
//             style={styles.playIcon}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.iconCircle}
//           activeOpacity={0.7}></TouchableOpacity>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     // backgroundColor: '#E8E0CE',
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
//   slider: {
//     width: '85%',
//     height: 10,
//     borderRadius: 20,
//     backgroundColor: '#E8E0CE',
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

// export default ProgressBar2;
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
import LinearGradient from 'react-native-linear-gradient';
import useNativeMusicPlayer from './NativeusicPlayer';
import {useSelector} from 'react-redux';

const ProgressBar2 = ({musicTime, pauseSound}) => {
  const musicTimer = musicTime * 60; // Convert minutes to seconds
  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );
 
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    pauseMusic,
    playMusic,
    stopMusic,
    seekTo,
    currentTime,
  } = useNativeMusicPlayer({
    song1: medatationData?.data,
    pause: isPlaying,
    getSoundOffOn: true,
    restStart: false,
  });


  useEffect(() => {
    setPosition(currentTime.player1 || 0);
  }, [currentTime.player1]);


  useEffect(() => {
    if (currentTime.player1 >= musicTimer) {
      stopMusic();
      setIsPlaying(false);
      seekTo(0); 
    }
  }, [currentTime.player1,]);

  // Pause from parent
  useEffect(() => {
    if (pauseSound) {
      pauseMusic('player1');
      setIsPlaying(false);
    }
  }, [pauseSound]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMusic('player1');
    } else {
      if (position >= musicTimer) {
        seekTo(0);
        setPosition(0);
      }
      playMusic('player1');
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressWidth = musicTimer > 0 ? (position / musicTimer) * 300 : 0;

  return (
    <View style={styles.container}>
      {/* Time Row */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(musicTimer)}</Text>
      </View>

      {/* Progress Bar */}
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

      {console.log("isPlaying",isPlaying)}
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
        <View style={styles.iconCircle} />
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
  playIcon: {
    width: 55,
    height: 55,
  },
  progressWrapper: {
    width: 300,
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

export default ProgressBar2;
