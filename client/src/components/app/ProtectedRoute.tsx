import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoading } from './LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔒 ProtectedRoute state:', { isAuthenticated, isLoading, path: location.pathname });

  // Still loading authentication state
  if (isLoading) {
    return <PageLoading message="Checking authentication..." />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render children
  console.log('✅ Authenticated, rendering protected content');
  return <>{children}</>;
};

