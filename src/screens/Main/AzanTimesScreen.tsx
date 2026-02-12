import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import MapView, { Region, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { AzanStackParamList } from '../../navigation/Router';
import { ROUTES } from '../../navigation/routes';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';
import LocationIcon from '../../assets/svg/mainPage/location.svg';
import { apiService } from '../../api/services/apiService';
import { useLocation } from '../../context/LocationContext';



interface TodayContent {
    duaText: string;
    duaSource: string;
}

interface RamadanDay {
    day: number;
}


const AzanTimesScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<NavigationProp<AzanStackParamList>>();
    const [todayContent, setTodayContent] = useState<TodayContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [ramadanDay, setRamadanDay] = useState<number | null>(null);
    const [imsakTime, setImsakTime] = useState<string | null>(null);
    const [iftarTime, setIftarTime] = useState<string | null>(null);


    // Use shared location context
    const { location, refreshLocation } = useLocation();

    // Helper function to convert time string to Date object
    const toDate = (time: string, isTomorrow = false) => {
        const [h, m, s] = time.split(':').map(Number);

        const now = new Date();
        const d = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            h,
            m,
            s ?? 0,
            0
        );

        if (isTomorrow) {
            d.setDate(d.getDate() + 1);
        }

        return d;
    };

    // Calculate next target time (imsak or iftar) - memoized to prevent infinite loops
    const nextTarget = useMemo(() => {
        if (!imsakTime || !iftarTime) return null;

        const now = new Date();
        const imsak = toDate(imsakTime);
        const iftar = toDate(iftarTime);

        if (now < iftar) {
            return { label: 'İftara vaxtı', target: iftar };
        }

        // iftardan sonra → sabahın sahuru
        return { label: 'Sahura vaxtı', target: toDate(imsakTime, true) };
    }, [imsakTime, iftarTime]);

    // Countdown state
    const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });

    // Update countdown every second
    useEffect(() => {
        if (!nextTarget?.target) {
            setCountdown({ h: '00', m: '00', s: '00' });
            return;
        }

        const tick = () => {
            const diff = nextTarget.target.getTime() - Date.now();

            if (diff <= 0) {
                setCountdown({ h: '00', m: '00', s: '00' });
                return;
            }

            const total = Math.floor(diff / 1000);
            const h = Math.floor(total / 3600);
            const m = Math.floor((total % 3600) / 60);
            const s = total % 60;

            setCountdown({
                h: String(h).padStart(2, '0'),
                m: String(m).padStart(2, '0'),
                s: String(s).padStart(2, '0'),
            });
        };

        tick(); // Initial tick
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [nextTarget]);


    // Animate map when location changes
    useEffect(() => {
        if (!location || !mapRef.current) return;

        mapRef.current.animateToRegion(
            {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            1000
        );
    }, [location]);


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

    // fetch ramadan day
    useEffect(() => {
        const fetchRamadanDay = async () => {
            try {
                setLoading(true);
                const response = await apiService.getRamadanDay();
                console.log('Ramadan day response:', response);
                setRamadanDay(response.day);
            } catch (error) {
                console.error('Error fetching Ramadan day:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRamadanDay();
    }, []);


    useEffect(() => {
        if (!location) return;

        const fetchPrayerTimes = async () => {
            try {
                const res = await apiService.getPrayerTimes({
                    lat: location.latitude,
                    lng: location.longitude,
                    city: location.city,
                    date: 'today',
                    tz: 4,
                    method: 'MWL',
                });

                setImsakTime(res.imsak);
                setIftarTime(res.iftar);
            } catch (e) {
                console.log('Prayer time error', e);
            }
        };

        fetchPrayerTimes();
    }, [location]);

    // Fetch today's content (ayah and dua)
    useEffect(() => {
        const fetchTodayContent = async () => {
            try {
                setLoading(true);
                const response = await apiService.getTodaysContent();
                setTodayContent({
                    duaText: response.duaText,
                    duaSource: response.duaSource,
                });
            } catch (error) {
                console.error('Error fetching today\'s content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayContent();
    }, []);

    const splitTime = (t?: string) => {
        if (!t) return ['--', '--', '--'];
        const parts = t.split(':');
        return [
            parts[0] ?? '--',
            parts[1] ?? '--',
            parts[2] ?? '--',
        ];
    };
    const [imsakH, imsakM, imsakS] = splitTime(imsakTime);
    const [iftarH, iftarM, iftarS] = splitTime(iftarTime);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />

            {/* Map Section */}
            <View style={[styles.mapContainer, { paddingTop: insets.top }]}>
                {location && (
                    <MapView
                        provider="google"
                        ref={mapRef}
                        style={StyleSheet.absoluteFillObject}
                        mapType="standard"
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        // scrollEnabled={false}
                        // zoomEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        toolbarEnabled={false}
                        mapPadding={{
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 40,
                        }}
                        onMapReady={() => {
                            console.log("MAP READY ✅");
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title="Mənim yerləşməm"
                        />
                    </MapView>
                )}

                {/* My Location */}
                <TouchableOpacity
                    style={styles.myLocationButton}
                    onPress={refreshLocation}
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

            <View style={styles.mapSpacer} />

            {/* Overlapping Scrollable Content */}
            <ScrollView
                // style={styles.scrollableContent}
                // showsVerticalScrollIndicator={false}
                // contentContainerStyle={styles.scrollContentContainer}
                style={styles.content}
                contentContainerStyle={{
                    // paddingHorizontal: 10,
                    paddingBottom: insets.bottom + 25,
                }}
                showsVerticalScrollIndicator={false}
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
                        <Text style={styles.dayText}>
                            {ramadanDay ?? '--'}
                        </Text>
                        <SvgImage
                            source={require('../../assets/svg/mainPage/mosque.svg')}
                            width={40}
                            height={40}
                            fill={COLORS.text}
                        />
                    </View>
                </View>

                {/* <RemainingTime /> */}
                <View style={styles.remainingTimeContainer}>
                    <Text style={styles.remainingTimeText}>
                        {nextTarget?.label ?? 'Vaxt hesablanır'}
                    </Text>

                    <View style={styles.timeRow}>
                        <Text style={styles.timeBig}>{countdown.h}</Text>
                        <Text style={styles.timeColon}>:</Text>
                        <Text style={styles.timeBig}>{countdown.m}</Text>
                        <Text style={styles.timeColon}>:</Text>
                        <Text style={styles.timeSmall}>{countdown.s}</Text>
                    </View>
                </View>

                <View style={{ paddingLeft: 20, marginTop: 15 }}>
                    <Text style={styles.sahurTimeText}>Sahur Vaxtı</Text>
                </View>

                <View style={styles.sahurTimeContainer}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{imsakH}</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{imsakM}</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{imsakS}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ paddingLeft: 20, marginTop: 30 }}>
                    <Text style={styles.sahurTimeText}>İftar Vaxtı</Text>
                </View>

                <View style={styles.sahurTimeContainer}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{iftarH}</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{iftarM}</Text>
                        </View>

                        <Text style={styles.colon}>:</Text>

                        <View style={styles.timeBox}>
                            <Text style={styles.timeNumber}>{iftarS}</Text>
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
                    {/* LEFT PART */}
                    <View style={[styles.todaysPrayContainer, { paddingRight: 160 }]}>
                        <Text style={styles.todaysPrayText}>Bugünün duası</Text>

                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <View style={styles.todaysPrayBottom}>
                                <Text style={styles.todaysPrayInfo}>
                                    {todayContent?.duaText ||
                                        "Harada olursansa ol, Allah qarşısında məsuliyyətini unutma. Pisliyi yaxşılıqla yox et və insanlara gözəl əxlaqla yanaş."
                                    }
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* RIGHT PART - IMAGE */}
                    <SvgImage
                        source={require('../../assets/svg/mainPage/todaysPray.svg')}
                        width={180}
                        height={180}
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
    mapSpacer: {
        height: 20,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    scrollableContent: {
        flex: 1,
        // marginTop: -25, // Overlap the map by 5px
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
        // marginTop: 14,
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        // marginHorizontal: 20,
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
        // marginHorizontal: 20,
        width: '100%',
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
        marginTop: 24,
        // marginHorizontal: 5,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        position: 'relative',
        // flexDirection: 'row',
        // overflow: 'hidden',
    },
    todaysPrayContainer: {
        // flex: 1,
        padding: 20,
        borderRadius: 16,
        paddingRight: 160,
        justifyContent: 'space-between',
    },
    todaysPrayText: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: FONTS.PoppinsBold,
        color: '#2E3A2F',
    },
    todaysPrayBottom: {
        marginBottom: 0,
    },
    todaysPraySubtitle: {
        fontSize: 14,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
        marginBottom: 15,
        marginTop: 10,
    },
    todaysPrayInfo: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
    },
    todaysPrayRightContent: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todaysPrayImage: {
        position: 'absolute',
        right: -25,
        bottom: -30,
        aspectRatio: 1,
        zIndex: 1,
        pointerEvents: 'none',
    },










});
