/**
 * Ramadan App
 * Prayer times, Iftar tracking, and notifications
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation';
import { LocationProvider } from './src/context/LocationContext';
import './src/i18n'; // Initialize i18n
import messaging from '@react-native-firebase/messaging';


function App() {

  useEffect(() => {
    requestUserPermission();
    getFcmToken();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permission granted:', authStatus);
    } else {
      console.log('Permission denied');
    }
  }


  async function getFcmToken() {
    const token = await messaging().getToken();

    if (token) {
      console.log('FCM TOKEN:', token);
    } else {
      console.log('No token received');
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('New FCM TOKEN:', token);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);

      Alert.alert(
        remoteMessage.notification?.title || 'Title',
        remoteMessage.notification?.body || 'Body',
      );
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <LocationProvider>
        <NavigationContainer>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          <RootNavigator />
        </NavigationContainer>
      </LocationProvider>
    </SafeAreaProvider>
  );
}

export default App;
