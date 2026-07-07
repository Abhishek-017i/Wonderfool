'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  Clock,
  User,
  BookOpen,
  Heart,
  PenLine,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

const TAGS = [
  'All',
  'Analysis',
  'Reviews',
  'Character Studies',
  'Manga Art',
  'Worldbuilding',
  'Soundtracks',
  'Essays',
  'Interviews',
]

type Article = {
  id: number
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  avatar: string
  date: string
  readTime: string
  likes: number
  featured?: boolean
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'The Architectural Genius of Tsutomu Nihei',
    excerpt:
      'From Blame! to Biomega, Nihei turns concrete and shadow into narrative. We trace how his background as an architect built the most oppressive, awe-inspiring worlds in manga history.',
    category: 'Analysis',
    image: '/blog/nihei-architecture.png',
    author: 'Mika Aozora',
    avatar: '/blog/avatar-1.png',
    date: 'Jun 28, 2026',
    readTime: '11 min read',
    likes: 842,
    featured: true,
  },
  {
    id: 2,
    title: 'Why Frieren Resonates with Adult Audiences',
    excerpt:
      'A meditation on grief, memory, and the quiet ache of outliving those you love. Frieren trades spectacle for stillness — and that is exactly why it lands.',
    category: 'Essays',
    image: '/blog/frieren-adult.png',
    author: 'Kenji Sato',
    avatar: '/blog/avatar-2.png',
    date: 'Jun 24, 2026',
    readTime: '8 min read',
    likes: 1263,
    featured: true,
  },
  {
    id: 3,
    title: 'The Lost Art of the Splash Page',
    excerpt:
      'How master mangaka use a single full-bleed panel to stop time and steal your breath.',
    category: 'Manga Art',
    image: '/blog/panel-composition.png',
    author: 'Rei Tanaka',
    avatar: '/blog/avatar-3.png',
    date: 'Jun 20, 2026',
    readTime: '6 min read',
    likes: 517,
  },
  {
    id: 4,
    title: 'Sympathy for the Devil: Rewriting the Villain',
    excerpt:
      'The modern antagonist is no longer pure evil. A close read of the tragic villains redefining the genre.',
    category: 'Character Studies',
    image: '/blog/villain-study.png',
    author: 'Daichi Mori',
    avatar: '/blog/avatar-4.png',
    date: 'Jun 16, 2026',
    readTime: '9 min read',
    likes: 689,
  },
  {
    id: 5,
    title: 'In Praise of Slow: The Slice-of-Life Renaissance',
    excerpt:
      'Tea, sunlight, and nothing happening at all. Why the quietest shows have become our loudest comfort.',
    category: 'Reviews',
    image: '/blog/slice-of-life.png',
    author: 'Mika Aozora',
    avatar: '/blog/avatar-1.png',
    date: 'Jun 12, 2026',
    readTime: '5 min read',
    likes: 934,
  },
  {
    id: 6,
    title: 'Scores That Score: The Emotional Engineering of Anime OSTs',
    excerpt:
      'From Hiroyuki Sawano to Yoko Kanno, a study of how composers weaponize melody to break your heart on cue.',
    category: 'Soundtracks',
    image: '/blog/soundtrack-essay.png',
    author: 'Kenji Sato',
    avatar: '/blog/avatar-2.png',
    date: 'Jun 08, 2026',
    readTime: '7 min read',
    likes: 428,
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

function Header({
  onOpenComposer,
}: {
  onOpenComposer: () => void
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Web Wonders
        </Link>
        <ThemeToggle />
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="text-sm font-semibold tracking-wide text-accent uppercase">
            The Community Journal
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-5xl lg:text-6xl">
            Community Voices
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground leading-relaxed">
            Essays, deep dives, and love letters to the stories that shaped us —
            written by the Web Wonders community.
          </p>
        </div>

        <Button
          size="lg"
          className="h-12 shrink-0 bg-accent px-6 text-base text-accent-foreground shadow-[0_10px_24px_rgba(154,84,61,0.2)] hover:bg-accent/90"
          onClick={onOpenComposer}
        >
          <PenLine className="size-4" aria-hidden />
          Write an Article
        </Button>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Trending Tags                               */
/* -------------------------------------------------------------------------- */

function TrendingTags({
  activeTag,
  onSelectTag,
}: {
  activeTag: string
  onSelectTag: (tag: string) => void
}) {
  return (
    <nav
      aria-label="Trending topics"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TAGS.map((tag) => {
          const active = tag === activeTag
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(tag)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-transparent bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(243,191,95,0.18)]'
                  : 'border-border/70 bg-card/70 text-secondary-foreground hover:border-accent/40 hover:text-accent',
              )}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Article Meta                                 */
/* -------------------------------------------------------------------------- */

function ArticleMeta({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.avatar || '/placeholder.svg'}
          alt=""
          className="size-6 rounded-full object-cover ring-1 ring-border"
        />
        <span className="inline-flex items-center gap-1 font-medium text-secondary-foreground">
          <User className="size-3" aria-hidden />
          {article.author}
        </span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" aria-hidden />
        {article.readTime}
      </span>
      <span>{article.date}</span>
      <span className="inline-flex items-center gap-1">
        <Heart className="size-3" aria-hidden />
        {article.likes.toLocaleString()}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Article Cards                                  */
/* -------------------------------------------------------------------------- */

function FeaturedCard({
  article,
  onOpenArticle,
}: {
  article: Article
  onOpenArticle: (id: number) => void
}) {
  return (
    <Link
      href={`/community#article-${article.id}`}
      onClick={() => onOpenArticle(article.id)}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-[0_14px_35px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] lg:flex-row"
    >
      <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image || '/placeholder.svg'}
          alt={`Cover art for ${article.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-card/85 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-6 lg:p-8">
        <span className="text-xs font-semibold tracking-wide text-accent uppercase">
          Featured
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-balance text-foreground transition-colors group-hover:text-accent lg:text-3xl">
          {article.title}
        </h2>
        <p className="text-pretty text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
        <ArticleMeta article={article} className="mt-1" />
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Read the full piece
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}

function ArticleCard({
  article,
  onOpenArticle,
}: {
  article: Article
  onOpenArticle: (id: number) => void
}) {
  return (
    <Link
      href={`/community#article-${article.id}`}
      onClick={() => onOpenArticle(article.id)}
      className="group flex flex-col overflow-hidden rounded-[16px] border border-border/70 bg-card shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-[0_18px_38px_rgba(0,0,0,0.09)]"
    >
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image || '/placeholder.svg'}
          alt={`Cover art for ${article.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-sakura px-2.5 py-1 text-xs font-semibold text-sakura-foreground shadow">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-accent">
          <BookOpen className="size-3.5" aria-hidden />
          {article.readTime}
        </div>
        <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-balance text-foreground transition-colors group-hover:text-accent">
          {article.title}
        </h3>
        <p className="text-sm text-pretty text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
        <ArticleMeta article={article} className="mt-auto pt-3" />
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Feed                                     */
/* -------------------------------------------------------------------------- */

function Feed({
  articles,
  onOpenArticle,
}: {
  articles: Article[]
  onOpenArticle: (id: number) => void
}) {
  const featured = articles.filter((article) => article.featured)
  const standard = articles.filter((article) => !article.featured)

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {featured.map((article) => (
          <FeaturedCard key={article.id} article={article} onOpenArticle={onOpenArticle} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {standard.map((article) => (
          <ArticleCard key={article.id} article={article} onOpenArticle={onOpenArticle} />
        ))}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                     */
/* -------------------------------------------------------------------------- */

export default function CommunityPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES)
  const [activeTag, setActiveTag] = useState('All')
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(INITIAL_ARTICLES[0].id)
  const [composerOpen, setComposerOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftExcerpt, setDraftExcerpt] = useState('')
  const [draftCategory, setDraftCategory] = useState('Essays')
  const [statusMessage, setStatusMessage] = useState('')

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      return activeTag === 'All' || article.category === activeTag
    })
  }, [activeTag, articles])

  const selectedArticle =
    filteredArticles.find((article) => article.id === selectedArticleId) ?? filteredArticles[0]

  function handlePublishDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draftTitle.trim() || !draftExcerpt.trim()) {
      setStatusMessage('Add a title and a short excerpt before publishing your draft.')
      return
    }

    const draftArticle: Article = {
      id: Date.now(),
      title: draftTitle.trim(),
      excerpt: draftExcerpt.trim(),
      category: draftCategory,
      image: '/blog/panel-composition.png',
      author: 'You',
      avatar: '/blog/avatar-3.png',
      date: 'Just now',
      readTime: '4 min read',
      likes: 42,
    }

    setArticles((current) => [draftArticle, ...current])
    setSelectedArticleId(draftArticle.id)
    setDraftTitle('')
    setDraftExcerpt('')
    setDraftCategory('Essays')
    setComposerOpen(false)
    setStatusMessage('Draft published to the feed.')
  }

  return (
    <main className="min-h-screen bg-background">
      <Header onOpenComposer={() => setComposerOpen(true)} />
      <TrendingTags activeTag={activeTag} onSelectTag={setActiveTag} />

      {composerOpen ? (
        <section className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[20px] border border-border/70 bg-card p-6 shadow-[0_16px_36px_rgba(0,0,0,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Compose a draft
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
                  Share your next thought with the community
                </h2>
              </div>
              <Button variant="outline" onClick={() => setComposerOpen(false)}>
                Close
              </Button>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]" onSubmit={handlePublishDraft}>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">
                  Title
                  <input
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    className="mt-2 w-full rounded-[12px] border border-border/70 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="What are you writing about?"
                  />
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Excerpt
                  <textarea
                    value={draftExcerpt}
                    onChange={(event) => setDraftExcerpt(event.target.value)}
                    className="mt-2 min-h-32 w-full rounded-[12px] border border-border/70 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                    placeholder="Share a few lines that capture the idea."
                  />
                </label>
              </div>

              <div className="rounded-[16px] border border-border/70 bg-background/70 p-4">
                <label className="block text-sm font-medium text-foreground">
                  Topic
                  <select
                    value={draftCategory}
                    onChange={(event) => setDraftCategory(event.target.value)}
                    className="mt-2 w-full rounded-[12px] border border-border/70 bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    {TAGS.filter((tag) => tag !== 'All').map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-4 rounded-[14px] border border-dashed border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-accent" aria-hidden />
                    Drafts publish instantly with a polished preview card.
                  </p>
                  <p className="mt-2">This keeps the page feeling like a working community journal rather than a static mockup.</p>
                </div>
                <Button className="mt-5 w-full" type="submit">
                  Publish draft
                </Button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {statusMessage ? (
        <div className="mx-auto mb-6 flex max-w-7xl items-center gap-2 rounded-[14px] border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent sm:px-6 lg:px-8">
          <Sparkles className="size-4" aria-hidden />
          {statusMessage}
        </div>
      ) : null}

      {selectedArticle ? (
        <section
          id={`article-${selectedArticle.id}`}
          className="mx-auto mb-8 max-w-7xl rounded-[20px] border border-border/70 bg-card px-5 py-6 shadow-[0_16px_36px_rgba(0,0,0,0.05)] sm:px-6 lg:px-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Now reading
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
                {selectedArticle.title}
              </h2>
            </div>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-sm font-medium text-muted-foreground">
              {selectedArticle.category}
            </span>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {selectedArticle.excerpt}
          </p>
        </section>
      ) : null}

      <Feed articles={filteredArticles} onOpenArticle={setSelectedArticleId} />
    </main>
  )
}
