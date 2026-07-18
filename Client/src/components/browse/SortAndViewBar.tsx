import { LayoutGrid, Rows3, LayoutList, ArrowUpDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SortBy = 'Popular' | 'Trending' | 'Highest Rated' | 'Newest' | 'Oldest' | 'Alphabetical' | 'Recently Updated'
type ViewMode = 'grid' | 'compact' | 'list'

interface SortAndViewBarProps {
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  totalResults: number
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'Popular', label: 'Most Popular' },
  { value: 'Trending', label: 'Trending' },
  { value: 'Highest Rated', label: 'Highest Rated' },
  { value: 'Newest', label: 'Newest First' },
  { value: 'Oldest', label: 'Oldest First' },
  { value: 'Alphabetical', label: 'Alphabetical' },
  { value: 'Recently Updated', label: 'Recently Updated' },
]

const VIEW_MODES: { mode: ViewMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Grid view' },
  { mode: 'compact', icon: Rows3, label: 'Compact grid view' },
  { mode: 'list', icon: LayoutList, label: 'List view' },
]

export default function SortAndViewBar({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: SortAndViewBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Result count */}
      <p className="text-sm text-muted-foreground font-medium">
        <span className="text-foreground font-semibold">{totalResults.toLocaleString()}</span>{' '}
        series found
      </p>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)}>
            <SelectTrigger className="h-8 w-44 bg-card border-border/60 text-sm focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border/60 p-0.5 bg-card">
          {VIEW_MODES.map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              size="icon-sm"
              onClick={() => onViewModeChange(mode)}
              variant={viewMode === mode ? 'default' : 'ghost'}
              aria-label={label}
              className={cn(
                'transition-all',
                viewMode === mode
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
