import { clearAuthSession, saveAuthSession } from '@/lib/storage';
import type { AuthSession, SignInPayload, SignUpPayload, UserResponse } from '@/types/auth';
import apiClient from './client';

export const AuthService = {
  async signIn(payload: SignInPayload): Promise<AuthSession> {
    const response = await apiClient.post<AuthSession>('/auth/signin', payload);
    saveAuthSession(response.data);
    return response.data;
  },

  async signUp(payload: SignUpPayload): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/auth/signup', payload);
    return response.data;
  },

  signOut(): void {
    clearAuthSession();
  },
};
