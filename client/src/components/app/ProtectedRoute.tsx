import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from './LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if user has a valid token
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isLoading = false;

  if (isLoading) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

