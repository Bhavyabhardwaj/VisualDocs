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
    console.log('🚀 authService.login - Starting login request...');
    const response = await apiClient.post<ApiResponse<{ user: User; token: any }>>('/api/auth/login', data);
    
    console.log('� authService.login - Raw response:', response);
    console.log('� authService.login - response.data:', response.data);
    console.log('� authService.login - response.success:', response.success);
    
    // Check if response is successful
    if (!response.success) {
      console.error('❌ authService.login - Response not successful!');
      return response as any;
    }
    
    // Backend returns token as an object: { accessToken, refreshToken, expiresIn }
    // apiClient already extracts response.data from axios response
    // So we get { user, token } directly, NOT nested in response.data.data
    const tokenData = (response as any).token;
    console.log('🔑 authService.login - tokenData:', tokenData);
    console.log('🔑 authService.login - tokenData type:', typeof tokenData);
    
    if (tokenData) {
      // Handle both string token and object token
      let accessToken: string | null = null;
      
      if (typeof tokenData === 'string') {
        accessToken = tokenData;
        console.log('🔑 authService.login - Token is STRING:', accessToken.substring(0, 20) + '...');
      } else if (tokenData.accessToken) {
        accessToken = tokenData.accessToken;
        console.log('🔑 authService.login - Token is OBJECT with accessToken:', accessToken?.substring(0, 20) + '...');
      } else {
        console.error('❌ authService.login - Token object has no accessToken property!', tokenData);
      }
      
      if (accessToken) {
        console.log('💾 authService.login - Saving to localStorage...');
        localStorage.setItem('authToken', accessToken);
        
        const verified = localStorage.getItem('authToken');
        console.log('✅ authService.login - Saved and verified:', verified ? 'YES ✓' : 'NO ✗');
        console.log('✅ authService.login - Token length:', verified?.length);
      } else {
        console.error('❌ authService.login - No valid accessToken found!');
      }
    } else {
      console.error('❌ authService.login - No token in response.data!');
      console.error('❌ authService.login - Full response.data:', JSON.stringify(response.data, null, 2));
    }
    
    return response as any;
  },

  async register(data: RegisterInput): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<ApiResponse<{ user: User; token: any }>>('/api/auth/register', data);
    console.log('🔐 Register Response:', response);
    
    // apiClient already extracts response.data from axios response
    // So we get { user, token } directly, NOT nested in response.data.data
    const tokenData = (response as any).token;
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
