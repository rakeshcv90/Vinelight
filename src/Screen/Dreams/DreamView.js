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
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeHeader2 from '../../Component/CustomeHeader2';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import {RichEditor} from 'react-native-pell-rich-editor';
import Button from '../../Component/Button';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import {
  deleteDreamData,
  deleteGoalByDate,
  deleteJournalData,
  deleteTaskById,
  updateAllGoalData,
  upDateGoalById,
} from '../../redux/actions';
import CustomeHeader3 from '../../Component/CustomeHeader3';
import Button2 from '../../Component/Button2';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');
const DreamView = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [currentDream, setCurrentDream] = useState(route?.params?.dreaItem);
  const [currentDate, setCurrentDate] = useState(
    moment().format(route?.params?.dreaItem?.currentDat),
  );
  const scrollRef = useRef();
  const [journalData, setjournalData] = useState();
  const [goaldisplayData, setGoalDisplayData] = useState();
  const [selectedButton, setSelectedButton] = useState(2);
  const getDreamData = useSelector(state => state?.user?.getDreamData);
  const getJournalData = useSelector(state => state?.user?.getJournalData);
  const goalData = useSelector(state => state.user?.goalByDate || []);
  useEffect(() => {
    const filteredData = getJournalData?.filter(dream => {
      return dream?.currentDat == currentDate;
    });
    const filteredJournalData = getDreamData?.filter(dream => {
      return dream?.currentDat == currentDate;
    });
    setjournalData(filteredData);
    setCurrentDream(filteredJournalData);
    setGoalDisplayData(goalData[currentDate]);
  }, [currentDate, getDreamData, dispatch, goalData, getJournalData]);

  const deleteDream = () => {
    dispatch(deleteDreamData(route?.params?.dreaItem?.dream?.id));
    navigation.goBack();
  };
  const deleteJournalEntry = () => {
    if (selectedButton === 1) {
      dispatch(deleteJournalData(journalData?.[0]?.journal?.id));
      navigation.goBack();
    } else if (selectedButton === 2) {
      dispatch(deleteDreamData(currentDream?.[0]?.dream?.id));
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  };
  const editJournalEntryData = () => {
    if (selectedButton === 1) {
      navigation.navigate('EditJournalEntry', {
        journalData: journalData?.[0],
      });
    } else if (selectedButton === 2) {
      navigation.navigate('EditDream', {
        dreamData: currentDream?.[0],
      });
    } else {
    }
  };
  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
          marginTop: height * 0.25,
        }}>
        <Image
          source={IconData.NODATA}
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: height * 0.2,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontFamily: Font.EBGaramond_SemiBold,
            color: Color.LIGHTGREEN,
            textAlign: 'center',
          }}>
          No goals data available.
        </Text>
        <View
          style={{
            width: '96%',
            height: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: height * 0.045,
            flexDirection: 'row',
          }}>
          <Button2
            width={280}
            height={50}
            buttonTitle={'New Goal'}
            img={IconData.PLUS}
            left={true}
            size={20}
            onPress={() => {
              navigation.navigate('MainPage', {
                initialTab: 'Goal',
                selectedDate: currentDate,
                modalOpenData: true,
              });
            }}
          />
        </View>
      </View>
    );
  };
  const updateTask = data => {
    dispatch(upDateGoalById(data?.id));
  };
  const deleteTask = data => {
    dispatch(deleteTaskById(data?.id));
  };
  const deleteGoalDate = data => {
    dispatch(deleteGoalByDate(data));
  };
  const clearAllTasksForDate = data => {
    dispatch(updateAllGoalData(data));
  };
  return (
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
            <View style={{flex: 0.13, marginTop: -height * 0.045}}>
              {selectedButton == 3 ? (
                <CustomeHeader3
                  onClear={() => {
                    clearAllTasksForDate(goaldisplayData?.date);
                  }}
                  onDelete={() => {
                    deleteGoalDate(goaldisplayData?.date);
                  }}
                  selectedDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              ) : (
                <CustomeHeader2
                  // onClear={() => {
                  //   // editJournalEntryData();
                  // }}
                  onClear={() => {
                    if (
                      selectedButton == 2 &&
                      currentDream?.[0]?.dream?.dreamContent
                    ) {
                      editJournalEntryData();
                    } else if (
                      selectedButton == 1 &&
                      journalData?.[0]?.journal?.journalContent
                    ) {
                      editJournalEntryData();
                    } else {
                      Toast.show({
                        type: 'custom',
                        position: 'top',
                        props: {
                          icon: IconData.ERR, // your custom image
                          text: 'Create entry first to edit',
                        },
                      });
                    }
                  }}
                  onDelete={() => {
                    deleteJournalEntry();
                  }}
                  selectedDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              )}
            </View>
            {selectedButton !== 3 ? (
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
                    marginTop: height >= 850 ? -height * 0.025 : 0,
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
                      {/* <WebView
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
    ${
      selectedButton === 1
        ? journalData?.[0]?.journal?.journalContent || 'No content'
        : selectedButton === 2
        ? currentDream?.[0]?.dream?.dreamContent || 'No content'
        : 'No content'
    }
  </body>
        </html>
      `,
                    }}
                    style={{width: '100%'}}
                    scrollEnabled={false} // Let ScrollView handle scrolling
                  /> */}

                      {selectedButton == 1 &&
                        (journalData?.[0]?.journal?.journalContent ? (
                          <>
                            <WebView
                              originWhitelist={['*']}
                              scrollEnabled={true} // Let ScrollView handle scrolling
                              showsVerticalScrollIndicator={false}
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
    ${journalData?.[0]?.journal?.journalContent}
  </body>
        </html>
      `,
                              }}
                              style={{width: '100%'}}
                            />
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 30,
                                marginTop: height * 0.05,
                              }}>
                              <Image
                                source={IconData.NODATA}
                                resizeMode="contain"
                                style={{
                                  width: width * 0.5,
                                  height: height * 0.2,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 24,
                                  fontFamily: Font.EBGaramond_SemiBold,
                                  color: Color.LIGHTGREEN,
                                  textAlign: 'center',
                                }}>
                                No journal content available
                              </Text>
                            </View>
                            <View
                              style={{
                                width: '96%',
                                height: '10%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                gap: 20,
                                flexDirection: 'row',
                              }}>
                              <Button2
                                width={280}
                                height={50}
                                buttonTitle={'New Journal Entry'}
                                img={IconData.PLUS}
                                left={true}
                                size={20}
                                onPress={() => {
                                  // navigation.navigate('CreateJournalEntry');
                                  console.log(
                                    'Create new journal entry pressed',
                                    currentDate,
                                  );
                                  navigation.navigate('CreateJournalEntry', {
                                    selectedDate: currentDate,
                                  });
                                }}
                              />
                            </View>
                          </>
                        ))}
                      {selectedButton == 2 &&
                        (currentDream?.[0]?.dream?.dreamContent ? (
                          <>
                            <WebView
                              originWhitelist={['*']}
                              scrollEnabled={true} // Let ScrollView handle scrolling
                              showsVerticalScrollIndicator={false}
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
    ${currentDream?.[0]?.dream?.dreamContent}
  </body>
        </html>
      `,
                              }}
                              style={{width: '100%'}}
                            />
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 30,
                                marginTop: height * 0.05,
                              }}>
                              <Image
                                source={IconData.NODATA}
                                resizeMode="contain"
                                style={{
                                  width: width * 0.5,
                                  height: height * 0.2,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 24,
                                  fontFamily: Font.EBGaramond_SemiBold,
                                  color: Color.LIGHTGREEN,
                                  textAlign: 'center',
                                }}>
                                No dream journal content available
                              </Text>
                            </View>
                            <View
                              style={{
                                width: '96%',
                                height: '10%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                gap: 20,
                                flexDirection: 'row',
                              }}>
                              <Button2
                                width={280}
                                height={50}
                                buttonTitle={'New Dream Journal Entry'}
                                img={IconData.PLUS}
                                left={true}
                                size={20}
                                onPress={() => {
                                  navigation.navigate('CreateDream', {
                                    selectedDate: currentDate,
                                  });
                                  // navigation.navigate('CreateDream');
                                }}
                              />
                            </View>
                          </>
                        ))}
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
            ) : (
              <View
                style={{
                  flex: 0.82,
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
                    marginTop: height >= 850 ? -height * 0.025 : 0,
                    alignSelf: 'center',

                    alignItems: 'center',
                    borderRadius: 10,
                    marginLeft: 20,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      height: '92%',
                      backgroundColor: Color?.LIGHTBROWN,
                      right: 10,
                    }}>
                    <FlatList
                      data={goaldisplayData?.tasks}
                      contentContainerStyle={{paddingBottom: 20}}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={emptyComponent}
                      renderItem={({item, index}) => {
                        return (
                          <View style={styles.taskRow}>
                            <TouchableOpacity
                              style={styles.iconWrap}
                              onPress={() => {
                                updateTask(item);
                              }}>
                              <Image
                                source={
                                  item?.completed
                                    ? IconData.CHECK
                                    : IconData.UNCHECK
                                }
                                style={{width: 24, height: 24, marginRight: 20}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                            <Text
                              style={[
                                styles.taskText,
                                item?.completed && styles.completedTaskText,
                              ]}>
                              {item?.text}
                            </Text>
                            <TouchableOpacity
                              style={styles.menuWrap}
                              onPress={() => {
                                deleteTask(item);
                              }}>
                              <Image
                                source={IconData.DELETE}
                                tintColor={Color.LIGHTGREEN}
                                style={{width: 24, height: 20}}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            )}
            <ImageBackground
              source={ImageData.TABBACKGROUND}
              style={[
                styles.thirdBackground,
                {
                  bottom: height <=900&& height >=800 ? 40 : 15,
                },
              ]}
              resizeMode="contain">
              <View
                style={{
                  width: '100%',
                  height: 70,
                  back: 'red',
                  flexDirection: 'row',

                  alignItems: 'center',
                  gap: width * 0.025,
                  overflow: 'hidden',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedButton(1);
                  }}
                  style={{
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 15,
                    width: '30%',
                    marginLeft: 10,
                    backgroundColor:
                      selectedButton == '1' ? Color.BROWN4 : 'transparent',
                    borderRadius: 100,
                  }}>
                  <Image
                    source={
                      selectedButton == 1
                        ? IconData.JOURNALB
                        : IconData.JOURNALA
                    }
                    style={{width: 24, height: 24}}
                    tintColor={
                      selectedButton == 1 ? Color.LIGHTGREEN : Color.BROWN4
                    }
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedButton == 1 ? Color.LIGHTGREEN : Color.BROWN4,
                      fontFamily: Font.EBGaramond_SemiBold,
                    }}>
                    Journal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedButton(2);
                  }}
                  style={{
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    width: '40%',

                    right: 12,
                    backgroundColor:
                      selectedButton == '2' ? Color.BROWN4 : 'transparent',
                    borderRadius: 100,
                  }}>
                  <Image
                    source={
                      selectedButton == 2 ? IconData.DREAMB : IconData.DREAMA
                    }
                    style={{width: 24, height: 24}}
                    tintColor={
                      selectedButton == 2 ? Color.LIGHTGREEN : Color.BROWN4
                    }
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedButton == 2 ? Color.LIGHTGREEN : Color.BROWN4,
                      fontFamily: Font.EBGaramond_SemiBold,
                    }}>
                    Dreams Journal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedButton(3);
                  }}
                  style={{
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    width: '20%',

                    right: 15,
                    backgroundColor:
                      selectedButton == '3' ? Color.BROWN4 : 'transparent',
                    borderRadius: 100,
                  }}>
                  <Image
                    source={
                      selectedButton == 3 ? IconData.GOALA : IconData.GOALA
                    }
                    style={{width: 24, height: 24}}
                    tintColor={
                      selectedButton == 3 ? Color.LIGHTGREEN : Color.BROWN4
                    }
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedButton == 3 ? Color.LIGHTGREEN : Color.BROWN4,
                      fontFamily: Font.EBGaramond_SemiBold,
                    }}>
                    Goal
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </ImageBackground>
        </SafeAreaView>
      </ImageBackground>
    </>
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
    bottom: 15,
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
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.BROWN3,
    padding: 12,
    marginVertical: 10,
    marginBottom: 0,
    borderRadius: 12,
  },
  iconWrap: {
    width: 30,
    alignItems: 'center',
    marginLeft: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_Regular,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    fontSize: 16,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_Regular,
  },
  menuWrap: {
    paddingHorizontal: 8,
  },
});
export default DreamView;
