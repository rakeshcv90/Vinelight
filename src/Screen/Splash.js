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
import React, {useCallback, useEffect, useRef} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';

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

          if (Platform.OS === 'android') {
            // const sortedPurchases = purchases.sort(
            //   (a, b) => b.transactionDate - a.transactionDate,
            // );
            // const activePurchase = sortedPurchases.find(
            //   purchase =>
            //     purchase.purchaseStateAndroid === 1 && // PURCHASED
            //     purchase.isAcknowledgedAndroid === true && // Acknowledged
            //     purchase.autoRenewingAndroid === true && // Still auto-renewing
            //     purchase.transactionDate >
            //       Date.now() - 30 * 24 * 60 * 60 * 1000, // purchased recently
            // );

            const sortedPurchases = purchases.sort(
              (a, b) => Number(b.transactionDate) - Number(a.transactionDate),
            );

            const isValidSubscription = purchase => {
              let duration = 0;
              const purchaseTime = Number(purchase.transactionDate);

              if (purchase.productId.includes('plan_monthly')) {
                duration = 30 * 24 * 60 * 60 * 1000; // ~30 days
              } else if (purchase.productId.includes('new_year')) {
                duration = 365 * 24 * 60 * 60 * 1000; // ~365 days
              }

              const expiryTime = purchaseTime + duration;

              console.log('Purchase Date:', new Date(purchaseTime));
              console.log('Expiry Date:', new Date(expiryTime));
              console.log('Now:', new Date());

              return (
                purchase.purchaseStateAndroid === 1 && // PURCHASED
                purchase.isAcknowledgedAndroid === true &&
                Date.now() <= expiryTime // Still valid
              );
            };

            const activePurchase = sortedPurchases.find(isValidSubscription);

            if (!activePurchase) {
              dispatch(setSubscriptionDetails([]));
              return;
            }

            const subscriptionData = {
              productId: activePurchase.productId,
              transactionId: activePurchase.transactionId,
              transactionDate: activePurchase.transactionDate,
              receipt: activePurchase.transactionReceipt,
              subscriptionStatus: 'Active',
              platform: Platform.OS,
              purchaseToken: activePurchase.purchaseToken,
            };

            dispatch(setSubscriptionDetails(subscriptionData));
          } else {
            const latestPurchase = purchases[purchases.length - 1];
            console.log('Latest Purchase:', latestPurchase);
            const apiRequestBody = {
              'receipt-data': latestPurchase.transactionReceipt,
              password: 'f41a27c3319749ccb2e0e4607ecb0664', // 🔑 App Store shared secret
              'exclude-old-transactions': true,
            };

            try {
              const result = await axios.post(
                __DEV__
                  ? 'https://sandbox.itunes.apple.com/verifyReceipt'
                  : 'https://buy.itunes.apple.com/verifyReceipt',
                apiRequestBody,
                {headers: {'Content-Type': 'application/json'}},
              );

              if (result.data && result.data.latest_receipt_info) {
                const sortedReceipts = result.data.latest_receipt_info.sort(
                  (a, b) =>
                    Number(b.expires_date_ms) - Number(a.expires_date_ms),
                );
                const latest = sortedReceipts[0];
                const now = Date.now();

                const expiryDate = Number(latest.expires_date_ms);
                const isActive = expiryDate > now;
                console.log('Test SUbScription ', isActive, expiryDate);
                if (isActive) {
                  const subscriptionData = {
                    productId: latest.product_id,
                    transactionId: latest.transaction_id,
                    transactionDate: latest.purchase_date_ms,
                    expiryDate,
                    subscriptionStatus: 'Active',
                    isTrial: latest.is_trial_period === 'true',
                    autoRenewStatus:
                      result.data.pending_renewal_info?.[0]
                        ?.auto_renew_status ?? 'unknown',
                    receipt: result.data.latest_receipt,
                    platform: Platform.OS,
                    originalTransactionId: latest.original_transaction_id,
                  };

                  dispatch(setSubscriptionDetails(subscriptionData));
                } else {
                  dispatch(setSubscriptionDetails([]));
                }
              } else {
                dispatch(setSubscriptionDetails([]));
              }
            } catch (error) {
              console.log('Subscription Error', error);
              dispatch(setSubscriptionDetails([]));
            }
          }
        } catch (error) {
             console.log("DScdsfdsfdsf, Error", error);
          dispatch(setSubscriptionDetails([]));
        }
      };

      initIAP();

     
      return () => {
        RNIap.endConnection();
      };
    } , [dispatch]);


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
    }, 6000); // Optional: 0.5s delay before animation starts

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
      if (!appliedCoupanDetails?.length) {
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
