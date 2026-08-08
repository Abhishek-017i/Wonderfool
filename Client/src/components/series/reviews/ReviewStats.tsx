import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface ReviewStatsProps {
  reviews: any[]
}

export default function ReviewStats({ reviews }: ReviewStatsProps) {
  if (!reviews || reviews.length === 0) return null

  // Calculate Average Rating
  const validReviews = reviews.filter(r => typeof r.rating === 'number')
  const averageRating = validReviews.length > 0 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length).toFixed(1)
    : 0

  // Calculate Distribution (1 to 10 scale mapped to 5 star groups)
  // For simplicity:
  // 5 Star: 9-10
  // 4 Star: 7-8
  // 3 Star: 5-6
  // 2 Star: 3-4
  // 1 Star: 1-2
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-md border border-border/50 p-6 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row gap-8 items-center"
    >
      {/* Left side - Big Number */}
      <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto md:pr-8 md:border-r border-border/40">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Average Rating</h3>
        <div className="text-5xl font-bold font-serif text-primary flex items-end gap-1">
          {averageRating}
          <span className="text-xl text-muted-foreground/60 font-sans mb-1">/ 10</span>
        </div>
        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map(star => {
             const scaledAvg = Math.round(Number(averageRating) / 2);
             return (
               <Star 
                 key={star} 
                 size={16} 
                 className={`${star <= scaledAvg ? 'fill-primary text-primary' : 'fill-muted text-muted/30'}`} 
               />
             )
           })}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{total.toLocaleString()} Reviews</p>
      </div>

      {/* Right side - Progress Bars */}
      <div className="flex-1 w-full flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map(stars => {
          const count = distribution[stars as keyof typeof distribution]
          const percentage = total > 0 ? (count / total) * 100 : 0
          
          return (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 w-12 shrink-0 font-medium text-muted-foreground">
                {stars} <Star size={12} className="fill-current" />
              </div>
              <div className="flex-1 h-2.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-primary/80 rounded-full"
                />
              </div>
              <div className="w-10 text-right text-muted-foreground/70 text-xs">
                {Math.round(percentage)}%
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
