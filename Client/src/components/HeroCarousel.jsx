/* eslint-disable react-hooks/purity */
import { useState, useEffect } from 'react'
import { ChevronRight, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'



export default function HeroCarousel({ series = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (series.length || 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const moveX = (clientX / window.innerWidth) * 20 - 10
    const moveY = (clientY / window.innerHeight) * 20 - 10
    setMousePosition({ x: moveX, y: moveY })
  }

  if (!series || series.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-black flex items-center justify-center" style={{ height: '80vh', minHeight: '650px', maxHeight: '900px' }}>
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
      </div>
    )
  }

  const currentItem = series[currentSlide]
  const title = currentItem.title?.english || currentItem.title?.romaji || currentItem.title?.native || 'Unknown'
  const year = currentItem.startDate ? new Date(currentItem.startDate).getFullYear() : 'N/A'
  const score = currentItem.averageScore ? (currentItem.averageScore / 10).toFixed(1) : 'N/A'
  const typeLabel = currentItem.type === 'ANIME' ? 'ANIME SERIES' : currentItem.type === 'MANGA' ? 'MANGA SERIES' : 'LIGHT NOVEL'
  
  // Clean synopsis (AniList returns HTML sometimes)
  const cleanSynopsis = (currentItem.synopsis || 'No synopsis available.').replace(/<[^>]*>?/gm, '')
  
  return (
    <div 
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '80vh', minHeight: '650px', maxHeight: '900px' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Cinematic Background Image with continuous slow zoom & mouse parallax */}
          <motion.img
            src={currentItem.bannerImage || currentItem.coverImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ 
              scale: 1.15,
              x: mousePosition.x * -1,
              y: mousePosition.y * -1
            }}
            transition={{ 
              scale: { duration: 25, ease: "linear" },
              x: { type: "spring", stiffness: 50, damping: 20 },
              y: { type: "spring", stiffness: 50, damping: 20 }
            }}
          />

          {/* Complex Cinematic Overlays */}
          {/* Deep dark gradient from left for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          
          {/* Right fade to darken the poster edge */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent opacity-80" />
          
          {/* Bottom fade blending into black */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-100" />
          
          {/* Subtle vignette around edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          
          {/* Light dust / Golden Noise */}
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.25] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -150, 0],
                  x: [0, (Math.random() - 0.5) * 50, 0],
                  opacity: [0, Math.random() * 0.8 + 0.2, 0],
                  scale: [0, Math.random() + 0.5, 0]
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>



          {/* Content Container (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center pt-16">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <motion.div 
                className="max-w-[700px] relative"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                {/* Subtle glass blur behind text ONLY if needed (using a very soft radial gradient) */}
                <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.4)_0%,_transparent_70%)] blur-2xl pointer-events-none -z-10" />

                <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-5 block font-cinzel text-shadow-sm">
                  {typeLabel}
                </span>
                
                <h1 className="text-5xl md:text-6xl lg:text-[84px] font-cinzel font-black text-white mb-6 leading-[1.05] text-balance drop-shadow-2xl line-clamp-3">
                  {title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90 text-sm font-semibold tracking-wide uppercase">
                  <span className="flex items-center gap-1.5 text-primary text-base">
                    ⭐ {score}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{year}</span>
                  {currentItem.episodeCount && (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      <span>{currentItem.episodeCount} EP</span>
                    </>
                  )}
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/60">{currentItem.status}</span>
                </div>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {currentItem.genres?.slice(0, 3).map((genre) => (
                    <motion.span 
                      key={genre} 
                      className="px-4 py-1.5 bg-black/40 text-primary rounded-full text-xs font-bold tracking-widest uppercase border border-primary/30 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(244,216,69,0.8)', boxShadow: '0 0 10px rgba(244,216,69,0.3)' }}
                    >
                      {genre}
                    </motion.span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/80 mb-10 line-clamp-3 leading-relaxed font-serif drop-shadow-lg max-w-[650px]">
                  {cleanSynopsis}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-5">
                  <motion.button 
                    className="flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-[0.1em] text-sm border border-primary/50 shadow-[0_0_20px_rgba(244,216,69,0.4)]"
                    whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 30px -10px rgba(244,216,69,0.8)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.preventDefault()}
                    title="Coming Soon"
                  >
                    <Play size={18} fill="currentColor" /> Watch Now
                  </motion.button>
                  <Link to={`/series/${currentItem._id || currentItem.id}`}>
                    <motion.button 
                      className="flex items-center gap-2 px-10 py-4 bg-black/40 text-white border border-white/30 backdrop-blur-md rounded-full font-bold uppercase tracking-[0.1em] text-sm hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(255,255,255,0.6)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      More Details <ChevronRight size={18} />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Centered Bottom Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {series.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group relative flex items-center justify-center h-8"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className="w-10 h-[2px] bg-white/20 transition-colors duration-300 group-hover:bg-white/40 overflow-hidden relative rounded-full">
              {idx === currentSlide && (
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-primary shadow-[0_0_10px_rgba(244,216,69,0.8)]" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
