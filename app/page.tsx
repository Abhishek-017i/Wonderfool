'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import NewMediaCard from '@/components/ui/custom/NewMediaCard';
import ScrollReveal from '@/components/ui/custom/ScrollReveal';
/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: 'Explore', icon: Compass, href: '/#trending' },
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Creators', icon: PenTool, href: '/creators' },
  { label: 'Timeline', icon: Clock, href: '/timeline' },
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

type HeroSlide = {
  title: string
  year: number
  rating: number
  episodes: string
  duration: string
  genres: string[]
  description: string
  image: string
  badge: 'Trending' | 'New' | 'Top Rated'
}

const HERO_SLIDES: HeroSlide[] = [
  {
    title: 'Blade of the Fading Dusk',
    year: 2024,
    rating: 9.8,
    episodes: '24 Episodes',
    duration: '24 min',
    genres: ['Fantasy', 'Action', 'Drama'],
    description:
      'A rival kingdom rises beneath the last ember of the moonlit court, forcing a fallen guardian to choose between vengeance and mercy.',
    image: '/media/poster-1.png',
    badge: 'Trending',
  },
  {
    title: 'The Sorcerer’s Aura',
    year: 2023,
    rating: 9.6,
    episodes: '148 Chapters',
    duration: '8 min',
    genres: ['Mystery', 'Adventure', 'Supernatural'],
    description:
      'A forgotten sigil begins to pulse through the city, and four students uncover the ritual that stitched their world together.',
    image: '/media/poster-2.png',
    badge: 'Top Rated',
  },
  {
    title: 'Castle in the Drifting Sky',
    year: 2022,
    rating: 9.4,
    episodes: '12 Volumes',
    duration: '11 min',
    genres: ['Romance', 'Fantasy', 'Slice of Life'],
    description:
      'The sky kingdom opens its gates for one final season of longing, memory, and the quiet ache of departure.',
    image: '/media/poster-3.png',
    badge: 'New',
  },
]

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
        className="absolute inset-0 cursor-default bg-foreground/20"
      />
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-[0_24px_80px_rgba(0,0,0,0.24)] duration-150">
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
          <Search className="size-5 shrink-0 text-accent" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search series, creators, formats..."
            className="h-12 w-full bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden shrink-0 rounded-[8px] border border-border/70 bg-muted px-1.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          <p className="px-3 py-2 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
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
                      className="group flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-muted text-accent shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] group-hover:bg-card">
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

        <div className="flex items-center justify-between border-t border-border/70 bg-muted/30 px-4 py-2.5 text-[0.7rem] text-muted-foreground">
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
        'sticky top-0 z-50 w-full border-b border-border bg-card/95 transition-shadow',
        scrolled && 'shadow-sm',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
            Web Wonders
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="rounded-[10px] px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search (Cmd+K) */}
        <button
          onClick={onOpenSearch}
          aria-label="Open global search"
          className="ml-auto flex h-9 items-center gap-2 rounded-[10px] border border-border/70 bg-card/80 px-3 text-sm text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors hover:border-accent/40 hover:text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 md:w-64"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="hidden truncate md:inline">
            Search series, creators, formats...
          </span>
          <kbd className="ml-auto hidden shrink-0 items-center gap-0.5 rounded-[8px] border border-border/70 bg-muted px-1.5 py-0.5 text-[0.7rem] font-semibold md:inline-flex">
            ⌘K
          </kbd>
        </button>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="lg"
            className="text-secondary-foreground"
            render={<Link href="/auth" />}
            nativeButton={false}
          >
            Login
          </Button>
          <Button
            size="lg"
            className="hover:bg-gold-light"
            render={<Link href="/auth?mode=signup" />}
            nativeButton={false}
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-[10px] border border-border/70 bg-card/80 text-foreground shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-4 text-accent" aria-hidden />
                    {link.label}
                  </Link>
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
              nativeButton={false}
            >
              Login
            </Button>
            <Button
              size="lg"
              className="flex-1 hover:bg-gold-light"
              render={<Link href="/auth?mode=signup" />}
              nativeButton={false}
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
        <div className="flex w-full items-center gap-3 rounded-b-[16px] border border-t-0 border-border/70 bg-card/95 px-4 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
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
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/auth" />}
              nativeButton={false}
            >
              Login
            </Button>
            <Button
              size="sm"
              className="hover:bg-gold-light"
              render={<Link href="/auth?mode=signup" />}
              nativeButton={false}
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()
  const timerRef = useRef<number | null>(null)

  const activeSlide = HERO_SLIDES[activeIndex]

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % HERO_SLIDES.length)
  }, [])

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
    }

    if (reducedMotion || isPaused) {
      return
    }

    timerRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_SLIDES.length)
    }, 8000)
  }, [isPaused, reducedMotion])

  useEffect(() => {
    resetTimer()

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [activeIndex, resetTimer])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goToNext, goToPrevious])

  function handleTouchStart(event: React.TouchEvent) {
    setTouchStart(event.touches[0]?.clientX ?? null)
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStart === null) {
      return
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStart
    const delta = touchStart - endX

    if (delta > 50) {
      goToNext()
    }

    if (delta < -50) {
      goToPrevious()
    }

    setTouchStart(null)
  }

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Featured content carousel"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-70 blur-3xl dark:opacity-30"
        style={{
          background:
            'radial-gradient(closest-side, rgba(246,237,120,0.55), rgba(244,216,69,0.28) 45%, rgba(255,201,201,0.35) 70%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-[8%] h-72 w-72 rounded-full opacity-60 blur-3xl dark:opacity-25"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,192,203,0.4), transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card/85 shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur-sm">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,5,0.92)_0%,rgba(8,7,5,0.76)_36%,rgba(8,7,5,0.28)_70%,rgba(8,7,5,0)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.72)_0%,rgba(8,7,5,0.28)_42%,rgba(8,7,5,0.05)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_42%)]" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeSlide.title}
              initial={reducedMotion ? false : { opacity: 0, scale: 1.03 }}
              animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover object-center brightness-[0.55]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative flex min-h-[620px] flex-col justify-end px-4 py-10 sm:min-h-[720px] sm:px-6 sm:py-16 lg:min-h-[760px] lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <motion.div
                key={`${activeSlide.title}-badge`}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-card/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-white/85 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
              >
                <Sparkles className="size-3.5 text-accent" aria-hidden />
                {activeSlide.badge}
              </motion.div>

              <motion.h1
                key={`${activeSlide.title}-title`}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.15 }}
                className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-balance text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl"
              >
                {activeSlide.title}
              </motion.h1>

              <motion.div
                key={`${activeSlide.title}-meta`}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.48, delay: reducedMotion ? 0 : 0.24 }}
                className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-white/80"
              >
                <span className="rounded-full border border-white/15 bg-[#12100d]/70 px-3 py-1.5 text-white/85 backdrop-blur">
                  {activeSlide.year}
                </span>
                <span className="rounded-full border border-white/15 bg-[#12100d]/70 px-3 py-1.5 text-white/85 backdrop-blur">
                  <Star className="mr-1.5 inline size-3.5 fill-current text-accent" aria-hidden />
                  {activeSlide.rating.toFixed(1)}
                </span>
                <span className="rounded-full border border-white/15 bg-[#12100d]/70 px-3 py-1.5 text-white/85 backdrop-blur">
                  {activeSlide.episodes}
                </span>
                <span className="rounded-full border border-white/15 bg-[#12100d]/70 px-3 py-1.5 text-white/85 backdrop-blur">
                  {activeSlide.duration}
                </span>
              </motion.div>

              <motion.div
                key={`${activeSlide.title}-genres`}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 0.32 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {activeSlide.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/15 bg-[#12100d]/70 px-3 py-1.5 text-sm font-medium text-white/80 backdrop-blur"
                  >
                    {genre}
                  </span>
                ))}
              </motion.div>

              <motion.p
                key={`${activeSlide.title}-copy`}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.48, delay: reducedMotion ? 0 : 0.4 }}
                className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
              >
                {activeSlide.description}
              </motion.p>

              <motion.div
                key={`${activeSlide.title}-actions`}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.5 }}
                className="mt-8 flex flex-col items-start gap-3 sm:flex-row"
              >
                <Button
                  size="lg"
                  className="h-12 px-7 text-base shadow-[0_10px_24px_rgba(243,191,95,0.22)] hover:-translate-y-0.5 hover:bg-primary/90"
                  render={<Link href="/timeline" />}
                  nativeButton={false}
                >
                  Watch Now
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onOpenSearch}
                  className="h-12 bg-card/80 px-7 text-base"
                >
                  <Search className="size-4" />
                  Details
                </Button>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full border border-border/70 transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-primary shadow-[0_8px_20px_rgba(243,191,95,0.18)]'
                        : 'w-2.5 bg-card/70 hover:bg-primary/70'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  aria-label="Previous featured title"
                  onClick={goToPrevious}
                  className="size-10 rounded-full border-border/70 bg-card/80 backdrop-blur"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  aria-label="Next featured title"
                  onClick={goToNext}
                  className="size-10 rounded-full border-border/70 bg-card/80 backdrop-blur"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 sm:inset-x-6 sm:bottom-6">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                key={activeSlide.title}
                initial={reducedMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0 }}
                animate={reducedMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : 8, ease: 'linear' }}
                className="h-full origin-left rounded-full bg-primary/90"
              />
            </div>
            <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground backdrop-blur">
              0{activeIndex + 1}
            </span>
          </div>
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
    <article className="group relative overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-[0_12px_28px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(0,0,0,0.1)]">
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.image || '/placeholder.svg'}
          alt={`Cover art for ${media.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Format badge */}
        <span className="absolute top-3 left-3 rounded-full bg-card/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          {media.format}
        </span>

        {/* Hover detail overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
        <h3 className="min-w-0 flex-1 truncate font-semibold text-foreground">
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
    <section
      id="trending"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
            <TrendingUp className="size-4" aria-hidden />
            Trending &amp; Discovery
          </span>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
            Wonders the world is watching
          </h2>
          <p className="mt-3 max-w-xl text-secondary-foreground leading-relaxed">
            Hand-picked highlights across every format. Hover any card to reveal
            ratings, run length, and release year.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="shrink-0 bg-card"
          render={<Link href="/community" />}
          nativeButton={false}
        >
          Browse all
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 place-items-center">
        {TRENDING.map((media, index) => (
          <ScrollReveal key={media.title} delay={index * 150}>
            <NewMediaCard 
              title={media.title}
              format={media.format}
              score={media.rating}
              coverUrl={media.image}
            />
          </ScrollReveal>
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
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold text-foreground">
            Web Wonders
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Web Wonders. The unified fictional
          universe.
        </p>
        <div className="flex gap-4 text-sm text-secondary-foreground">
          <Link href="/community" className="transition-colors hover:text-foreground">
            Community
          </Link>
          <Link href="/creators" className="transition-colors hover:text-foreground">
            Creators
          </Link>
          <Link href="/timeline" className="transition-colors hover:text-foreground">
            Timeline
          </Link>
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
