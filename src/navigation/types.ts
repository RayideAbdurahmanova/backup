import type { NavigatorScreenParams } from '@react-navigation/native';
import { AzanStackParamList } from './Router';

// Root Stack Navigator Types
export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    // Settings Screens
    ReminderSettings: undefined;
    SoundSettings: undefined;
    LocationSettings: undefined;
    ContactScreen: undefined;
    CollaborationScreen: undefined;
};

// Bottom Tab Navigator Types
export type MainTabParamList = {
    IftarTime: undefined;
    AzanTimes: NavigatorScreenParams<AzanStackParamList>;
    Notifications: undefined;
};

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
