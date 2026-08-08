import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MoreVertical, Edit3, Trash2, Flag, CheckCircle2, MessageCircle, Share2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import AnimatedLikeButton from './AnimatedLikeButton'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import { Loader2 } from 'lucide-react'

interface LuxuryReviewCardProps {
  review: any
  isMine: boolean
  onDelete: () => void
  onLike: () => void
  currentUserId: string | undefined
}

export default function LuxuryReviewCard({ review, isMine, onDelete, onLike, currentUserId }: LuxuryReviewCardProps) {
  const currentUserIdStr = currentUserId?.toString()
  const isLiked = currentUserIdStr && (review.likes || []).some((id: any) => id?.toString() === currentUserIdStr)
  const ratingValue = review.rating || 0

  const [isExpanded, setIsExpanded] = useState(false)
  const isLongText = review.text.length > 300

  // Real Interactions
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState<any[]>([])
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showSharePopup, setShowSharePopup] = useState(false)
  const { isAuthenticated } = useAuth()
  const { user } = useAuthStore()

  const shareUrl = `${window.location.origin}/series/${review.seriesId}?review=${review._id}`

  const fetchReplies = async () => {
    setIsLoadingReplies(true)
    try {
      const res = await api.get(`/comments/review/${review._id}`)
      setReplies(res.data)
    } catch (err) {
      console.error('Failed to load replies', err)
    } finally {
      setIsLoadingReplies(false)
    }
  }

  useEffect(() => {
    let isMounted = true;
    api.get(`/comments/review/${review._id}`).then(res => {
      if (isMounted) setReplies(res.data)
    }).catch(err => console.error('Failed to load initial replies', err))
    return () => { isMounted = false }
  }, [review._id])

  const handleToggleReplies = () => {
    setShowReplies(!showReplies)
  }

  const handleSubmitReply = async () => {
    if (!isAuthenticated || !replyText.trim()) return
    setIsSubmittingReply(true)
    try {
      const res = await api.post('/comments', {
        parentType: 'Review',
        parentId: review._id,
        text: replyText,
        userId: user?._id
      })
      // Refresh replies to get populated user info
      await fetchReplies()
      setReplyText('')
    } catch (err) {
      console.error('Failed to post reply', err)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  // Deterministic mock badges based on reviewId or userId
  const hash = Array.from(review.userId?._id || '123').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const isVerified = hash % 3 === 0
  const isTopReviewer = hash % 5 === 0
  const isEditorPick = hash % 7 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -3, transition: { duration: 0.3 } }}
      className="relative w-full rounded-[20px] py-3 px-4 sm:py-4 sm:px-5 bg-white/[0.02] backdrop-blur-[40px] border border-white/[0.05] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] group overflow-hidden transition-all duration-500 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.12)] hover:bg-white/[0.04]"
    >
      {/* Background Gold Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 via-[#d4af37]/0 to-[#d4af37]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header Container */}
      <div className="flex justify-between items-start mb-2 relative z-10">

        {/* User Info */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* Avatar (Rotates on hover) */}
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-black/40 border border-white/10 shadow-inner shrink-0"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {review.userId?.avatar ? (
              <img src={review.userId.avatar} alt={review.userId.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-white/50 text-xl font-serif">
                {review.userId?.name?.charAt(0) || 'U'}
              </div>
            )}
          </motion.div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-base text-white/90 font-sans tracking-wide">
                {review.userId?.name || 'Anonymous'}
              </span>
              <span className="text-[10px] text-white/40 font-medium">
                {new Date(review.createdAt).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
              </span>

              {isVerified && (
                <CheckCircle2 size={16} className="text-[#d4af37] fill-[#d4af37]/20 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
              )}

              {isMine && (
                <span className="text-[10px] font-bold bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-2 py-0.5 rounded-full uppercase tracking-widest ml-1 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  You
                </span>
              )}
            </div>

            {(isTopReviewer || isEditorPick) && (
              <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                {isTopReviewer && <span className="text-[#d4af37]/80 font-medium">Top Reviewer</span>}
                {isTopReviewer && isEditorPick && <span className="w-1 h-1 rounded-full bg-white/20" />}
                {isEditorPick && <span className="text-purple-400/80 font-medium">Editor Pick</span>}
              </div>
            )}
          </div>
        </div>

        {/* 3-Dot Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-full transition-all outline-none">
            <MoreVertical size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#14110f]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-1 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            {isMine ? (
              <>
                <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl text-sm py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                  <Edit3 size={16} /> Edit Review
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-3 rounded-xl text-sm py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400 transition-colors">
                  <Trash2 size={16} /> Delete Review
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl text-sm py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400 transition-colors">
                <Flag size={16} /> Report
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Rating Tag */}
      <div className="absolute top-6 right-16 sm:right-20 pointer-events-none group-hover:scale-105 transition-transform duration-500 origin-right hidden sm:flex items-center gap-2">
        <span className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f9db79] to-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          {ratingValue.toFixed(1)}
        </span>
      </div>

      {/* Mobile Rating Tag (shows below header instead of absolute right) */}
      <div className="sm:hidden mb-4 flex items-center gap-2">
        <span className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f9db79] to-[#d4af37]">
          {ratingValue.toFixed(1)}
        </span>
        <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-2 py-0.5 rounded-md">
          {ratingValue >= 9 ? 'Masterpiece' : ratingValue >= 8 ? 'Excellent' : ratingValue >= 7 ? 'Great' : 'Rated'}
        </span>
      </div>

      {/* Review Text */}
      <div className="relative z-10 mb-2 ml-[52px] sm:ml-16">
        <p className={`text-white/80 text-[14px] sm:text-[15px] leading-relaxed font-light whitespace-pre-wrap transition-all duration-500 ${!isExpanded && isLongText ? 'line-clamp-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20' : ''}`}>
          {review.text}
        </p>

        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[#d4af37] text-sm font-semibold tracking-wide hover:text-[#f9db79] transition-colors flex items-center gap-1"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="relative z-10 flex items-center justify-between ml-[52px] sm:ml-16 mt-1">

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <AnimatedLikeButton
            isLiked={isLiked}
            onClick={onLike}
            likeCount={review.likes?.length || 0}
            userId={currentUserIdStr || ''}
          />

          {/* Reply Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleReplies}
            className={`flex items-center gap-1.5 h-9 px-2 transition-colors ${showReplies ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <MessageCircle size={18} />
            <span className="text-[13px] font-medium hidden sm:inline">Reply</span>
            {replies.length > 0 && (
              <span className="text-[11px] font-bold bg-white/10 px-1.5 py-0.5 rounded-full ml-1">{replies.length}</span>
            )}
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <div className="relative">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSharePopup(!showSharePopup)}
              className={`h-9 w-9 flex items-center justify-center transition-colors ${showSharePopup ? 'text-[#d4af37]' : 'text-white/60 hover:text-white'}`}
            >
              <Share2 size={16} />
            </motion.button>

            <AnimatePresence>
              {showSharePopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-2 p-3 bg-[#14110f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-64 z-50 origin-bottom-right"
                >
                  <p className="text-xs text-white/70 mb-2 font-medium">Share this review</p>
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-1.5">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareUrl} 
                      className="bg-transparent border-none text-xs text-white/50 w-full focus:outline-none px-1"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 2000)
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-2 py-1 text-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      {isCopied ? <CheckCircle2 size={12} className="text-green-400"/> : 'Copy'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-4 pt-4 border-t border-white/[0.06] pl-6 border-l-2 border-l-[#d4af37]/30 space-y-4">
              
              {/* Replies List */}
              {isLoadingReplies ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin" />
                </div>
              ) : replies.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-[0.15em] mb-2">
                    {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                  </p>
                  {replies.map(reply => (
                    <div key={reply._id} className="flex gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {reply.userId?.avatar ? (
                          <img src={reply.userId.avatar} alt={reply.userId.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white/50 font-serif font-bold text-xs sm:text-sm">{reply.userId?.name?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4 rounded-2xl rounded-tl-none">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-bold text-white/90">{reply.userId?.name || 'Anonymous'}</span>
                          <span className="text-[10px] text-white/40">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                          {reply.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/40 italic">No replies yet. Be the first to reply!</p>
              )}

              {/* Reply Input */}
              {isAuthenticated ? (
                <div className="flex gap-3 mt-4 items-end">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-[#d4af37]/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#d4af37]/80 font-serif font-bold text-xs sm:text-sm">{user?.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmitReply()
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-2 sm:py-2.5 pl-4 pr-10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all placeholder:text-white/30"
                    />
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim() || isSubmittingReply}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#d4af37] hover:bg-[#d4af37]/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      {isSubmittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4 rotate-90" />}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#d4af37]/60 mt-4">Log in to post a reply.</p>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
