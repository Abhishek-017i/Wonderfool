import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import QuickFilterBar from '@/components/browse/QuickFilterBar'
import ActiveFilterChips from '@/components/browse/ActiveFilterChips'
import type { FilterChip } from '@/components/browse/ActiveFilterChips'
import SortAndViewBar from '@/components/browse/SortAndViewBar'
import FilterSidebar from '@/components/browse/FilterSidebar'
import SeriesCard from '@/components/browse/SeriesCard'
import SeriesCardSkeleton from '@/components/browse/SeriesCardSkeleton'
import EmptyState from '@/components/browse/EmptyState'
import ErrorState from '@/components/browse/ErrorState'
import BackToTopButton from '@/components/browse/BackToTopButton'
import { cn } from '@/lib/utils'
import type { Series, PaginatedSeriesResponse } from '@/types/series'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

type SortBy = 'Popular' | 'Trending' | 'Highest Rated' | 'Newest' | 'Oldest' | 'Alphabetical' | 'Recently Updated'
type ViewMode = 'grid' | 'compact' | 'list'
type QuickFilterType = 'Popular' | 'Trending' | 'Completed' | 'Recently Added' | null

export interface Filters {
  mediaType: string[]
  status: string[]
  genres: string[]
  demographic: string[]
  yearRange: [number, number]
  minRating: number
  episodeRange: [number, number]
  country: string[]
  authors: string[]
  artists: string[]
  publishers: string[]
}

const DEFAULT_FILTERS: Filters = {
  mediaType: [],
  status: [],
  genres: [],
  demographic: [],
  yearRange: [1970, 2026],
  minRating: 0,
  episodeRange: [0, 0],
  country: [],
  authors: [],
  artists: [],
  publishers: [],
}

// Map display values to DB enum values
const MEDIA_TYPE_MAP: Record<string, string> = {
  'Anime': 'ANIME',
  'Manga': 'MANGA',
  'Light Novel': 'NOVEL',
}

const STATUS_MAP: Record<string, string> = {
  'Airing': 'ongoing',
  'Finished': 'finished',
  'Hiatus': 'hiatus',
  'Cancelled': 'cancelled',
}

export default function Browse() {
  // Search state
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const location = useLocation()

  // Parse filters from URL on mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const typeParam = params.get('type')
    const sortParam = params.get('sortBy')

    if (typeParam) {
      const types = typeParam.split(',')
      const displayTypes = types.map(t => {
        if (t === 'ANIME') return 'Anime'
        if (t === 'MANGA') return 'Manga'
        if (t === 'NOVEL') return 'Light Novel'
        return t
      })
      setFilters(prev => ({ ...prev, mediaType: displayTypes }))
    }

    if (sortParam) {
      // e.g. sortBy=Newest
      setSortBy(sortParam as SortBy)
    }
  }, [location.search])

  // Filter state
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterType>(null)
  const [sortBy, setSortBy] = useState<SortBy>('Popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // API state
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== debouncedQuery) {
        setDebouncedQuery(query)
        if (query.length > 0) setHasSearched(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, debouncedQuery])

  // Reset page on filter/sort/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, filters, activeQuickFilter, sortBy])

  // Synchronize Quick Filters with Sort
  useEffect(() => {
    if (activeQuickFilter === 'Trending') {
      setSortBy('Trending')
    } else if (activeQuickFilter === 'Popular') {
      setSortBy('Popular')
    } else if (activeQuickFilter === 'Recently Added') {
      setSortBy('Newest')
    }
  }, [activeQuickFilter])

  const handleSortChange = (newSort: SortBy) => {
    setSortBy(newSort)
    if (activeQuickFilter && ['Trending', 'Popular', 'Recently Added'].includes(activeQuickFilter)) {
      setActiveQuickFilter(null)
    }
  }

  // Build query params and fetch from API
  const fetchSeries = useCallback(async () => {
    setIsLoading(true)
    setError(false)

    try {
      const params = new URLSearchParams()

      // Media type filter → DB enum values
      if (filters.mediaType.length > 0) {
        const dbTypes = filters.mediaType.map(t => MEDIA_TYPE_MAP[t] || t)
        params.set('type', dbTypes.join(','))
      }

      // Status filter → DB enum values
      if (filters.status.length > 0) {
        const dbStatuses = filters.status.map(s => STATUS_MAP[s] || s)
        params.set('status', dbStatuses.join(','))
      }

      // Genre filter
      if (filters.genres.length > 0) {
        params.set('genres', filters.genres.join(','))
      }

      // Country filter
      if (filters.country.length > 0) {
        params.set('country', filters.country.join(','))
      }

      // Demographic filter
      if (filters.demographic.length > 0) {
        params.set('demographic', filters.demographic.join(','))
      }

      // Year range filter
      if (filters.yearRange[0] > 1970) {
        params.set('yearStart', String(filters.yearRange[0]))
      }
      if (filters.yearRange[1] < 2026) {
        params.set('yearEnd', String(filters.yearRange[1]))
      }

      // Min Rating
      if (filters.minRating > 0) {
        params.set('minRating', String(filters.minRating))
      }

      // Episode count
      if (filters.episodeRange[0] > 0) {
        params.set('episodeMin', String(filters.episodeRange[0]))
      }
      if (filters.episodeRange[1] > 0) {
        params.set('episodeMax', String(filters.episodeRange[1]))
      }

      // Search
      if (debouncedQuery) {
        params.set('search', debouncedQuery)
      }

      // Quick filter overrides
      if (activeQuickFilter === 'Completed') {
        params.set('status', 'finished')
      }

      const SORT_MAP: Record<string, string> = {
        'Popular': 'popularity',
        'Trending': 'trending',
        'Highest Rated': 'averageScore',
        'Newest': 'newest',
        'Oldest': 'oldest',
        'Alphabetical': 'title',
        'Recently Updated': 'updated'
      }
      params.set('sortBy', SORT_MAP[sortBy] || 'popularity')

      // Pagination
      params.set('page', String(currentPage))
      params.set('limit', String(ITEMS_PER_PAGE))

      const response = await fetch(`${API_URL}/series?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: PaginatedSeriesResponse = await response.json()
      setSeriesData(data.series)
      setTotalCount(data.total)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Failed to fetch series:', err)
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [filters, debouncedQuery, activeQuickFilter, sortBy, currentPage])

  useEffect(() => {
    fetchSeries()
  }, [fetchSeries])

  // Build filter chips
  const activeFilterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = []

    filters.mediaType.forEach((type) =>
      chips.push({
        id: `media-${type}`,
        label: type,
        onRemove: () => setFilters((f) => ({ ...f, mediaType: f.mediaType.filter((t) => t !== type) })),
      })
    )
    filters.status.forEach((status) =>
      chips.push({
        id: `status-${status}`,
        label: status,
        onRemove: () => setFilters((f) => ({ ...f, status: f.status.filter((s) => s !== status) })),
      })
    )
    filters.genres.forEach((genre) =>
      chips.push({
        id: `genre-${genre}`,
        label: genre,
        onRemove: () => setFilters((f) => ({ ...f, genres: f.genres.filter((g) => g !== genre) })),
      })
    )
    filters.demographic.forEach((demo) =>
      chips.push({
        id: `demo-${demo}`,
        label: demo,
        onRemove: () => setFilters((f) => ({ ...f, demographic: f.demographic.filter((d) => d !== demo) })),
      })
    )
    filters.country.forEach((c) =>
      chips.push({
        id: `country-${c}`,
        label: c === 'JP' ? 'Japan' : c === 'KR' ? 'Korea' : c === 'CN' ? 'China' : c === 'TW' ? 'Taiwan' : c,
        onRemove: () => setFilters((f) => ({ ...f, country: f.country.filter((x) => x !== c) })),
      })
    )
    if (filters.minRating > 0)
      chips.push({
        id: 'rating',
        label: `Rating ≥ ${filters.minRating.toFixed(1)}`,
        onRemove: () => setFilters((f) => ({ ...f, minRating: 0 })),
      })
    if (filters.yearRange[0] > 1970 || filters.yearRange[1] < 2026)
      chips.push({
        id: 'year',
        label: `${filters.yearRange[0]}–${filters.yearRange[1]}`,
        onRemove: () => setFilters((f) => ({ ...f, yearRange: [1970, 2026] })),
      })
    if (filters.episodeRange[0] > 0 || filters.episodeRange[1] > 0) {
      let label = 'Episodes: '
      if (filters.episodeRange[0] > 0 && filters.episodeRange[1] > 0) label += `${filters.episodeRange[0]} - ${filters.episodeRange[1]}`
      else if (filters.episodeRange[0] > 0) label += `≥ ${filters.episodeRange[0]}`
      else label += `≤ ${filters.episodeRange[1]}`

      chips.push({
        id: 'episodes',
        label,
        onRemove: () => setFilters((f) => ({ ...f, episodeRange: [0, 0] })),
      })
    }

    return chips
  }, [filters])

  const handleReset = () => {
    setQuery('')
    setDebouncedQuery('')
    setHasSearched(false)
    setFilters(DEFAULT_FILTERS)
    setActiveQuickFilter(null)
    setSortBy('Popular')
    setViewMode('grid')
    setCurrentPage(1)
    setError(false)
  }

  const skeletonCount = viewMode === 'list' ? 5 : viewMode === 'compact' ? 20 : 15

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page body — padded to clear fixed Navbar */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 flex-wrap"
          >
            <div>
              <p className="text-xs tracking-widest font-bold text-primary uppercase mb-2">
                Browse the Library
              </p>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-gradient leading-tight">
                Browse Series
              </h1>
            </div>
            <p className="text-sm text-muted-foreground font-serif italic">
              {totalCount.toLocaleString()} series in the library
            </p>
          </motion.div>

          {/* ── Quick Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-6"
          >
            <QuickFilterBar activeFilter={activeQuickFilter} onChange={setActiveQuickFilter} />
          </motion.div>

          {/* ── Active Filter Chips ── */}
          {activeFilterChips.length > 0 && (
            <div className="mb-6">
              <ActiveFilterChips chips={activeFilterChips} onClearAll={handleReset} />
            </div>
          )}

          <Separator className="mb-8" />

          {/* ── Main Content: Sidebar + Results ── */}
          <div className="flex gap-8">

            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Filters
                </p>
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={() => { }}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                  hasSearched={hasSearched}
                />
              </div>
            </aside>

            {/* Results Area */}
            <div className="flex-1 min-w-0">

              {/* Mobile: Filter Drawer */}
              <div className="lg:hidden mb-6">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFilterChips.length > 0 && (
                        <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs">
                          {activeFilterChips.length}
                        </Badge>
                      )}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>
                    <div className="overflow-y-auto flex-1 px-6 py-4">
                      <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                        onApply={() => { }}
                        onReset={() => setFilters(DEFAULT_FILTERS)}
                        hasSearched={hasSearched}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Sort and View Bar */}
              <div className="mb-6">
                <SortAndViewBar
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalResults={totalCount}
                />
              </div>

              {/* ── Loading Skeletons ── */}
              {isLoading && (
                <div>
                  <p className="text-sm text-muted-foreground font-serif italic mb-6 text-center">
                    One moment. Quality takes time.
                  </p>
                  <div
                    className={cn(
                      viewMode === 'list' ? 'space-y-3' : 'grid gap-4',
                      viewMode === 'grid' && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
                      viewMode === 'compact' && 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
                    )}
                  >
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                      <SeriesCardSkeleton key={i} variant={viewMode === 'list' ? 'list' : 'grid'} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Error State ── */}
              {error && !isLoading && <ErrorState onRetry={fetchSeries} />}

              {/* ── Empty State ── */}
              {!isLoading && !error && seriesData.length === 0 && (
                <EmptyState onReset={handleReset} />
              )}

              {/* ── Results Grid ── */}
              {!isLoading && !error && seriesData.length > 0 && (
                <>
                  <div
                    className={cn(
                      viewMode === 'list' ? 'space-y-3' : 'grid gap-4',
                      viewMode === 'grid' && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
                      viewMode === 'compact' && 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
                    )}
                  >
                    {seriesData.map((series, i) => (
                      <SeriesCard
                        key={series._id}
                        series={series}
                        variant={viewMode === 'list' ? 'list' : viewMode}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* ── Pagination Controls ── */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-4 mt-10"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1))
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="gap-1.5 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-semibold disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </Button>

                      <span className="text-sm font-serif text-muted-foreground">
                        Page <span className="font-bold text-foreground">{currentPage}</span> of{' '}
                        <span className="font-bold text-foreground">{totalPages}</span>
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="gap-1.5 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-semibold disabled:opacity-40"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTopButton />
    </div>
  )
}