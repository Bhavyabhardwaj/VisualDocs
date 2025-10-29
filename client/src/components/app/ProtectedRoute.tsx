import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from './LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token on mount and when location changes
    const token = localStorage.getItem('authToken');
    console.log('🔒 ProtectedRoute checking token:', token ? 'Found' : 'Not found');
    console.log('🔒 Current path:', location.pathname);
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  // Still loading/checking
  if (isAuthenticated === null) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

