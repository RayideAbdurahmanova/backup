/**
 * Router Component
 * Handles inline navigation configuration for nested stacks
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

// Screens
import AzanTimesScreen from '../screens/Main/AzanTimesScreen';
import RestaurantsHomeScreen from '../screens/Restaurants/HomeScreen';
import RestaurantDetailScreen from '../screens/Restaurants/RestaurantDetailScreen';

// Type definitions for Azan Stack
export type AzanStackParamList = {
    [ROUTES.AZAN_STACK.MAIN]: undefined;
    [ROUTES.AZAN_STACK.RESTAURANTS_HOME]: undefined;
    [ROUTES.AZAN_STACK.RESTAURANTS_DETAIL]: undefined;
};

const AzanStack = createNativeStackNavigator<AzanStackParamList>();

/**
 * AzanStackNavigator
 * Wraps AzanTimes screen with a stack navigator to allow inline navigation
 * while keeping the tab bar visible
 */
export const AzanStackNavigator: React.FC = () => {
    return (
        <AzanStack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <AzanStack.Screen
                name={ROUTES.AZAN_STACK.MAIN}
                component={AzanTimesScreen}
            />
            <AzanStack.Screen
                name={ROUTES.AZAN_STACK.RESTAURANTS_HOME}
                component={RestaurantsHomeScreen}
            />
            <AzanStack.Screen
                name={ROUTES.AZAN_STACK.RESTAURANTS_DETAIL}
                component={RestaurantDetailScreen}
            />
        </AzanStack.Navigator>
    );
};
