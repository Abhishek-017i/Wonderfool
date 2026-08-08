import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import api from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (redirectUrl?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for Firebase auth state changes — this fires on initial load
    // AND on login/logout, ensuring both auth systems stay in sync.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase has a valid session
        const storeUser = useAuthStore.getState().user;

        if (!storeUser || !storeUser._id) {
          // authStore is stale/empty — rehydrate from backend
          try {
            const token = await firebaseUser.getIdToken();
            const res = await api.post('/auth/sync', {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
            useAuthStore.getState().setUser(res.data, token);
          } catch (err) {
            console.error('Auth rehydration failed:', err);
            // If sync fails, clean up both systems to prevent half-auth state
            useAuthStore.getState().logout();
            localStorage.removeItem('isAuthenticated');
            setIsAuthenticated(false);
            setIsAuthLoading(false);
            return;
          }
        }

        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        // No Firebase session — clean up everything
        useAuthStore.getState().logout();
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (redirectUrl?: string) => {
    // The onAuthStateChanged listener above will handle syncing auth state.
    // This just handles the navigation redirect after LoginForm/SignUpForm
    // have already called setUser() and Firebase sign-in is complete.
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase signout error", err);
    }
    useAuthStore.getState().logout();
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
