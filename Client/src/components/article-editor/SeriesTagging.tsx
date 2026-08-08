import { useState, useEffect } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Series {
  id: string
  name: string
  color: string
}

interface SeriesTaggingProps {
  series: Series | null
  onChange: (series: Series | null) => void
}

export default function SeriesTagging({ series, onChange }: SeriesTaggingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return;

    const fetchSeries = async () => {
      setIsLoading(true)
      try {
        const res = await api.get('/series')
        const data = (res.data.series || []).map((s: any) => ({
          id: s._id,
          name: s.title?.english || s.title?.romaji || s.title?.native || s.title || 'Unknown',
          color: s.color || 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
        }))
        setSeriesList(data)
      } catch (err) {
        console.error('Failed to fetch series', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSeries()
  }, [isOpen])

  const filtered = seriesList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        Series (Optional)
      </label>

      {series ? (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${series.color}`}>
          <span className="flex-1 text-sm font-medium">{series.name}</span>
          <button
            onClick={() => onChange(null)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 bg-card border border-dashed border-border rounded-lg text-left text-muted-foreground hover:border-primary transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to a series...
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
              <input
                type="text"
                placeholder="Search series..."
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
                    {`No series found matching "${search}".`}
                  </div>
                ) : filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onChange(s)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors text-left"
                  >
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
