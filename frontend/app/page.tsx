'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Search,
  Menu,
  X,
  Sparkles,
  Compass,
  Users,
  PenTool,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Film,
  ScrollText,
  CornerDownLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: 'Explore', icon: Compass },
  { label: 'Community', icon: Users },
  { label: 'Creators', icon: PenTool },
  { label: 'Timeline', icon: Clock },
]

type Media = {
  title: string
  format: 'Anime' | 'Manga' | 'Webtoon' | 'Light Novel'
  rating: number
  year: number
  episodes: string
  image: string
}

const TRENDING: Media[] = [
  {
    title: 'Blade of the Fading Dusk',
    format: 'Anime',
    rating: 9.8,
    year: 2024,
    episodes: '24 Episodes',
    image: '/media/poster-1.png',
  },
  {
    title: 'The Sorcerer\u2019s Aura',
    format: 'Manga',
    rating: 9.6,
    year: 2023,
    episodes: '148 Chapters',
    image: '/media/poster-2.png',
  },
  {
    title: 'Castle in the Drifting Sky',
    format: 'Light Novel',
    rating: 9.4,
    year: 2022,
    episodes: '12 Volumes',
    image: '/media/poster-3.png',
  },
  {
    title: 'Rival Edge',
    format: 'Webtoon',
    rating: 9.2,
    year: 2025,
    episodes: '96 Chapters',
    image: '/media/poster-4.png',
  },
  {
    title: 'Afternoon Tea Chronicles',
    format: 'Anime',
    rating: 9.0,
    year: 2024,
    episodes: '12 Episodes',
    image: '/media/poster-5.png',
  },
  {
    title: 'Golden Colossus',
    format: 'Manga',
    rating: 9.5,
    year: 2023,
    episodes: '210 Chapters',
    image: '/media/poster-6.png',
  },
]

const FORMAT_ICON: Record<Media['format'], typeof Film> = {
  Anime: Film,
  Manga: BookOpen,
  Webtoon: ScrollText,
  'Light Novel': ScrollText,
}

/* -------------------------------------------------------------------------- */
/*                               Search Dialog                                */
/* -------------------------------------------------------------------------- */

function SearchDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      const id = window.setTimeout(() => inputRef.current?.focus(), 50)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const results = TRENDING.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <button
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-sm"
      />
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl duration-150">
        <div className="flex items-center gap-3 border-b border-border/70 px-4">
          <Search className="size-5 shrink-0 text-accent" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search series, creators, formats..."
            className="h-14 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          <p className="px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {query ? 'Results' : 'Trending now'}
          </p>
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No wonders found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((m) => {
                const Icon = FORMAT_ICON[m.format]
                return (
                  <li key={m.title}>
                    <button
                      onClick={onClose}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-accent group-hover:bg-card">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {m.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {m.format} &middot; {m.year}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                        <Star className="size-3.5 fill-current" aria-hidden />
                        {m.rating.toFixed(1)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/70 bg-muted/50 px-4 py-2.5 text-[0.7rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="size-3.5" aria-hidden /> to select
          </span>
          <span>Web Wonders Universal Search</span>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Navbar                                   */
/* -------------------------------------------------------------------------- */

function Navbar({
  onOpenSearch,
  scrolled,
}: {
  onOpenSearch: () => void
  scrolled: boolean
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur transition-shadow',
        scrolled && 'shadow-sm',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Web Wonders
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Search (Cmd+K) */}
        <button
          onClick={onOpenSearch}
          className="ml-auto flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground md:w-64"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="hidden truncate md:inline">
            Search series, creators, formats...
          </span>
          <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[0.7rem] font-medium md:inline-flex">
            ⌘K
          </kbd>
        </button>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            variant="ghost"
            size="lg"
            className="text-secondary-foreground"
            render={<Link href="/auth" />}
          >
            Login
          </Button>
          <Button
            size="lg"
            className="hover:bg-gold-light"
            render={<Link href="/auth?mode=signup" />}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.label}>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-4 text-accent" aria-hidden />
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              render={<Link href="/auth" />}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="flex-1 hover:bg-gold-light"
              render={<Link href="/auth?mode=signup" />}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Sticky Action Bar                             */
/* -------------------------------------------------------------------------- */

function StickyActionBar({
  visible,
  onOpenSearch,
}: {
  visible: boolean
  onOpenSearch: () => void
}) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 top-16 z-40 transition-all duration-300',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center gap-3 rounded-b-2xl border border-t-0 border-border bg-card/95 px-4 py-2.5 shadow-md backdrop-blur">
          <Sparkles className="size-4 shrink-0 text-accent" aria-hidden />
          <p className="hidden text-sm font-medium text-foreground sm:block">
            Start tracking your collection today
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSearch}
              className="hidden sm:inline-flex"
            >
              <Search className="size-3.5" /> Search
            </Button>
            <Button variant="outline" size="sm" render={<Link href="/auth" />}>
              Login
            </Button>
            <Button
              size="sm"
              className="hover:bg-gold-light"
              render={<Link href="/auth?mode=signup" />}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

function Hero({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* Sakura / Gojo aura gradient mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(246,237,120,0.55), rgba(244,216,69,0.28) 45%, rgba(255,201,201,0.35) 70%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-[8%] h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,192,203,0.4), transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-secondary-foreground shadow-sm">
            <Sparkles className="size-3.5 text-accent" aria-hidden />
            One database for the fictional audience
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            The Unification of the Fictional Audience.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-secondary-foreground leading-relaxed">
            Track your Anime, Manga, and Light Novels in one beautiful,
            interconnected timeline.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-7 text-base hover:bg-gold-light"
              render={<Link href="/auth?mode=signup" />}
            >
              Start Your Collection
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenSearch}
              className="h-12 bg-card px-7 text-base"
            >
              <Search className="size-4" />
              Explore the Library
            </Button>
          </div>

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
            {[
              ['48K+', 'Series'],
              ['12K+', 'Creators'],
              ['2.4M', 'Members'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card px-3 py-4 shadow-sm"
              >
                <dt className="font-serif text-2xl font-bold text-foreground">
                  {value}
                </dt>
                <dd className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Media Card                                  */
/* -------------------------------------------------------------------------- */

function MediaCard({ media }: { media: Media }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl">
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.image || '/placeholder.svg'}
          alt={`Cover art for ${media.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Format badge */}
        <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow">
          {media.format}
        </span>

        {/* Hover detail overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-background">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
              <Star className="size-3 fill-current" aria-hidden />
              {media.rating.toFixed(1)}
            </span>
            <span className="rounded-full bg-card/20 px-2 py-0.5 backdrop-blur">
              {media.episodes}
            </span>
            <span className="rounded-full bg-card/20 px-2 py-0.5 backdrop-blur">
              {media.year}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 p-4">
        <h3 className="min-w-0 flex-1 truncate font-medium text-foreground">
          {media.title}
        </h3>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
          <Star className="size-3.5 fill-current" aria-hidden />
          {media.rating.toFixed(1)}
        </span>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Trending Section                               */
/* -------------------------------------------------------------------------- */

function Trending() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <TrendingUp className="size-4" aria-hidden />
            Trending &amp; Discovery
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Wonders the world is watching
          </h2>
          <p className="mt-3 max-w-xl text-secondary-foreground leading-relaxed">
            Hand-picked highlights across every format. Hover any card to reveal
            ratings, run length, and release year.
          </p>
        </div>
        <Button variant="outline" size="lg" className="shrink-0 bg-card">
          Browse all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {TRENDING.map((media) => (
          <MediaCard key={media.title} media={media} />
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Footer                                   */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          <span className="font-serif text-lg font-bold text-foreground">
            Web Wonders
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Web Wonders. The unified fictional
          universe.
        </p>
        <div className="flex gap-4 text-sm text-secondary-foreground">
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            About
          </a>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Scroll tracking for sticky action bar
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrolled = scrollY > 24
  const showActionBar = scrollY > 480

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenSearch={openSearch} scrolled={scrolled} />
      <StickyActionBar visible={showActionBar} onOpenSearch={openSearch} />

      <main>
        <Hero onOpenSearch={openSearch} />
        <Trending />
      </main>

      <Footer />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  )
}
