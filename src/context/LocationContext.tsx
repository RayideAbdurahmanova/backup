import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

// Initialize Geocoder
Geocoder.init('AIzaSyCX3VaxIJb7LbLlXF6ggA8ES7KuEuMAV3w', { language: 'az' });

interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
}

interface LocationContextType {
    location: LocationData | null;
    loading: boolean;
    error: string | null;
    refreshLocation: () => Promise<void>;
}

const DEFAULT_LOCATION: LocationData = {
    latitude: 40.4093, // Bakı fallback
    longitude: 49.8671,
    city: 'Bakı',
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

interface LocationProviderProps {
    children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCityFromCoords = async (latitude: number, longitude: number): Promise<string> => {
        try {
            const geo = await Geocoder.from(latitude, longitude);
            const address = geo.results[0]?.address_components;

            if (address) {
                const cityName =
                    address.find(c => c.types.includes('locality'))?.long_name ||
                    address.find(c => c.types.includes('administrative_area_level_2'))?.long_name ||
                    address.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
                return cityName || 'Location';
            }
            return 'Unknown location'; 
        } catch (e) {
            // Geocoding failed - API key issue or network error
            // Return a fallback based on approximate coordinates
            console.log('Geocoder error - using coordinate-based fallback:', e);

            // Simple coordinate-based city detection for Azerbaijan
            if (latitude >= 40.3 && latitude <= 40.5 && longitude >= 49.7 && longitude <= 50) {
                return 'Bakı'; // Baku region
            } else if (latitude >= 40.3 && latitude <= 40.6 && longitude >= 49.5 && longitude <= 50.2) {
                return 'Abşeron'; // Absheron peninsula
            }

            return 'Unknown location';  // Generic fallback
        }
    };

    const fetchLocation = useCallback(async () => {
        setLoading(true);
        setError(null);

        // Request permission on Android
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    setError('Location permission denied');
                    setLocation(DEFAULT_LOCATION);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log('Permission error:', err);
                setError('Permission error');
                setLocation(DEFAULT_LOCATION);
                setLoading(false);
                return;
            }
        }

        // Get current position - start with lower accuracy for faster results
        Geolocation.getCurrentPosition(
            async ({ coords }) => {
                const city = await getCityFromCoords(coords.latitude, coords.longitude);
                setLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    city,
                });
                setLoading(false);
            },
            (posError) => {
                console.log('Location request failed:', posError.message);
                // Use default location if GPS fails completely
                setError('Could not determine location');
                setLocation(DEFAULT_LOCATION);
                setLoading(false);
            },
            {
                enableHighAccuracy: false, // Start with lower accuracy for faster response
                timeout: 15000, // 15 seconds timeout
                maximumAge: 60000, // Accept cached location up to 1 minute old
            }
        );
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const value: LocationContextType = useMemo(() => ({
        location,
        loading,
        error,
        refreshLocation: fetchLocation,
    }), [location, loading, error, fetchLocation]);

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
