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
      setError(err instanceof Error ? err : new Error(err.message))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCreator()
  }, [id])

  return { creator, isLoading, error, retry: fetchCreator }
}
