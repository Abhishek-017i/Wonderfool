import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onRetry: () => void
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-5"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <div className="max-w-sm">
        <h3 className="font-cinzel text-xl font-bold mb-2">Something went wrong.</h3>
        <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">
          We couldn't load the results. Our apologies — please try again.
        </p>
      </div>
      <Button onClick={onRetry} variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
        Try Again
      </Button>
    </motion.div>
  )
}
