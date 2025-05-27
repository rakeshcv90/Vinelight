import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import ActivityLoader from '../../Component/ActivityLoader';
import Button from '../../Component/Button';
import TooltipModal from '../../Component/TooltipModal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteGoalByDate,
  deleteTaskById,
  setGaolData,
  updateAllGoalData,
  upDateGoalById,
} from '../../redux/actions';
import uuid from 'react-native-uuid';
import {getDatesForMultipleDaysOverMonths} from '../utils';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';

const {width, height} = Dimensions.get('window');

const Goal = () => {
  const [modalopen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const goalData = useSelector(state => state.user?.goalByDate || []);

  const [toolVisible, setToolVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const [selectedGoal, setSelectedGoal] = useState(null);
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
        <Text
          style={{
            fontSize: 24,
            fontFamily: Font.EBGaramond_SemiBold,
            color: Color.LIGHTGREEN,
          }}>
          No Goals Saved
        </Text>
      </View>
    );
  };

  const CeremonyModal = ({visible, onClose}) => {
    const [daysShow, setDayshow] = useState(true);
    const [goalName, setGoalName] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
      moment().format('YYYY-MM-DD'),
    );
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = date => {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      setSelectedDate(formattedDate);
      hideDatePicker();
    };
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [selectedMoods, setSelectedMoods] = useState([]);
    const dayOptions = [
      'Daily',
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];

    // const toggleMood = mood => {
    //   console.log("XZxcxxxcxzc",mood)
    //   // setSelectedMoods(prev =>
    //   //   prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood],
    //   // );
    // };
    const toggleMood = mood => {
      if (mood === 'Daily') {
        const allSelected = selectedMoods.length === dayOptions.length;
        setSelectedMoods(allSelected ? [] : [...dayOptions]);
      } else {
        let newSelection;
        if (selectedMoods.includes(mood)) {
          newSelection = selectedMoods.filter(m => m !== mood);
        } else {
          newSelection = [...selectedMoods, mood];
        }

        // Auto-add "Daily" if all others are selected
        const withoutDaily = dayOptions.filter(d => d !== 'Daily');
        const selectedWithoutDaily = newSelection.filter(d => d !== 'Daily');

        if (
          selectedWithoutDaily.length === withoutDaily.length &&
          !newSelection.includes('Daily')
        ) {
          newSelection.push('Daily');
        }

        // Remove "Daily" if not all selected
        if (
          selectedWithoutDaily.length < withoutDaily.length &&
          newSelection.includes('Daily')
        ) {
          newSelection = newSelection.filter(d => d !== 'Daily');
        }

        setSelectedMoods(newSelection);
      }
    };

    const saveGoalData = () => {
      if (goalName) {
        const date = selectedDate;
        const days = selectedMoods;
        const text = goalName;

        const response = insertTaskAcrossDates(dispatch, date, days, text);
        if (response > 0) {
          onClose();
          Toast.show({
            type: 'success',
            text1: 'Goal Saved',
            text2: `${response} task(s) added.`,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Please Select Goal Data',
          // text2: error.message,
        });
      }
    };
    const insertTaskAcrossDates = (dispatch, givenDate, dayNames, taskText) => {
      const allDates = new Set();
      allDates.add(givenDate);

      if (Array.isArray(dayNames) && dayNames.length > 0) {
        const extraDates = getDatesForMultipleDaysOverMonths(
          givenDate,
          dayNames,
          3,
        );

        extraDates.forEach(date => {
          allDates.add(date);
        });
      }

      // Dispatch task insertion for each unique date
      Array.from(allDates).forEach(date => {
        dispatch(
          setGaolData({
            date,
            task: {
              id: uuid.v4(), // make sure you're using react-native-uuid
              text: taskText,
              completed: false,
            },
          }),
        );
      });

      return allDates.size;
    };

    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
                        color: Color.LIGHTGREEN,
                      }}>
                      Add New Goal
                    </Text>
                    <TouchableOpacity
                      onPress={() => onClose()}
                      style={{position: 'absolute', right: 5}}>
                      <Image
                        source={IconData.CANCEL}
                        style={{width: 35, height: 35}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '95%',
                      alignItems: 'center',
                      marginTop: '2%',
                      borderWidth: 1,
                      alignSelf: 'center',
                      borderColor: Color.LIGHTGREEN,
                      backgroundColor: 'white',
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
                        width: '90%',
                        height: 120,
                        borderRadius: 12,

                        backgroundColor: 'white',
                      }}>
                      <TextInput
                        value={goalName}
                        autoFocus={true}
                        onChangeText={text => setGoalName(text)}
                        placeholder=" Name"
                        placeholderTextColor={Color.GREEN}
                        multiline={true}
                        textAlignVertical="top"
                        style={{
                          color: Color.LIGHTGREEN,
                          fontSize: 16,
                          fontFamily: Font.EBGaramond_Regular,
                        }}
                        selectionColor={Color.LIGHTGREEN}
                      />
                    </View>
                    <View
                      style={{
                        width: '100%',

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

                  {selectedMoods?.length > 0 ? (
                    <View
                      style={{
                        borderRadius: 24,
                        marginTop: 20,
                        marginHorizontal: 10,
                        padding: 15,
                        backgroundColor: Color.BROWN3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View style={{width: '10%', height: 24}}>
                        <Image
                          source={IconData.REPEAT}
                          style={{width: 24, height: 24}}
                          resizeMode="contain"
                        />
                      </View>
                      <View
                        style={{
                          width: '80%',
                          height: 24,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        {selectedMoods.map((day, index) => (
                          <Text
                            key={index}
                            style={{
                              fontSize: 14,
                              fontFamily: Font.EBGaramond_Regular,
                              right: 5,
                            }}>
                            {day}
                            {index !== selectedMoods.length - 1 ? ',' : ''}
                          </Text>
                        ))}
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedMoods([]);
                        }}
                        style={{
                          width: '10%',
                          height: 24,
                        }}>
                        <Image
                          source={IconData.CANCEL}
                          style={{width: 24, height: 24}}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        borderRadius: 24,
                        marginTop: 20,
                        marginHorizontal: 10,
                        padding: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 10,
                      }}></View>
                  )}

                  <ImageBackground
                    source={ImageData.TABBACKGROUND}
                    style={styles.thirdBackground}
                    resizeMode="contain">
                    <View
                      style={{
                        width: '95%',
                        height: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 20,
                        overflow: 'hidden',
                      }}>
                      <View
                        style={{
                          width: '70%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 10,
                          gap: 10,
                        }}>
                        <TouchableOpacity onPress={showDatePicker}>
                          <Image
                            source={IconData.CALENDER}
                            style={{width: 24, height: 24}}
                            tintColor={Color.BROWN4}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: Font.EBGaramond_SemiBold,
                            color: Color.BROWN4,
                          }}>
                          {/* 8th April 2025 */}
                          {selectedDate
                            ? moment(selectedDate).format('Do MMMM YYYY')
                            : ''}
                        </Text>
                        <TouchableOpacity onPress={showDatePicker}>
                          <Image
                            source={IconData.DROP}
                            style={{width: 15, height: 15}}
                            tintColor={Color.BROWN4}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setTooltipVisible(true)}>
                          <Image
                            source={IconData.REPEAT}
                            style={{width: 24, height: 24}}
                            tintColor={Color.BROWN4}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TooltipModal
                          visible={tooltipVisible}
                          options={dayOptions}
                          selectedOptions={selectedMoods}
                          onSelect={toggleMood}
                          onClose={() => setTooltipVisible(false)}
                        />
                      </View>
                      <View
                        style={{
                          width: '30%',
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
                            saveGoalData();
                          }}
                          style={{width: '50%', zIndex: -1}}
                        />
                      </View>
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

  const flattenGoalData = goalByDate => {
    const result = [];
    const sortedDates = Object.keys(goalByDate).sort();

    sortedDates.forEach(date => {
      result.push({type: 'header', date});

      goalByDate[date].tasks.forEach(task => {
        result.push({type: 'task', date, task});
      });
    });

    return result;
  };
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const updateTask = data => {
    console.log('Update', data?.id);
    dispatch(upDateGoalById(data?.id));
  };
  const deleteGoalDate = data => {
    dispatch(deleteGoalByDate(data?.date));
  };
  const deleteTask = data => {
    dispatch(deleteTaskById(data?.id));
  };
  const clearAllTasksForDate = data => {
    dispatch(updateAllGoalData(data?.date));
    // console.log('SDfdsfdsfdfds', data);
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
              <Text style={styles.subText}>Goals</Text>
            </View>

            <View
              style={{
                width: '96%',
                height: '63%',
                // alignItems: 'center',
                alignSelf: 'center',
                top: -height * 0.03,
              }}>
              {console.log('Ddddddd', goalData)}
              <FlatList
                data={flattenGoalData(goalData)}
                contentContainerStyle={{paddingBottom: 20}}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyComponent}
                keyExtractor={(item, index) =>
                  item.type === 'header'
                    ? `header-${item.date}`
                    : `task-${item.task.id}`
                }
                renderItem={({item, index}) => {
                  if (item.type === 'header') {
                    return (
                      <View
                        style={{
                          width: '100%',
                          height: 30,
                          marginTop: index === 0 ? 0 : 20,
                        }}>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.dateText}>
                            {formatDate(item.date)}
                          </Text>
                          <TouchableOpacity
                            onPressIn={event => {
                              const {pageX, pageY} = event.nativeEvent;
                              setTooltipPosition({x: pageX, y: pageY});
                              setSelectedGoal(item);
                              setToolVisible(true);
                            }}>
                            <Image
                              source={IconData.DOTS}
                              style={{width: 25, height: 25}}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: Color.BROWN2,
                            marginVertical: 5,
                          }}
                        />
                      </View>
                    );
                  }

                  const {task} = item;

                  return (
                    <View style={styles.taskRow}>
                      <TouchableOpacity
                        style={styles.iconWrap}
                        onPress={() => {
                          updateTask(task);
                        }}>
                        <Image
                          source={
                            task?.completed ? IconData.CHECK : IconData.UNCHECK
                          }
                          style={{width: 24, height: 24, marginRight: 20}}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.taskText,
                          task.completed && styles.completedTaskText,
                        ]}>
                        {task.text}
                      </Text>
                      <TouchableOpacity
                        style={styles.menuWrap}
                        onPress={() => {
                          deleteTask(task);
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
                width={200}
                height={50}
                buttonTitle={'New Goal'}
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

        {toolVisible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}>
            {/* Transparent touchable background to close tooltip */}
            <TouchableOpacity
              activeOpacity={1}
              style={{flex: 1}}
              onPress={() => setToolVisible(false)}
            />

            {/* Tooltip itself */}
            <View
              style={{
                position: 'absolute',
                top: tooltipPosition.y - 50,
                left: tooltipPosition.x - 230,
                width: 250,
                backgroundColor: Color.LIGHTGREEN,
                padding: 5,
                borderRadius: 10,
              }}>
              <View
                style={{
                  width: 215,
                  backgroundColor: Color.LIGHTGREEN,
                  padding: 5,
                  alignSelf: 'center',
                  borderRadius: 10,
                  borderColor: Color.BROWN4,
                  borderWidth: 2,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    clearAllTasksForDate(selectedGoal);
                    setToolVisible(false);
                  }}
                  style={{paddingVertical: 6, flexDirection: 'row', gap: 10}}>
                  <Image
                    source={IconData.CHECKALL}
                    style={{width: 20, height: 20, marginLeft: 5}}
                    resizeMode="contain"
                    tintColor={'#fff'}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: Font.EBGaramond_SemiBold,
                    }}>
                    Mark All As Complete
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    deleteGoalDate(selectedGoal);
                    setToolVisible(false);
                  }}
                  style={{paddingVertical: 6, flexDirection: 'row', gap: 10}}>
                  <Image
                    source={IconData.MENU}
                    style={{width: 20, height: 20, marginLeft: 5}}
                    resizeMode="contain"
                    tintColor={'#fff'}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: Font.EBGaramond_SemiBold,
                    }}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </FastImage>
    </View>
  );
};

export default Goal;
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
    height: 400, // or adjust based on your design
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
    // marginTop: 25,
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
  dateText: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
    // marginBottom: 8,
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
