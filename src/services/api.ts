import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * API Client Configuration
 * 
 * Environment-based API URL configuration:
 * 
 * Development:
 * - iOS Simulator: http://localhost:3000/api
 * - Android Emulator: http://10.0.2.2:3000/api
 * - Physical Device: http://YOUR_COMPUTER_IP:3000/api
 * 
 * Production:
 * - Set EXPO_PUBLIC_API_URL environment variable
 * - Or update the production URL below
 * 
 * To find your computer's IP:
 * - Mac/Linux: ifconfig | grep "inet "
 * - Windows: ipconfig
 */
const getApiBaseUrl = () => {
  // Production: Use environment variable or fallback
  if (!__DEV__) {
    // Check for Expo environment variable first
    const prodUrl = process.env.EXPO_PUBLIC_API_URL;
    if (prodUrl) {
      return prodUrl;
    }
    // Fallback: Update this with your production backend URL
    return 'https://your-backend-url.com/api';
  }

  // Development - adjust based on platform
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api'; // Android emulator
  }
  return 'http://localhost:3000/api'; // iOS simulator or web
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Token Management
 * Using expo-secure-store for secure token storage
 */
const TOKEN_KEY = 'auth_token';

export const setAuthToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  delete apiClient.defaults.headers.common['Authorization'];
};

// Initialize token on app start
getAuthToken().then((token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
});

/**
 * Request interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token
      removeAuthToken();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
