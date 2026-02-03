import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator Types
export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    // Settings Screens
    ReminderSettings: undefined;
    SoundSettings: undefined;
    LocationSettings: undefined;
    ContactScreen: undefined;
    // Restaurants
    RestaurantsHome: undefined;
};

// Bottom Tab Navigator Types
export type MainTabParamList = {
    IftarTime: undefined;
    AzanTimes: undefined;
    Notifications: undefined;
};

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
