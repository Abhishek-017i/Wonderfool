import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import type { Filters } from '@/pages/Browse'

interface FilterSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onApply: () => void
  onReset: () => void
  hasSearched: boolean
}

const MEDIA_TYPES = ['Anime', 'Manga', 'Light Novel']
const STATUSES = ['Airing', 'Finished', 'Hiatus', 'Cancelled']
const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'School', 'Romance',
  'Supernatural', 'Mystery', 'Psychological', 'Fantasy', 'Sci-Fi', 'Mecha', 'Dark',
]

const COUNTRIES = [
  { code: 'JP', label: 'Japan' },
  { code: 'KR', label: 'Korea' },
  { code: 'CN', label: 'China' },
  { code: 'TW', label: 'Taiwan' },
]

function FilterCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(Boolean(c))}
      />
      <Label
        htmlFor={id}
        className="text-sm cursor-pointer text-foreground/80 hover:text-foreground transition-colors select-none"
      >
        {label}
      </Label>
    </div>
  )
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  hasSearched,
}: FilterSidebarProps) {
  return (
    <div className="space-y-2">
      <Accordion type="multiple" defaultValue={['media-type', 'status']} className="w-full">
        {/* Media Type */}
        <AccordionItem value="media-type">
          <AccordionTrigger>Media Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {MEDIA_TYPES.map((type) => (
                <FilterCheckbox
                  key={type}
                  id={`media-${type}`}
                  label={type}
                  checked={filters.mediaType.includes(type)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      mediaType: checked
                        ? [...filters.mediaType, type]
                        : filters.mediaType.filter((t) => t !== type),
                    })
                  }
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status */}
        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {STATUSES.map((status) => (
                <FilterCheckbox
                  key={status}
                  id={`status-${status}`}
                  label={status}
                  checked={filters.status.includes(status)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      status: checked
                        ? [...filters.status, status]
                        : filters.status.filter((s) => s !== status),
                    })
                  }
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Genres */}
        <AccordionItem value="genres">
          <AccordionTrigger>Genres</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((genre) => (
                <FilterCheckbox
                  key={genre}
                  id={`genre-${genre}`}
                  label={genre}
                  checked={filters.genres.includes(genre)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      genres: checked
                        ? [...filters.genres, genre]
                        : filters.genres.filter((g) => g !== genre),
                    })
                  }
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Country of Origin */}
        <AccordionItem value="country">
          <AccordionTrigger>Country</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5">
              {COUNTRIES.map(({ code, label }) => (
                <FilterCheckbox
                  key={code}
                  id={`country-${code}`}
                  label={label}
                  checked={filters.country.includes(code)}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      country: checked
                        ? [...filters.country, code]
                        : filters.country.filter((c) => c !== code),
                    })
                  }
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>



        {/* Year Range */}
        <AccordionItem value="year">
          <AccordionTrigger>Year Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-1">
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
              <Slider
                min={1970}
                max={2026}
                step={1}
                value={[filters.yearRange[0], filters.yearRange[1]]}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, yearRange: [value[0], value[1]] })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Minimum Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Min. Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-1">
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>⭐ {filters.minRating.toFixed(1)}</span>
                <span>10.0</span>
              </div>
              <Slider
                min={0}
                max={10}
                step={0.1}
                value={[filters.minRating]}
                onValueChange={(value) => onFiltersChange({ ...filters, minRating: value[0] })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>


      </Accordion>

      {/* Actions */}
      <Separator />
      <div className="space-y-2 pt-1">
        <Button onClick={onApply} className="w-full bg-gradient-to-r from-accent via-secondary to-primary text-primary-foreground font-bold uppercase tracking-wider text-xs border border-white/10 hover:shadow-[0_0_15px_rgba(200,173,57,0.3)]">
          Apply Filters
        </Button>
        <Button onClick={onReset} variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground">
          Reset All
        </Button>
      </div>
    </div>
  )
}
