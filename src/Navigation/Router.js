import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../Screen/Splash';
import IntroScreen from '../Screen/IntroScreen';
import MainPage from '../Screen/MainPage';
import Profile from '../Screen/Profile';
import MeditationPlayer from '../Screen/Meditate/MeditationPlayer';
import CustomMeditationPlayer from '../Screen/Meditate/CustomMeditationPlayer';
import CustomMeditation from '../Screen/Meditate/CustomMeditation';
import AdvanceSetting from '../Screen/Meditate/AdvanceSetting';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right', // 👈 Use this to animate between screens
  contentStyle: {
    backgroundColor: '#333e22',
  },
};

const Router = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="MainPage" component={MainPage} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MeditationPlayer" component={MeditationPlayer} />
      <Stack.Screen
        name="CustomMeditationPlayer"
        component={CustomMeditationPlayer}
      />
      <Stack.Screen name="CustomMeditation" component={CustomMeditation} />
      <Stack.Screen name="AdvanceSetting" component={AdvanceSetting} />
    </Stack.Navigator>
  );
};

export default Router;
