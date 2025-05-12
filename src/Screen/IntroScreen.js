import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';
import Button from '../Component/Button';
import {useGalleryPermission} from '../Component/PermissionHooks';
import Toast from 'react-native-toast-message';
import {storage} from '../Component/Storage';
import ActivityLoader from '../Component/ActivityLoader';
import {useDispatch} from 'react-redux';
import { setUserInfo } from '../redux/actions';
const {width, height} = Dimensions.get('window');

const IntroScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const {launchLibrary} = useGalleryPermission();
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);

  const subTitleText = [
    {
      id: 1,
      text: 'Your all-inclusive ceremony integration journal, dream journal, goal-tracking app, and meditation timer!',
      image: ImageData.YOGA,
    },
    {
      id: 2,
      text: 'Enjoy the free version or subscribe for over 300 journal prompts and guided meditations!',
      image: ImageData.BOOK,
    },
    {
      id: 3,
      text: 'Add your name and photo to customize your VineLight!',
      image: ImageData.SELECTIMAGE,
    },
  ];

  const handleNext = () => {
    if (currentPage < subTitleText?.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      if (name && image?.uri) {

        setLoader(true);
        // const user = {
        //   name: name,
        //   photo: image,
        // };
        const user = {
          name: name,
          photo: {
            uri: image?.uri,
            base64: image?.base64 || null, // fallback safe
            type: image?.type || 'image/jpeg',
            fileName: image?.fileName || 'photo.jpg',
            width: image?.width,
            height: image?.height,
            fileSize: image?.fileSize,
          },}
        try {
          dispatch(setUserInfo(user));

          setTimeout(() => {
            setLoader(false);
            Toast.show({
              type: 'success',
              text1: 'Profile Created',
              text2: 'Your profile has been created successfully',
              visibilityTime: 3000,
              position: 'top',
            });

            setName(null);
            setImage(null);
            setCurrentPage(0);
            navigation.replace('MainPage');
          }, 1000);
        } catch (error) {
          setLoader(false);
          console.error('❌ Storage Save Error:', error);
        }
      } else {
        setLoader(false);
        Toast.show({
          type: 'error',
          text1: 'Data Save failed',
          text2: 'Please enter your name and select an image',
          visibilityTime: 3000,
          position: 'top', // 'top' or 'bottom'
        });
      }
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setName(null);
      setImage(null);
      setCurrentPage(currentPage - 1);
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
        {/* Centered Container */}
        <View style={styles.secondaryContainer}>
          <ImageBackground
            source={ImageData.MAINBACKGROUND}
            style={styles.secondaryBackground}
            resizeMode="stretch">
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: '35%',
                paddingVertical: '5%',
              }}>
              <Text style={styles.title}>Welcome To</Text>
              <Text style={styles.title2}>VineLight</Text>
              <View
                style={{
                  width: '90%',
                  height: '80%',
                  alignItems: 'center',
                  marginTop: '5%',
                  borderWidth: currentPage === 2 ? 0 : 1,
                  borderColor: Color.LIGHTGREEN,
                  backgroundColor: Color?.LIGHTBROWN,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '10%',
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                  }}>
                  {currentPage !== 2 && (
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
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '25%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={currentPage !== 2}
                  onPress={() => {
                    openLibrary();
                  }}>
                  <Image
                    source={
                      currentPage == 2 && image
                        ? {uri: image?.uri}
                        : subTitleText[currentPage]?.image ?? ImageData.NOIMAGE
                    }
                    resizeMode="contain"
                    style={{
                      width: 100,
                      height: 100,
                      borderWidth: currentPage === 2 ? 3 : 0,
                      borderRadius: currentPage === 2 ? 50 : 0,
                      borderColor:
                        currentPage === 2 ? Color.LIGHTGREEN : 'transparent',
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '100%',
                    height: '56%',

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '90%',
                      height: '80%',
                      // padding: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={[
                        styles.titleText,
                        {marginVertical: currentPage === 2 ? 20 : 0},
                      ]}>
                      {subTitleText[currentPage]?.text}
                    </Text>
                    {currentPage === 2 && (
                      <View
                        style={{
                          width: '100%',

                          height: 52,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: Color.LIGHTGREEN,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          backgroundColor: 'white',
                        }}>
                        <TextInput
                          value={name}
                          onChangeText={text => setName(text)}
                          placeholder="Enter your name"
                          placeholderTextColor={Color.LIGHTGREEN}
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
                    )}
                  </View>
                  <View
                    style={{
                      width: '90%',
                      height: '10%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: 20,
                    }}>
                    <View style={styles.dotsContainer}>
                      {[0, 1, 2].map(index => (
                        <View
                          key={index}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            marginHorizontal: 2,
                            backgroundColor:
                              index === currentPage
                                ? Color.LIGHTGREEN
                                : Color.BROWN,
                          }}></View>
                      ))}
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '10%',
                    flexDirection: 'row',

                    justifyContent: 'space-between',
                  }}>
                  {currentPage !== 2 && (
                    <>
                      <Image
                        source={ImageData.BACKLEFT}
                        resizeMode="contain"
                        style={{
                          width: 31,
                          height: 31,
                          top: height >= 844 ? height * 0.005 : 0,
                        }}
                      />

                      <Image
                        source={ImageData.BACKRIGHT}
                        resizeMode="contain"
                        style={{
                          width: 31,
                          height: 31,
                          top: height >= 844 ? height * 0.005 : 0,
                        }}
                      />
                    </>
                  )}
                </View>
              </View>
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
            <View
              style={{
                width: '95%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={handleBack}
                disabled={currentPage === 0}>
                <Image
                  source={IconData.BACK}
                  style={{width: 24, height: 24, left: 8}}
                />
              </TouchableOpacity>
              <Button
                img={ImageData.ARROWNEXT}
                text="Next"
                left={false}
                onPress={() => {
                  handleNext();
                }}
                style={{width: '50%', backgroundColor: 'red', zIndex: -1}}
                width={91}
                height={47}
                size={16}
                font={Font.EBGaramond_SemiBold}

                // disabled={currentPage === subTitleText?.length - 1}
              />
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
  );
};

export default IntroScreen;

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
