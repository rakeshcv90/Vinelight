import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Color, Font, IconData, ImageData} from '../../../assets/Image';
import Button2 from '../../Component/Button2';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {deleteJournalData, setJournalEdit} from '../../redux/actions';
import moment from 'moment';
import WebView from 'react-native-webview';
const {width, height} = Dimensions.get('window');
const Journal = ({}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const memoizedBackground = useMemo(() => ImageData.MAINBACKGROUND, []);
  const getJournalData = useSelector(state => state?.user?.getJournalData);

  const [toolVisible, setToolVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [currentDat, setCurrentDate] = useState(
    moment().local().format('YYYY-MM-DD'),
  );
  const [editSet, setEditSet] = useState(false);

  const flattenDreamData = journalData => {
    const result = [];

    if (!Array.isArray(journalData)) {
      console.warn('flattenDreamData: dreamData is not an array:', journalData);
      return result; // return empty array safel
    }

    const sortedData = [...journalData].sort((a, b) => {
      const dateA = new Date(a?.currentDat || 0);
      const dateB = new Date(b?.currentDat || 0);
      return dateA - dateB;
    });

    sortedData.forEach(entry => {
      if (entry && entry?.currentDat && entry?.journal) {
        result.push({type: 'header', date: entry.currentDat});
        result.push({
          type: 'journal',
          date: entry.currentDat,
          journal: entry.journal,
        });
      }
    });

    return result;
  };

  const emptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
        }}>
        <Image
          source={IconData.NODATA}
          resizeMode="contain"
          style={{
            width: width * 0.5,
            height: height * 0.2,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontFamily: Font.EBGaramond_SemiBold,
            color: Color.LIGHTGREEN,
          }}>
          No journal data available.
        </Text>
      </View>
    );
  };
  // const formatDate = dateStr => {
  //   const date = new Date(dateStr);
  //   return date.toLocaleDateString('en-GB', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //   });
  // };
  const formatDate = dateStr => {
    const date = new Date(`${dateStr}T12:00:00`); // Add time to avoid timezone offset
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const htmlToPlainText = html => {
    if (!html) return '';
    // Remove HTML tags
    let plainText = html.replace(/<[^>]*>?/gm, '');

    // Basic decode of common HTML entities
    plainText = plainText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, '');

    return plainText;
  };

  const deleteDream = () => {
    dispatch(deleteJournalData(selectedJournal?.journal?.id));
  };
  useEffect(() => {
    const clickedDateData = getJournalData.find(
      d => d?.currentDat === currentDat,
    );
    if (clickedDateData == undefined) {
      setEditSet(false);
      dispatch(setJournalEdit(false));
    } else {
      setEditSet(true);
      dispatch(setJournalEdit(true));
    }
  }, [getJournalData]);

  return (
    <>
      {Platform.OS == 'ios' ? (
        <View
          style={[
            styles.secondaryContainer,
            {height: Platform.OS == 'android' && height >= 780 ? '90%' : '85%'},
          ]}>
          <FastImage
            source={memoizedBackground}
            style={styles.secondaryBackground}
            resizeMode={FastImage.resizeMode.stretch}>
            <View
              style={{
                width: '100%',
                // height: '72%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: '30%',
              }}>
              <View
                style={{
                  width: '90%',
                  height: '100%',
                  alignItems: 'center',
                  marginTop: '10%',
                  borderWidth: 1,
                  borderColor: Color.LIGHTGREEN,
                  backgroundColor: Color?.LIGHTBROWN,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: '10%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    backgroundColor: Color?.LIGHTBROWN,
                  }}>
                  <FastImage
                    source={ImageData.LEFT}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{width: 31, height: 31}}
                  />
                  <FastImage
                    source={ImageData.RIGHT}
                    resizeMode="contain"
                    style={{
                      width: 31,
                      height: 31,
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '7%',

                    flexDirection: 'row',
                    top: -height * 0.055,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subText}>Journal Entries</Text>
                </View>

                <View
                  style={{
                    width: '96%',
                    height: '63%',

                    alignItems: 'center',
                    alignSelf: 'center',
                    top: -height * 0.01,
                  }}>
                  <FlatList
                    data={flattenDreamData(getJournalData)} // Use the updated function
                    contentContainerStyle={{paddingBottom: 20}}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={emptyComponent}
                    keyExtractor={(item, index) =>
                      item.type === 'header'
                        ? `header-${item.date}`
                        : `dream-${item.journal.id}`
                    }
                    renderItem={({item, index}) => {
                      const htmlContent =
                        item?.journal?.journalContent ||
                        '<p>No content available</p>';

                      const wrappedHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, Roboto, sans-serif;
            font-size: 16px;
            color: #333;
            margin: 0;
            padding: 0;
          }
          p {
            margin: 0;
          }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;

                      if (item.type === 'header') {
                        return (
                          <View
                            style={{
                              width: '100%',
                              height: 30,
                              marginTop: index === 0 ? 0 : 20,
                            }}>
                            <View
                              style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  const clickedDateData = getJournalData.find(
                                    d => d?.currentDat === item?.date,
                                  );

                                  setSelectedJournal(clickedDateData);
                                  navigation.navigate('DisplayJournalEntry', {
                                    journal: clickedDateData,
                                  });
                                }}>
                                <Text style={styles.dateText}>
                                  {formatDate(item.date)}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPressIn={event => {
                                  const {pageX, pageY} = event.nativeEvent;
                                  setTooltipPosition({x: pageX, y: pageY});

                                  setToolVisible(true);
                                  const clickedDateData = getJournalData.find(
                                    d => d?.currentDat === item?.date,
                                  );

                                  setSelectedJournal(clickedDateData);
                                }}>
                                <Image
                                  source={IconData.DOTS}
                                  style={{width: 25, height: 25}}
                                />
                              </TouchableOpacity>
                            </View>
                            <View
                              style={{
                                width: '100%',
                                height: 2,
                                backgroundColor: Color.BROWN2,
                                marginVertical: 5,
                              }}
                            />
                          </View>
                        );
                      }

                      // DREAM item
                      const {journal} = item;

                      return (
                        <TouchableOpacity
                          style={styles.taskRow}
                          onPress={() => {
                            const clickedDateData = getJournalData.find(
                              d => d?.currentDat === item?.date,
                            );

                            setSelectedJournal(clickedDateData);
                            navigation.navigate('DisplayJournalEntry', {
                              journal: clickedDateData,
                            });
                          }}>
                          {/* <Text style={styles.taskText} numberOfLines={2}>
                            {journal?.journalContent
                              ? htmlToPlainText(journal?.journalContent)
                              : 'No content available'}
                          </Text> */}
                          {/* <RenderHtml
                        contentWidth={journal?.journalContent}
                        source={{html: content}}
                        baseStyle={{
                          numberOfLines: 3, // optional workaround using custom trimming
                          // text styles here
                        }}
                      /> */}
                          <WebView
                            originWhitelist={['*']}
                            source={{html: wrappedHtml}}
                            style={{height: 20, backgroundColor: 'transparent'}} // or use styles.webview
                            scrollEnabled={false}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '96%',
                    height: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    top: height * 0.035,
                    top:
                      Platform.OS == 'ios'
                        ? height * 0.035
                        : height >= 780
                        ? height * 0.025
                        : height * 0.035,
                    gap: 20,
                    flexDirection: 'row',
                  }}>
                  {!editSet ? (
                    <Button2
                      width={280}
                      height={50}
                      buttonTitle={'New Journal Entry'}
                      img={IconData.PLUS}
                      left={true}
                      size={20}
                      onPress={() => {
                        navigation.navigate('CreateJournalEntry');
                      }}
                    />
                  ) : (
                    <Button2
                      width={280}
                      height={50}
                      buttonTitle={'Edit Journal Entry'}
                      img={IconData.PEN2}
                      left={true}
                      size={20}
                      onPress={() => {
                        const clickedDateData = getJournalData.find(
                          d => d?.currentDat === currentDat,
                        );

                        navigation.navigate('EditJournalEntry', {
                          journalData: clickedDateData,
                        });
                      }}
                    />
                  )}
                </View>

                <View
                  style={{
                    width: '100%',
                    height: '10%',
                    flexDirection: 'row',

                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={ImageData.BACKLEFT}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      width: 31,
                      height: 31,
                    }}
                  />

                  <FastImage
                    source={ImageData.BACKRIGHT}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      width: 31,
                      height: 31,
                    }}
                  />
                </View>
              </View>
            </View>
            {toolVisible && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                }}>
                {/* Transparent touchable background to close tooltip */}
                <TouchableOpacity
                  activeOpacity={1}
                  style={{flex: 1}}
                  onPress={() => setToolVisible(false)}
                />

                {/* Tooltip itself */}
                <View
                  style={{
                    position: 'absolute',
                    top: tooltipPosition.y - 45,
                    left: tooltipPosition.x - 230,
                    width: 220,
                    backgroundColor: Color.LIGHTGREEN,
                    padding: 5,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      width: 210,
                      backgroundColor: Color.LIGHTGREEN,
                      padding: 5,
                      alignSelf: 'center',
                      borderRadius: 10,
                      borderColor: Color.BROWN4,
                      borderWidth: 2,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('EditJournalEntry', {
                          journalData: selectedJournal,
                        });

                        setToolVisible(false);
                      }}
                      style={{
                        paddingVertical: 6,
                        flexDirection: 'row',
                        gap: 10,
                      }}>
                      <Image
                        source={IconData.PEN}
                        style={{width: 20, height: 20, marginLeft: 5}}
                        resizeMode="contain"
                        tintColor={'#fff'}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 16,
                          fontFamily: Font.EBGaramond_SemiBold,
                        }}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        deleteDream();
                        setToolVisible(false);
                      }}
                      style={{
                        paddingVertical: 6,
                        flexDirection: 'row',
                        gap: 10,
                      }}>
                      <Image
                        source={IconData.DELETE}
                        style={{width: 20, height: 20, marginLeft: 5}}
                        resizeMode="contain"
                        tintColor={'#fff'}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 16,
                          fontFamily: Font.EBGaramond_SemiBold,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </FastImage>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.secondaryContainer,
              {
                height:
                  Platform.OS == 'android' && height >= 780 ? '90%' : '85%',
              },
            ]}>
            <FastImage
              source={memoizedBackground}
              style={styles.secondaryBackground}
              resizeMode={FastImage.resizeMode.stretch}>
              <View
                style={{
                  width: '100%',
                  // height: '72%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: '30%',
                }}>
                <View
                  style={{
                    width: '90%',
                    height: '100%',
                    alignItems: 'center',
                    marginTop: '10%',
                    borderWidth: 1,
                    borderColor: Color.LIGHTGREEN,
                    backgroundColor: Color?.LIGHTBROWN,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '10%',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: Color?.LIGHTBROWN,
                    }}>
                    <FastImage
                      source={ImageData.LEFT}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{width: 31, height: 31}}
                    />
                    <FastImage
                      source={ImageData.RIGHT}
                      resizeMode="contain"
                      style={{
                        width: 31,
                        height: 31,
                        backgroundColor: 'transparent',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: '7%',

                      flexDirection: 'row',
                      top: -height * 0.055,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.subText}>Journal Entries</Text>
                  </View>

                  <View
                    style={{
                      width: '96%',
                      height: '63%',

                      alignItems: 'center',
                      alignSelf: 'center',
                      top: -height * 0.01,
                    }}>
                    <FlatList
                      data={flattenDreamData(getJournalData)} // Use the updated function
                      contentContainerStyle={{paddingBottom: 20}}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={emptyComponent}
                      keyExtractor={(item, index) =>
                        item.type === 'header'
                          ? `header-${item.date}`
                          : `dream-${item.journal.id}`
                      }
                      renderItem={({item, index}) => {
                        const htmlContent =
                          item?.journal?.journalContent ||
                          '<p>No content available</p>';

                        const wrappedHtml = `
  

      <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-size: 16px;
        }
        .clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
    </head>
    <body>
      <div class="clamp">
        ${htmlContent}
      </div>
    </body>
  </html>
  `;

                        if (item.type === 'header') {
                          return (
                            <View
                              style={{
                                width: '100%',
                                height: 30,
                                marginTop: index === 0 ? 0 : 20,
                              }}>
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    const clickedDateData = getJournalData.find(
                                      d => d?.currentDat === item?.date,
                                    );

                                    setSelectedJournal(clickedDateData);
                                    navigation.navigate('DisplayJournalEntry', {
                                      journal: clickedDateData,
                                    });
                                  }}>
                                  <Text style={styles.dateText}>
                                    {formatDate(item.date)}
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPressIn={event => {
                                    const {pageX, pageY} = event.nativeEvent;
                                    setTooltipPosition({x: pageX, y: pageY});

                                    setToolVisible(true);
                                    const clickedDateData = getJournalData.find(
                                      d => d?.currentDat === item?.date,
                                    );

                                    setSelectedJournal(clickedDateData);
                                  }}>
                                  <Image
                                    source={IconData.DOTS}
                                    style={{width: 25, height: 25}}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View
                                style={{
                                  width: '100%',
                                  height: 2,
                                  backgroundColor: Color.BROWN2,
                                  marginVertical: 5,
                                }}
                              />
                            </View>
                          );
                        }

                        // DREAM item
                        const {journal} = item;

                        return (
                          <TouchableOpacity
                            style={styles.taskRow}
                            onPress={() => {
                              const clickedDateData = getJournalData.find(
                                d => d?.currentDat === item?.date,
                              );

                              setSelectedJournal(clickedDateData);
                              navigation.navigate('DisplayJournalEntry', {
                                journal: clickedDateData,
                              });
                            }}>
                            {/* <Text style={styles.taskText} numberOfLines={2}>
                              {journal?.journalContent
                                ? htmlToPlainText(journal?.journalContent)
                                : 'No content available'}
                            </Text> */}
                            {/* <RenderHtml
                        contentWidth={journal?.journalContent}
                        source={{html: content}}
                        baseStyle={{
                          numberOfLines: 3, // optional workaround using custom trimming
                          // text styles here
                        }}
                      /> */}
                            <WebView
                              originWhitelist={['*']}
                              source={{html: wrappedHtml}}
                              style={{
                                height: 20,
                                backgroundColor: 'transparent',
                              }} // or use styles.webview
                              scrollEnabled={false}
                            />
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: '96%',
                      height: '10%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      top: height * 0.035,
                      top:
                        Platform.OS == 'ios'
                          ? height * 0.035
                          : height >= 780
                          ? height * 0.025
                          : height * 0.030,
                      gap: 20,
                      flexDirection: 'row',
                    }}>
                    {!editSet ? (
                      <Button2
                        width={280}
                        height={50}
                        buttonTitle={'New Journal Entry'}
                        img={IconData.PLUS}
                        left={true}
                        size={20}
                        onPress={() => {
                          navigation.navigate('CreateJournalEntry');
                        }}
                      />
                    ) : (
                      <Button2
                        width={280}
                        height={50}
                        buttonTitle={'Edit Journal Entry'}
                        img={IconData.PEN2}
                        left={true}
                        size={20}
                        onPress={() => {
                          const clickedDateData = getJournalData.find(
                            d => d?.currentDat === currentDat,
                          );

                          navigation.navigate('EditJournalEntry', {
                            journalData: clickedDateData,
                          });
                        }}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: '10%',
                      flexDirection: 'row',

                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                    }}>
                    <FastImage
                      source={ImageData.BACKLEFT}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: 31,
                        height: 31,
                      }}
                    />

                    <FastImage
                      source={ImageData.BACKRIGHT}
                      resizeMode={FastImage.resizeMode.contain}
                      style={{
                        width: 31,
                        height: 31,
                      }}
                    />
                  </View>
                </View>
              </View>
              {toolVisible && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }}>
                  {/* Transparent touchable background to close tooltip */}
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1}}
                    onPress={() => setToolVisible(false)}
                  />

                  {/* Tooltip itself */}
                  <View
                    style={{
                      position: 'absolute',
                      top: tooltipPosition.y - 45,
                      left: tooltipPosition.x - 230,
                      width: 220,
                      backgroundColor: Color.LIGHTGREEN,
                      padding: 5,
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        width: 210,
                        backgroundColor: Color.LIGHTGREEN,
                        padding: 5,
                        alignSelf: 'center',
                        borderRadius: 10,
                        borderColor: Color.BROWN4,
                        borderWidth: 2,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('EditJournalEntry', {
                            journalData: selectedJournal,
                          });

                          setToolVisible(false);
                        }}
                        style={{
                          paddingVertical: 6,
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        <Image
                          source={IconData.PEN}
                          style={{width: 20, height: 20, marginLeft: 5}}
                          resizeMode="contain"
                          tintColor={'#fff'}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: Font.EBGaramond_SemiBold,
                          }}>
                          Edit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          deleteDream();
                          setToolVisible(false);
                        }}
                        style={{
                          paddingVertical: 6,
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        <Image
                          source={IconData.DELETE}
                          style={{width: 20, height: 20, marginLeft: 5}}
                          resizeMode="contain"
                          tintColor={'#fff'}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: Font.EBGaramond_SemiBold,
                          }}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </FastImage>
          </View>
        </>
      )}
    </>
  );
};

export default Journal;

const styles = StyleSheet.create({
  secondaryContainer: {
    // flex:1,
    width: '90%',
    height: '85%',
  },
  secondaryBackground: {
    width: '100%',
    height: '100%',
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  dateText: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
  },
  taskRow: {
    padding: 2,
    height: 60,
    marginBottom: 0,
    borderRadius: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: Color.LIGHTGREEN,
    lineHeight: 24,
    textAlign: 'left',
    fontFamily: Font.EBGaramond_Regular,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
