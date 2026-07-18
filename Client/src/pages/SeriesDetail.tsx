import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Bookmark, Star, CheckCircle, PenTool } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { seriesData } from '@/data/series'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SeriesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [toast, setToast] = useState<string | null>(null)

  // Find series by id or mock one if not found (for Timeline links that don't match seriesData)
  const series = seriesData.find(s => s.id === id || s.id.toString() === id) || {
    id: 'mock',
    title: 'Unknown Series',
    year: 2026,
    seasons: 1,
    rating: 9.0,
    poster: '/media/poster-1.png',
  }

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

  return (
    <div className="min-h-screen bg-background flex flex-col transition-all duration-200">
      <Navbar />
      
      <main className="flex-1 w-full pt-20">
        <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-[5]" />
          <img 
            src={series.poster} 
            alt={series.title} 
            className="w-full h-full object-cover blur-md scale-110"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-32 pb-20">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Column */}
            <div className="w-48 sm:w-64 flex-shrink-0 mx-auto md:mx-0">
              <div className="rounded-2xl overflow-hidden luxury-shadow border-4 border-background bg-card aspect-[2/3]">
                <img 
                  src={series.poster} 
                  alt={series.title} 
                  className="w-full h-full object-cover"
                />
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
              <h1 className="text-3xl md:text-5xl font-bold font-cinzel text-foreground mb-4 drop-shadow-md">
                {series.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1 text-primary">
                  <Star size={16} fill="currentColor" />
                  {series.rating}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>{series.year}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span>{series.seasons} Season{series.seasons !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Action</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Fantasy</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Adventure</Badge>
              </div>

              <div className="mb-8">
                <Link to="/creator/1" className="inline-flex items-center gap-3 p-3 pr-6 rounded-full bg-card/40 border border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border group-hover:border-primary transition-colors">
                    <img src="/blog/avatar-3.png" alt="Creator" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <PenTool size={12} className="text-accent" />
                      Created By
                    </div>
                    <div className="text-sm font-bold font-cinzel text-foreground group-hover:text-primary transition-colors">
                      Akira Toriyama
                    </div>
                  </div>
                </Link>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl text-left">
                <h3 className="text-lg font-bold font-serif mb-3">Synopsis</h3>
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                  An epic journey awaits in {series.title}. As the world changes, heroes must rise to face unprecedented challenges, uncover deep mysteries, and fight for what they believe in. 
                </p>
              </div>
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
