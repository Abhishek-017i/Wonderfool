/* eslint-disable react-hooks/purity */
import { useState, useEffect } from 'react'
import { ChevronRight, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const carouselItems = [
  {
    id: 1,
    title: 'Attack on Titan: The Final Battle',
    rating: 9.2,
    year: 2023,
    runtime: '24m/ep',
    status: 'Finished',
    overview: 'Humanity faces its greatest threat as the final war between Titans and mankind reaches its climax.',
    genres: ['Action', 'Dark Fantasy', 'Drama'],
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1920&h=1080&fit=crop',
    characterImage: 'https://images.unsplash.com/photo-1580477667995-2b92f6f7b528?w=800&h=1000&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Demon Slayer: Swordsmith Village',
    rating: 8.8,
    year: 2023,
    runtime: '24m/ep',
    status: 'Finished',
    overview: 'Tanjiro and his companions visit the Swordsmith Village to forge new weapons and uncover dark secrets.',
    genres: ['Action', 'Shounen', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1578926314433-ed15b2e90ff5?w=1920&h=1080&fit=crop',
    characterImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=1000&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen: Hidden Inventory',
    rating: 8.9,
    year: 2023,
    runtime: '24m/ep',
    status: 'Finished',
    overview: 'Discover the origin stories of the most powerful sorcerers before they became legends.',
    genres: ['Action', 'Supernatural', 'Shounen'],
    image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b78?w=1920&h=1080&fit=crop',
    characterImage: 'https://images.unsplash.com/photo-1613336026275-d6d473084e85?w=800&h=1000&fit=crop&q=80',
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const moveX = (clientX / window.innerWidth) * 20 - 10
    const moveY = (clientY / window.innerHeight) * 20 - 10
    setMousePosition({ x: moveX, y: moveY })
  }

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
            src={carouselItems[currentSlide].image}
            alt={carouselItems[currentSlide].title}
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
          {/* Dark left gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          {/* Warm ivory right fade */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#F8F5E3]/10 to-transparent opacity-40 mix-blend-overlay" />
          
          {/* Subtle vignette around edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)] pointer-events-none" />
          
          {/* Bottom fade blending into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-100" />
          
          {/* Light dust / Golden Noise */}
          <div className="absolute inset-0 mix-blend-overlay opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

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

          {/* Character Artwork / Key Visual (Right Side) */}
          <motion.div 
            className="absolute right-0 bottom-0 top-20 w-[40%] max-w-[600px] pointer-events-none hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: 1, 
              x: mousePosition.x * 2,
              y: mousePosition.y * 2
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.2 },
              x: { type: "spring", stiffness: 40, damping: 20 },
              y: { type: "spring", stiffness: 40, damping: 20 }
            }}
          >
            {/* Subtle floating animation on the character */}
            <motion.img
              src={carouselItems[currentSlide].characterImage}
              alt="Character"
              className="w-full h-full object-cover object-left mask-image-gradient-b drop-shadow-2xl opacity-60"
              style={{
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Content Container (Left Aligned) */}
          <div className="absolute inset-0 flex flex-col justify-center pt-16">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
              <motion.div 
                className="max-w-[600px] relative"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                {/* Subtle glass blur behind text ONLY if needed (using a very soft radial gradient) */}
                <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.4)_0%,_transparent_70%)] blur-2xl pointer-events-none -z-10" />

                <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-3 block font-serif">
                  Studio MAPPA
                </span>
                
                <h1 className="text-5xl md:text-6xl lg:text-[72px] font-cinzel font-black text-white mb-6 leading-[1.1] text-balance drop-shadow-xl">
                  {carouselItems[currentSlide].title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90 text-sm font-semibold tracking-wide uppercase">
                  <span className="flex items-center gap-1.5 text-primary text-base">
                    ⭐ {carouselItems[currentSlide].rating}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{carouselItems[currentSlide].year}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span>{carouselItems[currentSlide].runtime}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/60">{carouselItems[currentSlide].status}</span>
                </div>

                {/* Genre Pills */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {carouselItems[currentSlide].genres.map((genre) => (
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
                <p className="text-lg text-white/80 mb-10 line-clamp-2 leading-relaxed font-serif drop-shadow-md max-w-[550px]">
                  {carouselItems[currentSlide].overview}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-5">
                  <motion.button 
                    className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground rounded-full font-bold uppercase tracking-[0.1em] text-sm border-none"
                    whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 30px -10px rgba(244,216,69,0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.preventDefault()}
                    title="Coming Soon"
                  >
                    <Play size={18} fill="currentColor" /> Watch Now
                  </motion.button>
                  <motion.button 
                    className="flex items-center gap-2 px-10 py-4 bg-white/5 text-white border border-white/20 backdrop-blur-md rounded-full font-bold uppercase tracking-[0.1em] text-sm"
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.preventDefault()}
                    title="Coming Soon"
                  >
                    More Details <ChevronRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Centered Bottom Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {carouselItems.map((_, idx) => (
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
