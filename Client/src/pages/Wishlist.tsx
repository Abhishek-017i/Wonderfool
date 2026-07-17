import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutGrid,
  List,
  Search,
  MoreVertical,
  Star,
  Check,
  Inbox,
  Share2,
  Trash2,
  ChevronDown,
} from 'lucide-react'

type SeriesStatus = 'Plan to Watch' | 'In Progress' | 'Completed' | 'On Hold' | 'Dropped'

interface SeriesItem {
  id: string
  title: string
  coverUrl: string
  status: SeriesStatus
  progress: { current: number; total: number } | null
  rating: number | null
  favorite: boolean
  dateAdded: string
  releaseDate: string
}

type SortOption = 'Recently Added' | 'Alphabetical' | 'Rating' | 'Progress' | 'Release Date'
type ViewMode = 'grid' | 'list'
type FilterType = 'All' | SeriesStatus | 'Favorites'

const MOCK_LIBRARY: SeriesItem[] = [
  {
    id: 'jjk',
    title: 'Jujutsu Kaisen',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'In Progress',
    progress: { current: 12, total: 24 },
    rating: 4.8,
    favorite: true,
    dateAdded: '2026-06-02',
    releaseDate: '2020-03-05',
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey\'s End',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'Completed',
    progress: { current: 28, total: 28 },
    rating: 4.9,
    favorite: true,
    dateAdded: '2026-05-14',
    releaseDate: '2023-09-29',
  },
  {
    id: 'csm',
    title: 'Chainsaw Man',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'Plan to Watch',
    progress: null,
    rating: null,
    favorite: false,
    dateAdded: '2026-07-01',
    releaseDate: '2022-10-11',
  },
  {
    id: 'bocchi',
    title: 'Bocchi the Rock!',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'On Hold',
    progress: { current: 6, total: 12 },
    rating: 4.5,
    favorite: false,
    dateAdded: '2026-04-20',
    releaseDate: '2022-10-08',
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'In Progress',
    progress: { current: 18, total: 30 },
    rating: 4.6,
    favorite: true,
    dateAdded: '2026-03-15',
    releaseDate: '2022-04-04',
  },
  {
    id: 'jjk-0',
    title: 'Jujutsu Kaisen 0',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'Completed',
    progress: { current: 1, total: 1 },
    rating: 4.7,
    favorite: false,
    dateAdded: '2026-02-28',
    releaseDate: '2020-12-24',
  },
  {
    id: 'vinland',
    title: 'Vinland Saga',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'Dropped',
    progress: { current: 5, total: 24 },
    rating: 4.4,
    favorite: false,
    dateAdded: '2026-01-10',
    releaseDate: '2019-07-07',
  },
  {
    id: 'sso',
    title: 'Solo Leveling',
    coverUrl: '/placeholder.svg?height=300&width=200',
    status: 'In Progress',
    progress: { current: 8, total: 25 },
    rating: 4.7,
    favorite: true,
    dateAdded: '2025-12-01',
    releaseDate: '2022-01-10',
  },
]

const getStatusColor = (status: SeriesStatus): string => {
  const colors: Record<SeriesStatus, string> = {
    'Completed': 'var(--status-completed)',
    'In Progress': 'var(--status-in-progress)',
    'Plan to Watch': 'var(--status-plan-to-watch)',
    'On Hold': 'var(--status-on-hold)',
    'Dropped': 'var(--status-dropped)',
  }
  return colors[status]
}

const getStatusBadgeVariant = (status: SeriesStatus) => {
  return status === 'Dropped' ? 'destructive' : 'secondary'
}

function SeriesCard({
  item,
  bulkMode,
  isSelected,
  onToggleSelect,
}: {
  item: SeriesItem
  bulkMode: boolean
  isSelected: boolean
  onToggleSelect: (id: string) => void
}) {
  return (
    <Card
      className="overflow-hidden relative group cursor-pointer transition-shadow hover:shadow-md"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (bulkMode) onToggleSelect(item.id)
        }
      }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <img
          src={item.coverUrl}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {/* Status Badge */}
        <div className="absolute top-2 left-2 z-20">
          {bulkMode ? (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(item.id)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Select ${item.title}`}
            />
          ) : (
            <Badge
              className="text-xs font-semibold text-white"
              style={{ backgroundColor: getStatusColor(item.status) }}
            >
              {item.status}
            </Badge>
          )}
        </div>

        {/* Progress Overlay */}
        {item.progress && item.status !== 'Plan to Watch' && item.status !== 'Dropped' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-medium">
                {item.status === 'Completed'
                  ? 'Completed'
                  : `Ep ${item.progress.current}/${item.progress.total}`}
              </span>
            </div>
            {item.status !== 'Completed' && (
              <Progress
                value={(item.progress.current / item.progress.total) * 100}
                className="h-0.5 mt-1"
              />
            )}
          </div>
        )}

        {/* Actions Menu */}
        {!bulkMode && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity z-20">
            <SeriesCardMenu item={item} />
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3 className="font-sans text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 mt-2">
          <Star
            className={`h-4 w-4 ${item.favorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
          />
          {item.rating && <span className="text-xs text-muted-foreground">{item.rating}</span>}
        </div>
      </div>
    </Card>
  )
}

function SeriesRow({
  item,
  bulkMode,
  isSelected,
  onToggleSelect,
}: {
  item: SeriesItem
  bulkMode: boolean
  isSelected: boolean
  onToggleSelect: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/50 transition-colors">
      {bulkMode && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(item.id)}
          aria-label={`Select ${item.title}`}
        />
      )}

      <img
        src={item.coverUrl}
        alt={item.title}
        loading="lazy"
        className="h-16 w-12 object-cover rounded"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-semibold text-foreground truncate">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            className="text-xs"
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status}
          </Badge>
          {item.rating && <span className="text-xs text-muted-foreground">{item.rating}</span>}
        </div>
      </div>

      {!bulkMode && (
        <div>
          <SeriesCardMenu item={item} />
        </div>
      )}
    </div>
  )
}

function SeriesCardMenu({ item }: { item: SeriesItem }) {
  return (
    <DropdownMenu>
      <button
        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
        aria-label="Series menu"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs uppercase tracking-widest font-semibold">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/series/${item.id}`} className="cursor-pointer">
            View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {['Plan to Watch', 'In Progress', 'Completed', 'On Hold', 'Dropped'].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  // Status change will be handled by parent component
                }}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => {}}>
          <Share2 className="h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
          <Trash2 className="h-4 w-4" />
          Remove from Wishlist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <Inbox className="h-16 w-16 text-muted-foreground" />
      <div>
        <p className="text-lg font-sans text-foreground mb-2">
          So... you&apos;re telling me nothing caught your eye? I find that difficult to believe.
        </p>
        <p className="text-sm text-muted-foreground">Start building your collection.</p>
      </div>
      <Button onClick={() => navigate('/browse')} className="mt-4">
        Browse Series
      </Button>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <>
      <div className="text-sm text-muted-foreground text-center mb-8">
        Organizing your mess…
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </>
  )
}

function BulkActionBar({
  selectedCount,
  onChangeStatus,
  onRemove,
  onCancel,
}: {
  selectedCount: number
  onChangeStatus: (status: SeriesStatus) => void
  onRemove: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg translate-y-0 transition-transform duration-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
        <div className="flex gap-3">
          <DropdownMenu>
            <Button variant="outline" size="sm">
              Change Status
              <ChevronDown className="h-4 w-4" />
            </Button>
            <DropdownMenuContent align="end">
              {(['Plan to Watch', 'In Progress', 'Completed', 'On Hold', 'Dropped'] as const).map(
                (status) => (
                  <DropdownMenuItem key={status} onClick={() => onChangeStatus(status)}>
                    {status}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Wishlist() {
  const [library, setLibrary] = useState<SeriesItem[]>(MOCK_LIBRARY)
  const [isLoading, setIsLoading] = useState(true)
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('Recently Added')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const navigate = useNavigate()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort logic
  const filteredAndSorted = useMemo(() => {
    let result = [...library]

    // Filter by active filter
    if (activeFilter === 'Favorites') {
      result = result.filter((item) => item.favorite)
    } else if (activeFilter !== 'All') {
      result = result.filter((item) => item.status === activeFilter)
    }

    // Search filter
    if (searchQuery) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'Alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'Rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'Progress':
        result.sort((a, b) => {
          const aProgress = a.progress ? a.progress.current / a.progress.total : 0
          const bProgress = b.progress ? b.progress.current / b.progress.total : 0
          return bProgress - aProgress
        })
        break
      case 'Release Date':
        result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      case 'Recently Added':
      default:
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    }

    return result
  }, [library, activeFilter, searchQuery, sortBy])

  const handleToggleBulkMode = () => {
    setBulkMode(!bulkMode)
    setSelectedIds(new Set())
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleChangeStatus = (status: SeriesStatus) => {
    setLibrary((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id) ? { ...item, status } : item
      )
    )
  }

  const handleRemoveSelected = () => {
    setLibrary((prev) => prev.filter((item) => !selectedIds.has(item.id)))
    setSelectedIds(new Set())
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SkeletonGrid />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Page Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'Series' : 'Series'}
            </p>
          </div>
          <Button
            variant={bulkMode ? 'default' : 'outline'}
            onClick={handleToggleBulkMode}
          >
            {bulkMode && <Check className="h-4 w-4" />}
            Bulk Edit
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-background border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* Search and Filters Row */}
          <div className="flex gap-4 items-start flex-col lg:flex-row">
            {/* Search */}
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Find it in your collection. Assuming you remember the name."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 flex-shrink-0 -mx-6 px-6 lg:mx-0 lg:px-0">
              {(['All', 'Plan to Watch', 'In Progress', 'Completed', 'On Hold', 'Dropped', 'Favorites'] as const).map((filter) => (
                <Badge
                  key={filter}
                  variant={activeFilter === filter ? 'default' : 'outline'}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option>Recently Added</option>
              <option>Alphabetical</option>
              <option>Rating</option>
              <option>Progress</option>
              <option>Release Date</option>
            </select>

            <div className="inline-flex rounded-md border border-input overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-muted text-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors border-l border-input ${
                  viewMode === 'list'
                    ? 'bg-muted text-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredAndSorted.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredAndSorted.map((item) => (
              <SeriesCard
                key={item.id}
                item={item}
                bulkMode={bulkMode}
                isSelected={selectedIds.has(item.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-0 border border-border rounded-lg overflow-hidden">
            {filteredAndSorted.map((item) => (
              <SeriesRow
                key={item.id}
                item={item}
                bulkMode={bulkMode}
                isSelected={selectedIds.has(item.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" disabled>
            Load More
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {bulkMode && selectedIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          onChangeStatus={handleChangeStatus}
          onRemove={handleRemoveSelected}
          onCancel={() => {
            setBulkMode(false)
            setSelectedIds(new Set())
          }}
        />
      )}
      <Footer />
    </div>
  )
}
