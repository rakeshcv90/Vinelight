import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import { Color } from '../../assets/Image';

const {width, height} = Dimensions.get('window');

const ActivityLoader = (props) => {
  const [icon, showIcon] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      showIcon(!icon);
    }, 100);
  }, [icon]);
  const {visible} = props;
  return (
    // <Modal visible={visible} transparent={true} animationType="fade">
    //   <View
    //     style={{
    //       height: height * 0.1,
    //       width: width * 0.2,
    //       backgroundColor:Color.BROWN3,
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       alignSelf: 'center',
    //       borderRadius: 15,
    //       marginTop: 'auto',
    //       marginBottom: 'auto',
    //       zIndex:1
    //     }}>
    //     <AnimatedLottieView
    
    //       source={require('../../assets/loader2.json')}
    //       speed={2}
    //       autoPlay
    //       loop
    //       style={{width: width * 0.2, height: height * 0.1}}
    //     />
    //   </View>
    // </Modal>
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <AnimatedLottieView
            source={require('../../assets/loader2.json')}
            speed={2}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,       // for iOS
    elevation: 9999,    // for Android
  },
  loaderBox: {
    height: height * 0.1,
    width: width * 0.2,
    backgroundColor: Color.BROWN3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  lottie: {
    width: width * 0.2,
    height: height * 0.1,
  },
});
export default ActivityLoader;
