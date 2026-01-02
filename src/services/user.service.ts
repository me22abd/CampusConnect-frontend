import apiClient from './api';
import { User } from '../types';

/**
 * User Service
 * Handles user-related API calls
 */

export const userService = {
  /**
   * Get discoverable users
   * 
   * Backend endpoint: GET /api/users/discover
   * Returns: { users: User[] }
   * 
   * Users returned include: id, name, age, photos, university, location
   */
  async getDiscoverableUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ users: User[] }>('/users/discover');
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching discoverable users:', error);
      throw error; // Let the screen handle the error
    }
  },
};

