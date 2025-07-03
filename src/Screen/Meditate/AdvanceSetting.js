import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import FastImage from 'react-native-fast-image';
import {callApi} from '../../Component/ApiCall';
import {Api} from '../../Api';
import {RadioButton} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import uuid from 'react-native-uuid';
import ActivityLoader from '../../Component/ActivityLoader';
import Toast from 'react-native-toast-message';
import {setCustomeMedidation} from '../../redux/actions';
import DropDown from '../../Component/DropDown';
import useNativeMusicPlayer from '../../Component/NativeusicPlayer';
import KeepAwake from 'react-native-keep-awake';
import {SafeAreaView} from 'react-native-safe-area-context';
const {width, height} = Dimensions.get('window');

const SaveAdvanceSoundModal = ({
  visible,
  onClose,
  soundName,
  setSoundName,
  description,
  setDescription,
  onSave,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={[styles.modalWrapper, {height: 350}]}>
              <ImageBackground
                source={ImageData.MODAL}
                style={styles.modalContainer}
                imageStyle={styles.imageStyle}>
                <View style={styles.header}>
                  <Text style={styles.title}>Save Meditation</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}>
                    <Image
                      source={IconData.CANCEL}
                      style={{width: 35, height: 35}}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '75%',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    // top: -20,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      height: 52,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: Color.BROWN2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: height * 0.01,

                      backgroundColor: Color.BROWN3,
                    }}>
                    <TextInput
                      value={soundName}
                      onChangeText={text => setSoundName(text)}
                      placeholder="Name"
                      autoFocus
                      placeholderTextColor={Color.BROWN5}
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
                      height: 120,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: Color.BROWN2,
                      marginHorizontal: width * 0.03,
                      backgroundColor: Color.BROWN3,
                      padding: 10,
                    }}>
                    <TextInput
                      value={description}
                      onChangeText={text => setDescription(text)}
                      placeholder="Description"
                      placeholderTextColor={Color.BROWN5}
                      style={{
                        width: '100%',
                        height: '100%',
                        color: Color.LIGHTGREEN,
                        fontSize: 16,
                        fontFamily: Font.EBGaramond_Regular,
                        textAlignVertical: 'top', // <== important for multiline
                      }}
                      selectionColor={Color.LIGHTGREEN}
                      multiline={true}
                      numberOfLines={4} // optional
                    />
                  </View>
                </View>

                <ImageBackground
                  source={ImageData.TABBACKGROUND}
                  style={styles.bottomFixedBackground}
                  resizeMode="contain">
                  <View style={styles.saveButtonContainer}>
                    <Button
                      img={IconData.SAVE}
                      text="Save"
                      left={true}
                      width={91}
                      size={16}
                      backgroundColor={Color.BROWN4}
                      height={40}
                      font={Font.EBGaramond_SemiBold}
                      onPress={() => {
                        if (soundName && description) {
                          onSave();
                        } else {
                          Toast.show({
                            type: 'custom',
                            position: 'top',
                            props: {
                              icon: IconData.ERR, // your custom image
                              text: 'Meditation name and description required',
                            },
                          });
                        }
                      }}
                      style={{width: '50%'}}
                    />
                  </View>
                </ImageBackground>
              </ImageBackground>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const AdvanceSetting = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [modalopen, setModalOpen] = useState(false);
  const [modalopen1, setModalOpen1] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [soundName, setSoundName] = useState(null);
  const [description, setDescription] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectTime, setselectTime] = useState(0);
  useEffect(() => {
    KeepAwake.activate(); // Prevent screen sleep when this screen is active

    return () => {
      KeepAwake.deactivate(); // Clean up on unmount
    };
  }, []);
  const [time, setTime] = useState({
    pre: {second: 0, song: '', songName: ''},
    med: {minute: '', second: 0},
    int: {minute: '', second: 0, song: '', songName: ''},
    end: {song: '', songName: ''},
    res: {second: 0, song: '', songName: ''},
    user: {name: ''},
    start: {song: '', songName: ''},
  });

  const updateTime = (key, unit, value) => {
    if (!key || typeof key !== 'string') {
      console.warn('Invalid or missing key in updateTime:', key);
      return;
    }

    setTime(prev => {
      const existing = prev[key] || {
        minute: '',
        second: '',
        song: '',
        songName: '',
      };

      return {
        ...prev,
        [key]: {
          ...existing,
          [unit]: value,
        },
      };
    });
  };

  const SoundModal = ({visible, onClose}) => {
    const [sound, setSound] = useState([]);
    const [music, setmusic] = useState();
    const [selectedValue, setSelectedValue] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const {
      pauseMusic,
      playMusic,
      stopMusic,
      seekTo,
      currentTime,
      stopMusicAndReset,
      releaseMusic,
    } = useNativeMusicPlayer({
      song1: selectedValue?.music_path,
      pause: false,
      getSoundOffOn: true,
      restStart: true,
    });

    useEffect(() => {
      fetchData();
    }, []);
    const fetchData = async () => {
      try {
        const data = await callApi(Api.SOUND);
        setSound(data);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    const handleSave = () => {
      const selected = sound.find(item => item.id === selectedValue?.id);

      if (!selected) {
        console.warn('No sound selected.');
        return;
      }

      if (!activeKey || typeof activeKey !== 'string') {
        console.warn('Invalid activeKey:', activeKey);
        return;
      }

      updateTime(activeKey, 'song', selected.music_path);
      updateTime(activeKey, 'songName', selected.name);

      setModalOpen(false);
    };
    const emptyComponent = () => {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <Image
            source={IconData.NODATA}
            resizeMode="contain"
            style={{
              width: width * 0.3,
              height: height * 0.15,
            }}
          />
        </View>
      );
    };

    useEffect(() => {
      console.log('Selected Music Path:', selectedValue?.music_path);
      const playSelectedSound = async () => {
        if (!selectedValue?.music_path) return;

        setIsPlaying(true);
        try {
          await playMusic('player1', selectedValue.music_path); // ✅ Play new
        } catch (err) {
          console.error('Playback error:', err);
        } finally {
          setIsPlaying(false);
        }
      };

      playSelectedSound();
    }, [selectedValue]);
    const renderItem = ({item, index}) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => setSelectedValue(item)}
          activeOpacity={0.8}>
          <View style={styles.content}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => setSelectedValue(item)}
              activeOpacity={0.8}>
              <RadioButton
                value={item.id}
                status={selectedValue?.id == item?.id ? 'checked' : 'unchecked'}
                onPress={() => setSelectedValue(item)}
                color={'red'}
                uncheckedColor="gray"
              />
              <Text style={styles.title}>{item?.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                releaseMusic('player1'); // Stop previous
                playMusic('player1');
              }}>
              <Image source={IconData.SOUND} style={{width: 24, height: 24}} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalWrapper}>
            <View
              // source={ImageData.MODAL}
              style={styles.modalContainer}
              // imageStyle={styles.imageStyle}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Sounds</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Image
                    source={IconData.CANCEL}
                    style={{width: 35, height: 35}}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '96%',
                  height: '75%',

                  alignSelf: 'center',
                  // top: -20,
                }}>
                <FlatList
                  data={sound}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom: 20}}
                  ListEmptyComponent={emptyComponent}
                  renderItem={renderItem}
                />
              </View>

              <ImageBackground
                source={ImageData.TABBACKGROUND}
                style={styles.bottomFixedBackground}
                resizeMode="contain">
                <View style={styles.saveButtonContainer}>
                  <Button
                    img={IconData.SAVE}
                    text="Save"
                    left={true}
                    width={91}
                    size={16}
                    backgroundColor={Color.BROWN4}
                    height={40}
                    font={Font.EBGaramond_SemiBold}
                    onPress={handleSave}
                    style={{width: '50%'}}
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const saveCustomeMedidation = () => {
    const missingFields = validateFields(time);

    if (missingFields.length > 0) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: `Missing: ${missingFields[0]}${
            missingFields.length > 1 ? ' and more' : ''
          }`,
        },
      });
      return;
    }

    if (isIntervalGreaterThanMeditation()) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'Interval time must be less than total meditation time',
        },
      });
      console.warn('Interval time must be less than meditation time');
      return;
    }

    const newMeditation = {
      id: uuid.v4(),
      timeData: time, // optional if you want to save
    };
    setTimeout(() => {
      dispatch(setCustomeMedidation(newMeditation));

      setLoader(false);

      // Reset form
      setTime({
        pre: {second: 0, song: '', songName: ''},
        med: {minute: '', second: 0, song: '', songName: ''},
        int: {minute: '', second: 0, song: '', songName: ''},
        end: {song: '', songName: ''},
        res: {second: 0, song: '', songName: ''},
        user: {name: ''},
        start: {song: '', songName: ''},
      });
    }, 300);
    // navigation.navigate('Meditation');
    Toast.show({
      type: 'custom',
      position: 'top',
      props: {
        icon: IconData.SUCC, // your custom image
        text: 'Meditation Saved!',
      },
    });
    navigation.navigate('MainPage', {initialTab: 'Meditate'});
  };

  const isIntervalGreaterThanMeditation = () => {
    const medMin = parseInt(time?.med?.minute || '0', 10);
    const medSec = parseInt(time?.med?.second || '0', 10);
    const intMin = parseInt(time?.int?.minute || '0', 10);
    const intSec = parseInt(time?.int?.second || '0', 10);

    const medTotal = medMin * 60 + medSec;
    const intTotal = intMin * 60 + intSec;

    return intTotal >= medTotal;
  };

  // const validateFields = data => {
  //   const missingFields = [];

  //   for (let section in data) {
  //     const fields = data[section];
  //     for (let key in fields) {
  //       if (fields[key] === '' || fields[key] == null) {
  //         missingFields.push(`${section} → ${key}`);
  //       }
  //     }
  //   }

  //   return missingFields;
  // };

  const validateFields = data => {
    const missingFields = [];

    // Validate meditation time
    const medMin = Number(data.med?.minute || 0);
    const medSec = Number(data.med?.second || 0);
    if (medMin <= 0 && medSec <= 0) {
      missingFields.push('Meditation time');
    }

    // Validate required single fields
    if (!data.start?.song) missingFields.push('Start Chime');
    if (!data.end?.song) missingFields.push('End Alert');
    if (!data.user?.name) missingFields.push('Meditation Name');

    return missingFields;
  };
  const startMedidation = itemData => {
    const missingFields = validateFields(time);

    if (missingFields.length > 0) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: `Missing ${missingFields[0]}`,
        },
      });
      return;
    }
    if (isIntervalGreaterThanMeditation()) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'Interval time must be less than total meditation time',
        },
      });
      console.warn('Interval time must be less than meditation time');
      return;
    }

    setTime({
      pre: {second: '', song: '', songName: ''},
      med: {minute: '', second: '', song: '', songName: ''},
      int: {minute: '', second: '', song: '', songName: ''},
      end: {song: '', songName: ''},
      res: {second: '', song: '', songName: ''},
      user: {name: ''},
      start: {song: '', songName: ''},
    });

    navigation.navigate('AdvanceMediaPlayer', {
      itemData: time,
    });
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

          <FastImage
            source={ImageData.BACKGROUND}
            style={styles.primaryBackground}
            resizeMode={FastImage.resizeMode.cover}>
            <ActivityLoader visible={loader} />
            <View
              style={{
                width: '100%',
                height: 70,
                padding: 10,
                position: 'absolute',
                top: height * 0.0,
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
            </View>
            <View style={styles.secondaryContainer}>
              <FastImage
                source={ImageData.MAINBACKGROUND}
                style={styles.secondaryBackground}
                resizeMode={FastImage.resizeMode.stretch}>
                <View
                  style={{
                    width: '100%',
                    height: '76%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: height * 0.15,
                    paddingVertical: '0%',
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
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: '7%',

                        flexDirection: 'row',
                        top: -height * 0.06,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.subText}>Meditations</Text>
                    </View>

                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{
                        width: '96%',
                        height: '58%',

                        alignSelf: 'center',
                        // top: -height * 0.04,
                      }}>
                      <View
                        style={{
                          width: '96%',
                          height: 50,
                          backgroundColor: Color.BROWN3,
                          alignSelf: 'center',
                          borderRadius: 8,
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          borderColor: Color.BROWN,
                        }}>
                        <TextInput
                          value={time?.user?.name}
                          onChangeText={text =>
                            setTime(prev => ({
                              ...prev,
                              user: {...prev.user, name: text}, // ✅ This correctly updates `user.name`
                            }))
                          }
                          placeholder="Name"
                          placeholderTextColor={Color.BROWN5}
                          style={{
                            width: '100%',
                            height: 50,
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

                          padding: 10,
                          borderColor: Color.BROWN,
                        }}>
                        <Text style={styles.headerText}>Preparation Time</Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              width: '30%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 8,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                setActiveKey('pre');
                                setTooltipVisible(true);
                              }}
                              style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                paddingLeft: 10,
                                paddingRight: 5,
                                gap: 10,
                              }}>
                              <Text>{time?.pre?.second || 'Select'}</Text>
                              <Image
                                source={IconData.DROPDOWN}
                                style={{
                                  width: 20,
                                  height: 20,
                                  alignSelf: 'center',
                                  tintColor: Color.LIGHTGREEN,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setActiveKey('pre');
                              setModalOpen(true);
                            }}
                            style={{
                              // width: '40%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 30,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 10,
                            }}>
                            <Text>
                              {(() => {
                                const name = time?.pre?.songName || 'Chime';
                                const words = name.trim().split(' ');
                                return words.length > 1
                                  ? `${words[0]}...`
                                  : name;
                              })()}
                            </Text>
                            <Image
                              source={IconData.DROPDOWN}
                              style={{
                                width: 20,
                                height: 20,
                                alignSelf: 'center',
                                transform: [{rotate: '270deg'}],
                                tintColor: Color.LIGHTGREEN,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.headerText}>Meditation Time</Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              width: '30%',
                              height: 40,
                              flexDirection: 'row',
                              gap: 5,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '50%',
                                height: 40,
                                backgroundColor: Color.BROWN3,
                                alignSelf: 'center',
                                borderRadius: 8,
                                borderWidth: 1,
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderColor: Color.BROWN,
                                marginStart: 12,
                              }}>
                              <TextInput
                                value={time?.med?.minute}
                                onChangeText={text => {
                                  const cleaned = text
                                    .replace(/[^0-9]/g, '')
                                    .slice(0, 2);
                                  setTime(prev => ({
                                    ...prev,
                                    med: {...prev.med, minute: cleaned},
                                  }));
                                }}
                                maxLength={2}
                                placeholder="MM"
                                placeholderTextColor={Color.BROWN5}
                                style={{
                                  width: '100%',
                                  height: 40,
                                  color: Color.LIGHTGREEN,
                                  fontSize: 12,
                                  textAlign: 'center',
                                  fontFamily: Font.EBGaramond_Regular,
                                }}
                                selectionColor={Color.LIGHTGREEN}
                              />
                            </View>
                            <Text style={{fontSize: 25, top: 0}}>:</Text>
                            <View
                              style={{
                                width: '50%',
                                height: 40,
                                backgroundColor: Color.BROWN3,
                                alignSelf: 'center',
                                borderRadius: 8,
                                borderWidth: 1,
                                paddingLeft: 5,
                                paddingRight: 5,
                                paddingTop: 1,
                                borderColor: Color.BROWN,
                              }}>
                              <TextInput
                                value={time?.med?.second}
                                onChangeText={text => {
                                  const cleaned = text
                                    .replace(/[^0-9]/g, '')
                                    .slice(0, 2);
                                  setTime(prev => ({
                                    ...prev,
                                    med: {...prev.med, second: cleaned},
                                  }));
                                }}
                                placeholder="SS"
                                maxLength={2}
                                placeholderTextColor={Color.BROWN5}
                                style={{
                                  width: '100%',
                                  height: 40,
                                  color: Color.LIGHTGREEN,
                                  fontSize: 13,
                                  textAlign: 'center',
                                  fontFamily: Font.EBGaramond_Regular,
                                }}
                                selectionColor={Color.LIGHTGREEN}
                              />
                            </View>
                          </View>
                          {/* <TouchableOpacity
                        onPress={() => {
                          setActiveKey('med');
                          setModalOpen(true);
                        }}
                        style={{
                          // width: '40%',
                          height: 40,
                          backgroundColor: Color.BROWN3,
                          alignSelf: 'center',
                          borderRadius: 30,
                          borderWidth: 1,
                          padding: 10,
                          borderColor: Color.BROWN,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <Text > {(() => {
                          const name = time?.med?.songName || 'Chime';
                          const words = name.trim().split(' ');
                          return words.length > 1
                            ? `${words[0]}...`
                            : name;
                        })()}</Text>
                        <Image
                          source={IconData.DROPDOWN}
                          style={{
                            width: 20,
                            height: 20,
                            alignSelf: 'center',
                            transform: [{ rotate: '270deg' }],
                            tintColor: Color.LIGHTGREEN,
                          }}
                        />
                      </TouchableOpacity> */}
                        </View>

                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // marginVertical: 10,
                          }}>
                          <View
                            style={{
                              height: 40,
                              marginTop: 10,
                            }}>
                            <Text style={styles.headerText}>Start Chime</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setActiveKey('start');
                              setModalOpen(true);
                            }}
                            style={{
                              // width: '40%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 30,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 10,
                            }}>
                            <Text>
                              {(() => {
                                const rawName = time?.start?.songName;
                                const name =
                                  typeof rawName === 'string' && rawName.trim()
                                    ? rawName.trim()
                                    : 'Chime';
                                const words = name.split(' ');
                                return words.length > 1
                                  ? `${words[0]}...`
                                  : name;
                              })()}
                            </Text>
                            <Image
                              source={IconData.DROPDOWN}
                              style={{
                                width: 20,
                                height: 20,
                                alignSelf: 'center',
                                transform: [{rotate: '270deg'}],
                                tintColor: Color.LIGHTGREEN,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.headerText}>
                          Interval Chime (Repeat every)
                        </Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              width: '30%',
                              height: 40,
                              flexDirection: 'row',
                              gap: 5,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: '50%',
                                height: 40,
                                backgroundColor: Color.BROWN3,
                                alignSelf: 'center',
                                borderRadius: 8,
                                borderWidth: 1,
                                paddingHorizontal: 5,
                                borderColor: Color.BROWN,
                                marginStart: 12,
                              }}>
                              <TextInput
                                value={time?.int?.minute}
                                onChangeText={text => {
                                  const cleaned = text
                                    .replace(/[^0-9]/g, '')
                                    .slice(0, 2);
                                  setTime(prev => ({
                                    ...prev,
                                    int: {...prev.int, minute: cleaned},
                                  }));
                                }}
                                placeholder="MM"
                                maxLength={2}
                                placeholderTextColor={Color.BROWN5}
                                style={{
                                  width: '100%',
                                  height: 40,
                                  color: Color.LIGHTGREEN,
                                  fontSize: 12,
                                  textAlign: 'center',
                                  fontFamily: Font.EBGaramond_Regular,
                                }}
                                selectionColor={Color.LIGHTGREEN}
                              />
                            </View>
                            <Text style={{fontSize: 25, top: 0}}>:</Text>
                            <View
                              style={{
                                width: '50%',
                                height: 40,
                                backgroundColor: Color.BROWN3,
                                alignSelf: 'center',
                                borderRadius: 8,
                                borderWidth: 1,
                                paddingHorizontal: 5,
                                borderColor: Color.BROWN,
                              }}>
                              <TextInput
                                value={time?.int?.second}
                                onChangeText={text => {
                                  const cleaned = text
                                    .replace(/[^0-9]/g, '')
                                    .slice(0, 2);
                                  setTime(prev => ({
                                    ...prev,
                                    int: {...prev.int, second: cleaned},
                                  }));
                                }}
                                placeholder="SS"
                                maxLength={2}
                                placeholderTextColor={Color.BROWN5}
                                style={{
                                  width: '100%',
                                  height: 40,
                                  color: Color.LIGHTGREEN,
                                  fontSize: 12,
                                  textAlign: 'center',
                                  fontFamily: Font.EBGaramond_Regular,
                                }}
                                selectionColor={Color.LIGHTGREEN}
                              />
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setActiveKey('int');
                              setModalOpen(true);
                            }}
                            style={{
                              // width: '40%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 30,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 10,
                            }}>
                            <Text>
                              {(() => {
                                const rawName = time?.int?.songName;
                                const name =
                                  typeof rawName === 'string' && rawName.trim()
                                    ? rawName.trim()
                                    : 'Chime';
                                const words = name.split(' ');
                                return words.length > 1
                                  ? `${words[0]}...`
                                  : name;
                              })()}
                            </Text>
                            <Image
                              source={IconData.DROPDOWN}
                              style={{
                                width: 20,
                                height: 20,
                                alignSelf: 'center',
                                transform: [{rotate: '270deg'}],
                                tintColor: Color.LIGHTGREEN,
                              }}
                            />
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              height: 40,
                              marginTop: 10,
                            }}>
                            <Text style={styles.headerText}>End Alert</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setActiveKey('end');
                              setModalOpen(true);
                            }}
                            style={{
                              // width: '40%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 30,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 10,
                            }}>
                            <Text>
                              {(() => {
                                const rawName = time?.end?.songName;
                                const name =
                                  typeof rawName === 'string' && rawName.trim()
                                    ? rawName.trim()
                                    : 'Chime';
                                const words = name.split(' ');
                                return words.length > 1
                                  ? `${words[0]}...`
                                  : name;
                              })()}
                            </Text>
                            <Image
                              source={IconData.DROPDOWN}
                              style={{
                                width: 20,
                                height: 20,
                                alignSelf: 'center',
                                transform: [{rotate: '270deg'}],
                                tintColor: Color.LIGHTGREEN,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View></View>
                        <Text style={styles.headerText}>Rest Time</Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              width: '30%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              // alignSelf: 'center',
                              borderRadius: 8,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                            }}>
                            <TouchableOpacity
                              onPress={() => {
                                setActiveKey('res');
                                setTooltipVisible(true);
                              }}
                              style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                paddingLeft: 10,
                                paddingRight: 5,
                                gap: 10,
                              }}>
                              <Text>{time?.res?.second || 'Select'}</Text>

                              <Image
                                source={IconData.DROPDOWN}
                                style={{
                                  width: 20,
                                  height: 20,
                                  alignSelf: 'center',
                                  tintColor: Color.LIGHTGREEN,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setActiveKey('res');
                              setModalOpen(true);
                            }}
                            style={{
                              // width: '40%',
                              height: 40,
                              backgroundColor: Color.BROWN3,
                              alignSelf: 'center',
                              borderRadius: 30,
                              borderWidth: 1,
                              padding: 10,
                              borderColor: Color.BROWN,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 10,
                            }}>
                            <Text>
                              {(() => {
                                const rawName = time?.res?.songName;
                                const name =
                                  typeof rawName === 'string' && rawName.trim()
                                    ? rawName.trim()
                                    : 'Chime';
                                const words = name.split(' ');
                                return words.length > 1
                                  ? `${words[0]}...`
                                  : name;
                              })()}
                            </Text>
                            <Image
                              source={IconData.DROPDOWN}
                              style={{
                                width: 20,
                                height: 20,
                                alignSelf: 'center',
                                transform: [{rotate: '270deg'}],
                                tintColor: Color.LIGHTGREEN,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <SoundModal
                        visible={modalopen}
                        onClose={() => {
                          setModalOpen(false);
                        }}
                      />
                    </ScrollView>
                    <View
                      style={{
                        width: '96%',
                        height: '10%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        top: height * 0.04,
                        gap: 20,
                        flexDirection: 'row',
                      }}>
                      <Button
                        img={IconData.SAVE}
                        text="Save"
                        left={true}
                        width={100}
                        height={40}
                        size={16}
                        color={Color.BROWN3}
                        tintColor={Color.BROWN3}
                        backgroundColor={Color.LIGHTGREEN}
                        font={Font.EBGaramond_SemiBold}
                        onPress={() => {
                          // setActiveKey('user');
                          // setModalOpen1(true);
                          // console.log('XCvcxvcxvxcvxcvxcvcxv', time);
                          saveCustomeMedidation();
                        }}
                      />
                      <Button
                        img={IconData.MED}
                        text="Start"
                        left={true}
                        width={100}
                        height={40}
                        size={16}
                        color={Color.BROWN3}
                        tintColor={Color.BROWN3}
                        font={Font.EBGaramond_SemiBold}
                        backgroundColor={Color.LIGHTGREEN}
                        onPress={() => {
                          startMedidation(time);
                        }}
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
                    </View>
                  </View>
                </View>
              </FastImage>
            </View>
            <DropDown
              visible={tooltipVisible}
              selectedOptions={selectTime}
              onSelect={option => {
                setTime(prev => ({
                  ...prev,
                  [activeKey]: {
                    ...prev[activeKey],
                    second: option, // or `minute` or another field as needed
                  },
                }));
                setTooltipVisible(false);
              }}
              onClose={() => setTooltipVisible(false)}
            />
          </FastImage>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default AdvanceSetting;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    width: '90%',
    height: '90%',
    marginTop: height * 0.0,
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  headerText: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Color.BROWN3,
    paddingTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    margin: 1,
    marginTop: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    width: '95%',
    height: 500, // Adjust as needed
    alignItems: 'center',
    marginLeft: width * 0.025,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: Color?.LIGHTBROWN,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageStyle: {
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    width: '95%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Font.EBGaramond_SemiBold,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 5,
  },
  bottomFixedBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
