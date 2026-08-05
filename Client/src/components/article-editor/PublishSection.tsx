import { Calendar, Lock, Globe, AlertCircle } from 'lucide-react'

interface Article {
  title: string
  body: string
  coverImage: string | null
  description: string
  tags: string[]
  creator: any
  series: any
  isPublished: boolean
  createdAt: Date
}

interface PublishSectionProps {
  article: Article
}

export default function PublishSection({ article }: PublishSectionProps) {
  const isReadyToPublish =
    article.title.trim().length > 0 &&
    article.body.trim().length > 0 &&
    article.description.trim().length > 0

  const validationErrors = []
  if (!article.title.trim()) validationErrors.push('Title is required')
  if (!article.body.trim()) validationErrors.push('Article body is required')
  if (!article.description.trim()) validationErrors.push('Description is required')

  return (
    <div className="bg-card border border-border rounded-lg p-4 sticky top-8">
      <h3 className="text-sm font-semibold text-foreground mb-4">Publish</h3>

      <div className="space-y-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {article.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Created {new Date(article.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-xs text-destructive">
                <p className="font-medium mb-1">Cannot publish yet:</p>
                <ul className="space-y-0.5">
                  {validationErrors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isReadyToPublish}
            onClick={() => console.log('Publish article')}
          >
            {article.isPublished ? 'Update' : 'Publish'}
          </button>
          <button
            className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
            onClick={() => console.log('Save draft')}
          >
            Save Draft
          </button>
        </div>

        {/* Publishing Info */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>Public on publish</span>
          </div>
          <p>Your article will be visible to all readers.</p>
        </div>
      </div>
    </div>
  )
}
