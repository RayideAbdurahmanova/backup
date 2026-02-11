import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';
import apiClient from '../config';
import { ApiResponse } from '../types';
import { create } from 'react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload';

export const BASE_URL = 'http://94.20.154.237:8080';

export type Language = 'az' | 'en' | 'ru';


//restaurant-controller

export type getRestaurantByIDResponse = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    coverImageUrl: string;
    active: boolean;
}

export type UpdateRestaurantsByIDBody = {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    coverImageUrl?: string;
    isActive?: boolean;
}
export type UpdateRestaurantsByIDResponse = {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    coverImageUrl?: string;
    isActive?: boolean;
};

export type CreateRestaurantsBody = {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    coverImageUrl?: string;
    isActive?: boolean;
};

export type CreateRestaurantsResponse = ApiResponse<null>;

export type getRestaurantsMenusByIDResponse = {
    id: number,
    restaurantId: {
        id: number,
        name: string,
        address: string,
        latitude: number,
        longitude: number,
        phone: string,
        coverImageUrl: string,
        active: boolean
    },
    title: string,
    description: string,
    price: number,
    imageUrlsJson: string,
    isActive: boolean
}

export type getRestaurantNearbyResponse = {
    id: number,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    phone: string,
    coverImageUrl: string,
    active: boolean
}


//content-controller
export type CreateContentBody = {
    date: string,
    ayahText: string,
    ayahSource: string,
    duaText: string,
    duaSource: string
}

export type CreateContentResponse = {
    id: number,
    date: string,
    ayahText: string,
    ayahSource: string,
    duaText: string,
    duaSource: string
};

export type UpdateContentBody = {
    date: string,
    ayahText: string,
    ayahSource: string,
    duaText: string,
    duaSource: string
};

export type UpdateContentResponse = {
    id: number,
    date: string,
    ayahText: string,
    ayahSource: string,
    duaText: string,
    duaSource: string
};

//prayer-controller
export type getPrayerTimesResponse = {
    city: string;
    date: string;
    imsak: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
}

export type getRamadanDayResponse = {
    message: string,
}

export type getPrayerCountDown = ApiResponse<null>

// Error Response
export type ApiError = {
    message: string;
    status: number;
    errors?: {
        field?: string;
        message: string;
    }[];
    timestamp?: string;
    path?: string;
};

export type ApiResponse<T> = {
    code: string | number;
    response: T;
    message: string;
    status: string;
};

export const apiService = {
    async getRestaurantbyID(
        id: number,
    ): Promise<getRestaurantByIDResponse> {
        const { data } = await apiClient.get(`/api/v1/restaurants/${id}`
        );
        return data;
    },

    async updateRestaurantByID(
        id: number,
        body: UpdateRestaurantsByIDBody,
    ): Promise<UpdateRestaurantsByIDResponse> {
        const { data } = await apiClient.put(`/api/v1/restaurants/${id}`, body
        );
        return data as UpdateRestaurantsByIDResponse;
    },

    async deleteRestaurantByID(
        id: number,
    ): Promise<void> {
        await apiClient.delete(`/api/v1/restaurants/${id}`);
    },

    async createRestaurant(
        body: CreateRestaurantsBody,
    ): Promise<CreateRestaurantsResponse> {
        const { data } = await apiClient.post(`/api/v1/restaurants`, body
        );
        return data as CreateRestaurantsResponse;
    },

    async getRestaurantsMenusByID(
        id: number,
    ): Promise<getRestaurantsMenusByIDResponse[]> {
        const { data } = await apiClient.get(`/api/v1/restaurants/${id}/menus`
        );
        return data as getRestaurantsMenusByIDResponse[];
    },

    async getRestaurantNearby(
        lat: number,
        lng: number,
        radiusKm: number,
    ): Promise<getRestaurantNearbyResponse[]> {
        const { data } = await apiClient.get(`/api/v1/restaurants/nearby`, {
            params: {
                lat,
                lng,
                radiusKm
            }
        });
        return data as getRestaurantNearbyResponse[];
    },

    //content-controller

    async updateContentbyID(
        id: number,
        body: UpdateContentBody,
    ): Promise<UpdateContentResponse> {
        const { data } = await apiClient.put(`/api/v1/contents/${id}`, body
        );
        return data as UpdateContentResponse;
    },

    async deleteContentByID(
        id: number,
    ): Promise<void> {
        await apiClient.delete(`/api/v1/contents/${id}`);
    },

    async getContent(
        date: string,
    ): Promise<UpdateContentResponse> {
        const { data } = await apiClient.get(`/api/v1/content`, {
            params: {
                date
            }
        }
        );
        return data as UpdateContentResponse;
    },

    async createContent(
        body: CreateContentBody,
    ): Promise<CreateContentResponse> {
        const { data } = await apiClient.post(`/api/v1/content`, body
        );
        return data as CreateContentResponse;
    },

    async getTodaysContent(
    ): Promise<UpdateContentResponse> {
        const { data } = await apiClient.get(`/api/v1/content/today`
        );
        return data as UpdateContentResponse;
    },

    //prayer-control
    async getPrayerTimes(
        params: {
            lat: number,
            lng: number,
            city: string,
            date: string,
            tz: number,
            method: string,
        }): Promise<getPrayerTimesResponse> {
        const { data } = await apiClient.get(`/api/v1/prayer/times`, {
            params: { ...params }
        }
        );
        return data as getPrayerTimesResponse;
    },

    async getRamadanDay(
    ): Promise<getRamadanDayResponse> {
        const { data } = await apiClient.get(`/api/v1/prayer/ramadan-day`
        );
        return data as getRamadanDayResponse;
    },

    async getCountDown(
        lat: number,
        lng: number,
        city: string,
        date: string,
        tz: number,
        method: string,
    ): Promise<getPrayerCountDown> {
        const { data } = await apiClient.get(`/api/v1/prayer/countdown`, {
            params: { lat, lng, city, date, tz, method }
        }
        );
        return data as getPrayerCountDown;
    }

};

export default apiService;
