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
} from 'react-native';

import MapView, { Region, Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { COLORS, FONTS } from '../../themes/styles';
import { SvgImage } from '../../components/svgImages/SvgImages';
import LocationIcon from '../../assets/svg/mainPage/location.svg';



const DEFAULT_REGION: Region = {
    latitude: 40.4093, // Bakı fallback
    longitude: 49.8671,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};
const HomeScreen = () => {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const mapRef = useRef<MapView>(null);
    const { t, i18n } = useTranslation();
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


            </ScrollView>
        </SafeAreaView>

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
});

export default HomeScreen;