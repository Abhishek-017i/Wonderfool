
import { ArrowLeft, Eye, EyeOff, Settings } from 'lucide-react'
import { Link } from "react-router-dom";

interface EditorHeaderProps {
  onPreviewToggle: () => void
}

export default function EditorHeader({ onPreviewToggle }: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Write Article</h1>
              <p className="text-xs text-muted-foreground">Draft • Not published</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Action buttons removed */}
          </div>
        </div>
      </div>
    </header>
  )
}
