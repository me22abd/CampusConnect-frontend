import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';
import { getAuthToken } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string, dateOfBirth?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Auth Store (Zustand)
 * Manages authentication state globally
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string, dateOfBirth?: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.register({ email, password, name, dateOfBirth });
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  initialize: async () => {
    const token = await getAuthToken();
    if (token) {
      await get().loadUser();
    } else {
      set({ isLoading: false });
    }
  },
}));

