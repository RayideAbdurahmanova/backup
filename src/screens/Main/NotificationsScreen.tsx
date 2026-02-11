import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Switch,
    FlatList,
    ListRenderItem,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    check,
    request,
    RESULTS,
    PERMISSIONS,
    openSettings,
} from 'react-native-permissions';

import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';
import { RootStackParamList } from '../../navigation/types';
import { CustomAlert } from '@/components/CustomAlert';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
    id: string;
    title: string;
    subtitle: string;
    icon: any;
    screen: keyof RootStackParamList;
}

const SETTINGS_DATA: SettingItem[] = [
    {
        id: 'reminder',
        title: 'Xatırlatma',
        subtitle: 'İftar və namaz vaxtları',
        icon: require('../../assets/svg/thirdPage/notification.svg'),
        screen: 'ReminderSettings',
    },
    {
        id: 'sound',
        title: 'Səs',
        subtitle: 'Sistem',
        icon: require('../../assets/svg/thirdPage/volume.svg'),
        screen: 'SoundSettings',
    },
    {
        id: 'location',
        title: 'Məkan',
        subtitle: 'Bakı',
        icon: require('../../assets/svg/thirdPage/location.svg'),
        screen: 'LocationSettings',
    },
    {
        id: 'contact',
        title: 'Əlaqə',
        subtitle: 'Bizimlə əlaqə saxlayın',
        icon: require('../../assets/svg/thirdPage/contact.svg'),
        screen: 'ContactScreen',
    },
];

// const checkNotificationPermission = async (): Promise<boolean> => {
//     if (Platform.OS === 'ios') {
//         const result = await check(PERMISSIONS.IOS.NOTIFICATIONS);
//         return result === RESULTS.GRANTED;
//     }

//     const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//     return result === RESULTS.GRANTED;
// };

// const requestNotificationPermission = async (): Promise<boolean> => {
//     let result;

//     if (Platform.OS === 'ios') {
//         result = await request(PERMISSIONS.IOS.NOTIFICATIONS);
//     } else {
//         result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//     }

//     return result === RESULTS.GRANTED;
// };

interface HeaderProps {
    enabled: boolean;
    onToggle: (value: boolean) => void;
}

const HeaderComponent: React.FC<HeaderProps> = React.memo(({ enabled, onToggle }) => (
    <View style={styles.notificationContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Bildirişlər</Text>
            <Text style={styles.description}>
                Yeniliklər və vacib xatırlatmalar haqqında xəbərdar ol
            </Text>
        </View>
        <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ false: '#767577', true: COLORS.primary }}
            thumbColor={enabled ? '#C1D9B0' : '#f4f3f4'}
            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        />
    </View>
));

const SettingItemComponent = React.memo(
    ({ item, onPress }: { item: SettingItem; onPress: (s: keyof RootStackParamList) => void }) => (
        <View>
            <TouchableOpacity
                style={styles.settingItem}
                onPress={() => onPress(item.screen)}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <SvgImage source={item.icon} width={24} height={24} color={COLORS.primary} />
                </View>

                <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.subtitle}</Text>
                </View>

                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
        </View>
    )
);


const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        buttons: Array<{
            text: string;
            onPress?: () => void;
            style?: 'default' | 'cancel' | 'destructive';
        }>;
    }>({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });
        const insets = useSafeAreaInsets();
    

    // useEffect(() => {
    //     const init = async () => {
    //         const hasPermission = await checkNotificationPermission();
    //         setNotificationsEnabled(hasPermission);
    //     };
    //     init();
    // }, []);

    const handleToggleNotifications = async (value: boolean) => {
        // Notification functionality is currently disabled
        // SWITCH OFF
        // if (!value) {
        //     setNotificationsEnabled(false);
        //     setAlertConfig({
        //         visible: true,
        //         title: 'Bildirişlər deaktiv edildi',
        //         message: 'Tam söndürmək üçün telefon ayarlarına keçə bilərsiniz.',
        //         buttons: [
        //             { text: 'Ləğv et', style: 'cancel' },
        //             { text: 'Ayarlar', onPress: () => openSettings(), style: 'default' },
        //         ],
        //     });
        //     return;
        // }

        // // SWITCH ON
        // const hasPermission = await checkNotificationPermission();
        // if (hasPermission) {
        //     setNotificationsEnabled(true);
        //     return;
        // }

        // const granted = await requestNotificationPermission();
        // if (granted) {
        //     setNotificationsEnabled(true);
        // } else {
        //     setAlertConfig({
        //         visible: true,
        //         title: 'İcazə verilmədi',
        //         message: 'Bildiriş icazəsi olmadan xatırlatmalar işləməyəcək.',
        //         buttons: [
        //             { text: 'Ləğv et', style: 'cancel' },
        //             { text: 'Ayarlar', onPress: () => openSettings(), style: 'default' },
        //         ],
        //     });
        //     setNotificationsEnabled(false);
        // }
    };

    const handleLogout = () => {
        setAlertConfig({
            visible: true,
            title: 'Hesabdan çıxış',
            message: 'Hesabdan çıxmaq istədiyinizdən əminsiniz?',
            buttons: [
                { text: 'Ləğv et', style: 'cancel' },
                {
                    text: 'Çıxış et',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('@ramadan_onboarding_completed');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Onboarding' }],
                            });
                        } catch (error) {
                            console.log('Error logging out:', error);
                        }
                    },
                },
            ],
        });
    };

    const handleNavigate = useCallback(
        (screen: keyof RootStackParamList) => {
            navigation.navigate(screen as any);
        },
        [navigation]
    );

    const renderItem: ListRenderItem<SettingItem> = ({ item }) => (
        <SettingItemComponent item={item} onPress={handleNavigate} />
    );

    return (
        <SafeAreaView style={styles.container}
            edges={['left']}
        >
            <FlatList
                data={SETTINGS_DATA}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={
                    <HeaderComponent
                        enabled={notificationsEnabled}
                        onToggle={handleToggleNotifications}
                    />
                }
                contentContainerStyle={{
                    padding: 15, 
                    // paddingBottom: 20,
                    paddingTop: insets.top + 25,
                }}
                showsVerticalScrollIndicator={false}
            />
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onDismiss={() => setAlertConfig({ ...alertConfig, visible: false })}
            />

            {/* log out */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <SvgImage
                        source={require('../../assets/svg/thirdPage/contact.svg')}
                        width={20}
                        height={20}
                        color="#ff4444"
                    />
                    <Text style={styles.logoutText}>Hesabdan çıx</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    notificationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        paddingBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        color: COLORS.text,
        fontFamily: FONTS.PoppinsBold,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
    },
    settingDescription: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.7,
    },
    arrow: {
        fontSize: 24,
        opacity: 0.3,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.cardBackground,
    },
    logoutContainer: {
        padding: 15,
        paddingBottom: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff4444',
        gap: 10,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
        color: '#ff4444',
    },
});

export default NotificationsScreen;
