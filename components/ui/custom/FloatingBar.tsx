'use client'

import React, { useState, useEffect } from 'react';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingBarProps {
  title: string;
  score: number;
}

const FloatingBar: React.FC<FloatingBarProps> = ({ title, score }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger at 400px down the page
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-full bg-card/95 backdrop-blur-md border-b border-[var(--border)] shadow-md z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-4 min-w-0">
          <h2 className="text-lg font-bold text-foreground truncate">{title}</h2>
          <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--accent)] px-2 py-1 bg-muted rounded-md border border-[var(--border)]">
            <Star className="size-3.5 fill-current" /> {score.toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Button size="sm" className="bg-[var(--primary)] text-[var(--text)] hover:bg-[var(--primary-light)] font-bold border-none shadow-sm">
            <Plus className="size-4 mr-1" /> Add to Timeline
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FloatingBar;