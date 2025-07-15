import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeHeader from '../../Component/CustomeHeader';
import moment from 'moment';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import {setDreamData} from '../../redux/actions';
import ActivityLoader from '../../Component/ActivityLoader';
import PromptDreamModal from '../../Component/PromptDreamModal';
import Toast from 'react-native-toast-message';
import ColorToolModal from '../../Component/ColorToolModal';
import {isCoupanValid, isSubscriptionValid} from '../utils';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useHeaderHeight} from '@react-navigation/elements';
const {width, height} = Dimensions.get('window');

const fonts = [
  {label: 'Georgia', value: 'Georgia'},
  {label: 'Courier New', value: 'Courier New'},
  {label: 'Times New Roman', value: 'Times New Roman'},
  {label: 'Arial', value: 'Arial'},
  {label: 'Verdana', value: 'Verdana'},
  {label: 'Trebuchet MS', value: 'Trebuchet MS'},
  {label: 'Palatino', value: 'Palatino'},
  {label: 'Garamond', value: 'Garamond'},
  {label: 'Comic Sans MS', value: 'Comic Sans MS'},
  {label: 'Impact', value: 'Impact'},
  {label: 'Lucida Console', value: 'Lucida Console'},
  {label: 'Tahoma', value: 'Tahoma'},
  {label: 'Helvetica', value: 'Helvetica'},
  {label: 'Optima', value: 'Optima'},
  {label: 'Didot', value: 'Didot'},
  {label: 'Monaco', value: 'Monaco'},
  {label: 'Brush Script MT', value: 'Brush Script MT'},
];

const CreateDream = ({navigation, route}) => {
  const height1 = useHeaderHeight();
  const DataCurrent = route?.params?.selectedDate;
  // const [currentDat, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [currentDat, setCurrentDate] = useState(
    DataCurrent == undefined
      ? moment().local().format('YYYY-MM-DD')
      : DataCurrent,
  );
  const coupaDetails = useSelector(state => state?.user?.coupaDetails);
  const subscription = useSelector(state => state?.user?.subscription);
  const [propmModalOpen, setPromptMOdalOpen] = useState(false);
  const [colorModal, setColorModa] = useState(false);
  const dispatch = useDispatch();
  const prompt = useSelector(state => state?.user?.getDailyPrompt);
  const editorRef = useRef(null);
  const scrollRef = useRef();
  const [loader, setLoader] = useState(false);
  const handleCursorPosition = scrollY => {
    scrollRef.current?.scrollTo({y: scrollY - 30, animated: true});
  };
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  const [style, setStyle] = useState({
    font: 'EB Garamond',
    size: 16,
    color: '#000000',
    bold: false,
    italic: false,
    underline: false,
  });
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [promptData, setPromptData] = useState(null);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const animatedMarginTop = useRef(new Animated.Value(-height * 0.035)).current;
  useEffect(() => {
    const showListener =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', handleShow)
        : Keyboard.addListener('keyboardDidShow', handleShow);

    const hideListener =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillHide', handleHide)
        : Keyboard.addListener('keyboardDidHide', handleHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleShow = () => {
    setKeyboardVisible(true);
    Animated.timing(animatedMarginTop, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleHide = () => {
    setKeyboardVisible(false);
    Animated.timing(animatedMarginTop, {
      toValue: -height * 0.035,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      applyStyle();
    }, 50);

    return () => clearTimeout(timer);
  }, [
    style.font,
    style.size,
    style.color,
    style.bold,
    style.italic,
    style.underline,
    colorModal,
  ]);

  const applyStyle = (customStyle = style) => {
    // const {font, size, color, bold, italic, underline} = customStyle;

    // let extra = '';
    // if (bold) extra += 'font-weight: bold;';
    // if (italic) extra += 'font-style: italic;';
    // if (underline) extra += 'text-decoration: underline;';

    // const combinedStyle = `font-family:'${font}'; font-size:${size}px; color:${color}; ${extra}`;
    // editorRef.current?.insertHTML(
    //   // `<span style="${combinedStyle}">&#8203;</span>`,
    //    `<span class="style-marker" style="${combinedStyle}">&#8203;</span>`
    // );

    const {font, size, color, bold, italic, underline} = customStyle;

    let extra = '';
    if (bold) extra += 'font-weight: bold;';
    if (italic) extra += 'font-style: italic;';
    if (underline) extra += 'text-decoration: underline;';

    const combinedStyle = `font-family:'${font}'; font-size:${size}px; color:${color}; ${extra}`;
    editorRef.current?.insertHTML(
      `<span style="${combinedStyle}">&#8203;</span>`,
    );
  };

  const onFontSelect = fontLabel => {
    const newStyle = {...style, font: fontLabel};
    setStyle(newStyle);
    setShowFontDropdown(false);
    applyStyle(newStyle);
  };

  const onSizeSelect = px => {
    const newStyle = {...style, size: px};
    setStyle(newStyle);
    applyStyle(newStyle);
  };

  const onColorSelect = hex => {
    const newStyle = {...style, color: hex};
    setStyle(newStyle);
    applyStyle(newStyle);
  };

  const onUnderLine = hex => {
    const newStyle = {...style, underline: !style.underline};
    setStyle(newStyle);
    applyStyle(newStyle);
  };
  const onBold = hex => {
    const newStyle = {...style, bold: !style.bold};
    setStyle(newStyle);
    applyStyle(newStyle);
  };
  const onItalic = hex => {
    const newStyle = {...style, italic: !style.italic};
    setStyle(newStyle);
    applyStyle(newStyle);
  };

  const clearEditorContent = () => {
    editorRef.current?.setContentHTML('');
  };

  const saveDreamData = async () => {
    try {
      const html = await editorRef.current?.getContentHtml();
      const normalizedHtml = html
        .replace(/&nbsp;/g, ' ')
        // .replace(/\s+/g, ' ')
        .replace(/&#8203;/g, '')
        .replace(/\u200B/g, '')
        .trim();

      const plainText = normalizedHtml.replace(/<[^>]*>/g, '').trim();
      const isEmptyHtml =
        normalizedHtml === '<p><br></p>' ||
        normalizedHtml === '<div><br></div>';
      const isBlank = !plainText || isEmptyHtml;

      if (isBlank) {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Content cannot be empty',
          },
        });
        return;
      }
      // setLoader(true);

      dispatch(
        setDreamData({
          currentDat, // double-check this variable is declared
          dream: {
            id: uuid.v4(), // e.g., using 'react-native-uuid'
            dreamContent: normalizedHtml,
          },
        }),
      );
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.SUCC, // your custom image
          text: 'Dream Journal entry saved!',
        },
      });
      setTimeout(() => {
        setLoader(false);
        navigation.goBack();
      }, 900);
    } catch (error) {
      console.error('Error saving dream data:', error);
    }
  };


  useEffect(() => {
    if (promptData) {
    //   const htmlContent = `
    //   <p style="margin-bottom: 8px;">${promptData}</p>
    //   <p></p>
    //   <span id="cursor-marker">&#8203;</span>
    // `;

       const htmlContent = `
      <div>${promptData}</div>
      <div><br></div> <!-- Ensures one empty line -->
      <span id="cursor-marker">&#8203;</span>
    `;

      editorRef.current.insertHTML(htmlContent);

      setTimeout(() => {
        editorRef.current?.blurContentEditor();
        editorRef.current?.focusContentEditor();
      }, 100);
    }
  }, [promptData]);
  const hasActiveSubscription = () => {
    if (isSubscriptionValid(subscription) || isCoupanValid(coupaDetails)) {
      return true;
    } else {
      return false;
    }
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
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Changed from undefined to 'height'
              keyboardVerticalOffset={-height * 0.05}>
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                  Platform.OS == 'ios' &&
                    editorRef?.current?.blurContentEditor();
                }}
                accessible={false}>
                <ImageBackground
                  source={ImageData.BACKGROUND}
                  style={styles.primaryBackground}
                  resizeMode="cover">
                  <View style={{flex: 0.13, marginTop: -height * 0.04}}>
                    <CustomeHeader
                      onClear={() => {
                        clearEditorContent();
                      }}
                      onDelete={() => {
                        clearEditorContent();
                        navigation.goBack();
                      }}
                      selectedDate={currentDat}
                      setCurrentDate={setCurrentDate}
                      disable={false}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
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
                      // height: isKeyboardVisible?100:'100%',
                      alignSelf: 'center',
                      marginTop: isKeyboardVisible
                        ? height >= 800
                          ? -20
                          : 0
                        : -height * 0.035,
                      alignItems: 'center',
                      borderRadius: 10,
                      marginLeft: 20,
                        marginLeft: 20,
                      }}>
                      <View
                        style={{
                          width: '90%',
                       maxHeight: isKeyboardVisible ? '70%' : '82%',
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
                        <ActivityLoader visible={loader} />
                        <ScrollView
                          ref={scrollRef}
                          style={styles.editorContainer}
                          keyboardShouldPersistTaps="handled"
                          contentInsetAdjustmentBehavior="automatic"
                          contentContainerStyle={{flexGrow: 1}}>
                          <View
                            onStartShouldSetResponder={() => true}
                            onResponderStart={() => {
                              editorRef.current?.focusContentEditor();
                            }}
                            style={{flex: 1}}>
                            <RichEditor
                              ref={editorRef}
                              initialContentHTML=""
                              initialFocus={false}
                              onCursorPosition={handleCursorPosition}
                              placeholder="Start writing here..."
                              androidHardwareAccelerationDisabled
                              androidLayerType="software"
                              // onChange={richTextHandle}
                              editorStyle={{
                                contentCSSText: `font-family: ${selectedFont.value}; font-size: 16px;`,
                              }}
                              style={styles.richEditor}
                            />
                          </View>
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

                      <View
                        style={{
                          width: '90%',
                          height: 40,
                          marginTop: '2%',
                          marginLeft: -20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => setShowFontDropdown(true)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: -10,
                            // width: 150,
                            height: 36,
                            gap: 10,
                            borderRadius: 6,
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 16,
                              maxWidth: 100,
                              color: Color.LIGHTGREEN,
                            }}>
                            {selectedFont?.label || 'Font'}
                          </Text>
                          <Image
                            source={IconData.DROP}
                            resizeMode="contain"
                            style={{width: 12, height: 12, marginLeft: 4}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            if (style.size < 36) {
                              onSizeSelect(style.size + 3);
                            }
                          }}>
                          <Image
                            source={IconData.FONTPLUS}
                            style={{width: 30, height: 30}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            if (style.size > 12) {
                              onSizeSelect(style?.size - 2);
                            }
                          }}>
                          <Image
                            source={IconData.FONTMINUS}
                            style={{width: 30, height: 30}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setColorModa(true)}>
                          <Image
                            source={IconData.FONTCOLOR}
                            style={{width: 30, height: 30}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={onUnderLine}
                          style={{
                            backgroundColor: !style.underline
                              ? 'transparent'
                              : Color.LIGHTBROWN2,
                            padding: 5,
                            borderRadius: 100,
                          }}>
                          <Image
                            source={IconData.UNDERLINE}
                            style={{width: 30, height: 30}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={onBold}
                          style={{
                            backgroundColor: !style.bold
                              ? 'transparent'
                              : Color.LIGHTBROWN2,
                            padding: 5,
                            borderRadius: 100,
                          }}>
                          <Image
                            source={IconData.BOLD}
                            style={{width: 25, height: 25}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={onItalic}
                          style={{
                            backgroundColor: !style.italic
                              ? 'transparent'
                              : Color.LIGHTBROWN2,
                            padding: 5,
                            borderRadius: 100,
                          }}>
                          <Image
                            source={IconData.ITALIC}
                            style={{width: 25, height: 25}}
                            tintColor={Color.LIGHTGREEN}
                          />
                        </TouchableOpacity>
                      </View>

                      <Modal
                        visible={showFontDropdown}
                        transparent
                        animationType="fade">
                        <TouchableOpacity
                          style={styles.modalOverlay}
                          activeOpacity={1}
                          onPressOut={() => setShowFontDropdown(false)}>
                          <View style={styles.centeredDropdownWrapper}>
                            <TouchableOpacity activeOpacity={1}>
                              <View style={styles.fontDropdown}>
                                {fonts.map((font, index) => (
                                  <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                      onFontSelect(font.value);
                                      setSelectedFont(font);
                                    }}
                                    style={styles.fontOption}>
                                    <Text
                                      style={{
                                        fontFamily: font.value,
                                        fontSize: 16,
                                      }}>
                                      {font.label}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </ImageBackground>
                  </View>

                  <ImageBackground
                    source={ImageData.TABBACKGROUND}
                    style={[
                    styles.thirdBackground,
                    {bottom: isKeyboardVisible ? height<=800?30:45 : 10},
                  ]}
                    resizeMode="contain">
                    <View
                      style={{
                        width: '95%',
                        height: 70,
                        flexDirection: 'row',
                        justifyContent: hasActiveSubscription()
                          ? 'space-between'
                          : 'flex-end',

                        alignItems: 'center',
                        overflow: 'hidden',
                      }}>
                      {(isSubscriptionValid(subscription) ||
                        isCoupanValid(coupaDetails)) && (
                        <Button
                          img={IconData.PROMPT}
                          text="Prompts"
                          left={true}
                          width={100}
                          backgroundColor={Color.BROWN4}
                          height={40}
                          size={16}
                          font={Font.EBGaramond_SemiBold}
                          onPress={() => {
                            setPromptMOdalOpen(true);
                          }}
                          style={{width: '50%', zIndex: -1}}
                        />
                      )}
                      <View style={{right: hasActiveSubscription() ? 10 : 10}}>
                        <Button
                          img={IconData.SAVE}
                          text="Save"
                          left={true}
                          width={91}
                          backgroundColor={Color.BROWN4}
                          height={40}
                          size={16}
                          font={Font.EBGaramond_SemiBold}
                          onPress={saveDreamData}
                          style={{width: '50%', zIndex: -1}}
                        />
                      </View>
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <PromptDreamModal
              visible={propmModalOpen}
              promptData={promptData}
              setPromptData={setPromptData}
              onClose={() => {
                setPromptMOdalOpen(false);
              }}
            />
            <ColorToolModal
              visible={colorModal}
              selectedColor={style.color}
              onSelect={hex => {
                onColorSelect(hex); // ✅ Pass hex argument here
                setColorModa(false); // Optionally close modal after selection
                setTimeout(() => {
                  editorRef.current?.focusContentEditor();
                }, 100); // small delay to allow modal to close
              }}
              onClose={() => setColorModa(false)}
            />
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
    bottom: 10,
    position: 'absolute',
    left: width * 0.03,
  },
  editorContainer: {
    height: height * 0.7,
    width: '100%',
    backgroundColor: 'white',
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
export default CreateDream;
