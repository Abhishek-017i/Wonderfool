import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface FilterChip {
  id: string
  label: string
  onRemove: () => void
}

interface ActiveFilterChipsProps {
  chips: FilterChip[]
  onClearAll: () => void
}

export default function ActiveFilterChips({ chips, onClearAll }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.div
            key={chip.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
          >
            <Badge
              variant="outline"
              className="pl-2.5 pr-1.5 py-0.5 flex items-center gap-1.5 border-primary/40 bg-primary/5 text-foreground hover:bg-primary/10 transition-colors"
            >
              <span className="text-xs font-medium">{chip.label}</span>
              <button
                onClick={chip.onRemove}
                className="rounded p-0.5 hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
        onClick={onClearAll}
        variant="ghost"
        size="sm"
        className="text-xs h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        Clear All
      </Button>
    </div>
  )
}
