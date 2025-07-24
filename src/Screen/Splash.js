import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Platform,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ImageData} from '../../assets/Image';
import {storage} from '../Component/Storage';
import {useDispatch, useSelector} from 'react-redux';
import {Api} from '../Api';
import {callApi, callApi1} from '../Component/ApiCall';
import * as RNIap from 'react-native-iap';
import {
  setAdvanceMedatationData,
  setCoupanDetails,
  setDailyPrompt,
  setMeditationData,
  setSubscriptionDetails,
} from '../redux/actions';

import axios from 'axios';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const scaleAnim = useRef(new Animated.Value(0.72)).current; // Start invisible (scale 0)
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start transparent
  const subscription = useSelector(state => state?.user?.subscription);
  const storedUserString = useSelector(state => state?.user?.userInfo);
  const appliedCoupanDetails = useSelector(
    state => state?.user?.appliedCoupanDetails,
  );
  useEffect(() => {
    const initIAP = async () => {
      try {
        // Initialize IAP module
        await RNIap.initConnection();

        // Get available purchases
        const purchases = await RNIap.getAvailablePurchases();

        if (purchases?.length === 0) {
          dispatch(setSubscriptionDetails([]));
          return;
        }

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
            patch(setSubscriptionDetails());
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
              originalTransactionDate:
                activePurchase.originalTransactionDateIOS,
            }),
          };

          // Determine plan type
          const planType = activePurchase.productId.includes('monthly')
            ? 'Monthly'
            : 'Yearly';

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
              'https://buy.itunes.apple.com/verifyReceipt',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: apiRequestBody,
              },
            );

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

              const activeSubs = renewalHistory.filter(item => {
                if (item.auto_renew_status == '1') {
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

                  dispatch(setSubscriptionDetails(subscriptionData));
                } else {
                  dispatch(setSubscriptionDetails([]));
                }
              });
            } else {
            }
          } catch (error) {
            console.log('Subscription Error', error);
          }
        }
      } catch (error) {
        // console.error('Subscription error:', error);
        dispatch(setSubscriptionDetails([]));
      }
    };

    initIAP();
  }, [dispatch]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1, // Full size
          duration: 2000, // Slower zoom (2 sec)
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fully visible
          duration: 2000, // Same as zoom duration
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (storedUserString) {
          navigation.replace('MainPage');
          fetchData();
          fetchData2();
        } else {
          fetchData();
          fetchData2();
          navigation.replace('Intro');
        }
      });
    }, 3000); // Optional: 0.5s delay before animation starts

    return () => clearTimeout(timeout);
  }, [scaleAnim, opacityAnim]);

  const fetchData = async () => {
    try {
      const data = await callApi(Api.MEDITATIONS);
      const data1 = await callApi(Api.MEDITATION_MUSIC);
      const data2 = await callApi(Api.PROMPT_DAY);

      dispatch(setMeditationData(data));
      dispatch(setAdvanceMedatationData(data1));
      dispatch(setDailyPrompt(data2?.data));
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  const fetchData2 = async () => {

    try {
      if(!appliedCoupanDetails?.length) {
        dispatch(setCoupanDetails([]));
        return;
      }
      const data3 = await callApi1(
        `${Api.COUPAN_STATUS}/${appliedCoupanDetails[0]?.user_code}`,
      );
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
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={ImageData.BACKGROUND}
        style={styles.imageBackground}
        resizeMode="cover">
        <Animated.Image
          source={ImageData.SPLASHLOGO}
          style={[
            styles.image,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}
          resizeMode="contain"
        />
      </ImageBackground>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
});
