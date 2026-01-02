import apiClient from './api';
import { Match } from '../types';

/**
 * Match Service
 * Handles match-related API calls
 */

export const matchService = {
  /**
   * Get all matches for the current user
   * GET /api/matches
   * 
   * Returns array of matches with other user's information
   */
  async getMatches(): Promise<Match[]> {
    const response = await apiClient.get<{ matches: Match[] }>('/matches');
    return response.data.matches || [];
  },
};

