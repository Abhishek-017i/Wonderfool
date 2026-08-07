import { Badge } from '../ui/Badge'
import { cn } from '@/lib/utils'

const filters = ['All', 'Editorials', 'Reviews', 'Interviews', 'Creator Spotlights', 'Opinion']

interface QuickFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="container py-8">
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
              activeFilter === filter
                ? 'bg-primary text-primary-foreground border border-primary'
                : 'bg-card border border-border text-text hover:border-primary/50'
            )}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
