
import { useState } from 'react'
import { X } from 'lucide-react'

interface ArticleSettingsProps {
  description: string
  tags: string[]
  onDescriptionChange: (desc: string) => void
  onTagsChange: (tags: string[]) => void
}

export default function ArticleSettings({
  description,
  tags,
  onDescriptionChange,
  onTagsChange,
}: ArticleSettingsProps) {
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      onTagsChange([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Article Settings</h3>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Meta Description
            {description.length > 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                ({description.length}/160)
              </span>
            )}
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, 160))}
            placeholder="Brief summary for search engines and social sharing..."
            className="w-full h-20 px-3 py-2 bg-card text-foreground border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Helps with SEO and social sharing
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tags
            {tags.length > 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                ({tags.length}/10)
              </span>
            )}
          </label>

          {/* Tag Input */}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              disabled={tags.length >= 10}
              className="flex-1 px-3 py-2 bg-card text-foreground border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm disabled:opacity-50"
            />
            <button
              onClick={handleAddTag}
              disabled={tags.length >= 10}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Tag Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
