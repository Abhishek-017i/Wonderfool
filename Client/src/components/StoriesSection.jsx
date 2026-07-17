import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { storiesData } from '@/data/stories'

function StoryCard({ story, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/40 transition-colors duration-500 luxury-shadow relative cursor-pointer"
    >
      {/* Golden Glow effect on hover */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors duration-500 pointer-events-none" />

      {/* Story Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <motion.img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover origin-center"
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent opacity-40 dark:opacity-90" />
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 relative z-10 -mt-10 bg-card rounded-t-[32px]">
        {/* Source Label */}
        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-3 block">
          {story.source}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-4 font-cinzel leading-snug group-hover:text-primary transition-colors duration-300">
          {story.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-foreground/70 line-clamp-3 mb-6 flex-1 font-serif italic leading-relaxed">
          {story.excerpt}
        </p>

        {/* Read Story Button */}
        <Link
          to="#"
          onClick={(e) => e.preventDefault()}
          title="Coming Soon"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all uppercase tracking-widest text-xs border-b border-primary/30 pb-1 w-fit group-hover:border-primary"
        >
          Read Editorial
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function StoriesSection() {
  return (
    <div className="w-full py-24 px-6 lg:px-12 bg-card/30 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-border pb-6">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3 block font-serif">
              Editorial & News
            </span>
            <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-foreground tracking-tight">
              Latest Stories
            </h2>
          </div>
          <Link
            to="/community"
            className="hidden md:inline-flex items-center gap-3 text-foreground font-semibold hover:text-primary transition-all group uppercase tracking-widest text-xs mt-6 md:mt-0"
          >
            All Stories
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {storiesData.map((story, idx) => (
            <StoryCard key={story.id} story={story} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
