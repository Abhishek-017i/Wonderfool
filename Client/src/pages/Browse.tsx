import { useState, useEffect, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
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
import { generateExtendedSeriesData } from '@/data/browseSeries'
import type { Series } from '@/data/browseSeries'
import SearchBar from '@/components/browse/SearchBar'
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

type SortBy = 'Popular' | 'Trending' | 'Highest Rated' | 'Newest' | 'Oldest' | 'Alphabetical' | 'Recently Updated'
type ViewMode = 'grid' | 'compact' | 'list'
type QuickFilterType = 'Popular' | 'Trending' | 'Completed' | 'Recently Added' | null

interface Filters {
  mediaType: string[]
  status: string[]
  genres: string[]
  demographic: string[]
  yearRange: [number, number]
  minRating: number
  episodeRange: [number, number]
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
  authors: [],
  artists: [],
  publishers: [],
}

export default function Browse() {
  const allSeries = useMemo(() => generateExtendedSeriesData(), [])

  // Search state
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [mediaTypeScope, setMediaTypeScope] = useState('All')

  // Filter state
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterType>(null)
  const [sortBy, setSortBy] = useState<SortBy>('Popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(20)

  // Loading/Error state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== debouncedQuery) {
        setDebouncedQuery(query)
        if (query.length > 0) setHasSearched(true)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [query, debouncedQuery])

  // Reset visible count on filter/sort change
  useEffect(() => {
    setVisibleCount(20)
  }, [debouncedQuery, filters, activeQuickFilter, sortBy])

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return []
    return allSeries.filter((series) => {
      const q = debouncedQuery.toLowerCase()
      const matchesQuery =
        series.title.toLowerCase().includes(q) ||
        series.altTitle?.toLowerCase().includes(q) ||
        series.nativeTitle?.toLowerCase().includes(q) ||
        series.romanizedTitle?.toLowerCase().includes(q)
      const matchesMediaType = mediaTypeScope === 'All' || series.type === mediaTypeScope
      return matchesQuery && matchesMediaType
    })
  }, [debouncedQuery, allSeries, mediaTypeScope])

  // Apply all filters + sort
  const filteredResults = useMemo(() => {
    let results: Series[] = debouncedQuery ? [...searchResults] : [...allSeries]

    // Quick filter
    if (activeQuickFilter === 'Popular') {
      results = results.sort((a, b) => b.popularity - a.popularity).slice(0, 100)
    } else if (activeQuickFilter === 'Trending') {
      results = results.filter((s) => s.trending)
    } else if (activeQuickFilter === 'Completed') {
      results = results.filter((s) => s.status === 'Finished')
    } else if (activeQuickFilter === 'Recently Added') {
      results = results.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()).slice(0, 100)
    }

    // Filter panel
    results = results.filter((series) => {
      if (filters.mediaType.length > 0 && !filters.mediaType.includes(series.type)) return false
      if (filters.status.length > 0 && !filters.status.includes(series.status)) return false
      if (filters.genres.length > 0 && !series.genres.some((g) => filters.genres.includes(g))) return false
      if (filters.demographic.length > 0 && series.demographic && !filters.demographic.includes(series.demographic)) return false
      if (series.year < filters.yearRange[0] || series.year > filters.yearRange[1]) return false
      if (series.rating < filters.minRating) return false
      if (filters.episodeRange[0] > 0 && series.episodes && series.episodes < filters.episodeRange[0]) return false
      if (filters.episodeRange[1] > 0 && series.episodes && series.episodes > filters.episodeRange[1]) return false
      return true
    })

    // Sort
    switch (sortBy) {
      case 'Popular':
        results.sort((a, b) => b.popularity - a.popularity)
        break
      case 'Trending':
        results.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
        break
      case 'Highest Rated':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'Newest':
        results.sort((a, b) => b.year - a.year)
        break
      case 'Oldest':
        results.sort((a, b) => a.year - b.year)
        break
      case 'Alphabetical':
        results.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'Recently Updated':
        results.sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime())
        break
    }

    return results
  }, [searchResults, allSeries, debouncedQuery, activeQuickFilter, filters, sortBy])

  // Simulate loading on filter changes
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [debouncedQuery, filters, activeQuickFilter, sortBy])

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
    setVisibleCount(20)
    setError(false)
  }

  const handleSearchResultClick = (series: Series) => {
    console.log('Selected:', series.title)
  }

  const visibleResults = filteredResults.slice(0, visibleCount)
  const hasMoreResults = visibleCount < filteredResults.length

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
              {allSeries.length.toLocaleString()} series in the library
            </p>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <SearchBar
              value={query}
              onChange={setQuery}
              mediaType={mediaTypeScope}
              onMediaTypeChange={setMediaTypeScope}
              results={searchResults}
              onResultClick={handleSearchResultClick}
              onViewAll={() => {}}
            />
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
                  onApply={() => {}}
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
                        onApply={() => {}}
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
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  totalResults={filteredResults.length}
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
              {error && !isLoading && <ErrorState onRetry={() => setError(false)} />}

              {/* ── Empty State ── */}
              {!isLoading && !error && filteredResults.length === 0 && (
                <EmptyState onReset={handleReset} />
              )}

              {/* ── Results Grid ── */}
              {!isLoading && !error && filteredResults.length > 0 && (
                <>
                  <div
                    className={cn(
                      viewMode === 'list' ? 'space-y-3' : 'grid gap-4',
                      viewMode === 'grid' && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
                      viewMode === 'compact' && 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
                    )}
                  >
                    {visibleResults.map((series, i) => (
                      <SeriesCard
                        key={series.id}
                        series={series}
                        variant={viewMode === 'list' ? 'list' : viewMode}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMoreResults && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-center mt-10"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setVisibleCount((prev) => prev + 20)}
                        className="px-8 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-semibold"
                      >
                        Load More
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({filteredResults.length - visibleCount} remaining)
                        </span>
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
