import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../assets/Image';
import {callApi, callApi1} from './ApiCall';
import {Api} from '../Api';
import Toast from 'react-native-toast-message';
const {width, height} = Dimensions.get('window');
const PromptModal = ({visible, onClose, promptData, setPromptData}) => {
  const [header, setHeader] = useState('Categories');
  const [header2, setHeader2] = useState('Sub Categories');
  const [header3, setHeader3] = useState('Prompts');
 
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [prompts, setPrompts] = useState(null);
  const [listOpen, setListOpen] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const data = await callApi(Api.CATEGORIES);

      setCategories(data?.categories?.journal_prompt);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const openSubList = async dataId => {
    try {
      const data = await callApi1(`${Api.GET_SUBCATEGORIES}/${dataId}`);

      if (data?.success) {
        setSubCategories(data?.data);
        setListOpen(1);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Data Not Found',
          text2: 'Sub-Categories Data Not FOund',
          visibilityTime: 3000,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const openPropmptsList = async dataId => {
    console.log('Data', dataId);
    try {
      const data = await callApi1(`${Api.SUBCATEGORIES_PRMPTS}/${dataId}`);

      setPrompts(data?.data);
      setListOpen(2);
    } catch (error) {
      console.error('Error:', error.message);
    }
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
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        onPress={() => {
          openSubList(item?.id);
        }}>
        <Image
          source={{uri: item?.image_path}}
          style={{width: 24, height: 24}}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };
  const renderItem1 = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        // onPress={() => openPropmptsList(item?.sub_category)}>
        onPress={() => {
          console.log('Item', item);
          openPropmptsList(item?.sub_category);
        }}>
        <Image
          source={{uri: item?.image_url}}
          style={{width: 24, height: 24}}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item?.sub_category}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem2 = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        key={index}
        onPress={() => {
          setPromptData(item?.description);
          setListOpen(0);
          onClose();
        }}>
        <Text style={styles.title}>{item?.description}</Text>
      </TouchableOpacity>
    );
  };
  const backScreen = dataItem => {
    if (dataItem == 1) {
      setListOpen(0);
      fetchData();
    } else {
      setListOpen(1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalWrapper}>
          <ImageBackground
            source={ImageData.MODAL}
            style={styles.modalContainer}
            imageStyle={styles.imageStyle}>
            <View style={styles.header}>
              {listOpen != 0 && (
                <TouchableOpacity
                  onPress={() => {
                    backScreen(listOpen);
                  }}
                  style={styles.closeButton2}>
                  <Image
                    source={IconData.BACK1}
                    resizeMode="contain"
                    style={{width: 25, height: 24}}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontFamily: Font.EBGaramond_SemiBold,
                  fontSize: 24,
                  color: Color.LIGHTGREEN,
                }}>
                {listOpen == 0
                  ? header
                  : listOpen == 1
                  ? header2 || header
                  : header3 || header2}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setListOpen(0);
                  onClose();
                }}
                style={styles.closeButton}>
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
                data={
                  listOpen == 0
                    ? categories
                    : listOpen == 1
                    ? subcategories
                    : prompts
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
                ListEmptyComponent={emptyComponent}
                renderItem={
                  listOpen == 0
                    ? renderItem
                    : listOpen == 1
                    ? renderItem1
                    : renderItem2
                }
              />
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
    fontSize: 16,
    fontFamily: Font.EBGaramond_Regular,
    textAlign: 'center',
    color: Color.LIGHTGREEN,
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 5,
  },
  closeButton2: {
    position: 'absolute',
    left: 0,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Color.BROWN3,
    // paddingTop: 8,
    // paddingLeft: 12,
    // paddingRight: 13,
    // paddingBottom: 8,
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10,
  },
});
export default PromptModal;
