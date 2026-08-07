import { memo } from 'react'
import { Button } from '../ui/Button'
import { Skeleton } from '../ui/Skeleton'
import ArticleCard from './ArticleCard'
import EmptyState from '../EmptyState'
import { cn } from '@/lib/utils'
import type { Article } from '@/hooks/useArticles'

interface ArticleFeedProps {
  articles: Article[]
  isLoading: boolean
  view: 'grid' | 'list'
  hasMore: boolean
  onLoadMore: () => void
}

const ArticleCardMemo = memo(ArticleCard)

export default function ArticleFeed({ articles, isLoading, view, hasMore, onLoadMore }: ArticleFeedProps) {
  if (isLoading && articles.length === 0) {
  return (
    <div className="container py-12">
      <div className={cn('gap-8', view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-8')}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={view === 'list' ? 'flex gap-4' : ''}>
            {view === 'list' ? (
              <>
                <Skeleton className="w-48 h-32 flex-shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Skeleton className="w-full h-40 rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
  }

  if (articles.length === 0 && !isLoading) {
    return <EmptyState onRetry={onLoadMore} />
  }

  return (
    <div className="container py-12">
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
        {articles.map(article => (
          <ArticleCardMemo key={article.id} article={article} view={view} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button onClick={onLoadMore} disabled={isLoading} size="lg">
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
