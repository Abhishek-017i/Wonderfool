import { useState, useEffect } from 'react'
export interface CreatorData {
  _id: string;
  name?: { full?: string; native?: string };
  designation?: string[];
  photo?: string;
  knownWorks?: { seriesId?: { title?: { english?: string; romaji?: string }; coverImage?: string }; role?: string }[];
  yearsActive?: string;
  bio?: string;
  socials?: { platform: string; url: string }[];
}

interface UseCreatorReturn {
  creator: CreatorData | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useCreator(id: string): UseCreatorReturn {
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreator = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/persons/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch creator');
      }
      const data = await response.json();
      setCreator(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreator();
  }, [id]);

  return { creator, isLoading, error, retry: fetchCreator };
}

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
