import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../themes/styles';
import { SettingsHeader } from '../../components/SettingsHeader';
import { SvgImage } from '@/components/svgImages/SvgImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
    TriggerType,
    AndroidImportance
} from '@notifee/react-native';
import { apiService } from '@/api/services/apiService';



interface PrayerTime {
    id: string;
    title: string;
    enabled: boolean;
    beforeEnabled: boolean;
    afterEnabled: boolean;
    reminderBefore: number;
    reminderAfter: number;
}

const ReminderSettingsScreen: React.FC = () => {
    // const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
    const [backendTimes, setBackendTimes] = useState<any>(null);


    const DEFAULT_PRAYERS: PrayerTime[] = [
        { id: 'iftar', title: 'İftar', enabled: true, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'imsak', title: 'İmsak', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'gunes', title: 'Günəş', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'zohr', title: 'Zöhr', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'asr', title: 'Əsr', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'megrib', title: 'Məğrib', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'isa', title: 'İşa', enabled: false, beforeEnabled: true, afterEnabled: false, reminderBefore: 45, reminderAfter: 45 },
    ];

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'before' | 'after'>('before');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        notifee.requestPermission();
    }, []);

    useEffect(() => {
        fetchPrayerTimes();
    }, []);


    const fetchPrayerTimes = async () => {
        try {
            const response = await apiService.getPrayerTimes({
                lat: 40.4093,
                lng: 49.8671,
                city: 'Baku',
                date: new Date().toISOString().split('T')[0],
                tz: 4,
                method: '2',
            });

            setBackendTimes(response);
        } catch (error) {
            console.log('Prayer time error', error);
        }
    };

    const updateTime = (value: number) => {
        if (!selectedId) return;

        setPrayerTimes(prev =>
            prev.map(item => {
                if (item.id !== selectedId) return item;

                return modalType === 'before'
                    ? { ...item, reminderBefore: value }
                    : { ...item, reminderAfter: value };
            })
        );
    };


    const loadSettings = async () => {
        const saved = await AsyncStorage.getItem('REMINDER_SETTINGS');

        if (saved) {
            setPrayerTimes(JSON.parse(saved));
        } else {
            setPrayerTimes(DEFAULT_PRAYERS);
        }
    };


    useEffect(() => {
        if (prayerTimes.length > 0 && backendTimes) {
            scheduleNotifications();
        }
    }, [prayerTimes, backendTimes]);



    const scheduleNotifications = async () => {
        await notifee.cancelAllNotifications();

        await notifee.createChannel({
            id: 'normal-reminder',
            name: 'Prayer Reminder',
            importance: AndroidImportance.HIGH,
        });

        if (!backendTimes) return;

        const timeMap: any = {
            imsak: backendTimes.imsak,
            gunes: backendTimes.sunrise,
            zohr: backendTimes.dhuhr,
            asr: backendTimes.asr,
            megrib: backendTimes.maghrib,
            isa: backendTimes.isha,
            iftar: backendTimes.maghrib,
        };

        for (const prayer of prayerTimes) {
            if (!prayer.enabled) continue;

            const timeString = timeMap[prayer.id];
            if (!timeString) continue;

            const [hour, minute] = timeString.split(':').map(Number);

            const date = new Date();
            date.setHours(hour);
            date.setMinutes(minute);
            date.setSeconds(0);

            if (date.getTime() < Date.now()) {
                date.setDate(date.getDate() + 1);
            }

            await notifee.createTriggerNotification(
                {
                    id: `${prayer.id}`,
                    title: prayer.title,
                    body: 'Namaz vaxtıdır',
                    android: {
                        channelId: 'normal-reminder',
                    },
                },
                {
                    type: TriggerType.TIMESTAMP,
                    timestamp: date.getTime(),
                }
            );
        }
    };

    const selectedPrayer = prayerTimes.find(p => p.id === selectedId);

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="Xatırlatmalar" />

            <ScrollView contentContainerStyle={styles.content}>
                {prayerTimes.map(item => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                {item.enabled && (
                                    <Text style={styles.sub}>
                                        {item.beforeEnabled && `${item.reminderBefore} dəq əvvəl`}
                                        {item.beforeEnabled && item.afterEnabled && ' · '}
                                        {item.afterEnabled && `${item.reminderAfter} dəq sonra`}
                                    </Text>
                                )}
                            </View>

                            <Switch
                                value={item.enabled}
                                onValueChange={(value) => {
                                    // əvvəl state-i yenilə
                                    setPrayerTimes(prev =>
                                        prev.map(p =>
                                            p.id === item.id ? { ...p, enabled: value } : p
                                        )
                                    );

                                    // yalnız ON edəndə modal açılsın
                                    if (value) {
                                        setSelectedId(item.id);
                                        setModalType('before');
                                        setModalVisible(true);
                                    }
                                }}
                                trackColor={{ false: '#777', true: COLORS.primary }}
                                thumbColor="#fff"
                            />
                        </View>

                        {item.enabled && (
                            <View style={styles.configSection}>
                                {/* Before Settings */}
                                <View style={styles.configRow}>
                                    <View style={styles.configLeft}>
                                        <Switch
                                            value={item.beforeEnabled}
                                            onValueChange={(value) => {
                                                setPrayerTimes(prev =>
                                                    prev.map(p =>
                                                        p.id === item.id ? { ...p, beforeEnabled: value } : p
                                                    )
                                                );
                                            }}
                                            trackColor={{ false: '#777', true: COLORS.primary }}
                                            thumbColor="#fff"
                                            style={styles.smallSwitch}
                                        />
                                        <Text style={[styles.configLabel, !item.beforeEnabled && styles.disabledLabel]}>
                                            Vaxtından əvvəl
                                        </Text>
                                    </View>
                                    {item.beforeEnabled && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedId(item.id);
                                                setModalType('before');
                                                setModalVisible(true);
                                            }}
                                            style={styles.timeButton}
                                        >
                                            <Text style={styles.timeButtonText}>{item.reminderBefore} dəq</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* After Settings */}
                                <View style={styles.configRow}>
                                    <View style={styles.configLeft}>
                                        <Switch
                                            value={item.afterEnabled}
                                            onValueChange={(value) => {
                                                setPrayerTimes(prev =>
                                                    prev.map(p =>
                                                        p.id === item.id ? { ...p, afterEnabled: value } : p
                                                    )
                                                );
                                            }}
                                            trackColor={{ false: '#777', true: COLORS.primary }}
                                            thumbColor="#fff"
                                            style={styles.smallSwitch}
                                        />
                                        <Text style={[styles.configLabel, !item.afterEnabled && styles.disabledLabel]}>
                                            Vaxtından sonra
                                        </Text>
                                    </View>
                                    {item.afterEnabled && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedId(item.id);
                                                setModalType('after');
                                                setModalVisible(true);
                                            }}
                                            style={styles.timeButton}
                                        >
                                            <Text style={styles.timeButtonText}>{item.reminderAfter} dəq</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* MODAL */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'before'
                                ? 'Vaxtından əvvəl xatırlatma'
                                : 'Vaxtından sonra xatırlatma'}
                        </Text>

                        <View style={styles.counterRow}>
                            <TouchableOpacity
                                onPress={() =>
                                    updateTime(Math.max(0,
                                        (modalType === 'before'
                                            ? selectedPrayer?.reminderBefore
                                            : selectedPrayer?.reminderAfter)! - 5))
                                }
                            >
                                <SvgImage
                                    source={require('../../assets/svg/thirdPage/minus.svg')}
                                    width={22}
                                    height={22}
                                />
                            </TouchableOpacity>

                            <Text style={styles.counter}>
                                {modalType === 'before'
                                    ? selectedPrayer?.reminderBefore
                                    : selectedPrayer?.reminderAfter}{' '}
                                dəq
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    updateTime(
                                        (modalType === 'before'
                                            ? selectedPrayer?.reminderBefore
                                            : selectedPrayer?.reminderAfter)! + 5
                                    )
                                }
                            >
                                <SvgImage
                                    source={require('../../assets/svg/thirdPage/plus.svg')}
                                    width={22}
                                    height={22}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.close}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeText}>Bağla</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ReminderSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 16,
        marginTop: 15,
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
    },
    sub: {
        marginTop: 4,
        fontSize: 13,
        color: COLORS.text,
        opacity: 0.7,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    actionText: {
        color: COLORS.primary,
        fontSize: 14,
    },
    configSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    configRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    configLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    smallSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        marginRight: 8,
    },
    configLabel: {
        fontSize: 14,
        color: COLORS.text,
        fontFamily: FONTS.PoppinsRegular,
    },
    disabledLabel: {
        opacity: 0.5,
    },
    timeButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeButtonText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: FONTS.PoppinsSemiBold,
    },

    /* MODAL */
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '80%',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
        marginBottom: 10,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 15,
        paddingHorizontal: 30,
    },
    counter: {
        fontSize: 22,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
    },
    close: {
        // marginTop: 4,
        padding: 10,
    },
    closeText: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.PoppinsRegular,
    },
});
