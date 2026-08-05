import { Button } from './ui/button'
import { AlertCircle, MessageCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong while loading this article.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <p className="text-muted-foreground max-w-md text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mx-auto">
          Try Again
        </Button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  message?: string
}

export function EmptyState({
  message = 'Start the discussion.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <MessageCircle className="w-12 h-12 text-muted-foreground" />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  )
}
