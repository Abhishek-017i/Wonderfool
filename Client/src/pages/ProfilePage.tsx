import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ProfileHeader from '../components/profile/ProfileHeader'
import TabNavigation from '../components/profile/TabNavigation'
import ReviewsList from '../components/profile/ReviewsList'
import ArticlesList from '../components/profile/ArticlesList'
import WishlistDisplay from '../components/profile/WishlistDisplay'
import SettingsTab from '../components/profile/SettingsTab'
import useAuthStore from '../store/authStore'
import api from '../lib/api'
import { Loader2 } from 'lucide-react'
import TimelineRail from '../components/timeline/TimelineRail'
import EmptyState from '../components/timeline/EmptyState'

const groupActivitiesByDate = (activities: ActivityEntry[]) => {
  const grouped: Record<string, ActivityEntry[]> = {}
  activities.forEach(activity => {
    const dateStr = activity.date.toISOString().split('T')[0]
    if (!grouped[dateStr]) grouped[dateStr] = []
    grouped[dateStr].push(activity)
  })
  return grouped
}
import { ActivityEntry, MediaType, ActionType } from '../types/activity'

interface ProfilePageProps {
  isDark?: boolean
  setIsDark?: (dark: boolean) => void
}

export default function ProfilePage(props: ProfilePageProps) {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [localIsDark, setLocalIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const { user } = useAuthStore()

  const [dbUser, setDbUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [timeline, setTimeline] = useState<ActivityEntry[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setLocalIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const [userRes, reviewsRes, articlesRes, timelineRes, wishlistRes] = await Promise.all([
          api.get(`/users/${user._id}`),
          api.get(`/reviews/user/${user._id}`),
          api.get(`/articles/user/${user._id}`),
          api.get(`/timeline/user/${user._id}`),
          api.get(`/wishlists/user/${user._id}`)
        ]);

        // Map backend timeline data to frontend ActivityEntry format
        const mappedTimeline: ActivityEntry[] = timelineRes.data.map((item: any) => {
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
        });

        const mappedWishlist = wishlistRes.data.map((item: any) => {
          const series = item.seriesId || {}
          const titleObj = series.title || {}
          const seriesTitle = titleObj.english || titleObj.romaji || titleObj.native || 'Unknown'
          return {
            id: item._id,
            name: seriesTitle,
            category: series.type || 'Unknown',
            addedDate: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            coverUrl: series.coverImage || '',
            seriesId: series._id
          }
        });

        setDbUser(userRes.data);
        setReviews(reviewsRes.data);
        setArticles(articlesRes.data);
        setTimeline(mappedTimeline);
        setWishlist(mappedWishlist);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [user?._id]);

  const isDark = props.isDark !== undefined ? props.isDark : localIsDark
  const setIsDark = props.setIsDark || ((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  const handleRemoveWishlist = async (id: string) => {
    try {
      await api.delete(`/wishlists/${id}`)
      setWishlist((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    }
  }

  const handleDeleteReview = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` }
      })
      setReviews((prev) => prev.filter((review) => review._id !== id && review.id !== id))
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const displayUser = useMemo(() => {
    if (!user && !dbUser) return null;
    const baseUser = dbUser || user;
    const joinedDate = baseUser.createdAt ? new Date(baseUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown Date';

    return {
      name: baseUser.name || 'Anonymous User',
      email: baseUser.email || '',
      handle: baseUser.name ? `@${baseUser.name.replace(/\s+/g, '').toLowerCase()}` : '@user',
      avatar: baseUser.avatar || '/media/poster-5.png', // A generic default avatar
      bio: baseUser.bio || 'No bio provided.',
      location: baseUser.location || '',
      verified: baseUser.verified || false,
      rank: baseUser.rank || 'Newbie',
      website: baseUser.website || '',
      joinDate: joinedDate,
      joined: `Joined ${joinedDate}`,
      reviews: reviews.length,
      articles: articles.length,
    }
  }, [user, dbUser, reviews.length, articles.length]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12">
        {isLoading || !displayUser ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Profile Header & Stats */}
            <div className="w-full lg:w-1/3 flex-shrink-0 space-y-6">
              <ProfileHeader user={displayUser} />
            </div>

            {/* Right Column: Content */}
            <div className="w-full lg:w-2/3 flex-1 flex flex-col min-w-0">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="min-h-[500px]">
                <>
                  {activeTab === 'overview' && (
                    <div className="flex flex-col gap-10">
                      <div>
                        <h2 className="text-2xl font-bold font-serif mb-6 tracking-tight">Recent Reviews</h2>
                        <ReviewsList reviews={reviews.slice(0, 2)} onDelete={handleDeleteReview} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-serif mb-6 tracking-tight">Latest Articles</h2>
                        <ArticlesList articles={articles.slice(0, 2)} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && <ReviewsList reviews={reviews} onDelete={handleDeleteReview} />}
                  {activeTab === 'articles' && <ArticlesList articles={articles} />}
                  {activeTab === 'timeline' && (
                    timeline.length > 0 ? (
                      <TimelineRail
                        groupedActivities={groupActivitiesByDate(timeline)}
                        expandedIds={new Set()}
                        onToggleExpand={() => { }}
                        onRemove={async () => { }}
                        onUpdateActionType={async () => { }}
                      />
                    ) : (
                      <EmptyState />
                    )
                  )}
                  {activeTab === 'wishlist' && <WishlistDisplay items={wishlist} onRemove={handleRemoveWishlist} />}
                  {activeTab === 'settings' && (
                    <SettingsTab isDark={isDark} setIsDark={setIsDark} />
                  )}
                </>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
