import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {Color, Font, IconData, ImageData} from '../../assets/Image';

const DeleteModal = ({visible, onClose,
  //  onDeleteAll, onDeleteOne
  }) => {
 console.log("Testsss")
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={styles.backdrop}>
        <ImageBackground
          source={ImageData.MODAL}
          style={styles.modal}
          imageStyle={styles.imageStyle}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={IconData.CANCEL} style={{width: 35, height: 35}} />
          </TouchableOpacity>

          <Text style={styles.title}>Delete Repeating Goal?</Text>

          <Text style={styles.message}>
            This is a repeating task. Do you want to delete just this entry or
            all the future entries too?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteAllBtn} 
            // onPress={onDeleteAll}
            >
              <Text style={styles.buttonText}>Delete All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteOneBtn}
            //  onPress={onDeleteOne}
             >
              <Image source={IconData.DELETE} style={{width: 25, height: 25}} />
              <Text style={styles.buttonText}> Delete Only This</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default DeleteModal;
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 40,
    width: 350,
    elevation: 10,
    shadowColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,

    color: Color.LIGHTGREEN,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  message: {
    fontSize: 16,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_Regular,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  deleteAllBtn: {
    backgroundColor: '#3e3e2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  deleteOneBtn: {
    backgroundColor: Color.LIGHTGREEN,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
  },
  buttonText: {
    color: Color.BROWN3,
    fontFamily: Font.EBGaramond_SemiBold,
    fontSize: 16,
  },
  imageStyle: {
    resizeMode: 'cover',
    borderRadius: 16,
  },
});
