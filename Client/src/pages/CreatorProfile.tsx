import { useParams } from 'react-router-dom'
import { useCreator } from '../hooks/useCreator'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CreatorHero from '../components/creator/CreatorHero'
import CreatorHeroSkeleton from '../components/creator/CreatorHeroSkeleton'
import Biography from '../components/creator/Biography'
import CreatorInfo from '../components/creator/CreatorInfo'
import KnownWorks from '../components/creator/KnownWorks'
import Spotlight from '../components/creator/Spotlight'
import Achievements from '../components/creator/Achievements'
import CommunityStats from '../components/creator/CommunityStats'
import RelatedCreators from '../components/creator/RelatedCreators'
import CreatorCardSkeleton from '../components/creator/CreatorCardSkeleton'
import ErrorState from '../components/browse/ErrorState'
import SeriesCardSkeleton from '../components/browse/SeriesCardSkeleton'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>()
  const { creator, isLoading, error, retry } = useCreator(id || '')

  // Scroll to top when creator ID changes (e.g. clicking related creator)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <ErrorState
            title="Failed to Load Creator Profile"
            message={error.message || "An unexpected error occurred while loading this creator."}
            onRetry={retry}
          />
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-[1400px] mx-auto pb-12">
          {/* Hero Skeleton */}
          <CreatorHeroSkeleton />

          {/* Content Skeleton */}
          <div className="mt-12 space-y-16 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
            {/* Biography Skeleton */}
            <div className="space-y-4">
              <div className="h-10 w-40 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse w-full" />
                <div className="h-5 bg-muted rounded animate-pulse w-full" />
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>

            {/* Known Works Skeleton */}
            <div className="space-y-6">
              <div className="h-10 w-48 bg-muted rounded animate-pulse" />
              <div className="flex gap-4 pb-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-[160px] sm:w-[200px] flex-shrink-0">
                    <SeriesCardSkeleton viewMode="grid" />
                  </div>
                ))}
              </div>
            </div>

            {/* Related Creators Skeleton */}
            <div className="space-y-6">
              <div className="h-10 w-48 bg-muted rounded animate-pulse" />
              <div className="flex gap-4 pb-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <CreatorCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <ErrorState
            title="Creator Not Found"
            message="The creator you are looking for does not exist or has been removed."
            onRetry={retry}
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-20">
        <article className="max-w-[1400px] mx-auto bg-card/30 rounded-b-3xl shadow-2xl overflow-hidden border-x border-b border-border/50">
          {/* Hero Section */}
          <CreatorHero
            name={creator.name}
            roles={creator.roles}
            country={creator.country}
            avatarUrl={creator.avatarUrl}
            bannerUrl={creator.bannerUrl}
          />

          {/* Main Content */}
          <div className="px-4 sm:px-8 lg:px-12 py-16 space-y-20 max-w-6xl mx-auto">
            {/* Top Row: Bio & Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-12"
            >
              <Biography bio={creator.bio} />
              
              <CreatorInfo
                activeYears={creator.activeYears}
                studios={creator.studios}
                roles={creator.roles}
                socials={creator.socials}
              />
            </motion.div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CommunityStats
                followers={creator.stats.followers}
                avgRating={creator.stats.avgRating}
                totalWorks={creator.stats.totalWorks}
              />
            </motion.div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Known Works */}
            <KnownWorks works={creator.knownWorks} />

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Spotlight */}
            <Spotlight
              title={creator.spotlightWork.title}
              coverUrl={creator.spotlightWork.coverUrl}
              rating={creator.spotlightWork.rating}
              year={creator.spotlightWork.year}
              description={creator.spotlightWork.description}
              role={creator.spotlightWork.role}
            />

            {/* Achievements */}
            {creator.achievements.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                <Achievements achievements={creator.achievements} />
              </>
            )}

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Related Creators */}
            <RelatedCreators creators={creator.relatedCreators} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
