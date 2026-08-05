import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Clock, Calendar } from 'lucide-react'
import { Article } from '../../hooks/useArticle'

interface ArticleHeroProps {
  article: Article
}

export function ArticleHero({ article }: ArticleHeroProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="w-full space-y-6">
      {/* Cover Image with overlay gradient */}
      <div className="relative w-full overflow-hidden rounded-lg bg-muted">
        <div className="aspect-video relative">
          <img
            src={article.coverUrl}
            alt={article.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      </div>

      {/* Title and subtitle */}
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
          {article.title}
        </h1>
        <p className="text-xl text-muted-foreground text-balance">
          {article.subtitle}
        </p>
      </div>

      {/* Author row with metadata */}
      <div className="flex flex-col gap-4 pt-4 border-t border-border">
        <Link
          to={`/creator/${article.author.id}`}
          className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
        >
          <img
            src={article.author.avatarUrl}
            alt={article.author.name}
            loading="lazy"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {article.author.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {article.author.articleCount} articles
            </p>
          </div>
        </Link>

        {/* Publication metadata */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{article.readTimeMinutes} min read</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
        </div>
      </div>
    </div>
  )
}
