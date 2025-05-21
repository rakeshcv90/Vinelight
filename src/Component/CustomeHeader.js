import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Color, Font, IconData} from '../../assets/Image';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const {width, height} = Dimensions.get('window');
const CustomeHeader = ({onClear, onDelete, selectedDate}) => {
  const navigation = useNavigation();

  const [toolVisible, setToolVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 50});
  return (
    <View
      style={{
        width: '100%',
        height: 52,
        padding: 10,

        top: height * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          width: 50,
          height: 50,
          backgroundColor: Color?.LIGHTGREEN,
          borderRadius: 25,
          alignSelf: 'center',
          marginVertical: '5%',
          borderWidth: 3,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          borderColor: Color?.BROWN2,
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: Color?.BROWN4,
            borderRadius: 20,
            alignSelf: 'center',
            marginVertical: '5%',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: Color?.BROWN2,
          }}>
          <Image
            source={IconData.BACK}
            tintColor={Color?.LIGHTGREEN}
            style={{width: 24, height: 24}}
          />
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: 228,
          height: 50,
          backgroundColor: Color?.LIGHTGREEN,
          borderRadius: 25,
          alignSelf: 'center',
          marginVertical: '5%',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: Color?.BROWN2,
        }}>
        <Text
          style={{
            fontFamily: Font.EBGaramond_SemiBold,
            fontSize: 20,
            color: Color.BROWN6,
          }}>
          {selectedDate ? moment(selectedDate).format('Do MMMM YYYY') : ''}
        </Text>
      </View>
      <TouchableOpacity
        onPress={event => {
          const {pageX, pageY} = event.nativeEvent;
          setTooltipPosition({x: pageX, y: pageY});

          setToolVisible(true);
        }}
        style={{
          width: 50,
          height: 50,
          backgroundColor: Color?.LIGHTGREEN,
          borderRadius: 25,
          alignSelf: 'center',
          marginVertical: '5%',
          borderWidth: 3,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: Color?.BROWN2,
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: Color?.BROWN4,
            borderRadius: 20,
            alignSelf: 'center',
            marginVertical: '5%',
            borderWidth: 3,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: Color?.BROWN2,
          }}>
          <Image
            source={IconData.DOTS}
            tintColor={Color?.LIGHTGREEN}
            style={{width: 24, height: 24}}
          />
        </View>
      </TouchableOpacity>

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
              top: tooltipPosition.y + 10,
              left: tooltipPosition.x - 200,
              //   width: 220,
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
                  onClear();
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

              <TouchableOpacity
                onPress={() => {
                  onDelete();
                  setToolVisible(true);
                }}
                style={{paddingVertical: 6, flexDirection: 'row', gap: 10}}>
                <Image
                  source={IconData.DELETE}
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
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomeHeader;
