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
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import {useDispatch, useSelector} from 'react-redux';
import {Calendar} from 'react-native-calendars';
import Button from '../../Component/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ActivityLoader from '../../Component/ActivityLoader';
import {setCeremonyInfo} from '../../redux/actions';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('window');
const Ceremony = () => {
  const [modalopen, setModalOpen] = useState(false);
  const [showProgress, setShowProgess] = useState(true);
  const [currentDat, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const dispatch = useDispatch();
  const existingCeremonies = useSelector(
    state => state.user?.ceremonyinfo || [],
  );

  const CeremonyModal = ({visible, onClose}) => {
    const [ceremonyName, setCeremonyName] = useState(null);
    const [loader, setLoader] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
      hideDatePicker();
    };

    const saveCeremony = () => {
      setLoader(true);

      try {
        if (ceremonyName && selectedDate) {
          const ceremonyData = {
            name: ceremonyName,
            CeremonyDate: selectedDate,
          };

          setTimeout(() => {
            try {
              dispatch?.(setCeremonyInfo(ceremonyData));
              onClose?.();
              setDatePickerVisibility?.(false);
            } catch (error) {
              console.error('Error in timeout block:', error);
              Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: error.message,
              });
            } finally {
              setLoader(false);
            }
          }, 3000);
        } else {
          setLoader(false);
          Toast.show({
            type: 'error',
            text1: 'Data Save failed',
            text2: 'Please enter your ceremony name and date',
            visibilityTime: 3000,
            position: 'top',
          });
          onClose?.();
          setDatePickerVisibility?.(false);
        }
      } catch (error) {
        console.error('Error in saveCeremony:', error);
        Toast.show({
          type: 'error',
          text1: 'Unexpected error',
          text2: error.message,
        });
        setLoader(false);
        onClose?.();
        setDatePickerVisibility?.(false);
      }
    };

    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ActivityLoader visible={loader} />
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
              <View style={styles.modalWrapper}>
                <ImageBackground
                  source={ImageData.MODAL}
                  style={styles.modalContainer}
                  imageStyle={styles.imageStyle}>
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
                      Add New Ceremony
                    </Text>
                    <TouchableOpacity
                      onPress={() => setModalOpen(false)}
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
                      marginVertical: height * 0.05,
                      // marginHorizontal: width * 0.03,
                      backgroundColor: Color.BROWN3,
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      value={ceremonyName}
                      onChangeText={text => setCeremonyName(text)}
                      placeholder=" Name"
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
                  <View
                    style={{
                      width: '90%',
                      height: 52,
                      borderRadius: 12,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: -height * 0.03,
                      paddingHorizontal: 10,
                      paddingRight: 10,
                      backgroundColor: Color.BROWN3,
                      alignSelf: 'center',
                    }}>
                    <TextInput
                      value={selectedDate}
                      editable={false}
                      placeholder="Date"
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
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={IconData.CALENDER}
                        style={{width: 24, height: 24}}
                      />
                    </TouchableOpacity>
                  </View>

                  <ImageBackground
                    source={ImageData.TABBACKGROUND}
                    style={styles.thirdBackground}
                    resizeMode="contain">
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
                        height={47}
                        size={16}
                        font={Font.EBGaramond_SemiBold}
                        onPress={() => {
                          saveCeremony();
                        }}
                        style={{width: '50%', zIndex: -1}}
                      />
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                display={Platform.OS === 'ios' ? 'inline' : 'default'} // optional but nice
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
  const getProgress = ceremonyDate => {
    const today = new Date(currentDat);
    const target = new Date(ceremonyDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const maxDays = 100;
    const diffDays = Math.max(
      Math.ceil((target - today) / (1000 * 60 * 60 * 24)),
      0,
    );

    const progress = 1 - Math.min(diffDays / maxDays, 1);

    return progress;
  };
  const renderItem = ({item, index}) => {
    const progress = getProgress(item?.CeremonyDate);
    const totalBarWidth = Dimensions.get('window').width * 0.82;
    const progressWidth = totalBarWidth * progress;
    const {diffDays, countData} = dayCount(item?.CeremonyDate);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title1}>{item?.name}</Text>
          <View
            style={{
              width: 70,
              height: 20,
              borderRadius: 30,
              backgroundColor: Color.LIGHTBROWN2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.label1}>
              {dayCalculate(item?.CeremonyDate)}
            </Text>
          </View>
        </View>
        {countData > 0 && (
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
        )}

        <View style={styles.footer2}>
          <Text style={styles.dateTime}>{item?.CeremonyDate}</Text>
          <View
            style={{
              height: 2,
              paddingLeft: 5,
              paddingRight: 5,
              width: 135,
              backgroundColor: Color.LIGHTBROWN2,
            }}
          />
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
          gap: 30,
        }}>
        <Image
          source={IconData.NODATA}
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: height * 0.2,
          }}
        />
        <Text style={{fontSize:24,fontFamily:Font.EBGaramond_SemiBold,color:Color.LIGHTGREEN}}>No Ceremonies Saved</Text>
      </View>
    );
  };
    const memoizedBackground = useMemo(() => ImageData.MAINBACKGROUND, []);
  return (
    <View style={styles.secondaryContainer}>
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

            <View
              style={{
                width: '96%',
                height: '63%',
                alignItems: 'center',
                alignSelf: 'center',
                top: -height * 0.03,
              }}>
              <FlatList
                data={existingCeremonies}
               
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{paddingBottom: 20}}
                 showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={emptyComponent}
              />
            </View>
            <View
              style={{
                width: '96%',
                height: '10%',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',

                flexDirection: 'row',
              }}>
              <Button2
                width={250}
                height={50}
                buttonTitle={'Add New Ceremony'}
                img={IconData.PLUS}
                left={true}
                size={20}
                onPress={() => setModalOpen(true)}
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
          visible={modalopen}
          onClose={() => {
            setModalOpen(false);
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
    height: 300, // or adjust based on your design
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
    width: 300,
    backgroundColor: Color.BROWN3,
    borderRadius: 10,
    padding: 16,
    marginVertical: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title1: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
    lineHeight: 24,
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
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
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
