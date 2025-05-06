import {View, Text, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import React from 'react';

const Wrapper = ({children, styles}) => {
  return (
    <SafeAreaView style={[style.container, {...styles}]}>
      {children}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },
});
export default Wrapper;
