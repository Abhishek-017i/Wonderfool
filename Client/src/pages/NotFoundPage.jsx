import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const animationClass = prefersReducedMotion ? '' : 'fade-in slide-up';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className={`flex flex-col items-center gap-6 md:gap-8 ${animationClass}`}>
          {/* 404 Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-card text-xs tracking-wide text-muted-foreground">
            404 Error
          </div>

          {/* Illustration - Broken Manga Panel */}
          <svg
            className="w-40 h-40 md:w-48 md:h-48 text-muted-foreground mb-2"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Outer panel frame */}
            <rect x="30" y="30" width="140" height="140" rx="8" />
            
            {/* Diagonal crack line */}
            <line x1="50" y1="60" x2="150" y2="140" />
            
            {/* Cross-hatch texture near crack */}
            <line x1="130" y1="115" x2="140" y2="125" />
            <line x1="135" y1="115" x2="145" y2="125" />
            <line x1="125" y1="115" x2="135" y2="125" />
            <line x1="130" y1="120" x2="140" y2="130" />
            <line x1="135" y1="120" x2="145" y2="130" />
            <line x1="125" y1="120" x2="135" y2="130" />
            
            {/* Smaller accent details */}
            <circle cx="90" cy="90" r="3" />
            <circle cx="85" cy="85" r="2" />
          </svg>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            The page wandered off.
          </h1>

          {/* Description */}
          <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            The page you&apos;re looking for doesn&apos;t exist, may have been moved, or the link is incorrect. Let&apos;s get you back to exploring your favorite series.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/">
              <button className="w-full sm:w-auto px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Return Home
              </button>
            </Link>
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto px-6 py-2 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-card/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
