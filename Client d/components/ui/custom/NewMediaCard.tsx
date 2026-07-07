import Link from 'next/link';
import { Star } from 'lucide-react';

interface MediaCardProps {
  title: string;
  format: 'Anime' | 'Manga' | 'Light Novel' | 'Webtoon';
  score: number;
  coverUrl: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ title, format, score, coverUrl }) => {
  return (
    <Link
      href="/timeline"
      className="group relative flex aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-[var(--border)]"
    >
      <img
        src={coverUrl || '/placeholder.svg'}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-30" />

      <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-white shadow">
        {format}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-card p-4 transition-transform duration-300 group-hover:translate-y-0">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground">
            {title}
          </h3>
          <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs font-bold text-[var(--accent)]">
            <Star className="size-3 fill-current" /> {score.toFixed(1)}
          </span>
        </div>

        <span className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--primary)]/90">
          Open in timeline
        </span>
      </div>
    </Link>
  );
};

export default MediaCard;