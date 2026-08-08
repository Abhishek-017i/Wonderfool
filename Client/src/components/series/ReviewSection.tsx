import { useState, useEffect, useMemo } from 'react'
import { Star, Trash2, Heart, MessageSquare, Clock, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import SpellLoader from '../ui/SpellLoader'

// Modular Luxury Components
import LuxuryBackground from './luxury-reviews/LuxuryBackground'
import LuxuryReviewStats from './luxury-reviews/LuxuryReviewStats'
import LuxuryFilterToolbar from './luxury-reviews/LuxuryFilterToolbar'
import LuxuryReviewCard from './luxury-reviews/LuxuryReviewCard'
import LuxuryReviewSkeleton from './luxury-reviews/LuxuryReviewSkeleton'
import UserReviewsSlider from './luxury-reviews/UserReviewsSlider'

interface Review {
  _id?: string
  userId?: {
    _id?: string
    name?: string
  }
  text?: string
  rating?: number
  createdAt: string
  likes?: unknown[]
}

interface ReviewSectionProps {
  seriesId: string
}

export default function ReviewSection({ seriesId }: ReviewSectionProps) {
  const { isAuthenticated } = useAuth()
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [text, setText] = useState('')

  // Filter/Sort State
  const [activeTab, setActiveTab] = useState('Trending')
  const [sortBy, setSortBy] = useState('Newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [seriesId])

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get(`/reviews/series/${seriesId}`)
      setReviews(res.data)
    } catch (err: any) {
      setError('Failed to load reviews')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (rating === 0 || text.trim() === '') {
      setError('Please provide a rating and a review text.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      const res = await api.post('/reviews', {
        seriesId,
        rating,
        text
      })
      
      // Update local state by prepending new review
      // The API returns the review, but it might lack populated user info.
      // Easiest is to just re-fetch, or artificially construct it
      fetchReviews()
      setRating(0)
      setText('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!isAuthenticated) return
    
    // Optimistically remove
    setReviews(prev => prev.filter(r => r._id !== reviewId))
    
    try {
      await api.delete(`/reviews/${reviewId}`)
    } catch (err) {
      console.error('Failed to delete review', err)
      // Revert if failed
      fetchReviews()
    }
  }

  const handleLike = async (reviewId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    // Optimistic Update
    setReviews(prev => prev.map(r => {
      if (r._id === reviewId) {
        const currentLikes = r.likes || []
        const userIdStr = user?._id?.toString()
        const hasLiked = currentLikes.some((id: any) => id?.toString() === userIdStr)
        let newLikes = [...currentLikes]
        if (hasLiked) {
          newLikes = newLikes.filter((id: any) => id?.toString() !== userIdStr)
        } else {
          newLikes.push(user?._id)
        }
        return { ...r, likes: newLikes }
      }
      return r
    }))

    try {
      await api.post(`/reviews/${reviewId}/like`, {})
    } catch (err) {
      console.error('Failed to like review', err)
      fetchReviews() // revert on fail
    }
  }

  // Derived state
  const myReview = user ? reviews.find(r => r.userId?._id === user._id) : null
  const otherReviews = reviews.filter(r => r.userId?._id !== user?._id)

  return (
    <div className="relative w-full overflow-hidden">
      <LuxuryBackground />
      
      <div className="relative w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-10 z-10">

        {/* Header Title */}
        <div className="flex flex-col items-center justify-center text-center mb-8 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-[#f9db79] to-[#d4af37] rounded-[18px] rotate-12 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4"
          >
            <MessageSquare size={24} className="text-[#14110f] -rotate-12" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight drop-shadow-md">Community Reviews</h2>
          <p className="text-white/50 mt-2 text-base font-light max-w-lg mx-auto">Discover what others are saying about this series, or share your own thoughts.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-[20px] mb-8 flex justify-between items-center border border-red-500/20 backdrop-blur-md">
            <span className="font-medium">{error}</span>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="hover:bg-red-500/20 rounded-full">Dismiss</Button>
          </div>
        )}

        {/* Review Form */}
        {!myReview && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.08] px-4 py-4 sm:px-6 sm:py-5 rounded-[20px] mb-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>
          
          <h3 className="text-xl font-bold mb-4 font-serif relative text-white">Write your review</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div>
              <div className="flex items-center gap-4 mb-2 cursor-pointer w-fit" onMouseLeave={() => setHoverRating(0)}>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className={`transition-all duration-300 ${(hoverRating || rating) >= star ? 'fill-[#d4af37] text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] scale-110' : 'text-white/20 hover:scale-110'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold font-mono bg-white/10 text-[#d4af37] px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">{rating > 0 ? rating : '-'} / 10</span>
              </div>
            </div>

            <Textarea
              placeholder={isAuthenticated ? "What did you think of this series?" : "Log in to share your thoughts..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[60px] bg-black/40 border-white/10 focus-visible:ring-[#d4af37]/50 text-[15px] text-white/90 rounded-[16px] leading-relaxed resize-y p-3 placeholder:text-white/30"
            />

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={isSubmitting || (isAuthenticated && (!rating || text.trim() === ''))}
                className="min-w-[120px]"
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    navigate('/login', { state: { from: location.pathname } })
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <SpellLoader size={16} />
                  </span>
                ) : (isAuthenticated ? 'Post Review' : 'Log In to Review')}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* User's Own Review */}
        {myReview && (
          <div className="mb-10">
             <h3 className="text-lg font-bold font-serif mb-4 text-primary flex items-center gap-2">
               <Star size={18} className="fill-primary" /> Your Review
             </h3>
             <ReviewCard 
               review={myReview} 
               isMine={true} 
               onDelete={() => handleDelete(myReview._id)}
               onLike={() => handleLike(myReview._id)}
               currentUserId={user?._id}
             />
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6 mt-8 flex flex-col gap-6">

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <LuxuryReviewSkeleton key={i} />
              ))}
            </div>
          ) : otherReviews.length > 0 ? (
            otherReviews.map((r, i) => (
              <ReviewCard
                key={r._id || i}
                review={r}
                isMine={false}
                onDelete={() => handleDelete(r._id)}
                onLike={() => handleLike(r._id)}
                currentUserId={user?._id}
              />
            ))
          ) : !myReview && (
            <div className="text-center py-12 bg-card/30 rounded-2xl border border-border/50 border-dashed">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No reviews yet.</p>
              <p className="text-sm text-muted-foreground/70">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

function ReviewCard({ review, isMine, onDelete, onLike, currentUserId }: any) {
  const isLiked = currentUserId && review.likes?.includes(currentUserId);
  const ratingValue = review.rating || 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card/50 backdrop-blur-sm border ${isMine ? 'border-primary/40 shadow-[0_0_15px_rgba(244,216,69,0.1)]' : 'border-border/50'} rounded-2xl p-6 transition-all hover:bg-card hover:border-border`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            {review.userId?.avatar ? (
              <img src={review.userId.avatar} alt={review.userId.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground uppercase text-sm">
                {review.userId?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-foreground">{review.userId?.name || 'Anonymous User'}</h4>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} /> {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-sm font-bold">{ratingValue}/10</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
        {review.text}
      </p>

      <div className="flex items-center gap-4 border-t border-border/50 pt-4">
        <button 
          onClick={onLike}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
          <span>{review.likes?.length || 0}</span>
        </button>
        
        {isMine && (
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors ml-auto"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}
