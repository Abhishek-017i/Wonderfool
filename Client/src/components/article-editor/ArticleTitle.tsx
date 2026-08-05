
interface ArticleTitleProps {
  value: string
  onChange: (title: string) => void
}

export default function ArticleTitle({ value, onChange }: ArticleTitleProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        Article Title
        {value.length > 0 && (
          <span className="text-xs text-muted-foreground ml-2">
            ({value.length}/200)
          </span>
        )}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 200))}
        placeholder="Enter your article title..."
        className="w-full px-4 py-3 bg-card text-foreground border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Make it clear and compelling
      </p>
    </div>
  )
}
