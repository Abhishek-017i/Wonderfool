import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Community from './pages/community';
import Login from './pages/login';
import Timeline from './pages/timeline';
import Creators from './pages/creator';
import CreatorProfile from './pages/CreatorProfile';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Wishlist from './pages/Wishlist';
import NotFoundPage from './pages/NotFoundPage';
import SeriesDetail from './pages/SeriesDetail';
import ArticleEditor from './pages/ArticleEditor';
import ArticleDetail from './pages/ArticleDetail';
import SupportPage from './pages/SupportPage';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import BackToTopButton from './components/browse/BackToTopButton';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

function EmailVerificationToast() {
  const { isAuthenticated, isEmailVerified } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isEmailVerified) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isEmailVerified]);

  if (!visible) return null;

  const handleResend = async () => {
    if (!auth.currentUser || sending) return;
    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setSent(true);
      setTimeout(() => setVisible(false), 3000);
    } catch (error) {
      console.error("Error sending verification email", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-card border border-border shadow-xl rounded-lg p-4 flex flex-col gap-3 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center justify-between gap-6">
        <h3 className="font-semibold text-foreground text-sm">Please verify your email</h3>
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
      </div>
      <p className="text-xs text-muted-foreground">Verify your email address to access all features.</p>
      <button 
        onClick={handleResend}
        disabled={sending || sent}
        className="w-full py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {sent ? 'Email Sent!' : sending ? 'Sending...' : 'Verify Now'}
      </button>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/browse" element={<PageTransition><Browse /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/series/:id" element={<PageTransition><SeriesDetail /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/creators" element={<PageTransition><Creators /></PageTransition>} />
        <Route path="/creator/:id" element={<PageTransition><CreatorProfile /></PageTransition>} />
        <Route path="/timeline" element={
          <ProtectedRoute>
            <PageTransition><Timeline /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/support" element={<PageTransition><SupportPage /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/articles/new" element={
          <ProtectedRoute><PageTransition><ArticleEditor /></PageTransition></ProtectedRoute>
        } />
        <Route path="/articles/:id" element={<PageTransition><ArticleDetail /></PageTransition>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><ProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <PageTransition><Wishlist /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function NonNavbarScrollToTop() {
  const location = useLocation()
  const navbarPaths = ['/', '/browse', '/community', '/creators', '/timeline']
  const isNonNavbarPage = !navbarPaths.includes(location.pathname)

  if (!isNonNavbarPage) return null
  return <BackToTopButton />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EmailVerificationToast />
        <NonNavbarScrollToTop />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App