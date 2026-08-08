import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LuxuryReviewCard from './LuxuryReviewCard'

interface UserReviewsSliderProps {
  reviews: any[]
  isMine: boolean
  onDelete: (id: string) => void
  onLike: (id: string) => void
  currentUserId: string | undefined
  title?: React.ReactNode
}

export default function UserReviewsSlider({ reviews, isMine, onDelete, onLike, currentUserId, title }: UserReviewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  if (!reviews || reviews.length === 0) return null

  return (
    <div className="mb-4 relative">
      {title && (
        <div className="flex items-center justify-between mb-4">
          {title}
          {reviews.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm font-medium">{currentIndex + 1} / {reviews.length}</span>
            </div>
          )}
        </div>
      )}

      <div className="relative group flex items-center">
        {reviews.length > 1 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 z-20 h-10 w-10 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white/70 hover:text-white drop-shadow-md" 
            onClick={() => {
              const newIdx = (currentIndex - 1 + reviews.length) % reviews.length;
              setCurrentIndex(newIdx);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({ left: newIdx * sliderRef.current.offsetWidth, behavior: 'smooth' });
              }
            }}
          >
            <ChevronLeft size={20} />
          </Button>
        )}

        <div className="relative w-full overflow-hidden">
          {isMine && <div className="absolute -inset-[2px] bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/0 rounded-[22px] opacity-50 pointer-events-none" />}
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-[20px] relative z-10 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              if (width > 0) {
                const newIndex = Math.round(scrollLeft / width);
                if (newIndex !== currentIndex) {
                  setCurrentIndex(newIndex);
                }
              }
            }}
          >
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            {reviews.map((review) => (
              <div key={review._id} className="w-full flex-none snap-center">
                <LuxuryReviewCard
                  review={review}
                  isMine={isMine}
                  onDelete={() => onDelete(review._id)}
                  onLike={() => onLike(review._id)}
                  currentUserId={currentUserId}
                />
              </div>
            ))}
          </div>
        </div>

        {reviews.length > 1 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 z-20 h-10 w-10 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white/70 hover:text-white drop-shadow-md" 
            onClick={() => {
              const newIdx = (currentIndex + 1) % reviews.length;
              setCurrentIndex(newIdx);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({ left: newIdx * sliderRef.current.offsetWidth, behavior: 'smooth' });
              }
            }}
          >
            <ChevronRight size={20} />
          </Button>
        )}
      </div>
    </div>
  )
}
