import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('window');
const Meditation = () => {
  const navigation = useNavigation();

  const meditationData = useSelector(state => state?.user?.meditationdata);
;
  const data = [
    {
      id: 1,
      title: 'Body Scan',
      description:
        'The body scan is a practice of noticing.We’re not trying to fix or change anything - just becoming aware.',
      timer: '15 Min',
    },
    {
      id: 2,
      title: 'Meditation #2',
      description:
        'The body scan is a practice of noticing.We’re not trying to fix or change anything - just becoming aware.',
      timer: '15 Min',
    },
    {
      id: 3,
      title: 'Meditation #3',
      description:
        'The body scan is a practice of noticing.We’re not trying to fix or change anything - just becoming aware.',
      timer: '15 Min',
    },
    {
      id: 4,
      title: 'Meditation #4',
      description:
        'The body scan is a practice of noticing.We’re not trying to fix or change anything - just becoming aware.',
      timer: '15 Min',
    },
  ];
  const renderItem = ({item, index}) => {
  const formatDuration = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
    return (
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>{item?.name}</Text>
          <Text style={styles.description} numberOfLines={3}>{item?.description}</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              navigation.navigate('MeditationPlayer', {itemData: item});
            }}>
            <Text style={styles.icon}>▶</Text>
          </TouchableOpacity>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(item?.time)}</Text>
            
          </View>
        </View>
      </View>
    );
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Image
          source={IconData.CALENDER}
          resizeMode="contain"
          style={{
            width: width * 0.3,
            height: height * 0.15,
          }}
        />
      </View>
    );
  };
  const memoizedBackground = useMemo(() => ImageData.MAINBACKGROUND, []);
  return (
    <View style={styles.secondaryContainer}>
      <FastImage
        source={memoizedBackground}
        style={styles.secondaryBackground}
        resizeMode={FastImage.resizeMode.stretch}>
        <View
          style={{
            width: '100%',
            // height: '76%',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '35%',
          }}>
          <View
            style={{
              width: '90%',
              // height: '100%',
              marginTop: '5%',
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
                height: '7%',

                 top: -height * 0.035,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subText}>Meditations</Text>
            </View>

            <View
              style={{
                width: '96%',
                height: '75%',

                alignSelf: 'center',
                // top: -20,
              }}>
              <FlatList
                data={meditationData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
                ListEmptyComponent={emptyComponent}
                renderItem={renderItem}
              />
            </View>
            <View
              style={{
                width: '100%',
                // height: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                // paddingBottom: height * 0.01,
                top: -15,
              }}>
              <Button2
                width={250}
                height={50}
                buttonTitle={'Meditation Timer'}
                img={IconData.PLUS}
                left={true}
                size={20}
                onPress={() => navigation.navigate('CustomMeditation')}
              />
            </View>
            <View
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                paddingBottom: height * 0.075,

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
  );
};

export default Meditation;

const styles = StyleSheet.create({
  secondaryContainer: {
    width: '90%',
    height: '85%',
  },
  secondaryBackground: {
    width: '100%',
    height: '100%',
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Color.BROWN3,
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 13,
    paddingBottom: 8,
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 1,
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
    lineHeight: 24,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: Color.BROWN5,
    fontFamily: Font.EBGaramond_Regular,
    lineHeight: 24,
  },
  rightSide: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Color.BROWN4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  durationBadge: {
    backgroundColor: Color.LIGHTBROWN2,
    paddingLeft: 6,
    paddingRight: 6,
    gap: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  icon: {
    fontSize: 20,
    color: '#3C4A35',
    fontWeight: 'bold',
  },
});
