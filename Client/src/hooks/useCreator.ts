import { useState, useEffect } from 'react'

export interface CreatorData {
  id: string
  name: string
  avatarUrl: string
  bannerUrl: string
  roles: string[]
  country: string | null
  bio: string
  activeYears: { start: number; end: number | 'present' }
  studios: string[]
  socials: { platform: string; url: string }[]
  knownWorks: {
    id: string
    title: string
    coverUrl: string
    rating: number
    year: number
    genres: string[]
    role: string
  }[]
  spotlightWork: {
    id: string
    title: string
    coverUrl: string
    rating: number
    year: number
    description: string
    role: string
  }
  achievements: { icon: string; label: string }[]
  stats: { followers: number; avgRating: number; totalWorks: number }
  relatedCreators: { id: string; name: string; avatarUrl: string; role: string }[]
}

const mockCreators: Record<string, CreatorData> = {
  '1': {
    id: '1',
    name: 'Akira Toriyama',
    avatarUrl: `https://picsum.photos/seed/akira-toriyama/400/400`,
    bannerUrl: `https://picsum.photos/seed/akira-banner-1/1200/400`,
    roles: ['Character Designer', 'Manga Artist'],
    country: 'Japan',
    bio: `Akira Toriyama is a legendary manga artist and character designer who revolutionized the industry with his iconic character designs and dynamic storytelling. Born in 1955, Toriyama began his career in the late 1970s and quickly rose to prominence with his unique artistic style characterized by expressive characters and intricate backgrounds.\n\nHe is best known for creating Dragon Ball, one of the best-selling manga series of all time, which spawned numerous anime adaptations, films, and spin-offs. His influence extends far beyond manga, affecting animation, video game design, and pop culture globally.\n\nBeyond Dragon Ball, Toriyama has worked on numerous other successful series including Dragon Quest character design, which he contributed to for decades. His characters are instantly recognizable and have become synonymous with a generation of anime fans.\n\nToriyama's legacy continues to influence contemporary artists and designers. His dedication to his craft and innovative approach to character design have set standards that remain relevant even today, decades after his major breakthrough works.`,
    activeYears: { start: 1978, end: 'present' },
    studios: ['Shueisha', 'Toei Animation', 'Akira Toriyama Studio'],
    socials: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
    knownWorks: [
      {
        id: 'w1',
        title: 'Dragon Ball',
        coverUrl: `https://picsum.photos/seed/dragon-ball/400/600`,
        rating: 9.2,
        year: 1986,
        genres: ['Action', 'Adventure', 'Comedy'],
        role: 'Character Designer',
      },
      {
        id: 'w2',
        title: 'Dragon Ball Z',
        coverUrl: `https://picsum.photos/seed/dragon-ball-z/400/600`,
        rating: 8.9,
        year: 1989,
        genres: ['Action', 'Adventure'],
        role: 'Character Designer',
      },
      {
        id: 'w3',
        title: 'Dr. Slump',
        coverUrl: `https://picsum.photos/seed/dr-slump/400/600`,
        rating: 8.1,
        year: 1980,
        genres: ['Comedy', 'Sci-Fi'],
        role: 'Character Designer',
      },
      {
        id: 'w4',
        title: 'Sandland',
        coverUrl: `https://picsum.photos/seed/sandland/400/600`,
        rating: 7.8,
        year: 2000,
        genres: ['Action', 'Adventure'],
        role: 'Author',
      },
      {
        id: 'w5',
        title: 'Dragon Quest',
        coverUrl: `https://picsum.photos/seed/dragon-quest/400/600`,
        rating: 8.7,
        year: 1986,
        genres: ['RPG', 'Fantasy'],
        role: 'Character Designer',
      },
      {
        id: 'w6',
        title: 'Needy Streamer Overload',
        coverUrl: `https://picsum.photos/seed/needy-1/400/600`,
        rating: 7.5,
        year: 2012,
        genres: ['Comedy', 'Drama'],
        role: 'Character Designer',
      },
      {
        id: 'w7',
        title: 'Jaco the Galactic Patrolman',
        coverUrl: `https://picsum.photos/seed/jaco-patrol/400/600`,
        rating: 7.9,
        year: 2013,
        genres: ['Comedy', 'Sci-Fi'],
        role: 'Author',
      },
      {
        id: 'w8',
        title: 'Super Editors',
        coverUrl: `https://picsum.photos/seed/super-editors/400/600`,
        rating: 7.3,
        year: 2008,
        genres: ['Comedy'],
        role: 'Contributor',
      },
      {
        id: 'w9',
        title: 'All-Purpose Cultural Cat-Girl Natsume',
        coverUrl: `https://picsum.photos/seed/natsume-girl/400/600`,
        rating: 7.6,
        year: 1996,
        genres: ['Comedy', 'Fantasy'],
        role: 'Character Designer',
      },
      {
        id: 'w10',
        title: 'Amazing Adventures',
        coverUrl: `https://picsum.photos/seed/amazing-adv/400/600`,
        rating: 7.2,
        year: 1990,
        genres: ['Action', 'Adventure'],
        role: 'Illustrator',
      },
    ],
    spotlightWork: {
      id: 'spotlight-1',
      title: 'Dragon Ball',
      coverUrl: `https://picsum.photos/seed/dragon-ball-hero/400/600`,
      rating: 9.2,
      year: 1986,
      description:
        'The groundbreaking series that defined an era. Dragon Ball introduced the world to Goku and revolutionized action manga with its innovative panel layouts and character development.',
      role: 'Creator',
    },
    achievements: [
      { icon: '🏆', label: '3x Eisner Award Nominee' },
      { icon: '📚', label: '200M+ Books Sold' },
      { icon: '🎬', label: '50+ Anime Adaptations' },
      { icon: '⭐', label: 'Icon of Manga Industry' },
    ],
    stats: {
      followers: 2100000,
      avgRating: 8.4,
      totalWorks: 45,
    },
    relatedCreators: [
      {
        id: '2',
        name: 'Yoshihiro Togashi',
        avatarUrl: `https://picsum.photos/seed/yoshihiro-togashi/400/400`,
        role: 'Manga Artist',
      },
      {
        id: '3',
        name: 'Masashi Kishimoto',
        avatarUrl: `https://picsum.photos/seed/masashi-kishimoto/400/400`,
        role: 'Manga Artist',
      },
      {
        id: '4',
        name: 'Oda Eiichiro',
        avatarUrl: `https://picsum.photos/seed/oda-eiichiro/400/400`,
        role: 'Manga Artist',
      },
      {
        id: '5',
        name: 'Hideaki Anno',
        avatarUrl: `https://picsum.photos/seed/hideaki-anno/400/400`,
        role: 'Director',
      },
      {
        id: '6',
        name: 'Kazuki Takahashi',
        avatarUrl: `https://picsum.photos/seed/kazuki-takahashi/400/400`,
        role: 'Manga Artist',
      },
      {
        id: '7',
        name: 'Nobuhiro Watsuki',
        avatarUrl: `https://picsum.photos/seed/nobuhiro-watsuki/400/400`,
        role: 'Manga Artist',
      },
    ],
  },
}

interface UseCreatorReturn {
  creator: CreatorData | null
  isLoading: boolean
  error: Error | null
  retry: () => void
}

export function useCreator(id: string): UseCreatorReturn {
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCreator = () => {
    setIsLoading(true)
    setError(null)

    // Simulate API call with delay
    setTimeout(() => {
      const data = mockCreators[id]
      if (data) {
        setCreator(data)
        setIsLoading(false)
      } else {
        setError(new Error('Creator not found'))
        setIsLoading(false)
      }
    }, 300)
  }

  useEffect(() => {
    fetchCreator()
  }, [id])

  return { creator, isLoading, error, retry: fetchCreator }
}
