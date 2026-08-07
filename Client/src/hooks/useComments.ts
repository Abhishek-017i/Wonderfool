import { useState, useEffect } from 'react'

export interface CommentReply {
  id: string
  avatarUrl: string
  username: string
  timestamp: string
  body: string
  likes: number
  replies: CommentReply[]
}

export interface Comment {
  id: string
  avatarUrl: string
  username: string
  timestamp: string
  body: string
  likes: number
  replies: CommentReply[]
}

const generateMockComments = (seriesId: string): Comment[] => {
  return [
    {
      id: 'comment-1',
      avatarUrl: `https://picsum.photos/seed/commenter-1/40/40`,
      username: 'TitanFan',
      timestamp: '2 hours ago',
      body: 'Just finished the series for the third time. Still getting chills from the ending. What a journey!',
      likes: 234,
      replies: [
        {
          id: 'reply-1-1',
          avatarUrl: `https://picsum.photos/seed/commenter-2/40/40`,
          username: 'ErenBelieve',
          timestamp: '1 hour ago',
          body: 'Same here! The character development is just insane.',
          likes: 45,
          replies: [],
        },
        {
          id: 'reply-1-2',
          avatarUrl: `https://picsum.photos/seed/commenter-3/40/40`,
          username: 'SurveyCorpMember',
          timestamp: '45 minutes ago',
          body: 'Which season did you enjoy the most?',
          likes: 12,
          replies: [],
        },
      ],
    },
    {
      id: 'comment-2',
      avatarUrl: `https://picsum.photos/seed/commenter-4/40/40`,
      username: 'AnimeNerd',
      timestamp: '5 hours ago',
      body: 'The soundtrack is absolutely incredible. Yamamoto Hiroyuki composed something truly special.',
      likes: 189,
      replies: [
        {
          id: 'reply-2-1',
          avatarUrl: `https://picsum.photos/seed/commenter-5/40/40`,
          username: 'MusicLover',
          timestamp: '4 hours ago',
          body: 'Agreed! The opening themes are all bangers.',
          likes: 67,
          replies: [],
        },
      ],
    },
    {
      id: 'comment-3',
      avatarUrl: `https://picsum.photos/seed/commenter-6/40/40`,
      username: 'PlotTwistGuy',
      timestamp: '8 hours ago',
      body: 'I still can\'t believe how everything was connected. The foreshadowing throughout the series is mind-blowing.',
      likes: 412,
      replies: [
        {
          id: 'reply-3-1',
          avatarUrl: `https://picsum.photos/seed/commenter-7/40/40`,
          username: 'TheorycrAfter',
          timestamp: '7 hours ago',
          body: 'Have you noticed the symbolism in episode 1? Absolute genius!',
          likes: 89,
          replies: [
            {
              id: 'reply-3-1-1',
              avatarUrl: `https://picsum.photos/seed/commenter-8/40/40`,
              username: 'PlotTwistGuy',
              timestamp: '6 hours ago',
              body: 'I need to do a full rewatch with this in mind.',
              likes: 23,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 'comment-4',
      avatarUrl: `https://picsum.photos/seed/commenter-9/40/40`,
      username: 'NewbieWatcher',
      timestamp: '12 hours ago',
      body: 'Just started watching! I\'m on episode 15 and I\'m already obsessed. No spoilers please!',
      likes: 156,
      replies: [
        {
          id: 'reply-4-1',
          avatarUrl: `https://picsum.photos/seed/commenter-10/40/40`,
          username: 'VeteranViewer',
          timestamp: '11 hours ago',
          body: 'No spoilers from us! Just know that it only gets better. Enjoy the ride!',
          likes: 201,
          replies: [],
        },
      ],
    },
  ]
}

export function useComments(seriesId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockComments = generateMockComments(seriesId)
        setComments(mockComments)
        setError(null)
      } catch (err) {
        setError('Failed to load comments')
        setComments([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [seriesId])

  return { comments, isLoading, error }
}
