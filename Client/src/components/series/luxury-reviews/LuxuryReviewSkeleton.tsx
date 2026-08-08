import { motion } from 'framer-motion'

export default function LuxuryReviewSkeleton() {
  return (
    <div className="relative w-full rounded-[32px] p-6 sm:p-8 bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] shadow-lg overflow-hidden animate-pulse">
      {/* Header Container */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 sm:gap-5 items-center w-full">
          {/* Avatar Skeleton */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 shrink-0" />

          <div className="flex flex-col gap-3 w-full">
            <div className="h-4 w-1/3 bg-white/5 rounded-full" />
            <div className="h-3 w-1/4 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Review Text Skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-4 w-[90%] bg-white/5 rounded-full" />
        <div className="h-4 w-[85%] bg-white/5 rounded-full" />
        <div className="h-4 w-[60%] bg-white/5 rounded-full" />
      </div>

      {/* Action Bar Skeleton */}
      <div className="pt-5 border-t border-white/[0.06] flex gap-3">
        <div className="h-9 w-24 bg-white/5 rounded-full" />
        <div className="h-9 w-20 bg-white/5 rounded-full" />
        <div className="h-9 w-9 bg-white/5 rounded-full" />
      </div>
      
      {/* Shimmer Overlay */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
      />
    </div>
  )
}
