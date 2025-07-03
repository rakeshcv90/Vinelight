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
  TextInput,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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
import {
  setAppliedCoupan,
  setCoupanDetails,
  setSubscriptionDetails,
} from '../redux/actions';
import axios from 'axios';
import {isSubscriptionValid} from './utils';
import {callApi, callApi1, callPostApi} from '../Component/ApiCall';
import {Api} from '../Api';
import moment from 'moment-timezone';
import {SafeAreaView} from 'react-native-safe-area-context';
const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const {width, height} = Dimensions.get('window');

const Subscription = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [coupanModal, setCoupanModal] = useState(false);
  const subscription = useSelector(state => state?.user?.subscription);

  const subscription_products = useSelector(state => state?.user?.getProducts);
  const Plat = 'Ios';
  const dispatch = useDispatch();
  const url = 'https://www.instagram.com/vinelightapp/';
  const url1 = 'https://arkanaapps.com/contact/';
  const url2 = 'https://arkanaapps.com/privacy-policy';
  const [selectedPackege, setSelectedPackage] = useState({
    item: subscription_products[1]?.productId,
    offerToken:
      Platform.OS == 'android'
        ? subscription_products[1]?.subscriptionOfferDetails[0].offerToken
        : null,
  });

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
  // useEffect(() => {
  //   if (Platform.OS !== 'android') return;
  //   let hasHandled = false;

  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     async purchase => {
  //       try {
  //         const receipt = purchase.transactionReceipt;
  //         const isAndroid = Platform.OS === 'android';
  //         const isIos = Platform.OS === 'ios';

  //         const isAndroidPurchased =
  //           isAndroid && purchase?.purchaseStateAndroid === 1;
  //         const isAndroidPending =
  //           isAndroid && purchase?.purchaseStateAndroid === 2;
  //         const isIosValid = isIos && receipt;
  //         if (isAndroidPending) {
  //           console.log(
  //             'ℹ️ Purchase pending, waiting for completion:',
  //             purchase.productId,
  //           );

  //           Toast.show({
  //             type: 'error',
  //             text1: 'Subscription Purchase',
  //             text2: 'Your purchase is pending completion',
  //             visibilityTime: 1500,
  //             position: 'top',
  //           });
  //           return;
  //         }
  //         if ((isAndroidPurchased || isIosValid) && receipt) {
  //           // First finish the transaction to prevent duplicate processing
  //           await RNIap.finishTransaction({purchase, isConsumable: false});

  //           // Prepare subscription data
  //           const subscriptionData = {
  //             productId: purchase.productId,
  //             transactionId: purchase.transactionId,
  //             transactionDate: purchase.transactionDate,
  //             subscriptionStatus: 'Active',
  //             receipt: receipt,
  //             platform: Platform.OS,
  //             ...(isAndroid && {purchaseToken: purchase.purchaseToken}),
  //             ...(isIos && {
  //               originalTransactionId:
  //                 purchase.originalTransactionIdentifierIOS,
  //               originalTransactionDate: purchase.originalTransactionDateIOS,
  //             }),
  //           };

  //           Toast.show({
  //             type: 'success',
  //             text1: 'Subscription Purchase',
  //             text2: 'Subscription activated successfully!',
  //             visibilityTime: 1500,
  //             position: 'top',
  //           });
  //           console.log('✅ Subscription processed:', subscriptionData);
  //           dispatch(setSubscriptionDetails(subscriptionData));
  //         }
  //       } catch (err) {
  //         console.warn('⚠️ Error finalizing transaction', err);
  //       }
  //     },
  //   );

  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
  //     if (error.code === 'E_USER_CANCELLED' || error.responseCode === '2') {
  //       console.log('User cancelled the purchase');
  //       // Don't show error for cancellations
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Subscription Purchase',
  //         text2: getPurchaseErrorMessage(error),
  //         visibilityTime: 1500,
  //         position: 'top',
  //       });
  //     }
  //   });

  //   return () => {
  //     if (purchaseUpdateSubscription) {
  //       purchaseUpdateSubscription.remove();
  //     }
  //     if (purchaseErrorSubscription) {
  //       purchaseErrorSubscription.remove();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let hasHandled = false;

    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        if (hasHandled) return;
        hasHandled = true;

        try {
          const receipt = purchase.transactionReceipt;
          const isAndroidPurchased = purchase?.purchaseStateAndroid === 1;
          const isAndroidPending = purchase?.purchaseStateAndroid === 2;

          if (isAndroidPending) {
            Toast.show({
              type: 'custom',
              position: 'top',
              props: {
                icon: IconData.ERR, // your custom image
                text: 'Your purchase is pending completion',
              },
            });
            return;
          }

          if (isAndroidPurchased && receipt) {
            await RNIap.finishTransaction({purchase, isConsumable: false});

            const subscriptionData = {
              productId: purchase.productId,
              transactionId: purchase.transactionId,
              transactionDate: purchase.transactionDate,
              subscriptionStatus: 'Active',
              receipt,
              platform: 'android',
              purchaseToken: purchase.purchaseToken,
            };

            Toast.show({
              type: 'custom',
              position: 'top',
              props: {
                icon: IconData.SUCC, // your custom image
                text: 'Subscription activated successfully!',
              },
            });
            dispatch(setSubscriptionDetails(subscriptionData));
          }
        } catch (err) {
          console.warn('⚠️ Error finalizing transaction', err);
        }
      },
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      if (error.code === 'E_USER_CANCELLED' || error.responseCode === '2') {
        console.log('User cancelled the purchase');
      } else {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: getPurchaseErrorMessage(error),
          },
        });
      }
    });

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
      hasHandled = false;
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
    // setForLoading(true);
    try {
      const purchase = await RNIap.requestSubscription({
        sku: items,
      });

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
            type: 'custom',
            position: 'top',
            props: {
              icon: IconData.ERR, // your custom image
              text: 'Your purchase is pending completion',
            },
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
              originalTransactionId: purchase.originalTransactionIdentifierIOS,
              originalTransactionDate: purchase.originalTransactionDateIOS,
            }),
          };

          Toast.show({
            type: 'custom',
            position: 'top',
            props: {
              icon: IconData.SUCC, // your custom image
              text: 'Subscription activated successfully!',
            },
          });

          console.log('✅ Subscription processed:', subscriptionData);
          dispatch(setSubscriptionDetails(subscriptionData));
        }
      } catch (err) {
        console.warn('⚠️ Error finalizing transaction', err);
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
    const purchases = await RNIap.getAvailablePurchases();

    if (purchases?.length == 0) {
      Toast.show({
        type: 'custom',
        position: 'top',
        props: {
          icon: IconData.ERR, // your custom image
          text: 'No active subscription found!',
        },
      });

      dispatch(setSubscriptionDetails([]));
      return;
    } else {
      if (Platform.OS == 'android') {
        setLoader(true);
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

          // Toast.show({
          //   type: 'custom',
          //   position: 'top',
          //   props: {
          //     icon: IconData.ERR, // your custom image
          //     text: 'No Active Subscription Found!',
          //   },
          // });
          dispatch(setSubscriptionDetails([]));
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
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.SUCC, // your custom image
            text: `Your ${planType} plan is active! ${
              activePurchase.autoRenewingAndroid
                ? '(Auto-renewing)'
                : '(Not auto-renewing)'
            }`,
          },
        });
        setLoader(false);
        dispatch(setSubscriptionDetails(subscriptionData));
      } else {
        const latestPurchase = purchases[purchases.length - 1];

        const apiRequestBody = {
          'receipt-data': latestPurchase.transactionReceipt,
          password: 'f41a27c3319749ccb2e0e4607ecb0664',
          'exclude-old-transactions': true, // optional
        };

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
          setLoader(false);
          const receipt = purchases.transactionReceipt;
          const isAndroid = Platform.OS === 'android';
          const isIos = Platform.OS === 'ios';

          const isAndroidPurchased =
            isAndroid && purchases?.purchaseStateAndroid === 1;
          const isAndroidPending =
            isAndroid && purchases?.purchaseStateAndroid === 2;
          const isIosValid = isIos && receipt;

          let timestamp =
            result.data.latest_receipt_info[0].original_purchase_date;

          const [datePart] = timestamp.split(' ');

          if (result.data) {
            const renewalHistory = result.data.pending_renewal_info;
            console.log('renewalHistory', renewalHistory);

            const activeSubs = renewalHistory.filter(item => {
              if (item.auto_renew_status == '1') {
                // Prepare subscription data
                const subscriptionData = {
                  productId: item?.product_id,
                  transactionId: item?.transaction_id,
                  transactionDate: item?.purchase_date_ms,
                  subscriptionStatus: 'Active',
                  receipt: receipt,
                  platform: Platform.OS,
                  ...(isAndroid && {purchaseToken: purchases.purchaseToken}),
                  ...(isIos && {
                    originalTransactionId:
                      purchases.originalTransactionIdentifierIOS,
                    originalTransactionDate:
                      purchases.originalTransactionDateIOS,
                  }),
                };

                Toast.show({
                  type: 'custom',
                  position: 'top',
                  props: {
                    icon: IconData.SUCCx, // your custom image
                    text: 'Subscription activated successfully!',
                  },
                });

                dispatch(setSubscriptionDetails(subscriptionData));
              } else {
                // Toast.show({
                //   type: 'custom',
                //   position: 'top',
                //   props: {
                //     icon: IconData.ERR, // your custom image
                //     text: 'No Active Subscription Found!',
                //   },
                // });

                dispatch(setSubscriptionDetails([]));
              }
            });
          } else {
            // Toast.show({
            //   type: 'custom',
            //   position: 'top',
            //   props: {
            //     icon: IconData.ERR, // your custom image
            //     text: 'No Active Subscription Found!',
            //   },
            // });
          }
        } catch (error) {
          setLoader(false);
          console.log('Reeeeeeeee', error);
        }
      }
    }
  };

  const CoupamModal = ({visible, onClose}) => {
    const appliedCoupanDetails = useSelector(
      state => state?.user?.appliedCoupanDetails,
    );
    const today = moment().tz(deviceTimeZone).format('YYYY-MM-DD');
    const [coupan, setCoupan] = useState(null);
    const [errorText, setErrorText] = useState(null);

    const [showMessage, setShowMessage] = useState(false);

    const applyCoupanCode = async () => {
      if (!coupan) {
        Toast.show({
          type: 'custom',
          position: 'top',
          props: {
            icon: IconData.ERR, // your custom image
            text: 'Coupon field cannot be empty',
          },
        });
      } else if (isSubscriptionValid(subscription)) {
        setErrorText(
          'You can’t use the coupon code right now because you have an active subscription. Once your current plan ends, you’ll be able to apply the coupon for lifetime free access.',
        );
      } else {
        // setLoader(true);
        const coupanData = {
          coupon_code: coupan,
          request_date: today,
          user_identifier:
            appliedCoupanDetails?.length > 0
              ? appliedCoupanDetails[0]?.user_code
              : '',
        };
        try {
          const details = await callPostApi(Api.APPLY_COUPAN, coupanData);
          setLoader(false);

          if (details?.status == true) {
            fetchData2(details?.data?.user_code);
            dispatch(setAppliedCoupan(details?.data));

            setCoupan('');
            setErrorText(details?.message);

            setShowMessage(true);
          } else {
            setErrorText(details?.message);
          }
        } catch (error) {
          setLoader(false);
          console.error('Error:', error.message);
        }
      }
    };

    const fetchData2 = async data => {
      try {
        const data3 = await callApi1(`${Api.COUPAN_STATUS}/${data}`);
        console.log('Test Data', data3);
        if (data3?.status === true) {
          dispatch(setCoupanDetails(data3?.data));
        } else {
          dispatch(setCoupanDetails([]));
        }
      } catch (error) {
        console.error('Coupan Details Erray', error);
      }
    };
    return (
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* <ActivityLoader visible={loader} /> */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
              keyboardShouldPersistTaps="handled">
              <View
                style={{
                  width: '95%',
                  // height: 320,
                  alignItems: 'center',
                  marginLeft: width * 0.025,
                }}>
                <ImageBackground
                  source={ImageData.MODAL}
                  style={{width: '100%', paddingBottom: 20}}
                  imageStyle={{
                    resizeMode: 'cover',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}>
                  {!showMessage ? (
                    <View>
                      <View
                        style={{
                          width: '95%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          paddingVertical: 10,
                          position: 'relative',
                        }}>
                        <Text
                          style={{
                            fontSize: 24,
                            fontFamily: Font.EBGaramond_SemiBold,
                            textAlign: 'center',
                          }}>
                          Apply Coupon Code
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss();
                            onClose();
                          }}
                          style={{position: 'absolute', right: 5}}>
                          <Image
                            source={IconData.CANCEL}
                            style={{width: 35, height: 35}}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          width: '90%',
                          height: 52,
                          borderRadius: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: height * 0.03,
                          backgroundColor: Color.BROWN3,
                          alignSelf: 'center',
                        }}>
                        <TextInput
                          value={coupan}
                          onChangeText={text => {
                            setCoupan(text);
                            setErrorText(null);
                          }}
                          placeholder="Enter Coupon code"
                          placeholderTextColor={Color.GREEN}
                          style={{
                            width: '90%',
                            height: '100%',
                            color: Color.LIGHTGREEN,
                            fontSize: 16,
                            fontFamily: Font.EBGaramond_Regular,
                          }}
                          selectionColor={Color.LIGHTGREEN}
                        />
                      </View>
                      <View
                        style={{
                          width: '95%',
                          alignItems: 'flex-start',
                          paddingLeft: 10,
                          marginTop: height * 0.01,
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Color.LIGHTGREEN,
                            fontFamily: Font.EBGaramond_Medium,
                            fontSize: 14,
                          }}>
                          {errorText ? errorText : ' '}
                        </Text>
                      </View>
                      <ImageBackground
                        source={ImageData.TABBACKGROUND}
                        style={{
                          width: '95%',
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          alignSelf: 'center',
                          top: 10,
                          marginBottom: 20,

                          marginLeft: width * 0.05,
                        }}
                        resizeMode="stretch">
                        <View
                          style={{
                            width: '93%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            overflow: 'hidden',
                          }}>
                          <Button
                            img={IconData.CHECK}
                            text="Apply"
                            left={true}
                            width={91}
                            size={16}
                            backgroundColor={Color.BROWN4}
                            height={40}
                            font={Font.EBGaramond_SemiBold}
                            onPress={() => {
                              // Keyboard.dismiss();
                              applyCoupanCode();
                            }}
                            style={{width: '40%', zIndex: -1}}
                          />
                        </View>
                      </ImageBackground>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          width: '95%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          paddingVertical: 10,
                          position: 'relative',
                        }}>
                        <Text
                          style={{
                            fontSize: 24,
                            fontFamily: Font.EBGaramond_SemiBold,
                            textAlign: 'center',
                          }}>
                          Coupon Applied!
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss();
                            onClose();
                          }}
                          style={{position: 'absolute', right: 5}}>
                          <Image
                            source={IconData.CANCEL}
                            style={{width: 35, height: 35}}
                          />
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          width: '90%',

                          justifyContent: 'center',
                          alignItems: 'center',

                          marginTop: height * 0.02,
                          alignSelf: 'center',
                        }}>
                        <Image
                          source={IconData.OFFER}
                          resizeMode="contain"
                          style={{width: 150, height: 150}}
                        />
                      </View>
                      <View
                        style={{
                          width: '90%',
                          alignItems: 'center',
                          // paddingLeft: 5,
                          marginTop: height * 0.01,
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Color.LIGHTGREEN,
                            fontFamily: Font.EBGaramond_SemiBold,
                            fontSize: 16,
                          }}>
                          You've unlocked lifetime access using your coupon
                          code.
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '90%',
                          alignItems: 'flex-start',
                          // paddingLeft: 5,
                          marginTop: height * 0.01,
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: Color.LIGHTGREEN,
                            fontFamily: Font.EBGaramond_SemiBold,
                            fontSize: 16,
                          }}>
                          ⚠️ Important Note:
                        </Text>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: Color.LIGHTGREEN,
                            fontFamily: Font.EB_Garamond,
                            fontSize: 14,
                            marginTop: 5,
                          }}>
                          Access is tied to this device and app installation. If
                          you switch devices, delete the app, or clear app data,
                          you might lose access. Some coupons are single-use or
                          time-limited, and may not work again if reapplied.
                        </Text>
                      </View>

                      <ImageBackground
                        source={ImageData.TABBACKGROUND}
                        style={{
                          width: '95%',
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          alignSelf: 'center',
                          top: 10,
                          marginBottom: 20,

                          marginLeft: width * 0.05,
                        }}
                        resizeMode="stretch">
                        <View
                          style={{
                            width: '93%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            overflow: 'hidden',
                          }}>
                          <Button
                            img={IconData.CHECK}
                            text="OK"
                            left={true}
                            width={91}
                            size={16}
                            backgroundColor={Color.BROWN4}
                            height={40}
                            font={Font.EBGaramond_SemiBold}
                            onPress={() => {
                              navigation.goBack();
                            }}
                            style={{width: '40%', zIndex: -1}}
                          />
                        </View>
                      </ImageBackground>
                    </View>
                  )}
                </ImageBackground>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  return (
    <>
      <ImageBackground
        source={ImageData.BACKGROUND}
        style={{flex: 1}}
        resizeMode="cover">
        <SafeAreaView style={styles.container}>
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
                top: height * 0.0,
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
                    paddingBottom: 15,
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
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      style={{width: '100%'}}
                      contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: 20,
                        paddingTop: 20,
                      }}>
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
                          width: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',

                          gap: 5,
                        }}>
                        {Platform.OS == 'android'
                          ? subscription_products?.map((item, index) => {
                              const offers =
                                item.subscriptionOfferDetails || [];

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
                                        style={{
                                          color: 'white',
                                          fontWeight: 'bold',
                                        }}>
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
                                          item.subscriptionOfferDetails[0]
                                            .offerToken,
                                      });
                                    }}
                                    style={{
                                      width: width * 0.37,
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
                                          fontSize: 14,
                                          fontFamily: Font.EBGaramond_Medium,
                                        }}>
                                        Trial: {trialPrice}
                                        {trialDuration
                                          ? ` (${trialDuration})`
                                          : ''}
                                      </Text>
                                    )}

                                    {regularPrice && (
                                      <Text
                                        style={{
                                          color: Color.BROWN,
                                          fontFamily: Font.EBGaramond_SemiBold,
                                          fontSize: 20,
                                        }}>
                                        {regularPrice}
                                      </Text>
                                    )}

                                    <Text
                                      style={{
                                        fontFamily: Font.EBGaramond_Medium,
                                        fontSize: 16,
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
                                        style={{
                                          color: 'white',
                                          fontWeight: 'bold',
                                        }}>
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

                      <TouchableOpacity
                        onPress={() => {
                          setCoupanModal(true);
                        }}
                        style={{
                          width: '90%',
                          alignItems: 'center',
                          paddingLeft: 5,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: Color.LIGHTGREEN,
                            fontFamily: Font.EB_Garamond_Bold,
                            fontSize: 16,
                            marginTop: 10,
                            textDecorationLine: 'underline',
                            // marginBottom: 10,
                          }}>
                          Have Coupon Code?
                        </Text>
                      </TouchableOpacity>

                      <View
                        style={{
                          width: '90%',
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent:
                            Platform.OS == 'android'
                              ? 'space-between'
                              : 'center',
                        }}>
                        {isSubscriptionValid(subscription) ? (
                          <View
                            style={{
                              width: '65%',

                              justifyContent:
                                Platform.OS == 'android'
                                  ? 'flex-start'
                                  : 'center',
                              alignItems: 'center',

                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontFamily: Font.EB_Garamond_Bold,
                                fontSize: 16,
                                color: Color.LIGHTGREEN,
                              }}>
                              Active Plan :
                            </Text>
                            <Text
                              style={{
                                fontFamily: Font.EB_Garamond_Bold,
                                fontSize: 16,
                                color: Color.LIGHTGREEN,
                                textAlign: 'center',
                              }}>
                              {subscription[0].productId == 'plan_yearly'
                                ? 'Yearly'
                                : 'Monthly'}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              width: '65%',
                              justifyContent: 'flex-start',
                              alignItems: 'center',

                              flexDirection: 'row',
                            }}
                          />
                        )}

                        {Platform.OS == 'android' &&
                          isSubscriptionValid(subscription) && (
                            <TouchableOpacity
                              onPress={() => {
                                Linking.openURL(
                                  'https://play.google.com/store/account/subscriptions',
                                );
                              }}
                              style={{
                                width: '35%',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  fontFamily: Font.EBGaramond_Medium,
                                  fontSize: 18,
                                  color: Color.LIGHTGREEN,
                                  textDecorationLine: 'underline',
                                }}>
                                Manage Plan
                              </Text>
                            </TouchableOpacity>
                          )}
                      </View>

                      <View
                        style={{
                          width: '85%',
                          height: 40,
                          marginTop: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',

                          gap: 20,
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
                                type: 'custom',
                                position: 'top',
                                props: {
                                  icon: IconData.ERR, // your custom image
                                  text: 'Please select at least one plan.',
                                },
                              });
                            }
                          }}
                          style={{
                            width: '49%',
                            height: '100%',
                            backgroundColor: Color.LIGHTGREEN,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 16,
                              textAlign: 'center',
                              fontFamily: Font.EBGaramond_SemiBold,
                            }}>
                            Purchase Plan
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            restorePurchase();
                          }}
                          style={{
                            width: '49%',
                            height: '100%',
                            backgroundColor: '#1B2112',
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              color: Color.BROWN4,
                              fontSize: 16,
                              textAlign: 'center',
                              fontFamily: Font.EBGaramond_SemiBold,
                            }}>
                            Restore Purchase
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: '90%',
                          // height: height >= 900 ? height * 0.2 : height * 0.1,
                          // marginTop: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            marginTop: 5,
                            fontFamily: Font.EBGaramond_Medium,
                            fontSize: 16,
                            color: Color.LIGHTGREEN,
                          }}>
                          By continuing you accept our{' '}
                          <Text
                            onPress={async () => {
                              await Linking.openURL(url2);
                            }}
                            style={{
                              textAlign: 'center',
                              textDecorationLine: 'underline',
                              fontFamily: Font.EB_Garamond_Bold,
                              fontSize: 16,
                              color: Color.LIGHTGREEN,
                            }}>
                            Privacy Policy{' '}
                          </Text>
                        </Text>
                      </View>

                      <View
                        style={{
                          width: '90%',

                          marginTop: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}>
                        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                        {PLATFORM_IOS ? (
                          <Text
                            style={{
                              fontFamily: Font.EBGaramond_Medium,
                              fontSize: 14,
                              color: Color.LIGHTGREEN,
                            }}>
                            Please NOTE: You will be charged for the selected
                            plan immediately. Your subscription will
                            automatically renew unless auto-renew is turned off
                            24 hours before the end of the current period. You
                            can manage or cancel your subscription in your
                            iTunes & App Store / Apple ID account settings
                            anytime. If you are unsure how to cancel a
                            subscription, please visit the Apple Support
                            Website. Note that deleting the app does not cancel
                            your subscription.
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: Font.EBGaramond_Medium,
                              fontSize: 15,
                              color: Color.LIGHTGREEN,
                            }}>
                            Please NOTE: Enjoy the 30 days free trial then you
                            will be charged for your selected plan. You can
                            cancel the subscription before your trial period
                            ends if you do not want to convert to a paid
                            subscription. Your subscription will renew
                            automatically until you cancel the subscription, you
                            can manage or cancel your subscription anytime from
                            the Google Play Store. If you are unsure how to
                            cancel a subscription, please visit the Google
                            Support website. Note that deleting the app does not
                            cancel your subscription.
                          </Text>
                        )}
                        {/* </ScrollView> */}
                      </View>
                    </ScrollView>
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
          <CoupamModal
            visible={coupanModal}
            onClose={() => setCoupanModal(false)}
          />
        </SafeAreaView>
      </ImageBackground>
    </>
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
    // marginTop: height * 0.00,
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
