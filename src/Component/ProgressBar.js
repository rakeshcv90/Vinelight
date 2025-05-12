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
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const ProgressBar = ({duration, type}) => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const progressWidth = (position / duration) * 300;

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);


  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      // Play
      intervalRef.current = setInterval(() => {
        setPosition(prev => {
          if (prev < duration) return prev + 1;
          clearInterval(intervalRef.current);
          return duration;
        });
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <View style={styles.container}>
      {/* Time Row */}
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
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
        {type == 'Custom' ? (
          <>
            <View style={styles.iconCircle} >
              {/* <Image
                resizeMode="contain"
                source={IconData.SPEAK}
                style={styles.icon}
              /> */}
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
            <Image
              resizeMode="contain"
              source={IconData.SPEAK}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}

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

        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
          <Image
            source={IconData.MUSIC}
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
    // backgroundColor: '#E8E0CE',
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
  slider: {
    width: '85%',
    height: 10,
    borderRadius: 20,
    backgroundColor: '#E8E0CE',
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
