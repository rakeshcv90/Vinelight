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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeHeader from '../../Component/CustomeHeader';
import moment from 'moment';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
const {width, height} = Dimensions.get('window');

const fonts = [
  {label: 'Georgia', value: 'Georgia'},
  {label: 'Courier New', value: 'Courier New'},
];

const CreateDream = () => {
  const [currentDat, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const editorRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  const [style, setStyle] = useState({
    font: 'EB Garamond',
    size: 16,
    color: '#000000',
  });
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  // const applyStyle = () => {
  //   const {font, size, color} = style;
  //   editorRef.current?.insertHTML(
  //     `<span style="font-family:'${font}'; font-size:${size}px; color:${color};">&#8203;</span>`,
  //   );
  // };
  useEffect(() => {
    applyStyle();
  }, [style.font, style.size, style.color]);
  const applyStyle = (customStyle = style) => {
    const {font, size, color, extra} = customStyle;
    const combinedStyle = `font-family:'${font}'; font-size:${size}px; color:${color}; ${
      extra || ''
    }`;

    editorRef.current?.blurContentEditor();
    setTimeout(() => {
      editorRef.current?.focusContentEditor();
      editorRef.current?.insertHTML(
        `<span style="${combinedStyle}">&#8203;</span>`,
      );
    }, 100);
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
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          editorRef?.current?.blurContentEditor(); // <== Manually blur RichEditor
        }}
        accessible={false}>
        <ImageBackground
          source={ImageData.BACKGROUND}
          style={styles.primaryBackground}
          resizeMode="cover">
          <View style={{flex: 0.15}}>
            <CustomeHeader
              onClear={() => {
                console.log('XCvcxvcxvcxvcx');
              }}
              onDelete={() => {
                console.log('Test Data Deletye');
              }}
              selectedDate={currentDat}
            />
          </View>
          <View
            style={{
              flex: 0.8,
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
                height: '100%',
                alignSelf: 'center',

                alignItems: 'center',
                borderRadius: 10,
                marginLeft: 15,
              }}>
              <View
                style={{
                  width: '90%',
                  maxHeight: '80%',
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

                <ScrollView style={styles.editorContainer}>
                  {console.log('Sdfsdfsdsdf', selectedFont.value)}
                  <RichEditor
                    ref={editorRef}
                    initialContentHTML=""
                    placeholder="Start writing here..."
                    androidHardwareAccelerationDisabled
                    androidLayerType="software"
                    // onChange={richTextHandle}
                    editorStyle={{
                      contentCSSText: `font-family: ${selectedFont.value}; font-size: 16px;`,
                    }}
                    style={styles.richEditor}
                  />
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
                  width: '95%',
                  height: 40,
                  marginTop: '2%',
                }}>
                <RichToolbar
                  editor={editorRef}
                  actions={[
                    'customFontFamily',
                    'customFontSizeUp',
                    'customFontSizeDown',
                    'customTextColor',
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                  ]}
                  iconMap={{
                    customFontFamily: () => (
                      <TouchableOpacity
                        onPress={() => setShowFontDropdown(true)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          height: 36,

                          borderRadius: 6,
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 12,
                            maxWidth: 60,
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
                    ),
                    customFontSizeUp: () => (
                      <TouchableOpacity
                        onPress={() => onSizeSelect(style.size + 4)}>
                        <Image
                          source={IconData.FONTPLUS}
                          style={{width: 24, height: 24}}
                          tintColor={Color.LIGHTGREEN}
                        />
                      </TouchableOpacity>
                    ),
                    customFontSizeDown: () => (
                      <TouchableOpacity
                        onPress={() => onSizeSelect(style.size - 4)}>
                        <Image
                          source={IconData.FONTMINUS}
                          style={{width: 24, height: 24}}
                          tintColor={Color.LIGHTGREEN}
                        />
                      </TouchableOpacity>
                    ),
                    customTextColor: () => (
                      <TouchableOpacity
                        onPress={() => onColorSelect('#ff5733')}>
                        <Image
                          source={IconData.FONTCOLOR}
                          style={{width: 24, height: 24}}
                          tintColor={Color.LIGHTGREEN}
                        />
                      </TouchableOpacity>
                    ),
                  }}
                  style={{
                    alignSelf: 'stretch',

                    height: 40,
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}
                />
              </View>

              {/* Font Dropdown Modal */}
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
                              // setSelectedFont(font);
                              // setShowFontDropdown(false);
                              // applyFontFamily(font.value);
                            }}
                            style={styles.fontOption}>
                            <Text
                              style={{fontFamily: font.value, fontSize: 16}}>
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
            style={styles.thirdBackground}
            resizeMode="contain">
            <View
              style={{
                width: '95%',
                height: 70,

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
                onPress={async () => {
                  const html = await editorRef.current?.getContentHtml();
                  console.log('💾 Saved HTML:', html);
                }}
                style={{width: '50%', zIndex: -1}}
                // disabled={currentPage === subTitleText?.length - 1}
              />
            </View>
          </ImageBackground>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 10,
    position: 'absolute',
  },
  editorContainer: {
    height: 500,
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
