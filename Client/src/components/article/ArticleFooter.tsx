import { Link } from 'react-router-dom'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Author } from '../../hooks/useArticle'
import { ArrowRight } from 'lucide-react'

interface ArticleFooterProps {
  author: Author
  moreArticles?: Array<{
    id: string
    title: string
  }>
}

export function ArticleFooter({
  author,
  moreArticles = [],
}: ArticleFooterProps) {
  return (
    <section className="space-y-6">
      {/* Author bio card */}
      <Card className="p-6 bg-card">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            src={author.avatarUrl}
            alt={author.name}
            loading="lazy"
            className="w-24 h-24 rounded-full flex-shrink-0"
          />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-card-foreground">
                {author.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {author.articleCount} articles
              </p>
            </div>
            <p className="text-card-foreground leading-relaxed">
              {author.bio}
            </p>
            <Link to={`/creator/${author.id}`}>
              <Button variant="outline" className="gap-2">
                View Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* More from this author */}
      {moreArticles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">More from {author.name}</h3>
          <ul className="space-y-2">
            {moreArticles.slice(0, 3).map((article) => (
              <li key={article.id}>
                <Link
                  to={`/article/${article.id}`}
                  className="text-primary hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
