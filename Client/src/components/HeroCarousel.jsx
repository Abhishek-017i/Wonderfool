import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Heart, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

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
      <div className="relative w-full overflow-hidden bg-black flex items-center justify-center" style={{ height: '75vh', minHeight: '600px', maxHeight: '800px' }}>
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
      </div>
    )
  }

  const currentItem = series[currentSlide]
  const title = currentItem.title?.english || currentItem.title?.romaji || currentItem.title?.native || 'Unknown'
  const year = currentItem.startDate ? new Date(currentItem.startDate).getFullYear() : ''
  const score = currentItem.averageScore ? (currentItem.averageScore / 10).toFixed(1) : ''
  const typeLabel = currentItem.type === 'ANIME' ? 'TV' : currentItem.type === 'MANGA' ? 'MANGA' : 'NOVEL'
  
  // Clean synopsis (AniList returns HTML sometimes)
  const cleanSynopsis = (currentItem.synopsis || 'No synopsis available.').replace(/<[^>]*>?/gm, '')
  
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + series.length) % (series.length || 1))
  }
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % (series.length || 1))
  }

  return (
    <div 
      className="relative w-full overflow-hidden bg-[#0a0a0a] group"
      style={{ height: '80vh', minHeight: '600px', maxHeight: '850px' }}
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
          {/* Clear Full Banner Image */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          >
            <img
              src={currentItem.bannerImage || currentItem.coverImage}
              alt="Background"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Cool Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-0 w-full lg:w-3/4" />

          {/* Content Layout */}
          <div className="absolute inset-0 flex flex-col justify-end z-10 pb-16 lg:pb-24">
            <div className="container mx-auto px-6 lg:px-12 w-full">
              
              <motion.div 
                className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                
                {/* Left Side Content */}
                <div className="max-w-[700px] flex-1">
                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 shadow-sm">
                      {typeLabel}
                    </span>
                    {currentItem.episodeCount && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full" /> CC {currentItem.episodeCount}
                      </span>
                    )}
                    {score && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest border border-white/20 shadow-sm flex items-center gap-1.5">
                        ⭐ {score}
                      </span>
                    )}
                    {year && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full" /> {year}
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[64px] font-black text-white mb-4 leading-tight drop-shadow-2xl line-clamp-3 sm:line-clamp-2 break-words">
                    {title}
                  </h1>

                  {/* Genres and Studio */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-white/90 text-sm md:text-base font-semibold drop-shadow-md">
                      {currentItem.genres?.slice(0, 4).join(' · ')}
                    </span>
                    {currentItem.studios?.nodes?.[0] && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white font-semibold tracking-wider border border-white/10">
                        {currentItem.studios.nodes[0].name}
                      </span>
                    )}
                  </div>

                  {/* Synopsis */}
                  <p className="text-base text-white/60 line-clamp-3 leading-relaxed max-w-[650px] drop-shadow-md font-medium mb-6 lg:mb-0">
                    {cleanSynopsis}
                  </p>
                </div>

                {/* Right Side Buttons */}
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <Link to={`/series/${currentItem._id || currentItem.id}`}>
                    <motion.button 
                      className="flex items-center gap-2.5 px-7 py-3.5 bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-lg rounded-full font-bold uppercase tracking-wider text-sm transition-all shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info size={18} /> Details
                    </motion.button>
                  </Link>
                  <motion.button 
                    className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-black hover:bg-white/90 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart size={18} className="fill-current" /> Add to Wishlist
                  </motion.button>
                </div>

              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Controls */}
      <div className="absolute bottom-8 right-6 lg:right-12 flex items-center gap-2 z-20">
        <button 
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="px-4 h-10 flex items-center justify-center rounded-md bg-black/40 text-white/90 text-sm font-bold backdrop-blur-md border border-white/10 tracking-widest">
          {currentSlide + 1} <span className="text-white/40 mx-1.5">/</span> {series.length || 1}
        </div>
        <button 
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  )
}
