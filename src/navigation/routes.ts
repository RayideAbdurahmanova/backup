/**
 * Navigation Routes Configuration
 * Centralized route names and navigation structure
 */

export const ROUTES = {
    // Root Stack Routes
    ROOT: {
        ONBOARDING: 'Onboarding',
        MAIN_TABS: 'MainTabs',
    },

    // Main Tab Routes
    TABS: {
        IFTAR_TIME: 'IftarTime',
        AZAN_TIMES: 'AzanTimes',
        NOTIFICATIONS: 'Notifications',
    },

    // Nested Stack Routes (Inside Tabs)
    AZAN_STACK: {
        MAIN: 'AzanTimesMain',
        RESTAURANTS_HOME: 'RestaurantsHome',
        RESTAURANTS_DETAIL: 'RestaurantsDetail',
    },

    // Settings Stack Routes (Outside Tabs)
    SETTINGS: {
        REMINDER_SETTINGS: 'ReminderSettings',
        SOUND_SETTINGS: 'SoundSettings',
        LOCATION_SETTINGS: 'LocationSettings',
        CONTACT_SCREEN: 'ContactScreen',
        COLLABORATION_SCREEN: 'CollaborationScreen',
    },
} as const;

// Helper type to extract all route names
export type RouteNames =
    | typeof ROUTES.ROOT[keyof typeof ROUTES.ROOT]
    | typeof ROUTES.TABS[keyof typeof ROUTES.TABS]
    | typeof ROUTES.AZAN_STACK[keyof typeof ROUTES.AZAN_STACK]
    | typeof ROUTES.SETTINGS[keyof typeof ROUTES.SETTINGS];
