import { motion } from 'framer-motion'
import AnimatedHeroRating from './AnimatedHeroRating'

interface LuxuryReviewStatsProps {
  reviews: any[]
}

export default function LuxuryReviewStats({ reviews }: LuxuryReviewStatsProps) {
  if (!reviews || reviews.length === 0) return null

  // Calculate Average Rating
  const validReviews = reviews.filter(r => typeof r.rating === 'number')
  const averageRating = validReviews.length > 0 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length)
    : 0

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  
  validReviews.forEach(r => {
    const val = r.rating
    if (val >= 9) distribution[5]++
    else if (val >= 7) distribution[4]++
    else if (val >= 5) distribution[3]++
    else if (val >= 3) distribution[2]++
    else distribution[1]++
  })

  const total = validReviews.length

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const barVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/5 backdrop-blur-xl border border-white/10 py-5 px-6 sm:px-8 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Left side - Hero Score */}
      <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto md:pr-10 md:border-r border-white/10 relative z-10">
        <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-3">Average Rating</h3>
        <AnimatedHeroRating rating={averageRating} starSize={18} showLabel={true} className="items-center" />
        <p className="text-xs font-medium text-white/60 mt-3 tracking-wide">{total.toLocaleString()} Reviews</p>
      </div>

      {/* Right side - Animated Distribution */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex-1 w-full flex flex-col gap-3 relative z-10"
      >
        {[5, 4, 3, 2, 1].map(stars => {
          const count = distribution[stars as keyof typeof distribution]
          const percentage = total > 0 ? (count / total) * 100 : 0
          
          return (
            <motion.div key={stars} variants={barVariants} className="flex items-center gap-4 text-sm group/bar">
              <div className="flex items-center gap-1 w-16 shrink-0 font-bold text-white/70 tracking-widest text-xs">
                {'★'.repeat(stars).padEnd(5, '☆')}
              </div>
              <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden shadow-inner relative">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#d4af37] to-[#f9db79] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                />
              </div>
              <div className="w-10 text-right text-white/50 text-xs font-mono font-bold group-hover/bar:text-[#d4af37] transition-colors">
                {Math.round(percentage)}%
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
