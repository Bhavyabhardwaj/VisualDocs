import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from './LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // This would connect to your auth store/context
  const isAuthenticated = true; // Replace with actual auth state
  const isLoading = false; // Replace with actual loading state

  if (isLoading) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
