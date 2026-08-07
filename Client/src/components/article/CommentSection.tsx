import { useState } from 'react'
import { Comment, Reply } from '../../hooks/useArticleComments'
import { Button } from '../ui/button'
import { ThumbsUp, Reply as ReplyIcon } from 'lucide-react'

interface CommentItemProps {
  comment: Comment | Reply
  isReply?: boolean
}

function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const [showReplyForm, setShowReplyForm] = useState(false)

  const hasReplies = (comment as Comment).replies && (comment as Comment).replies.length > 0

  return (
    <div className={`space-y-3 ${isReply ? 'pl-8 md:pl-12' : ''}`}>
      <div className="flex gap-3">
        <img
          src={comment.avatarUrl}
          alt={comment.username}
          loading="lazy"
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-card-foreground">
              {comment.username}
            </p>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-sm text-foreground mt-2 leading-relaxed">
            {comment.body}
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary gap-1"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <ReplyIcon className="w-4 h-4" />
              Reply
            </Button>
          </div>

          {showReplyForm && (
            <div className="mt-3 p-3 bg-card rounded border border-border">
              <textarea
                placeholder="Write a reply..."
                className="w-full bg-background text-foreground text-sm p-2 rounded border border-border focus:outline-none focus:border-primary resize-none"
                rows={2}
              />
              <div className="flex gap-2 justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className=""
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button size="sm">Reply</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {hasReplies && 'replies' in comment && (
        <div className="space-y-3">
          {showReplies && (
            <>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                />
              ))}
            </>
          )}
          {comment.replies.length > 0 && !showReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              onClick={() => setShowReplies(true)}
            >
              Show {comment.replies.length} more{' '}
              {comment.replies.length === 1 ? 'reply' : 'replies'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface CommentSectionProps {
  comments: Comment[]
  isLoading: boolean
}

export function CommentSection({
  comments,
  isLoading,
}: CommentSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-4" id="discussion">
        <h2 className="text-2xl font-bold">Discussion</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-card rounded" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6" id="discussion">
      <h2 className="text-2xl font-bold">Discussion</h2>

      {/* Add comment form */}
      <div className="p-4 bg-card rounded-lg border border-border">
        <p className="text-sm font-semibold text-card-foreground mb-3">
          Join the conversation
        </p>
        <textarea
          placeholder="Share your thoughts..."
          className="w-full bg-background text-foreground text-sm p-3 rounded border border-border focus:outline-none focus:border-primary resize-none"
          rows={4}
        />
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Start the discussion.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}
