interface Article {
  title: string
  body: string
  coverImage: string | null
  description: string
  tags: string[]
  creator: any
  series: any
}

interface LivePreviewProps {
  article: Article
}

export default function LivePreview({ article }: LivePreviewProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Live Preview</h3>

      <div className="space-y-3 text-sm">
        {/* Cover Image Preview */}
{article.coverImage && (
  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
    <img
      src={article.coverImage}
      alt="Preview"
      className="w-full h-full object-cover"
    />
  </div>
)}

        {/* Title Preview */}
        {article.title && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Title</p>
            <p className="font-semibold text-foreground line-clamp-2">{article.title}</p>
          </div>
        )}

        {/* Description Preview */}
        {article.description && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-foreground line-clamp-2 text-xs">{article.description}</p>
          </div>
        )}

        {/* Creator Preview */}
        {article.creator && (
          <div className="flex items-center gap-2 py-2 border-t border-border">
            <span className="text-lg">{article.creator.avatar}</span>
            <div>
              <p className="text-xs text-muted-foreground">By</p>
              <p className="font-medium text-foreground text-xs">{article.creator.name}</p>
            </div>
          </div>
        )}
        

        {/* Series Preview */}
        {article.series && (
          <div className="pt-2 border-t border-border">
            <p className={`px-2 py-1 rounded text-xs font-medium w-fit ${article.series.color}`}>
              {article.series.name}
            </p>
          </div>
        )}

        {/* Tags Preview */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
            {article.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-muted text-foreground rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content Length */}
        <div className="text-xs text-muted-foreground border-t border-border pt-2">
          <p>{article.body.length} characters</p>
        </div>
      </div>
    </div>
  )
}
