import { Link } from 'react-router-dom'
import { Clock, MessageCircle, Heart } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/hooks/useArticles'

interface ArticleCardProps {
  article: Article
  view?: 'grid' | 'list'
}

export default function ArticleCard({ article, view = 'grid' }: ArticleCardProps) {
  const hasTaggedContent = article.taggedCreators.length > 0 || article.taggedSeries.length > 0

  if (view === 'list') {
    return (
      <Link to={`/article/${article.id}`} className="group block">
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 overflow-hidden">
            <img
              src={article.coverUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col flex-1 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-text/60 line-clamp-2 mb-4">{article.excerpt}</p>

            {hasTaggedContent && (
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                {article.taggedCreators.map(creator => (
                  <Link key={creator.id} to={`/creator/${creator.id}`} className="text-primary hover:underline">
                    {creator.name}
                  </Link>
                ))}
                {article.taggedSeries.map((series, idx) => (
                  <span key={series.id}>
                    {idx > 0 && ', '}
                    <Link to={`/series/${series.id}`} className="text-primary hover:underline">
                      {series.title}
                    </Link>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Avatar src={article.author.avatarUrl} alt={article.author.name} />
                <div>
                  <Link to={`/creator/${article.author.id}`} className="font-semibold text-sm hover:text-primary transition-colors">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-text/60">{formatDate(article.publishDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-text/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTimeMinutes}m
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {article.commentCount}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {article.likeCount}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Grid view
  return (
    <Link to={`/article/${article.id}`} className="group block h-full">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={article.coverUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 p-4">
          <Badge variant="secondary" className="w-fit mb-3 text-xs">
            {article.category}
          </Badge>

          <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          <p className="text-sm text-text/60 line-clamp-2 mb-4 flex-1">{article.excerpt}</p>

          {hasTaggedContent && (
            <div className="flex flex-wrap gap-1 mb-4 text-xs">
              {article.taggedCreators.map(creator => (
                <Link key={creator.id} to={`/creator/${creator.id}`} className="text-primary hover:underline">
                  {creator.name}
                </Link>
              ))}
              {article.taggedSeries.map((series, idx) => (
                <span key={series.id}>
                  {idx > 0 && ', '}
                  <Link to={`/series/${series.id}`} className="text-primary hover:underline">
                    {series.title}
                  </Link>
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={article.author.avatarUrl} alt={article.author.name} className="h-8 w-8" />
                <div className="flex-1 min-w-0">
                  <Link to={`/creator/${article.author.id}`} className="font-medium text-xs hover:text-primary transition-colors block truncate">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-text/60">{formatDate(article.publishDate)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-text/60 gap-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTimeMinutes}m
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {article.commentCount}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {article.likeCount}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
