// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import React, {use, useEffect, useRef, useState} from 'react';
// import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
// import * as Progress from 'react-native-progress';
// import LinearGradient from 'react-native-linear-gradient';
// import useNativeMusicPlayer from './NativeusicPlayer';

// const {width} = Dimensions.get('window');
// const ProgressBar = ({
//   type,
//   data,
//   defaultMusic,
//   setDefaultMusic,
//   onUpdateTime,
//   pauseSound,
// }) => {
//   const [position, setPosition] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const intervalRef = useRef(null);
//   const scrollRef = useRef();
//   const plainText = data?.description;

//   useEffect(() => {
//     return () => clearInterval(intervalRef.current);
//   }, []);
//   const {
//     pauseMusic,
//     playMusic,
//     releaseMusic,
//     stopMusic,
//     seekTo,
//     duration,
//     currentTime,
//   } = useNativeMusicPlayer({
//     song: defaultMusic ? data?.lyrics_path : data?.music_path,
//     pause: isPlaying,
//     getSoundOffOn: true,
//     restStart: false,
//   });

//   useEffect(() => {
//   if (defaultMusic) {
//     if (onUpdateTime) {
//       onUpdateTime(currentTime);
//     }
//     setPosition(currentTime);
//   }
// }, [currentTime, onUpdateTime, defaultMusic]);
//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       clearInterval(intervalRef.current);
//       releaseMusic(); // Clean up the music player
//     };
//   }, [defaultMusic]);
//   const formatTime = sec => {
//     const mins = Math.floor(sec / 60);
//     const secs = Math.floor(sec % 60);
//     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };
//   const progressWidth = (position / duration) * 300;
//   const handlePlayPause = () => {
//     if (isPlaying) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     } else {
//       intervalRef.current = setInterval(() => {
//         setPosition(prev => {
//           const next = prev + 1;
//           // if (onUpdateTime) onUpdateTime(next); // ✅ update parent
//           if (next < duration) return next;
//           clearInterval(intervalRef.current);
//           return duration;
//         });
//       }, 1000);
//     }
//     setIsPlaying(!isPlaying);
//   };
//   const lines = plainText.trim().split('\n');

//   const lineDuration = duration / lines?.length;

//   const lyrics = lines.map((text, i) => ({
//     time: Math.floor(i * lineDuration),
//     text,
//   }));
//   useEffect(() => {
//     if (pauseSound) {
//       pauseMusic();
//     }
//   }, [pauseSound, pauseMusic]);
//   return (
//     <View style={styles.container}>
//       {/* Time Row */}
//       <View style={styles.timeRow}>
//         <Text style={styles.timeText}>{formatTime(position)}</Text>
//         <Text style={styles.timeText}>{formatTime(duration)}</Text>
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
//         <TouchableOpacity
//           style={styles.iconCircle}
//           activeOpacity={0.7}
//           onPress={() => {
//             setDefaultMusic(true);
//           }}>
//           <Image
//             resizeMode="contain"
//             source={defaultMusic ? IconData.SPEAK : IconData.SPEAKCLOSE}
//             style={styles.icon}
//           />
//         </TouchableOpacity>

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
//             setDefaultMusic(false);
//           }}>
//           <Image
//             source={defaultMusic ? IconData.MUSICCLOSE : IconData.MUSIC}
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

// export default ProgressBar;

import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, IconData, PLATFORM_IOS} from '../../assets/Image';
import LinearGradient from 'react-native-linear-gradient';
import useNativeMusicPlayer from './NativeusicPlayer';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

const ProgressBar = ({
  type,
  data,
  defaultMusic,
  setDefaultMusic,
  onUpdateTime,
  pauseSound,
  stopMusic,
  ttsOpen,
  setTtsOpen,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const medatationData = useSelector(
    state => state?.user?.advanceMeditationData,
  );
  const {pauseMusic, playMusic, releaseMusic, seekTo, duration, currentTime} =
    useNativeMusicPlayer({
      song1: medatationData?.data,
      // song1:
      //   'https://arkanaapps.com/crm/public/storage/lyrics/djfm5uGpAroCNoEUbuRBagVHEtRoOg3ThxV8qmnl.mp3', // Plays alongside
      pause: isPlaying,
      getSoundOffOn: true,
      restStart: false,
    });

  useEffect(() => {
    if (pauseSound) {
      pauseMusic('player1');
    }
  }, [pauseSound, pauseMusic]);

  useEffect(() => {
    return () => {
      releaseMusic();
    };
  }, []);

  useEffect(() => {
    if (onUpdateTime) {
      onUpdateTime(currentTime.player1);
    }
  }, [currentTime.player1]);

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressWidth =
    duration.player1 > 0 ? (currentTime.player1 / duration.player1) * 300 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMusic('player1');
    } else {
      playMusic('player1');
      playMusic('player2');
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Time Row */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(currentTime.player1)}</Text>
        <Text style={styles.timeText}>{formatTime(duration.player1)}</Text>
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

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={() => setTtsOpen(!ttsOpen)}>
          <Image
            resizeMode="contain"
            source={ttsOpen ? IconData.SPEAK : IconData.SPEAKCLOSE}
            style={styles.icon}
          />
        </TouchableOpacity>

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
              pauseMusic('player1');
            } else {
              playMusic('player1');
            }
            setIsPlaying(!isPlaying);
          }}>
          <Image
            source={isPlaying ? IconData.MUSICCLOSE : IconData.MUSIC}
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

export default ProgressBar;
