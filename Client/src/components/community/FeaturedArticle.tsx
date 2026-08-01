import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { formatDate } from '@/lib/utils'
import type { FeaturedArticle as FeaturedArticleType } from '@/hooks/useArticles'

interface FeaturedArticleProps {
  article: FeaturedArticleType
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link to={`/article/${article.id}`} className="group block">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative h-96 sm:h-[500px] overflow-hidden">
          <img
            src={article.coverUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-text">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 line-clamp-3 text-balance">{article.title}</h2>

            <p className="text-sm sm:text-base text-text/80 line-clamp-2 mb-6">{article.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={article.author.avatarUrl} alt={article.author.name} />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{article.author.name}</p>
                  <p className="text-xs sm:text-sm text-text/60">{formatDate(article.publishDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm text-text/60">
                <Clock className="w-4 h-4" />
                {article.readTimeMinutes} min
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
