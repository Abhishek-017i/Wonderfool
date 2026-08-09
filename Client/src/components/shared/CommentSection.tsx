import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ThumbsUp, Reply as ReplyIcon, MessageSquare, Send } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import useAuthStore from '@/store/authStore'
import api from '@/lib/api'
import SpellLoader from '@/components/ui/SpellLoader'

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
  depth: number
  currentUserId?: string
  onLike: (commentId: string) => void
  onReply: (parentCommentId: string, text: string) => Promise<void>
  isAuthenticated: boolean
  onAuthRedirect: () => void
}

function CommentItem({
  comment,
  depth,
  currentUserId,
  onLike,
  onReply,
  isAuthenticated,
  onAuthRedirect,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

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
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const avatarInitial = comment.userId?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div
      className="comment-item"
      style={{ paddingLeft: depth > 0 ? `${Math.min(depth, 4) * 48}px` : '0' }}
    >
      {/* Main comment block */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[hsl(var(--muted))]">
          {comment.userId?.avatar ? (
            <img
              src={comment.userId.avatar}
              alt={comment.userId.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase">
              {avatarInitial}
            </div>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Name + timestamp, inline */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-white leading-tight">
              {comment.userId?.name || 'Anonymous'}
            </span>
            <span className="text-xs leading-tight" style={{ color: '#c9a94e' }}>
              {relativeTime(comment.createdAt)}
            </span>
          </div>

          {/* Row 2: Comment body */}
          <p className="text-sm text-[hsl(var(--foreground))]/85 mt-1.5 leading-relaxed break-words">
            {comment.text}
          </p>

          {/* Row 3: Action row — flat icons, no button chrome */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1 text-xs transition-colors cursor-pointer bg-transparent border-none p-0 ${
                isLiked
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{comment.likes.length}</span>
            </button>

            <button
              onClick={handleReplyToggle}
              className="inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              <ReplyIcon className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>

          {/* Inline reply form */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2 items-start">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm p-2.5 rounded-lg border border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--primary))] resize-none placeholder:text-[hsl(var(--muted-foreground))]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitReply()
                  }
                }}
              />
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="p-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer border-none"
                >
                  {isSubmittingReply ? (
                    <SpellLoader size={14} />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => { setShowReplyForm(false); setReplyText('') }}
                  className="text-[10px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer bg-transparent border-none p-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.children.map((child) => (
            <CommentItem
              key={child._id}
              comment={child}
              depth={depth + 1}
              currentUserId={currentUserId}
              onLike={onLike}
              onReply={onReply}
              isAuthenticated={isAuthenticated}
              onAuthRedirect={onAuthRedirect}
            />
          ))}
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
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[hsl(var(--muted))]">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase">
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
            className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm p-3 rounded-lg border border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--primary))] resize-none placeholder:text-[hsl(var(--muted-foreground))] transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer border-none"
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
        <div className="text-sm text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 px-4 py-3 rounded-lg">
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
          <MessageSquare className="w-10 h-10 text-[hsl(var(--muted-foreground))]/30 mx-auto mb-3" />
          <p className="text-[hsl(var(--muted-foreground))] text-sm">
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
              depth={0}
              currentUserId={user?._id}
              onLike={handleLike}
              onReply={handleReply}
              isAuthenticated={isAuthenticated}
              onAuthRedirect={authRedirect}
            />
          ))}
        </div>
      )}
    </section>
  )
}
