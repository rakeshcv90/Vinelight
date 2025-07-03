import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import Button2 from '../../Component/Button2';
import {storage} from '../../Component/Storage';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import {callApi} from '../../Component/ApiCall';
import {Api} from '../../Api';
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {moodData} from '../../Component/Mood';
import moment from 'moment-timezone';

const {width, height} = Dimensions.get('window');
// const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const today = new Date().toISOString().split('T')[0];

const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const today = moment().tz(deviceTimeZone).format('YYYY-MM-DD');

LocaleConfig.locales['custom'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], // 👈 First letters only
  today: 'Today',
};

LocaleConfig.defaultLocale = 'custom';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(today);

  const navigation = useNavigation();
  const prompt = useSelector(state => state?.user?.getDailyPrompt);
  const getJournalData = useSelector(state => state?.user?.getJournalData);
  const memoizedBackground = useMemo(() => ImageData.MAINBACKGROUND, []);
  const [editSet, setEditSet] = useState(false);
  const markedJournalDates = useMemo(() => {
    const marks = {};
    // const todayDate = today
    const todayDate = new Date();

    getJournalData?.forEach(entry => {
      const dateStr = entry.currentDat;
      const entryDate = new Date(dateStr);

      if (entryDate <= todayDate) {
        marks[dateStr] = {
          marked: true,
          dotColor: Color.LIGHTGREEN,
          selectedColor: 'transparent',
          moodName: entry.mood?.name || '',
        };
      }
    });

    // Always highlight the selected date
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: Color.LIGHTGREEN,
    };

    return marks;
  }, [getJournalData, selectedDate]);

  const getDayPresh = date => {
    if (date > today) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'You cannot select future date',
        },
      });
      return;
    }
    setSelectedDate(date);
    const mood = getJournalData?.filter(item => {
      return item?.currentDat === date;
    });

    if (mood?.length > 0) {
      navigation.navigate('DisplayJournalEntry', {
        journal: mood[0],
      });
    } else {
      // Toast.show({
      //   type: 'custom',
      //   position: 'top',
      //   props: {
      //     icon: IconData.ERR, // your custom image
      //     text: 'No journal entry data available for this selected date.',
      //   },
      // });
      if (date <= today) {
        navigation.navigate('CreateJournalEntry', {
          prompttype: false,
          selectedDate: date,
        });
      } else {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Journal entries cannot be created for future dates.',
          },
        });
      }
    }
  };

  const getemojyItem = dataItem => {
    const mood = moodData?.filter(item => {
      return item?.name === dataItem;
    });

    return mood[0]?.Image;
  };
  const onclickData = () => {
    const mood = getJournalData?.filter(item => {
      return item?.currentDat === today;
    });

    // navigation.navigate('CreateJournalEntry', {
    //   prompttype: false,
    //   selectedDate: selectedDate,
    // });
  };

  useEffect(() => {
    const clickedDateData = getJournalData.find(d => d?.currentDat === today);
    if (clickedDateData == undefined) {
      setEditSet(false);
    } else {
      setEditSet(true);
    }
  }, [getJournalData]);
  return (
    <View style={styles.secondaryContainer}>
      <FastImage
        // source={ImageData.MAINBACKGROUND}
        source={memoizedBackground}
        style={styles.secondaryBackground}
        // resizeMode="stretch",
        resizeMode={FastImage.resizeMode.stretch}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30%',
          }}>
          <Text style={styles.title2}>VineLight</Text>
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '95%',

              alignItems: 'center',
              marginTop: '5%',

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
                <FastImage
                  source={ImageData.LEFT}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{width: 31, height: 31}}
                />
                <FastImage
                  source={ImageData.RIGHT}
                  resizeMode={FastImage.resizeMode.contain}
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.calendarWrapper}>
                <Calendar
                  current={today}
                  onDayPress={day => getDayPresh(date.dateString)}
                  hideExtraDays={true}
                  renderArrow={direction => (
                    <Image
                      source={IconData.CALENDERDROP}
                      style={{
                        width: 15,
                        height: 15,
                        transform: [
                          {rotate: direction === 'left' ? '180deg' : '0deg'},
                        ],
                      }}
                      resizeMode="contain"
                      tintColor={Color.LIGHTGREEN}
                    />
                  )}
                  markedDates={markedJournalDates}
                  style={styles.calendar}
                  theme={{
                    calendarBackground: 'translucent',
                    textSectionTitleColor: Color?.LIGHTGREEN,
                    textMonthFontSize: 22,
                    textMonthFontFamily: Font?.EBGaramond_SemiBold,
                    textDayHeaderFontFamily: Font.EB_Garamond_Bold,
                    monthTextColor: '#2e2e1f',

                    textDayFontFamily: Font?.EBGaramond_SemiBold,
                  }}
                  // dayComponent={({date}) => {
                  //   const isSelected = date.dateString === selectedDate;
                  //   const marked = markedJournalDates?.[date.dateString];

                  //   const selectedStyle = marked?.selectedColor
                  //     ? {backgroundColor: marked.selectedColor}
                  //     : null;

                  //   const dotStyle = marked?.dotColor
                  //     ? {
                  //         width: 6,
                  //         height: 6,
                  //         borderRadius: 3,
                  //         backgroundColor: marked.dotColor,
                  //         marginTop: 2,
                  //         alignSelf: 'center',
                  //       }
                  //     : null;

                  //   const moodEmoji = marked?.moodName
                  //     ? getemojyItem(marked.moodName) || ''
                  //     : '';
                  //   return (
                  //     <TouchableOpacity
                  //       onPress={() => getDayPresh(date.dateString)}
                  //       style={styles.dayContainer}>
                  //       {moodEmoji ? (
                  //         <Image
                  //           source={moodEmoji}
                  //           style={{width: 24, height: 24}}
                  //           tintColor={Color.LIGHTGREEN}
                  //         />
                  //       ) : (
                  //         <View
                  //           style={[
                  //             styles.circle,
                  //             isSelected && styles.selectedCircle,
                  //             selectedStyle,
                  //           ]}>
                  //           <Text
                  //             style={[
                  //               styles.dayText,
                  //               isSelected && styles.selectedText,
                  //             ]}>
                  //             {date.day}
                  //           </Text>
                  //         </View>
                  //       )}
                  //     </TouchableOpacity>
                  //   );
                  // }}
                  dayComponent={({date}) => {
                    const isToday = date.dateString === today;
                    const marked = markedJournalDates?.[date.dateString];

                    const selectedStyle =
                      isToday && marked?.selectedColor
                        ? {backgroundColor: marked.selectedColor}
                        : null;

                    const dotStyle = marked?.dotColor
                      ? {
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: marked.dotColor,
                          marginTop: 2,
                          alignSelf: 'center',
                        }
                      : null;

                    const moodEmoji = marked?.moodName
                      ? getemojyItem(marked.moodName) || ''
                      : '';

                    return (
                      <TouchableOpacity
                        onPress={() => getDayPresh(date.dateString)}
                        style={styles.dayContainer}>
                        {moodEmoji ? (
                          <Image
                            source={moodEmoji}
                            style={{width: 24, height: 24}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        ) : (
                          <View
                            style={[
                              styles.circle,
                              isToday && styles.selectedCircle,
                              selectedStyle,
                            ]}>
                            <Text
                              style={[
                                styles.dayText,
                                isToday && styles.selectedText,
                              ]}>
                              {date.day}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                // height: '10%',
                flexDirection: 'row',

                justifyContent: 'space-between',
              }}>
              <>
                <FastImage
                  source={ImageData.BACKLEFT}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: 31,
                    height: 31,
                  }}
                />

                <FastImage
                  source={ImageData.BACKRIGHT}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{
                    width: 31,
                    height: 31,
                  }}
                />
              </>
            </View>
          </View>
          <Text style={styles.subText}>Journal prompt of the day</Text>
          <View
            style={{
              width: '90%',
              height: 72,
              borderRadius: 12,
              borderWidth: 1,
              padding: 12,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Color.BROWN2,
              backgroundColor: Color.BROWN3,
            }}>
            <ScrollView
              style={styles.scrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  const mood = getJournalData?.filter(item => {
                    return item?.currentDat === today;
                  });
                  if (mood?.length > 0) {
                    Toast.show({
                      type: 'custom',
                      position: 'top',
                      props: {
                        icon: IconData.ERR, // your custom image
                        text: `You already created a prompt for today's date`,
                      },
                    });
                  } else {
                    navigation.navigate('CreateJournalEntry', {
                      prompttype: true,
                      selectedDate: selectedDate,
                    });
                  }
                }}>
                <Text style={styles.text}>{prompt?.description}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View
            style={{
              top: 20,

              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            {!editSet ? (
              <Button2
                width={250}
                height={50}
                buttonTitle={'New Journal Entry'}
                img={IconData.PLUS}
                left={true}
                size={20}
                onPress={() =>
                  navigation.navigate('CreateJournalEntry', {prompttype: false})
                }
              />
            ) : (
              <Button2
                width={250}
                height={50}
                buttonTitle={'Edit Journal Entry'}
                img={IconData.PEN2}
                left={true}
                size={20}
                onPress={() => {
                  const clickedDateData = getJournalData.find(
                    d => d?.currentDat === today,
                  );

                  navigation.navigate('EditJournalEntry', {
                    journalData: clickedDateData,
                  });
                }}
              />
            )}
          </View>
        </ScrollView>
      </FastImage>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  secondaryContainer: {
    // flex:1,
    width: '90%',
    height: '85%',
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  title2: {
    fontSize: 48,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',

    fontFamily: 'EBGaramond-Regular',
  },
  subText: {
    fontSize: 20,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    marginVertical: height * 0.02,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',

    fontFamily: Font.EBGaramond_Regular,
  },

  calendarWrapper: {
    width: '100%',
    height: height * 0.33, // 77% of screen height
    overflow: 'hidden',
    backgroundColor: 'transparent',
    padding: 0,
  },
  calendar: {
    width: '100%',
    height: height * 0.35, // 77% of screen height
    overflow: 'hidden',
    marginTop: -height * 0.02,
    backgroundColor: 'transparent',
  },
  arrow: {
    fontSize: 20,
    color: '#4a4a2f',
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#2e2e1f',
  },

  dayText: {
    fontSize: 14,
    color: '#2e2e1f',
    fontFamily: Font.EB_Garamond_Bold,
  },
  selectedText: {
    color: '#f3e7c1',
  },
  scrollView: {
    flexGrow: 0,
  },
});
