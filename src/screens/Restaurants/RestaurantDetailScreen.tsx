import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    Dimensions,
    SafeAreaView,
    Linking,
    Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';

// Import icons
import BackIcon from '../../assets/svg/restaurants/back.svg';
import ArrowIcon from '../../assets/svg/restaurants/arrowRightUp.svg';

const { width, height } = Dimensions.get('window');

// Mock data
const RESTAURANT_DATA = {
    id: 1,
    name: 'Nusret Steakhouse',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    rating: 4.5,
    description: 'Siz özünüzü Sovet atmosferində hiss edəcəksiniz. Sizi hər zaman qarşılamaqdan məmnunuq.',
    workTime: '10:00 - 23:00',
    kitchen: 'Fast Food, Sağlam Qidalanma',
    phone: '+994 12 345 67 89',
    details: 'Açıq havada oturma, masa xidməti, əlil arabası ilə giriş, pulsuz Wi-Fi, kredit kartları qəbul olunur, siqaretsiz',
    suitable: 'Böyük qruplar, Dostlar, Ailə',
    location: {
        latitude: 40.4093,
        longitude: 49.8671,
    },
    interiorImages: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    ],
    menu: [
        { id: 1, name: 'Mərci / Toyuq şorbası:', category: 'Şorba:' },
        { id: 2, name: 'Qızardılmış toyuq, Plov (düyü və ətlə)', category: 'Əsas yeməklər' },
        { id: 3, name: 'Qarışıq tərəvəz salatı / Pomidor xiyar salatı', category: 'Salat:' },
        { id: 4, name: 'Paxlava / Şirin qutab / Şəkərbura', category: 'Desert:' },
        { id: 5, name: 'Su / Ayran / Kompot', category: 'İçki:' },
    ],
};

type TabType = 'interior' | 'info' | 'location' | 'menu';

const RestaurantDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<TabType>('interior');

    const handleBack = () => {
        navigation.goBack();
    };

    const openInMaps = () => {
        const { latitude, longitude } = RESTAURANT_DATA.location;
        const url = Platform.select({
            ios: `maps:0,0?q=${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}`,
        });
        if (url) {
            Linking.openURL(url);
        }
    };

    const renderInteriorTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.interiorContent}>
                {RESTAURANT_DATA.interiorImages.map((item, index) => {
                    if (index % 2 !== 0) return null; // Skip odd indices, we'll handle pairs

                    return (
                        <View key={index} style={styles.imageRow}>
                            <TouchableOpacity
                                style={[styles.interiorImageContainer, styles.imageLeft]}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={styles.interiorImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>

                            {RESTAURANT_DATA.interiorImages[index + 1] && (
                                <TouchableOpacity
                                    style={[styles.interiorImageContainer, styles.imageRight]}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: RESTAURANT_DATA.interiorImages[index + 1] }}
                                        style={styles.interiorImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );

    const renderInfoTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.infoSection}>
                <Text style={styles.infoText}>{RESTAURANT_DATA.description}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={[styles.infoTitle, { fontFamily: FONTS.PoppinsBold }]}>İş saatları : {RESTAURANT_DATA.workTime}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Mətbəx</Text>
                <Text style={styles.infoText}>{RESTAURANT_DATA.kitchen}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Detallar</Text>
                <Text style={styles.infoText}>{RESTAURANT_DATA.details}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Uyğundur</Text>
                <Text style={styles.infoText}>{RESTAURANT_DATA.suitable}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Telefon nömrə</Text>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${RESTAURANT_DATA.phone}`)}>
                    <Text style={[styles.infoText, styles.phoneText]}>{RESTAURANT_DATA.phone}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderLocationTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: RESTAURANT_DATA.location.latitude,
                        longitude: RESTAURANT_DATA.location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                >
                    <Marker
                        coordinate={RESTAURANT_DATA.location}
                        title={RESTAURANT_DATA.name}
                    />
                </MapView>
            </View>

            <View style={styles.addressContainer}>
                <Text style={styles.addressTitle}>Əlimərdan Topçubaşov 23,Bakı, Azərbaycan</Text>
            </View>

            <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
                <Text style={styles.mapButtonText}>Xəritəyə yönləndir</Text>
                <SvgImage
                    source={{ default: ArrowIcon }}
                    width={20}
                    height={20}
                // style={{ marginLeft: 8 }}
                />
            </TouchableOpacity>
        </View>
    );

    const renderMenuTab = () => {
        const groupedMenu = RESTAURANT_DATA.menu.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, typeof RESTAURANT_DATA.menu>);

        return (
            <View style={styles.tabContent}>
                <Text style={styles.menuTitle}>Ramazan İftar Menyusu</Text>
                {Object.entries(groupedMenu).map(([category, items]) => (
                    <View>
                        <View key={category} style={styles.menuCategory}>
                            <Text style={styles.menuCategoryTitle}>{category}</Text>
                            {items.map((item) => (
                                <View key={item.id} style={styles.menuItem}>
                                    <Text style={styles.menuItemText}>{item.name}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                ))}
                <View>
                    <Image
                        source={require('../../assets/images/menuPrice.png')}
                        style={{ width: width - 40, height: ((width - 40) * 600) / 1000, alignSelf: 'center', marginBottom: 20 }}
                        resizeMode="contain"
                    />
                </View>

            </View>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'interior':
                return renderInteriorTab();
            case 'info':
                return renderInfoTab();
            case 'location':
                return renderLocationTab();
            case 'menu':
                return renderMenuTab();
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />
            <View style={styles.fixedTopSpacer} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header Image */}
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: RESTAURANT_DATA.image }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />

                    {/* Header Overlay with gradient */}
                    <View style={styles.headerOverlay}>
                        {/* Top Actions */}
                        <View style={[styles.topActions, { paddingTop: insets.top + 10 }]}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleBack}>
                                <SvgImage
                                    source={{ default: BackIcon }}
                                    width={24}
                                    height={24}
                                    fill="#FFFFFF"
                                />
                            </TouchableOpacity>

                        </View>

                        {/* Restaurant Info */}
                        <View style={styles.restaurantInfo}>
                            <Text style={styles.restaurantName}>{RESTAURANT_DATA.name}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                {/* bosluq ucun  */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'interior' && styles.activeTab]}
                        onPress={() => setActiveTab('interior')}
                    >
                        <Text style={[styles.tabText, activeTab === 'interior' && styles.activeTabText]}>
                            İnteryer
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                        onPress={() => setActiveTab('info')}
                    >
                        <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
                            Haqqında
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'location' && styles.activeTab]}
                        onPress={() => setActiveTab('location')}
                    >
                        <Text style={[styles.tabText, activeTab === 'location' && styles.activeTabText]}>
                            Məkan
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
                        onPress={() => setActiveTab('menu')}
                    >
                        <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
                            Menyu
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {renderTabContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    fixedTopSpacer: {
        height: 25,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        width: width,
        height: height * 0.4,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'space-between',
    },
    topActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightActions: {
        flexDirection: 'row',
        gap: 12,
    },
    restaurantInfo: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: FONTS.PoppinsBold,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ratingText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    categoryText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontFamily: FONTS.PoppinsRegular,
        opacity: 0.9,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontFamily: FONTS.PoppinsRegular,
        color: '#8E8E93',
    },
    activeTabText: {
        color: COLORS.primary,
        fontFamily: FONTS.PoppinsSemiBold,
    },
    tabContent: {
        paddingBottom: 40,
    },
    menuTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
    },

    // Interior Tab
    interiorContent: {
        padding: 8,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    interiorImageContainer: {
        width: (width - 24) / 2,
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageLeft: {
        marginRight: 4,
    },
    imageRight: {
        marginLeft: 4,
    },
    interiorImage: {
        width: '100%',
        height: '100%',
    },
    // Info Tab
    infoSection: {
        paddingHorizontal: 15,
        paddingVertical: 13,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: "#252422",
        fontFamily: FONTS.PoppinsRegular,
        marginBottom: 8,
        textDecorationLine: 'underline',
    },
    infoText: {
        fontSize: 14,
        color: '#666666',
        fontFamily: FONTS.PoppinsRegular,
        lineHeight: 22,
    },
    phoneText: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    // Location Tab
    mapContainer: {
        width: width - 40,
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginTop: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.text,
        fontFamily: FONTS.PoppinsRegular,
        textAlign: 'center',
    },
    addressText: {
        fontSize: 14,
        color: '#666666',
        fontFamily: FONTS.PoppinsRegular,
    },
    mapButton: {
        // marginHorizontal: 20,
        // marginTop: 10,
        // paddingVertical: 14,
        // backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    mapButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D2691E',
        fontFamily: FONTS.PoppinsSemiBold,
    },
    // Menu Tab
    menuCategory: {
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    menuCategoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        fontFamily: FONTS.PoppinsBold,
        marginBottom: 10,
    },
    menuItem: {
        paddingVertical: 8,
    },
    menuItemText: {
        fontSize: 15,
        color: '#666666',
        fontFamily: FONTS.PoppinsRegular,
    },
});

export default RestaurantDetailScreen;
