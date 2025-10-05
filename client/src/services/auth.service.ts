import { apiClient } from '@/lib/api-client';
import type {
  User,
  UserStats,
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  UpdateProfileInput,
  ApiResponse,
} from '@/types/api';

export const authService = {
  // Authentication
  async login(data: LoginInput): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/api/auth/login', data);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  async register(data: RegisterInput): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/api/auth/register', data);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/api/auth/logout');
    localStorage.removeItem('token');
    return response;
  },

  // Profile Management
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>('/api/auth/profile');
  },

  async updateProfile(data: UpdateProfileInput): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>('/api/auth/profile', data);
  },

  async changePassword(data: ChangePasswordInput): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/api/auth/change-password', data);
  },

  // User Stats
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return apiClient.get<ApiResponse<UserStats>>('/api/auth/stats');
  },

  // Account Management
  async deactivateAccount(): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>('/api/auth/account');
  },
};
