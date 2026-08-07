import { useState, useMemo, useEffect } from 'react'
import {Link} from 'react-router-dom'
import {
  Search,
  Star,
  PenTool,
  Film,
  Palette,
  Clapperboard,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import { useCreators } from '@/hooks/useCreator'

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

type Role =
  | 'Mangaka'
  | 'Director'
  | 'Character Designer'
  | 'Animator'
  | string

type Creator = {
  id: string | number
  name: string
  role: Role
  image: string
  knownFor: string[]
  era: string
  award: string
}

const ROLE_ICON: Record<string, any> = {
  Mangaka: PenTool,
  Director: Film,
  'Character Designer': Palette,
  Animator: Clapperboard,
}

const FILTERS: (Role | 'All')[] = [
  'All',
  'Mangaka',
  'Director',
  'Character Designer',
  'Animator',
]

/* -------------------------------------------------------------------------- */
/*                                    Page                                     */
/* -------------------------------------------------------------------------- */

export default function CreatorsPage() {
  const [query, setQuery] = useState('')
  const [activeRole, setActiveRole] = useState<Role | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9 // Fits nicely in a 3-column grid

  useEffect(() => {
    setCurrentPage(1)
  }, [query, activeRole])

  const { creators: apiCreators, isLoading, error } = useCreators()

  const mappedCreators: Creator[] = useMemo(() => {
    return (apiCreators || []).map((c) => ({
      id: c._id,
      name: c.name?.full || c.name?.native || 'Unknown',
      role: c.designation?.[0] || 'Mangaka',
      image: c.photo || '/placeholder.svg',
      knownFor: c.knownWorks?.map(w => w.seriesId?.title?.english || w.seriesId?.title?.romaji || 'Unknown Work') || [],
      era: c.yearsActive || 'Unknown',
      award: 'Notable Creator',
    }))
  }, [apiCreators])

  const filtered = useMemo(() => {
    return mappedCreators.filter((c) => {
      const matchesRole = activeRole === 'All' || c.role === activeRole
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        c.knownFor.some((w) => w.toLowerCase().includes(q))
      return matchesRole && matchesQuery
    })
  }, [query, activeRole, mappedCreators])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedCreators = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pb-24 flex-1 w-full">
        {/* Header */}

        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Creators Directory
          </p>
          <h1 className="text-balance font-display text-4xl font-semibold leading-tight md:text-6xl">
            The Architects of Fiction
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Discover the artists, directors, and authors shaping the medium.
          </p>

          {/* Search */}
          <div className="relative mt-9">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, or work…"
              aria-label="Search creators"
              className="w-full rounded-[14px] border border-border/70 bg-card/80 py-4 pl-14 pr-6 text-base text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/30"
            />
          </div>
        </header>

        {/* Role filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((role) => {
            const active = role === activeRole
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  'rounded-full border px-5 py-2 text-sm font-medium transition-all',
                  active
                    ? 'border-primary/70 bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(243,191,95,0.18)]'
                    : 'border-border/70 bg-card/70 text-muted-foreground hover:border-accent/40 hover:text-foreground',
                )}
              >
                {role}
              </button>
            )
          })}
        </div>

        {/* Gallery grid */}
        {isLoading ? (
          <div className="mt-20 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4">Loading creators...</p>
          </div>
        ) : error ? (
          <p className="mt-20 text-center text-red-500">
            Failed to load creators. Please try again later.
          </p>
        ) : filtered.length > 0 ? (
          <>
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-4 mt-14"
              >
                <button
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center gap-1.5 border border-primary/30 px-4 py-2 rounded-md text-sm font-semibold hover:border-primary/60 hover:bg-primary/5 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-sm font-serif text-muted-foreground">
                  Page <span className="font-bold text-foreground">{currentPage}</span> of{' '}
                  <span className="font-bold text-foreground">{totalPages}</span>
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center gap-1.5 border border-primary/30 px-4 py-2 rounded-md text-sm font-semibold hover:border-primary/60 hover:bg-primary/5 disabled:opacity-40 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <p className="mt-20 text-center text-muted-foreground">
            No creators match your search.
          </p>
        )}
      </div>
      <Footer />
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Creator Card                                 */
/* -------------------------------------------------------------------------- */

function CreatorCard({ creator }: { creator: Creator }) {
  const RoleIcon = ROLE_ICON[creator.role] || PenTool

  return (
    <Link to={`/creator/${creator.id}`} className="group flex flex-col rounded-[18px] border border-border/70 bg-card p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_20px_44px_rgba(0,0,0,0.09)]">
      {/* Avatar */}
      <div className="relative size-32 mx-auto rounded-full ring-1 ring-border">
        <img
          src={creator.image || '/placeholder.svg'}
          alt={`Portrait of ${creator.name}`}
          className="w-full h-full rounded-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
        />
      </div>
      {/* Name + role */}
      <div className="mt-5 text-center">
        <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {creator.name}
        </h2>
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <RoleIcon className="h-4 w-4 text-accent" />
          <span>{creator.role}</span>
        </div>
      </div>

      {/* Known for */}
      <div className="mt-5 border-t border-border-muted pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          Known for
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {creator.knownFor.join(' · ')}
        </p>
      </div>

    </Link>
  )
}
