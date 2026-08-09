// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/community" element={<Community />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creator/:id" element={<CreatorProfile />} />
          <Route path="/timeline" element={
            <ProtectedRoute>
              <Timeline />
            </ProtectedRoute>
          } />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/articles/new" element={
            <ProtectedRoute><ArticleEditor /></ProtectedRoute>
          } />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

//export default App;
export default App
