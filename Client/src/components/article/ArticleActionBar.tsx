import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
} from 'lucide-react'

interface ArticleActionBarProps {
  likeCount: number
  bookmarkCount: number
  isLiked: boolean
  isBookmarked: boolean
  onLike: () => void
  onBookmark: () => void
  onShare: () => void
  onJumpToComments: () => void
}

export function ArticleActionBar({
  likeCount,
  bookmarkCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onShare,
  onJumpToComments,
}: ArticleActionBarProps) {
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleLike = () => {
    setLiked(!liked)
    onLike()
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    onBookmark()
  }

  return (
    <div className="flex gap-3 md:flex-col md:fixed md:right-8 md:top-1/2 md:-translate-y-1/2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        aria-label="Like this article"
        className="gap-2"
      >
        <Heart
          className="w-5 h-5"
          fill={liked ? 'currentColor' : 'none'}
          color={liked ? '#d4a574' : 'currentColor'}
        />
        <span className="text-xs hidden md:inline">{likeCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        aria-label="Save to bookmarks"
      >
        <Bookmark
          className="w-5 h-5"
          fill={bookmarked ? 'currentColor' : 'none'}
          color={bookmarked ? '#d4a574' : 'currentColor'}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        aria-label="Share this article"
      >
        <Share2 className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onJumpToComments}
        aria-label="Jump to comments"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
    </div>
  )
}
