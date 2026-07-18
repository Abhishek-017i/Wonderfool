import { motion } from 'framer-motion'
import { Flame, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type QuickFilterType = 'Popular' | 'Trending' | 'Completed' | 'Recently Added' | null

interface QuickFilterBarProps {
  activeFilter: QuickFilterType
  onChange: (filter: QuickFilterType) => void
}

const QUICK_FILTERS: { label: string; value: QuickFilterType; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Popular', value: 'Popular', icon: Flame },
  { label: 'Trending', value: 'Trending', icon: TrendingUp },
  { label: 'Completed', value: 'Completed', icon: CheckCircle2 },
  { label: 'Recently Added', value: 'Recently Added', icon: Sparkles },
]

export default function QuickFilterBar({ activeFilter, onChange }: QuickFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {QUICK_FILTERS.map((filter) => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.value
        return (
          <motion.button
            key={filter.value}
            onClick={() => onChange(isActive ? null : filter.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-accent via-secondary to-primary text-primary-foreground border-primary/30 shadow-[0_0_12px_rgba(200,173,57,0.25)]'
                : 'border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="w-3 h-3" />
            {filter.label}
          </motion.button>
        )
      })}
    </div>
  )
}
