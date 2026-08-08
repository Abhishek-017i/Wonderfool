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
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Wishlist from './pages/Wishlist';
import NotFoundPage from './pages/NotFoundPage';
import SeriesDetail from './pages/SeriesDetail';
import ArticleEditor from './pages/ArticleEditor';
import ArticleDetail from './pages/ArticleDetail';
import SupportPage from './pages/SupportPage';
import BackToTopButton from './components/browse/BackToTopButton';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

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
        <NonNavbarScrollToTop />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

//export default App;
export default App
