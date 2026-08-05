import { useState, useEffect } from 'react'

export interface Reply {
  id: string
  avatarUrl: string
  username: string
  timestamp: string
  body: string
  likes: number
  replies: Reply[]
}

export interface Comment {
  id: string
  avatarUrl: string
  username: string
  timestamp: string
  body: string
  likes: number
  replies: Reply[]
}

export interface CommentsData {
  comments: Comment[]
  isLoading: boolean
  error: string | null
}

export function useArticleComments(id: string): CommentsData {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockComments: Comment[] = [
          {
            id: 'comment-1',
            avatarUrl: `https://picsum.photos/seed/comment-1/96/96`,
            username: 'Jordan Taylor',
            timestamp: '2 hours ago',
            body: 'This article perfectly captures the essence of good design. I especially loved the section on constraints—it completely changed how I approach my projects. Thank you for the insight!',
            likes: 24,
            replies: [
              {
                id: 'reply-1',
                avatarUrl: `https://picsum.photos/seed/reply-1/96/96`,
                username: 'Sarah Chen',
                timestamp: '1 hour ago',
                body: 'Thanks so much, Jordan! Constraints really are the backbone of creative problem-solving. Glad this resonated with you.',
                likes: 8,
                replies: [],
              },
            ],
          },
          {
            id: 'comment-2',
            avatarUrl: `https://picsum.photos/seed/comment-2/96/96`,
            username: 'Alex Morgan',
            timestamp: '4 hours ago',
            body: 'The visual examples were phenomenal. Really helped me understand the practical applications of these principles.',
            likes: 18,
            replies: [],
          },
          {
            id: 'comment-3',
            avatarUrl: `https://picsum.photos/seed/comment-3/96/96`,
            username: 'Casey Rivera',
            timestamp: '6 hours ago',
            body: 'Do you have any resources on implementing these principles in mobile design specifically?',
            likes: 12,
            replies: [
              {
                id: 'reply-2',
                avatarUrl: `https://picsum.photos/seed/reply-2/96/96`,
                username: 'Sarah Chen',
                timestamp: '5 hours ago',
                body: 'Great question! Mobile design requires even more intentionality given the limited screen space. I actually have an upcoming article specifically on this topic. Stay tuned!',
                likes: 6,
                replies: [],
              },
              {
                id: 'reply-3',
                avatarUrl: `https://picsum.photos/seed/reply-3/96/96`,
                username: 'Jamie Chen',
                timestamp: '4 hours ago',
                body: 'In the meantime, I can recommend looking at Material Design guidelines. They have great mobile-specific patterns.',
                likes: 3,
                replies: [],
              },
            ],
          },
        ]
        setComments(mockComments)
        setError(null)
      } catch (err) {
        setError('Failed to load comments')
      } finally {
        setIsLoading(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [id])

  return { comments, isLoading, error }
}
