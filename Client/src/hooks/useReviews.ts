import { useState, useEffect } from 'react'

export interface Review {
  id: string
  avatarUrl: string
  username: string
  rating: number
  title: string
  body: string
  hasSpoilers: boolean
  date: string
  likes: number
  replies: number
}

const generateMockReviews = (seriesId: string): Review[] => {
  return [
    {
      id: 'review-1',
      avatarUrl: `https://picsum.photos/seed/user-1/40/40`,
      username: 'TitanSlayer',
      rating: 10,
      title: 'A Masterpiece of Storytelling',
      body: 'Attack on Titan is an absolute masterpiece. The character development is incredible, the plot twists are mind-bending, and the ending was perfectly executed. Hajime Isayama created something truly special. The anime adaptation by Wit Studio and MAPPA was phenomenal, bringing the manga to life with stunning animation and sound design. Every episode leaves you wanting more. Highly recommend to anyone who enjoys action, mystery, and deep storytelling.',
      hasSpoilers: false,
      date: '2024-01-15',
      likes: 1240,
      replies: 45,
    },
    {
      id: 'review-2',
      avatarUrl: `https://picsum.photos/seed/user-2/40/40`,
      username: 'AnimeEnthusiast',
      rating: 9,
      title: 'Exceptional Series with Minor Pacing Issues',
      body: 'This series is exceptional in almost every way. The narrative complexity, character arcs, and world-building are top-tier. Some viewers might find certain pacing issues in the later seasons, but they don\'t detract significantly from the overall quality. The final season brings the story to a satisfying conclusion with emotional weight and consequences. Definitely one of the best anime of the decade.',
      hasSpoilers: false,
      date: '2023-12-20',
      likes: 856,
      replies: 32,
    },
    {
      id: 'review-3',
      avatarUrl: `https://picsum.photos/seed/user-3/40/40`,
      username: 'MangaVsAnime',
      rating: 8,
      title: 'Great Anime, But Read the Manga First',
      body: 'The anime is excellent, but if you have the time, read the manga first. The manga goes into more detail and provides better pacing for some story arcs. That being said, the anime adaptation is gorgeous and the voice acting is superb. It\'s a faithful and well-executed adaptation overall.',
      hasSpoilers: false,
      date: '2023-11-10',
      likes: 623,
      replies: 28,
    },
    {
      id: 'review-4',
      avatarUrl: `https://picsum.photos/seed/user-4/40/40`,
      username: 'SpoilerWarning',
      rating: 10,
      title: 'The Ending Redefines Everything',
      body: 'I cannot praise the final season enough. The ending completely changes how you view the entire series. The moral complexity, the character revelations, and the way everything comes together is absolutely brilliant. This is required viewing for anime fans.',
      hasSpoilers: true,
      date: '2023-10-30',
      likes: 2100,
      replies: 156,
    },
    {
      id: 'review-5',
      avatarUrl: `https://picsum.photos/seed/user-5/40/40`,
      username: 'ActionFan',
      rating: 9,
      title: 'Intense Action Sequences',
      body: 'The action sequences are some of the best I\'ve seen in anime. The ODM gear combat, the titan fights, and the overall choreography is masterful. Combined with excellent sound design and music, these moments are absolutely thrilling. Even between action scenes, the character drama keeps you engaged.',
      hasSpoilers: false,
      date: '2023-10-15',
      likes: 445,
      replies: 18,
    },
  ]
}

export function useReviews(seriesId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [sortBy, setSortBy] = useState<'helpful' | 'rating' | 'newest' | 'oldest'>('helpful')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const mockReviews = generateMockReviews(seriesId)
        setReviews(mockReviews)
        setError(null)
      } catch (err) {
        setError('Failed to load reviews')
        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [seriesId])

  return { reviews, sortBy, setSortBy, isLoading, error }
}
