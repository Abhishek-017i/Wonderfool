import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full aspect-[3/4] rounded-2xl border border-[var(--border)] bg-card overflow-hidden relative shadow-sm">
      {/* Core pulse background */}
      <div className="w-full h-full bg-[var(--secondary)] opacity-10 animate-pulse"></div>
      
      {/* Format Badge Skeleton */}
      <div className="absolute top-3 left-3 w-16 h-6 rounded-full bg-[var(--primary-dark)] opacity-20 animate-pulse"></div>

      {/* Slide-Up Info Box Skeleton (Always visible in loading state) */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-card border-t border-[var(--border)]">
        {/* Title line */}
        <div className="w-3/4 h-5 bg-[var(--primary-dark)] opacity-20 rounded animate-pulse mb-3"></div>
        {/* Call to action button skeleton */}
        <div className="w-full h-9 bg-[var(--primary)] opacity-30 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;