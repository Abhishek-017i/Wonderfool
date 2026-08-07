import { Star, Trash2, Heart, MessageSquare, Clock } from 'lucide-react'
import type { Review } from '../../data/mockData'
import { motion } from 'framer-motion'

interface ReviewsListProps {
  reviews: Review[]
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center">
        <p className="text-foreground font-medium mb-2">No reviews yet.</p>
        <p className="text-sm text-muted-foreground">Start sharing your thoughts to help the community.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review, idx) => (
        <motion.div 
          key={review.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
          className="glass-panel rounded-2xl overflow-hidden luxury-shadow transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Poster Thumbnail */}
            <div className="w-full sm:w-32 sm:min-w-[128px] h-48 sm:h-auto overflow-hidden relative">
              <img 
                src={review.posterUrl} 
                alt={review.animeTitle} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-foreground mb-1 group-hover:text-primary transition-colors">{review.title}</h3>
                    <p className="text-sm font-semibold text-primary/80 mb-2">{review.animeTitle}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-destructive transition-colors p-1">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{review.date}</span>
                </div>

                <p className="text-foreground/90 leading-relaxed text-sm mb-4 line-clamp-3">
                  {review.content}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex items-center gap-6 pt-4 border-t border-border/50 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                  <Heart size={14} className="group-hover:text-red-500 transition-colors" />
                  <span>{review.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                  <MessageSquare size={14} className="group-hover:text-blue-500 transition-colors" />
                  <span>{review.comments}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <Clock size={14} />
                  <span>{review.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
