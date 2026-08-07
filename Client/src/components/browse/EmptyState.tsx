import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onReset: () => void
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-5"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="max-w-sm">
        <h3 className="font-cinzel text-xl font-bold mb-2">Nothing found here.</h3>
        <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
          No series matched your search or filters. Perhaps try a different title, or broaden your criteria.
        </p>
      </div>
      <Button
        onClick={onReset}
        className="bg-gradient-to-r from-accent via-secondary to-primary text-primary-foreground font-bold uppercase tracking-wider text-xs border border-white/10 hover:shadow-[0_0_15px_rgba(200,173,57,0.3)]"
      >
        Reset Filters
      </Button>
    </motion.div>
  )
}
