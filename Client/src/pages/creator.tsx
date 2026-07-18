import { useState, useMemo } from 'react'
import {Link} from 'react-router-dom'
import {
  Search,
  Star,
  PenTool,
  Film,
  Palette,
  Clapperboard,
  Award,
  ArrowLeft,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

type Role =
  | 'Mangaka'
  | 'Director'
  | 'Character Designer'
  | 'Animator'

type Creator = {
  id: number
  name: string
  role: Role
  image: string
  knownFor: string[]
  era: string
  award: string
}

const ROLE_ICON: Record<Role, typeof PenTool> = {
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

const CREATORS: Creator[] = [
  {
    id: 1,
    name: 'Takehiko Inoue',
    role: 'Mangaka',
    image: '/creators/creator-1.png',
    knownFor: ['Vagabond', 'Slam Dunk', 'Real'],
    era: 'Active: 1988–Present',
    award: 'Tezuka Osamu Cultural Prize',
  },
  {
    id: 2,
    name: 'Makoto Shinkai',
    role: 'Director',
    image: '/creators/creator-2.png',
    knownFor: ['Your Name', 'Weathering With You', 'Suzume'],
    era: 'Active: 2002–Present',
    award: 'Japan Academy Prize',
  },
  {
    id: 3,
    name: 'Kentaro Miura',
    role: 'Mangaka',
    image: '/creators/creator-3.png',
    knownFor: ['Berserk', 'Duranki', 'Japan'],
    era: 'Active: 1985–2021',
    award: 'Harvey Award Nominee',
  },
  {
    id: 4,
    name: 'Naoko Yamada',
    role: 'Director',
    image: '/creators/creator-4.png',
    knownFor: ['A Silent Voice', 'K-On!', 'Liz and the Blue Bird'],
    era: 'Active: 2009–Present',
    award: 'Tokyo Anime Award',
  },
  {
    id: 5,
    name: 'Yoshiaki Kawajiri',
    role: 'Animator',
    image: '/creators/creator-5.png',
    knownFor: ['Ninja Scroll', 'Vampire Hunter D', 'X'],
    era: 'Active: 1972–Present',
    award: 'Fantasia Lifetime Honor',
  },
  {
    id: 6,
    name: 'Yoshitoshi ABe',
    role: 'Character Designer',
    image: '/creators/creator-6.png',
    knownFor: ['Serial Experiments Lain', 'Haibane Renmei', 'Texhnolyze'],
    era: 'Active: 1998–Present',
    award: 'Seiun Award Finalist',
  },
]

/* -------------------------------------------------------------------------- */
/*                                    Page                                     */
/* -------------------------------------------------------------------------- */

export default function CreatorsPage() {
  const [query, setQuery] = useState('')
  const [activeRole, setActiveRole] = useState<Role | 'All'>('All')

  const filtered = useMemo(() => {
    return CREATORS.filter((c) => {
      const matchesRole = activeRole === 'All' || c.role === activeRole
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.knownFor.some((w) => w.toLowerCase().includes(q))
      return matchesRole && matchesQuery
    })
  }, [query, activeRole])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Back link + theme toggle */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

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
        {filtered.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <p className="mt-20 text-center text-muted-foreground">
            No creators match your search.
          </p>
        )}
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Creator Card                                 */
/* -------------------------------------------------------------------------- */

function CreatorCard({ creator }: { creator: Creator }) {
  const RoleIcon = ROLE_ICON[creator.role]

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

      {/* Tags */}
      <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {creator.era}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
          <Award className="h-3.5 w-3.5 text-accent" />
          {creator.award}
        </span>
      </div>
    </Link>
  )
}
