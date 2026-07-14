import { useState } from 'react'
import { Film, Calendar } from 'lucide-react'

export default function SeriesCard({ series }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300"
      style={{
        width: isHovered ? '300px' : '200px',
        height: isHovered ? '380px' : '300px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <img
        src={series.poster}
        alt={series.title}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />

      {/* Default State - Minimal Title Label */}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-3 rounded-lg">
          <p className="text-sm font-semibold text-foreground line-clamp-2">
            {series.title}
          </p>
        </div>
      )}

      {/* Hover State - Full Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex flex-col justify-between p-4 rounded-lg">
          {/* Title and Rating */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {series.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-primary">
                ⭐ {series.rating}
              </span>
              <span className="text-xs text-foreground/70">{series.year}</span>
            </div>
          </div>

          {/* Metadata and Overview */}
          <div>
            {/* Seasons/Episodes */}
            <div className="flex items-center gap-2 mb-3 text-sm text-foreground/80">
              <Film size={16} />
              <span>{series.seasons} season{series.seasons !== 1 ? 's' : ''}</span>
            </div>

            {/* Overview */}
            <p className="text-xs text-foreground/70 line-clamp-3 mb-3">
              {series.overview}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-1">
              {series.genres.slice(0, 2).map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
