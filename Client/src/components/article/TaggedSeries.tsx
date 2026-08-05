import { Link } from 'react-router-dom'
import SeriesCard from '../SeriesCard'
import { Series } from '../../hooks/useArticle'
import { ScrollArea } from '../ui/scroll-area'

interface TaggedSeriesProps {
  series: Series[]
}

export function TaggedSeries({ series }: TaggedSeriesProps) {
  if (series.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Tagged Series</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {series.map((s, index) => (
            <Link
              key={s.id}
              to={`/series/${s.id}`}
              className="hover:opacity-90 transition-opacity"
            >
              <SeriesCard series={s} index={index} />
            </Link>
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}
