import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';
import {useDispatch, useSelector} from 'react-redux';

import Meditation from './Meditate/Meditation';
import Home from './Home/Home';
import Journal from './Journal/Journal';
import Dreams from './Dreams/Dreams';
import Ceremony from './Ceremony/Ceremony';
import Goal from './Goal/Goal';
import {useRoute} from '@react-navigation/native';
import {Api} from '../Api';
import {callApi1} from '../Component/ApiCall';
import {setCoupanDetails} from '../redux/actions';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const MainPage = ({navigation, route}) => {
  const dispatch = useDispatch();
  const appliedCoupanDetails = useSelector(
    state => state?.user?.appliedCoupanDetails,
  );
  const [activeTab, setActiveTab] = useState(
    route?.params?.initialTab || 'Home',
  );
  useEffect(() => {
    fetchData2();
  }, [activeTab]);
  const userInfo = useSelector(state => state?.user?.userInfo);

  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route?.params?.initialTab]);
  const fetchData2 = async () => {
    try {
      if (!appliedCoupanDetails?.length) {
        dispatch(setCoupanDetails([]));
        return;
      }
      const data3 = await callApi1(
        `${Api.COUPAN_STATUS}/${appliedCoupanDetails[0]?.user_code}`,
      );
      if (data3?.status === true) {
        dispatch(setCoupanDetails(data3?.data));
      } else {
        dispatch(setCoupanDetails([]));
      }
    } catch (error) {
      console.error('Coupan Details Erray', error);
    }
  };
  const tabs = [
    {key: 'Home', activeIcon: IconData?.HOMEA},
    {key: 'Journal', activeIcon: IconData?.JOURNALA},
    {key: 'Dreams', activeIcon: IconData?.DREAMA},
    {key: 'Meditate', activeIcon: IconData?.MEDITATIONA},
    {key: 'Ceremony', activeIcon: IconData?.CEREMONYA},
    {key: 'Goal', activeIcon: IconData?.GOALA},
  ];

  return (
    <>
      <>
        <ImageBackground
          source={ImageData.BACKGROUND}
          style={{flex: 1}}
          resizeMode="cover">
          <SafeAreaView style={styles.container}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />

            <ImageBackground
              source={ImageData.BACKGROUND}
              style={styles.primaryBackground}
              resizeMode="cover">
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={[styles.profileBtn, {top: height * 0.02}]}>
                <Image
                  source={
                    userInfo?.photo?.base64
                      ? {
                          uri: `data:${userInfo.photo.type};base64,${userInfo.photo.base64}`,
                        }
                      : userInfo?.photo?.uri
                      ? {uri: userInfo.photo.uri}
                      : ImageData.NOIMAGE
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>

              {activeTab === 'Home' ? (
                <Home isActive={activeTab === 'Home'} />
              ) : activeTab === 'Journal' ? (
                <Journal isActive={activeTab === 'Journal'} />
              ) : activeTab === 'Dreams' ? (
                <Dreams isActive={activeTab === 'Dreams'} />
              ) : activeTab === 'Ceremony' ? (
                <Ceremony isActive={activeTab === 'Ceremony'} />
              ) : activeTab === 'Goal' ? (
                <Goal isActive={activeTab === 'Goal'} />
              ) : (
                <Meditation isActive={activeTab === 'Meditate'} />
              )}

              <View style={[styles.tabBarWrapper, {bottom: height * 0.005}]}>
                <ImageBackground
                  source={ImageData.TABBACKGROUND}
                  style={styles.thirdBackground}
                  resizeMode="stretch">
                  <View style={styles.tabRow}>
                    {tabs.map(tab => {
                      const isActive = tab.key === activeTab;
                      return (
                        <TouchableOpacity
                          activeOpacity={0.5}
                          key={tab.key}
                          style={styles.tabButton}
                          onPress={() => setActiveTab(tab.key)}>
                          <Image
                            source={tab.activeIcon}
                            resizeMode="contain"
                            tintColor={isActive ? Color.BROWN4 : 'white'}
                            style={{width: 24, height: 24}}
                          />
                          <View style={styles.labelContainer}>
                            <Text
                              style={[
                                styles.labelText,
                                isActive && styles.activeLabelText,
                              ]}>
                              {tab.key}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ImageBackground>
              </View>
            </ImageBackground>
          </SafeAreaView>
        </ImageBackground>
      </>
      {/* )} */}
    </>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 60,
    height: 60,
    zIndex: 1,
    borderRadius: 30,
    borderColor: Color.BROWN2,
    borderWidth: 1,
    padding: 10,
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    zIndex: 1,
    borderColor: Color.BROWN4,
  },
  tabBarWrapper: {
    width: '95%',
    height: 64,
    position: 'absolute',
    bottom: height * 0.02,
    alignSelf: 'center',
    zIndex: 1,
  },
  thirdBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.02,
  },
  labelContainer: {
    marginTop: 4,
    minHeight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 12,
    color: '#d9d9d9',
    fontFamily: Font.EBGaramond_SemiBold,

    textAlign: 'center',
  },
  activeLabelText: {
    fontSize: 12,
    color: Color.BROWN4,
    fontFamily: Font.EBGaramond_SemiBold,

    textAlign: 'center',
  },
});
