import { Search, ChevronDown, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

interface ReviewFilterBarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function ReviewFilterBar({
  activeTab, setActiveTab,
  sortBy, setSortBy,
  searchQuery, setSearchQuery
}: ReviewFilterBarProps) {
  
  const tabs = ['All Reviews', 'Friends', 'Highest Rated', 'Most Liked']
  const sortOptions = ['Newest', 'Oldest', 'Highest Rating', 'Lowest Rating']

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-card/20 p-2 rounded-xl border border-border/30 backdrop-blur-sm">
      
      {/* Tabs */}
      <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar gap-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-primary/20 text-primary' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Actions (Search + Sort) */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-48 group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            type="text"
            placeholder="Search Reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/40 h-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-border/50 bg-background/50 flex gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="hidden sm:inline">{sortBy}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-lg border-border/50">
            {sortOptions.map(option => (
              <DropdownMenuItem 
                key={option}
                onClick={() => setSortBy(option)}
                className={`cursor-pointer ${sortBy === option ? 'bg-primary/10 text-primary font-medium' : ''}`}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
