import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ImageData} from '../../assets/Image';
import {storage} from '../Component/Storage';

const Splash = ({navigation}) => {
  const scaleAnim = useRef(new Animated.Value(0.72)).current; // Start invisible (scale 0)
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start transparent
  const storedUserString = storage.getString('userInfo');
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1, // Full size
          duration: 2000, // Slower zoom (2 sec)
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fully visible
          duration: 2000, // Same as zoom duration
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (storedUserString) {
          navigation.replace('MainPage');
        } else navigation.replace('Intro');
      });
    }, 500); // Optional: 0.5s delay before animation starts

    return () => clearTimeout(timeout);
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={ImageData.BACKGROUND}
        style={styles.imageBackground}
        resizeMode="cover">
        <Animated.Image
          source={ImageData.SPLASHLOGO}
          style={[
            styles.image,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}
          resizeMode="contain"
        />
      </ImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});
