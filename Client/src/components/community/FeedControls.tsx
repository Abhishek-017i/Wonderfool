import { LayoutGrid, List, TrendingUp, Flame, MessageCircle, Clock } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '@/lib/utils'

type SortOption = 'newest' | 'popular' | 'discussed' | 'trending'
type ViewType = 'grid' | 'list'

interface FeedControlsProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  view: ViewType
  onViewChange: (view: ViewType) => void
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'newest', label: 'Newest', icon: <Clock className="w-4 h-4" /> },
  { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'discussed', label: 'Most Discussed', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" /> },
]

export default function FeedControls({ sortBy, onSortChange, view, onViewChange }: FeedControlsProps) {
  return (
    <div className="container py-8 border-t border-border">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground border border-primary'
                  : 'bg-card border border-border text-text hover:border-primary/50'
              )}
              aria-pressed={sortBy === option.value}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-card border border-border rounded-md p-1">
          <button
            onClick={() => onViewChange('grid')}
            className={cn(
              'p-2 rounded transition-all',
              view === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-text hover:bg-background'
            )}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'p-2 rounded transition-all',
              view === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-text hover:bg-background'
            )}
            aria-label="List view"
            aria-pressed={view === 'list'}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
