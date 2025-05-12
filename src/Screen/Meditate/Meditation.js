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
import React from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
const Meditation = () => {
  const navigation = useNavigation(); // ✅ Fix here
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
    return (
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.description}>{item?.description}</Text>
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
            <Text style={styles.durationText}>{item?.timer}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
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
          }}>
          <View
            style={{
              width: '90%',
              height: '100%',
              alignItems: 'center',
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

                top: -35,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subText}>Meditations</Text>
            </View>

            <View
              style={{
                width: '96%',
                height: '63%',

                alignSelf: 'center',
                top: -20,
              }}>
              <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
                //   ListEmptyComponent={emptyComponent}
                renderItem={renderItem}
              />
            </View>
            <View
              style={{
                width: '100%',
                height: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                top: 10,
              }}>
              <Button2
                width={300}
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
