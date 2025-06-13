import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import CustomeHeader2 from '../../Component/CustomeHeader2';
import Button from '../../Component/Button';
import {moodData} from '../../Component/Mood';
import {deleteJournalData} from '../../redux/actions';
const {width, height} = Dimensions.get('window');
const DisplayJournalEntry = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [currentDream, setCurrentDream] = useState(route?.params?.journal);
  const [currentDate, setCurrentDate] = useState(
    moment().format(route?.params?.journal?.currentDat),
  );
  const scrollRef = useRef();

  const getJournalData = useSelector(state => state?.user?.getJournalData);

  useEffect(() => {
    const filteredData = getJournalData?.filter(dream => {
      return dream?.currentDat == currentDate;
    });
    setCurrentDream(filteredData);
  }, [currentDate, getJournalData]);

  const getImage = id => {
    const mood = moodData?.filter(item => {
      return item?.id === id;
    });

    return mood[0]?.Image;
  };
  const getText = id => {
    const mood = moodData?.filter(item => {
      return item?.id === id;
    });

    return mood[0]?.name;
  };
  const deleteJournalEntry = () => {
    dispatch(deleteJournalData(route?.params?.journal?.journal?.id));
    navigation.goBack();
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
            
              navigation.navigate('EditJournalEntry', {
                journalData: route?.params?.journal,
              });
            }}
            onDelete={() => {
              deleteJournalEntry();
            }}
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
                maxHeight: '92%',
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
                contentContainerStyle={{flexGrow: 1}}>
                <WebView
                  originWhitelist={['*']}
                  scrollEnabled={false} // Let ScrollView handle scrolling
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
            ${currentDream[0]?.journal?.journalContent || 'No content'}
          </body>
        </html>
      `,
                  }}
                  style={{width: '100%'}}
                />
              </ScrollView>

              {currentDream[0]?.mood != undefined && (
                <View
                  style={{
                    // width: 100,
                    // height: 40,
                    padding: 10,
                    backgroundColor: Color.BROWN3,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: Color.BROWN3,
                    flexDirection: 'row',
                    top: 10,
                    gap: 10,
                  }}>
                  <Image
                    source={getImage(currentDream[0]?.mood?.id)}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                    tintColor={Color.LIGHTGREEN}
                  />
                  <Text
                    style={{
                      color: Color.LIGHTGREEN,
                      fontSize: 14,
                      fontFamily: Font.EBGaramond_Regular,
                    }}>
                    {getText(currentDream[0]?.mood?.id)}
                  </Text>
                </View>
              )}

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
          <View
            style={{
              width: '95%',
              height: 70,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <Button
              img={IconData.JOURNALB}
              text="Journal"
              left={true}
              width={100}
              backgroundColor={Color.BROWN4}
              height={40}
              size={16}
              font={Font.EBGaramond_SemiBold}
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Journal'});
              }}
              style={{width: '50%', zIndex: -1}}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Dreams'});
              }}
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Image
                source={IconData.DREAMA}
                style={{width: 24, height: 24}}
                tintColor={Color.BROWN4}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.BROWN4,
                  fontFamily: Font.EBGaramond_SemiBold,
                }}>
                Dreams Journal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MainPage', {initialTab: 'Goal'});
              }}
              style={{
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                right: 15,
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
export default DisplayJournalEntry;
