import { useState, useEffect } from 'react'
import { X, Loader2, Plus } from 'lucide-react'
import api from '@/lib/api'

interface Creator {
  id: string
  name: string
  avatar: string
}

interface CreatorTaggingProps {
  creators: Creator[]
  onChange: (creators: Creator[]) => void
}

export default function CreatorTagging({ creators, onChange }: CreatorTaggingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [availableCreators, setAvailableCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return;

    const fetchCreators = async () => {
      setIsLoading(true)
      try {
        const res = await api.get('/persons')
        const data = res.data.map((c: any) => ({
          id: c._id,
          name: c.name?.full || c.name?.native || c.name || 'Unknown',
          avatar: c.photo || c.profilePicture || c.avatar || '👤'
        }))
        setAvailableCreators(data)
      } catch (err) {
        console.error('Failed to fetch creators', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCreators()
  }, [isOpen])

  const filtered = availableCreators.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    !creators.find((existing) => existing.id === c.id)
  )

  const handleAddCreator = (c: Creator) => {
    onChange([...creators, c])
    setIsOpen(false)
    setSearch('')
  }

  const handleRemoveCreator = (id: string) => {
    onChange(creators.filter(c => c.id !== id))
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        Creators
      </label>

      {creators.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {creators.map(creator => (
            <div key={creator.id} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-full shadow-sm">
              {creator.avatar.length > 2 && creator.avatar.startsWith('http') ? (
                <img src={creator.avatar} alt={creator.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <span className="text-sm">{creator.avatar}</span>
              )}
              <span className="text-sm font-medium">{creator.name}</span>
              <button
                onClick={() => handleRemoveCreator(creator.id)}
                className="p-0.5 hover:bg-muted rounded-full transition-colors ml-1"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-card border border-dashed border-border rounded-lg text-left text-muted-foreground hover:border-primary transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add a creator...
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
            <input
              type="text"
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-card text-foreground border-b border-border focus:outline-none placeholder:text-muted-foreground"
            />
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-6 flex justify-center items-center">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  {`No creators found matching "${search}".`}
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCreator(c)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                  >
                    {c.avatar.length > 2 && c.avatar.startsWith('http') ? (
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <span className="text-xl">{c.avatar}</span>
                    )}
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
