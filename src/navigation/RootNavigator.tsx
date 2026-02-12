import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { RootStackParamList } from './types';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import {
    ReminderSettingsScreen,
    SoundSettingsScreen,
    LocationSettingsScreen,
    ContactScreen,
    CollaborationScreen,
} from '../screens/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_KEY = '@ramadan_onboarding_completed';

const RootNavigator: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem(ONBOARDING_KEY);
            setHasCompletedOnboarding(value === 'true');
        } catch (error) {
            console.log('Error reading onboarding status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#164A3A" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
            initialRouteName={hasCompletedOnboarding ? 'MainTabs' : 'Onboarding'}
        >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
            <Stack.Screen name="SoundSettings" component={SoundSettingsScreen} />
            <Stack.Screen name="LocationSettings" component={LocationSettingsScreen} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} />
            <Stack.Screen name="CollaborationScreen" component={CollaborationScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});

export default RootNavigator;
