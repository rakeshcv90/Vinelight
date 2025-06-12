import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Color,
  Font,
  IconData,
  ImageData,
  PLATFORM_IOS,
} from '../../assets/Image';
import FastImage from 'react-native-fast-image';
import Button from '../Component/Button';
import {useDispatch, useSelector} from 'react-redux';
import * as RNIap from 'react-native-iap';
import Toast from 'react-native-toast-message';
import ActivityLoader from '../Component/ActivityLoader';
import {setSubscriptionDetails} from '../redux/actions';

const {width, height} = Dimensions.get('window');
const Subscription = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const subscription = useSelector(state => state?.user?.subscription);
  const subscription_products = useSelector(state => state?.user?.getProducts);
  const dispatch = useDispatch();
  const url = 'https://www.instagram.com/vinelightapp/';
  const url1 = 'https://arkanaapps.com/contact/';
  const [selectedPackege, setSelectedPackage] = useState(null);
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(url);
    }
  }, [url]);
  function parseBillingPeriod(period) {
    if (!period) return '';

    const time = period.substring(1); // remove 'P'

    if (time.endsWith('M')) {
      const months = time.replace('M', '');
      return `${months} Month${months > 1 ? 's' : ''}`;
    }
    if (time.endsWith('W')) {
      const weeks = time.replace('W', '');
      return `${weeks} Week${weeks > 1 ? 's' : ''}`;
    }
    if (time.endsWith('D')) {
      const days = time.replace('D', '');
      return `${days} Day${days > 1 ? 's' : ''}`;
    }
    return period;
  }
  const extractPrice = formattedPrice => {
    if (!formattedPrice) return 0;
    const numeric = formattedPrice.replace(/[^0-9.]/g, '');
    return parseFloat(numeric) || 0;
  };

  let monthlyPrice = 0;
  let yearlyPrice = 0;

  subscription_products?.forEach(item => {
    const offers = item.subscriptionOfferDetails || [];
    const offer = offers[0];
    const pricingList = offer?.pricingPhases?.pricingPhaseList || [];
    const lastPrice = pricingList[pricingList.length - 1]?.formattedPrice;
    const price = extractPrice(lastPrice);
    if (Platform.OS == 'android') {
      if (item.name?.toLowerCase() === 'monthly') {
        monthlyPrice = price;
      } else if (item.name?.toLowerCase() === 'yearly') {
        yearlyPrice = price;
      }
    } else {
      if (item.title === 'Monthly') {
        monthlyPrice = item?.price;
      } else if (item.title === 'Yearly') {
        yearlyPrice = item?.price;
      }
    }
  });
  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        try {
          const receipt = purchase.transactionReceipt;
          const isAndroid = Platform.OS === 'android';
          const isIos = Platform.OS === 'ios';

          const isAndroidPurchased =
            isAndroid && purchase?.purchaseStateAndroid === 1;
          const isAndroidPending =
            isAndroid && purchase?.purchaseStateAndroid === 2;
          const isIosValid = isIos && receipt;
          if (isAndroidPending) {
            console.log(
              'ℹ️ Purchase pending, waiting for completion:',
              purchase.productId,
            );

            Toast.show({
              type: 'error',
              text1: 'Subscription Purchase',
              text2: 'Your purchase is pending completion',
              visibilityTime: 1500,
              position: 'top',
            });
            return;
          }
          if ((isAndroidPurchased || isIosValid) && receipt) {
            // First finish the transaction to prevent duplicate processing
            await RNIap.finishTransaction({purchase, isConsumable: false});

            // Prepare subscription data
            const subscriptionData = {
              productId: purchase.productId,
              transactionId: purchase.transactionId,
              transactionDate: purchase.transactionDate,
              subscriptionStatus: 'Active',
              receipt: receipt,
              platform: Platform.OS,
              ...(isAndroid && {purchaseToken: purchase.purchaseToken}),
              ...(isIos && {
                originalTransactionId:
                  purchase.originalTransactionIdentifierIOS,
                originalTransactionDate: purchase.originalTransactionDateIOS,
              }),
            };

            Toast.show({
              type: 'success',
              text1: 'Subscription Purchase',
              text2: 'ubscription activated successfully!',
              visibilityTime: 1500,
              position: 'top',
            });
            console.log('✅ Subscription processed:', subscriptionData);
            // dispatch(setSubscriptionDetails(subscriptionData));
          }
        } catch (err) {
          console.warn('⚠️ Error finalizing transaction', err);
        }
      },
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      if (error.code === 'E_USER_CANCELLED' || error.responseCode === '2') {
        console.log('User cancelled the purchase');
        // Don't show error for cancellations
      } else {
        Toast.show({
          type: 'error',
          text1: 'Subscription Purchase',
          text2: getPurchaseErrorMessage(error),
          visibilityTime: 1500,
          position: 'top',
        });
      }
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);
  function getPurchaseErrorMessage(error) {
    if (error.code === 'E_ALREADY_OWNED') {
      return 'You already own this subscription';
    }
    if (error.code === 'E_UNAVAILABLE') {
      return 'This item is currently unavailable';
    }
    return error.message || 'Purchase failed. Please try again.';
  }
  const purchaseItemsAndroid = async (sku, offerToken) => {
    try {
      const purchase = await RNIap.requestSubscription({
        sku,
        ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      });
    } catch (error) {
      console.log('Failed to purchase Android product', error);
    }
  };

  const purchaseItems = async items => {
    console.log('ddddddd', items);
    // setForLoading(true);
    try {
      const purchase = await RNIap.requestSubscription({
        sku: items,
      });

      if (purchase) {
        // validateIOS(purchase.transactionReceipt);
      } else {
        // setForLoading(false);
        // showMessage({
        //   message: 'Subscription purchase failed.',
        //   type: 'danger',
        //   animationDuration: 500,
        //   floating: true,
        // });
      }
    } catch (error) {
      // showMessage({
      //   message: 'An error occurred during the purchase.',
      //   type: 'danger',
      //   animationDuration: 500,

      //   floating: true,
      // });
      console.log('Failed to purchase ios product', error);
    }
  };

  const handlePress1 = useCallback(async () => {
    const supported = await Linking.canOpenURL(url1);

    if (supported) {
      await Linking.openURL(url1);
    } else {
      await Linking.openURL(url1);
    }
  }, [url1]);

  const restorePurchase = async () => {
    setLoader(true);
    const purchases = await RNIap.getAvailablePurchases();

    if (purchases?.length == 0) {
      setLoader(false);

      Toast.show({
        type: 'error',
        text1: 'Subscription',
        text2: 'No Active Subscription Found !',
        visibilityTime: 2000,
        position: 'top',
      });
      dispatch(setSubscriptionDetails([]));
      return;
    } else {
      setLoader(false);
      if (Platform.OS == 'android') {
        const sortedPurchases = purchases.sort(
          (a, b) => b.transactionDate - a.transactionDate,
        );
        const activePurchase = sortedPurchases.find(
          purchase =>
            purchase.purchaseStateAndroid === 1 && // 1 = PURCHASED
            purchase.isAcknowledgedAndroid === true && // Must be acknowledged
            purchase.autoRenewingAndroid === true && // Either auto-renewing OR
            purchase.transactionDate > Date.now() - 30 * 24 * 60 * 60 * 1000, // Or purchased recently
        );

        if (!activePurchase) {
          setLoader(false);
          Toast.show({
            type: 'error',
            text1: 'Subscription',
            text2: 'No Active Subscription Found!',
            visibilityTime: 2000,
            position: 'top',
          });
          return;
        }

        const isAndroid = Platform.OS === 'android';
        const isIos = Platform.OS === 'ios';
        const receipt = activePurchase.transactionReceipt;

        const subscriptionData = {
          productId: activePurchase.productId,
          transactionId: activePurchase.transactionId,
          transactionDate: activePurchase.transactionDate,
          receipt: receipt,
          subscriptionStatus: 'Active',
          platform: Platform.OS,
          ...(isAndroid && {purchaseToken: activePurchase.purchaseToken}),
          ...(isIos && {
            originalTransactionId:
              activePurchase.originalTransactionIdentifierIOS,
            originalTransactionDate: activePurchase.originalTransactionDateIOS,
          }),
        };

        console.log('Active Subscription Data:', sortedPurchases);
        // Determine plan type
        const planType = activePurchase.productId.includes('monthly')
          ? 'Monthly'
          : 'Yearly';

        Toast.show({
          type: 'success',
          text1: 'Subscription Restored',
          text2: `Your ${planType} plan is active! ${
            activePurchase.autoRenewingAndroid
              ? '(Auto-renewing)'
              : '(Not auto-renewing)'
          }`,
          visibilityTime: 2000,
          position: 'top',
        });

        dispatch(setSubscriptionDetails(subscriptionData));
      } else {
        const latestPurchase = purchases[purchases.length - 1];
      
        const apiRequestBody = {
          'receipt-data': latestPurchase.transactionReceipt,
          password: 'f41a27c3319749ccb2e0e4607ecb0664',
        };

        console.log("zdfddddd",apiRequestBody)
        try {
          const result = await axios(
            'https://sandbox.itunes.apple.com/verifyReceipt',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              data: apiRequestBody,
            },
          );

          // let timestamp =
          //   result.data.latest_receipt_info[0].original_purchase_date;

          // const [datePart] = timestamp.split(' ');

          // if (result.data) {
          //   const renewalHistory = result.data.pending_renewal_info;

          //   const activeSubs = renewalHistory.filter(item => {
          //     if (item.auto_renew_status == '1') {
          //       Toast.show({
          //         type: 'success',
          //         text1: 'Subscription Restored',

          //         visibilityTime: 2000,
          //         position: 'top',
          //       });
          //     } else {
          //       Toast.show({
          //         type: 'error',
          //         text1: 'No Active Subscription Found!',
          //         visibilityTime: 2000,
          //         position: 'top',
          //       });
          //     }
          //   });
          // } else {
          //   Toast.show({
          //     type: 'error',
          //     text1: 'No Active Subscription Found!',
          //     visibilityTime: 2000,
          //     position: 'top',
          //   });
          // }
        } catch (error) {
          showMessage({
            message: 'No Active Subscription Found!',
            type: 'danger',
            animationDuration: 500,

            floating: true,
            // // icon: {icon: 'auto', position: 'left'},
          });
          setForLoading(false);
          console.log(error);
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FastImage
        source={ImageData.BACKGROUND}
        style={styles.primaryBackground}
        resizeMode={FastImage.resizeMode.cover}>
        <View
          style={{
            width: '100%',
            height: 70,
            padding: 10,
            position: 'absolute',
            top: height * 0.05,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 1,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: Color?.LIGHTGREEN,
              borderRadius: 25,
              alignSelf: 'center',
              marginVertical: '5%',
              borderWidth: 3,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              borderColor: Color?.BROWN2,
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: Color?.BROWN4,
                borderRadius: 20,
                alignSelf: 'center',
                marginVertical: '5%',
                borderWidth: 3,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Color?.BROWN2,
              }}>
              <Image
                source={IconData.BACK}
                tintColor={Color?.LIGHTGREEN}
                style={{width: 24, height: 24}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.secondaryContainer}>
          <FastImage
            source={ImageData.MAINBACKGROUND}
            style={styles.secondaryBackground}
            resizeMode={FastImage.resizeMode.stretch}>
            <ActivityLoader visible={loader} />
            <View
              style={{
                width: '100%',
                // height: '76%',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: height * 0.2,
              }}>
              <View
                style={{
                  width: '90%',

                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Color.LIGHTGREEN,
                  backgroundColor: Color?.LIGHTBROWN,
                }}>
                <View
                  style={{
                    width: '100%',
                    // height: '10%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}>
                  <FastImage
                    source={ImageData.LEFT}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{width: 31, height: 31}}
                  />
                  <FastImage
                    source={ImageData.RIGHT}
                    resizeMode={FastImage.resizeMode.contain}
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
                    top: -20,

                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.subText}>Manage Subscription</Text>
                </View>
                <View
                  style={{
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: -5,
                    }}>
                    <Image
                      source={IconData.JOURNALA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      250+ Integration Journal Prompts
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: 10,
                    }}>
                    <Image
                      source={IconData.DREAMA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      100+ Dream Journal Prompts
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      top: 20,
                    }}>
                    <Image
                      source={IconData.MEDITATIONA}
                      style={{width: 24, height: 24}}
                      tintColor={Color.LIGHTGREEN}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.LIGHTGREEN,
                        marginLeft: 20,
                        fontFamily: Font.EB_Garamond_Bold,
                      }}>
                      Guided Meditations
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: height * 0.05,
                    gap: 5,
                    marginBottom: height * 0.02,
                  }}>
                  {Platform.OS == 'android'
                    ? subscription_products?.map((item, index) => {
                        const offers = item.subscriptionOfferDetails || [];

                        const trialOffer = offers.find(
                          offer =>
                            offer.offerId &&
                            offer.offerId.toLowerCase().includes('trial'),
                        );

                        const trialPrice = trialOffer
                          ? trialOffer.pricingPhases.pricingPhaseList[0]
                              ?.formattedPrice || 'Free'
                          : null;

                        let regularPrice = null;
                        if (trialOffer) {
                          const pricingList =
                            trialOffer.pricingPhases.pricingPhaseList;
                          regularPrice =
                            pricingList[pricingList.length - 1]
                              ?.formattedPrice || null;
                        } else if (offers.length > 0) {
                          const pricingList =
                            offers[0].pricingPhases.pricingPhaseList;
                          regularPrice =
                            pricingList[pricingList.length - 1]
                              ?.formattedPrice || null;
                        }

                        const trialDuration = trialOffer
                          ? parseBillingPeriod(
                              trialOffer.pricingPhases.pricingPhaseList[0]
                                ?.billingPeriod,
                            )
                          : null;

                        return (
                          <View
                            key={item.productId || index}
                            style={{marginHorizontal: 2}}>
                            {item?.name.toLowerCase() === 'yearly' &&
                            monthlyPrice > 0 &&
                            yearlyPrice > 0 ? (
                              <View
                                style={{
                                  width: 120,
                                  height: 24,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: Color.BROWN,
                                }}>
                                <Text
                                  style={{color: 'white', fontWeight: 'bold'}}>
                                  {(
                                    ((monthlyPrice * 12 - yearlyPrice) /
                                      (monthlyPrice * 12)) *
                                    100
                                  ).toFixed(1)}
                                  % Savings
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={{
                                  width: 120,
                                  height: 24,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'transparent',
                                }}
                              />
                            )}

                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                setSelectedPackage({
                                  item: item.productId,
                                  offerToken:
                                    item.subscriptionOfferDetails[0].offerToken,
                                });
                              }}
                              style={{
                                width: 150,
                                height: 96,
                                borderRadius: 8,
                                borderWidth:
                                  selectedPackege?.item == item?.productId
                                    ? 1
                                    : 0,
                                borderColor:
                                  selectedPackege?.item == item?.productId
                                    ? Color.BROWN
                                    : 'transparent',
                                backgroundColor: Color?.BROWN3,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              {trialPrice && (
                                <Text
                                  style={{
                                    color: Color.LIGHTGREEN,
                                    fontSize: 16,
                                    fontFamily: Font.EBGaramond_Medium,
                                  }}>
                                  Trial: {trialPrice}
                                  {trialDuration ? ` (${trialDuration})` : ''}
                                </Text>
                              )}

                              {regularPrice && (
                                <Text
                                  style={{
                                    color: Color.BROWN,
                                    fontFamily: Font.EBGaramond_SemiBold,
                                    fontSize: 25,
                                  }}>
                                  {regularPrice}
                                </Text>
                              )}

                              <Text
                                style={{
                                  fontFamily: Font.EBGaramond_Medium,
                                  fontSize: 18,
                                  color: Color.LIGHTGREEN,
                                }}>
                                {item?.name}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    : subscription_products.map((item, index) => {
                        return (
                          <View
                            key={item.productId || index}
                            style={{marginHorizontal: 2}}>
                            {item?.title === 'Yearly' &&
                            monthlyPrice > 0 &&
                            yearlyPrice > 0 ? (
                              <View
                                style={{
                                  width: 120,
                                  height: 24,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: Color.BROWN,
                                }}>
                                <Text
                                  style={{color: 'white', fontWeight: 'bold'}}>
                                  {(
                                    ((monthlyPrice * 12 - yearlyPrice) /
                                      (monthlyPrice * 12)) *
                                    100
                                  ).toFixed(1)}
                                  % Savings
                                </Text>
                              </View>
                            ) : (
                              <View
                                style={{
                                  width: 120,
                                  height: 24,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  alignSelf: 'center',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'transparent',
                                }}
                              />
                            )}

                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => {
                                setSelectedPackage({
                                  item: item?.productId,
                                });
                              }}
                              style={{
                                width: width * 0.35,
                                height: 96,

                                borderRadius: 8,
                                borderWidth:
                                  selectedPackege?.item == item?.productId
                                    ? 1
                                    : 0,
                                borderColor:
                                  selectedPackege?.item == item?.productId
                                    ? Color.BROWN
                                    : 'transparent',
                                backgroundColor: Color?.BROWN3,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  color: Color.BROWN,
                                  fontFamily: Font.EBGaramond_SemiBold,
                                  fontSize: 25,
                                }}>
                                {item?.localizedPrice}
                              </Text>

                              <Text
                                style={{
                                  fontFamily: Font.EBGaramond_Medium,
                                  fontSize: 18,
                                  color: Color.LIGHTGREEN,
                                }}>
                                {item?.title}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                </View>

                {(subscription?.length == undefined ||
                  subscription?.length == 0) &&
                  subscription?.subscriptionStatus == 'Active' && (
                    <View
                      style={{
                        width: '100%',

                        justifyContent: 'center',
                        alignItems: 'center',
                        top: -5,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.EB_Garamond_Bold,
                          fontSize: 16,
                          color: Color.LIGHTGREEN,
                        }}>
                        Currently Active Plan :
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.EB_Garamond_Bold,
                          fontSize: 16,
                          color: Color.LIGHTGREEN,
                        }}>
                        {subscription?.productId == 'plan_yearly'
                          ? 'Yearly'
                          : 'Monthly'}
                      </Text>
                    </View>
                  )}
                <View
                  style={{
                    width: '90%',
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',

                    gap: 5,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedPackege != null) {
                        if (Platform.OS == 'android') {
                          purchaseItemsAndroid(
                            selectedPackege?.item,
                            selectedPackege?.offerToken,
                          );
                        } else {
                          purchaseItems(selectedPackege?.item);
                        }
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: 'Subscription Not Selected',
                          text2: 'Please select at least one plan.',
                          visibilityTime: 3000,
                          position: 'top',
                        });
                      }
                    }}
                    style={{
                      width: 150,
                      height: 40,
                      backgroundColor: Color.LIGHTGREEN,
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontFamily: Font.EBGaramond_SemiBold,
                      }}>
                      Purchase Plan
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      restorePurchase();
                    }}
                    style={{
                      width: 150,
                      height: 40,
                      backgroundColor: '#1B2112',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Color.BROWN4,
                        fontSize: 16,
                        fontFamily: Font.EBGaramond_SemiBold,
                      }}>
                      Restore Purchase
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '90%',
                    height: height >= 900 ? height * 0.2 : height * 0.13,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {PLATFORM_IOS ? (
                      <Text
                        style={{
                          fontFamily: Font.EBGaramond_Medium,
                          fontSize: 14,
                          color: Color.LIGHTGREEN,
                        }}>
                        Please NOTE: You will be charged for the selected plan
                        immediately. Your subscription will automatically renew
                        unless auto-renew is turned off 24 hours before the end
                        of the current period. You can manage or cancel your
                        subscription in your iTunes & App Store / Apple ID
                        account settings anytime. If you are unsure how to
                        cancel a subscription, please visit the Apple Support
                        Website. Note that deleting the app does not cancel your
                        subscription.
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: Font.EBGaramond_Medium,
                          fontSize: 15,
                          color: Color.LIGHTGREEN,
                        }}>
                        Please NOTE: Enjoy the 30 days free trial then you will
                        be charged for your selected plan. You can cancel the
                        subscription before your trial period ends if you do not
                        want to convert to a paid subscription. Your
                        subscription will renew automatically until you cancel
                        the subscription, you can manage or cancel your
                        subscription anytime from the Google Play Store. If you
                        are unsure how to cancel a subscription, please visit
                        the Google Support website. Note that deleting the app
                        does not cancel your subscription.
                      </Text>
                    )}
                  </ScrollView>
                </View>
                <View
                  style={{
                    width: '100%',
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
          </FastImage>
        </View>
        <View
          style={{
            width: '95%',
            height: 56,
            position: 'absolute',
            bottom: height * 0.02,
            alignSelf: 'center',

            zIndex: 1,
          }}>
          <ImageBackground
            source={ImageData.TABBACKGROUND}
            style={styles.thirdBackground}
            resizeMode="stretch">
            <View
              style={{
                width: '95%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',

                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '40%',
                  flexDirection: 'row',

                  justifyContent: 'space-between',
                }}>
                <Pressable onPress={handlePress}>
                  <Image
                    source={IconData.INSTA}
                    style={{width: 24, height: 24, left: 15}}
                  />
                </Pressable>
              </View>
              <View style={{left: 10}}>
                <Button
                  img={ImageData.ARROWNEXT}
                  text="Contact Us"
                  left={true}
                  width={140}
                  height={40}
                  size={15}
                  backgroundColor={Color.BROWN4}
                  font={Font.EBGaramond_SemiBold}
                  onPress={() => {
                    handlePress1();
                  }}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      </FastImage>
    </View>
  );
};
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
    marginTop: height * 0.03,
  },
  secondaryBackground: {
    width: '100%', // Fills the parent container
    height: '100%', // Fills the parent container
  },
  subText: {
    fontSize: 24,
    fontWeight: '500',
    color: Color.LIGHTGREEN,
    // textAlign: 'center',
    fontFamily: Font.EBGaramond_SemiBold,
  },
  durationBadge: {
    backgroundColor: Color.LIGHTBROWN2,
    paddingLeft: 6,
    paddingRight: 6,
    gap: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: Color.LIGHTGREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  containerBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGrid: {
    // marginBottom: 20,
    // marginTop: height * 0.06,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    backfaceVisibility: 'red',
  },
  timeButton: {
    backgroundColor: '#CBBB92',
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 10,
    width: width * 0.2,
    alignItems: 'center',
    shadowColor: Color.LIGHTGREEN,
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 4,

    // Android Shadow
    elevation: 8,
  },
  activeTimeButton: {
    backgroundColor: '#B1915E',
  },
  timeButtonText: {
    fontSize: 16,
    color: Color.GREEN,
    fontFamily: Font.EBGaramond_SemiBold,
  },
  activeTimeButtonText: {
    color: '#fff',

    fontFamily: Font.EBGaramond_SemiBold,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  timerText: {
    fontSize: 48,
    fontFamily: Font.EBGaramond_Medium,
    color: Color.LIGHTGREEN,
    marginHorizontal: 8,
  },
  advancedSettings: {
    fontSize: 18,
    fontFamily: Font.EBGaramond_SemiBold,
    color: Color.LIGHTGREEN,
  },
});
export default Subscription;
