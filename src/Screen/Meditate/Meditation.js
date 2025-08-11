import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {deleteCustomMeditation} from '../../redux/actions';
import {Consumer} from 'react-native-paper/lib/typescript/core/settings';
import Toast from 'react-native-toast-message';
import {isCoupanValid, isSubscriptionValid} from '../utils';
import NetInfo from '@react-native-community/netinfo';
const {width, height} = Dimensions.get('window');
const Meditation = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const meditationData = useSelector(state => state?.user?.meditationdata);
  const customMeditation = useSelector(state => state?.user?.customeMedidation);
  const subscription = useSelector(state => state?.user?.subscription);
  const coupaDetails = useSelector(state => state?.user?.coupaDetails);
  const [selectedHeader, setSelectedHeader] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const renderItem = ({item, index}) => {
    const formatDuration = totalSeconds => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    return (
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={[styles.title, {width: width * 0.55}]}>
            {item?.name}
          </Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              if (item?.lyrics_path == null) {
                Toast.show({
                  type: 'custom',
                  position: 'top',
                  props: {
                    icon: IconData.ERR, // your custom image
                    text: 'There are no songs to play.',
                  },
                });
              } else {
                if (isConnected) {
                  navigation.navigate('MeditationPlayer', {itemData: item});
                } else {
                  Toast.show({
                    type: 'custom',
                    position: 'top',
                    props: {
                      icon: IconData.ERR,
                      text: 'Poor internet connection or not working',
                    },
                  });
                }
              }

              //
            }}>
            <Image
              source={ImageData.PLAYBUTTON}
              style={{width: 40, height: 40}}
              tintColor={Color.blue}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderItem1 = ({item, index}) => {
    const totalMinutes =
      parseInt(item?.timeData?.med?.minute) +
      parseInt(item?.timeData?.med?.second) / 60;

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <View
            style={{
              //  width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                if (isConnected) {
                  navigation.navigate('AdvanceMediaPlayer', {
                    itemData: item?.timeData,
                  });
                } else {
                  Toast.show({
                    type: 'custom',
                    position: 'top',
                    props: {
                      icon: IconData.ERR,
                      text: 'Poor internet connection or not working',
                    },
                  });
                }
              }}>
              <Image
                source={ImageData.PLAYBUTTON}
                tintColor={Color.blue}
                style={{width: 40, height: 40, justifyContent: 'center'}}
              />
            </TouchableOpacity>
            <Text style={[styles.title, {width: width * 0.55}]}>
              {' '}
              {item?.timeData?.user?.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => dispatch(deleteCustomMeditation(item?.id))}>
            <Image
              source={IconData.DELETE}
              style={{width: 20, height: 20}}
              tintColor={Color.LIGHTGREEN}
            />
          </TouchableOpacity>
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
          gap: 30,
        }}>
        <Image
          source={IconData.NODATA}
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: height * 0.2,
            marginTop: height * 0.03,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontFamily: Font.EBGaramond_SemiBold,
            color: Color.LIGHTGREEN,
            textAlign: 'center',
          }}>
          No meditation data available.
        </Text>
      </View>
    );
  };
  const memoizedBackground = useMemo(() => ImageData.MAINBACKGROUND, []);
  return (
    <View
      style={[
        styles.secondaryContainer,
        {height: Platform.OS == 'android' && height >= 780 ? '90%' : '85%'},
      ]}>
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
                tintColor={Color.blue}
                resizeMode={FastImage.resizeMode.contain}
                style={{width: 31, height: 31}}
              />
              <FastImage
                source={ImageData.RIGHT}
                tintColor={Color.blue}
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
            {(isSubscriptionValid(subscription) ||
              isCoupanValid(coupaDetails)) && (
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
                    tintColor={Color.blue}
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
                    tintColor={Color.blue}
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
            )}
            {isSubscriptionValid(subscription) ||
            isCoupanValid(coupaDetails) ? (
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
            ) : (
              <View
                style={{
                  width: '96%',
                  height: '72%',
                  alignSelf: 'center',
                  top: -height * 0.04,
                }}>
                <FlatList
                  data={customMeditation}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 20}}
                  ListEmptyComponent={emptyComponent}
                  renderItem={renderItem1}
                />
              </View>
            )}
            <View
              style={{
                width: '96%',
                height: '1%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',

                top:
                  Platform.OS == 'ios'
                    ? height * 0.011
                    : height >= 780
                    ? -height * 0.005
                    : height * 0.01,
                flexDirection: 'row',
              }}>
              <Button2
                width={280}
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
                tintColor={Color.blue}
                resizeMode="contain"
                style={{
                  width: 31,
                  height: 31,
                }}
              />

              <FastImage
                source={ImageData.BACKRIGHT}
                tintColor={Color.blue}
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
    backgroundColor: '#D5B0FF',
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  content: {
    flex: 1,
    // paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    // justifyContent: 'flex-start',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#671AAF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  durationBadge: {
    alignItems: 'center',
    // justifyContent: 'flex-start',
    gap: 5,
    flexDirection: 'row',
    marginTop: 5,
  },
  durationText: {
    fontSize: 14,
    color: '#A37F53',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  icon: {
    fontSize: 20,
    color: '#3C4A35',
    fontWeight: 'bold',
  },
});
