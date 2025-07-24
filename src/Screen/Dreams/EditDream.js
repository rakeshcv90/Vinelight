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
  UIManager,
  findNodeHandle,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeHeader from '../../Component/CustomeHeader';
import moment from 'moment';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {useDispatch, useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import {InteractionManager, Platform} from 'react-native';
import {
  setDreamData,
  updateDream,
  updateJournalData,
} from '../../redux/actions';
import ActivityLoader from '../../Component/ActivityLoader';
import PromptDreamModal from '../../Component/PromptDreamModal';
import ColorToolModal from '../../Component/ColorToolModal';
import {isCoupanValid, isSubscriptionValid} from '../utils';
import {SafeAreaView} from 'react-native-safe-area-context';
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

const EditDream = ({route, navigation}) => {
  // const [currentDat, setCurrentDate] = useState(
  //   moment().format(route.params.dreamData?.currentDat),
  // );
  {
    console.log('222222222222222222222', height);
  }
  const [currentDat, setCurrentDate] = useState(
    route.params.dreamData?.currentDat
      ? moment(route.params.dreamData.currentDat).local().format('YYYY-MM-DD')
      : moment().local().format('YYYY-MM-DD'),
  );
  const [colorModal, setColorModa] = useState(false);
  const subscription = useSelector(state => state?.user?.subscription);
  const coupaDetails = useSelector(state => state?.user?.coupaDetails);
  const dispatch = useDispatch();
  const prompt = useSelector(state => state?.user?.getDailyPrompt);
  const editorRef = useRef(null);
  const scrollRef = useRef();
  const [loader, setLoader] = useState(false);
  const handleCursorPosition = scrollY => {
    scrollRef.current?.scrollTo({y: scrollY - 30, animated: true});
  };
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [propmModalOpen, setPromptMOdalOpen] = useState(false);
  const [promptData, setPromptData] = useState(null);
  const [style, setStyle] = useState({
    font: 'Georgia',
    size: 16,
    color: '#000000',
    bold: false,
    italic: false,
    underline: false,
  });
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    if (propmModalOpen) {
      setPromptReady(false);
      InteractionManager.runAfterInteractions(() => {
        setPromptReady(true);
      });
    }
  }, [propmModalOpen]);
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

  // const handleShow = event => {
  //   setKeyboardVisible(true);
  //   Animated.timing(keyboardHeight, {
  //     toValue: event.endCoordinates.height,
  //     duration: event.duration || 250,
  //     useNativeDriver: false,
  //   }).start();
  // };
  const handleShow = event => {
    setKeyboardVisible(true);
    const keyboardHeightValue = event?.endCoordinates?.height || 0;

    setTimeout(
      () => {
        Animated.timing(keyboardHeight, {
          toValue: keyboardHeightValue,
          duration: 250,
          useNativeDriver: false,
        }).start();
      },
      Platform.OS === 'android' ? 50 : 0,
    );
  };

  const handleHide = () => {
    setKeyboardVisible(false);
    Animated.timing(keyboardHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyStyle();
    }, 50); // Small delay to ensure editor is ready

    return () => clearTimeout(timer);
  }, [
    style.font,
    style.size,
    style.color,
    style.bold,
    style.italic,
    style.underline,
  ]);

  const applyStyle = (customStyle = style) => {
    const {font, size, color, bold, italic, underline} = customStyle;

    let extra = '';
    if (bold) extra += 'font-weight: bold;';
    if (italic) extra += 'font-style: italic;';
    if (underline) extra += 'text-decoration: underline;';

    const combinedStyle =
      `font-family:'${font}'; font-size:${size}px; color:${color}; ${extra} `
        .replace(/\s+/g, ' ')
        .trim();
    editorRef.current?.insertHTML(`
    <p><span style="${combinedStyle}">&#8203;</span></p>
  `);
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

      const plainText = html
        ?.replace(/<[^>]*>/g, '')
        .replace(/&#8203;/g, '')
        .replace(/\u200B/g, '')
        .trim();

      const isBlank = !plainText;

      if (isBlank) {
      } else {
        setLoader(true);

        dispatch(
          updateDream({
            currentDat,
            dream: {
              id: route.params.dreamData?.dream?.id,
              dreamContent: html,
            },
          }),
        );
        setTimeout(() => {
          setLoader(false);
          navigation.goBack();
        }, 900);
      }
      navigation.setParams({modalOpenData: null, selectedDate: null});
    } catch (error) {
      console.error('Error saving dream data:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleInsertContent();
    }, 1000);
  }, [route, navigation]);

  const handleInsertContent = () => {
    let rawHTML = route?.params?.dreamData?.dream?.dreamContent || '';

    // Inline zero-width cursor marker
    //   rawHTML = rawHTML.replace(/<span id="cursor-marker"[^>]*>.*?<\/span>/g, '');
    // rawHTML = rawHTML.replace(/<div><span id="cursor-marker"><\/span><\/div>/g, '');
    rawHTML = rawHTML.replace(
      /<span id="cursor-marker"[^>]*>(.*?)<\/span>/g,
      '$1',
    );

    // const cursorMarker = `<span id="cursor-marker" style="all: unset; display: inline;">&#8203;</span>`;
    // const cursorMarker = `<div><span id="cursor-marker" style="all: unset; display: inline;">&#8203;</span></div>`;
    //     const cursorMarker = `
    //   <p id="cursor-marker" style="min-height: 1em;">
    //     <span style="white-space: pre;">&#8203;</span>
    //   </p>
    // `;

    const cursorMarker = `
  <div id="cursor-marker" style="display: block; line-height: 0.9; padding: 0; margin: 0;">
    <span style="white-space: pre;">&#8203;</span>
  </div>
`;

    const finalHTML = `${rawHTML}${cursorMarker}`;

    editorRef.current?.setContentHTML(finalHTML);

    const focusAndSetCursor = () => {
      editorRef.current?.focusContentEditor();

      // Place cursor right after the marker
      //   editorRef.current?.commandDOM(`
      //   var marker = document.getElementById("cursor-marker");
      //   if (marker) {
      //     var range = document.createRange();
      //     var sel = window.getSelection();
      //     range.setStartAfter(marker);
      //     range.collapse(true);
      //     sel.removeAllRanges();
      //     sel.addRange(range);
      //   }
      // `);

      editorRef.current?.commandDOM(`
  var markers = document.querySelectorAll('[id="cursor-marker"]');
  if (markers.length > 0) {
    var last = markers[markers.length - 1];
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStartAfter(last);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
`);

      // Construct inline default styling
      const defaultStyle = `
      display: inline;
      font-family: '${style.font}';
      font-size: ${style.size}px;
      color: ${style.color};
      font-weight: ${style.bold ? 'bold' : 'normal'};
      font-style: ${style.italic ? 'italic' : 'normal'};
      text-decoration: ${style.underline ? 'underline' : 'none'};
    `
        .replace(/\s\s+/g, ' ')
        .trim();

      // Insert zero-width styled span to preserve cursor formatting
      setTimeout(() => {
        editorRef.current?.insertHTML(
          `<span style="${defaultStyle}">&#8203;</span>`,
        );
      }, 100);
      if (Platform.OS === 'android') {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({animated: true});
        }, 200);
      }
    };

    if (Platform.OS === 'ios') {
      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          setTimeout(focusAndSetCursor, 300);
        });
      });
    } else {
      setTimeout(focusAndSetCursor, 200);
    }
  };

  useEffect(() => {
    if (promptData) {
      // const htmlContent = `<p>${promptData}</p><br/><span id="cursor-marker">&#8203;</span>`;
      // const htmlContent = `<p>${promptData}</p><span id="cursor-marker">&#8203;</span>`;

      const htmlContent = `
  <div>${promptData}</div>
  <span id="cursor-marker">&#8203;</span>
  <div><br/></div>
`;
      editorRef.current.insertHTML(htmlContent);

      // setTimeout(() => {
      //   editorRef.current?.blurContentEditor();
      //   editorRef.current?.focusContentEditor();
      // }, 100);
      setTimeout(() => {
        editorRef.current?.blurContentEditor();
        editorRef.current?.focusContentEditor();

        editorRef.current?.commandDOM(
          "setTimeout(() => { document.getElementById('cursor-marker')?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 100);",
        );
        if (Platform.OS === 'android') {
          setTimeout(() => {
            scrollRef.current?.scrollToEnd({animated: true});
          }, 200);
        }
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({animated: true});
        }, 400); // delay more on Android
      }, 300);
    }
  }, [promptData]);

  const hasActiveSubscription = () => {
    if (isSubscriptionValid(subscription) || isCoupanValid(coupaDetails)) {
      return true;
    } else {
      return false;
    }
  };
  const handleTypingStart = text => {
    if (!text) return '';

    let plainText = text.replace(/<[^>]*>?/gm, '');

    plainText = plainText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    if (plainText?.length > 1) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
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
                Platform.OS == 'ios' && editorRef?.current?.blurContentEditor();
              }}
              accessible={false}>
              <ImageBackground
                source={ImageData.BACKGROUND}
                style={styles.primaryBackground}
                resizeMode="cover">
                <View style={{flex: 0.13, marginTop: -height * 0.04}}>
                  <CustomeHeader
                    onClear={() => {
                      handleInsertContent();
                    }}
                    onDelete={() => {
                      clearEditorContent();
                      navigation.goBack();
                    }}
                    selectedDate={currentDat}
                    setCurrentDate={setCurrentDate}
                    disable={true}
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
                      {/* <ScrollView
                    ref={scrollRef}
                    style={styles.editorContainer}
                    keyboardShouldPersistTaps="handled"
                    horizontal={false}
                    contentContainerStyle={{flexGrow: 1}}> */}
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
                            onChange={text => {
                              handleTypingStart(text);
                            }}
                            editorStyle={{
                              contentCSSText: `font-family: ${selectedFont.value}; font-size: 16px;`,
                            }}
                            style={{minHeight: 500, paddingBottom: 0}}
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
                    {
                      bottom: isKeyboardVisible
                        ? height <= 800
                          ? 30
                          : 45
                        : 10,
                    },
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
                        // onPress={() => {
                        //   setPromptMOdalOpen(true);
                        // }}

                        onPress={() => {
                          Keyboard.dismiss();

                          InteractionManager.runAfterInteractions(() => {
                            setTimeout(() => {
                              setPromptMOdalOpen(true);
                            }, 800); // Tune delay if needed
                          });
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
                        // disabled={currentPage === subTitleText?.length - 1}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </ImageBackground>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      {promptReady && (
        <PromptDreamModal
          visible={propmModalOpen}
          promptData={promptData}
          setPromptData={setPromptData}
          onClose={() => {
            setPromptMOdalOpen(false);
          }}
        />
      )}
      <ColorToolModal
        visible={colorModal}
        selectedColor={style.color}
        onSelect={hex => {
          onColorSelect(hex); // ✅ Pass hex argument here
          setColorModa(false); // Optionally close modal after selection
        }}
        onClose={() => setColorModa(false)}
      />
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
export default EditDream;
