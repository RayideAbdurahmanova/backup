import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../themes/styles';
import Slider from '@react-native-community/slider';
import SystemSetting from 'react-native-system-setting';
import { SettingsHeader } from '../../components/SettingsHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SoundSettingsScreen: React.FC = () => {
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        // Mövcud səs səviyyəsini oxu
        SystemSetting.getVolume().then(v => {
            setVolume(v);
        });
    }, []);

    const onValueChange = (value: number) => {
        setVolume(value);
        SystemSetting.setVolume(value);
    };

    const volumePercentage = Math.round(volume * 100);

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="Səs" />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Səs səviyyəsini seç</Text>

                    <View style={styles.volumeDisplay}>
                        <Text style={styles.volumePercentage}>{volumePercentage}%</Text>
                    </View>

                    <View style={styles.sliderContainer}>
                        <View style={styles.trackBackground}>
                            <View
                                style={[
                                    styles.activeTrack,
                                    { width: `${volumePercentage}%` }
                                ]}
                            />
                            <View style={styles.trackMarkers}>
                                <View style={styles.marker} />
                                <View style={styles.marker} />
                                <View style={styles.marker} />
                                <View style={styles.marker} />
                                <View style={styles.marker} />
                            </View>
                        </View>

                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            value={volume}
                            onValueChange={onValueChange}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            thumbTintColor={COLORS.primary}
                            style={styles.slider}
                        />
                    </View>

                    <View style={styles.volumeLabels}>
                        <Text style={styles.volumeLabel}>0%</Text>
                        <Text style={styles.volumeLabel}>50%</Text>
                        <Text style={styles.volumeLabel}>100%</Text>
                    </View>
                </View>

                {/* Optional: Sound options could be added here if needed */}
                {/* <View style={styles.soundOptionsSection}>
                    <Text style={styles.sectionTitle}>Bildiriş səsi</Text>
                    <Text style={styles.sectionDescription}>
                        Bildiriş üçün istifadə ediləcək səsi seçin
                    </Text>
                    
                    {SOUND_OPTIONS.map(option => (
                        <View key={option.id} style={styles.soundOption}>
                            <View>
                                <Text style={styles.soundOptionTitle}>{option.title}</Text>
                                <Text style={styles.soundOptionDescription}>{option.description}</Text>
                            </View>
                        </View>
                    ))}
                </View> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 24,
    },
    section: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: COLORS.text,
        marginBottom: 24,
    },
    volumeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 16,
    },
    volumeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(75, 200, 140, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    volumePercentage: {
        fontSize: 32,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.primary,
        minWidth: 80,
    },
    sliderContainer: {
        height: 60,
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 12,
    },
    trackBackground: {
        position: 'absolute',
        height: 8,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    activeTrack: {
        position: 'absolute',
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    trackMarkers: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    marker: {
        width: 2,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 1,
    },
    slider: {
        width: '100%',
        height: 60,
    },
    volumeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    volumeLabel: {
        fontSize: 12,
        color: COLORS.text,
        opacity: 0.5,
        fontFamily: FONTS.PoppinsMedium,
    },
    soundOptionsSection: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 24,
    },
    soundOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    soundOptionTitle: {
        fontSize: 16,
        fontFamily: FONTS.PoppinsBold,
        color: COLORS.text,
        marginBottom: 4,
    },
    soundOptionDescription: {
        fontSize: 14,
        color: COLORS.text,
        opacity: 0.7,
    },
});

export default SoundSettingsScreen;