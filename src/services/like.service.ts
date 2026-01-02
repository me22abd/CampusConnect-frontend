import apiClient from './api';
import { LikeResponse, User } from '../types';

/**
 * Like Service
 * Handles like-related API calls
 */

export interface ReceivedLike {
  id: string;
  name?: string;
  profileImageUrl?: string;
  age?: number;
  university?: string;
  likedAt: string;
}

export const likeService = {
  /**
   * Like a user
   * POST /api/likes/:userId
   * 
   * Returns LikeResponse which may include match information
   */
  async likeUser(userId: string): Promise<LikeResponse> {
    const response = await apiClient.post<LikeResponse>(`/likes/${userId}`);
    return response.data;
  },

  /**
   * Unlike a user
   * DELETE /api/likes/:userId
   */
  async unlikeUser(userId: string): Promise<void> {
    await apiClient.delete(`/likes/${userId}`);
  },

  /**
   * Get received likes (users who liked the current user)
   * GET /api/likes/received
   * 
   * Returns array of users who have liked the current user
   */
  async getReceivedLikes(): Promise<ReceivedLike[]> {
    const response = await apiClient.get<{ likes: ReceivedLike[] }>('/likes/received');
    return response.data.likes || [];
  },
};

