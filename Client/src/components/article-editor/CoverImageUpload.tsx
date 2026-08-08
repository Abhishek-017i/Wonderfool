import { Link2, X } from 'lucide-react'

interface CoverImageUploadProps {
  coverImage: string | null
  onChange: (image: string | null) => void
}

export default function CoverImageUpload({ coverImage, onChange }: CoverImageUploadProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-foreground">
        Cover Image URL
      </label>
      
      {coverImage ? (
        <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden group border border-border">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => onChange(null)}
              className="p-2 bg-destructive text-destructive hover:bg-destructive/90 transition-colors rounded-lg flex items-center gap-2 text-white"
            >
              <X className="w-5 h-5" />
              <span className="text-sm font-medium">Remove Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Paste an image URL here..."
              onChange={(e) => {
                // only trigger onChange if it looks like a url
                if (e.target.value.trim() === '' || e.target.value.startsWith('http')) {
                  onChange(e.target.value)
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-card text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}
    </div>
  )
}
