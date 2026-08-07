import { useState } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Link as LinkIcon,
} from 'lucide-react'

interface ArticleBodyProps {
  value: string
  onChange: (body: string) => void
}

export default function ArticleBody({ value, onChange }: ArticleBodyProps) {
  const [format, setFormat] = useState<string | null>(null)

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end)
    const newValue =
      value.slice(0, start) +
      before +
      selected +
      after +
      value.slice(end)

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      )
    }, 0)
  }

  const toolbarButtons = [
    { icon: Heading2, label: 'Heading', action: () => insertMarkdown('## ', '') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ', '') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertMarkdown('1. ', '') },
    { icon: LinkIcon, label: 'Link', action: () => insertMarkdown('[', '](url)') },
  ]

  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-3">
        Article Content
      </label>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 bg-muted rounded-t-lg border border-border border-b-0 overflow-x-auto">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              btn.action()
              setFormat(btn.label)
              setTimeout(() => setFormat(null), 200)
            }}
            className="p-2 hover:bg-card rounded transition-colors flex-shrink-0"
            title={btn.label}
          >
            <btn.icon className="w-4 h-4 text-foreground" />
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your article... Use markdown for formatting."
        className="w-full h-96 px-4 py-3 bg-card text-foreground border border-border rounded-b-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none font-mono text-sm"
      />

      <p className="text-xs text-muted-foreground mt-2">
        Supports Markdown • {value.length} characters
      </p>
    </div>
  )
}
