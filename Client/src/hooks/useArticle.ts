import { useState, useEffect } from 'react'
import api from '@/lib/api'

export interface Author {
  id: string
  name: string
  avatarUrl: string
  bio: string
  articleCount: number
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
  coverUrl: string
  category: string
  author: Author
  publishDate: string
  readTimeMinutes: number
  likeCount: number
  bookmarkCount: number
  isLiked: boolean
  isBookmarked: boolean
  body: string
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
    const fetchArticle = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/articles/${id}`)
        const raw = response.data
        
        // Map backend schema to frontend UI expectations
        const mappedArticle: Article = {
          id: raw._id,
          title: raw.title,
          coverUrl: raw.coverImage || '/placeholder.svg',
          category: raw.tags?.[0] || 'Uncategorized',
          author: {
            id: raw.authorId?._id,
            name: raw.authorId?.name?.full || raw.authorId?.name?.native || raw.authorId?.name || 'Unknown Author',
            avatarUrl: raw.authorId?.avatar || '/placeholder.svg',
            bio: raw.authorId?.bio || '',
            articleCount: 0 // Mock stat
          },
          publishDate: raw.createdAt,
          readTimeMinutes: Math.max(1, Math.ceil((raw.body?.length || 0) / 1000)),
          likeCount: raw.likes?.length || 0,
          bookmarkCount: 0,
          isLiked: false,
          isBookmarked: false,
          body: raw.body || '',
          taggedCreators: raw.taggedCreators?.map((c: any) => ({
            id: c._id,
            name: c.name?.full || c.name?.native || c.name || 'Unknown',
            avatarUrl: c.photo || c.profilePicture || c.avatar || '/placeholder.svg',
            role: c.roles?.[0] || 'Creator'
          })) || [],
          taggedSeries: raw.taggedSeries?.map((s: any) => ({
            id: s._id,
            title: s.title,
            description: s.description || '',
            coverUrl: s.coverImage || '/placeholder.svg',
            articleCount: 0,
            color: 'bg-blue-100 text-blue-700'
          })) || [],
          relatedArticles: [] // Mock for now until endpoint provides this
        }
        
        setArticle(mappedArticle)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load article')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  return { article, isLoading, error }
}
