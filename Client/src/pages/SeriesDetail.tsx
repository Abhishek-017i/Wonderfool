import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Bookmark, Star, CheckCircle, PenTool, Clock, Tv, BookOpen, Globe, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Series } from '@/types/series'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const renderName = (name: any): string => {
  if (!name) return 'Unknown';
  if (typeof name === 'string') return name;
  return name.full || name.userPreferred || name.native || 'Unknown';
};

const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Airing',
  finished: 'Finished',
  hiatus: 'Hiatus',
  cancelled: 'Cancelled',
}

const TYPE_LABELS: Record<string, string> = {
  ANIME: 'Anime',
  MANGA: 'Manga',
  NOVEL: 'Light Novel',
}

const COUNTRY_LABELS: Record<string, string> = {
  JP: '🇯🇵 Japan',
  KR: '🇰🇷 Korea',
  CN: '🇨🇳 China',
  TW: '🇹🇼 Taiwan',
}

export default function SeriesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [toast, setToast] = useState<string | null>(null)
  const [series, setSeries] = useState<Series | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_URL}/series/${id}`)
        if (!response.ok) {
          if (response.status === 404) throw new Error('Series not found')
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setSeries(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load series')
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchSeries()
  }, [id])

  const handleTimelineAction = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setToast('Added to Timeline')
    setTimeout(() => setToast(null), 2000)
  }

  const handleWishlistAction = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setToast('Added to Wishlist')
    setTimeout(() => setToast(null), 2000)
  }

  const title = series?.title?.english || series?.title?.romaji || series?.title?.native || 'Loading...'
  const year = series?.startDate ? new Date(series.startDate).getFullYear() : null
  const endYear = series?.endDate ? new Date(series.endDate).getFullYear() : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-serif italic">Loading series...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-cinzel mb-2">Series Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'This series could not be loaded.'}</p>
            <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-all duration-200">
      <Navbar />
      
      <main className="flex-1 w-full pt-20">
        {/* Banner area */}
        <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-[5]" />
          <img 
            src={series.bannerImage || series.coverImage || ''} 
            alt={title} 
            className="w-full h-full object-cover blur-md scale-110"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-32 pb-20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Column */}
            <div className="w-48 sm:w-64 flex-shrink-0 mx-auto md:mx-0">
              <div className="rounded-2xl overflow-hidden luxury-shadow border-4 border-background bg-card aspect-[2/3]">
                {series.coverImage ? (
                  <img 
                    src={series.coverImage} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground font-serif italic text-sm">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-3">
                <Button 
                  onClick={handleTimelineAction}
                  className="w-full bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground hover:shadow-[0_0_20px_rgba(244,216,69,0.4)]"
                >
                  <CheckCircle className="mr-2" size={18} />
                  Add to Timeline
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleWishlistAction}
                  className="w-full"
                >
                  <Bookmark className="mr-2" size={18} />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            {/* Info Column */}
            <div className="flex-1 pt-4 md:pt-12 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-foreground mb-2 drop-shadow-md">
                {title}
              </h1>

              {/* Alternative titles */}
              {(series.title?.romaji && series.title.romaji !== title) && (
                <p className="text-sm text-muted-foreground font-serif italic mb-4">
                  {series.title.romaji}
                  {series.title?.native && ` · ${series.title.native}`}
                </p>
              )}
              
              {/* Meta badges row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6 text-sm font-semibold">
                {series.type && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {TYPE_LABELS[series.type] || series.type}
                  </Badge>
                )}
                {series.status && (
                  <Badge variant="outline" className="border-border">
                    <Clock size={12} className="mr-1" />
                    {STATUS_LABELS[series.status] || series.status}
                  </Badge>
                )}
                {year && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar size={14} />
                    {year}{endYear && endYear !== year ? ` – ${endYear}` : ''}
                  </span>
                )}
                {series.countryOfOrigin && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Globe size={14} />
                    {COUNTRY_LABELS[series.countryOfOrigin] || series.countryOfOrigin}
                  </span>
                )}
                {series.episodeCount && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Tv size={14} />
                    {series.episodeCount} episodes
                  </span>
                )}
                {series.chapterCount && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <BookOpen size={14} />
                    {series.chapterCount} chapters
                  </span>
                )}
                {series.volumeCount && (
                  <span className="text-muted-foreground">
                    {series.volumeCount} volumes
                  </span>
                )}
              </div>
              
              {/* Genres */}
              {series.genres && series.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                  {series.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Staff / Creator */}
              {series.staff && series.staff.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
                  {series.staff.filter(s => s.personId).map((staffMember, idx) => (
                    <Link 
                      key={idx}
                      to={`/creator/${staffMember.personId?._id}`} 
                      className="inline-flex items-center gap-3 p-3 pr-6 rounded-full bg-card/40 border border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border group-hover:border-primary transition-colors bg-muted flex items-center justify-center">
                        {staffMember.personId?.photo ? (
                          <img src={staffMember.personId.photo} alt={renderName(staffMember.personId.name)} className="w-full h-full object-cover" />
                        ) : (
                          <PenTool size={16} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          <PenTool size={12} className="text-accent" />
                          {staffMember.designation || 'Staff'}
                        </div>
                        <div className="text-sm font-bold font-cinzel text-foreground group-hover:text-primary transition-colors">
                          {renderName(staffMember.personId?.name)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {series.synopsis && (
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl text-left mb-8">
                  <h3 className="text-lg font-bold font-serif mb-3">Synopsis</h3>
                  <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                    {series.synopsis}
                  </p>
                </div>
              )}

              {/* Characters */}
              {series.characters && series.characters.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold font-serif mb-4">Characters</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {series.characters.map((char, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                          {char.photo ? (
                            <img src={char.photo} alt={renderName(char.name)} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                              {renderName(char.name).charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{renderName(char.name)}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {char.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Adaptations */}
              {series.adaptations && series.adaptations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold font-serif mb-4">Related Series</h3>
                  <div className="flex flex-wrap gap-3">
                    {series.adaptations.filter(a => a.seriesId).map((adaptation, idx) => (
                      <Link
                        key={idx}
                        to={`/series/${adaptation.seriesId?._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all"
                      >
                        {adaptation.seriesId?.coverImage && (
                          <img src={adaptation.seriesId.coverImage} alt="" className="w-10 h-14 rounded-md object-cover" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {adaptation.seriesId?.title?.english || adaptation.seriesId?.title?.romaji || 'Related'}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {adaptation.relationType || 'Adaptation'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-card border border-primary/20 text-foreground px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 font-semibold"
        >
          <CheckCircle className="text-primary" size={20} />
          {toast}
        </motion.div>
      )}

      <Footer />
    </div>
  )
}
