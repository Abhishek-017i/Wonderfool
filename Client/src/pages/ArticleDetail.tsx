import { useParams, useNavigate, Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useArticle } from '../hooks/useArticle'
import { ArticleHero } from '../components/article/ArticleHero'
import { ArticleContent } from '../components/article/ArticleContent'
import { ArticleActionBar } from '../components/article/ArticleActionBar'
import { TaggedCreators } from '../components/article/TaggedCreators'
import { TaggedSeries } from '../components/article/TaggedSeries'
import { RelatedArticles } from '../components/article/RelatedArticles'
import CommentSection from '../components/shared/CommentSection'
import {
  ArticleHeroSkeleton,
  ArticleContentSkeleton,
  SeriesCardSkeleton,
  ArticleCardSkeleton,
} from '../components/Skeletons'
import { ErrorState } from '../components/StateComponents'

export default function ArticleDetail() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const commentSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (!id) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <ErrorState message="Article not found." />
      </div>
    )
  }

  const { article, isLoading: articleLoading, error: articleError, toggleLike } = useArticle(id)

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
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-24">
          <ErrorState
            message={articleError}
            onRetry={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-24 pb-12 flex-1 w-full">

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
            onLike={toggleLike}
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
        {article && !articleLoading && (
          <div ref={commentSectionRef} className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold font-serif mb-8">Discussion</h2>
            <CommentSection parentType="Article" parentId={article.id} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

