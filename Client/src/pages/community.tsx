import { Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
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
import api from '@/lib/api'


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
  id: string | number
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  avatar: string
  date: string
  readTime: string
  likes: number
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

function Header() {
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

        <Link to="/articles/new">
          <Button
            size="lg"
            className="h-12 shrink-0 bg-accent px-6 text-base text-accent-foreground shadow-[0_10px_24px_rgba(154,84,61,0.2)] hover:bg-accent/90"
          >
            <PenLine className="size-4 mr-2" aria-hidden />
            Write an Article
          </Button>
        </Link>
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
  const [articles, setArticles] = useState<Article[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles');
        const formattedArticles = response.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          excerpt: item.content?.substring(0, 150) + '...' || 'No excerpt available',
          category: item.tags?.[0] || 'Uncategorized',
          image: item.coverImage || '/placeholder.svg',
          author: item.authorId?.username || 'Unknown Author',
          avatar: item.authorId?.profilePicture || '/placeholder.svg',
          date: new Date(item.createdAt).toLocaleDateString(),
          readTime: `${Math.ceil((item.content?.split(' ').length || 0) / 200) || 5} min read`,
          likes: item.likes?.length || 0,
        }));
        setArticles(formattedArticles);
      } catch (err) {
        console.error("Failed to fetch community articles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      return activeTag === 'All' || article.category.toLowerCase() === activeTag.toLowerCase() || article.category === activeTag;
    })
  }, [activeTag, articles])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Header />
      <TrendingTags activeTag={activeTag} onSelectTag={setActiveTag} />

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <Feed articles={filteredArticles} />
      )}
      <Footer />
    </main>
  )
}
