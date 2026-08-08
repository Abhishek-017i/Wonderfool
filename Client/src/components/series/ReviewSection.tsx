import { useState, useEffect } from 'react'
import { Star, Trash2, Heart, MessageSquare, Clock, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import SpellLoader from '../ui/SpellLoader'

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
        const hasLiked = r.likes.includes(user?._id)
        let newLikes = [...r.likes]
        if (hasLiked) {
          newLikes = newLikes.filter((id: string) => id !== user?._id)
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <SpellLoader size={32} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/20 text-primary rounded-xl">
          <MessageSquare size={24} />
        </div>
        <h2 className="text-2xl font-bold font-serif">Reviews & Community</h2>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
        </div>
      )}

      {/* Review Form - Only show if logged in user has NOT written a review */}
      {!myReview && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-md border border-border p-6 sm:p-8 rounded-2xl mb-12 shadow-xl"
        >
          <h3 className="text-xl font-bold mb-4 font-serif">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Your Rating</p>
              <div className="flex gap-1 mb-4 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className={`transition-colors ${(hoverRating || rating) >= star ? 'fill-primary text-primary' : 'text-muted-foreground/30'} hover:scale-110 duration-200`}
                  />
                ))}
              </div>
            </div>
            <Textarea
              placeholder={isAuthenticated ? "Share your thoughts about this series..." : "Log in to write a review..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] bg-background/50 border-border/50 focus-visible:ring-primary/50 text-base"
            />
            <div className="flex justify-end pt-2">
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

        {/* Other Users' Reviews */}
        {otherReviews.length > 0 ? (
          <div>
            {myReview && <h3 className="text-lg font-bold font-serif mb-4">Community Reviews</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {otherReviews.map((review) => (
                <ReviewCard 
                  key={review._id} 
                  review={review} 
                  isMine={false} 
                  onLike={() => handleLike(review._id)}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          </div>
        ) : (
          !myReview && (
            <div className="text-center py-12 bg-card/30 rounded-2xl border border-border/50 border-dashed">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No reviews yet.</p>
              <p className="text-sm text-muted-foreground/70">Be the first to share your thoughts!</p>
            </div>
          )
        )}
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
            <p className="font-semibold text-sm leading-tight text-foreground">{review.userId?.name || 'Anonymous'}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        {isMine && onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-muted-foreground hover:text-destructive h-8 w-8 -mr-2 -mt-2">
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-4 bg-background/50 w-fit px-3 py-1.5 rounded-full border border-border/30">
        <Star size={14} className="fill-primary text-primary" />
        <span className="text-sm font-bold text-foreground">{ratingValue} <span className="text-muted-foreground/60 text-xs font-medium">/ 10</span></span>
      </div>

      <p className="text-foreground/90 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
        {review.text}
      </p>

      <div className="flex items-center gap-2 pt-4 border-t border-border/40">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLike}
          className={`flex items-center gap-2 h-8 px-2.5 rounded-lg transition-all ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span className="text-xs font-semibold">{review.likes?.length || 0}</span>
        </Button>
      </div>
    </motion.div>
  )
}
