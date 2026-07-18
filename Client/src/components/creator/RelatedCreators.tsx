import CreatorCard from './CreatorCard'
import EmptyState from '../browse/EmptyState'

interface RelatedCreator {
  id: string
  name: string
  avatarUrl: string
  role: string
}

interface RelatedCreatorsProps {
  creators: RelatedCreator[]
}

export default function RelatedCreators({ creators }: RelatedCreatorsProps) {
  if (creators.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
          Related Creators
        </h2>
        <EmptyState
          title="No related creators"
          message="Nothing here yet. Even I find that a little surprising."
        />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary w-fit">
        Related Creators
      </h2>
      <div className="w-full relative">
        <div className="flex gap-4 pb-6 overflow-x-auto scrollbar-hide snap-x px-1">
          {creators.map(creator => (
            <div key={creator.id} className="snap-start">
              <CreatorCard {...creator} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
