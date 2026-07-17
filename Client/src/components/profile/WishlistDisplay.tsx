import { Heart, Trash2, Tag } from 'lucide-react'
import type { WishlistItem } from '../../data/mockData'
import { motion } from 'framer-motion'

interface WishlistDisplayProps {
  items: WishlistItem[]
}

export default function WishlistDisplay({ items }: WishlistDisplayProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 luxury-shadow transition-all duration-300 group relative border border-border hover:border-primary/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-tight mb-1 pr-6">{item.name}</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Tag size={12} />
                <span className="uppercase tracking-wider">{item.category}</span>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-destructive transition-colors p-1 absolute top-4 right-4 opacity-0 group-hover:opacity-100">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="mt-auto pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-medium">{item.addedDate}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
