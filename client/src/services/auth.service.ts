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
    console.log('🔐 authService.login - Full Response:', JSON.stringify(response, null, 2));
    console.log('🔐 authService.login - response.data:', response.data);
    console.log('🔐 authService.login - response.data?.token:', response.data?.token);
    
    // Backend returns token as an object: { accessToken, refreshToken, expiresIn }
    const tokenData = response.data?.token;
    if (tokenData) {
      const accessToken = typeof tokenData === 'string' ? tokenData : tokenData.accessToken;
      if (accessToken) {
        console.log('✅ authService.login - Saving accessToken to localStorage:', accessToken.substring(0, 20) + '...');
        localStorage.setItem('authToken', accessToken);
        const verified = localStorage.getItem('authToken');
        console.log('✅ authService.login - Token saved and verified:', verified ? 'YES ✓' : 'NO ✗');
      } else {
        console.error('❌ authService.login - No accessToken found in tokenData:', tokenData);
      }
    } else {
      console.error('❌ authService.login - No token in response.data!');
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
        localStorage.setItem('authToken', accessToken);
      }
    }
    return response as any;
  },

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/api/auth/logout');
    localStorage.removeItem('authToken');
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
