import { Upload, X } from 'lucide-react'
import { useRef } from 'react'

interface CoverImageUploadProps {
  coverImage: string | null
  onChange: (image: string | null) => void
}

export default function CoverImageUpload({ coverImage, onChange }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onChange(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative">
      {coverImage ? (
        <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden group">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => onChange(null)}
              className="p-2 bg-destructive text-destructive hover:bg-destructive/90 transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Click to upload cover image
          </span>
          <span className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
