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
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import ActivityLoader from '../../Component/ActivityLoader';
import Button from '../../Component/Button';
import TooltipModal from '../../Component/TooltipModal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {InteractionManager} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteGoalByDate,
  deleteTaskById,
  deleteTaskByRepetedId,
  setGaolData,
  updateAllGoalData,
  upDateGoalById,
} from '../../redux/actions';
import uuid from 'react-native-uuid';
import {getDatesForMultipleDaysOverMonths} from '../utils';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import DeleteModal from '../../Component/DeleteModal';
import {useNavigation, useRoute} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const Goal = ({isActive}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const DataCurrent = route?.params?.modalOpenData;

  const [modalopen, setModalOpen] = useState(
    DataCurrent == undefined ? false : true,
  );
  const dispatch = useDispatch();
  const goalData = useSelector(state => state.user?.goalByDate || []);
  const [deleteModalData, setDeleteModaldata] = useState(false);
  const [toolGoalVisible, setToolGoalVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [SelectedData, setSelectedData] = useState(null);
  const goalInputRef = useRef(null);
  const [currentDAte, setCurrentDAte] = useState(
    moment().local().format('YYYY-MM-DD'),
  );

  const [currentdate, setCurrentData] = useState(
    DataCurrent == undefined
      ? moment().local().format('YYYY-MM-DD')
      : DataCurrent,
  );
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
          No goals data available.
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (!isActive) {
      setModalVisible(false), setToolGoalVisible(false);
    }
  }, [isActive]);
  const GoalModal = ({visible, onClose}) => {
    const [daysShow, setDayshow] = useState(new Date());
    const [goalName, setGoalName] = useState(null);
    // const [selectedDate, setSelectedDate] = useState(
    //   moment().format('YYYY-MM-DD'),
    // );
    const [selectedDate, setSelectedDate] = useState(
      DataCurrent == undefined
        ? moment().local().format('YYYY-MM-DD')
        : route?.params?.selectedDate,
    );

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = date => {
      Keyboard.dismiss();
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
    const safeAction = action => {
      Keyboard.dismiss();
      InteractionManager.runAfterInteractions(() => {
        action();
      });
    };
    const showDatePicker1 = () => {
      Keyboard.dismiss(); // close keyboard before opening picker
      setDatePickerVisibility(true);
    };
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

    // const toggleMood = mood => {
    //   const weekDays = dayOptions.filter(d => d !== 'Daily');

    //   if (mood === 'Daily') {
    //     const allSelected = selectedMoods.length === weekDays.length;
    //     setSelectedMoods(allSelected ? [] : weekDays);
    //   } else {
    //     let newSelection;

    //     if (selectedMoods.includes(mood)) {
    //       newSelection = selectedMoods.filter(m => m !== mood);
    //     } else {
    //       newSelection = [...selectedMoods, mood];
    //     }

    //     setSelectedMoods(newSelection);
    //   }
    // };

    const saveGoalData = () => {
      if (goalName) {
        const date = selectedDate;
        const days = selectedMoods;
        const text = goalName;

        const response = insertTaskAcrossDates(dispatch, date, days, text);
        if (response > 0) {
          onClose();

          Toast.show({
            type: 'custom',
            position: 'top',
            props: {
              icon: IconData.SUCC, // your custom image
              text: `Goal saved!`,
            },
          });
          navigation.setParams({modalOpenData: null, selectedDate: null});
          setModalOpen(false); // update local state as well
        }
      } else {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Please enter the goal first to save the goal.',
          },
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

      const taskCount = allDates.size;
      const repeatId = taskCount > 1 ? uuid.v4() : null;
      Array.from(allDates).forEach(date => {
        dispatch(
          setGaolData({
            date,
            task: {
              id: uuid.v4(), // make sure you're using react-native-uuid
              text: taskText,
              completed: false,
              ...(repeatId && {repeatId}),
            },
          }),
        );
      });

      return taskCount;
    };
    const isValidDate = date => {
      return date instanceof Date && !isNaN(date);
    };
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        onDismiss={onClose}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
              keyboardShouldPersistTaps="handled">
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
                      New Goal
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

                    {/* <View
                      style={{
                        width: '90%',
                        height: 120,
                        borderRadius: 12,

                        backgroundColor: 'white',
                      }}>
                      <TextInput
                        value={goalName}
                        // autoFocus={true}
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
                    </View> */}
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => goalInputRef.current?.focus()}
                      style={{
                        width: '90%',
                        height: 120,
                        borderRadius: 12,
                        backgroundColor: 'white',
                      }}>
                      <TextInput
                        ref={goalInputRef}
                        value={goalName}
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
                        // selectionColor={Color.LIGHTGREEN}
                      />
                    </TouchableOpacity>
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
                        <TouchableOpacity
                          // onPress={() => safeAction(showDatePicker)}
                          onPress={showDatePicker1}>
                          <Image
                            source={IconData.CALENDER}
                            style={{width: 24, height: 24}}
                            tintColor={Color.BROWN4}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          // onPress={() => safeAction(showDatePicker)}
                          onPress={showDatePicker1}>
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
                        </TouchableOpacity>
                        <TouchableOpacity
                          // onPress={() => safeAction(showDatePicker)}
                          onPress={showDatePicker1}>
                          <Image
                            source={IconData.DROP}
                            style={{width: 15, height: 15}}
                            tintColor={Color.BROWN4}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            safeAction(() => setTooltipVisible(true))
                          }>
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
                     {console.log("dddddddd",height)}
                      <View
                        // style={{
                        //   right: height <= 900 ? height*0.0045 : 0,
                        // }}
                            style={{
                          right: height <= 800 ? height*0.0045 : 0,
                        }}
                        >
                        <Button
                          img={IconData.SAVE}
                          text="Save"
                          left={true}
                          width={91}
                          backgroundColor={Color.BROWN4}
                          height={40}
                          size={16}
                          font={Font.EBGaramond_SemiBold}
                          onPress={() => {
                            Keyboard.dismiss();
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
                date={isValidDate(daysShow) ? new Date(daysShow) : new Date()}
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
  // const formatDate = dateStr => {
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString('en-GB', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //   });
  // };

  const formatDate = dateStr => {
    const date = new Date(`${dateStr}T12:00:00`); // Add time to avoid timezone offset
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const updateTask = data => {
    if (data?.date <= currentDAte) {
      dispatch(upDateGoalById(data?.task?.id));
    } else {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'You cannot mark a goal that is set for a future date.',
        },
      });
    }
  };
  const deleteGoalDate = data => {
    setDeleteModaldata(false);
    dispatch(deleteGoalByDate(data?.date));
    Toast.show({
      type: 'custom',
      position: 'top',
      props: {
        icon: IconData.DEL, // your custom image
        text: 'Goal deleted successfully',
      },
    });
  };
  const deleteTask = data => {
    setDeleteModaldata(false);
    dispatch(deleteTaskById(data?.id));

    Toast.show({
      type: 'custom',
      position: 'top',
      props: {
        icon: IconData.DEL, // your custom image
        text: 'Goal deleted successfully',
      },
    });
  };
  const clearAllTasksForDate = data => {
    if (data?.date <= currentDAte) {
      dispatch(updateAllGoalData(data?.date));
    } else {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'You cannot mark a goal that is set for a future date.',
        },
      });
    }

    // dispatch(updateAllGoalData(data?.date));
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
                            {/* {item.date} */}
                          </Text>
                          <TouchableOpacity
                            onPressIn={event => {
                              const {pageX, pageY} = event.nativeEvent;
                              setTooltipPosition({x: pageX, y: pageY});
                              setSelectedGoal(item);
                              setToolGoalVisible(true);
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
                          updateTask(item);
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
                          if (task?.repeatId == undefined) {
                            deleteTask(task);
                          } else {
                            setSelectedData(task);

                            setDeleteModaldata(true);
                          }
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
                // top: height * 0.036,
                top:
                  Platform.OS == 'ios'
                    ? height * 0.035
                    : height >= 780
                    ? height * 0.025
                    : height * 0.035,
                flexDirection: 'row',
              }}>
              <Button2
                width={280}
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
        <GoalModal
          visible={modalopen}
          onClose={() => {
            setModalOpen(false);
          }}
        />

        {toolGoalVisible && (
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
              onPress={() => setToolGoalVisible(false)}
            />

            {/* Tooltip itself */}
            <View
              style={{
                position: 'absolute',
                top: tooltipPosition.y - 45,
                left: tooltipPosition.x - 230,
                width: 220,
                backgroundColor: Color.LIGHTGREEN,
                padding: 5,
                borderRadius: 10,
              }}>
              <View
                style={{
                  width: 210,
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
                    setToolGoalVisible(false);
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
                    setToolGoalVisible(false);
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
        {deleteModalData && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9999,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={ImageData.MODAL}
              style={{
                width: 350,
                padding: 30,
                borderRadius: 16,
                alignItems: 'center',
              }}
              imageStyle={{resizeMode: 'cover', borderRadius: 16}}>
              <TouchableOpacity
                onPress={() => setDeleteModaldata(null)}
                style={{position: 'absolute', top: 12, right: 12, padding: 4}}>
                <Image
                  source={IconData.CANCEL}
                  style={{width: 35, height: 35}}
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 24,
                  color: Color.LIGHTGREEN,
                  fontFamily: Font.EBGaramond_SemiBold,
                  marginTop: 12,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                Delete Repeating Goal?
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: Color.LIGHTGREEN,
                  fontFamily: Font.EBGaramond_Regular,
                  textAlign: 'center',
                  marginBottom: 20,
                  lineHeight: 24,
                }}>
                This is a repeating task. Do you want to delete just this entry
                or all the future entries too?
              </Text>

              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#3e3e2e',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 24,
                  }}
                  onPress={() => {
                    dispatch(deleteTaskByRepetedId(SelectedData?.repeatId));
                    setDeleteModaldata(false);
                  }}>
                  <Text style={styles.buttonText}>Delete All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: Color.LIGHTGREEN,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    // setdeleteModalVisible(false);
                    deleteTask(SelectedData);
                  }}>
                  <Image
                    source={IconData.DELETE}
                    style={{width: 25, height: 25}}
                  />
                  <Text style={styles.buttonText}> Delete Only This</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        )}
      </FastImage>

      {/* <DeleteModal
        visible={deleteModalData}
        onClose={() => setDeleteModaldata(false)}
        // onDeleteAll={() => {
        //   Toast.show({
        //     type: 'custom',
        //     position: 'top',
        //     props: {
        //       icon: IconData.DEL, // your custom image
        //       text: 'Goal deleted successfully',
        //     },
        //   });
        //   setTimeout(() => {
        //     dispatch(deleteTaskByRepetedId(SelectedData?.repeatId));
        //   }, 500);

        //   setModalVisible(false);
        // }}
        // onDeleteOne={() => {
        //   setModalVisible(false);
        //   deleteTask(SelectedData);
        // }}
      /> */}
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

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletemodal: {
    padding: 40,
    width: 350,
    elevation: 10,
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,

    color: Color.LIGHTGREEN,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  message: {
    fontSize: 16,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_Regular,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  deleteAllBtn: {
    backgroundColor: '#3e3e2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  deleteOneBtn: {
    backgroundColor: Color.LIGHTGREEN,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
  },
  buttonText: {
    color: Color.BROWN3,
    fontFamily: Font.EBGaramond_SemiBold,
    fontSize: 16,
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: 16,
  },
});
