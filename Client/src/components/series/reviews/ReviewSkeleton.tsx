import { motion } from 'framer-motion'

export default function ReviewSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-card/30 backdrop-blur-sm border-b border-border/20 p-5 w-full flex gap-4 animate-pulse"
    >
      {/* Avatar Skeleton */}
      <div className="shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full bg-muted/60"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <div className="h-4 w-32 bg-muted/60 rounded-md"></div>
            <div className="h-3 w-16 bg-muted/40 rounded-md"></div>
          </div>
          <div className="h-4 w-4 bg-muted/40 rounded-full"></div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-muted/40"></div>
          ))}
        </div>

        {/* Text Body */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted/40 rounded-md"></div>
          <div className="h-3 w-[90%] bg-muted/40 rounded-md"></div>
          <div className="h-3 w-[70%] bg-muted/40 rounded-md"></div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-6 pt-2">
          <div className="h-4 w-12 bg-muted/40 rounded-md"></div>
          <div className="h-4 w-16 bg-muted/40 rounded-md"></div>
          <div className="h-4 w-16 bg-muted/40 rounded-md"></div>
        </div>
      </div>
    </motion.div>
  )
}
