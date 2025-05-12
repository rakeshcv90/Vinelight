import {PermissionsAndroid, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {PERMISSIONS} from 'react-native-permissions';

export const useGalleryPermission = () => {
  //suitable permission as per the platform
  const permission =
    Platform.OS == 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : Platform.Version >= 33
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  //check
  const checkPermissionForLibarary = async () => {
    try {
      return await check(permission);
    } catch (error) {
      console.log(error, 'error in checking permissions');
    }
  };
  //ask
  const askPermissionForLibrary = async () => {
    try {
      return await request(permission);
    } catch (error) {
      console.log('LibimageError', error);
    }
  };
  //launch
  const launchLibrary = async () => {
    try {
      const resultLibrary = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: true,

        maxWidth: 300,
        maxHeight: 200,
      });
      return resultLibrary;
    } catch (error) {
      console.log('errreerere', error);
      showMessage({
        message:
          'Please check and enable all the required permissions from app settings',
        floating: true,
        duration: 500,
        type: 'danger',
        icon: {icon: 'auto', position: 'left'},
      });
    }
  };
  return {
    checkPermissionForLibarary,
    askPermissionForLibrary,
    launchLibrary,
  };
};
