import {View, Text, Image} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Navigation/Router';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {Color, Font} from './assets/Image';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BackHandler} from 'react-native';
import useDisableBackButton from './src/Component/useDisableBackButton';
const customToastConfig = {
  error: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'red', width: '90%'}}
      text1Style={{
        fontSize: 20,
        fontFamily: Font?.EBGaramond_MediumItalic,
      }}
      text2Style={{
        fontSize: 17,
        fontFamily: Font?.EBGaramond_Regular,
      }}
    />
  ),
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: 'green', width: '90%'}}
      text1Style={{
        fontSize: 20,
        fontFamily: Font?.EBGaramond_MediumItalic,
      }}
      text2Style={{
        fontSize: 17,
        fontFamily: Font?.EBGaramond_Regular,
      }}
    />
  ),
};

const App = () => {

   useDisableBackButton();
  const toastConfig = {
    custom: ({props}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Color?.LIGHTBROWN,
          padding: 14,
          borderRadius: 12,
          shadowColor: '#000',
          borderWidth: 3,
          borderColor: Color.BROWN,
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 2},
          shadowRadius: 4,
          elevation: 5,
          width: '90%',
          alignSelf: 'center',
          marginTop: 10,
        }}>
        {props?.icon && (
          <Image
            source={props.icon}
            style={{width: 35, height: 35, marginRight: 12}}
            resizeMode="contain"
          />
        )}
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            color: '#2c2c2c',
            fontFamily: 'System',
            lineHeight: 22,
          }}>
          {props?.text || 'Default message'}
        </Text>
      </View>
    ),
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
    
         
            <NavigationContainer>
              <Router />
              <Toast config={toastConfig} />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
