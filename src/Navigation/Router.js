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
import CreateDream from '../Screen/Dreams/CreateDream';
import AdvanceMediaPlayer from '../Screen/Meditate/AdvanceMediaPlayer';
import AdvanceMusicPlayer from '../Screen/Meditate/AdvanceMusicPlayer';
import Subscription from '../Screen/Subscription';
import CreateJournalEntry from '../Screen/Journal/CreateJournalEntry';
import DisplayJournalEntry from '../Screen/Journal/DisplayJournalEntry';
import DreamView from '../Screen/Dreams/DreamView';
import EditDream from '../Screen/Dreams/EditDream';
import EditJournalEntry from '../Screen/Journal/EditJournalEntry';

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

      <Stack.Screen name="CreateDream" component={CreateDream} />
      <Stack.Screen name="AdvanceMediaPlayer" component={AdvanceMediaPlayer} />
      <Stack.Screen name="AdvanceMusicPlayer" component={AdvanceMusicPlayer} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="CreateJournalEntry" component={CreateJournalEntry} />
      <Stack.Screen name="DisplayJournalEntry" component={DisplayJournalEntry} />
      <Stack.Screen name="DreamView" component={DreamView} />
      <Stack.Screen name="EditDream" component={EditDream} />
      <Stack.Screen name="EditJournalEntry" component={EditJournalEntry} />
    </Stack.Navigator>
  );
};

export default Router;
