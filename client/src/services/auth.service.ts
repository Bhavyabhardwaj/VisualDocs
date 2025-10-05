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
    const response = await apiClient.post<ApiResponse<{ user: User; token: any }>>('/api/auth/login', data);
    console.log('🔐 Login Response:', response);
    
    // Backend returns token as an object: { accessToken, refreshToken, expiresIn }
    const tokenData = response.data?.token;
    if (tokenData) {
      const accessToken = typeof tokenData === 'string' ? tokenData : tokenData.accessToken;
      if (accessToken) {
        console.log('✅ Saving accessToken to localStorage:', accessToken);
        localStorage.setItem('token', accessToken);
        console.log('✅ Token saved. Verifying:', localStorage.getItem('token'));
      } else {
        console.error('❌ No accessToken found in response!', tokenData);
      }
    } else {
      console.error('❌ No token in response!');
    }
    return response as any;
  },

  async register(data: RegisterInput): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: any }>>('/api/auth/register', data);
    console.log('🔐 Register Response:', response);
    
    // Backend returns token as an object: { accessToken, refreshToken, expiresIn }
    const tokenData = response.data?.token;
    if (tokenData) {
      const accessToken = typeof tokenData === 'string' ? tokenData : tokenData.accessToken;
      if (accessToken) {
        console.log('✅ Saving accessToken to localStorage:', accessToken);
        localStorage.setItem('token', accessToken);
      }
    }
    return response as any;
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
