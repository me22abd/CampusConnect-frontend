/**
 * Type definitions for the app
 */

export interface User {
  id: string;
  email?: string; // Optional for discover responses
  name?: string;
  dateOfBirth?: string;
  age?: number;
  profileComplete?: boolean; // Optional for discover responses
  gender?: string;
  height?: string;
  education?: string;
  university?: string; // Frontend-safe field from discover endpoint
  location?: string;
  profileImageUrl?: string;
  photos?: string[];
  interests?: string[];
  prompts?: Array<{ question: string; answer: string; type: 'text' | 'voice' }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  dateOfBirth?: string;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export interface Match {
  id: string;
  user: {
    id: string;
    name?: string;
    profileImageUrl?: string;
    age?: number;
    university?: string;
    location?: string;
  };
  matchedAt: string;
}

export interface LikeResponse {
  message: string;
  like: Like;
  match?: Match;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

