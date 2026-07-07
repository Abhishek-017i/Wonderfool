"use client"

import Link from "next/link"
import {
  Sparkles,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Tv,
  BookOpen,
  BookMarked,
  PlayCircle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Trophy,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

type Status = "Started" | "Completed" | "Dropped" | "On Hold"
type Format = "Anime" | "Manga" | "Light Novel" | "Webtoon"

type TimelineEvent = {
  id: number
  title: string
  format: Format
  status: Status
  date: string
  note: string
  image: string
}

const user = {
  name: "Aoi Tanaka",
  handle: "@aoi_reads",
  bio: "Chronicling every arc, panel, and page. Perpetual wanderer between fiction and reality.",
  location: "Kyoto, Japan",
  joined: "Joined March 2023",
}

const stats = [
  { label: "Anime Watched", value: "312", icon: Tv },
  { label: "Manga Read", value: "1,204", icon: BookOpen },
  { label: "Light Novels", value: "87", icon: BookMarked },
  { label: "Total Days", value: "64", icon: CalendarDays },
]

const timeline: TimelineEvent[] = [
  {
    id: 1,
    title: "Blade of the Fallen Petal",
    format: "Anime",
    status: "Completed",
    date: "May 18, 2026",
    note: "A breathtaking finale. The final duel under the sakura tree will stay with me.",
    image: "/media/poster-1.png",
  },
  {
    id: 2,
    title: "The Cursed Sorcerer",
    format: "Manga",
    status: "Started",
    date: "May 09, 2026",
    note: "Twenty chapters in and the world-building is already extraordinary.",
    image: "/media/poster-2.png",
  },
  {
    id: 3,
    title: "Castle in the Drifting Clouds",
    format: "Light Novel",
    status: "Completed",
    date: "April 27, 2026",
    note: "Volume 6 wrapped the sky kingdom arc beautifully. A quiet masterpiece.",
    image: "/media/poster-3.png",
  },
  {
    id: 4,
    title: "Twin Blades",
    format: "Webtoon",
    status: "On Hold",
    date: "April 12, 2026",
    note: "Pausing until the next season drops. The rivalry is too good to rush.",
    image: "/media/poster-4.png",
  },
  {
    id: 5,
    title: "Afternoons in Setagaya",
    format: "Anime",
    status: "Dropped",
    date: "March 30, 2026",
    note: "Lovely art, but the pacing lost me around episode eight.",
    image: "/media/poster-5.png",
  },
  {
    id: 6,
    title: "The Golden Colossus",
    format: "Manga",
    status: "Completed",
    date: "March 15, 2026",
    note: "An epic in every sense. The scale of each battle was staggering.",
    image: "/media/poster-6.png",
  },
]

const statusStyles: Record<
  Status,
  { badge: string; node: string; icon: typeof PlayCircle }
> = {
  Started: {
    badge: "bg-primary/25 text-foreground border-primary/50",
    node: "bg-primary border-accent",
    icon: PlayCircle,
  },
  Completed: {
    badge: "bg-accent/15 text-accent border-accent/40",
    node: "bg-accent border-accent",
    icon: CheckCircle2,
  },
  Dropped: {
    badge: "bg-sakura/25 text-sakura border-sakura/60",
    node: "bg-sakura border-sakura",
    icon: XCircle,
  },
  "On Hold": {
    badge: "bg-muted text-secondary-foreground border-border",
    node: "bg-card border-border",
    icon: PauseCircle,
  },
}

const formatStyles: Record<Format, string> = {
  Anime: "bg-accent text-accent-foreground",
  Manga: "bg-foreground text-background",
  "Light Novel": "bg-primary text-primary-foreground",
  Webtoon: "bg-sakura text-sakura-foreground",
}

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-secondary-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">Back to Explore</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">
              Web Wonders
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:py-12">
        {/* Left sidebar — profile */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[18px] border border-border/70 bg-card p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="/media/poster-5.png"
                  alt={`${user.name} avatar`}
                  className="size-24 rounded-full border-2 border-primary object-cover"
                />
                <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-accent">
                  <Trophy className="size-4 text-accent-foreground" />
                </span>
              </div>
              <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
                {user.name}
              </h1>
              <p className="text-sm font-medium text-accent">{user.handle}</p>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-secondary-foreground">
                {user.bio}
              </p>
              <div className="mt-4 flex flex-col gap-1.5 text-xs text-secondary-foreground">
                <span className="flex items-center justify-center gap-1.5">
                  <MapPin className="size-3.5 text-accent" />
                  {user.location}
                </span>
                <span className="flex items-center justify-center gap-1.5">
                  <CalendarDays className="size-3.5 text-accent" />
                  {user.joined}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/50 pt-6">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="rounded-[12px] border border-border/60 bg-background/70 p-3 text-center"
                  >
                    <Icon className="mx-auto size-4 text-accent" />
                    <div className="mt-1.5 font-display text-xl font-semibold text-foreground">
                      {s.value}
                    </div>
                    <div className="text-[11px] leading-tight text-secondary-foreground">
                      {s.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Main content — timeline */}
        <section>
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Reading &amp; Watching Timeline
            </h2>
            <p className="mt-1 text-secondary-foreground">
              A chronicle of every milestone, arc, and finale.
            </p>
          </div>

          {/* Timeline track */}
          <ol className="relative ml-3 border-l border-border pl-8 sm:ml-4 sm:pl-10">
            {timeline.map((event) => {
              const s = statusStyles[event.status]
              const StatusIcon = s.icon
              return (
                <li key={event.id} className="relative pb-10 last:pb-0">
                  {/* Node */}
                  <span
                    className={`absolute -left-[calc(2rem+7px)] top-2 flex size-3.5 items-center justify-center rounded-full border-2 sm:-left-[calc(2.5rem+7px)] ${s.node}`}
                    aria-hidden="true"
                  />
                  {/* Card */}
                  <article className="group flex gap-4 rounded-[16px] border border-border/70 bg-card p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition-all hover:border-border hover:shadow-[0_16px_32px_rgba(0,0,0,0.07)]">
                    <div className="relative shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="size-20 object-cover transition-transform duration-300 group-hover:scale-105 sm:size-24"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${formatStyles[event.format]}`}
                        >
                          {event.format}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.badge}`}
                        >
                          <StatusIcon className="size-3" />
                          {event.status}
                        </span>
                      </div>
                      <h3 className="mt-2 text-pretty font-display text-lg font-semibold leading-snug text-foreground">
                        {event.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-secondary-foreground">
                        {event.note}
                      </p>
                      <time className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                        <CalendarDays className="size-3.5" />
                        {event.date}
                      </time>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </main>
  )
}
