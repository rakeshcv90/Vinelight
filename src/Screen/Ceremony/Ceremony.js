import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
} from 'react-native';
import React, {useMemo, useState, useEffect} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import {useDispatch, useSelector} from 'react-redux';
import {Calendar} from 'react-native-calendars';
import Button from '../../Component/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ActivityLoader from '../../Component/ActivityLoader';
import {deleteCeromonykById, setCeremonyInfo} from '../../redux/actions';
import FastImage from 'react-native-fast-image';
import uuid from 'react-native-uuid';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {isCoupanValid, isSubscriptionValid} from '../utils';
const {width, height} = Dimensions.get('window');
const Ceremony = ({isActive}) => {
  const [modalCeremonyopen, setModalCeromonyOpen] = useState(false);
  const subscription = useSelector(state => state?.user?.subscription);
  const coupaDetails = useSelector(state => state?.user?.coupaDetails);
  const navigation = useNavigation();
  const [currentDat, setCurrentDate] = useState(
    moment().local().format('YYYY-MM-DD'),
  );
  const dispatch = useDispatch();
  const existingCeremonies = useSelector(
    state => state.user?.ceremonyinfo || [],
  );

  const [selectedHeader, setSelectedHeader] = useState(0);
  const hasAccess =
    isSubscriptionValid(subscription) || isCoupanValid(coupaDetails);
  useEffect(() => {
    if (!isActive) {
      setModalCeromonyOpen(false);
    }
  }, [isActive]);
  const CeremonyModal = ({visible, onClose}) => {
    const [daysShow, setDayshow] = useState(new Date());
    const [isReady, setIsReady] = useState(false);
    const [ceremonyName, setCeremonyName] = useState(null);
    const [loader, setLoader] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisibleCermony, setDatePickerVisibilityCermony] =
      useState(false);
    const currentDate = moment().format('YYYY-MM-DD');
    const dispatch = useDispatch();

    useEffect(() => {
      if (visible) {
        setTimeout(() => setIsReady(true), 200); // prevent auto keyboard
      } else {
        setIsReady(false);
      }
    }, [visible]);

    const showDatePicker = () => setDatePickerVisibilityCermony(true);
    const hideDatePicker = () => setDatePickerVisibilityCermony(false);

    const handleConfirm = date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
      hideDatePicker();
    };

    const saveCeremony = () => {
      Keyboard.dismiss(); // dismiss keyboard
      // setLoader(true);

      if (ceremonyName && selectedDate) {
        const ceremonyData = {
          id: uuid.v4(),
          name: ceremonyName,
          CeremonyDate: selectedDate,
          createdDate: currentDate,
        };

        setTimeout(() => {
          try {
            dispatch(setCeremonyInfo(ceremonyData));

            Toast.show({
              type: 'custom',
              position: 'top',
              props: {
                icon: IconData.SUCC, // your custom image
                text: 'Ceremony saved!',
              },
            });

            setDatePickerVisibilityCermony(false);
          } catch (error) {
            Toast.show({
              type: 'custom',
              position: 'top',
              props: {
                icon: IconData.ERR, // your custom image
                text: 'Something went wrong',
              },
            });
          } finally {
            setLoader(false);
          }
        }, 2000);
        onClose();
        navigation.setParams({modalOpenData: null, selectedDate: null});
      } else {
        setLoader(false);

        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Please enter your ceremony name and date',
          },
        });
      }
    };

    if (!isReady) return null;
    const isValidDate = date => {
      return date instanceof Date && !isNaN(date);
    };
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          onClose();
        }}
        onDismiss={() => {
          // Hide modal and cleanup
          onClose();
        }}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ActivityLoader visible={loader} />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
              keyboardShouldPersistTaps="handled">
              <View
                style={{
                  width: '95%',
                  height: 320,
                  alignItems: 'center',
                  marginLeft: width * 0.025,
                }}>
                <ImageBackground
                  source={ImageData.MODAL}
                  style={{width: '100%', height: '100%'}}
                  imageStyle={{
                    resizeMode: 'cover',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      paddingVertical: 10,
                      position: 'relative',
                    }}>
                    <Text
                      style={{
                        fontSize: 24,
                        fontFamily: Font.EBGaramond_SemiBold,
                        textAlign: 'center',
                      }}>
                      New Ceremony
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                      }}
                      style={{position: 'absolute', right: 5}}>
                      <Image
                        source={IconData.CANCEL}
                        style={{width: 35, height: 35}}
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      width: '90%',
                      height: 52,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: height * 0.04,
                      backgroundColor: Color.BROWN3,
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      value={ceremonyName}
                      onChangeText={text => setCeremonyName(text)}
                      placeholder="Name"
                      placeholderTextColor={Color.GREEN}
                      style={{
                        width: '90%',
                        height: '100%',
                        color: Color.LIGHTGREEN,
                        fontSize: 16,
                        fontFamily: Font.EBGaramond_Regular,
                      }}
                      // selectionColor={Color.LIGHTGREEN}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={showDatePicker}
                    style={{
                      width: '90%',
                      height: 52,
                      borderRadius: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: -height * 0.03,
                      paddingHorizontal: 18,
                      backgroundColor: Color.BROWN3,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: selectedDate ? Color.LIGHTGREEN : Color.GREEN,
                        fontSize: 16,
                        fontFamily: Font.EBGaramond_Regular,
                      }}>
                      {selectedDate || 'Date'}
                    </Text>
                    <Image
                      source={IconData.CALENDER}
                      style={{width: 24, height: 24}}
                    />
                  </TouchableOpacity>

                  <ImageBackground
                    source={ImageData.TABBACKGROUND}
                    style={{
                      flex: 1,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      top: 10,
                    }}
                    resizeMode="contain">
                    <View
                      style={{
                        width: '95%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        overflow: 'hidden',
                        right: height <= 900 ? height * 0.01 : -2,
                      }}>
                      <Button
                        img={IconData.SAVE}
                        text="Save"
                        left={true}
                        width={91}
                        size={16}
                        backgroundColor={Color.BROWN4}
                        height={40}
                        font={Font.EBGaramond_SemiBold}
                        onPress={saveCeremony}
                        style={{width: '50%', zIndex: -1}}
                      />
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisibleCermony}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                date={isValidDate(daysShow) ? new Date(daysShow) : new Date()}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const dayCalculate = data => {
    let textData = '';
    if (currentDat < data) {
      textData = 'Days until';
    } else {
      textData = 'Days since';
    }
    return textData;
  };
  const dayCount = data => {
    const start = new Date(currentDat);
    const end = new Date(data);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    const countData = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
    return {countData, diffDays};
  };
  const getProgress = (createdDateStr, ceremonyDateStr) => {
    const createdDate = new Date(createdDateStr);
    const ceremonyDate = new Date(ceremonyDateStr);
    const currentDate = new Date();
    if (isNaN(createdDate) || isNaN(ceremonyDate)) {
      console.warn('Invalid created/ceremony date');
      return 0;
    }
    createdDate.setHours(0, 0, 0, 0);
    ceremonyDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const totalDuration = ceremonyDate - createdDate;
    const elapsedDuration = currentDate - createdDate;

    if (totalDuration <= 0) return 1;

    const progress = (elapsedDuration + 86400000) / totalDuration;

    return Math.max(0, Math.min(progress, 1));
  };
  const deleteCeremony = itemId => {
    dispatch(deleteCeromonykById(itemId));
    Toast.show({
      type: 'custom',
      position: 'top',
      props: {
        icon: IconData.DEL, // your custom image
        text: 'Ceremony deleted successfully!',
      },
    });
  };
  const renderItem = ({item, index}) => {
    const progress = getProgress(item?.createdDate, item?.CeremonyDate);
    const totalBarWidth = Dimensions.get('window').width * 0.82;
    const progressWidth = totalBarWidth * progress;

    const {diffDays, countData} = dayCount(item?.CeremonyDate);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{width: width * 0.4}}>
            <Text style={styles.title1}>{item?.name}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 70,
                // height: 20,
                borderRadius: 30,
                backgroundColor: Color.LIGHTBROWN2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.label1}>
                {dayCalculate(item?.CeremonyDate)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                deleteCeremony(item?.id);
              }}>
              <Image
                source={IconData.DELETE}
                style={{width: 18, height: 18}}
                tintColor={Color.LIGHTGREEN}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* {countData > 0 && (
          <View style={styles.progressWrapper}>
            <View style={styles.unfilledBar} />

            <View style={[styles.filledBar, {width: progressWidth}]}>
              <Image
                source={IconData.PROGRESS}
                resizeMode="repeat"
                style={styles.patternImage}
              />
            </View>
          </View>
        )} */}

        <View style={styles.footer2}>
          <Text style={styles.dateTime}>{item?.CeremonyDate}</Text>
          {/* <View
            style={{
              height: 2,
              paddingLeft: 5,
              paddingRight: 5,
              width: 135,
              backgroundColor: Color.LIGHTBROWN2,
            }}
          /> */}
          <Text style={styles.countdown}>{diffDays} Days</Text>
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
          gap: 20,
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
          No ceremony data available.
        </Text>
      </View>
    );
  };
  const filterdata = cermonyData => {
    let filteredData = [];
    if (selectedHeader == 1) {
      filteredData = cermonyData.filter(
        item => item.CeremonyDate >= currentDat,
      );
    } else {
      filteredData = cermonyData.filter(
        item => item.CeremonyDate <= currentDat,
      );
    }
    return filteredData;
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
            // height: '76%',
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
                resizeMode="contain"
                style={{width: 31, height: 31}}
              />
              <FastImage
                source={ImageData.RIGHT}
                resizeMode="contain"
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

                flexDirection: 'row',
                top: -height * 0.055,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subText}>Ceremonies</Text>
            </View>
            {isSubscriptionValid(subscription) ||
            isCoupanValid(coupaDetails) ? (
              <View
                style={{
                  width: '80%',
                  height: '10%',
                  flexDirection: 'row',
                  top: -height * 0.045,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.BROWN4,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: Color.BROWN2,
                  // gap: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedHeader(0);
                  }}
                  activeOpacity={0.7}
                  style={{
                    width: '50%',
                    height: '100%',

                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      selectedHeader == 0 ? Color.BROWN3 : 'transparent',
                    borderRadius: selectedHeader == 0 ? 10 : 0,
                    borderWidth: selectedHeader == 0 ? 2 : 0,
                    borderColor:
                      selectedHeader == 0 ? Color.BROWN2 : 'transparent',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Font.EBGaramond_Regular,
                      // lineHeight: 24,
                      color: Color.LIGHTGREEN,
                    }}>
                    Days since
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedHeader(1);
                  }}
                  activeOpacity={0.7}
                  style={{
                    width: '50%',
                    height: '100%',

                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      selectedHeader == 1 ? Color.BROWN3 : 'transparent',
                    borderRadius: selectedHeader == 1 ? 10 : 0,
                    borderWidth: selectedHeader == 1 ? 2 : 0,
                    borderColor:
                      selectedHeader == 1 ? Color.BROWN2 : 'transparent',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: Font.EBGaramond_Regular,
                      // lineHeight: 24,
                      color: Color.LIGHTGREEN,
                      textAlign: 'center',
                    }}>
                    Days until
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  width: '80%',
                  height: '10%',

                  top: -height * 0.045,

                  // gap: 5,
                }}></View>
            )}
            <View
              style={{
                width: '96%',
                height: '53%',
                alignItems: 'center',
                alignSelf: 'center',
                top: -height * 0.03,
              }}>
              {hasAccess ? (
                <FlatList
                  data={filterdata(existingCeremonies)}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{paddingBottom: 20}}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderItem}
                  ListEmptyComponent={emptyComponent}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 20,
                    marginTop: Platform.OS == 'ios' ? height * 0.007 : 0,
                  }}>
                  <Image
                    source={ImageData.SUBSCRIPTIONIMAGE}
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
                    Subscribe to VineLight to unlock this feature and more!
                  </Text>
                </View>
              )}
            </View>
            {isSubscriptionValid(subscription) ||
            isCoupanValid(coupaDetails) ? (
              <View
                style={{
                  width: '96%',
                  height: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  // top: height * 0.035,
                  top:
                    Platform.OS == 'ios'
                      ? height * 0.035
                      : height >= 780
                      ? height * 0.025
                      : height * 0.03,
                  flexDirection: 'row',
                }}>
                <Button2
                  width={280}
                  height={50}
                  buttonTitle={'New Ceremony'}
                  img={IconData.PLUS}
                  left={true}
                  size={20}
                  onPress={() => setModalCeromonyOpen(true)}
                />
              </View>
            ) : (
              <View
                style={{
                  width: '96%',
                  height: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  // top: height * 0.035,
                  top:
                    Platform.OS == 'ios'
                      ? height * 0.035
                      : height >= 780
                      ? height * 0.025
                      : height * 0.03,
                  flexDirection: 'row',
                }}>
                <Button2
                  width={280}
                  height={50}
                  buttonTitle={'Upgrade To Pro'}
                  img={ImageData.CROWN}
                  left={true}
                  size={20}
                  onPress={() => {
                    navigation.navigate('Subscription');
                  }}
                />
              </View>
            )}
            {/* <View
              style={{
                width: '96%',
                height: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                // top: height * 0.035,
                top:
                  Platform.OS == 'ios'
                    ? height * 0.035
                    : height >= 780
                    ? height * 0.025
                    : height * 0.03,
                flexDirection: 'row',
              }}>
              <Button2
                width={280}
                height={50}
                buttonTitle={'New Ceremony'}
                img={IconData.PLUS}
                left={true}
                size={20}
                onPress={() => setModalCeromonyOpen(true)}
              />
            </View> */}

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
        <CeremonyModal
          visible={modalCeremonyopen}
          onClose={() => {
            setModalCeromonyOpen(false);
          }}
        />
      </FastImage>
    </View>
  );
};

export default Ceremony;

const styles = StyleSheet.create({
  secondaryContainer: {
    // flex:1,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    width: '95%',
    height: 320, // or adjust based on your design
    alignItems: 'center',

    marginLeft: width * 0.025,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  footer: {
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  thirdBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: 10,
  },
  card: {
    // width: 310,
    backgroundColor: Color.BROWN3,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title1: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
    // lineHeight: 20,
  },
  label1: {
    fontSize: 12,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
  },
  progress: {
    marginVertical: 12,
    backgroundColor: '#d6d6d6',
  },
  footer2: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 16,
    fontFamily: Font.EBGaramond_Regular,
    color: Color.BROWN5,
  },
  countdown: {
    fontSize: 16,
    fontFamily: Font.EB_Garamond_Bold,
    color: Color.LIGHTGREEN,
  },
  progressWrapper: {
    borderWidth: 1,
    borderColor: Color.BROWN4,
    width: '100%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
    position: 'relative',
  },
  unfilledBar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Color.BROWN3,
    // borderRadius: 10,
  },
  filledBar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  badge: {
    width: 70,
    height: 20,
    borderRadius: 30,

    backgroundColor: Color.LIGHTBROWN2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
});
