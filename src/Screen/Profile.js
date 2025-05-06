import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';
import {storage} from '../Component/Storage';
import {Background} from '@react-navigation/elements';
import Button from '../Component/Button';
import ProfileGoalComponent from '../Component/ProfileGoalComponent';

const {width, height} = Dimensions.get('window');
const Profile = ({navigation}) => {
  const [userData, setUserData] = useState(null);

  const [modalopen, setModalOpen] = useState(false);
  useEffect(() => {
    const storedUserString = storage.getString('userInfo');

    try {
      if (storedUserString && typeof storedUserString === 'string') {
        const user = JSON.parse(storedUserString);
        setUserData(user || null);
      }
    } catch (e) {
      console.error('Error parsing userInfo from storage:', storedUserString);
    }
  }, []);

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
              navigation.goBack();
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
          <TouchableOpacity
            onPress={() => {
              setModalOpen(!modalopen);
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
                source={IconData.PEN}
                tintColor={Color?.LIGHTGREEN}
                style={{width: 24, height: 24}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.secondaryContainer}>
          <ImageBackground
            source={ImageData.PROFILEBACK1}
            style={styles.secondaryBackground}
            resizeMode="stretch">
            <View
              style={{
                width: 120,
                height: 120,
                backgroundColor: Color?.BROWN4,
                borderRadius: 60,
                alignSelf: 'center',
                // marginVertical: '%',
                marginTop:30,
                borderWidth: 3,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Color?.BROWN2,
              }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: Color?.BROWN4,
                  borderRadius: 50,
                  alignSelf: 'center',
                  marginVertical: '5%',
                  borderWidth: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: Color?.BROWN2,
                }}>
                <Image
                  source={
                    userData?.photo?.uri
                      ? {uri: userData?.photo?.uri}
                      : ImageData?.NOIMAGE
                  }
                  resizeMode="cover"
                  style={{
                    width: 95,
                    height: 95,

                    borderRadius: 47.5,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.title}>{userData?.name}</Text>
            </View>

            <View
              style={{
                width: '100%',

                justifyContent: 'space-between',

              

                padding: 10,
                flexDirection: 'row',
              }}>
              <ProfileGoalComponent count={6} title={'Hours Meditated'} image={IconData.MEDITATIONA}/>
              <ProfileGoalComponent count={56} title={'Goals Completed'} image={IconData.GOALA}/>
            </View>
            <View
              style={{
                width: '100%',

                justifyContent: 'space-between',

                padding: 10,

                flexDirection: 'row',
              }}>
              <ProfileGoalComponent count={14} title={'Journal Streak'} image={IconData.JOURNALA}/>
              <ProfileGoalComponent count={56} title={'Dream Journal Streak'} image={IconData.DREAMA}/>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            width: '95%',
            height: 56,
            position: 'absolute',
            bottom: height * 0.02,
            alignSelf: 'center',

            zIndex: 1,
          }}>
          <ImageBackground
            source={ImageData.TABBACKGROUND}
            style={styles.thirdBackground}
            resizeMode="contain">
            {modalopen ? (
              <View
                style={{
                  width: '95%',
                  height: '100%',

                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                }}>
                <Button
                  img={IconData.SAVE}
                  text="Save"
                  left={true}
                  onPress={() => {
                    console.log('Dvdsfdsfdsfds');
                  }}
                  style={{width: '50%', zIndex: -1}}
                  // disabled={currentPage === subTitleText?.length - 1}
                />
              </View>
            ) : (
              <View
                style={{
                  width: '95%',
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                // onPress={handleBack}
                // disabled={currentPage === 0}
                >
                  <Image
                    source={IconData.BACK}
                    style={{width: 24, height: 24, left: 8}}
                  />
                </TouchableOpacity>
                {/* <Button
                img={ImageData.ARROWNEXT}
                text="Next"
                left={false}
                onPress={() => {
                  handleNext();
                }}
                style={{width: '50%', backgroundColor: 'red', zIndex: -1}}
                // disabled={currentPage === subTitleText?.length - 1}
              /> */}
              </View>
            )}
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Profile;
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
  title: {
    fontSize: 40,
    fontWeight: '500',
    color: Color.LIGHTGREEN,

    fontFamily: 'EBGaramond-Regular',
  },
  title2: {
    fontSize: 68,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',

    fontFamily: 'EBGaramond-Regular',
  },
  description: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: Font.EBGaramond_Regular,
    fontSize: 25,
    color: Color.LIGHTGREEN,
    lineHeight: 35,
    textAlign: 'center',
  },
});
