import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, BookmarkPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Series } from '@/types/series'

interface SeriesCardProps {
  series: Series
  variant?: 'grid' | 'compact' | 'list'
  index?: number
}

const STATUS_COLORS: Record<string, string> = {
  ongoing: 'bg-green-500',
  finished: 'bg-muted-foreground',
  upcoming: 'bg-primary',
  hiatus: 'bg-yellow-500',
  cancelled: 'bg-destructive',
}

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

function getTitle(series: Series): string {
  return series.title?.english || series.title?.romaji || series.title?.native || 'Untitled'
}

function getYear(series: Series): string {
  if (!series.startDate) return ''
  const d = new Date(series.startDate)
  return isNaN(d.getTime()) ? '' : String(d.getFullYear())
}

export default function SeriesCard({ series, variant = 'grid', index = 0 }: SeriesCardProps) {
  const [imgError, setImgError] = useState(false)
  const title = getTitle(series)
  const year = getYear(series)
  const statusLabel = STATUS_LABELS[series.status || ''] || series.status || ''
  const typeLabel = TYPE_LABELS[series.type] || series.type

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
        className="group flex gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(171,142,44,0.08)] transition-all duration-300"
      >
        <Link to={`/series/${series._id}`} className="w-16 h-24 shrink-0">
          <div className="w-full h-full rounded-lg overflow-hidden bg-muted border border-border">
            {!imgError && series.coverImage ? (
              <img
                src={series.coverImage}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-xs text-muted-foreground font-serif italic">No img</span>
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link to={`/series/${series._id}`}>
                <h3 className="font-serif font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {title}
                </h3>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {year && `${year} · `}{typeLabel}
              {series.episodeCount && ` · ${series.episodeCount} eps`}
              {series.chapterCount && ` · ${series.chapterCount} chs`}
            </p>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_COLORS[series.status || ''] ?? 'bg-muted-foreground')} />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{statusLabel}</span>
              {series.genres?.slice(0, 2).map((g) => (
                <Badge key={g} variant="outline" className="text-[10px] border-primary/20 text-foreground/70 py-0 px-1.5">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          {series.synopsis && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed hidden sm:block">
              {series.synopsis}
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  // Grid / Compact variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.4) }}
      className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-card border border-border hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(171,142,44,0.12)] transition-all duration-300"
    >
      <Link to={`/series/${series._id}`} className="absolute inset-0 z-30" aria-label={`View ${title}`} />

      {/* Poster */}
      {!imgError && series.coverImage ? (
        <img
          src={series.coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground font-serif italic px-2 text-center">{title}</span>
        </div>
      )}

      {/* Golden glow border on hover */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-xl transition-colors duration-500 z-20 pointer-events-none" />

      {/* Gradient overlay — bottom 2/3 */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

      {/* Bookmark button — appears on hover */}
      <button
        className="absolute top-2 right-2 z-30 p-1.5 rounded-lg bg-background/20 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/20 hover:border-primary/30"
        aria-label={`Bookmark ${title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <BookmarkPlus className="w-3 h-3 text-white" />
      </button>

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-end p-2.5 sm:p-3 z-20">
        <div className="translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 ease-out min-w-0 w-full">
          {/* Year — hidden until hover */}
          <div className="flex items-center gap-2 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
            {year && (
              <>
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{year}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-cinzel text-[11px] sm:text-sm font-bold text-white leading-snug line-clamp-3 sm:line-clamp-2 break-words mb-1.5">
            {title}
          </h3>

          {/* Type badge */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
            <Badge variant="outline" className="text-[9px] border-white/20 text-white/70 bg-black/30 py-0 px-1.5">
              {typeLabel}
            </Badge>
            <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_COLORS[series.status || ''] ?? 'bg-white/40')} />
            <span className="text-[9px] text-white/60 uppercase tracking-wide font-semibold">{statusLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
