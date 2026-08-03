/* eslint-disable react-hooks/purity */
import { useState, useEffect } from 'react'
import { ChevronRight, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

export default function HeroCarousel({ series = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (series.length || 1))
    }, 7000)
    return () => clearInterval(interval)
  }, [series.length])

  if (!series || series.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-black flex items-center justify-center" style={{ height: '85vh', minHeight: '650px', maxHeight: '900px' }}>
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
      </div>
    )
  }

  const currentItem = series[currentSlide]
  const title = currentItem.title?.english || currentItem.title?.romaji || currentItem.title?.native || 'Unknown'
  const year = currentItem.startDate ? new Date(currentItem.startDate).getFullYear() : ''
  const score = currentItem.averageScore ? (currentItem.averageScore / 10).toFixed(1) : ''
  const typeLabel = currentItem.type === 'ANIME' ? 'ANIME SERIES' : currentItem.type === 'MANGA' ? 'MANGA SERIES' : 'LIGHT NOVEL'
  
  // Clean synopsis (AniList returns HTML sometimes)
  const cleanSynopsis = (currentItem.synopsis || 'No synopsis available.').replace(/<[^>]*>?/gm, '')
  
  return (
    <div 
      className="relative w-full overflow-hidden bg-black group"
      style={{ height: '85vh', minHeight: '650px', maxHeight: '900px' }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Blurred Background Image - ensures portrait covers look good as backgrounds */}
          <motion.div
            className="absolute inset-0 w-full h-full scale-110"
            initial={{ scale: 1.15, filter: 'blur(20px) brightness(0.4)' }}
            animate={{ scale: 1.05, filter: 'blur(16px) brightness(0.6)' }}
            transition={{ duration: 10, ease: "easeOut" }}
          >
            <img
              src={currentItem.bannerImage || currentItem.coverImage}
              alt="Background"
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>

          {/* Overlays for Depth and Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100 z-0" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent z-0 hidden lg:block" />
          
          {/* Subtle vignette and texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)] pointer-events-none z-0" />
          <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] z-0" />

          {/* Content Layout */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between gap-12 w-full h-full pt-20 pb-16">
              
              {/* Left Side Text Content */}
              <motion.div 
                className="max-w-[700px] flex-1 flex flex-col justify-center"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-cinzel font-bold tracking-widest uppercase hover:bg-primary/30 px-3 py-1 text-xs backdrop-blur-md">
                    {typeLabel}
                  </Badge>
                  {currentItem.status && (
                    <Badge variant="outline" className="text-white/70 border-white/20 uppercase tracking-widest text-[10px] px-2 py-1 backdrop-blur-md">
                      {currentItem.status}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-cinzel font-black text-white mb-6 leading-tight text-balance drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] line-clamp-3">
                  {title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90 text-sm font-semibold tracking-wider uppercase">
                  {score && (
                    <span className="flex items-center gap-1.5 text-primary text-base drop-shadow-md">
                      ⭐ {score}
                    </span>
                  )}
                  {score && year && <div className="w-1.5 h-1.5 rounded-full bg-white/40" />}
                  {year && <span>{year}</span>}
                  {currentItem.episodeCount && (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span>{currentItem.episodeCount} EP</span>
                    </>
                  )}
                </div>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {currentItem.genres?.slice(0, 4).map((genre) => (
                    <span 
                      key={genre} 
                      className="px-3.5 py-1.5 bg-white/5 text-white/90 rounded-md text-xs font-semibold tracking-wider border border-white/10 backdrop-blur-md"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-lg text-white/70 mb-10 line-clamp-4 leading-relaxed max-w-[600px] drop-shadow-sm font-medium">
                  {cleanSynopsis}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <motion.button 
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground rounded-md font-bold uppercase tracking-wider text-sm hover:brightness-110 shadow-[0_0_20px_rgba(244,216,69,0.3)] transition-all"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play size={18} fill="currentColor" /> Watch Now
                  </motion.button>
                  <Link to={`/series/${currentItem._id || currentItem.id}`}>
                    <motion.button 
                      className="flex items-center gap-2.5 px-8 py-3.5 bg-black/40 text-white border border-white/20 backdrop-blur-md rounded-md font-bold uppercase tracking-wider text-sm hover:bg-white/10 hover:border-white/40 transition-all"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Details <ChevronRight size={18} />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Right Side Poster Image (Hidden on Mobile) */}
              <motion.div 
                className="hidden lg:block relative w-[320px] xl:w-[380px] shrink-0 perspective-1000"
                initial={{ x: 50, opacity: 0, rotateY: 15 }}
                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <motion.div 
                  className="w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={currentItem.coverImage}
                    alt={`${title} Poster`}
                    className="w-full h-full object-cover"
                  />
                  {/* Glassmorphism reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                </motion.div>
                
                {/* Glow behind poster */}
                <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full -z-10 opacity-40 animate-pulse" />
              </motion.div>
              
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Centered Bottom Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {series.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group relative flex items-center justify-center h-8"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className={`h-[3px] transition-all duration-300 relative rounded-full overflow-hidden ${idx === currentSlide ? 'w-12 bg-white/30' : 'w-6 bg-white/20 group-hover:bg-white/40'}`}>
              {idx === currentSlide && (
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-primary" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
