import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // For cookies/sessions
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log('🚨 API Client: Received 401 Unauthorized');
          console.log('🚨 URL:', error.config?.url);
          console.log('🚨 Current path:', window.location.pathname);
          
          const currentPath = window.location.pathname;
          // Only clear token and redirect if:
          // 1. We're not on login/register pages
          // 2. We actually have a token (otherwise it's expected 401)
          const hasToken = !!localStorage.getItem('token');
          
          if (!currentPath.includes('/login') && !currentPath.includes('/register') && hasToken) {
            console.log('🚨 API Client: Clearing token and redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else {
            console.log('🚨 API Client: 401 but not clearing token (on auth page or no token)');
          }
        }
        
        // Extract error message from response
        const errorMessage = error.response?.data?.error 
          || error.response?.data?.message 
          || error.message 
          || 'An unexpected error occurred';
        
        // Attach formatted error for easier handling
        error.userMessage = errorMessage;
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
