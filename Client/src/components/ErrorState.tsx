import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'


interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export default function ErrorState({ message = 'Failed to load articles', onRetry }: ErrorStateProps) {
  return (
    <div className="container py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-red-500/10">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm text-text/60 mb-8 max-w-sm mx-auto">{message}</p>
      <Button onClick={onRetry} variant="secondary" className="mx-auto">
        Try Again
      </Button>
    </div>
  )
}