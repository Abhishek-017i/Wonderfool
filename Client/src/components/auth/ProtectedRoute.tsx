import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    let message = 'You need to login to access this page';
    if (location.pathname === '/timeline') {
      message = 'Need to login to access timeline';
    }
    return <Navigate to="/login" state={{ from: location, message }} replace />;
  }

  return <>{children}</>;
}
