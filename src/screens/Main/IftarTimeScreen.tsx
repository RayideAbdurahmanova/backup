import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '@/components/svgImages/SvgImages';
import { ApiResponse, apiService, getPrayerTimesResponse } from '../../api/services/apiService';
import { useLocation } from '../../context/LocationContext';


interface TodayContent {
    ayahText: string;
    ayahSource: string;
    duaText: string;
    duaSource: string;
}

const IftarTimeScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [todayContent, setTodayContent] = useState<TodayContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [prayerTimes, setPrayerTimes] = useState<getPrayerTimesResponse | null>(null);

    // Use shared location context - city comes from context, no duplicate permission requests
    const { location } = useLocation();
    const city = location?.city ?? '...';


    useEffect(() => {
        if (!location) return;

        const fetchPrayerTimes = async () => {
            try {
                const response = await apiService.getPrayerTimes({
                    lat: location.latitude,
                    lng: location.longitude,
                    city: location.city,
                    date: 'today',
                    tz: 4,
                    method: 'MWL',
                });

                setPrayerTimes(response);
            } catch (e) {
                console.log('Prayer times error:', e);
            }
        };

        fetchPrayerTimes();
    }, [location]);

    const prayerTimesList = prayerTimes
        ? [
            { id: '1', name: 'İmsak', value: prayerTimes.imsak },
            { id: '2', name: 'Günəş', value: prayerTimes.fullTimes['Günəş çıxışı'] },
            { id: '3', name: 'Zöhr', value: prayerTimes.fullTimes['Zöhr'] },
            { id: '4', name: 'Əsr', value: prayerTimes.fullTimes['Əsr'] },
            { id: '5', name: 'Məğrib', value: prayerTimes.iftar },
            { id: '6', name: 'İşa', value: prayerTimes.fullTimes['İşa'] },
        ]
        : [];



    // Fetch today's content (ayah and dua)
    useEffect(() => {
        const fetchTodayContent = async () => {
            try {
                setLoading(true);
                const response = await apiService.getTodaysContent();
                setTodayContent({
                    ayahText: response.ayahText,
                    ayahSource: response.ayahSource,
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


    const formatTime = (time?: string) => {
        if (!time) return '--:--';
        return time.slice(0, 5); // "18:04:00" → "18:04"
    };

    const toDate = (time?: string) => {
        if (!time) return new Date(0);

        const parts = time.split(':');
        const h = Number(parts[0]);
        const m = Number(parts[1]);
        const s = parts[2] ? Number(parts[2]) : 0;

        const date = new Date();
        date.setHours(h, m, s, 0);
        return date;
    };


    type PrayerItem = {
        id: string;
        name: string;
        value: string;
    };

    const getCurrentPrayer = (prayers: PrayerItem[]) => {
        const now = new Date();

        for (let i = 0; i < prayers.length; i++) {
            const current = toDate(prayers[i].value);
            const next = prayers[i + 1]
                ? toDate(prayers[i + 1].value)
                : null;

            if (next) {
                if (now >= current && now < next) {
                    return prayers[i].name;
                }
            } else if (now >= current) {
                return prayers[i].name;
            }
        }

        return null;
    };


    const currentPrayer = getCurrentPrayer(prayerTimesList);

    const renderItem = ({ item }: { item: typeof prayerTimesList[0] }) => {
        const isCurrent = item.name === currentPrayer;

        return (
            <View style={styles.item}>
                <Text
                    style={[styles.name, isCurrent && styles.activeText,]}>
                    {item.name}
                </Text>

                <Text style={[styles.value, isCurrent && styles.activeText,]}>
                    {formatTime(item.value)}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={['left']}
        >
            {/* <View style={styles.wrapper}> */}
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor="transparent"
                translucent={Platform.OS === 'android' ? false : undefined}
            />
            <ScrollView
                style={styles.content}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: insets.top + 15,
                    paddingBottom: insets.bottom + 25,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    {/* SOL HİSSƏ */}
                    <View style={styles.left}>
                        <Text style={styles.city}>
                            {location?.city === 'Unknown location' ? 'Şəhər tapılmadı' : location?.city}
                        </Text>
                        <View style={styles.centerBlock}>
                            <Text style={styles.hijri}>Ramadan 1447 Hicri</Text>

                            <Text style={styles.date}>
                                {new Date().toLocaleDateString('az-AZ', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </Text>
                        </View>

                        {/* <View style={{ marginTop: 25 }}>
                            <Text style={styles.label}>Vaxtın çıxmasına:</Text>

                            <View style={styles.timeRow}>
                                <SvgImage
                                    source={require('../../assets/svg/firstPage/clockBlack.svg')}
                                    width={18}
                                    height={18}
                                />
                                <Text style={styles.time}>06 : 24 : 05</Text>
                            </View>
                        </View> */}
                    </View>

                    <View style={styles.right}>
                        <Image
                            source={require('../../assets/images/mosqueBigDark.png')}
                            style={styles.mosqueImage}
                            resizeMode='contain'
                        />
                    </View>
                </View>

                {/* namaz saatlari */}
                <FlatList
                    data={prayerTimesList}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    style={{ marginTop: 35, height: 70 }}
                    contentContainerStyle={{
                        // flex: 1,
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                />

                {/* Remaining time - Ayah */}
                <View style={styles.remainingTimeWrapper}>
                    {/* LEFT PART */}
                    <View style={styles.remainingTimeContainer}>
                        <Text style={styles.remainingTimeText}>Vaxtın Ayəsi</Text>

                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <View style={styles.remainingTimeBottom}>
                                <Text style={styles.remainingTimeSubtitle}>
                                    {todayContent?.ayahSource || 'Rəd- 28. Ayə'}
                                </Text>
                                <Text style={styles.remainingTimeInfo}>
                                    {todayContent?.ayahText || '"Qəlblər yalnız Allahı zikr etməklə rahatlıq tapar."'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* RIGHT PART - IMAGE */}
                    <SvgImage
                        source={require('../../assets/svg/firstPage/remaining.svg')}
                        width={200}
                        height={200}
                        style={styles.remainingTimeImage}
                    />
                </View>

                <View style={styles.remainingTimeWrapper}>
                    {/* LEFT PART */}
                    <View style={[styles.remainingTimeContainer, { paddingRight: 160 }]}>
                        <Text style={styles.remainingTimeText}>Bugünün duası</Text>

                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <View style={styles.remainingTimeBottom}>
                                <Text style={styles.remainingTimeInfo}>
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

            </ScrollView>


            {/* </View> */}
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
        padding: 15,
    },
    card: {
        backgroundColor: '#DDE3D7',
        borderRadius: 18,
        paddingTop: 20,
        paddingRight: 0,
        flexDirection: 'row',
        // marginHorizontal: 5,
    },
    left: {
        // flex: 1,
        paddingLeft: 20,
        // paddingTop: 10,
        // borderWidth: 1,
        // borderColor: '#00000010',
        paddingVertical: 30,
        // paddingHorizontal: 15,
    },
    city: {
        fontSize: 14,
        color: '#676967',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    centerBlock: {
        flex: 1,
        justifyContent: 'center',
    },

    right: {
        paddingHorizontal: 0,
    },
    mosqueImage: {
        width: 220,
        height: 180,
        // zIndex: 1,
    },
    hijri: {
        fontSize: 12,
        color: '#6B6B6B',
        marginTop: 15,
    },
    date: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E1E1E',
        marginTop: 6,
    },
    label: {
        fontSize: 14,
        color: '#6B6B6B',
        marginTop: 12,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    time: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E1E1E',
        marginLeft: 8,
    },
    item: {
        // flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    name: {
        fontSize: 13,
        color: '#555',
        fontFamily: FONTS.PoppinsRegular,
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
        color: '#000',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    activeText: {
        color: '#D2691E',
        fontWeight: '700',
    },
    remainingTimeWrapper: {
        marginTop: 24,
        // marginHorizontal: 5,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        position: 'relative',
        // flexDirection: 'row',
        // overflow: 'hidden',
    },
    remainingTimeContainer: {
        // flex: 1,
        padding: 20,
        borderRadius: 16,
        paddingRight: 160,
        justifyContent: 'space-between',
    },
    remainingTimeText: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: FONTS.PoppinsBold,
        color: '#2E3A2F',
    },
    remainingTimeBottom: {
        marginBottom: 0,
    },
    remainingTimeSubtitle: {
        fontSize: 14,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
        marginBottom: 15,
        marginTop: 10,
    },
    remainingTimeInfo: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
    },
    remainingTimeRightContent: {
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingTimeImage: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 120,
        aspectRatio: 1,
        zIndex: 1,
        pointerEvents: 'none',
    },
    todaysPrayImage: {
        position: 'absolute',
        right: -30,
        bottom: -30,
        aspectRatio: 1,
        zIndex: 1,
        pointerEvents: 'none',
    },
});

export default IftarTimeScreen;
