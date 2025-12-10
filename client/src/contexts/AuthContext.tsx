/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  handleOAuthToken: (token: string, userData?: any) => Promise<void>;
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
  // Initialize hasToken from localStorage immediately to prevent flash
  const [hasToken, setHasToken] = useState(() => !!localStorage.getItem('authToken'));

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      console.log('🔐 AuthContext: Checking for token on mount:', token ? 'Found' : 'Not found');
      let finalTokenState = !!token;
      setHasToken(finalTokenState);
      console.log('🔐 AuthContext: Setting hasToken =', finalTokenState);
      
      if (token) {
        try {
          console.log('🔐 AuthContext: Fetching user profile...');
          const response = await authService.getProfile();
          console.log('📦 AuthContext: Full profile response:', response);
          console.log('📦 AuthContext: response.data:', response.data);
          console.log('📦 AuthContext: response.data type:', typeof response.data);
          
          if (response.success && response.data) {
            // Check if user data is nested
            const userData = (response.data as any).user || response.data;
            console.log('✅ AuthContext: Extracted user data:', userData);
            console.log('✅ AuthContext: User email:', userData?.email);
            console.log('✅ AuthContext: User name:', userData?.name);
            setUser(userData);
          } else {
            // Invalid token response, clear it
            console.warn('⚠️ AuthContext: Invalid token response, clearing...');
            localStorage.removeItem('authToken');
            finalTokenState = false;
            setHasToken(false);
            setUser(null);
          }
        } catch (error) {
          console.error('❌ AuthContext: Failed to load user:', error);
          // Check if it's a 401 Unauthorized error
          const isUnauthorized = error && typeof error === 'object' && 'response' in error && 
                                (error as any).response?.status === 401;
          if (isUnauthorized) {
            console.warn('⚠️ AuthContext: Unauthorized (401), clearing token');
            localStorage.removeItem('authToken');
            finalTokenState = false;
            setHasToken(false);
            setUser(null);
          } else {
            // Network error - keep token and stay authenticated
            console.warn('⚠️ AuthContext: Network/Server error, keeping authenticated with token');
            // Keep hasToken true so user stays authenticated
            // User will be null but isAuthenticated will be true based on token
          }
        }
      } else {
        console.log('ℹ️ AuthContext: No token found, user not authenticated');
        setUser(null);
      }
      
      setIsLoading(false);
      console.log('✅ AuthContext: Initial load complete - isAuthenticated will be:', finalTokenState);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 AuthContext: Attempting login for:', email);
      const response = await authService.login({ email, password });
      
      console.log('🔐 AuthContext: Full response:', response);
      console.log('🔐 AuthContext: response.success:', response.success);
      console.log('🔐 AuthContext: response.data:', response.data);
      
      if (response.success && response.data) {
        // apiClient returns the full response: { success, data: { user, token }, timestamp, message }
        // So user is at response.data.user
        const userData = (response.data as any)?.user;
        
        console.log('✅ AuthContext: Login successful, setting user:', userData?.email);
        const savedToken = localStorage.getItem('authToken');
        console.log('✅ AuthContext: Verifying token in localStorage:', savedToken ? 'Found' : 'Not found');
        
        if (!savedToken) {
          console.error('❌ AuthContext: Token not saved!');
          throw new Error('Authentication token was not saved');
        }
        
        // Token is already saved in authService.login
        setHasToken(true);
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
      const response = await authService.register({ email, password, name });
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        console.log('✅ AuthContext: Registration successful, setting user:', userData.email);
        const savedToken = localStorage.getItem('authToken');
        console.log('✅ AuthContext: Verifying token in localStorage:', savedToken ? 'Found' : 'Not found');
        
        // Token is already saved in authService.register
        setHasToken(!!savedToken);
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
    console.log('🚪 AuthContext: Logout called');
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      console.log('🚪 AuthContext: Removing token from localStorage');
      localStorage.removeItem('authToken');
      setHasToken(false);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      const response = await authService.updateProfile(data);
      
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
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        const userData = (response.data as any).user || response.data;
        setUser(userData);
        setHasToken(true);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  }, []);

  // Handle OAuth token from callback
  const handleOAuthToken = useCallback(async (token: string, userData?: any) => {
    try {
      console.log('🔐 AuthContext: Handling OAuth token...');
      
      // Store the token
      localStorage.setItem('authToken', token);
      setHasToken(true);
      
      // If user data was provided, use it directly
      if (userData) {
        console.log('✅ AuthContext: Setting user from OAuth data:', userData);
        setUser(userData);
      } else {
        // Otherwise, fetch the user profile
        console.log('🔐 AuthContext: Fetching user profile with OAuth token...');
        await refreshUser();
      }
      
      console.log('✅ AuthContext: OAuth login complete');
    } catch (error) {
      console.error('❌ AuthContext: OAuth token handling error:', error);
      throw error;
    }
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    isAuthenticated: hasToken, // Based on token existence, not user object
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    handleOAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
