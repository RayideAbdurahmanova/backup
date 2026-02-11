// API Client Configuration
export { default as apiClient, API_CONFIG } from './config';

// API Service with all types
export * from './services/apiService';
export const handleApiError = (error: any): string => {
    if (error.response) {
        // Server responded with error
        return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
        // Request made but no response
        return 'No response from server. Please check your connection.';
    } else {
        // Error setting up request
        return error.message || 'An unexpected error occurred';
    }
};

export const isNetworkError = (error: any): boolean => {
    return error.code === 'ECONNABORTED' || error.message === 'Network Error';
};
