import { useState, useEffect } from 'react'

export interface Staff {
  id: string
  name: string
  avatarUrl: string
  role: string
  description: string
  country?: string
}

export interface Character {
  id: string
  name: string
  portraitUrl: string
  role: 'Main' | 'Supporting' | 'Background'
}

export interface SeriesRelated {
  id: string
  title: string
  nativeTitle: string
  romanizedTitle: string
  coverUrl: string
  rating: number
  userCount: number
  favoritesCount: number
  mediaType: string
  genres: string[]
}

export interface Series {
  id: string
  title: string
  nativeTitle: string
  romanizedTitle: string
  bannerUrl: string
  coverUrl: string
  rating: number
  userCount: number
  favoritesCount: number
  synopsis: string
  mediaType: string
  status: string
  genres: string[]
  demographic: string
  releaseDate: string
  endDate: string
  episodeCount?: number
  chapterCount?: number
  volumeCount?: number
  studio: string
  author: string
  artist: string
  publisher: string
  sourceMaterial: string
  originalLanguage: string
  avgRating: number
  communityScore: number
  popularityRank: number
  favorites: number
  members: number
  staff: Staff[]
  characters: Character[]
  related: {
    prequels: SeriesRelated[]
    sequels: SeriesRelated[]
    movies: SeriesRelated[]
    ovas: SeriesRelated[]
    specials: SeriesRelated[]
    spinOffs: SeriesRelated[]
    sideStories: SeriesRelated[]
    adaptations: SeriesRelated[]
  }
}

const generateMockSeries = (id: string): Series => {
  const baseId = parseInt(id) || 1
  return {
    id,
    title: 'Attack on Titan',
    nativeTitle: '進撃の巨人',
    romanizedTitle: 'Shingeki no Kyojin',
    bannerUrl: `https://picsum.photos/seed/${id}-banner/1200/400`,
    coverUrl: `https://picsum.photos/seed/${id}-cover/300/400`,
    rating: 4.8,
    userCount: 2500000,
    favoritesCount: 850000,
    synopsis: `In a world where giant humanoid creatures called Titans roam outside city walls and consume humans seemingly without reason, a young boy named Eren Yeager witnesses a Titan kill his mother. This traumatic event leads Eren to swear revenge on all Titans and join the military with the goal of eradicating them.\n\nEren joins the Survey Corps, an elite military unit dedicated to exploring the outside world and studying Titans. Alongside his childhood friends Mikasa and Armin, Eren discovers that Titans can actually be intelligent and that there are mysteries far deeper than humanity initially understood.\n\nAs Eren progresses through the military ranks, shocking truths about the nature of Titans, the world, and humanity's place in it begin to unfold. The series explores themes of freedom, sacrifice, and the moral ambiguity of war.`,
    mediaType: 'Anime',
    status: 'Completed',
    genres: ['Action', 'Drama', 'Fantasy', 'Military', 'Mystery', 'Shounen', 'Super Power'],
    demographic: 'Shounen',
    releaseDate: '2013-04-07',
    endDate: '2023-11-05',
    episodeCount: 139,
    studio: 'Wit Studio / MAPPA',
    author: 'Hajime Isayama',
    artist: 'Hajime Isayama',
    publisher: 'Kodansha',
    sourceMaterial: 'Manga',
    originalLanguage: 'Japanese',
    avgRating: 8.9,
    communityScore: 9.1,
    popularityRank: 1,
    favorites: 850000,
    members: 2500000,
    staff: [
      {
        id: 'staff-1',
        name: 'Masashi Koizuka',
        avatarUrl: `https://picsum.photos/seed/staff-1/100/100`,
        role: 'Director',
        description: 'Director of many episodes',
        country: 'Japan',
      },
      {
        id: 'staff-2',
        name: 'Hiroyuki Tanaka',
        avatarUrl: `https://picsum.photos/seed/staff-2/100/100`,
        role: 'Producer',
        description: 'Lead producer',
        country: 'Japan',
      },
      {
        id: 'staff-3',
        name: 'Takahiro Ohkura',
        avatarUrl: `https://picsum.photos/seed/staff-3/100/100`,
        role: 'Music Composer',
        description: 'Original soundtrack composer',
        country: 'Japan',
      },
      {
        id: 'staff-4',
        name: 'Tomohiro Kishi',
        avatarUrl: `https://picsum.photos/seed/staff-4/100/100`,
        role: 'Character Designer',
        description: 'Main character designer',
        country: 'Japan',
      },
      {
        id: 'staff-5',
        name: 'Takahiro Osawa',
        avatarUrl: `https://picsum.photos/seed/staff-5/100/100`,
        role: 'Animation Director',
        description: 'Lead animation director',
        country: 'Japan',
      },
      {
        id: 'staff-6',
        name: 'Yuki Kajiura',
        avatarUrl: `https://picsum.photos/seed/staff-6/100/100`,
        role: 'Sound Director',
        description: 'Sound design and supervision',
        country: 'Japan',
      },
    ],
    characters: [
      {
        id: 'char-1',
        name: 'Eren Yeager',
        portraitUrl: `https://picsum.photos/seed/char-1/150/200`,
        role: 'Main',
      },
      {
        id: 'char-2',
        name: 'Mikasa Ackerman',
        portraitUrl: `https://picsum.photos/seed/char-2/150/200`,
        role: 'Main',
      },
      {
        id: 'char-3',
        name: 'Armin Arlert',
        portraitUrl: `https://picsum.photos/seed/char-3/150/200`,
        role: 'Main',
      },
      {
        id: 'char-4',
        name: 'Levi Ackerman',
        portraitUrl: `https://picsum.photos/seed/char-4/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-5',
        name: 'Hange Zoë',
        portraitUrl: `https://picsum.photos/seed/char-5/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-6',
        name: 'Erwin Smith',
        portraitUrl: `https://picsum.photos/seed/char-6/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-7',
        name: 'Jean Kirstein',
        portraitUrl: `https://picsum.photos/seed/char-7/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-8',
        name: 'Connie Springer',
        portraitUrl: `https://picsum.photos/seed/char-8/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-9',
        name: 'Sasha Blouse',
        portraitUrl: `https://picsum.photos/seed/char-9/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-10',
        name: 'Historia Reiss',
        portraitUrl: `https://picsum.photos/seed/char-10/150/200`,
        role: 'Supporting',
      },
      {
        id: 'char-11',
        name: 'Reiner Braun',
        portraitUrl: `https://picsum.photos/seed/char-11/150/200`,
        role: 'Background',
      },
      {
        id: 'char-12',
        name: 'Annie Leonhart',
        portraitUrl: `https://picsum.photos/seed/char-12/150/200`,
        role: 'Background',
      },
    ],
    related: {
      prequels: [],
      sequels: [],
      movies: [
        {
          id: 'movie-1',
          title: 'Attack on Titan Movie 1: Guren no Yumiya',
          nativeTitle: '進撃の巨人 映画 -紅蓮の弓矢-',
          romanizedTitle: 'Attack on Titan: Crimson Bow and Arrow',
          coverUrl: `https://picsum.photos/seed/movie-1/300/400`,
          rating: 4.6,
          userCount: 450000,
          favoritesCount: 125000,
          mediaType: 'Movie',
          genres: ['Action', 'Drama', 'Fantasy'],
        },
        {
          id: 'movie-2',
          title: 'Attack on Titan Movie 2: Jiyuu no Tsubasa',
          nativeTitle: '進撃の巨人 映画 -自由の翼-',
          romanizedTitle: 'Attack on Titan: Wings of Freedom',
          coverUrl: `https://picsum.photos/seed/movie-2/300/400`,
          rating: 4.5,
          userCount: 420000,
          favoritesCount: 115000,
          mediaType: 'Movie',
          genres: ['Action', 'Drama', 'Fantasy'],
        },
      ],
      ovas: [
        {
          id: 'ova-1',
          title: 'Attack on Titan: Lost Girls',
          nativeTitle: '進撃の巨人 Lost Girls',
          romanizedTitle: 'Attack on Titan: Lost Girls',
          coverUrl: `https://picsum.photos/seed/ova-1/300/400`,
          rating: 4.4,
          userCount: 280000,
          favoritesCount: 85000,
          mediaType: 'OVA',
          genres: ['Action', 'Drama'],
        },
      ],
      specials: [],
      spinOffs: [],
      sideStories: [],
      adaptations: [],
    },
  }
}

export function useSeries(id: string) {
  const [data, setData] = useState<Series | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        const series = generateMockSeries(id)
        setData(series)
        setError(null)
      } catch (err) {
        setError('Failed to load series data')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [id])

  return { data, isLoading, error }
}
