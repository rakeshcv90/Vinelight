import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Navigation/Router';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {Color, Font} from './assets/Image';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux/store';
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
  const toastConfig = {
    success: internalState => (
      <View style={{height: 60, backgroundColor: 'green', padding: 10}}>
        <Text style={{color: 'white', fontSize: 18}}>
          {internalState.text1}
        </Text>
        <Text style={{color: 'white', fontSize: 16}}>
          {internalState.text2}
        </Text>
      </View>
    ),
    error: internalState => (
      <View style={{backgroundColor: '#DC3545', padding: 10, borderRadius: 10}}>
        <Text style={{color: 'white', fontSize: 18}}>
          {internalState.text1}
        </Text>
        <Text style={{color: 'white', fontSize: 16}}>
          {internalState.text2}
        </Text>
      </View>
    ),
    // Add more custom styles for other toast types if needed
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Router />
            <Toast config={customToastConfig} />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
