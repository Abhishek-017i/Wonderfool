import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SeriesCard from './SeriesCard'

export default function HorizontalScrollRow({ title, series }) {
  const scrollContainer = useRef(null)

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 400
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="w-full py-12 px-4">
      <div className="container mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-foreground mb-6">
          {title}
        </h2>

        {/* Scroll Container */}
        <div className="relative group">
          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-20 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-20 pointer-events-none bg-gradient-to-l from-background to-transparent" />

          {/* Scrollable Content */}
          <div
            ref={scrollContainer}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
          >
            {series.map((item) => (
              <SeriesCard key={item.id} series={item} />
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}