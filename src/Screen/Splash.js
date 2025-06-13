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
import {callApi} from '../Component/ApiCall';
import * as RNIap from 'react-native-iap';
import {
  setAdvanceMedatationData,
  setDailyPrompt,
  setMeditationData,
  setSubscriptionDetails,
} from '../redux/actions';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const Splash = ({navigation}) => {
  const dispatch = useDispatch();
  const scaleAnim = useRef(new Animated.Value(0.72)).current; // Start invisible (scale 0)
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start transparent
  const subscription = useSelector(state => state?.user?.subscription);
  const storedUserString = useSelector(state => state?.user?.userInfo);

  useEffect(() => {
    const initIAP = async () => {
      try {
        // Initialize IAP module
        await RNIap.initConnection();

        // Get available purchases
        const purchases = await RNIap.getAvailablePurchases();

        if (purchases?.length === 0) {
          console.log('No active subscriptions found');
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

          console.log('Active Subscription Data:', sortedPurchases);
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
              'https://sandbox.itunes.apple.com/verifyReceipt',
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
                  console.log('Active');
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
                  console.log('No Active');
                  dispatch(setSubscriptionDetails([]));
                }
              });
            } else {
            }
          } catch (error) {
            console.log('Reeeeeeeee', error);
          }
        }
      } catch (error) {
        console.error('Subscription error:', error);
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
        } else {
          fetchData();
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
