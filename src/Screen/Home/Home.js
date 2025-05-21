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
import React, {useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import Button2 from '../../Component/Button2';
import {storage} from '../../Component/Storage';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';

const {width, height} = Dimensions.get('window');

const today = new Date().toISOString().split('T')[0];

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

  return (
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
            marginTop: '30%',
          }}>
          <Text style={styles.title2}>VineLight</Text>
        </View>
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 50}} showsVerticalScrollIndicator={false}>
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
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.calendarWrapper}>
                <Calendar
                  current={today}
                  onDayPress={day => setSelectedDate(day.dateString)}
                  hideExtraDays={true}
                  renderArrow={direction => (
                    <Text style={styles.arrow}>
                      {direction === 'left' ? '<' : '>'}
                    </Text>
                  )}
                  style={styles.calendar}
                  theme={{
                    calendarBackground: 'translucent',
                    textSectionTitleColor: Color?.LIGHTGREEN,
                    textMonthFontSize: 24,
                    textMonthFontFamily: Font?.EBGaramond_SemiBold,
                    textDayHeaderFontFamily: Font.EB_Garamond_Bold,
                    monthTextColor: '#2e2e1f',
                    // arrowColor: '#4a4a2f',
                    textDayFontFamily: Font?.EBGaramond_SemiBold,
                  }}
                  dayComponent={({date}) => {
                    const isSelected = date.dateString === selectedDate;

                    // const emoji = moodMap[date.dateString];
                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedDate(date.dateString)}
                        style={styles.dayContainer}>
                        <View
                          style={[
                            styles.circle,
                            isSelected && styles.selectedCircle,
                          ]}>
                          <Text
                            style={[
                              styles.dayText,
                              isSelected && styles.selectedText,
                            ]}>
                            {date.day}
                          </Text>
                        </View>
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
              backgroundColor:Color.BROWN3
            }}>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
              massa mi?
            </Text>
          </View>
          <View
            style={{
              width: '95%',
              height: 56,
              top: 20,

              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            }}>
            <Button2
              width={300}
              height={50}
              buttonTitle={'Add Journal Entry'}
              img={IconData.PLUS}
              left={true}
              size={20}
              onPress={() => console.log('Pressed')}
            />
          </View>
        </ScrollView>
      </ImageBackground>
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
    fontSize: 20,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',

    fontFamily: Font.EBGaramond_Regular,
  },

  calendarWrapper: {
    width: '100%',
    height: height * 0.35, // 77% of screen height
    overflow: 'hidden',
    backgroundColor: 'transparent',
        padding:0,
  },
  calendar: {
    width: '100%',
    height: height * 0.35, // 77% of screen height
    overflow: 'hidden',
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
});
