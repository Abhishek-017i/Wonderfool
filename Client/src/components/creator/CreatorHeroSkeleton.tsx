import { Skeleton } from '../ui/skeleton'

export default function CreatorHeroSkeleton() {
  return (
    <div className="w-full">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-64 sm:h-80 lg:h-96 rounded-none" />

      {/* Hero Content Skeleton */}
      <div className="px-4 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-20 sm:-mt-24 relative z-10">
          {/* Avatar Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-background overflow-hidden">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 pb-4 sm:pb-2 space-y-4">
            <div>
              <Skeleton className="h-10 w-48 sm:w-64 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-3 sm:pb-2 w-full sm:w-auto">
            <Skeleton className="h-9 w-12 rounded-md" />
            <Skeleton className="h-9 flex-1 sm:w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
