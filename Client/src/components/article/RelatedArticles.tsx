import { Link } from 'react-router-dom'
import { ArticleCard } from '../ArticleCard'
import { RelatedArticle } from '../../hooks/useArticle'
import { ScrollArea } from '../ui/scroll-area'

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Related Articles</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="hover:opacity-90 transition-opacity"
            >
              <ArticleCard
                id={article.id}
                title={article.title}
                coverUrl={article.coverUrl}
                author={article.author}
                publishDate={article.publishDate}
                readTimeMinutes={article.readTimeMinutes}
                category={article.category}
              />
            </Link>
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}
