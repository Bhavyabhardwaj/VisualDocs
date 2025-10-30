/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      console.log('🔐 AuthContext: Checking for token on mount:', token ? 'Found' : 'Not found');
      
      if (token) {
        try {
          console.log('🔐 AuthContext: Fetching user profile...');
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            console.log('✅ AuthContext: User loaded successfully:', response.data.email);
            setUser(response.data);
          } else {
            // Invalid token, clear it
            console.warn('⚠️ AuthContext: Invalid token, clearing...');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('❌ AuthContext: Failed to load user:', error);
          // Don't clear token on network errors - keep user logged in
          // Only clear on 401 unauthorized
          const isUnauthorized = error && typeof error === 'object' && 'response' in error && 
                                (error as any).response?.status === 401;
          if (isUnauthorized) {
            console.warn('⚠️ AuthContext: Unauthorized (401), clearing token');
            localStorage.removeItem('authToken');
            setUser(null);
          } else {
            console.warn('⚠️ AuthContext: Network error, keeping token for now');
            // Set a minimal user object to keep authenticated state
            setUser({ id: 'temp', email: 'loading...', name: 'Loading...' } as User);
          }
        }
      } else {
        console.log('ℹ️ AuthContext: No token found, user not authenticated');
        setUser(null);
      }
      
      setIsLoading(false);
      console.log('✅ AuthContext: Initial load complete');
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 AuthContext: Attempting login for:', email);
      const response = await authApi.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        console.log('✅ AuthContext: Login successful, setting user:', userData.email);
        console.log('✅ AuthContext: Token received:', token ? 'Yes' : 'No');
        
        // Token is already saved in authService.login
        setUser(userData);
        console.log('✅ AuthContext: User state updated');
      } else {
        console.error('❌ AuthContext: Login failed:', response.error);
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 AuthContext: Attempting registration for:', email);
      const response = await authApi.register({ email, password, name });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        console.log('✅ AuthContext: Registration successful, setting user:', userData.email);
        
        // Token is already saved in authService.register
        setUser(userData);
      } else {
        console.error('❌ AuthContext: Registration failed:', response.error);
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const response = await authApi.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
