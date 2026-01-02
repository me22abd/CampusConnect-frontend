import apiClient from './api';
import { Message } from '../types';

/**
 * Message Service
 * Handles message-related API calls
 */

export const messageService = {
  /**
   * Get messages for a match
   * GET /api/messages/:matchId
   * 
   * Returns array of messages ordered by createdAt ASC
   */
  async getMessages(matchId: string): Promise<Message[]> {
    const response = await apiClient.get<{ messages: Message[] }>(`/messages/${matchId}`);
    return response.data.messages || [];
  },

  /**
   * Send a message
   * POST /api/messages/:matchId
   * 
   * @param matchId - The match ID
   * @param content - The message content
   * @returns The created message
   */
  async sendMessage(matchId: string, content: string): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>(`/messages/${matchId}`, {
      content,
    });
    return response.data.message;
  },
};

