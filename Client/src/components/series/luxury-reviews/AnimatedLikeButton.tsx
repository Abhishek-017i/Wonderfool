import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'

interface AnimatedLikeButtonProps {
  isLiked: boolean
  onClick: () => void
  likeCount: number
  userId: string // Used for deterministic hash for the mock "Liked by X and Y others"
}

export default function AnimatedLikeButton({ isLiked, onClick, likeCount, userId }: AnimatedLikeButtonProps) {
  const [showParticles, setShowParticles] = useState(false)
  
  const handlePress = () => {
    if (!isLiked) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 1000)
    }
    onClick()
  }

  // Deterministic mock data generation
  const hash = Array.from(userId || 'default').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const names = ['Aryan', 'Sarah', 'Alex', 'David', 'Emma', 'John', 'Mia', 'Lucas']
  const randomName = names[hash % names.length]
  
  const displayString = likeCount > 2 
    ? `Liked by ${randomName} and ${likeCount - 1} others`
    : likeCount === 1 
      ? '1 Like' 
      : `${likeCount} Likes`

  return (
    <div className="relative">
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePress}
        className={`relative flex items-center gap-2 h-9 px-2 transition-colors overflow-hidden group
          ${isLiked 
            ? 'text-pink-500' 
            : 'text-muted-foreground hover:text-white'
          }
        `}
      >
        <motion.div
          initial={false}
          animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${isLiked ? "fill-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" : "group-hover:scale-110"}`} 
          />
        </motion.div>
        
        <span className="text-[13px] font-medium hidden sm:inline">{displayString}</span>
        <span className="text-[13px] font-medium sm:hidden">{likeCount}</span>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
      </motion.button>

      {/* Particles Burst */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: Math.random() * 1 + 0.5,
                  x: (Math.random() - 0.5) * 60, 
                  y: (Math.random() - 0.5) * 60 
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
