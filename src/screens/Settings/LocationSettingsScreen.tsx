import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
    Platform,
    PermissionsAndroid,
    Linking,
} from 'react-native';
import { COLORS, FONTS } from '../../themes/styles';
import { SettingsHeader } from '../../components/SettingsHeader';
import { CustomAlert } from '../../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgImage } from '@/components/svgImages/SvgImages';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface City {
    id: string;
    name: string;
    region: string;
}

const CITIES: City[] = [
    { id: 'baku', name: 'Bakı', region: 'Bakı' },
    { id: 'ganja', name: 'Gəncə', region: 'Gəncə-Qazax' },
    { id: 'sumgait', name: 'Sumqayıt', region: 'Abşeron' },
    { id: 'mingachevir', name: 'Mingəçevir', region: 'Aran' },
    { id: 'lankaran', name: 'Lənkəran', region: 'Lənkəran' },
    { id: 'sheki', name: 'Şəki', region: 'Şəki-Zaqatala' },
    { id: 'shirvan', name: 'Şirvan', region: 'Aran' },
    { id: 'nakhchivan', name: 'Naxçıvan', region: 'Naxçıvan' },
    { id: 'quba', name: 'Quba', region: 'Quba-Xaçmaz' },
    { id: 'shamakhi', name: 'Şamaxı', region: 'Dağlıq Şirvan' },
];

const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
    }

    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const checkLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return result === RESULTS.GRANTED;
    }

    return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
};

interface HeaderComponentProps {
    locationEnabled: boolean;
    toggleLocation: (value: boolean) => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    locationEnabled,
    toggleLocation,
}) => (
    <View style={styles.notificationContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.title}>Cari Məkan</Text>
            <Text style={styles.description}>
                Dəqiq iftar vaxtları və yaxın restoranlar üçün məkanı aktiv et.
            </Text>
        </View>
        <Switch
            value={locationEnabled}
            onValueChange={toggleLocation}
            trackColor={{ false: '#767577', true: COLORS.primary }}
            thumbColor={locationEnabled ? '#C1D9B0' : '#f4f3f4'}
            style={{ transform: [{ scaleX: 1.8 }, { scaleY: 1.5 }] }}
        />
    </View>
);

const LocationSettingsScreen: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState('baku');
    const [searchQuery, setSearchQuery] = useState('');
    const [locationEnabled, setLocationEnabled] = useState(false);
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

    useEffect(() => {
        checkLocationPermission().then(setLocationEnabled);
    }, []);

    const toggleLocation = async (value: boolean) => {
        if (!value) {
            setLocationEnabled(false);

            setAlertConfig({
                visible: true,
                title: 'Məkan deaktiv edildi',
                message: 'Tam söndürmək üçün telefon ayarlarına keçə bilərsiniz.',
                buttons: [
                    { text: 'Ləğv et', style: 'cancel' },
                    { text: 'Ayarlar', onPress: () => Linking.openSettings(), style: 'default' },
                ],
            });
            return;
        }

        const granted = await requestLocationPermission();

        if (granted) {
            setLocationEnabled(true);
        } else {
            setAlertConfig({
                visible: true,
                title: 'Xəta',
                message: 'Məkan icazəsi verilmədi',
                buttons: [{ text: 'OK', style: 'default' }],
            });
            setLocationEnabled(false);
        }
    };

    const filteredCities = CITIES.filter(
        city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <SettingsHeader title="Məkan" />

            <View style={styles.content}>
                <HeaderComponent
                    locationEnabled={locationEnabled}
                    toggleLocation={toggleLocation}
                />

                <View style={styles.searchContainer}>
                    <SvgImage
                        source={require('../../assets/svg/thirdPage/search.svg')}
                        width={20}
                        height={20}
                    />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Şəhər axtar..."
                        placeholderTextColor={COLORS.text + '80'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={styles.clearButton}
                            // activeOpacity={0.7}
                        >
                            <SvgImage
                                source={require('../../assets/svg/thirdPage/cancel.svg')}
                                width={21}
                                height={21}
                                // fill={COLORS.text}
                            />
                        </TouchableOpacity>
                    )}
                </View>


                <ScrollView
                    // style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 20 }}
                >
                    {filteredCities.map(city => (
                        <TouchableOpacity
                            key={city.id}
                            style={[
                                styles.cityItem,
                                selectedCity === city.id &&
                                styles.cityItemSelected,
                            ]}
                            onPress={() => setSelectedCity(city.id)}
                        >
                            <Text style={styles.cityName}>{city.name}</Text>
                            <View
                                style={[
                                    styles.radioButton,
                                    selectedCity === city.id &&
                                    styles.radioButtonSelected,
                                ]}
                            >
                                {selectedCity === city.id && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onDismiss={() => setAlertConfig({ ...alertConfig, visible: false })}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        flex: 1,
        padding: 16
    },
    notificationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.cardBackground,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
        marginRight: 12
    },
    title: {
        fontFamily: FONTS.PoppinsBold,
        fontSize: 16
    },
    description: {
        fontSize: 14
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8
    },
    clearButton: {
        marginLeft: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        // marginTop: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cityItemSelected: {
        borderColor: COLORS.primary
    },
    cityName: {
        fontFamily: FONTS.PoppinsBold
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: { borderColor: COLORS.primary },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
});

export default LocationSettingsScreen;
