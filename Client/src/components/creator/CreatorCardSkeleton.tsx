import { Skeleton } from '../ui/skeleton'

export default function CreatorCardSkeleton() {
  return (
    <div className="w-[140px] sm:w-[160px] flex-shrink-0 flex flex-col items-center">
      <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full mb-4" />
      <Skeleton className="h-5 w-24 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}
