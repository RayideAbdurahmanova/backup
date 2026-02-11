// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
    Platform,
    PermissionsAndroid,
    Alert,
    SafeAreaView,
    Dimensions,
} from 'react-native';

import MapView, { Region, Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';
import LocationIcon from '../../assets/svg/mainPage/location.svg';
import LinearGradient from 'react-native-linear-gradient';
import { ROUTES } from '@/navigation/routes';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { AzanStackParamList } from '../../navigation/Router';
import { apiService, getRestaurantNearbyResponse } from '../../api/services/apiService';
import { useLocation } from '@/context/LocationContext';


const { width, height } = Dimensions.get('window');


const DEFAULT_REGION: Region = {
    latitude: 40.4093, // Bakı fallback
    longitude: 49.8671,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};
const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavigationProp<AzanStackParamList>>();

    const [nearbyRestaurants, setNearbyRestaurants] = useState<getRestaurantNearbyResponse[]>([]);
    const [restaurantsLoading, setRestaurantsLoading] = useState(false);

    const { location, refreshLocation } = useLocation();


    // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const mapRef = useRef<MapView>(null);

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



    const fetchNearbyRestaurants = async (
        latitude: number,
        longitude: number
    ) => {
        try {
            setRestaurantsLoading(true);

            const res = await apiService.getRestaurantNearby(
                latitude,
                longitude,
                10
            );
            setNearbyRestaurants(res);
        } catch (e) {
            console.log('❌ Nearby Restaurants Error:', e);
        } finally {
            setRestaurantsLoading(false);
        }
    }

    useEffect(() => {
        if (location?.latitude && location?.longitude) {
            fetchNearbyRestaurants(location.latitude, location.longitude);
        }
    }, [location]);

    const getImageSource = (url) => {
        if (url && url.startsWith('http')) {
            return { uri: url };
        }
        return require('../../assets/images/restaurant_placeholder.png');
    };


    const popularMenus = [
        {
            id: '1',
            restaurant: 'ABAKUZ Restoran',
            price: '14.99',
            image: 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg',
        },
        {
            id: '2',
            restaurant: 'ABAKUZ Restoran',
            price: '14.99',
            image: 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={Platform.OS === 'android'}
            />

            {/* Map Section */}
            <View style={[styles.mapContainer, { paddingTop: insets.top }]}>
                {location && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        ref={mapRef}
                        style={StyleSheet.absoluteFillObject}
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
                        onMapReady={() => console.log('✅ Map loaded successfully!')}
                        onError={(e) => console.log('❌ Map Error:', e.nativeEvent)}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title="Mənim yerləşməm"
                        />
                        {nearbyRestaurants.map((restaurant) => (
                            <Marker
                                key={restaurant.id}
                                coordinate={{
                                    latitude: restaurant.latitude,
                                    longitude: restaurant.longitude,
                                }}
                            >
                                <View style={styles.markerWrapper}>
                                    <Image
                                        source={require('../../assets/images/restaurant_marker.png')}
                                        style={styles.markerImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            </Marker>
                        ))}

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

            {/* Overlapping Scrollable Content */}
            <View style={styles.mapSpacer} />
            <ScrollView
                style={styles.scrollableContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >

                {/* Promo Banner */}
                <TouchableOpacity
                    onPress={() => navigation.navigate(ROUTES.AZAN_STACK.RESTAURANTS_DETAIL)}
                    style={styles.promoWrapper}
                >
                    <Image
                        source={require('../../assets/images/steak.png')}
                        style={styles.promoImage}
                        resizeMode="contain"
                    />

                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.AZAN_STACK.RESTAURANTS_DETAIL)}
                        style={styles.promoButton}
                    >
                        <Text style={styles.promoButtonText}>Tanış ol</Text>
                    </TouchableOpacity>
                </TouchableOpacity>


                {/* Nearby Restaurants */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Yaxınlıqdakı Restoranlar</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {nearbyRestaurants.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.restaurantCard}
                                onPress={() =>
                                    navigation.navigate(
                                        ROUTES.AZAN_STACK.RESTAURANTS_DETAIL,
                                        { id: item.id }
                                    )
                                }
                            >
                                <Image
                                    source={getImageSource(item.coverImageUrl)}
                                    style={styles.restaurantLogo}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}

                        {!restaurantsLoading && nearbyRestaurants.length === 0 && (
                            <Text style={{ marginLeft: 16, color: '#999' }}>
                                Yaxınlıqda restoran tapılmadı
                            </Text>
                        )}
                    </ScrollView>

                </View>

                {/* Popular Restaurants */}
                {/* Popular Iftar Menus */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Populyar iftar Menyuları</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {popularMenus.map(item => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(ROUTES.AZAN_STACK.RESTAURANTS_DETAIL, {
                                    id: item.id
                                })}
                                key={item.id}
                                style={styles.menuCard}
                                activeOpacity={0.9}>

                                {/* Image */}
                                <Image
                                    source={getImageSource(item.image)}
                                    style={styles.menuImage}
                                    resizeMode="cover"
                                />

                                {/* Gradient overlay */}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.menuGradient}
                                />

                                {/* Text content */}
                                <View style={styles.menuInfo}>
                                    <Text style={styles.restaurantName}>{item.restaurant}</Text>
                                    <Text style={styles.menuPrice}>{item.price} AZN</Text>
                                </View>

                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </SafeAreaView >

    );
};

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
    scrollableContent: {
        flex: 1,
        // marginTop: -25,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
    },
    scrollContentContainer: {
        paddingBottom: 40,
    },
    markerWrapper: {
        // backgroundColor: '#fff',
        // padding: 6,
        borderRadius: 20,
        // elevation: 4,
        // shadowColor: '#000',
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // shadowOffset: { width: 0, height: 2 },
    },
    markerImage: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
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
    FileReader: {
        marginBottom: 20,
    },

    promoWrapper: {
        width: '94%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        // backgroundColor: '#0000',
        alignSelf: 'center',
        marginHorizontal: 16,
    },

    promoImage: {
        width: '100%',
        height: "100%",
    },

    promoButton: {
        position: 'absolute',
        bottom: 23,
        left: 25,
        backgroundColor: COLORS.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    promoButtonText: {
        color: COLORS.text,
        fontWeight: '600',
    },
    restaurantCard: {
        width: 110,
        height: 90,
        backgroundColor: '#0000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    restaurantLogo: {
        width: 110,
        height: 90,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
    },

    section: {
        marginTop: 28,
        paddingLeft: 16,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2F3E2E',
        marginBottom: 14,
    },

    menuCard: {
        width: 260,
        height: 170,
        borderRadius: 16,
        marginRight: 14,
        overflow: 'hidden',
        backgroundColor: '#EEE',
    },

    menuImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },

    menuGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
    },

    menuInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    restaurantName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },

    menuPrice: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },




});

export default HomeScreen;