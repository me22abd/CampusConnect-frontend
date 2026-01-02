import apiClient from './api';
import { setAuthToken, removeAuthToken } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

/**
 * Authentication Service
 * Handles all authentication API calls
 */

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    await setAuthToken(response.data.token);
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    await setAuthToken(response.data.token);
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await removeAuthToken();
  },
};

