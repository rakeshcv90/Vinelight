import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';
import {storage} from '../Component/Storage';
import {Background} from '@react-navigation/elements';
import Button from '../Component/Button';
import ProfileGoalComponent from '../Component/ProfileGoalComponent';
import Button2 from '../Component/Button2';
import Toast from 'react-native-toast-message';
import {useGalleryPermission} from '../Component/PermissionHooks';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoader from '../Component/ActivityLoader';
import {setSubscriptionProducts, setUserInfo} from '../redux/actions';
import * as RNIap from 'react-native-iap';

const products = Platform.select({
  ios: ['plan_monthly', 'plan_yearly'],
  android: ['plan_monthly', 'plan_yearly'],
});

const {width, height} = Dimensions.get('window');
const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const {launchLibrary} = useGalleryPermission();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [modalopen, setModalOpen] = useState(false);
  const userInfo = useSelector(state => state?.user?.userInfo);
  const subscription = useSelector(state => state?.user?.subscription);

  const url = 'https://www.instagram.com/vinelightapp/';
  const url1 = 'https://arkanaapps.com/contact/';
  useEffect(() => {
    setName(userInfo?.name);
    setImage(userInfo?.photo);
  }, [modalopen]);
  useEffect(() => {
    RNIap.initConnection().then(() => {
      getPlanData();
    });

    return () => {
      RNIap.endConnection();
    };
  }, []);
  const getPlanData = () => {
    Platform.OS === 'ios'
      ? RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getProducts({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                console.log("Cccccc",res)
                dispatch(setSubscriptionProducts(res));
              });
          })
      : RNIap.initConnection()
          .catch(() => {
            console.log('error connecting to store');
          })
          .then(() => {
            RNIap.getSubscriptions({skus: products})
              .catch(() => {
                console.log('error finding purchase');
              })
              .then(res => {
                dispatch(setSubscriptionProducts(res));
              });
          });
  };
  const updateProfile = () => {
    if (name && image?.uri) {
      setLoader(true);
      const user = {
        name: name,
        photo: {
          uri: image.uri,
          base64: image.base64 || null,
          type: image.type || 'image/jpeg',
          fileName: image.fileName || 'profile.jpg',
          width: image.width,
          height: image.height,
          fileSize: image.fileSize,
        },
      };
      try {
        dispatch(setUserInfo(user));
        setTimeout(() => {
          setLoader(false); // ✅ Hide loader

          Toast.show({
            type: 'success',
            text1: 'Profile Updated',
            text2: 'Your profile has been updated successfully',
            visibilityTime: 3000,
            position: 'top',
          });

          setName(null);
          setImage(null);
          setModalOpen(false);
        }, 1000);
      } catch (error) {
        setLoader(false);
        console.error('❌ Storage Save Error:', error);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Data Save failed',
        text2: 'Please enter your name and select an image',
        visibilityTime: 3000,
        position: 'top', // 'top' or 'bottom'
      });
    }
  };

  const openLibrary = async () => {
    try {
      const resultLibrary = await launchLibrary();

      if (resultLibrary) {
        setImage(resultLibrary.assets[0]);
      }
    } catch (error) {
      console.log('LibimageError', error);
    }
  };

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(url);
    }
  }, [url]);

  const handlePress1 = useCallback(async () => {
    const supported = await Linking.canOpenURL(url1);

    if (supported) {
      await Linking.openURL(url1);
    } else {
      await Linking.openURL(url1);
    }
  }, [url1]);
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ActivityLoader visible={loader} />
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
                marginTop: 30,
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
                    image?.base64
                      ? {uri: `data:${image.type};base64,${image.base64}`}
                      : image?.uri
                      ? {uri: image.uri}
                      : ImageData.NOIMAGE
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
              <Text style={styles.title}>{name ? name : 'Guest'}</Text>
            </View>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  gap: height * 0.01,
                  marginTop: 10,
                  flexDirection: 'row',
                }}>
                <ProfileGoalComponent
                  count={6}
                  title={'Hours Meditated'}
                  image={IconData.MEDITATIONA}
                />
                <ProfileGoalComponent
                  count={56}
                  title={'Goals Completed'}
                  image={IconData.GOALA}
                />
              </View>
              <View
                style={{
                  width: '95%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  gap: height * 0.01,
                  marginTop: height * 0.03,
                  marginBottom: 10,
                  flexDirection: 'row',
                }}>
                <ProfileGoalComponent
                  count={14}
                  title={'Journal Streak'}
                  image={IconData.JOURNALA}
                />
                <ProfileGoalComponent
                  count={56}
                  title={'Dream Journal Streak'}
                  image={IconData.DREAMA}
                />
              </View>

              <View
                style={{
                  width: '95%',

                  alignItems: 'center',
                  marginTop: '2%',

                  borderWidth: 1,
                  alignSelf: 'center',
                  borderColor: Color.LIGHTGREEN,
                  backgroundColor: Color?.LIGHTBROWN,
                }}>
                <View
                  style={{
                    width: '100%',
                    // height: '10%',
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                  }}>
                  <>
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
                  </>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subtitle}>Unlock Extra Features</Text>
                  {/* <Text style={styles.subText}>
                    Lorem ipsum dolor sit amet, consectetur.
                  </Text> */}
                </View>
                <View
                  style={{
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: -5,
                    }}>
                    <Image
                      source={IconData.JOURNALA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      250+ Integration Journal Prompts
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: 10,
                    }}>
                    <Image
                      source={IconData.DREAMA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      100+ Dream Journal Prompts
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: 20,
                    }}>
                    <Image
                      source={IconData.MEDITATIONA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      Guided Meditations
                    </Text>
                  </View>
                  {subscription?.length > 0 ? (
                    <View
                      style={{
                        width: '100%',
                        marginVertical: height * 0.03,
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 10,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.EB_Garamond_Bold,
                          fontSize: 16,
                          color: Color.LIGHTGREEN,
                        }}>
                        Currently Active Plan :
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.EB_Garamond_Bold,
                          fontSize: 16,
                          color: Color.LIGHTGREEN,
                        }}>
                        Monthly
                      </Text>
                    </View>
                  ) : (
                    <View style={{padding: 20}} />
                  )}
                  <Button2
                    width={300}
                    height={50}
                    buttonTitle={
                      subscription?.length > 0
                        ? 'Manage Subscription'
                        : 'Upgrade'
                    }
                    img={IconData.UPGRADE}
                    left={true}
                    size={20}
                    onPress={() => 
                    navigation.navigate('Subscription')
                    }
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    // height: '10%',
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                  }}>
                  <>
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
                  </>
                </View>
              </View>
            </ScrollView>
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
            resizeMode="stretch">
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
                  width={91}
                  height={40}
                  backgroundColor={Color.BROWN4}
                  size={16}
                  font={Font.EBGaramond_SemiBold}
                  onPress={() => {
                    updateProfile();
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
                <View
                  style={{
                    width: '40%',
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                  }}>
                  <Pressable onPress={handlePress}>
                    <Image
                      source={IconData.INSTA}
                      style={{width: 24, height: 24, left: 10}}
                    />
                  </Pressable>
                </View>

                <Button
                  img={IconData.MAIL}
                  text="Contact Us"
                  left={true}
                  width={140}
                  height={40}
                  size={15}
                  backgroundColor={Color.BROWN4}
                  font={Font.EBGaramond_SemiBold}
                  onPress={() => {
                    handlePress1();
                  }}
                />
              </View>
            )}
          </ImageBackground>
        </View>
        {modalopen && (
          <KeyboardAvoidingView
            style={styles.backdrop}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              {/* <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                }}> */}
              <ImageBackground
                source={ImageData.MODAL}
                style={styles.modalSheet}
                imageStyle={styles.imageStyle} // apply radius to image
                resizeMode="cover">
                <View
                  style={{
                    width: '95%',

                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: Font.EBGaramond_SemiBold,
                      textAlign: 'center',
                    }}>
                    Edit Profile
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalOpen(false)}
                    style={{position: 'absolute', right: 10}}>
                    <Image
                      source={IconData.CANCEL}
                      style={{width: 35, height: 35}}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    openLibrary();
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    alignSelf: 'center',
                    borderWidth: 3,
                    padding: 2,
                    borderColor: Color.BROWN2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: Color.BROWN2,
                  }}>
                  <Image
                    source={
                      image?.base64
                        ? {uri: `data:${image.type};base64,${image.base64}`}
                        : image?.uri
                        ? {uri: image.uri}
                        : ImageData.NOIMAGE
                    }
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                      alignSelf: 'center',

                      // backgroundColor: Color.BROWN2,
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '90%',
                    height: 52,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: Color.BROWN2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: height * 0.02,
                    marginHorizontal: width * 0.03,
                    backgroundColor: Color.BROWN3,
                  }}>
                  <TextInput
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder="Enter your name"
                    placeholderTextColor={Color.GREEN}
                    style={{
                      width: '90%',
                      height: '100%',
                      color: Color.LIGHTGREEN,
                      fontSize: 16,
                      fontFamily: Font.EBGaramond_Regular,
                    }}
                    selectionColor={Color.LIGHTGREEN}
                  />
                </View>
              </ImageBackground>
              {/* </ScrollView> */}
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        )}
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
    height: '85%',
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
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Color.LIGHTGREEN,
    top: -25,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  subText: {
    fontSize: 16,
    color: Color.LIGHTGREEN,
    top: -20,
    fontFamily: Font.EBGaramond_Regular,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 309,
    alignSelf: 'center',
    marginLeft: 10,
    marginBottom: 50,
    width: '96%',

    borderTopLeftRadius: 20,
  },
  imageStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
