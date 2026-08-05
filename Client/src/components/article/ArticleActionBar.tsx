import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Heart,
  Share2,
  MessageCircle,
} from 'lucide-react'

interface ArticleActionBarProps {
  likeCount: number
  isLiked: boolean
  onLike: () => void
  onShare: () => void
  onJumpToComments: () => void
}

export function ArticleActionBar({
  likeCount,
  isLiked,
  onLike,
  onShare,
  onJumpToComments,
}: ArticleActionBarProps) {
  const [liked, setLiked] = useState(isLiked)

  const handleLike = () => {
    setLiked(!liked)
    onLike()
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
