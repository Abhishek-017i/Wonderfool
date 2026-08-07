import { useState, useEffect, useMemo } from 'react'
import { ArrowUp, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import ActivitySummary from '../components/timeline/ActivitySummary'
import FilterBar from '../components/timeline/FilterBar'
import TimelineRail from '../components/timeline/TimelineRail'
import EmptyState from '../components/timeline/EmptyState'
import TimelineSkeleton from '../components/timeline/TimelineSkeleton'
import { getActivityStats, groupActivitiesByDate } from '../data/mockData'
import { ActivityEntry, FilterState, ActionType, MediaType } from '../types/activity'
import useAuthStore from '../store/authStore'
import api from '../lib/api'

export default function Timeline() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilter: 'all',
    mediaTypeFilter: 'all',
    dateRangeFilter: 'all',
  })

  const token = useAuthStore((state: any) => state.token)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch real data
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get('/timeline', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Map backend data to frontend ActivityEntry format
        const mappedData: ActivityEntry[] = response.data.map((item: any) => {
          const series = item.seriesId || {}
          const titleObj = series.title || {}
          const seriesTitle = titleObj.english || titleObj.romaji || titleObj.native || 'Unknown'
          const dateObj = new Date(item.createdAt)
          
          let actionLabel = 'Started watching'
          if (item.actionType === 'completed') actionLabel = 'Completed'
          else if (item.actionType === 'rated') actionLabel = 'Rated'
          else if (item.actionType === 'reviewed') actionLabel = 'Wrote a review for'
          else if (item.actionType === 'added_note') actionLabel = 'Added a note to'

          return {
            id: item._id,
            seriesId: series._id,
            seriesTitle,
            coverUrl: series.coverImage || '',
            mediaType: (series.type === 'NOVEL' ? 'light-novel' : (series.type ? series.type.toLowerCase() : 'anime')) as MediaType,
            actionType: item.actionType as ActionType,
            actionLabel,
            progress: item.progress || { current: 0, total: series.episodeCount || series.chapterCount || 0 },
            note: item.note,
            date: dateObj,
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        })
        
        setActivities(mappedData)
      } catch (err) {
        console.error('Failed to fetch timeline:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (token) {
      fetchTimeline()
    } else {
      setIsLoading(false)
    }
  }, [token])

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

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/timeline/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setActivities((prev) => prev.filter((activity) => activity.id !== id))
    } catch (err) {
      console.error('Failed to remove from timeline:', err)
      // Optionally show a toast error here
    }
  }

  const handleUpdateActionType = async (id: string, actionType: string) => {
    try {
      await api.put(`/timeline/${id}`, { actionType }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setActivities((prev) => prev.map((activity) => {
        if (activity.id === id) {
          let actionLabel = 'Started watching'
          if (actionType === 'completed') actionLabel = 'Completed'
          else if (actionType === 'rated') actionLabel = 'Rated'
          else if (actionType === 'reviewed') actionLabel = 'Wrote a review for'
          else if (actionType === 'added_note') actionLabel = 'Added a note to'

          return { ...activity, actionType: actionType as any, actionLabel }
        }
        return activity
      }))
    } catch (err) {
      console.error('Failed to update timeline status:', err)
    }
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
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-28 md:pt-32 pb-16">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Personal Tracking
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1 font-display">
              Your Timeline
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Track your anime, manga, and light novel journey
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit gap-1.5 border-border hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

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
              onRemove={handleRemove}
              onUpdateActionType={handleUpdateActionType}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-lg z-30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
