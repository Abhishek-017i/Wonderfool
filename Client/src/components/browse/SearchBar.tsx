import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Series } from '@/data/browseSeries'

const RECENT_SEARCHES = ['Chainsaw Man', 'Frieren', 'Vinland Saga']

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  mediaType: string
  onMediaTypeChange: (type: string) => void
  results?: Series[]
  onResultClick?: (series: Series) => void
  onViewAll?: () => void
}

export default function SearchBar({
  value,
  onChange,
  mediaType,
  onMediaTypeChange,
  results = [],
  onResultClick,
  onViewAll,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showRecent, setShowRecent] = useState(!value)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleInputChange = (val: string) => {
    onChange(val)
    setShowRecent(!val)
    setIsOpen(true)
  }

  const displayItems = showRecent
    ? (RECENT_SEARCHES.map((s) => ({ id: s, title: s, cover: '', type: 'Anime' as const, year: 0 })) as unknown as Series[])
    : results.slice(0, 6)

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      <div className="flex gap-2 items-stretch">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search for something worthwhile..."
            value={value}
            onChange={(e) => handleInputChange((e.target as HTMLInputElement).value)}
            onFocus={() => {
              setIsOpen(true)
              setShowRecent(!value)
            }}
            className="pl-10 pr-9 h-10 bg-card border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 font-serif italic text-sm"
            aria-label="Search series"
            aria-expanded={isOpen}
            aria-controls="browse-search-results"
          />
          {value && (
            <button
              onClick={() => handleInputChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Media Type Selector */}
        <Select value={mediaType} onValueChange={onMediaTypeChange}>
          <SelectTrigger className="w-32 h-10 bg-card border-border/60 focus:ring-primary/20 text-sm shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Media</SelectItem>
            <SelectItem value="Anime">Anime</SelectItem>
            <SelectItem value="Manga">Manga</SelectItem>
            <SelectItem value="Light Novel">Light Novel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="browse-search-results"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
          >
            {displayItems.length > 0 ? (
              <>
                {showRecent && (
                  <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Recent Searches
                  </div>
                )}
                <div className="divide-y divide-border/50">
                  {displayItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (onResultClick) onResultClick(item)
                        setIsOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left group'
                      )}
                    >
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-8 h-12 object-cover rounded-md shrink-0 border border-border"
                        />
                      ) : (
                        <div className="w-8 h-12 rounded-md bg-muted shrink-0 flex items-center justify-center">
                          <Search className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </p>
                        {item.year > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.year}</p>
                        )}
                      </div>
                      {item.type && (
                        <Badge variant="outline" className="shrink-0 text-[10px] border-primary/30 text-primary/80">
                          {item.type}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
                {results.length > 6 && (
                  <button
                    onClick={onViewAll}
                    className="w-full px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors text-center border-t border-border"
                  >
                    See all {results.length} results →
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-serif italic text-muted-foreground">
                  {showRecent ? 'No recent searches.' : 'Nothing found. Perhaps broaden your horizons?'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
