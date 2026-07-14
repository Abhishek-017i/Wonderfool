import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const carouselItems = [
  {
    id: 1,
    title: 'Attack on Titan: The Final Battle',
    rating: 9.2,
    year: 2023,
    overview: 'Humanity faces its greatest threat as the final war between Titans and mankind reaches its climax.',
    genres: ['Action', 'Dark Fantasy', 'Drama'],
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Demon Slayer: Swordsmith Village',
    rating: 8.8,
    year: 2023,
    overview: 'Tanjiro and his companions visit the Swordsmith Village to forge new weapons and uncover dark secrets.',
    genres: ['Action', 'Shounen', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1578926314433-ed15b2e90ff5?w=1200&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen: Hidden Inventory',
    rating: 8.9,
    year: 2023,
    overview: 'Discover the origin stories of the most powerful sorcerers before they became legends.',
    genres: ['Action', 'Supernatural', 'Shounen'],
    image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b78?w=1200&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Solo Leveling Season 2',
    rating: 8.9,
    year: 2024,
    overview: 'The S-rank hunter faces new enemies as his powers continue to evolve and mysteries deepen.',
    genres: ['Action', 'Fantasy', 'Adventure'],
    image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1200&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Frieren: Beyond Journey\'s End',
    rating: 8.8,
    year: 2023,
    overview: 'An elf mage discovers the beauty in life\'s small moments during a long journey home.',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=600&fit=crop',
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const currentItem = carouselItems[currentSlide]

  return (
    <div className="relative w-full h-screen overflow-hidden rounded-none">
      {/* Carousel Background Image */}
      <img
        src={currentItem.image}
        alt={currentItem.title}
        className="absolute inset-0 w-full h-full object-cover rounded-none"
      />

      {/* Gradient Overlay - Dark on LEFT, Transparent on RIGHT */}
      <div 
        className="absolute inset-0 rounded-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 100%)'
        }}
      />

      {/* Content - Left Aligned */}
      <div className="absolute inset-0 flex items-center rounded-none">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            {currentItem.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg font-semibold text-primary">
              ⭐ {currentItem.rating}
            </span>
            <span className="text-lg text-muted-foreground">{currentItem.year}</span>
          </div>

          <p className="text-lg text-muted-foreground mb-6 line-clamp-3 max-w-lg">
            {currentItem.overview}
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {currentItem.genres.map((genre, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-primary text-neutral-900 rounded-full text-sm font-medium"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* View More Button */}
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-neutral-900 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            View More <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all ${
              idx === currentSlide
                ? 'w-8 h-2 bg-primary rounded-full'
                : 'w-2 h-2 bg-foreground/40 rounded-full hover:bg-foreground/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
