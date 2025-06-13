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
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {deleteCustomMeditation} from '../../redux/actions';
const {width, height} = Dimensions.get('window');
const Meditation = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meditationData = useSelector(state => state?.user?.meditationdata);
  const customMeditation = useSelector(state => state?.user?.customeMedidation);

  const [selectedHeader, setSelectedHeader] = useState(0);
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
          <Text style={styles.description} numberOfLines={3}>
            {item?.description}
          </Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              navigation.navigate('MeditationPlayer', {itemData: item});
            }}
            >
            <Text style={styles.icon}>▶</Text>
          </TouchableOpacity>
          {/* <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {formatDuration(item?.time)}
            </Text>
          </View> */}
        </View>
      </View>
    );
  };
  const renderItem1 = ({item, index}) => {

    console.log("dddddd",item)
    // const timeKeys = ['pre', 'med', 'int', 'end', 'res'];
    // let totalSeconds = 0;

    // timeKeys.forEach(key => {
    //   const section = item[key];
    //   if (section) {
    //     const min = parseInt(section.minute || '0', 10);
    //     const sec = parseInt(section.second || '0', 10);
    //     totalSeconds += min * 60 + sec;
    //   }
    // });
   
    // const formatDuration = totalSeconds => {
    //   const minutes = Math.floor(totalSeconds / 60);
    //   const seconds = totalSeconds % 60;
    //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    // };
    const totalMinutes = parseInt(item?.timeData?.med?.minute) + parseInt(item?.timeData?.med?.second) / 60;

    return (
      <View style={styles.card}>
        <View style={styles.rightSide}>
          <TouchableOpacity
            // style={styles.playButton}
            onPress={() => {
              navigation.navigate('AdvanceMediaPlayer', {itemData: item?.timeData,});
            }}>
              <Image
                source={ImageData.PLAYBUTTON}
                style={{width: 40, height: 40}}
              />
            {/* <Text style={styles.icon}>▶</Text> */}

              {console.log("time data", totalMinutes)}
      
          </TouchableOpacity>

          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
            {totalMinutes} Mins
            </Text>
          </View>

        </View>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.title}> {item?.timeData?.user?.name}</Text>
            <TouchableOpacity
              onPress={() => dispatch(deleteCustomMeditation(item?.id))}>
              <Image
                source={IconData.DELETE}
                style={{width: 20, height: 20}}
                tintColor={Color.LIGHTGREEN}
              />
            </TouchableOpacity>
          </View>

          {/* <Text style={styles.description} numberOfLines={3}>
           Meditation is created by user
          </Text> */}
        </View>
      </View>
    );
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 100,
        }}>
        <Image
          source={IconData.NODATA}
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
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: '30%',
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
                top: -height * 0.055,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subText}>Meditations</Text>
            </View>
            <View
              style={{
                width: '75%',
                height: '9%',
                flexDirection: 'row',
                top: -height * 0.045,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Color.BROWN4,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Color.BROWN2,
                gap: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedHeader(0);
                }}
                activeOpacity={0.7}
                style={{
                  width: '47%',
                  height: '85%',
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    selectedHeader == 0 ? Color.BROWN3 : 'transparent',
                  borderRadius: selectedHeader == 0 ? 10 : 0,
                  borderWidth: selectedHeader == 0 ? 2 : 0,
                  borderColor:
                    selectedHeader == 0 ? Color.BROWN2 : 'transparent',
                }}>
                <Image
                  source={IconData.GLOVE}
                  style={{width: 16, height: 16}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Font.EB_Garamond,
                    lineHeight: 24,
                    color: Color.LIGHTGREEN,
                  }}>
                  Guided
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedHeader(1);
                }}
                activeOpacity={0.7}
                style={{
                  width: '47%',
                  height: '85%',
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    selectedHeader == 1 ? Color.BROWN3 : 'transparent',
                  borderRadius: selectedHeader == 1 ? 10 : 0,
                  borderWidth: selectedHeader == 1 ? 2 : 0,
                  borderColor:
                    selectedHeader == 1 ? Color.BROWN2 : 'transparent',
                }}>
                <Image
                  source={IconData.DRIVE}
                  style={{width: 16, height: 16}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Font.EB_Garamond,
                    lineHeight: 24,
                    color: Color.LIGHTGREEN,
                  }}>
                  Custom
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '96%',
                height: '63%',
                alignSelf: 'center',
                top: -height * 0.04,
              }}>
              <FlatList
                data={selectedHeader == 0 ? meditationData : customMeditation}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
                ListEmptyComponent={emptyComponent}
                renderItem={selectedHeader == 0 ? renderItem : renderItem1}
              />
            </View>
            <View
              style={{
                width: '96%',
                height: '1%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',

                flexDirection: 'row',
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

                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <FastImage
                source={ImageData.BACKLEFT}
                resizeMode="contain"
                style={{
                  width: 31,
                  height: 31,
                }}
              />

              <FastImage
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
    paddingLeft: 12,
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
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 5,
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
