import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ThumbsUp, Reply as ReplyIcon, MessageSquare, Send } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import SpellLoader from '@/components/ui/SpellLoader'
import InstagramReveal from '@/components/easter-eggs/InstagramReveal'
// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface CommentUser {
  _id: string
  name: string
  avatar?: string
}

interface RawComment {
  _id: string
  parentType: string
  parentId: string
  userId: CommentUser
  text: string
  parentCommentId: string | null
  likes: string[]
  createdAt: string
  updatedAt: string
}

interface CommentNode {
  _id: string
  userId: CommentUser
  text: string
  likes: string[]
  createdAt: string
  children: CommentNode[]
}

interface CommentSectionProps {
  parentType: 'Article' | 'Series' | 'Review'
  parentId: string
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

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

function buildTree(flat: RawComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []

  // Create nodes
  for (const c of flat) {
    map.set(c._id, {
      _id: c._id,
      userId: c.userId,
      text: c.text,
      likes: c.likes || [],
      createdAt: c.createdAt,
      children: [],
    })
  }

  // Link children
  for (const c of flat) {
    const node = map.get(c._id)!
    if (c.parentCommentId && map.has(c.parentCommentId)) {
      map.get(c.parentCommentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  // Sort: top-level newest-first, replies oldest-first (chronological conversation)
  roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const sortChildren = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    nodes.forEach(n => sortChildren(n.children))
  }
  roots.forEach(r => sortChildren(r.children))

  return roots
}

function getRouteSegment(parentType: string): string {
  switch (parentType) {
    case 'Article': return 'article'
    case 'Series': return 'series'
    case 'Review': return 'review'
    default: return 'article'
  }
}

// ────────────────────────────────────────────────
// CommentItem — recursive, matches reference design
// ────────────────────────────────────────────────

interface CommentItemProps {
  comment: CommentNode
  currentUserId?: string
  onLike: (commentId: string) => void
  onReply: (parentCommentId: string, text: string) => Promise<void>
  isAuthenticated: boolean
  onAuthRedirect: () => void
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onReply,
  isAuthenticated,
  onAuthRedirect,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isLiked = currentUserId ? comment.likes.includes(currentUserId) : false

  const handleLike = () => {
    if (!isAuthenticated) {
      onAuthRedirect()
      return
    }
    onLike(comment._id)
  }

  const handleReplyToggle = () => {
    if (!isAuthenticated) {
      onAuthRedirect()
      return
    }
    setShowReplyForm(!showReplyForm)
    setReplyText('')
  }

  const handleSubmitReply = async () => {
    if (!replyText.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    try {
      await onReply(comment._id, replyText.trim())
      setReplyText('')
      setShowReplyForm(false)
      setIsCollapsed(false)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const avatarInitial = comment.userId?.name?.charAt(0)?.toUpperCase() || 'U'

  if (isCollapsed) {
    return (
      <div className="flex items-center gap-2 mt-3 mb-1">
        <div className="w-7 flex justify-center shrink-0">
          <button 
            onClick={() => setIsCollapsed(false)}
            className="w-4 h-4 rounded-full border border-border bg-background hover:bg-muted text-foreground flex items-center justify-center transition-colors cursor-pointer z-10 shadow-sm"
            title="Expand thread"
          >
            <span className="text-[12px] font-bold leading-none">+</span>
          </button>
        </div>
        <span className="font-semibold text-sm text-foreground">
          {comment.userId?.name || 'Anonymous'}
        </span>
        <span className="text-muted-foreground text-xs font-bold">·</span>
        <span className="text-xs" style={{ color: '#c9a94e' }}>
          {relativeTime(comment.createdAt)}
        </span>
      </div>
    )
  }

  return (
    <div className="relative mt-3">
      {/* ROW 1: Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-muted border border-border/30 z-10 relative">
          {comment.userId?.avatar ? (
            <img src={comment.userId.avatar} alt={comment.userId.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
              {avatarInitial}
            </div>
          )}
        </div>
        <span className="font-semibold text-sm text-foreground">
          {comment.userId?.name || 'Anonymous'}
        </span>
        <span className="text-muted-foreground text-xs font-bold">·</span>
        <span className="text-xs" style={{ color: '#c9a94e' }}>
          {relativeTime(comment.createdAt)}
        </span>
      </div>

      {/* ROW 2: Body */}
      <div className="flex gap-2">
        <div className="w-7 flex justify-center shrink-0 cursor-pointer group" onClick={() => setIsCollapsed(true)}>
          <div className="w-[2px] h-full bg-muted-foreground opacity-40 group-hover:opacity-100 group-hover:bg-primary transition-all" />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-sm text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
      </div>

      {/* ROW 3: Actions */}
      <div className="flex items-center gap-2 mt-0.5">
        <div className="w-7 flex justify-center shrink-0">
          <button 
            onClick={() => setIsCollapsed(true)} 
            className="w-4 h-4 rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer bg-background z-10"
            title="Collapse thread"
          >
            <span className="text-[12px] font-bold leading-none">−</span>
          </button>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 font-medium ${
              isLiked
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{comment.likes.length}</span>
          </button>

          <button
            onClick={handleReplyToggle}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0 font-medium"
          >
            <ReplyIcon className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
        </div>
      </div>

      {/* Inline reply form */}
      {showReplyForm && (
        <div className="flex gap-2 mt-2">
          <div className="w-7 flex justify-center shrink-0 cursor-pointer group" onClick={() => setIsCollapsed(true)}>
             <div className="w-[2px] h-full bg-muted-foreground opacity-40 group-hover:opacity-100 group-hover:bg-primary transition-all" />
          </div>
          <div className="flex-1 flex gap-3 items-start pr-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="flex-1 bg-background text-foreground text-sm p-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground/70 shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitReply()
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmittingReply}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer border-none flex items-center justify-center shadow-md hover:scale-[1.02]"
              >
                {isSubmittingReply ? (
                  <SpellLoader size={16} />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => { setShowReplyForm(false); setReplyText('') }}
                className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROW 4: Children */}
      {comment.children.length > 0 && (
        <div className="relative">
          {comment.children.map((child, index) => {
            const isLast = index === comment.children.length - 1;
            return (
              <div key={child._id} className="relative pl-8 group/thread">
                {/* Curved branch to this child */}
                <div className="absolute left-[13px] top-0 w-[19px] h-[26px] border-l-[2px] border-b-[2px] border-muted-foreground opacity-40 rounded-bl-xl group-hover/thread:opacity-100 group-hover/thread:border-primary transition-all" />
                
                {/* Vertical line connecting to parent (starts after the curve to prevent overlap blending) */}
                {!isLast && (
                  <div className="absolute left-[13px] top-[26px] bottom-0 w-[2px] bg-muted-foreground opacity-40 group-hover/thread:opacity-100 group-hover/thread:bg-primary transition-all" />
                )}
                
                <CommentItem
                  comment={child}
                  currentUserId={currentUserId}
                  onLike={onLike}
                  onReply={onReply}
                  isAuthenticated={isAuthenticated}
                  onAuthRedirect={onAuthRedirect}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────
// Main CommentSection
// ────────────────────────────────────────────────

export default function CommentSection({ parentType, parentId }: CommentSectionProps) {
  const { isAuthenticated } = useAuth()
  const { user } = useAuthStore() as { user: CommentUser | null }
  const navigate = useNavigate()
  const location = useLocation()

  const [rawComments, setRawComments] = useState<RawComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [easterEggData, setEasterEggData] = useState<{ handle: string, url: string } | null>(null)

  const authRedirect = useCallback(() => {
    navigate('/login', { state: { from: location.pathname } })
  }, [navigate, location.pathname])

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const segment = getRouteSegment(parentType)
      const res = await api.get(`/comments/${segment}/${parentId}`)
      setRawComments(res.data)
      setError(null)
    } catch (err: any) {
      setError('Failed to load comments')
      console.error('Comment fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [parentType, parentId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // Post a new top-level comment
  const handlePostComment = async () => {
    if (!isAuthenticated) {
      authRedirect()
      return
    }
    if (!newCommentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await api.post('/comments', {
        parentType,
        parentId,
        text: newCommentText.trim(),
      })

      // Prepend to local state (newest first for top-level)
      setRawComments(prev => [res.data, ...prev])
      setNewCommentText('')
    } catch (err: any) {
      setError('Failed to post comment')
      console.error('Comment post error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Post a reply
  const handleReply = async (parentCommentId: string, text: string) => {
    const res = await api.post('/comments', {
      parentType,
      parentId,
      text,
      parentCommentId,
    })
    setRawComments(prev => [...prev, res.data])
  }

  // Like/unlike a comment — optimistic
  const handleLike = (commentId: string) => {
    if (!user?._id) return

    // Find the comment first
    const commentToLike = rawComments.find(c => c._id === commentId)
    const hasLikedPreviously = commentToLike?.likes.includes(user._id)

    // Trigger easter egg if liking Divit's comment
    const authorId = typeof commentToLike?.userId === 'object' ? commentToLike?.userId?._id : commentToLike?.userId
    console.log('[Easter Egg Check]', {
      actualAuthorId: authorId,
      actualAuthorIdType: typeof authorId,
      hardcodedId: '6a735f01d61158e8157356b2',
      hasLikedPreviously,
      isMatch: String(authorId) === '6a735f01d61158e8157356b2',
      rawUserIdField: commentToLike?.userId
    })
    
    if (!hasLikedPreviously) {
      if (String(authorId) === '6a735f01d61158e8157356b2') {
        setEasterEggData({ handle: '@real._._human', url: 'https://www.instagram.com/real._._human' })
      } else if (String(authorId) === '6a760897902d4ca02ef12995') {
        setEasterEggData({ handle: '@soomethh', url: 'https://www.instagram.com/soomethh' })
      } else if (String(authorId) === '6a735a5ed61158e815734995') {
        setEasterEggData({ handle: '@preetpatel3375', url: 'https://www.instagram.com/preetpatel3375?igsh=MTRodzcxcnVtcmNyeQ==' })
      } else if (String(authorId) === '6a73552dd61158e815733839') {
        setEasterEggData({ handle: '@abhishek_017i', url: 'https://www.instagram.com/abhishek_017i?igsh=cmJramR2cm4yOXlu' })
      }
    }

    // Optimistic update
    setRawComments(prev =>
      prev.map(c => {
        if (c._id === commentId) {
          const hasLiked = c.likes.includes(user._id)
          return {
            ...c,
            likes: hasLiked
              ? c.likes.filter(id => id !== user._id)
              : [...c.likes, user._id],
          }
        }
        return c
      })
    )

    // Fire and forget, revert on error
    api.post(`/comments/${commentId}/like`, {}).catch(() => {
      fetchComments()
    })
  }

  // Build the nested tree
  const tree = buildTree(rawComments)

  return (
    <section className="space-y-8" id="discussion">
      {/* Comment input */}
      <div className="flex gap-3 items-start">
        {/* Current user avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground uppercase">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={isAuthenticated ? 'Share your thoughts...' : 'Log in to join the discussion...'}
            rows={3}
            className="w-full bg-background text-foreground text-sm p-3 rounded-lg border border-border focus:outline-none focus:border-primary resize-none placeholder:text-muted-foreground transition-colors"
            onClick={() => {
              if (!isAuthenticated) authRedirect()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handlePostComment()
              }
            }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  authRedirect()
                  return
                }
                handlePostComment()
              }}
              disabled={isSubmitting || (!isAuthenticated ? false : !newCommentText.trim())}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer border-none"
            >
              {isSubmitting ? (
                <SpellLoader size={14} />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isAuthenticated ? 'Comment' : 'Log In to Comment'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <SpellLoader size={32} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && tree.length === 0 && (
        <div className="text-center py-10">
          <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No comments yet. Start the discussion!
          </p>
        </div>
      )}

      {/* Comments list — flat on dark bg, no cards */}
      {!isLoading && tree.length > 0 && (
        <div className="space-y-6">
          {tree.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onLike={handleLike}
              onReply={handleReply}
              isAuthenticated={isAuthenticated}
              onAuthRedirect={authRedirect}
            />
          ))}
        </div>
      )}

      {/* Easter Egg Modal */}
      {easterEggData && (
        <InstagramReveal 
          onClose={() => setEasterEggData(null)} 
          handle={easterEggData.handle}
          url={easterEggData.url}
        />
      )}
    </section>
  )
}
