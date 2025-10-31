import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoading } from './LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  // Check localStorage directly as backup
  const token = localStorage.getItem('token');
  const hasLocalToken = !!token;

  console.log('🔒 ProtectedRoute DEBUG:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    hasToken: hasLocalToken,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
  });

  // Still loading authentication state
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return <PageLoading message="Checking authentication..." />;
  }

  // Check both AuthContext isAuthenticated AND localStorage token
  // This prevents redirect even if user object hasn't loaded yet
  const shouldAllowAccess = isAuthenticated || hasLocalToken;

  if (!shouldAllowAccess) {
    console.log('❌ ProtectedRoute: NOT AUTHENTICATED - Redirecting to login');
    console.log('   - Token exists?', hasLocalToken);
    console.log('   - isAuthenticated?', isAuthenticated);
    console.log('   - User exists?', !!user);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render children
  console.log('✅ ProtectedRoute: AUTHENTICATED - Rendering protected content');
  return <>{children}</>;
};

