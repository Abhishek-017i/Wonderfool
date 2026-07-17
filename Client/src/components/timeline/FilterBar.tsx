import { Filter } from 'lucide-react'
import { Badge } from '../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { FilterState } from '../../types/activity'

interface FilterBarProps {
  filterState: FilterState
  onFilterChange: (field: keyof FilterState, value: any) => void
}

const quickFilters = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'rated', label: 'Rated' },
  { id: 'reviewed', label: 'Reviewed' },
]

const mediaTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'anime', label: 'Anime' },
  { id: 'manga', label: 'Manga' },
  { id: 'light-novel', label: 'Light Novel' },
]

const dateRanges = [
  { id: 'all', label: 'All Time' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: '3months', label: 'Last 3 Months' },
]

export default function FilterBar({ filterState, onFilterChange }: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Quick Filters */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Quick Filters</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant={filterState.activeFilter === filter.id ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                filterState.activeFilter === filter.id
                  ? 'bg-primary text-background hover:bg-primary/90'
                  : 'hover:border-primary'
              }`}
              onClick={() => onFilterChange('activeFilter', filter.id)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Media Type
          </label>
          <Select
            value={filterState.mediaTypeFilter}
            onValueChange={(value) => onFilterChange('mediaTypeFilter', value)}
          >
            <SelectTrigger className="w-full border-border bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Date Range
          </label>
          <Select
            value={filterState.dateRangeFilter}
            onValueChange={(value) => onFilterChange('dateRangeFilter', value)}
          >
            <SelectTrigger className="w-full border-border bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.id} value={range.id}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
