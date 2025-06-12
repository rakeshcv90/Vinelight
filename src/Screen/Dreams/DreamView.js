import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeHeader2 from '../../Component/CustomeHeader2';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import {RichEditor} from 'react-native-pell-rich-editor';
import Button from '../../Component/Button';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import { deleteDreamData } from '../../redux/actions';
const {width, height} = Dimensions.get('window');
const DreamView = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [currentDream, setCurrentDream] = useState(route?.params?.dreaItem);
  const [currentDate, setCurrentDate] = useState(
    moment().format(route?.params?.dreaItem?.currentDat),
  );
  const scrollRef = useRef();

  const getDreamData = useSelector(state => state?.user?.getDreamData);

  useEffect(() => {
    const filteredData = getDreamData?.filter(dream => {
      return dream?.currentDat == currentDate;
    });
    setCurrentDream(filteredData);
  }, [currentDate, getDreamData]);


    const deleteDream = () => {
      dispatch(deleteDreamData(route?.params?.dreaItem?.dream?.id));
      navigation.goBack()
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
        <View style={{flex: 0.13, marginTop: 5}}>
          <CustomeHeader2
            onClear={() => {
              navigation.navigate('EditDream', {
                dreamData: route?.params?.dreaItem,
              });
            }}
            onDelete={() => {deleteDream()}}
            selectedDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </View>

        <View
          style={{
            flex: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={ImageData.DREAMBACKGROUND}
            resizeMode="stretch"
            imageStyle={{borderRadius: 10}}
            style={{
              width: '95%',

              alignSelf: 'center',

              alignItems: 'center',
              borderRadius: 10,
              marginLeft: 20,
            }}>
            <View
              style={{
                width: '90%',
                maxHeight: '95%',
                marginTop: '2%',

                borderWidth: 1,

                borderColor: Color.LIGHTGREEN,
                backgroundColor: 'white',
                right: 10,
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

              <ScrollView
                ref={scrollRef}
                style={styles.editorContainer}
                keyboardShouldPersistTaps="handled"
                horizontal={false}
                contentContainerStyle={{flexGrow: 1}}>
                <WebView
                  originWhitelist={['*']}
                  source={{
                    html: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-size: 18px;
                color: #000;
                margin: 0;
                padding: 10px;
                box-sizing: border-box;
                word-wrap: break-word;
                overflow-x: hidden;
                max-width: 100%;
              }
              * {
                max-width: 100%;
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${currentDream[0]?.dream?.dreamContent || 'No content'}
          </body>
        </html>
      `,
                  }}
                  style={{width: '100%'}}
                  scrollEnabled={false} // Let ScrollView handle scrolling
                />
              </ScrollView>
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
          </ImageBackground>
        </View>
        <ImageBackground
          source={ImageData.TABBACKGROUND}
          style={styles.thirdBackground}
          resizeMode="contain">
          {/* <View
            style={{
              width: '90%',
              height: 70,

              justifyContent: 'center',
              alignItems: 'flex-end',
              overflow: 'hidden',
            }}>
            <Button
              img={IconData.SAVE}
              text="Save"
              left={true}
              width={91}
              backgroundColor={Color.BROWN4}
              height={40}
              size={16}
              font={Font.EBGaramond_SemiBold}
              //   onPress={saveDreamData}
              style={{width: '50%', zIndex: -1}}
              // disabled={currentPage === subTitleText?.length - 1}
            />
          </View> */}
          <View
            style={{
              width: '92%',
              height: 70,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Journal'});
              }}
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Image
                source={IconData.JOURNALA}
                style={{width: 24, height: 24}}
                tintColor={Color.BROWN4}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.BROWN4,
                  fontFamily: Font.EBGaramond_SemiBold,
                }}>
                Journal
              </Text>
            </TouchableOpacity>
            <Button
              img={IconData.DREAMB}
              text=" Dreams Journal"
              left={true}
              width={160}
              backgroundColor={Color.BROWN4}
              height={40}
              size={16}
              font={Font.EBGaramond_SemiBold}
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Dreams'});
              }}
              style={{width: '50%', zIndex: -1, justifyContent: 'cen'}}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Goal'});
              }}
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                right: 10,
                gap: 10,
              }}>
              <Image
                source={IconData.GOALA}
                style={{width: 24, height: 24}}
                tintColor={Color.BROWN4}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.BROWN4,
                  fontFamily: Font.EBGaramond_SemiBold,
                }}>
                Goal
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  primaryBackground: {
    flex: 1,
  },
  thirdBackground: {
    flex: 1,
    width: '97%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 10,
    position: 'absolute',
    left: width * 0.03,
  },
  editorContainer: {
    height: height * 0.7,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredDropdownWrapper: {
    width: 250, // or '90%' for full width on mobile
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
  },
  fontDropdown: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fontOption: {
    paddingVertical: 10,
  },
});
export default DreamView;
