<<<<<<< HEAD
import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageSquare, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
=======
import { useState, useEffect } from 'react'
import { Star, Trash2, Heart, MessageSquare, Clock, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
>>>>>>> origin/main
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
<<<<<<< HEAD

// Modular Luxury Components
import LuxuryBackground from './luxury-reviews/LuxuryBackground'
import LuxuryReviewStats from './luxury-reviews/LuxuryReviewStats'
import LuxuryFilterToolbar from './luxury-reviews/LuxuryFilterToolbar'
import LuxuryReviewCard from './luxury-reviews/LuxuryReviewCard'
import LuxuryReviewSkeleton from './luxury-reviews/LuxuryReviewSkeleton'
import UserReviewsSlider from './luxury-reviews/UserReviewsSlider'
=======
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import SpellLoader from '../ui/SpellLoader'
>>>>>>> origin/main

interface ReviewSectionProps {
  seriesId: string
}

export default function ReviewSection({ seriesId }: ReviewSectionProps) {
  const { isAuthenticated } = useAuth()
<<<<<<< HEAD
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Data State
=======
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

>>>>>>> origin/main
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [text, setText] = useState('')

<<<<<<< HEAD
  // Filter/Sort State
  const [activeTab, setActiveTab] = useState('Trending')
  const [sortBy, setSortBy] = useState('Newest')
  const [searchQuery, setSearchQuery] = useState('')

=======
>>>>>>> origin/main
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
<<<<<<< HEAD
      await api.post('/reviews', {
=======
      const res = await api.post('/reviews', {
>>>>>>> origin/main
        seriesId,
        rating,
        text
      })
<<<<<<< HEAD
=======
      
      // Update local state by prepending new review
      // The API returns the review, but it might lack populated user info.
      // Easiest is to just re-fetch, or artificially construct it
>>>>>>> origin/main
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
<<<<<<< HEAD
    setReviews(prev => prev.filter(r => r._id !== reviewId)) // Optimistic
=======
    
    // Optimistically remove
    setReviews(prev => prev.filter(r => r._id !== reviewId))
    
>>>>>>> origin/main
    try {
      await api.delete(`/reviews/${reviewId}`)
    } catch (err) {
      console.error('Failed to delete review', err)
<<<<<<< HEAD
      fetchReviews() // Revert
=======
      // Revert if failed
      fetchReviews()
>>>>>>> origin/main
    }
  }

  const handleLike = async (reviewId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

<<<<<<< HEAD
    setReviews(prev => prev.map(r => {
      if (r._id === reviewId) {
        const currentLikes = r.likes || []
        const userIdStr = user?._id?.toString()
        const hasLiked = currentLikes.some((id: any) => id?.toString() === userIdStr)
        let newLikes = [...currentLikes]
        if (hasLiked) {
          newLikes = newLikes.filter((id: any) => id?.toString() !== userIdStr)
        } else {
          if (userIdStr) newLikes.push(userIdStr)
=======
    // Optimistic Update
    setReviews(prev => prev.map(r => {
      if (r._id === reviewId) {
        const hasLiked = r.likes.includes(user?._id)
        let newLikes = [...r.likes]
        if (hasLiked) {
          newLikes = newLikes.filter((id: string) => id !== user?._id)
        } else {
          newLikes.push(user?._id)
>>>>>>> origin/main
        }
        return { ...r, likes: newLikes }
      }
      return r
    }))

    try {
      await api.post(`/reviews/${reviewId}/like`, {})
    } catch (err) {
      console.error('Failed to like review', err)
<<<<<<< HEAD
      fetchReviews() // Revert
    }
  }

  // Derived state & Filtering/Sorting
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews]

    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.text?.toLowerCase().includes(q) ||
        r.userId?.name?.toLowerCase().includes(q)
      )
    }

    // 2. Tab filter
    if (activeTab === 'Friends') {
      result = result.filter(r => r.likes?.length > 0)
    } else if (activeTab === 'Most Helpful') {
      result = result.filter(r => r.likes?.length >= 2)
    } else if (activeTab === 'Latest') {
      // Just sorting applied later
    } else if (activeTab === 'Trending') {
      // Fake trending logic based on likes + high rating
      result = result.filter(r => (r.likes?.length > 0) || (r.rating >= 8))
    }

    // 3. Sorting
    switch (sortBy) {
      case 'Oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'Highest Rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'Lowest Rating':
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0))
        break
      case 'Newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [reviews, searchQuery, activeTab, sortBy])

  const myReviews = useMemo(() => {
    if (!user) return []
    return reviews
      .filter(r => r.userId?._id === user._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reviews, user])

  const displayReviews = filteredAndSortedReviews.filter(r => r.userId?._id !== user?._id)

  const groupedCommunityReviews = useMemo(() => {
    const groups: { [key: string]: any[] } = {}
    const order: string[] = []
    
    displayReviews.forEach(review => {
      const userId = review.userId?._id || 'unknown'
      if (!groups[userId]) {
        groups[userId] = []
        order.push(userId)
      }
      groups[userId].push(review)
    })
    
    return order.map(userId => groups[userId])
  }, [displayReviews])

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
                className="min-w-[140px] h-10 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f9db79] hover:from-[#c29e2f] hover:to-[#e5ca6f] text-[#14110f] font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
=======
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
>>>>>>> origin/main
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    navigate('/login', { state: { from: location.pathname } })
                  }
                }}
              >
<<<<<<< HEAD
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAuthenticated ? 'Post Review' : 'Log In to Review')}
=======
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <SpellLoader size={16} />
                  </span>
                ) : (isAuthenticated ? 'Post Review' : 'Log In to Review')}
>>>>>>> origin/main
              </Button>
            </div>
          </form>
        </motion.div>
<<<<<<< HEAD

        {/* Luxury Review Stats Box */}
        {!isLoading && reviews.length > 0 && (
          <LuxuryReviewStats reviews={reviews} />
        )}

        {/* Floating Filter and Sort Toolbar */}
        {!isLoading && reviews.length > 0 && (
          <LuxuryFilterToolbar
            activeTab={activeTab} setActiveTab={setActiveTab}
            sortBy={sortBy} setSortBy={setSortBy}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          />
        )}

        {/* Reviews List */}
        <div className="space-y-6 mt-8 flex flex-col gap-6">

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <LuxuryReviewSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredAndSortedReviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white/[0.01] rounded-[40px] border border-white/[0.05] flex flex-col items-center backdrop-blur-xl"
            >
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 to-transparent" />
                <MessageSquare className="w-10 h-10 text-white/30" />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-3 text-white">No reviews found</h3>
              <p className="text-white/40 max-w-md mb-8 text-lg font-light leading-relaxed">
                {searchQuery ? "We couldn't find any reviews matching your search criteria." : "Be the first to share your thoughts on this series and start the conversation."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-full h-12 px-8 border-white/20 text-white hover:bg-white/10">
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}

          {/* My Review Section (Pinned to top if viewing All/Trending) */}
          {!isLoading && myReviews.length > 0 && !searchQuery && (
            <UserReviewsSlider
              reviews={myReviews}
              isMine={true}
              onDelete={handleDelete}
              onLike={handleLike}
              currentUserId={user?._id}
              title={
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                    <Star size={14} className="text-[#d4af37] fill-[#d4af37]" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-white tracking-wide">Your Review{myReviews.length > 1 ? 's' : ''}</h3>
                </div>
              }
            />
          )}

          {/* Community Reviews List */}
          {!isLoading && displayReviews.length > 0 && (
            <>
              {/* Added Subheading for Community Reviews */}
              <div className="flex items-center gap-3 mb-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <MessageSquare size={14} className="text-white/60" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white tracking-wide">Community Reviews</h3>
              </div>
              <div className="flex flex-col gap-8">
                <AnimatePresence initial={false}>
                  {groupedCommunityReviews.map((userReviews, index) => (
                    <UserReviewsSlider
                      key={userReviews[0]?.userId?._id || index}
                      reviews={userReviews}
                      isMine={false}
                      onDelete={handleDelete}
                      onLike={handleLike}
                      currentUserId={user?._id}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

        </div>
=======
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
>>>>>>> origin/main
      </div>
    </div>
  )
}
<<<<<<< HEAD
=======

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
>>>>>>> origin/main
