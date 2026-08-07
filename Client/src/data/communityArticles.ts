import type { Article } from '@/hooks/useArticle'

export type CommunityArticlePreview = {
  id: number
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  avatar: string
  date: string
  readTime: string
  likes: number
  featured?: boolean
}

const userPublishedArticles: CommunityArticlePreview[] = []

export function registerCommunityArticle(article: CommunityArticlePreview) {
  userPublishedArticles.unshift(article)
}

export function getCommunityArticlePreviews(): CommunityArticlePreview[] {
  return [...userPublishedArticles, ...COMMUNITY_ARTICLES]
}

export const COMMUNITY_ARTICLES: CommunityArticlePreview[] = [
  {
    id: 1,
    title: 'The Architectural Genius of Tsutomu Nihei',
    excerpt:
      'From Blame! to Biomega, Nihei turns concrete and shadow into narrative. We trace how his background as an architect built the most oppressive, awe-inspiring worlds in manga history.',
    category: 'Analysis',
    image: '/blog/nihei-architecture.png',
    author: 'Mika Aozora',
    avatar: '/blog/avatar-1.png',
    date: 'Jun 28, 2026',
    readTime: '11 min read',
    likes: 842,
    featured: true,
  },
  {
    id: 2,
    title: 'Why Frieren Resonates with Adult Audiences',
    excerpt:
      'A meditation on grief, memory, and the quiet ache of outliving those you love. Frieren trades spectacle for stillness — and that is exactly why it lands.',
    category: 'Essays',
    image: '/blog/frieren-adult.png',
    author: 'Kenji Sato',
    avatar: '/blog/avatar-2.png',
    date: 'Jun 24, 2026',
    readTime: '8 min read',
    likes: 1263,
    featured: true,
  },
  {
    id: 3,
    title: 'The Lost Art of the Splash Page',
    excerpt:
      'How master mangaka use a single full-bleed panel to stop time and steal your breath.',
    category: 'Manga Art',
    image: '/blog/panel-composition.png',
    author: 'Rei Tanaka',
    avatar: '/blog/avatar-3.png',
    date: 'Jun 20, 2026',
    readTime: '6 min read',
    likes: 517,
  },
  {
    id: 4,
    title: 'Sympathy for the Devil: Rewriting the Villain',
    excerpt:
      'The modern antagonist is no longer pure evil. A close read of the tragic villains redefining the genre.',
    category: 'Character Studies',
    image: '/blog/villain-study.png',
    author: 'Daichi Mori',
    avatar: '/blog/avatar-4.png',
    date: 'Jun 16, 2026',
    readTime: '9 min read',
    likes: 689,
  },
  {
    id: 5,
    title: 'In Praise of Slow: The Slice-of-Life Renaissance',
    excerpt:
      'Tea, sunlight, and nothing happening at all. Why the quietest shows have become our loudest comfort.',
    category: 'Reviews',
    image: '/blog/slice-of-life.png',
    author: 'Mika Aozora',
    avatar: '/blog/avatar-1.png',
    date: 'Jun 12, 2026',
    readTime: '5 min read',
    likes: 934,
  },
  {
    id: 6,
    title: 'Scores That Score: The Emotional Engineering of Anime OSTs',
    excerpt:
      'From Hiroyuki Sawano to Yoko Kanno, a study of how composers weaponize melody to break your heart on cue.',
    category: 'Soundtracks',
    image: '/blog/soundtrack-essay.png',
    author: 'Kenji Sato',
    avatar: '/blog/avatar-2.png',
    date: 'Jun 08, 2026',
    readTime: '7 min read',
    likes: 428,
  },
]

function parseReadTimeMinutes(readTime: string): number {
  const match = readTime.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 5
}

function parseDisplayDate(date: string): string {
  if (date === 'Just now') return new Date().toISOString().slice(0, 10)
  const parsed = Date.parse(date)
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10)
  }
  return '2026-06-01'
}

function slugifyAuthor(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

const ARTICLE_CREATORS_MAP: Record<number, Array<{ id: string; name: string; avatarUrl: string; role: string }>> = {
  1: [
    { id: '6', name: 'Tsutomu Nihei', avatarUrl: '/blog/nihei-architecture.png', role: 'Mangaka' },
  ],
  2: [
    { id: '7', name: 'Kanehito Yamada', avatarUrl: '/blog/frieren-adult.png', role: 'Author' },
    { id: '8', name: 'Tsukasa Abe', avatarUrl: '/blog/avatar-3.png', role: 'Artist' },
  ],
  3: [
    { id: '1', name: 'Takehiko Inoue', avatarUrl: '/creators/creator-1.png', role: 'Mangaka' },
    { id: '3', name: 'Kentaro Miura', avatarUrl: '/creators/creator-3.png', role: 'Mangaka' },
  ],
  4: [
    { id: '9', name: 'Hajime Isayama', avatarUrl: '/blog/villain-study.png', role: 'Mangaka' },
    { id: '10', name: 'Naoki Urasawa', avatarUrl: '/blog/avatar-1.png', role: 'Mangaka' },
  ],
  5: [
    { id: '4', name: 'Naoko Yamada', avatarUrl: '/creators/creator-4.png', role: 'Director' },
  ],
  6: [
    { id: '11', name: 'Hiroyuki Sawano', avatarUrl: '/blog/soundtrack-essay.png', role: 'Composer' },
    { id: '12', name: 'Yoko Kanno', avatarUrl: '/blog/avatar-3.png', role: 'Composer' },
  ],
}

export function communityPreviewToArticle(preview: CommunityArticlePreview): Article {
  const authorId = `author-${slugifyAuthor(preview.author)}`

  return {
    id: String(preview.id),
    title: preview.title,
    subtitle: preview.excerpt,
    coverUrl: preview.image,
    category: preview.category,
    author: {
      id: authorId,
      name: preview.author,
      avatarUrl: preview.avatar,
      bio: `${preview.author} writes for the Web Wonders community journal.`,
      articleCount: 12,
    },
    publishDate: parseDisplayDate(preview.date),
    readTimeMinutes: parseReadTimeMinutes(preview.readTime),
    likeCount: preview.likes,
    bookmarkCount: 0,
    isLiked: false,
    isBookmarked: false,
    body: [
      { type: 'paragraph', text: preview.excerpt },
      {
        type: 'paragraph',
        text: 'This piece is part of Community Voices — essays and deep dives from readers who care as much about craft as they care about the stories themselves. What follows expands on the ideas introduced above, with room for your own reactions in the comments.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Why this story matters',
      },
      {
        type: 'paragraph',
        text: `Whether you came for ${preview.category.toLowerCase()} or stayed for the argument, the through-line is the same: anime and manga reward patience. The best community writing slows down long enough to notice what the frame is doing, what the silence is saying, and why a single panel can carry more weight than a whole battle arc.`,
      },
    ],
    taggedCreators: ARTICLE_CREATORS_MAP[preview.id] || [
      { id: '1', name: 'Takehiko Inoue', avatarUrl: '/creators/creator-1.png', role: 'Mangaka' },
    ],
    taggedSeries: [],
    relatedArticles: COMMUNITY_ARTICLES.filter((item) => item.id !== preview.id)
      .slice(0, 4)
      .map((item) => ({
        id: String(item.id),
        title: item.title,
        coverUrl: item.image,
        author: {
          id: `author-${slugifyAuthor(item.author)}`,
          name: item.author,
          avatarUrl: item.avatar,
          bio: '',
          articleCount: 0,
        },
        publishDate: parseDisplayDate(item.date),
        readTimeMinutes: parseReadTimeMinutes(item.readTime),
        category: item.category,
      })),
  }
}

export function getCommunityArticleById(id: string): Article | null {
  const preview = getCommunityArticlePreviews().find((article) => String(article.id) === id)
  if (!preview) return null
  return communityPreviewToArticle(preview)
}
