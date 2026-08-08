interface ArticleBodyProps {
  value: string
  onChange: (body: string) => void
}

export default function ArticleBody({ value, onChange }: ArticleBodyProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-3">
        Article Content
      </label>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your article..."
        className="w-full h-96 px-4 py-3 bg-card text-foreground border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none font-mono text-sm"
      />

      <p className="text-xs text-muted-foreground mt-2">
        Plain text • {value.length} characters
      </p>
    </div>
  )
}
