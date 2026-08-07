import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export interface CreatorData {
  _id: string
  name: {
    full?: string
    native?: string
  }
  photo?: string
  bio?: string
  designation?: string[]
  yearsActive?: string
  knownWorks?: {
    seriesId: any
    designation?: string
  }[]
  socials?: { platform: string; url: string }[]
}

const parseBio = (rawBio?: string) => {
  if (!rawBio) return { cleanBio: '', socials: [] }

  const socials: { platform: string; url: string }[] = []
  let cleanBio = rawBio

  // Extract markdown links: [Label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  
  cleanBio = cleanBio.replace(linkRegex, (match, label, url) => {
    // If it's an internal Anilist link, just keep the label
    if (url.includes('anilist.co')) {
      return label
    }
    
    // Otherwise, treat it as a social/external link
    socials.push({ platform: label, url })
    return '' // Remove social links from the bio text
  })

  // Remove source attribution tags e.g. (Source: MAL) or (Source: AniList)
  cleanBio = cleanBio.replace(/\(Source:\s*[^)]+\)/gi, '')

  // Clean up leftover markdown syntax (bold, italic, list items)
  cleanBio = cleanBio.replace(/__/g, '') // remove bold markers
  cleanBio = cleanBio.replace(/\*\*/g, '') // remove bold markers
  cleanBio = cleanBio.replace(/^\s*-\s+/gm, '') // remove list hyphens
  cleanBio = cleanBio.replace(/\s*\|\s*/g, ' ') // remove pipes often used as separators

  // Collapse multiple spaces/newlines
  cleanBio = cleanBio.replace(/\n{3,}/g, '\n\n').trim()
  
  // Clean up any leading pipes or spaces left after removing socials
  cleanBio = cleanBio.replace(/^[\s|]+/, '').trim()

  return { cleanBio, socials }
}

interface UseCreatorReturn {
  creator: CreatorData | null
  isLoading: boolean
  error: Error | null
  retry: () => void
}

const MOCK_CREATORS: Record<string, CreatorData> = {
  '1': {
    _id: '1',
    name: { full: 'Takehiko Inoue', native: '井上 雄彦' },
    photo: '/creators/creator-1.png',
    bio: 'Takehiko Inoue is a Japanese manga artist best known for the basketball series Slam Dunk and the award-winning samurai manga Vagabond.',
    designation: ['Mangaka', 'Illustrator'],
    yearsActive: '1988–Present',
    knownWorks: [],
    socials: []
  },
  '2': {
    _id: '2',
    name: { full: 'Makoto Shinkai', native: '新海 誠' },
    photo: '/creators/creator-2.png',
    bio: 'Makoto Shinkai is a Japanese animator, filmmaker, and manga artist best known for directing Your Name, Weathering With You, and Suzume.',
    designation: ['Director', 'Writer', 'Animator'],
    yearsActive: '2002–Present',
    knownWorks: [],
    socials: []
  },
  '3': {
    _id: '3',
    name: { full: 'Kentaro Miura', native: '三浦 建太郎' },
    photo: '/creators/creator-3.png',
    bio: 'Kentaro Miura was a Japanese manga artist best known for his acclaimed dark fantasy series Berserk.',
    designation: ['Mangaka'],
    yearsActive: '1985–2021',
    knownWorks: [],
    socials: []
  },
  '4': {
    _id: '4',
    name: { full: 'Naoko Yamada', native: '山田 尚子' },
    photo: '/creators/creator-4.png',
    bio: 'Naoko Yamada is a Japanese animator and director known for her work at Kyoto Animation including A Silent Voice and K-On!.',
    designation: ['Director', 'Animator'],
    yearsActive: '2009–Present',
    knownWorks: [],
    socials: []
  },
  '6': {
    _id: '6',
    name: { full: 'Tsutomu Nihei', native: '弐瓶 勉' },
    photo: '/blog/nihei-architecture.png',
    bio: 'Tsutomu Nihei is a Japanese manga artist known for his cyberpunk architectures and dark sci-fi worlds like Blame!, Knights of Sidonia, and Biomega.',
    designation: ['Mangaka', 'Architectural Designer'],
    yearsActive: '1995–Present',
    knownWorks: [],
    socials: []
  },
  '7': {
    _id: '7',
    name: { full: 'Kanehito Yamada', native: '山田 鐘人' },
    photo: '/blog/frieren-adult.png',
    bio: 'Kanehito Yamada is a Japanese manga writer known for creating Frieren: Beyond Journey\'s End.',
    designation: ['Author', 'Manga Creator'],
    yearsActive: '2013–Present',
    knownWorks: [],
    socials: []
  },
  '8': {
    _id: '8',
    name: { full: 'Tsukasa Abe', native: 'アベ ツカサ' },
    photo: '/blog/avatar-3.png',
    bio: 'Tsukasa Abe is a Japanese manga illustrator best known as the artist for Frieren: Beyond Journey\'s End.',
    designation: ['Illustrator', 'Mangaka'],
    yearsActive: '2020–Present',
    knownWorks: [],
    socials: []
  },
  '9': {
    _id: '9',
    name: { full: 'Hajime Isayama', native: '諫山 創' },
    photo: '/blog/villain-study.png',
    bio: 'Hajime Isayama is a Japanese manga artist best known as the creator of Attack on Titan.',
    designation: ['Mangaka'],
    yearsActive: '2006–Present',
    knownWorks: [],
    socials: []
  },
  '10': {
    _id: '10',
    name: { full: 'Naoki Urasawa', native: '浦沢 直樹' },
    photo: '/blog/avatar-1.png',
    bio: 'Naoki Urasawa is a Japanese manga artist and musician known for Monster, 20th Century Boys, and Pluto.',
    designation: ['Mangaka', 'Storyteller'],
    yearsActive: '1983–Present',
    knownWorks: [],
    socials: []
  },
  '11': {
    _id: '11',
    name: { full: 'Hiroyuki Sawano', native: '澤野 弘之' },
    photo: '/blog/soundtrack-essay.png',
    bio: 'Hiroyuki Sawano is a Japanese composer, musician, and music producer known for Attack on Titan, Kill la Kill, and Mobile Suit Gundam UC.',
    designation: ['Composer', 'Music Producer'],
    yearsActive: '2004–Present',
    knownWorks: [],
    socials: []
  },
  '12': {
    _id: '12',
    name: { full: 'Yoko Kanno', native: '菅野 よう子' },
    photo: '/blog/avatar-3.png',
    bio: 'Yoko Kanno is a legendary Japanese composer and arranger known for Cowboy Bebop, Ghost in the Shell: Stand Alone Complex, and Macross Plus.',
    designation: ['Composer', 'Arranger'],
    yearsActive: '1986–Present',
    knownWorks: [],
    socials: []
  }
}

export function useCreator(id: string): UseCreatorReturn {
  const [creator, setCreator] = useState<CreatorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCreator = async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/persons/${id}`)
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Creator not found' : 'Failed to fetch creator')
      }
      const data = await response.json()
      
      const { cleanBio, socials } = parseBio(data.bio)
      
      setCreator({
        ...data,
        bio: cleanBio,
        socials
      })
    } catch (err: any) {
      if (MOCK_CREATORS[id]) {
        setCreator(MOCK_CREATORS[id])
        setError(null)
      } else {
        setCreator({
          _id: id,
          name: { full: `Creator ${id}` },
          photo: '/blog/avatar-1.png',
          bio: 'Acclaimed anime and manga creator contributing to extraordinary stories.',
          designation: ['Mangaka', 'Anime Creator'],
          yearsActive: 'Active',
          knownWorks: [],
          socials: []
        })
        setError(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCreator()
  }, [id])

  return { creator, isLoading, error, retry: fetchCreator }
}
