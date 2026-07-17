import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ProfileHeader from '../components/profile/ProfileHeader'
import TabNavigation from '../components/profile/TabNavigation'
import ReviewsList from '../components/profile/ReviewsList'
import ArticlesList from '../components/profile/ArticlesList'
import WishlistDisplay from '../components/profile/WishlistDisplay'
import SettingsTab from '../components/profile/SettingsTab'
import { mockUser, mockReviews, mockArticles, mockWishlist } from '../data/mockData'

interface ProfilePageProps {
  isDark?: boolean
  setIsDark?: (dark: boolean) => void
}

export default function ProfilePage(props: ProfilePageProps) {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [localIsDark, setLocalIsDark] = useState(() => document.documentElement.classList.contains('dark'))

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

  const isDark = props.isDark !== undefined ? props.isDark : localIsDark
  const setIsDark = props.setIsDark || ((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Header & Stats */}
          <div className="w-full lg:w-1/3 flex-shrink-0 space-y-6">
            <ProfileHeader user={mockUser} />
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-2/3 flex-1 flex flex-col min-w-0">
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="min-h-[500px]">
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-10">
                  <div>
                    <h2 className="text-2xl font-bold font-serif mb-6 tracking-tight">Recent Reviews</h2>
                    <ReviewsList reviews={mockReviews.slice(0, 2)} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-serif mb-6 tracking-tight">Latest Articles</h2>
                    <ArticlesList articles={mockArticles.slice(0, 2)} />
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && <ReviewsList reviews={mockReviews} />}
              {activeTab === 'articles' && <ArticlesList articles={mockArticles} />}
              {activeTab === 'wishlist' && <WishlistDisplay items={mockWishlist} />}
              {activeTab === 'settings' && (
                <SettingsTab isDark={isDark} setIsDark={setIsDark} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
