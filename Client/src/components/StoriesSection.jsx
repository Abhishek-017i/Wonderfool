import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { storiesData } from '@/data/stories'

function StoryCard({ story }) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden flex flex-col h-full transition-transform hover:scale-105" style={{ borderColor: 'var(--border)' }}>
      {/* Story Image */}
      <div className="relative w-full h-48 overflow-hidden bg-background">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Source Label */}
        <span className="text-xs uppercase tracking-wider text-primary font-bold mb-2">
          {story.source}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
          {story.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {story.excerpt}
        </p>

        {/* Read Story Button */}
        <a
          href={story.link}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
        >
          READ STORY
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  )
}

export default function StoriesSection() {
  return (
    <div className="w-full py-16 px-4 bg-background">
      <div className="container mx-auto">
        {/* Section Header with View More Link */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Recent Stories
          </h2>
          <Link
            to="#community"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storiesData.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  )
}
