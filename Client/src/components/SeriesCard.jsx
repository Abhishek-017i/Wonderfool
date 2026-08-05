import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SeriesCard({ series, index }) {
  const title = series.title?.english || series.title?.romaji || series.title?.native || series.title || 'Unknown'
  const poster = series.coverImage || series.poster
  const score = series.averageScore ? (series.averageScore / 10).toFixed(1) : series.rating
  const year = series.startDate ? new Date(series.startDate).getFullYear() : series.year
  const lengthText = series.episodeCount 
    ? `${series.episodeCount} ep${series.episodeCount !== 1 ? 's' : ''}` 
    : series.chapterCount 
      ? `${series.chapterCount} ch` 
      : `${series.seasons || 1} season${(series.seasons || 1) !== 1 ? 's' : ''}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative w-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-card"
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Poster Image */}
      <motion.img
        src={poster}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover origin-center"
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
      />
      
      {/* 1px Golden Glow effect on hover */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors duration-500 z-20 pointer-events-none luxury-shadow" />

      {/* Glass Overlay Gradient - Only bottom 3/4 to keep top vibrant */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      <Link
        to={`/series/${series._id || series.id || 1}`}
        className="absolute inset-0 z-30 md:hidden"
        aria-label={`View ${title}`}
      />

      {/* Content — on touch devices content stays visible (no hover translate) */}
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 z-20 pointer-events-none">
        <div className="translate-y-0 md:translate-y-10 md:group-hover:translate-y-0 transition-transform duration-500 ease-out min-w-0 w-full">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
              ⭐ {score}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{year}</span>
          </div>

          <h3
            className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-cinzel leading-snug line-clamp-3 sm:line-clamp-2 break-words"
            title={title}
          >
            {title}
          </h3>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-white/60 mb-3 sm:mb-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-150">
            <Film size={14} className="shrink-0" />
            <span className="truncate">{lengthText}</span>
          </div>

          <Link to={`/series/${series._id || series.id || 1}`} className="w-full mt-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 pointer-events-auto">
            <motion.button 
              className="w-full py-3 bg-gradient-to-r from-accent to-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_15px_rgba(244,216,69,0.3)] border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
