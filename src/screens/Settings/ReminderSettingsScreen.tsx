import React, { useState } from 'react';
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

interface PrayerTime {
    id: string;
    title: string;
    enabled: boolean;
    reminderBefore: number;
    reminderAfter: number;
}

const ReminderSettingsScreen: React.FC = () => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([
        { id: 'iftar', title: 'İftar', enabled: true, reminderBefore: 45, reminderAfter: 45 },
        { id: 'imsak', title: 'İmsak', enabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'gunes', title: 'Günəş', enabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'zohr', title: 'Zöhr', enabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'asr', title: 'Əsr', enabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'megrib', title: 'Məğrib', enabled: false, reminderBefore: 45, reminderAfter: 45 },
        { id: 'isa', title: 'İşa', enabled: false, reminderBefore: 45, reminderAfter: 45 },
    ]);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'before' | 'after'>('before');
    const [modalVisible, setModalVisible] = useState(false);

    const toggleSwitch = (id: string) => {
        setPrayerTimes(prev =>
            prev.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );

        setSelectedId(id);
        setModalType('before');
        setModalVisible(true);
    };

    const updateTime = (value: number) => {
        setPrayerTimes(prev =>
            prev.map(item => {
                if (item.id !== selectedId) return item;

                return modalType === 'before'
                    ? { ...item, reminderBefore: value }
                    : { ...item, reminderAfter: value };
            })
        );
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
                                        {item.reminderBefore} dəq əvvəl · {item.reminderAfter} dəq sonra
                                    </Text>
                                )}
                            </View>

                            <Switch
                                value={item.enabled}
                                onValueChange={() => toggleSwitch(item.id)}
                                trackColor={{ false: '#777', true: COLORS.primary }}
                                thumbColor="#fff"
                            />
                        </View>

                        {item.enabled && (
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedId(item.id);
                                        setModalType('before');
                                        setModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.actionText}>Vaxtından əvvəl</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedId(item.id);
                                        setModalType('after');
                                        setModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.actionText}>Vaxtından sonra</Text>
                                </TouchableOpacity>
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
                            <Text style={{ color: COLORS.primary }}>Bağla</Text>
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
        fontSize: 13,
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
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 24,
    },
    counter: {
        fontSize: 22,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
    },
    close: {
        marginTop: 8,
    },
});
