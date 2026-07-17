import { useState, useEffect, useMemo } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import ActivitySummary from '../components/timeline/ActivitySummary'
import FilterBar from '../components/timeline/FilterBar'
import TimelineRail from '../components/timeline/TimelineRail'
import EmptyState from '../components/timeline/EmptyState'
import TimelineSkeleton from '../components/timeline/TimelineSkeleton'
import { ACTIVITY, getActivityStats, groupActivitiesByDate } from '../data/mockData'
import { ActivityEntry, FilterState } from '../types/activity'

export default function Timeline() {
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilter: 'all',
    mediaTypeFilter: 'all',
    dateRangeFilter: 'all',
  })

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities(ACTIVITY)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Filter logic
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Quick filter
      if (filterState.activeFilter !== 'all') {
        const filterMap: Record<string, string[]> = {
          completed: ['completed'],
          'in-progress': ['started'],
          rated: ['rated'],
          reviewed: ['reviewed'],
        }
        if (!filterMap[filterState.activeFilter]?.includes(activity.actionType)) {
          return false
        }
      }

      // Media type filter
      if (filterState.mediaTypeFilter !== 'all' && activity.mediaType !== filterState.mediaTypeFilter) {
        return false
      }

      // Date range filter
      if (filterState.dateRangeFilter !== 'all') {
        const now = new Date()
        const activityDate = new Date(activity.date)
        const daysAgo = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filterState.dateRangeFilter) {
          case 'week':
            if (daysAgo > 7) return false
            break
          case 'month':
            if (daysAgo > 30) return false
            break
          case '3months':
            if (daysAgo > 90) return false
            break
        }
      }

      return true
    })
  }, [activities, filterState])

  const handleToggleExpand = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilterState((prev) => ({ ...prev, [field]: value }))
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stats = getActivityStats(activities)
  const groupedActivities = groupActivitiesByDate(filteredActivities)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">Your Timeline</h1>
          <p className="text-muted-foreground mt-1">Track your anime, manga, and light novel journey</p>
        </div>
      </header>

      <main className="px-4 md:px-8 py-8">
        {/* Activity Summary */}
        {!isLoading && <ActivitySummary stats={stats} />}

        {/* Filter Bar */}
        <FilterBar filterState={filterState} onFilterChange={handleFilterChange} />

        {/* Timeline Content */}
        <div className="mt-8">
          {isLoading ? (
            <TimelineSkeleton />
          ) : filteredActivities.length === 0 ? (
            <EmptyState />
          ) : (
            <TimelineRail
              groupedActivities={groupedActivities}
              expandedIds={expandedIds}
              onToggleExpand={handleToggleExpand}
            />
          )}
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
