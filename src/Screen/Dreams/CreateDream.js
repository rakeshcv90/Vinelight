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
import React, {useRef, useState} from 'react';
import CustomeHeader from '../../Component/CustomeHeader';
import moment from 'moment';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button from '../../Component/Button';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
const {width, height} = Dimensions.get('window');

const fonts = [
  {label: 'EB_Garamond', value: 'EBGaramond-Variable'},
  {label: 'EB_Garamond_Bold', value: 'EBGaramond-Bold'},
  {label: 'EB_Garamond_Italic', value: 'EBGaramond-Italic'},
  {label: 'EBGaramond_BoldItalic', value: 'EBGaramond-BoldItalic'},
  {label: 'EBGaramond_ExtraBoldItalic', value: 'EBGaramond-ExtraBoldItalic'},
  {label: 'EBGaramond_ExtraBold', value: 'EBGaramond-ExtraBold'},
  {label: 'EBGaramond_Medium', value: 'EBGaramond-Medium'},
  {label: 'BGaramond_MediumItalic', value: 'EBGaramond-MediumItalic'},
  {label: 'EBGaramond_Regular', value: 'EBGaramond-Regular'},
  {label: 'EBGaramond_SemiBold', value: 'EBGaramond-SemiBold'},
  {label: 'EBGaramond_SemiBoldItalic', value: 'EBGaramond-SemiBoldItalic'},
];
const customActions = [
  'customFontFamily',
  'customFontSizeUp',
  'customFontSizeDown',
  'customTextColor',
];
const CreateDream = () => {
  const [currentDat, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const editorRef = useRef(null);
  const fontTriggerRef = useRef();

  const [htmlContent, setHtmlContent] = useState('');
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({top: 0, left: 0});
  const handleCustomAction = action => {
    if (action === 'customFontSizeUp') {
      editorRef.current?.commandDOM(
        `document.execCommand("fontSize", false, "5")`,
      );
    } else if (action === 'customFontSizeDown') {
      editorRef.current?.commandDOM(
        `document.execCommand("fontSize", false, "2")`,
      );
    } else if (action === 'customTextColor') {
      editorRef.current?.commandDOM(
        `document.execCommand("foreColor", false, "#007AFF")`,
      );
    }
  };
  const measureFontDropdown = () => {
    console.log('xdfdsfdsfds');
    const handle = findNodeHandle(fontTriggerRef.current);
    UIManager.measure(handle, (x, y, w, h, px, py) => {
      setDropdownPos({top: py + h, left: px});
      setShowFontDropdown(true);
    });
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
            style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
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

                {/* Editor */}
                <ScrollView style={styles.editorContainer}>
                  <RichEditor
                    ref={editorRef}
                    initialContentHTML=""
                    placeholder="Start writing here..."
                    androidHardwareAccelerationDisabled
                      androidLayerType="software"
                    // onChange={richTextHandle}
                    editorStyle={{
                      contentCSSText: `font-family: ${selectedFont.value}; font-size: 36px;`,
                    }}
                    style={styles.richEditor}
                  />
                </ScrollView>

                {/* Toolbar */}

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

                  right: 5,
                  paddingHorizontal: 0,
                }}>
                {/* <RichToolbar
                  editor={editorRef}
                  selectedIconTint="#873c1e"
                  iconTint="#312921"
                  actions={[
                    ...customActions,

                    actions.setUnderline,

                    actions.setBold,

                    actions.setItalic,
                  ]}
                  iconMap={{
                    customFontFamily: () => (
                      <TouchableOpacity
                        ref={fontTriggerRef}
                        onPress={measureFontDropdown}
                        style={styles.fontFamilyIconGroup}>
                        <Image
                          source={IconData.FONTITEM}
                          style={styles.fontIcon}
                          tintColor={Color.LIGHTGREEN}
                          resizeMode="contain"
                        />
                        <View style={{width: 100, marginLeft: 20}}>
                          <Text
                            // numberOfLines={1}
                            style={[
                              styles.fontLabel,
                              {fontFamily: selectedFont.value},
                            ]}>
                            {selectedFont.label}
                          </Text>
                        </View>
                        
                       <Image
                          source={IconData.DROP}
                          style={styles.dropdownIcon}
                          tintColor={Color.LIGHTGREEN}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ),
                    customFontSizeUp: () => (
                      <Image
                        style={[styles.toolbarIcon, {marginLeft: 100}]}
                        tintColor={Color.LIGHTGREEN}
                        source={IconData.FONTPLUS}
                      />
                    ),
                    customFontSizeDown: () => (
                      <Image
                        style={[styles.toolbarIcon, {marginLeft: 100}]}
                        tintColor={Color.LIGHTGREEN}
                        source={IconData.FONTMINUS}
                      />
                    ),
                    customTextColor: () => (
                      <Image
                        style={[styles.toolbarIcon, {marginLeft: 100}]}
                        tintColor={Color.LIGHTGREEN}
                        source={IconData.FONTCOLOR}
                      />
                    ),
                  }}
                  onPress={handleCustomAction}
                  style={styles.toolbar}
                /> */}
                <RichToolbar
                  editor={editorRef}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    // actions.insertBulletsList,
                    // actions.insertOrderedList,
                    // actions.insertLink,
                  ]}
                  style={styles.toolbar}
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
                  <View style={styles.fontDropdown}>
                    {fonts.map((font, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedFont(font);
                          setShowFontDropdown(false);
                          editorRef.current?.setContentStyle({
                            fontFamily: font.value,
                          });
                        }}
                        style={styles.fontOption}>
                        <Text style={{fontFamily: font.value, fontSize: 16}}>
                          {font.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
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
                onPress={() => {
                  updateProfile();
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
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 14, 14, 0.2)',
  },
  fontDropdown: {
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  fontOption: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});
export default CreateDream;
