import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BiographyProps {
  bio: string
}

export default function Biography({ bio }: BiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
        Biography
      </h2>
      
      <div className="relative">
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '120px' }}
          className="overflow-hidden"
        >
          <p className="text-muted-foreground font-serif text-lg leading-relaxed whitespace-pre-line">
            {bio}
          </p>
        </motion.div>
        
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm font-semibold font-cinzel tracking-wider text-primary hover:text-accent transition-colors uppercase mt-2 flex items-center gap-2"
        aria-label={isExpanded ? 'Read less biography' : 'Read more biography'}
      >
        {isExpanded ? 'Read Less' : 'Read More'}
        <span className="text-lg leading-none">{isExpanded ? '−' : '+'}</span>
      </button>
    </section>
  )
}
