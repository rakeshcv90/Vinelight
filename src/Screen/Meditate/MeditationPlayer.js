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
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import ProgressBar from '../../Component/ProgressBar';
import NativeusicPlayer from '../../Component/NativeusicPlayer';

const {width, height} = Dimensions.get('window');

const MeditationPlayer = ({route, navigation}) => {
  const [defaultMusic, setDefaultMusic] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [pauseSound, setPauseSound] = useState(false);
  const scrollRef = useRef();

  const handleUpdateTime = useCallback(time => {
    setCurrentTime(time);
  }, []);

  const description = route?.params?.itemData?.description || '';
  const cleanDescription = description.replace(/\s+/g, ' ').trim();
  const words = cleanDescription.split(' ');
  const estimatedDuration = route?.params?.itemData?.time * 60 || 60;
  const totalWeight = words.reduce((sum, word) => sum + word.length, 0);

  let cumulativeTime = 0;
  const timedWords = words.map(word => {
    const wordTime = (word.length / totalWeight) * estimatedDuration;
    const item = {word, time: cumulativeTime};
    cumulativeTime += wordTime;
    return item;
  });

  const activeWordIndex = timedWords.findIndex(
    (item, i) =>
      currentTime >= item.time &&
      (i === timedWords.length - 1 || currentTime < timedWords[i + 1].time),
  );

  useEffect(() => {
    if (scrollRef.current && activeWordIndex !== -1) {
      scrollRef.current.scrollTo({
        y: Math.floor(activeWordIndex / 5) * 40,
        animated: true,
      });
    }
  }, [activeWordIndex]);

  // const description = route?.params?.itemData?.description || '';
  // const cleanDescription = description.replace(/\s+/g, ' ').trim();
  // const words = cleanDescription.split(' ');
  // const estimatedDuration = route?.params?.itemData?.time * 60 || 60;

  // const timedCharacters = [];
  // let charIndex = 0;
  // let cumulativeTime = 0;
  // const totalChars = cleanDescription.replace(/\s/g, '').length;

  // words.forEach((word, wordIndex) => {
  //   const wordDuration = (word.length / totalChars) * estimatedDuration;
  //   const charDuration = wordDuration / word.length;
  //   for (let i = 0; i < word.length; i++) {
  //     timedCharacters.push({
  //       char: word[i],
  //       time: cumulativeTime + i * charDuration,
  //       wordIndex,
  //     });
  //   }
  //   // Add space as a character
  //   timedCharacters.push({
  //     char: ' ',
  //     time: cumulativeTime + word.length * charDuration,
  //     wordIndex,
  //   });
  //   cumulativeTime += wordDuration;
  // });

  // const activeCharIndex = timedCharacters.findIndex(
  //   (item, i) =>
  //     currentTime >= item.time &&
  //     (i === timedCharacters.length - 1 ||
  //       currentTime < timedCharacters[i + 1].time),
  // );

  // const activeWordIndex = timedCharacters[activeCharIndex]?.wordIndex || 0;

  // useEffect(() => {
  //   if (scrollRef.current && activeCharIndex !== -1) {
  //     scrollRef.current.scrollTo({
  //       y: Math.floor(activeCharIndex / 40) * 40,
  //       animated: true,
  //     });
  //   }
  // }, [activeCharIndex]);

  const formatDuration = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
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
          <TouchableOpacity
            onPress={() => {
              setPauseSound(true);
              navigation.goBack();
              // setIsPlaying(false);
              // pauseMusic();
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
                    top: -height * 0.065,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subText}>
                    {route?.params?.itemData?.name}
                  </Text>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {formatDuration(route?.params?.itemData?.time)} Min
                    </Text>
                  </View>
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
                  <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{paddingBottom: 10}}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.textBlock}>
                      {timedWords.map((item, index) => (
                        <Text
                          key={index}
                          style={{
                            color:
                              index === activeWordIndex
                                ? Color.LIGHTGREEN
                                : index < activeWordIndex
                                ? Color.LIGHTGREEN
                                : '#60723E',
                            fontFamily:
                              index === activeWordIndex
                                ? Font.EBGaramond_SemiBold
                                : Font.EBGaramond_Regular,
                          }}>
                          {item.word + ' '}
                        </Text>
                      ))}
                    </Text>
                  </ScrollView>
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
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 24,
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
});
