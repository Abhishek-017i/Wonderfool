import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Clock } from 'lucide-react'

interface ArticleCardProps {
  id: string
  title: string
  coverUrl: string
  author: {
    name: string
    avatarUrl: string
  }
  publishDate: string
  readTimeMinutes: number
  category: string
}

export function ArticleCard({
  title,
  coverUrl,
  author,
  publishDate,
  readTimeMinutes,
  category,
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-card hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-2 text-card-foreground">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <img
            src={author.avatarUrl}
            alt={author.name}
            loading="lazy"
            className="w-5 h-5 rounded-full"
          />
          <span className="truncate">{author.name}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{readTimeMinutes} min</span>
          </div>
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>
      </div>
    </Card>
  )
}
