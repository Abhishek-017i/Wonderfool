import {Link} from 'react-router-dom'
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
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import {
  COMMUNITY_ARTICLES,
  registerCommunityArticle,
  type CommunityArticlePreview,
} from '@/data/communityArticles'

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

type Article = CommunityArticlePreview

const INITIAL_ARTICLES: Article[] = COMMUNITY_ARTICLES

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

function Header({
  onOpenComposer,
}: {
  onOpenComposer: () => void
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end">
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
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200',
                active
                  ? 'border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'border-border bg-card text-foreground/80 hover:border-accent hover:text-accent hover:bg-card/90 shadow-sm',
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
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          <User className="size-3 text-accent" aria-hidden />
          {article.author}
        </span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" aria-hidden />
        {article.readTime}
      </span>
      <span>{article.date}</span>
      <span className="inline-flex items-center gap-1">
        <Heart className="size-3 text-accent/80" aria-hidden />
        {article.likes.toLocaleString()}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Article Cards                                  */
/* -------------------------------------------------------------------------- */

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-border/70 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_45px_rgba(0,0,0,0.1)] lg:flex-row min-h-[320px]"
    >
      <div className="relative aspect-video shrink-0 overflow-hidden lg:aspect-auto lg:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image || '/placeholder.svg'}
          alt={`Cover art for ${article.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-card/90 px-3.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur border border-border/40">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
        <div className="space-y-3">
          <span className="text-xs font-semibold tracking-wide text-accent uppercase">
            Featured Article
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent lg:text-3xl line-clamp-2">
            {article.title}
          </h2>
          <p className="text-pretty text-muted-foreground leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 mt-auto border-t border-border/40 flex flex-col gap-3">
          <ArticleMeta article={article} />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Read the full piece
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex flex-col h-full overflow-hidden rounded-[16px] border border-border/70 bg-card shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image || '/placeholder.svg'}
          alt={`Cover art for ${article.title}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur border border-border/40">
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
            <BookOpen className="size-3.5" aria-hidden />
            {article.readTime}
          </div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <ArticleMeta article={article} className="pt-3 border-t border-border/40 mt-auto" />
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Feed                                     */
/* -------------------------------------------------------------------------- */

function Feed({ articles }: { articles: Article[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
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
    registerCommunityArticle(draftArticle)
    setDraftTitle('')
    setDraftExcerpt('')
    setDraftCategory('Essays')
    setComposerOpen(false)
    setStatusMessage('Draft published to the feed.')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
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
              <Button variant="outline" onClick={() => setComposerOpen(false)} className="">
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

      <Feed articles={filteredArticles} />
      <Footer />
    </main>
  )
}
