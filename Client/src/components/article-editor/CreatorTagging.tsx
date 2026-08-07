
import { useState } from 'react'
import { X } from 'lucide-react'

interface Creator {
  id: string
  name: string
  avatar: string
}

interface CreatorTaggingProps {
  creator: Creator | null
  onChange: (creator: Creator | null) => void
}

// Mock creators list
const MOCK_CREATORS: Creator[] = [
  { id: '1', name: 'Alice Johnson', avatar: '👩‍💼' },
  { id: '2', name: 'Bob Smith', avatar: '👨‍💼' },
  { id: '3', name: 'Carol White', avatar: '👩‍🔬' },
  { id: '4', name: 'David Chen', avatar: '👨‍🎨' },
]

export default function CreatorTagging({ creator, onChange }: CreatorTaggingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = MOCK_CREATORS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        Creator
      </label>

      {creator ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg">
          <span className="text-xl">{creator.avatar}</span>
          <span className="flex-1 text-sm font-medium">{creator.name}</span>
          <button
            onClick={() => onChange(null)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-left text-muted-foreground hover:border-primary transition-colors"
          >
            Select a creator...
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
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onChange(c)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-xl">{c.avatar}</span>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
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
