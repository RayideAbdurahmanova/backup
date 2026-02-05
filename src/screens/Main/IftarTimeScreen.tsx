import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    ScrollView,
    Image,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '@/components/svgImages/SvgImages';

const IftarTimeScreen: React.FC = () => {

    const prayerTimes = [
        { id: '1', name: 'İmsak', value: '06:25' },
        { id: '2', name: 'Günəş', value: '07:52' },
        { id: '3', name: 'Zöhr', value: '12:53' },
        { id: '4', name: 'Əsr', value: '16:13' },
        { id: '5', name: 'Məğrib', value: '18:09' },
        { id: '6', name: 'İşa', value: '19:11' },
    ];

    const toDate = (time: string) => {
        const [h, m] = time.split(':');
        const date = new Date();
        date.setHours(Number.parseInt(h, 10), Number.parseInt(m, 10), 0, 0);
        return date;
    };

    const getCurrentPrayer = (prayers: typeof prayerTimes) => {
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
                // son namaz (İşa)
                return prayers[i].name;
            }
        }

        return null;
    };

    const currentPrayer = getCurrentPrayer(prayerTimes);

    const renderItem = ({ item }: { item: typeof prayerTimes[0] }) => {
        const isCurrent = item.name === currentPrayer;

        return (
            <View style={styles.item}>
                <Text
                    style={[
                        styles.name,
                        isCurrent && styles.activeText,
                    ]}
                >
                    {item.name}
                </Text>

                <Text
                    style={[
                        styles.value,
                        isCurrent && styles.activeText,
                    ]}
                >
                    {item.value}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={['top', 'left', 'right']}
        >
            {/* <View style={styles.wrapper}> */}
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor="transparent"
                translucent={Platform.OS === 'android' ? false : undefined}
            />
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    {/* SOL HİSSƏ */}
                    <View style={styles.left}>
                        <Text style={styles.city}>Bakı</Text>
                        <Text style={styles.hijri}>Ramadan 1447 Hicri</Text>

                        <Text style={styles.date}>19 Fevral 2026</Text>

                        <View style={{ marginTop: 25 }}>
                            <Text style={styles.label}>Vaxtın çıxmasına:</Text>

                            <View style={styles.timeRow}>
                                <SvgImage
                                    source={require('../../assets/svg/firstPage/clockBlack.svg')}
                                    width={18}
                                    height={18}
                                />
                                <Text style={styles.time}>06 : 24 : 05</Text>
                            </View>
                        </View>
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
                    data={prayerTimes}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    style={{ marginTop: 35 }}
                />

                {/* Remaining time */}
                <View style={styles.remainingTimeWrapper}>
                    {/* LEFT PART */}
                    <View style={styles.remainingTimeLeftContent}>
                        <Text style={styles.remainingTimeText}>Vaxtın Ayəsi</Text>

                        <View style={styles.remainingTimeBottom}>
                            <Text style={styles.remainingTimeSubtitle}>Rəd- 28. Ayə</Text>
                            <Text style={styles.remainingTimeInfo}>
                                "Qəlblər yalnız Allahı zikr etməklə rahatlıq tapar."
                            </Text>
                        </View>
                    </View>

                    {/* RIGHT PART - IMAGE */}
                    <View style={styles.remainingTimeRightContent}>
                        <SvgImage
                            source={require('../../assets/svg/firstPage/remaining.svg')}
                            width={140}
                            height={140}
                            style={styles.remainingTimeImage}
                        />
                    </View>
                </View>

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
    scrollContent: {
        // flexGrow: 1,
        paddingBottom: 24,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    card: {
        backgroundColor: '#DDE3D7',
        borderRadius: 18,
        paddingTop: 10,
        paddingRight: 0,   
        flexDirection: 'row',
        // position: 'relative',
        // minHeight: 180,
        // overflow: 'hidden',
    },
    left: {
        maxWidth: '55%', 
        // zIndex: 2,
        paddingLeft: 5,
    },
    right: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        // borderWidth:1,
        // borderColor:'#00000010',
        paddingHorizontal:0,
        paddingVertical:0,
    },
    mosqueImage: {
        // position: 'absolute',
        // right: -25,
        // bottom: -15,
        width: 250,
        height: 180,   
        // zIndex: 1,
    },
    city: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A4A4A',
    },
    hijri: {
        fontSize: 14,
        color: '#6B6B6B',
        marginTop: 4,
    },
    date: {
        fontSize: 20,
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
        marginHorizontal: 12,
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
        color: '#000',
    },
    activeText: {
        color: '#D2691E',
        fontWeight: '700',
    },
    remainingTimeWrapper: {
        marginTop: 24,
        marginHorizontal: 5,
        height: 200,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    remainingTimeLeftContent: {
        flex: 1,
        padding: 20,
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
        marginBottom: 8,
    },
    remainingTimeInfo: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4A5A4E',
        fontFamily: FONTS.PoppinsRegular,
    },
    remainingTimeRightContent: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remainingTimeImage: {
        width: '100%',
        height: '100%',
    },
    todaysPrayWrapper: {
        marginTop: 24,
        marginHorizontal: 5,
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

export default IftarTimeScreen;
