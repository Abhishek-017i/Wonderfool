import { useState, useEffect } from 'react'

export interface Author {
  id: string
  name: string
  avatarUrl: string
  bio: string
  articleCount: number
}

export interface BodyBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'image' | 'list'
  text?: string
  level?: number
  url?: string
  caption?: string
  ordered?: boolean
  items?: string[]
}

export interface Creator {
  id: string
  name: string
  avatarUrl: string
  role: string
}

export interface Series {
  id: string
  title: string
  description: string
  coverUrl: string
  articleCount: number
  color: string
}

export interface Article {
  id: string
  title: string
  subtitle: string
  coverUrl: string
  category: string
  author: Author
  publishDate: string
  readTimeMinutes: number
  likeCount: number
  bookmarkCount: number
  isLiked: boolean
  isBookmarked: boolean
  body: BodyBlock[]
  taggedCreators: Creator[]
  taggedSeries: Series[]
  relatedArticles: RelatedArticle[]
}

export interface RelatedArticle {
  id: string
  title: string
  coverUrl: string
  author: Author
  publishDate: string
  readTimeMinutes: number
  category: string
}

export function useArticle(id: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // Mock data
        const mockArticle: Article = {
          id,
          title: 'The Art of Thoughtful Design in Digital Products',
          subtitle: 'How minimalism and intention converge to create meaningful user experiences',
          coverUrl: `https://picsum.photos/seed/${id}/1200/600`,
          category: 'Design',
          author: {
            id: 'author-1',
            name: 'Sarah Chen',
            avatarUrl: `https://picsum.photos/seed/author-${id}/96/96`,
            bio: 'Design strategist focused on human-centered innovation. Passionate about creating products that matter.',
            articleCount: 24,
          },
          publishDate: '2024-07-15',
          readTimeMinutes: 12,
          likeCount: 342,
          bookmarkCount: 128,
          isLiked: false,
          isBookmarked: false,
          body: [
            {
              type: 'paragraph',
              text: 'In the ever-evolving landscape of digital design, one principle stands above all others: intentionality. Every pixel, every interaction, every animation should serve a purpose. When we strip away the unnecessary and focus on what truly matters, we create experiences that resonate with users on a deeper level.',
            },
            {
              type: 'heading',
              level: 2,
              text: 'The Power of Constraint',
            },
            {
              type: 'paragraph',
              text: 'Constraints are not limitations—they are liberators. When a designer has unlimited canvas and unlimited possibilities, the result is often overwhelming. But when working within boundaries, creativity flourishes. Consider the beauty of a single color palette, or the elegance of whitespace. These limitations force us to be more thoughtful about our choices.',
            },
            {
              type: 'quote',
              text: 'Simplicity is the ultimate sophistication. It is not about removing everything until nothing is left, but removing everything until only what matters remains.',
            },
            {
              type: 'heading',
              level: 2,
              text: 'From Concept to Implementation',
            },
            {
              type: 'paragraph',
              text: 'The journey from concept to final product requires balancing artistic vision with technical reality. We must understand both the why and the how. Why does this interaction matter to the user? How can we implement it in a way that is performant and accessible?',
            },
            {
              type: 'image',
              url: `https://picsum.photos/seed/article-${id}-1/1000/500`,
              caption: 'A carefully composed interface demonstrating thoughtful design principles.',
            },
            {
              type: 'heading',
              level: 2,
              text: 'Key Principles for Success',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Start with research: understand your users and their contexts',
                'Define clear goals: what problems are you solving?',
                'Iterate relentlessly: design is never finished, only abandoned',
                'Test with real users: your assumptions will be challenged',
                'Document decisions: future you will thank present you',
              ],
            },
            {
              type: 'paragraph',
              text: 'When we approach design with this mindset, something magical happens. We stop designing for ourselves and start designing for the humans on the other side of the screen. We create products that are not just beautiful, but meaningful.',
            },
          ],
          taggedCreators: [
            {
              id: 'creator-1',
              name: 'Marcus Reid',
              avatarUrl: `https://picsum.photos/seed/creator-1/96/96`,
              role: 'Product Designer',
            },
            {
              id: 'creator-2',
              name: 'Elena Vasquez',
              avatarUrl: `https://picsum.photos/seed/creator-2/96/96`,
              role: 'Design Systems Lead',
            },
            {
              id: 'creator-3',
              name: 'James Park',
              avatarUrl: `https://picsum.photos/seed/creator-3/96/96`,
              role: 'UX Researcher',
            },
          ],
          taggedSeries: [
            {
              id: 'series-1',
              title: 'Design Fundamentals',
              description: 'Core principles of modern design',
              coverUrl: `https://picsum.photos/seed/series-1/300/200`,
              articleCount: 8,
              color: '#d4a574',
            },
            {
              id: 'series-2',
              title: 'User Experience Deep Dive',
              description: 'Exploring UX research and implementation',
              coverUrl: `https://picsum.photos/seed/series-2/300/200`,
              articleCount: 12,
              color: '#d4a574',
            },
            {
              id: 'series-3',
              title: 'Design Systems',
              description: 'Building scalable design systems',
              coverUrl: `https://picsum.photos/seed/series-3/300/200`,
              articleCount: 6,
              color: '#d4a574',
            },
            {
              id: 'series-4',
              title: 'Web Design Trends',
              description: 'Latest trends in web design',
              coverUrl: `https://picsum.photos/seed/series-4/300/200`,
              articleCount: 15,
              color: '#d4a574',
            },
          ],
          relatedArticles: [
            {
              id: 'article-2',
              title: 'Accessibility: Building for Everyone',
              coverUrl: `https://picsum.photos/seed/article-2/300/200`,
              author: { ...({} as Author), name: 'Alex Morgan', avatarUrl: `https://picsum.photos/seed/author-2/96/96` },
              publishDate: '2024-07-10',
              readTimeMinutes: 9,
              category: 'Design',
            },
            {
              id: 'article-3',
              title: 'Color Theory in Digital Interfaces',
              coverUrl: `https://picsum.photos/seed/article-3/300/200`,
              author: { ...({} as Author), name: 'Sofia Rivera', avatarUrl: `https://picsum.photos/seed/author-3/96/96` },
              publishDate: '2024-07-08',
              readTimeMinutes: 11,
              category: 'Design',
            },
            {
              id: 'article-4',
              title: 'Typography: The Silent Communicator',
              coverUrl: `https://picsum.photos/seed/article-4/300/200`,
              author: { ...({} as Author), name: 'David Kim', avatarUrl: `https://picsum.photos/seed/author-4/96/96` },
              publishDate: '2024-07-05',
              readTimeMinutes: 8,
              category: 'Design',
            },
            {
              id: 'article-5',
              title: 'Motion Design: Breathing Life into UX',
              coverUrl: `https://picsum.photos/seed/article-5/300/200`,
              author: { ...({} as Author), name: 'Lisa Wong', avatarUrl: `https://picsum.photos/seed/author-5/96/96` },
              publishDate: '2024-07-01',
              readTimeMinutes: 13,
              category: 'Design',
            },
            {
              id: 'article-6',
              title: 'Prototyping: From Ideas to Reality',
              coverUrl: `https://picsum.photos/seed/article-6/300/200`,
              author: { ...({} as Author), name: 'Thomas Anderson', avatarUrl: `https://picsum.photos/seed/author-6/96/96` },
              publishDate: '2024-06-28',
              readTimeMinutes: 10,
              category: 'Design',
            },
          ],
        }
        setArticle(mockArticle)
        setError(null)
      } catch (err) {
        setError('Failed to load article')
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [id])

  return { article, isLoading, error }
}
