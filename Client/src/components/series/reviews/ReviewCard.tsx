import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Trash2, Heart, MessageCircle, Share2, BookmarkPlus, 
  MoreVertical, Flag, Edit3, CheckCircle2, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface ReviewCardProps {
  review: any
  isMine: boolean
  onDelete: () => void
  onLike: () => void
  currentUserId: string | undefined
  isLast: boolean
}

export default function ReviewCard({ review, isMine, onDelete, onLike, currentUserId, isLast }: ReviewCardProps) {
  const currentUserIdStr = currentUserId?.toString()
  const isLiked = currentUserIdStr && (review.likes || []).some((id: any) => id?.toString() === currentUserIdStr)
  const ratingValue = review.rating || 0
  
  // Read More Logic
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongText = review.text.length > 200

  // Mock states for non-backend features
  const [showReplies, setShowReplies] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  // Fake verified badge logic (1 in 5 users verified just for visual demo)
  const isVerified = (review.userId?.name?.length || 0) % 5 === 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-card/30 backdrop-blur-md ${!isLast ? 'border-b border-border/30' : ''} p-5 sm:p-6 transition-all hover:bg-card/50 flex gap-4 sm:gap-5 w-full group`}
    >
      {/* Left Avatar */}
      <div className="shrink-0 mt-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted border border-border/50 shadow-sm relative">
          {review.userId?.avatar ? (
            <img src={review.userId.avatar} alt={review.userId.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground uppercase text-base sm:text-lg">
              {review.userId?.name?.charAt(0) || 'U'}
            </div>
          )}
          {/* Online indicator mock */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        
        {/* Header (Username, Badges, Date, 3-Dot) */}
        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[15px] sm:text-base leading-tight text-foreground truncate max-w-[120px] sm:max-w-[200px]">
              {review.userId?.name || 'Anonymous'}
            </span>
            
            {isVerified && (
              <CheckCircle2 size={14} className="text-blue-400 fill-blue-400/20" />
            )}
            
            <span className="text-[12px] sm:text-[13px] text-muted-foreground/80 whitespace-nowrap">
              • {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            
            {isMine && (
              <span className="text-[10px] font-bold bg-primary/15 border border-primary/20 text-primary px-1.5 py-0.5 rounded-md ml-1 uppercase tracking-wider">
                You
              </span>
            )}
          </div>

          {/* 3-Dot Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground/50 hover:text-foreground hover:bg-background/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100 focus:opacity-100">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border/50 rounded-xl p-1 shadow-2xl">
              {isMine ? (
                <>
                  <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-sm">
                    <Edit3 size={14} /> Edit Review
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={onDelete} className="cursor-pointer gap-2 rounded-lg text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 size={14} /> Delete Review
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <Flag size={14} /> Report Abuse
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Rating Display */}
        <div className="flex items-center gap-1.5 mb-3 bg-background/30 w-fit px-2.5 py-1 rounded-md border border-border/20">
           <div className="flex gap-0.5">
             {[1, 2, 3, 4, 5].map(star => {
               const scaledRating = Math.round(ratingValue / 2);
               return (
                 <Star 
                   key={star} 
                   size={11} 
                   className={`${star <= scaledRating ? 'fill-primary text-primary drop-shadow-[0_0_3px_rgba(212,175,55,0.6)]' : 'fill-muted text-muted/30'}`} 
                 />
               )
             })}
           </div>
           <span className="text-[11px] font-bold text-foreground/80 font-mono tracking-tight">{ratingValue}/10</span>
        </div>

        {/* Review Text */}
        <div className="relative">
          <p className={`text-foreground/90 text-[14px] sm:text-[15px] leading-[1.65] whitespace-pre-wrap break-words transition-all duration-300 ${!isExpanded && isLongText ? 'line-clamp-4 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/40' : ''}`}>
            {review.text}
          </p>
          {isLongText && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary text-[13px] font-semibold mt-1 hover:underline underline-offset-2 transition-all flex items-center gap-1"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4 border-t border-border/20 pt-3">
          
          {/* Main Actions */}
          <div className="flex items-center gap-1 sm:gap-4 -ml-2">
            
            {/* Like */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike}
              className={`flex items-center gap-1.5 h-8 px-2 sm:px-3 rounded-full transition-all group overflow-hidden relative ${isLiked ? 'text-pink-500 hover:text-pink-600 bg-pink-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
            >
              <Heart size={16} className={`transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover:scale-110 group-active:scale-90"}`} />
              <span className="text-[13px] font-medium hidden sm:inline">{review.likes?.length === 1 ? '1 Like' : `${review.likes?.length || 0} Likes`}</span>
              <span className="text-[13px] font-medium sm:hidden">{review.likes?.length || 0}</span>
            </Button>

            {/* Reply Mock */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className={`flex items-center gap-1.5 h-8 px-2 sm:px-3 rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted/40 ${showReplies ? 'bg-primary/10 text-primary' : ''}`}
            >
              <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
              <span className="text-[13px] font-medium hidden sm:inline">Reply</span>
            </Button>

            {/* Share Mock */}
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted/40"
            >
              <Share2 size={16} />
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className={`h-8 w-8 rounded-full transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}
            >
              <BookmarkPlus size={16} className={isSaved ? "fill-current" : ""} />
            </Button>
          </div>
        </div>

        {/* Expanded Replies Section (Mock) */}
        <AnimatePresence>
          {showReplies && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border/10 pl-2 sm:pl-4 border-l-2 border-l-border/30 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ChevronDown size={12} /> Replies (Demo)
                </p>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                     <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground text-xs uppercase">S</div>
                  </div>
                  <div className="flex-1 bg-background/40 border border-border/40 p-3 rounded-xl rounded-tl-none">
                    <p className="text-sm font-semibold mb-0.5">System Demo</p>
                    <p className="text-sm text-foreground/80">Replies are currently in development. This is a visual preview of how they will look!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}
