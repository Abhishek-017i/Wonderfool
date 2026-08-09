import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import api from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  firebaseUser: User | null;
  isAuthLoading: boolean;
  login: (redirectUrl?: string) => void;
  logout: () => Promise<void>;
  reloadAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage on initial mount
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
    
    // Listen for Firebase auth state changes — this fires on initial load
    // AND on login/logout, ensuring both auth systems stay in sync.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // If not verified, try to reload once in case they verified in another tab
        if (!user.emailVerified) {
          try {
            await user.reload();
          } catch (error) {
            console.error('Failed to reload user:', error);
          }
        }
        setIsEmailVerified(auth.currentUser?.emailVerified || false);

        // Firebase has a valid session
        const storeUser = useAuthStore.getState().user;

        if (!storeUser || !storeUser._id) {
          // authStore is stale/empty — rehydrate from backend
          try {
            const token = await user.getIdToken();
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
        setIsEmailVerified(false);
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
    // Refresh Firebase user to pick up email verification status if needed
    if (auth.currentUser) {
      auth.currentUser.reload().then(() => {
        setIsEmailVerified(auth.currentUser?.emailVerified || false);
      }).catch(console.error);
    }
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true });
    }
  };

  const reloadAuth = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        setIsEmailVerified(auth.currentUser.emailVerified);
      } catch (error) {
        console.error('Error reloading user auth:', error);
      }
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
    <AuthContext.Provider value={{ isAuthenticated, isEmailVerified, firebaseUser, isAuthLoading, login, logout, reloadAuth }}>
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