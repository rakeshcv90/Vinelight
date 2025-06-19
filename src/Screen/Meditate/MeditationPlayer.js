// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
//   Dimensions,
//   ScrollView,
//   Platform,
// } from 'react-native';
// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {Color, Font, IconData, ImageData} from '../../../assets/Image';
// import ProgressBar from '../../Component/ProgressBar';
// import Tts from 'react-native-tts';
// import {InteractionManager} from 'react-native';
// import axios from 'axios';
// import { Buffer } from 'buffer';
// import RNBlobUtil from 'react-native-blob-util';
// import useNativeMusicPlayer from '../../Component/NativeusicPlayer';

// const {width, height} = Dimensions.get('window');


// const MeditationPlayer = ({route, navigation}) => {
//   const [defaultMusic, setDefaultMusic] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [pauseSound, setPauseSound] = useState(false);
//   const scrollRef = useRef(null);
//   const [ttsOpen, setTtsOpen] = useState(false);

//   const handleUpdateTime = useCallback(time => {
//     setCurrentTime(time);
//   }, []);
//   const [ttsInitialized, setTtsInitialized] = useState(false);
//   const TextSpeech = `${route?.params?.itemData?.description}`;
//   const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
//   const words = cleanText.match(/\S+/g);
//   const iosIntervalRef = useRef(null);
//   const [currentWordIndex, setCurrentWordIndex] = useState(-1);
//   const wordRefs = useRef([]);

//   const ELEVEN_API_KEY = 'sk_35512c8e27732058f7d4408362db0724d1b9067ceeef9c72';
// const VOICE_ID = '4EIVsml57Z1OVvJ8DK6f';
//   const [song, setSong] = useState('');

//   const {
//     setCustomSong,
//     playMusic,
//     initialized,
//     cleanup,
//   } = useNativeMusicPlayer({
//     getSoundOffOn: true,
//     song1: song,
//     song2: null,
//   });

//   const speakText = useCallback(async (text) => {
//     try {
//       const outputPath = `${RNBlobUtil.fs.dirs.DocumentDir}/eleven_speech.mp3`;

//       const response = await axios.post(
//         `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
//         {
//           text,
//           model_id: 'eleven_multilingual_v2',
//           voice_settings: {
//             stability: 0.8,
//             similarity_boost: 1.0,
//           },
//         },
//         {
//           headers: {
//             'xi-api-key': ELEVEN_API_KEY,
//             'Content-Type': 'application/json',
//             Accept: 'audio/mpeg',
//           },
//           responseType: 'arraybuffer',
//         }
//       );

//       const base64Data = Buffer.from(response.data).toString('base64');
//       await RNBlobUtil.fs.writeFile(outputPath, base64Data, 'base64');

//       console.log('✅ File written at:', outputPath);

//       // ✅ IMPORTANT: Pass raw file path — NOT file:// and NOT { uri: ... }
//       setSong(outputPath); // your native code expects string only
//       playMusic('player1');

//     } catch (error) {
//       console.error('❌ ElevenLabs TTS Error:', error?.response?.data || error);
//     }
//   }, [setSong, playMusic]);



//   useEffect(() => {
//     wordRefs.current = words.map(
//       (_, i) => wordRefs.current[i] || React.createRef(),
//     );
//   }, [words]);

//   // useEffect(() => {
//   //   const initTts = async () => {
//   //     try {
//   //       if (Platform.OS == 'ios') {
//   //         const voices = await Tts.voices();

//   //         const femaleVoice = voices.find(
//   //           voice =>
//   //             voice.language.startsWith('en') &&
//   //             voice.name === 'Samantha' && // You can try 'Karen', 'Tessa', etc.
//   //             !voice.notInstalled,
//   //         );

//   //         if (femaleVoice) {
//   //           await Tts.setDefaultLanguage(femaleVoice.language);
//   //           await Tts.setDefaultVoice(femaleVoice.id);
//   //         } else {
//   //           await Tts.setDefaultLanguage('en-IN'); // fallback
//   //         }
//   //         await Tts.setDefaultRate(0.4);
//   //         Tts.setDucking(true)
//   //       } else {
//   //         await Tts.setDefaultLanguage('en-IN');
//   //         await Tts.setDefaultRate(0.35);
//   //       }

//   //       await Tts.setDucking(true);
//   //       await Tts.setIgnoreSilentSwitch('ignore');
      
//   //       setTtsInitialized(true);

//   //       if (Platform.OS === 'android') {
//   //         Tts.addEventListener('tts-progress', event => {
//   //           const {start} = event;

//   //           if (typeof start !== 'number') {
//   //             console.log('❌ Invalid event:', event);
//   //             return;
//   //           }

//   //           const partial = cleanText.substring(0, start);
//   //           const index =
//   //             partial.trim().split(/\s+/).filter(Boolean).length - 1;

//   //           setCurrentWordIndex(index);
//   //           scrollToWord(index);
//   //         });

//   //         Tts.addEventListener('tts-finish', () => {
//   //           setCurrentWordIndex(-1);
//   //         });
//   //       }
//   //     } catch (error) {
//   //       console.log('TTS Init Error:', error);
//   //     }
//   //   };

//   //   initTts();

//   //   return () => {
//   //     Tts.removeAllListeners('tts-progress');
//   //     Tts.removeAllListeners('tts-finish');
//   //     if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
//   //   };
//   // }, []);


//   const scrollToWord = index => {
//     InteractionManager.runAfterInteractions(() => {
//       const wordRef = wordRefs.current[index];
//       if (wordRef?.current && scrollRef.current) {
//         wordRef.current.measureLayout(
//           scrollRef.current,
//           (x, y) => {
//             scrollRef.current.scrollTo({y: y - 100, animated: true});
//           },
//           err => console.log('📛 measureLayout error:', err),
//         );
//       }
//     });
//   };


//   // const elevenlabs = new ElevenLabsClient();
  

//   useEffect(() => {
// //     const audio = elevenlabs.textToSpeech.convert('BpjGufoPiobT79j2vtj4', {
// //   text: cleanText,
// //   modelId: 'eleven_multilingual_v2',
// //   outputFormat: 'mp3_44100_128',
// // });

// speakText(cleanText);


//     if (ttsOpen) {

//       setCurrentWordIndex(-1);
//       Tts.speak(cleanText);

//       if (Platform.OS === 'ios') {
//         let index = 0;
//         const wpm = 160;
//         const delay = 60000 / wpm; 

//         iosIntervalRef.current = setInterval(() => {
//           if (index < words.length) {
//             setCurrentWordIndex(index);
//             scrollToWord(index);
//             index++;
//           } else {
//             clearInterval(iosIntervalRef.current);
//             setCurrentWordIndex(-1);
//           }
//         }, delay);
//       }
//     } else {
//       Platform.OS == 'android' ?Tts.stop():Tts.stop();
//       //
//       setCurrentWordIndex(-1);
//       if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
//     }
//   }, [ttsOpen]);
//   const formatDuration = totalSeconds => {
//     const minutes = Math.floor(totalSeconds / 60);
//     const seconds = totalSeconds % 60;
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="light-content"
//       />

//       <ImageBackground
//         source={ImageData.BACKGROUND}
//         style={styles.primaryBackground}
//         resizeMode="cover">
//         <View
//           style={{
//             width: '100%',
//             height: 70,
//             padding: 10,
//             position: 'absolute',
//             top: height * 0.05,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             zIndex: 1,
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               setPauseSound(true);
//               navigation.goBack();
//               Tts.stop()
//             }}
//             style={{
//               width: 50,
//               height: 50,
//               backgroundColor: Color?.LIGHTGREEN,
//               borderRadius: 25,
//               alignSelf: 'center',
//               marginVertical: '5%',
//               borderWidth: 3,
//               justifyContent: 'center',
//               alignItems: 'center',
//               zIndex: 1,
//               borderColor: Color?.BROWN2,
//             }}>
//             <View
//               style={{
//                 width: 40,
//                 height: 40,
//                 backgroundColor: Color?.BROWN4,
//                 borderRadius: 20,
//                 alignSelf: 'center',
//                 marginVertical: '5%',
//                 borderWidth: 3,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderColor: Color?.BROWN2,
//               }}>
//               <Image
//                 source={IconData.BACK}
//                 tintColor={Color?.LIGHTGREEN}
//                 style={{width: 24, height: 24}}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.secondaryContainer}>
//           <ImageBackground
//             source={ImageData.MAINBACKGROUND}
//             style={styles.secondaryBackground}
//             resizeMode="stretch">
//             <View
//               style={{
//                 width: '100%',
//                 height: '76%',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginVertical: '35%',
//                 paddingVertical: '0%',
//               }}>
//               <View
//                 style={{
//                   width: '90%',
//                   height: '100%',
//                   alignItems: 'center',
//                   marginTop: '10%',
//                   borderWidth: 1,
//                   borderColor: Color.LIGHTGREEN,
//                   backgroundColor: Color?.LIGHTBROWN,
//                 }}>
//                 <View
//                   style={{
//                     width: '100%',
//                     height: '10%',
//                     flexDirection: 'row',
//                     alignItems: 'flex-start',
//                     justifyContent: 'space-between',
//                   }}>
//                   <Image
//                     source={ImageData.LEFT}
//                     resizeMode="contain"
//                     style={{width: 31, height: 31}}
//                   />
//                   <Image
//                     source={ImageData.RIGHT}
//                     resizeMode="contain"
//                     style={{
//                       width: 31,
//                       height: 31,
//                       backgroundColor: 'transparent',
//                     }}
//                   />
//                 </View>
//                 <View
//                   style={{
//                     width: '100%',
//                     height: '7%',

//                     flexDirection: 'row',
//                     top: -height * 0.05,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Text style={styles.subText}>
//                     {route?.params?.itemData?.name}
//                   </Text>
                  
//                 </View>

//                 <View
//                   style={{
//                     width: '96%',
//                     height: '58%',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     alignSelf: 'center',
//                     top: -height * 0.04,
//                     padding: 10,
//                   }}>
//                   <ScrollView
//                     ref={scrollRef}
//                     contentContainerStyle={{paddingBottom: 40}}
//                     showsVerticalScrollIndicator={false}>
//                     <Text style={styles.textBlock}>
//                       {words.map((word, index) => (
//                         <View key={index} ref={wordRefs.current[index]}>
//                           <Text
//                             style={[
//                               styles.textBlock,
//                               {
//                                 color:
//                                   index === currentWordIndex
//                                     ? Color.LIGHTGREEN
//                                     : '#60723E',
//                                 fontWeight:
//                                   index === currentWordIndex
//                                     ? Font.EBGaramond_SemiBold
//                                     : Font.EB_Garamond,
//                               },
//                             ]}>
//                             {word + ' '}
//                           </Text>
//                         </View>
//                       ))}
//                     </Text>
//                   </ScrollView>
//                 </View>
//                 <View
//                   style={{
//                     width: '96%',
//                     height: '15%',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     alignSelf: 'center',
//                     top: height * 0.035,
//                   }}>
//                   <ProgressBar
//                     type={'Dynamic'}
//                     data={route?.params?.itemData}
//                     defaultMusic={defaultMusic}
//                     setDefaultMusic={setDefaultMusic}
//                     onUpdateTime={handleUpdateTime}
//                     pauseSound={pauseSound}
//                     ttsOpen={ttsOpen}
//                     setTtsOpen={setTtsOpen}
//                   />
//                 </View>

//                 <View
//                   style={{
//                     width: '100%',
//                     height: '10%',
//                     flexDirection: 'row',

//                     alignItems: 'flex-end',
//                     justifyContent: 'space-between',
//                   }}>
//                   <Image
//                     source={ImageData.BACKLEFT}
//                     resizeMode="contain"
//                     style={{
//                       width: 31,
//                       height: 31,
//                     }}
//                   />

//                   <Image
//                     source={ImageData.BACKRIGHT}
//                     resizeMode="contain"
//                     style={{
//                       width: 31,
//                       height: 31,
//                     }}
//                   />
//                 </View>
//               </View>
//             </View>
//           </ImageBackground>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// export default MeditationPlayer;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   primaryBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   secondaryContainer: {
//     width: '90%',
//     height: '90%',
//   },
//   secondaryBackground: {
//     width: '100%', // Fills the parent container
//     height: '100%', // Fills the parent container
//   },
//   subText: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: Color.LIGHTGREEN,
//     textAlign: 'center',
//     fontFamily: Font.EBGaramond_SemiBold,
//   },
//   durationBadge: {
//     backgroundColor: Color.LIGHTBROWN2,
//     paddingLeft: 6,
//     paddingRight: 6,
//     gap: 10,
//     marginLeft: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//   },
//   durationText: {
//     fontSize: 12,
//     color: Color.LIGHTGREEN,
//     fontFamily: Font.EBGaramond_SemiBold,
//   },
//   lyricsBox: {
//     flex: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   textBlock: {
//     fontSize: 32,
//     fontFamily: Font.EBGaramond_Regular,
//     color: Color.LIGHTGREEN,
//     textAlign: 'center',
//     flexWrap: 'wrap',
//   },
//   highlightedWord: {
//     backgroundColor: '#fff200',
//     color: 'black',
//     borderRadius: 4,
//   },
// });

// // import React, { useState, useCallback } from 'react';
// // import { View, Button } from 'react-native';
// // import axios from 'axios';
// // import { Buffer } from 'buffer';
// // import RNBlobUtil from 'react-native-blob-util';
// // import useNativeMusicPlayer from '../../Component/NativeusicPlayer';



// //   return (
// //     <View style={{ padding: 20 }}>
// //       <Button
// //         title="Play ElevenLabs TTS"
// //         onPress={() =>
// //           speakText(
// //             'Welcome to this 30-minute body scan meditation. Begin by finding a comfortable position. You can lie down or sit with support-whatever feels most restful and stable for you. Let your arms rest gently by your sides, and if you’re comfortable, allow your eyes to close. This time is just for you. No need to achieve or perform anything. Simply be here.  Begin by bringing awareness to your breath. Notice the gentle inhale. and the natural exhale.  Feel your body breathing-effortlessly.  Let your breath anchor you in this present moment.  Setting the Intention  As we move through this body scan, allow yourself to be curious.'
// //           )
// //         }
// //       />
// //       <Button title="Stop & Cleanup" onPress={cleanup} />
// //     </View>
// //   );
// // };

// // export default ElevenTTSPlayer;




import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import ProgressBar from '../../Component/ProgressBar';
import axios from 'axios';
import { Buffer } from 'buffer';
import RNBlobUtil from 'react-native-blob-util';
import useNativeMusicPlayer from '../../Component/NativeusicPlayer';

const {width, height} = Dimensions.get('window');

const MeditationPlayer = ({route, navigation}) => {
  const [defaultMusic, setDefaultMusic] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [pauseSound, setPauseSound] = useState(false);
  const scrollRef = useRef(null);
  const [ttsOpen, setTtsOpen] = useState(false);

  const handleUpdateTime = useCallback(time => {
    setCurrentTime(time);
  }, []);

  const TextSpeech = `${route?.params?.itemData?.description}`;
  const cleanText = TextSpeech.replace(/<\/?[^>]+(>|$)/g, '');
  const words = cleanText.match(/\S+/g);
  const iosIntervalRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const wordRefs = useRef([]);

  const ELEVEN_API_KEY = 'sk_b3007002ebeae5612c2b61889079365324a34dde739b1979';
  const VOICE_ID = '4EIVsml57Z1OVvJ8DK6f';
  const [song, setSong] = useState('');

  const {
    setCustomSong,
    playMusic,
    initialized,
    cleanup,
  } = useNativeMusicPlayer({
    getSoundOffOn: true,
    song1: null,
    song2: song,
  });

  const speakText = useCallback(async (text) => {
    // try {
    //   const outputPath = `${RNBlobUtil.fs.dirs.DocumentDir}/eleven_speech.mp3`;

    //   const response = await axios.post(
    //     `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    //     {
    //       text,
    //       model_id: 'eleven_multilingual_v2',
    //       voice_settings: {
    //         stability: 0.8,
    //         similarity_boost: 1.0,
    //       },
    //     },
    //     {
    //       headers: {
    //         'xi-api-key': ELEVEN_API_KEY,
    //         'Content-Type': 'application/json',
    //         Accept: 'audio/mpeg',
    //       },
    //       responseType: 'arraybuffer',
    //     }
    //   );

    //   const base64Data = Buffer.from(response.data).toString('base64');
    //   await RNBlobUtil.fs.writeFile(outputPath, base64Data, 'base64');
    //   console.log('✅ File written at:', outputPath, route?.params?.itemData);

    //   setSong(outputPath);
    //   playMusic('player2');
    // } catch (error) {
    //   console.error('❌ ElevenLabs TTS Error:', error?.response?.data || error);
    // }

    try {
    const meditationName = sanitizeFileName(route?.params?.itemData?.name || 'default');
    const outputPath = `${RNBlobUtil.fs.dirs.DocumentDir}/${meditationName}_speech.mp3`;
    const exists = await RNBlobUtil.fs.exists(outputPath);

    if (exists) {
      // ✅ Use the cached file
      const voiceUri = encodeURI(`file://${outputPath}`);
      setCustomSong(voiceUri, 'player2');
      return;
    }

    // 🔄 Otherwise, fetch from ElevenLabs API
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.8,
          similarity_boost: 1.0,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVEN_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Data = Buffer.from(response.data).toString('base64');
    await RNBlobUtil.fs.writeFile(outputPath, base64Data, 'base64');
    const voiceUri = encodeURI(`file://${outputPath}`);
    setCustomSong(voiceUri, 'player2');
  } catch (error) {
    console.error('❌ ElevenLabs TTS Error:', error?.response?.data || error);
  }
  }, [setSong, playMusic]);

  const sanitizeFileName = (name) => {
  if (!name) return 'default_meditation';
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

  useEffect(() => {
    wordRefs.current = words.map(
      (_, i) => wordRefs.current[i] || React.createRef(),
    );
  }, [words]);

  useEffect(() => {
    speakText(cleanText);
    if (ttsOpen) {

      if (Platform.OS === 'ios') {
        let index = 0;
        const wpm = 160;
        const delay = 60000 / wpm; 

        iosIntervalRef.current = setInterval(() => {
          if (index < words.length) {
            setCurrentWordIndex(index);
            scrollToWord(index);
            index++;
          } else {
            clearInterval(iosIntervalRef.current);
            setCurrentWordIndex(-1);
          }
        }, delay);
      }
    } else {
      setCurrentWordIndex(-1);
      if (iosIntervalRef.current) clearInterval(iosIntervalRef.current);
    }
  }, [ttsOpen]);

  const scrollToWord = index => {
    const wordRef = wordRefs.current[index];
    if (wordRef?.current && scrollRef.current) {
      wordRef.current.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({y: y - 100, animated: true});
        },
        err => console.log('📛 measureLayout error:', err),
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={ImageData.BACKGROUND} style={styles.primaryBackground} resizeMode="cover">
        <View style={{ width: '100%', height: 70, padding: 10, position: 'absolute', top: height * 0.05, flexDirection: 'row', justifyContent: 'space-between', zIndex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setPauseSound(true);
              navigation.goBack();
              cleanup();
            }}
            style={{ width: 50, height: 50, backgroundColor: Color?.LIGHTGREEN, borderRadius: 25, alignSelf: 'center', borderWidth: 3, justifyContent: 'center', alignItems: 'center', zIndex: 1, borderColor: Color?.BROWN2 }}>
            <View style={{ width: 40, height: 40, backgroundColor: Color?.BROWN4, borderRadius: 20, borderWidth: 3, justifyContent: 'center', alignItems: 'center', borderColor: Color?.BROWN2 }}>
              <Image source={IconData.BACK} tintColor={Color?.LIGHTGREEN} style={{ width: 24, height: 24 }} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.secondaryContainer}>
          <ImageBackground source={ImageData.MAINBACKGROUND} style={styles.secondaryBackground} resizeMode="stretch">
            <View style={{ width: '100%', height: '76%', justifyContent: 'center', alignItems: 'center', marginVertical: '35%', paddingVertical: '0%' }}>
              <View style={{ width: '90%', height: '100%', alignItems: 'center', marginTop: '10%', borderWidth: 1, borderColor: Color.LIGHTGREEN, backgroundColor: Color?.LIGHTBROWN }}>
                <View style={{ width: '100%', height: '10%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Image source={ImageData.LEFT} resizeMode="contain" style={{ width: 31, height: 31 }} />
                  <Image source={ImageData.RIGHT} resizeMode="contain" style={{ width: 31, height: 31 }} />
                </View>
                <View style={{ width: '100%', height: '7%', top: -height * 0.05, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.subText}>{route?.params?.itemData?.name}</Text>
                </View>
                <View style={{ width: '96%', height: '58%', justifyContent: 'center', alignItems: 'center', top: -height * 0.04, padding: 10 }}>
                  <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.textBlock}>
                      {words.map((word, index) => (
                        <View key={index} ref={wordRefs.current[index]}>
                          <Text style={[styles.textBlock, { color: index === currentWordIndex ? Color.LIGHTGREEN : '#60723E', fontWeight: index === currentWordIndex ? Font.EBGaramond_SemiBold : Font.EB_Garamond }]}> {word + ' '}</Text>
                        </View>
                      ))}
                    </Text>
                  </ScrollView>
                </View>
                <View style={{ width: '96%', height: '15%', justifyContent: 'center', alignItems: 'center', top: height * 0.035 }}>
                  <ProgressBar
                    type={'Dynamic'}
                    data={route?.params?.itemData}
                    defaultMusic={defaultMusic}
                    setDefaultMusic={setDefaultMusic}
                    onUpdateTime={handleUpdateTime}
                    pauseSound={pauseSound}
                    ttsOpen={ttsOpen}
                    setTtsOpen={setTtsOpen}
                  />
                </View>
                <View style={{ width: '100%', height: '10%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Image source={ImageData.BACKLEFT} resizeMode="contain" style={{ width: 31, height: 31 }} />
                  <Image source={ImageData.BACKRIGHT} resizeMode="contain" style={{ width: 31, height: 31 }} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    </View>
  );
};

export default MeditationPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primaryBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryContainer: {
    width: '90%',
    height: '90%',
  },
  secondaryBackground: {
    width: '100%',
    height: '100%',
  },
  subText: {
    fontSize: 20,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  textBlock: {
    fontSize: 32,
    fontFamily: Font.EBGaramond_Regular,
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});
