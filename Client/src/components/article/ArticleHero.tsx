import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Clock, Calendar, Sparkles, User } from 'lucide-react'
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
      {/* Cover Image with smooth edge blending & responsive sizing */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 shadow-2xl bg-card">
        <div className="relative aspect-[21/9] min-h-[240px] max-h-[480px] w-full overflow-hidden">
          <img
            src={article.coverUrl}
            alt={article.title}
            loading="eager"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
          />
          {/* Smooth blending gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Category, Title and Subtitle */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
            {article.category}
          </Badge>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.18] text-balance">
          {article.title}
        </h1>
      </div>

      {/* Writer Info & Creator Tags */}
      <div className="flex flex-col gap-4 pt-6 border-t border-border/70">
        {/* Writer display (Non-clickable static writer info) */}
        <div className="flex items-center gap-3">
          <img
            src={article.author.avatarUrl}
            alt={article.author.name}
            loading="lazy"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-border/60"
          />
          <div>
            <p className="font-semibold text-foreground text-base">
              {article.author.name}
            </p>
          </div>
        </div>

        {/* Creator Name Tags right below writer's name */}
        {article.taggedCreators && article.taggedCreators.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 mr-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Creators:
            </span>
            {article.taggedCreators.map((creator) => (
              <Link
                key={creator.id}
                to={`/creator/${creator.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 hover:bg-accent/15 px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent transition-all duration-200 shadow-sm"
              >
                {creator.avatarUrl ? (
                  <img src={creator.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <User className="w-3 h-3 text-accent" />
                )}
                <span>{creator.name}</span>
                {creator.role && (
                  <span className="text-[10px] text-muted-foreground font-normal">({creator.role})</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
