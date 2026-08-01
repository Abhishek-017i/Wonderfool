import { useParams, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useArticle } from '../hooks/useArticle'
import { useArticleComments } from '../hooks/useArticleComments'
import { ArticleHero } from '../components/article/ArticleHero'
import { ArticleContent } from '../components/article/ArticleContent'
import { ArticleActionBar } from '../components/article/ArticleActionBar'
import { TaggedCreators } from '../components/article/TaggedCreators'
import { TaggedSeries } from '../components/article/TaggedSeries'
import { ArticleFooter } from '../components/article/ArticleFooter'
import { RelatedArticles } from '../components/article/RelatedArticles'
import { CommentSection } from '../components/article/CommentSection'
import {
  ArticleHeroSkeleton,
  ArticleContentSkeleton,
  SeriesCardSkeleton,
  ArticleCardSkeleton,
  CommentSkeleton,
} from '../components/Skeletons'
import { ErrorState } from '../components/StateComponents'

export default function ArticleDetail() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const commentSectionRef = useRef<HTMLDivElement>(null)

  if (!id) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <ErrorState message="Article not found." />
      </div>
    )
  }

  const { article, isLoading: articleLoading, error: articleError } = useArticle(id)
  const { comments, isLoading: commentsLoading, error: commentsError } = useArticleComments(id)

  const handleJumpToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.subtitle,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (articleError) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          <ErrorState
            message={articleError}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <div className="mb-12">
          {articleLoading ? (
            <ArticleHeroSkeleton />
          ) : article ? (
            <ArticleHero article={article} />
          ) : null}
        </div>

        {/* Action Bar (sticky on desktop) */}
        {article && !articleLoading && (
          <ArticleActionBar
            likeCount={article.likeCount}
            bookmarkCount={article.bookmarkCount}
            isLiked={article.isLiked}
            isBookmarked={article.isBookmarked}
            onLike={() => console.log('Liked')}
            onBookmark={() => console.log('Bookmarked')}
            onShare={handleShare}
            onJumpToComments={handleJumpToComments}
          />
        )}

        {/* Main Content */}
        <div className="mb-16">
          {articleLoading ? (
            <ArticleContentSkeleton />
          ) : article ? (
            <ArticleContent body={article.body} />
          ) : null}
        </div>

        {/* Tagged Creators */}
        <div className="mb-12">
          {articleLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-card rounded w-48" />
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-card rounded w-48" />
                ))}
              </div>
            </div>
          ) : article ? (
            <TaggedCreators creators={article.taggedCreators} />
          ) : null}
        </div>

        {/* Tagged Series */}
        <div className="mb-12">
          {articleLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-card rounded w-40" />
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <SeriesCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : article ? (
            <TaggedSeries series={article.taggedSeries} />
          ) : null}
        </div>

        {/* Article Footer */}
        <div className="mb-12 border-t border-border pt-12">
          {articleLoading ? (
            <div className="space-y-4">
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-card rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-card rounded w-32" />
                  <div className="h-4 bg-card rounded w-full" />
                  <div className="h-4 bg-card rounded w-full" />
                </div>
              </div>
            </div>
          ) : article ? (
            <ArticleFooter author={article.author} />
          ) : null}
        </div>

        {/* Related Articles */}
        <div className="mb-12 border-t border-border pt-12">
          {articleLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-card rounded w-48" />
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : article ? (
            <RelatedArticles articles={article.relatedArticles} />
          ) : null}
        </div>

        {/* Comments Section */}
        <div ref={commentSectionRef} className="border-t border-border pt-12">
          {commentsLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-card rounded w-32" />
              {[...Array(3)].map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          ) : (
            <CommentSection comments={comments} isLoading={false} />
          )}
          {commentsError && (
            <ErrorState
              message={commentsError}
              onRetry={() => window.location.reload()}
            />
          )}
        </div>
      </div>
    </div>
  )
}
