import { useState, useEffect } from 'react'
import api from '@/lib/api'

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
    const fetchArticle = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/articles/${id}`)
        setArticle(response.data)
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
