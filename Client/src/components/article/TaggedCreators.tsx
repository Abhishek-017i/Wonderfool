import { Link } from 'react-router-dom'
import { CreatorCard } from '../CreatorCard'
import { Creator } from '../../hooks/useArticle'

interface TaggedCreatorsProps {
  creators: Creator[]
}

export function TaggedCreators({ creators }: TaggedCreatorsProps) {
  if (creators.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Tagged Creators</h2>
      <div className="flex flex-wrap gap-4">
        {creators.map((creator) => (
          <Link
            key={creator.id}
            to={`/creator/${creator.id}`}
            className="hover:opacity-80 transition-opacity"
          >
            <CreatorCard {...creator} />
          </Link>
        ))}
      </div>
    </section>
  )
}
