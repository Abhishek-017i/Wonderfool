import { useState, useEffect } from 'react'
import { Star, Trash2, MessageSquare, ThumbsUp, Reply as ReplyIcon } from 'lucide-react'
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
import CommentSection from '../shared/CommentSection'

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)

  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years !== 1 ? 's' : ''} ago`
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
          className="bg-card border border-border p-6 sm:p-8 rounded-2xl mb-12 luxury-shadow"
        >
          <h3 className="text-xl font-bold mb-6 font-serif">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted p-5 rounded-xl border border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Your Rating</p>
              <div className="flex gap-1.5 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className={`transition-all duration-300 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(200,173,57,0.4)]' 
                        : 'text-muted-foreground/40 hover:text-primary/70'
                    } hover:scale-110 hover:-translate-y-1`}
                  />
                ))}
              </div>
            </div>
            
            <Textarea
              placeholder={isAuthenticated ? "Share your thoughts about this series..." : "Log in to write a review..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[140px] bg-background border-input text-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-base rounded-xl transition-all shadow-inner p-4 placeholder:text-muted-foreground"
            />
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || (isAuthenticated && (!rating || text.trim() === ''))}
                className="min-w-[140px] h-11 rounded-xl bg-primary text-primary-foreground font-semibold luxury-shadow hover:opacity-90 hover:scale-[1.02] transition-all disabled:hover:scale-100 disabled:opacity-50"
                onClick={(e: React.MouseEvent) => {
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
            <div className="flex flex-col space-y-8">
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
  const [showReplies, setShowReplies] = useState(false)
  const isLiked = currentUserId && review.likes?.includes(currentUserId);
  const ratingValue = review.rating || 0;
  
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
        {review.userId?.avatar ? (
          <img src={review.userId.avatar} alt={review.userId.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground uppercase">
            {review.userId?.name?.charAt(0) || 'U'}
          </div>
        )}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Row 1: Name + timestamp, inline */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground leading-tight">
            {review.userId?.name || 'Anonymous'}
          </span>
          <span className="text-xs leading-tight" style={{ color: '#c9a94e' }}>
            {relativeTime(review.createdAt)}
          </span>
          {isMine && onDelete && (
            <button 
              onClick={onDelete} 
              className="ml-auto text-muted-foreground hover:text-destructive transition-colors cursor-pointer bg-transparent border-none p-0"
              title="Delete Review"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Row 1.5: Star Rating (under name, aligned) */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Star size={12} className="fill-primary text-primary" />
          <span className="text-xs font-bold text-foreground">{ratingValue} <span className="text-muted-foreground/60 font-medium">/ 10</span></span>
        </div>

        {/* Row 2: Review body */}
        <p className="text-sm text-foreground/85 mt-2 leading-relaxed break-words whitespace-pre-wrap">
          {review.text}
        </p>

        {/* Row 3: Action row */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={onLike}
            className={`inline-flex items-center gap-1 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 ${
              isLiked
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{review.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowReplies(!showReplies)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ReplyIcon className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Nested threaded comments (scoped to this review) */}
        {showReplies && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <CommentSection parentType="Review" parentId={review._id} />
          </div>
        )}
      </div>
    </div>
  )
}
