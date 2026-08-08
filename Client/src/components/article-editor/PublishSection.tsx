import { Calendar, Lock, Globe, AlertCircle } from 'lucide-react'

interface Article {
  title: string
  body: string
  coverImage: string | null
  creators: any[]
  isPublished: boolean
  createdAt: Date
}

interface PublishSectionProps {
  article: Article
  onPublish: () => void
  isLoading?: boolean
}

export default function PublishSection({ article, onPublish, isLoading = false }: PublishSectionProps) {
  const isReadyToPublish =
    article.title.trim().length > 0 &&
    article.body.trim().length > 0 &&
    article.coverImage !== null &&
    article.creators.length > 0

  const validationErrors = []
  if (!article.title.trim()) validationErrors.push('Title is required')
  if (!article.body.trim()) validationErrors.push('Article body is required')
  if (!article.coverImage) validationErrors.push('Cover Image is required')
  if (article.creators.length === 0) validationErrors.push('At least one creator must be tagged')

  return (
    <div className="bg-card border border-border rounded-lg p-4 sticky top-8">
      <h3 className="text-sm font-semibold text-foreground mb-4">Publish</h3>

      <div className="space-y-3">
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
        <div className="flex pt-2">
          <button
            className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            disabled={!isReadyToPublish || isLoading}
            onClick={onPublish}
          >
            {isLoading && <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>}
            {article.isPublished ? 'Update' : (isLoading ? 'Publishing...' : 'Publish')}
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
