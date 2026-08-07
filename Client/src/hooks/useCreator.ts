import { useState, useEffect } from 'react'
import { CreatorData } from './useCreator'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface UseCreatorsReturn {
  creators: CreatorData[]
  isLoading: boolean
  error: Error | null
  retry: () => void
}

export function useCreators(): UseCreatorsReturn {
  const [creators, setCreators] = useState<CreatorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCreators = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/persons`)
      if (!response.ok) {
        throw new Error('Failed to fetch creators')
      }
      const data = await response.json()
      setCreators(data)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  return { creators, isLoading, error, retry: fetchCreators }
}
