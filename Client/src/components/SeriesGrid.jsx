import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SeriesCard from './SeriesCard'

export default function SeriesGrid({ title, series, alternateBg = false, linkTo = "/browse", linkText = "View All" }) {
  // Take exactly 5 for desktop to fit the grid perfectly
  const displaySeries = series.slice(0, 5)

  return (
    <div className={`w-full py-20 px-6 lg:px-12 relative ${alternateBg ? 'bg-black/5 dark:bg-white/5 border-y border-border/40' : 'bg-background'}`}>
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12 border-b border-border pb-6">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block font-serif">
              Curated Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-foreground tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            to={linkTo}
            className="hidden md:inline-flex items-center gap-3 text-foreground font-semibold hover:text-primary transition-all group uppercase tracking-widest text-xs"
          >
            {linkText}
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {displaySeries.map((item, idx) => (
            <SeriesCard key={item._id || item.id || idx} series={item} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
