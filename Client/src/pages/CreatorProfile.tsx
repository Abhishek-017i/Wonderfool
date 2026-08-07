import { useParams } from 'react-router-dom'
import { useCreator } from '../hooks/useCreator'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CreatorHero from '../components/creator/CreatorHero'
import CreatorHeroSkeleton from '../components/creator/CreatorHeroSkeleton'
import Biography from '../components/creator/Biography'
import KnownWorks from '../components/creator/KnownWorks'
import SeriesCardSkeleton from '../components/browse/SeriesCardSkeleton'
import ErrorState from '../components/browse/ErrorState'
import { Globe, Link as LinkIcon } from 'lucide-react'

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>()
  const { creator, isLoading, error, retry } = useCreator(id || '')

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
        <main className="flex-1 w-full max-w-[1400px] mx-auto pb-12 pt-16">
          <CreatorHeroSkeleton />
          <div className="mt-12 space-y-16 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="h-10 w-40 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 bg-muted rounded animate-pulse w-full" />
                <div className="h-5 bg-muted rounded animate-pulse w-full" />
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
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

  const renderSocialIcon = (platform: string) => {
    const p = platform.toLowerCase()
    if (p.includes('twitter') || p.includes('x')) return <Globe className="w-4 h-4" />
    if (p.includes('instagram') || p.includes('ig')) return <Globe className="w-4 h-4" />
    if (p.includes('website') || p.includes('blog')) return <Globe className="w-4 h-4" />
    return <LinkIcon className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-20 pt-16">
        <article className="max-w-[1400px] mx-auto bg-card/30 rounded-b-3xl shadow-2xl overflow-hidden border-x border-b border-border/50">
          
          <CreatorHero
            name={creator.name}
            photo={creator.photo}
            designation={creator.designation}
            yearsActive={creator.yearsActive}
          />

          <div className="px-4 sm:px-8 lg:px-12 py-16 space-y-16 max-w-6xl mx-auto">
            {/* Bio and Socials */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-8"
            >
              {creator.socials && creator.socials.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {creator.socials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold text-sm shadow-sm"
                    >
                      {renderSocialIcon(social.platform)}
                      {social.platform}
                    </a>
                  ))}
                </div>
              )}

              {creator.bio && <Biography bio={creator.bio} />}
            </motion.div>

            {creator.knownWorks && creator.knownWorks.length > 0 && (
              <>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                <KnownWorks works={creator.knownWorks} />
              </>
            )}

          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
