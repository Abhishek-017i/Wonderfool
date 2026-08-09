import { Heart, Clock } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

interface WishlistDisplayProps {
  items: any[]
  onRemove?: (id: string) => void
}

export default function WishlistDisplay({ items, onRemove }: WishlistDisplayProps) {
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center">
        <Heart size={32} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-foreground font-medium mb-2">Your wishlist is empty.</p>
        <p className="text-sm text-muted-foreground">Add items you want to explore and remember for later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-card border border-border p-4 md:p-6 cursor-pointer hover:shadow-md transition-all w-full"
          onClick={() => {
            if (item.seriesId) navigate(`/series/${item.seriesId}`)
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4 flex-1">
              {/* Thumbnail */}
              <img
                src={item.coverUrl || '/placeholder.svg?height=80&width=60'}
                alt={item.name}
                loading="lazy"
                className="w-12 h-16 md:w-14 md:h-20 object-cover rounded-md flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  if (item.seriesId) navigate(`/series/${item.seriesId}`)
                }}
              />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="text-sm md:text-base font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.seriesId) navigate(`/series/${item.seriesId}`)
                    }}
                  >
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.addedDate}</span>
                </div>

                {/* Media Type Badge */}
                <span className="text-xs text-muted-foreground capitalize block">
                  {item.category === 'NOVEL' ? 'Light Novel' : item.category.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-start pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-border md:pl-4">
              <Button
                size="sm"
                variant="outline"
                className="border-border hover:bg-background text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  if (item.seriesId) navigate(`/series/${item.seriesId}`)
                }}
              >
                View Details
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="border-border text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove && onRemove(item.id as string)
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
