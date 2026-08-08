import { Search, ChevronDown, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LuxuryFilterToolbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function LuxuryFilterToolbar({
  activeTab, setActiveTab,
  sortBy, setSortBy,
  searchQuery, setSearchQuery
}: LuxuryFilterToolbarProps) {
  
  const tabs = ['Trending', 'Latest']
  const sortOptions = ['Newest', 'Oldest', 'Highest Rating', 'Lowest Rating']

  return (
    <div className="sticky top-20 z-40 mb-12 flex flex-col xl:flex-row gap-4 items-center justify-between bg-white/[0.03] p-2.5 rounded-[24px] border border-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-white/[0.05]">
      
      {/* Tabs */}
      <div className="flex overflow-x-auto w-full xl:w-auto hide-scrollbar gap-1 sm:gap-2 px-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 rounded-[18px] text-sm font-semibold transition-all whitespace-nowrap overflow-hidden group
                ${isActive ? 'text-[#14110f]' : 'text-white/60 hover:text-white'}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#f9db79] to-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab === 'Trending' && <Sparkles size={14} className={isActive ? 'text-[#14110f]' : 'text-[#d4af37]'} />}
                {tab}
              </span>
            </button>
          )
        })}
      </div>

      {/* Actions (Search + Sort) */}
      <div className="flex items-center gap-3 w-full xl:w-auto px-1 xl:px-0">
        
        {/* Search */}
        <div className="relative w-full xl:w-64 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#d4af37] transition-colors" />
          <input 
            type="text"
            placeholder="Search Reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-[18px] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50 focus:border-[#d4af37]/50 text-sm text-white placeholder:text-white/30 transition-all shadow-inner"
          />
        </div>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-5 py-2.5 bg-black/40 border border-white/10 rounded-[18px] hover:bg-black/60 hover:border-white/20 transition-all text-sm font-semibold text-white/80 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50">
            <span className="hidden sm:inline whitespace-nowrap">{sortBy}</span>
            <span className="sm:hidden">Sort</span>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#14110f]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-1 shadow-[0_10px_40px_rgba(0,0,0,0.8)] mt-2">
            {sortOptions.map(option => (
              <DropdownMenuItem 
                key={option}
                onClick={() => setSortBy(option)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${sortBy === option ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
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
