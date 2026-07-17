import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'

export default function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {/* Loading message */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground animate-pulse">Digging through your history…</p>
      </div>

      {/* Skeleton entries */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`relative ${i > 0 ? 'pt-6' : 'pt-0'}`}>
          {/* Dot on timeline */}
          <div className="absolute left-0 top-0 w-3 h-3 rounded-full border-2 border-background bg-primary/30 transform -translate-x-1.5 md:left-1/2 md:-translate-x-1/2" />

          {/* Skeleton Card */}
          <Card className="bg-card border border-border p-4 md:p-6">
            <div className="flex gap-4">
              {/* Thumbnail skeleton */}
              <Skeleton className="w-12 h-16 md:w-14 md:h-20 rounded-md flex-shrink-0" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
