import {
  View,
  Text,
  Dimensions,
  Keyboard,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import CustomeHeader from '../../Component/CustomeHeader';
import ActivityLoader from '../../Component/ActivityLoader';
import {RichEditor} from 'react-native-pell-rich-editor';

import Button from '../../Component/Button';
import {setJournalData, updateJournalData} from '../../redux/actions';
import uuid from 'react-native-uuid';
import TooltipModal2 from '../../Component/TooltipModal2';
import PromptModal from '../../Component/PromptModal';
import ColorToolModal from '../../Component/ColorToolModal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {isCoupanValid, isSubscriptionValid} from '../utils';
import {InteractionManager, Platform} from 'react-native';
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
const EditJournalEntry = ({navigation, route}) => {
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [currentDat, setCurrentDate] = useState(
    moment().format(route?.params?.journalData?.currentDat),
  );
  const coupaDetails = useSelector(state => state?.user?.coupaDetails);
  const [colorModal, setColorModa] = useState(false);
  const dispatch = useDispatch();
  const prompt = useSelector(state => state?.user?.getDailyPrompt);
  const subscription = useSelector(state => state?.user?.subscription);
  const editorRef = useRef(null);
  const scrollRef = useRef();
  const [loader, setLoader] = useState(false);
  const handleCursorPosition = scrollY => {
    scrollRef.current?.scrollTo({y: scrollY - 30, animated: true});
  };
  const animatedMarginTop = useRef(new Animated.Value(-height * 0.035)).current;
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [propmModalOpen, setPromptMOdalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState(
    route?.params?.journalData?.mood,
  );
  const [promptData, setPromptData] = useState(null);
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

  const saveJournalData = async () => {
    try {
      const html = await editorRef.current?.getContentHtml();

      const plainText = html
        ?.replace(/<[^>]*>/g, '')
        .replace(/&#8203;/g, '')
        .replace(/\u200B/g, '')
        .trim();

      const isBlank = !plainText;

      if (isBlank) {
        console.log('❗ Content is blank');
      } else {
        // setLoader(true);

        dispatch(
          updateJournalData({
            currentDat,
            journal: {
              id: route?.params?.journalData?.journal?.id,
              journalContent: html,
            },
            mood: selectedMoods,
          }),
        );

        setTimeout(() => {
          setLoader(false);
          navigation.goBack();
        }, 900);
      }
    } catch (error) {
      setLoader(false);
      console.error('Error saving dream data:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleInsertContent();
    }, 1000);
  }, [route, navigation]);


  


const handleInsertContent = () => {
  let rawHTML = route?.params?.journalData?.journal?.journalContent || '';

  // Clean any existing cursor marker spans
  rawHTML = rawHTML.replace(/<span id="cursor-marker"[^>]*>(.*?)<\/span>/g, '$1');
  rawHTML = rawHTML.replace(/<span id="cursor-marker"><\/span>/g, '');
  rawHTML = rawHTML.replace(/<div[^>]*id="cursor-marker"[^>]*>.*?<\/div>/g, '');
  rawHTML = rawHTML.replace(/<p[^>]*id="cursor-marker"[^>]*>.*?<\/p>/g, '');

  // Insert a clean inline cursor marker at the end
  const cursorMarker = `<span id="cursor-marker" style="display: inline;">&#8203;</span>`;
  const finalHTML = `${rawHTML}${cursorMarker}`;

  editorRef.current?.setContentHTML(finalHTML);

  const focusAndSetCursor = () => {
    editorRef.current?.focusContentEditor();

    // Move the cursor to after the last cursor-marker
    editorRef.current?.commandDOM(`
      const markers = document.querySelectorAll('#cursor-marker');
      if (markers.length > 0) {
        const last = markers[markers.length - 1];
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStartAfter(last);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        // Scroll cursor into view
        last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    `);

    // Reinsert a styled invisible character to preserve formatting
    const defaultStyle = `
      display: inline;
      font-family: '${style.font}';
      font-size: ${style.size}px;
      color: ${style.color};
      font-weight: ${style.bold ? 'bold' : 'normal'};
      font-style: ${style.italic ? 'italic' : 'normal'};
      text-decoration: ${style.underline ? 'underline' : 'none'};
    `.replace(/\s\s+/g, ' ').trim();

    setTimeout(() => {
      editorRef.current?.insertHTML(`<span style="${defaultStyle}">&#8203;</span>`);
    }, 50);
  };

  // Slight delay for layout to settle
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
      const htmlContent = `<p>${promptData}</p><br/><span id="cursor-marker">&#8203;</span>`;
      // const htmlContent = `<p>${promptData}</p><span id="cursor-marker">&#8203;</span>`;
      editorRef.current.insertHTML(htmlContent);

      setTimeout(() => {
        editorRef.current?.blurContentEditor();
        editorRef.current?.focusContentEditor();
      }, 100);
    }
  }, [promptData]);

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
      {Platform.OS == 'ios' ? (
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
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
             keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
            
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                  Platform.OS == 'ios' &&
                    editorRef?.current?.blurContentEditor();
                  // editorRef?.current?.blurContentEditor(); // <== Manually blur RichEditor
                }}
                accessible={false}>
                <ImageBackground
                  source={ImageData.BACKGROUND}
                  style={styles.primaryBackground}
                  resizeMode="cover">
                  <View style={{flex: 0.13, marginTop: -30}}>
                    <CustomeHeader
                      onClear={() => {
                        // handleInsertContent();
                        clearEditorContent();
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
                        marginTop: isKeyboardVisible ? 10 : -height * 0.035,
                        alignItems: 'center',
                        borderRadius: 10,
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
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{flexGrow: 1}}> */}
                        <ScrollView
                          ref={scrollRef}
                          style={styles.editorContainer}
                          contentContainerStyle={{
                            flexGrow: 1,
                            padding: 10,
                            paddingBottom: 10,
                          }}
                          keyboardShouldPersistTaps="handled">
                          {/* <KeyboardAwareScrollView
                    ref={scrollRef}
                    style={styles.editorContainer}
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{flexGrow: 1}}> */}
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
                          {/* </KeyboardAwareScrollView> */}
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
                                <ScrollView
                                  // style={{maxHeight: 300}} // adjust height as needed
                                  showsVerticalScrollIndicator={false}>
                                  {fonts.map((font, index) => (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() => {
                                        onFontSelect(font.value);
                                        setSelectedFont(font);
                                        // setShowFontDropdown(false);
                                        // applyFontFamily(font.value);
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
                                </ScrollView>
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
                      {bottom: isKeyboardVisible ? 3 : 10},
                    ]}
                    resizeMode="contain">
                    <View
                      style={{
                        width: '95%',
                        height: 70,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          gap: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft:
                            isSubscriptionValid(subscription) ||
                            isCoupanValid(coupaDetails)
                              ? -15
                              : 5,
                        }}
                        onPress={() => {
                          setTooltipVisible(true);
                        }}>
                        <Image
                          source={
                            selectedMoods != null
                              ? selectedMoods?.Image
                              : IconData.HAPPY
                          }
                          style={{width: 20, height: 20}}
                          resizeMode="contain"
                        />

                        <Text
                          style={{
                            color: Color.BROWN4,
                            fontSize: 14,
                            fontFamily: Font.EB_Garamond,
                          }}>
                          {selectedMoods != null
                            ? selectedMoods?.name
                            : 'Select Mood'}
                        </Text>
                        <Image
                          source={IconData.DROP}
                          resizeMode="contain"
                          style={{width: 12, height: 12}}
                          // tintColor={'red'}
                        />
                      </TouchableOpacity>
                      <View style={{right: 15}}>
                        <Button
                          img={IconData.SAVE}
                          text="Save"
                          left={true}
                          width={91}
                          backgroundColor={Color.BROWN4}
                          height={40}
                          size={16}
                          font={Font.EBGaramond_SemiBold}
                          onPress={saveJournalData}
                          style={{width: '50%', zIndex: -1}}
                        />
                      </View>
                      <TooltipModal2
                        visible={tooltipVisible}
                        selectedOptions={selectedMoods}
                        onSelect={option => {
                          setSelectedMoods(option);
                        }}
                        onClose={() => setTooltipVisible(false)}
                      />
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <PromptModal
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
              }}
              onClose={() => setColorModa(false)}
            />
          </SafeAreaView>
        </ImageBackground>
      ) : (
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
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={
                Platform.OS === 'ios' ? 20 : -height * 0.05
              } // adjust if your header overlaps
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  Keyboard.dismiss();
                  Platform.OS == 'ios' &&
                    editorRef?.current?.blurContentEditor();
                  // editorRef?.current?.blurContentEditor(); // <== Manually blur RichEditor
                }}
                accessible={false}>
                <ImageBackground
                  source={ImageData.BACKGROUND}
                  style={styles.primaryBackground}
                  resizeMode="cover">
                  <View style={{flex: 0.13, marginTop: -30}}>
                    <CustomeHeader
                      onClear={() => {
                        // handleInsertContent();
                        clearEditorContent();
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
                        marginTop: isKeyboardVisible ? 0 : -height * 0.02,
                        alignItems: 'center',
                        borderRadius: 10,
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
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{flexGrow: 1}}> */}
                        <ScrollView
                          ref={scrollRef}
                          style={styles.editorContainer}
                          contentContainerStyle={{
                            flexGrow: 1,
                            padding: 10,
                            paddingBottom: 10,
                          }}
                          keyboardShouldPersistTaps="handled">
                          {/* <KeyboardAwareScrollView
                    ref={scrollRef}
                    style={styles.editorContainer}
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{flexGrow: 1}}> */}
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
                          {/* </KeyboardAwareScrollView> */}
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
                                <ScrollView
                                  // style={{maxHeight: 300}} // adjust height as needed
                                  showsVerticalScrollIndicator={false}>
                                  {fonts.map((font, index) => (
                                    <TouchableOpacity
                                      key={index}
                                      onPress={() => {
                                        onFontSelect(font.value);
                                        setSelectedFont(font);
                                        // setShowFontDropdown(false);
                                        // applyFontFamily(font.value);
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
                                </ScrollView>
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
                      {bottom: isKeyboardVisible ? 30 : 10},
                    ]}
                    resizeMode="contain">
                    <View
                      style={{
                        width: '95%',
                        height: 70,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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

                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          gap: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft:
                            isSubscriptionValid(subscription) ||
                            isCoupanValid(coupaDetails)
                              ? -15
                              : 5,
                        }}
                        onPress={() => {
                          setTooltipVisible(true);
                        }}>
                        <Image
                          source={
                            selectedMoods != null
                              ? selectedMoods?.Image
                              : IconData.HAPPY
                          }
                          style={{width: 20, height: 20}}
                          resizeMode="contain"
                        />

                        <Text
                          style={{
                            color: Color.BROWN4,
                            fontSize: 14,
                            fontFamily: Font.EB_Garamond,
                          }}>
                          {selectedMoods != null
                            ? selectedMoods?.name
                            : 'Select Mood'}
                        </Text>
                        <Image
                          source={IconData.DROP}
                          resizeMode="contain"
                          style={{width: 12, height: 12}}
                          // tintColor={'red'}
                        />
                      </TouchableOpacity>
                      <View style={{right: 15}}>
                        <Button
                          img={IconData.SAVE}
                          text="Save"
                          left={true}
                          width={91}
                          backgroundColor={Color.BROWN4}
                          height={40}
                          size={16}
                          font={Font.EBGaramond_SemiBold}
                          onPress={saveJournalData}
                          style={{width: '50%', zIndex: -1}}
                        />
                      </View>
                      <TooltipModal2
                        visible={tooltipVisible}
                        selectedOptions={selectedMoods}
                        onSelect={option => {
                          setSelectedMoods(option);
                        }}
                        onClose={() => setTooltipVisible(false)}
                      />
                    </View>
                  </ImageBackground>
                </ImageBackground>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <PromptModal
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
              }}
              onClose={() => setColorModa(false)}
            />
          </SafeAreaView>
        </ImageBackground>
      )}
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
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 20,
    left: width * 0.03,
    position: 'absolute',
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
    height: 400,
    width: '100%',
  },
  fontOption: {
    paddingVertical: 10,
  },
});
export default EditJournalEntry;
