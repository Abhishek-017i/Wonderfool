import { Skeleton } from '@/components/ui/skeleton'

interface SeriesCardSkeletonProps {
  variant?: 'grid' | 'compact' | 'list'
}

export default function SeriesCardSkeleton({ variant = 'grid' }: SeriesCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
        <Skeleton className="w-16 h-24 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-2/3 mt-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="w-full aspect-[2/3]" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
