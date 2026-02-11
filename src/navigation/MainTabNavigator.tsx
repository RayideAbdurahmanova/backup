import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList } from './types';
import IftarTimeScreen from '../screens/Main/IftarTimeScreen';
import NotificationsScreen from '../screens/Main/NotificationsScreen';
import { AzanStackNavigator } from './Router';
import { SvgImage } from '../components/svgImages/SvgImages';
import { COLORS } from '../themes/styles';

// Import SVG icons
import * as ClockIcon from '../assets/svg/clock.svg';
import * as CrescentIcon from '../assets/svg/crescent.svg';
import * as SettingsIcon from '../assets/svg/settings.svg';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab icon colors
const ACTIVE_COLOR = '#e9e8ec';
const INACTIVE_COLOR = COLORS.background;

// Icon configuration
const ICONS: Record<string, any> = {
    IftarTime: ClockIcon,
    AzanTimes: CrescentIcon,
    Notifications: SettingsIcon,
};

// Custom Tab Bar Component
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();

    const renderIcon = (routeName: string, isFocused: boolean) => {
        const icon = ICONS[routeName];
        if (!icon) return null;

        const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
        const size = 28;

        return <SvgImage source={icon} width={size} height={size} fill={color} />;
    };

    return (
        <View
            style={[
                styles.container,
                Platform.select({
                    ios: { paddingBottom: Math.max(0, (insets?.bottom || 0) - 10) },
                    android: { paddingBottom: insets?.bottom || 0 },
                }),
            ]}
        >
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={styles.tabItem}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.iconContainer,
                                    isFocused && styles.activeIconContainer,
                                ]}
                            >
                                {renderIcon(route.name, isFocused)}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const MainTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="AzanTimes"
        >
            <Tab.Screen name="IftarTime" component={IftarTimeScreen} />
            <Tab.Screen name="AzanTimes" component={AzanStackNavigator} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    tabBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 70,
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    activeIconContainer: {
        backgroundColor: COLORS.background,
        borderRadius: 40,
        borderColor: '#FDFCFA',
        borderWidth: 8,
        width: 80,
        height: 80,
        position: 'absolute',
        top: -15,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.15,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
});

export default MainTabNavigator;
