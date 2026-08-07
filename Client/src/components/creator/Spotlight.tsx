import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface SpotlightProps {
  title: string
  coverUrl: string
  rating: number
  year: number
  description: string
  role: string
}

export default function Spotlight({
  title,
  coverUrl,
  rating,
  year,
  description,
  role,
}: SpotlightProps) {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-primary font-cinzel uppercase tracking-widest mb-2">
          Signature Work
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold font-cinzel text-foreground bg-clip-text text-transparent bg-gradient-to-r from-accent via-secondary to-primary w-fit">
          Featured Work
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
      >
        {/* Cover Image */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl md:col-span-2 group">
          <img
            src={coverUrl}
            alt={title}
            loading="lazy"
            className="w-full h-auto object-cover aspect-[2/3] transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="space-y-6 flex flex-col justify-center md:col-span-3">
          <div>
            <h3 className="text-3xl font-bold text-foreground font-cinzel mb-3">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-1 rounded-md">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-medium">{year}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-accent font-semibold tracking-wide uppercase">{role}</span>
            </div>
          </div>

          <p className="text-muted-foreground font-serif text-lg leading-relaxed text-balance">
            {description}
          </p>

          <div className="pt-6 mt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold font-cinzel flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary"></span>
              Most Acclaimed Work
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
