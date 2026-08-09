import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SpellLoader from '../ui/SpellLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  // Wait for Firebase auth state to resolve before deciding
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SpellLoader size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    let message = 'You need to login to access this page';
    if (location.pathname === '/timeline') {
      message = 'Need to login to access timeline';
    }
    return <Navigate to="/login" state={{ from: location, message }} replace />;
  }

  return <>{children}</>;
}

