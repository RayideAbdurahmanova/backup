import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    Text,
    ScrollView,
    Image,
} from 'react-native';
import MapView, { Region, Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { AzanStackParamList } from '../../navigation/Router';
import { ROUTES } from '../../navigation/routes';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';
import LocationIcon from '../../assets/svg/mainPage/location.svg';


const DEFAULT_REGION: Region = {
    latitude: 40.4093, // Bakı fallback
    longitude: 49.8671,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const AzanTimesScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<NavigationProp<AzanStackParamList>>();

    const [region, setRegion] = useState<Region>(DEFAULT_REGION);

    /* ---------------- Location ---------------- */
    const fetchCurrentLocation = useCallback(async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Location', 'Location icazəsi verilmədi');
                return;
            }
        }

        Geolocation.getCurrentPosition(
            ({ coords }) => {
                const newRegion = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            },
            (error) => {
                console.log('High accuracy failed:', error.message);

                // 🔁 FALLBACK
                Geolocation.getCurrentPosition(
                    ({ coords }) => {
                        const fallbackRegion = {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        };

                        setRegion(fallbackRegion);
                        mapRef.current?.animateToRegion(fallbackRegion, 1000);
                    },
                    (err) => {
                        Alert.alert(
                            'Məkan müəyyən edilə bilmədi',
                            'Zəhmət olmasa GPS-i aktiv edin'
                        );
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 20000,
                        maximumAge: 30000,
                    }
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 25000, // 👈 artırdıq
                maximumAge: 0,
            }
        );
    }, []);


    useEffect(() => {
        fetchCurrentLocation();
    }, [fetchCurrentLocation]);

    const getCurrentDateI18n = () => {
        const date = new Date();

        if (i18n.language === 'az') {
            const azMonths = [
                'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
                'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
            ];
            const day = date.getDate();
            const month = azMonths[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month}, ${year}`;
        }

        return date.toLocaleDateString('en-US', {
            timeZone: 'Asia/Baku',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRemainingToAzanTime = () => {
        const now = new Date();
        const endOfDay = new Date();

        endOfDay.setHours(23, 59, 59, 999);

        const diff = endOfDay.getTime() - now.getTime();

        if (diff <= 0) {
            return { h: '00', m: '00', s: '00' };
        }

        const totalSeconds = Math.floor(diff / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        return {
            h: String(h).padStart(2, '0'),
            m: String(m).padStart(2, '0'),
            s: String(s).padStart(2, '0'),
        };
    };

    const useEndOfDayCountdown = () => {
        const [time, setTime] = useState(getRemainingToAzanTime());

        useEffect(() => {
            const interval = setInterval(() => {
                setTime(getRemainingToAzanTime());
            }, 1000);

            return () => clearInterval(interval);
        }, []);

        return time;
    };

    const RemainingTime = () => {
        const { h, m, s } = useEndOfDayCountdown();

        return (
            <View style={styles.remainingTimeContainer}>
                <Text style={styles.remainingTimeText}>Vaxtın çıxmasına</Text>
                <View style={styles.timeRow}>
                    <Text style={styles.timeBig}>{h}</Text>
                    <Text style={styles.timeColon}>:</Text>
                    <Text style={styles.timeBig}>{m}</Text>
                    <Text style={styles.timeColon}>:</Text>
                    <Text style={styles.timeSmall}>{s}</Text>
                </View>
            </View>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />

            {/* Map Section */}
            <View style={[styles.mapContainer, { paddingTop: insets.top }]}>
                {region && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        ref={mapRef}
                        style={StyleSheet.absoluteFillObject}
                        region={region}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                        mapPadding={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 40,
                        }}
                        onMapReady={() => console.log('✅ Map loaded successfully!')}
                        onError={(e) => console.log('❌ Map Error:', e.nativeEvent)}
                    >
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            title="Mənim yerləşməm"
                        />
                    </MapView>
                )}

                {/* My Location */}
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={fetchCurrentLocation}
                    activeOpacity={0.85}
                >
                    <SvgImage
                        source={{ default: LocationIcon }}
                        width={22}
                        height={22}
                        fill={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>

            {/* Overlapping Scrollable Content */}
            <ScrollView
                style={styles.scrollableContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {/* date and time  */}
                <View style={styles.dateTimeContainer}>
                    {/* SOL TƏRƏF */}
                    <View style={styles.leftBlock}>
                        <Text style={styles.dateTimeText}>
                            Ramadan 1447 Hicri
                        </Text>
                        <Text style={styles.dateTime}>
                            {getCurrentDateI18n()}
                        </Text>
                    </View>

                    {/* SAĞ TƏRƏF */}
                    <View style={styles.rightBlock}>
                        <Text style={styles.dayText}>01</Text>
                        <SvgImage
                            source={require('../../assets/svg/mainPage/mosque.svg')}
                            width={40}
                            height={40}
                            fill={COLORS.text}
                        />
                    </View>
                </View>

                <RemainingTime />
                <View style={{ paddingLeft: 20, marginTop: 15 }}>
                    <Text style={styles.sahurTimeText}>Sahur Vaxtı</Text>
                </View>

                <View style={styles.sahurTimeContainer}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>04</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>32</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>15</Text>
                        </View>
                    </View>
                </View>

                <View style={{ paddingLeft: 20, marginTop: 25 }}>
                    <Text style={styles.sahurTimeText}>İftar Vaxtı</Text>
                </View>

                <View style={styles.sahurTimeContainer}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>05</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>14</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>13</Text>
                        </View>
                    </View>
                </View>
                {/* Be guest  */}
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.AZAN_STACK.RESTAURANTS_HOME)}
                    style={styles.beGuestContainer}
                >
                    {/* SVG arxa fon */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={require('../../assets/images/beGuest.png')}
                            style={styles.beGuestImage}
                            onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
                            onLoad={() => console.log('Image loaded successfully')}
                        />
                    </View>
                    {/* Overlay content */}
                    <View style={styles.textOverlay}>
                        <TouchableOpacity
                            style={styles.tanisOlButton}
                            onPress={() => navigation.navigate(ROUTES.AZAN_STACK.RESTAURANTS_HOME)}
                        >
                            <Text style={styles.tanisOlText}>Tanış ol</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={styles.todaysPrayWrapper}>
                    {/* KART */}
                    <View style={styles.todaysPrayContainer}>
                        <View style={styles.todaysPrayLeftContent}>
                            <Text style={styles.todaysPrayText}>Bu günün duası</Text>

                            <Text style={styles.todaysPrayInfo}>
                                Harada olursansa ol,{'\n'}
                                Allah qarşısında{'\n'}
                                məsuliyyətini unutma.{'\n'}
                                Pisliyi yaxşılıqla yox et və{'\n'}
                                insanlara gözəl əxlaqla yanaş.
                            </Text>
                        </View>
                    </View>

                    {/* DALĞALI ŞƏKİL (ÜSTÜNDƏ) */}
                    <SvgImage
                        source={require('../../assets/svg/mainPage/todaysPray.svg')}
                        width={150}
                        height={150}
                        style={styles.todaysPrayImage}
                    />
                </View>




                {/* Add some bottom padding for better scrolling */}
                {/* <View style={{ height: 100 }} /> */}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AzanTimesScreen;

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        height: 240,
        width: '100%',
        overflow: 'hidden',
    },
    scrollableContent: {
        flex: 1,
        marginTop: -25, // Overlap the map by 5px
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
    },
    scrollContentContainer: {
        paddingBottom: 40,
    },
    myLocationButton: {
        position: 'absolute',
        bottom: 40,
        right: 14,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    dateTimeContainer: {
        marginTop: 14,
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        marginHorizontal: 20,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftBlock: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    rightBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTimeText: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
    },
    dateTime: {
        color: COLORS.text,
        fontSize: 18,
        marginTop: 4,
        fontFamily: FONTS.InterExtraBold,
    },
    dayText: {
        color: COLORS.text,
        fontSize: 30,
        marginRight: 6, 
        fontFamily: FONTS.InterExtraBold,
    },
    remainingTimeContainer: {
        marginTop: 16,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        // backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        marginHorizontal: 20,
    },
    remainingTimeText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5,
        fontFamily: FONTS.PoppinsSemiBold,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeBig: {
        color: COLORS.primary,
        fontSize: 40,
        fontFamily: FONTS.InterExtraBold,
    },
    timeSmall: {
        color: COLORS.primary,
        fontSize: 24,
        fontFamily: FONTS.InterExtraBold,
    },
    timeColon: {
        color: COLORS.primary,
        fontSize: 28,
        fontWeight: '600',
        marginHorizontal: 4,
    },
    sahurTimeContainer: {
        alignItems: 'center',
        marginTop: 12,
    },
    sahurTimeText: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    timeBox: {
        width: 100,
        height: 68,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: FONTS.PoppinsBold,
    },
    colon: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: FONTS.PoppinsBold,
        marginHorizontal: 8,
    },
    beGuestContainer: {
        position: 'relative',
        marginTop: 28,
        marginHorizontal: 20,
        width: '90%', // Explicit width
        alignSelf: 'center',
    },
    imageWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    beGuestImage: {
        width: '100%',
        height: 202,
        resizeMode: 'contain', // Changed from 'cover' to 'contain'
    },
    textOverlay: {
        position: 'absolute',
        bottom: 15,
        left: 20,
    },
    beGuestText1: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: FONTS.PoppinsBold,
    },
    beGuestText2: {
        fontSize: 24,
        fontWeight: '600',
        color: '#E7B343',
        marginLeft: 24,
        marginTop: 4,
        fontFamily: FONTS.PoppinsBold,

    },
    tanisOlButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
        paddingHorizontal: 13,
        paddingVertical: 4,
        backgroundColor: '#C1D9B0',
        borderRadius: 20,
    },
    tanisOlText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    todaysPrayWrapper: {
        marginTop: 28,
        marginHorizontal: 25,
        height: 200,
        position: 'relative',
    },
    todaysPrayContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        height: '100%',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 120,
    },
    todaysPrayLeftContent: {
        flex: 1,
    },
    todaysPrayText: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: FONTS.PoppinsBold,
        color: '#2E3A2F',
    },
    todaysPrayInfo: {
        marginTop: 12,
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
    },
    todaysPrayImage: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },


});
