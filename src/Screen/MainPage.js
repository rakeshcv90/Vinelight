import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';

import {useSelector} from 'react-redux';

import Meditation from './Meditate/Meditation';
import Home from './Home/Home';
import Journal from './Journal/Journal';
import Dreams from './Dreams/Dreams';
import Ceremony from './Ceremony/Ceremony';
import Goal from './Goal/Goal';
import {useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const MainPage = ({navigation,route}) => {
  // const [activeTab, setActiveTab] = useState('Home');
  const [activeTab, setActiveTab] = useState(route?.params?.initialTab || 'Home');

  const userInfo = useSelector(state => state?.user?.userInfo);
  useEffect(() => {
    if (route?.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route?.params?.initialTab]);
  
  const tabs = [
    {key: 'Home', activeIcon: IconData?.HOMEA},
    {
      key: 'Journal',

      activeIcon: IconData?.JOURNALA,
    },
    {
      key: 'Dreams',

      activeIcon: IconData?.DREAMA,
    },
    {
      key: 'Meditate',

      activeIcon: IconData?.MEDITATIONA,
    },
    {
      key: 'Ceremony',

      activeIcon: IconData?.CEREMONYA,
    },
    {key: 'Goal', activeIcon: IconData?.GOALA},
  ];
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
          style={{
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
          }}>
          {/* <Image
            source={userInfo ? {uri: userInfo?.photo?.uri} : ImageData?.NOIMAGE}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              zIndex: 1,
              borderColor: Color.BROWN4,
            }}
          /> */}
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
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              zIndex: 1,
              borderColor: Color.BROWN4,
            }}
          />
        </TouchableOpacity>
        {activeTab === 'Home' ? (
          <Home />
        ) : activeTab === 'Journal' ? (
          <Journal />
        ) : activeTab === 'Dreams' ? (
          <Dreams />
        ) : activeTab === 'Ceremony' ? (
          <Ceremony />
        ) : activeTab === 'Goal' ? (
          <Goal />
        ) : (
          <Meditation />
        )}

        <View
          style={{
            width: '97%',
            height: 64,
            position: 'absolute',
            bottom: height * 0.02,
            alignSelf: 'center',

            zIndex: 1,
          }}>
          <ImageBackground
            source={ImageData.TABBACKGROUND}
            style={styles.thirdBackground}
            resizeMode="stretch">
            <View style={styles.tabRow}>
              {tabs.map(tab => {
                const isActive = tab.key === activeTab;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={styles.tabButton}
                    onPress={() => setActiveTab(tab.key)}>
                    <Image
                      source={tab.activeIcon}
                      resizeMode="contain"
                      style={{width: 24, height: 24}}
                    />

                    {isActive && (
                      <View style={styles.activeLabelContainer}>
                        <Text style={styles.activeLabelText}>{tab.key}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
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
  secondaryContainer: {
    width: '90%',
    height: '90%',
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
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
    paddingHorizontal: width * 0.03,
  },

  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: width * 0.03,
  },

  activeLabelContainer: {
    backgroundColor: Color?.BROWN4,
    borderRadius: 100,
    paddingHorizontal: 8,
    minWidth: 46,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  activeLabelText: {
    fontSize: 12,
    color: Color?.LIGHTGREEN,
    fontFamily: Font.EBGaramond_Medium,
    fontWeight: '500',
    textAlign: 'center',
  },
});
