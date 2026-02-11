/**
 * Ramadan App
 * Prayer times, Iftar tracking, and notifications
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation';
import { LocationProvider } from './src/context/LocationContext';
import './src/i18n'; // Initialize i18n

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
