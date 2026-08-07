import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'


interface EmptyStateProps {
  onRetry?: () => void
}

export default function EmptyState({ onRetry }: EmptyStateProps) {
  return (
    <div className="container py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-primary/10">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">No articles published yet.</h3>
      <p className="text-sm text-text/60 mb-8 max-w-sm mx-auto">
        Check back soon for thoughtful editorials, reviews, and insights from the Wonderfool community.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mx-auto">
          Refresh
        </Button>
      )}
    </div>
  )
}
