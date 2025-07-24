import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const useDisableBackButton = () => {
useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // This disables the back button
    });

    return () => backHandler.remove(); // Clean up
  }, []);
};



export default useDisableBackButton;