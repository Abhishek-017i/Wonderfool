import { Check, Loader2 } from 'lucide-react'

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved'
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg">
      {status === 'saving' && (
        <>
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-sm text-foreground font-medium">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-foreground font-medium">Saved</span>
        </>
      )}
    </div>
  )
}
