import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedHeroRatingProps {
  rating: number
  className?: string
  starSize?: number
  showLabel?: boolean
}

export default function AnimatedHeroRating({ rating, className = "", starSize = 24, showLabel = true }: AnimatedHeroRatingProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Format to 1 decimal place
  const formattedTarget = Number(rating.toFixed(1))

  useEffect(() => {
    let start = 0
    const duration = 1500 // 1.5 seconds
    const interval = 20
    const steps = duration / interval
    const increment = formattedTarget / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= formattedTarget) {
        setDisplayValue(formattedTarget)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [formattedTarget])

  // Get label based on score
  let label = "Unrated"
  if (rating >= 9) label = "Masterpiece"
  else if (rating >= 8) label = "Excellent"
  else if (rating >= 7) label = "Great"
  else if (rating >= 5) label = "Average"
  else if (rating > 0) label = "Poor"

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-br from-[#f9db79] via-[#d4af37] to-[#a67c00] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          {displayValue.toFixed(1)}
        </motion.span>
      </div>
      
      <div className="flex items-center gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const scaledVal = Math.round(rating / 2)
          return (
            <svg 
              key={star}
              width={starSize} 
              height={starSize} 
              viewBox="0 0 24 24" 
              fill={star <= scaledVal ? "url(#goldGradient)" : "none"}
              stroke={star <= scaledVal ? "none" : "currentColor"}
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={star <= scaledVal ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" : "text-muted-foreground/30"}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f9db79" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#a67c00" />
                </linearGradient>
              </defs>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )
        })}
      </div>

      {showLabel && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold text-[#d4af37] uppercase tracking-widest mt-2 opacity-90"
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
