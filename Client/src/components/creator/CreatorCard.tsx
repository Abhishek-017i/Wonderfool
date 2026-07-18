import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export interface CreatorCardProps {
  id: string
  name: string
  avatarUrl: string
  role: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function CreatorCard({ id, name, avatarUrl, role }: CreatorCardProps) {
  const initials = getInitials(name)

  return (
    <Link to={`/creator/${id}`} className="block flex-shrink-0 group cursor-pointer w-[140px] sm:w-[160px]">
      <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col items-center"
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-card to-border flex items-center justify-center mb-4 border-2 border-border/50 group-hover:border-primary/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300">
          {avatarUrl && avatarUrl.startsWith('http') ? (
            <img 
              src={avatarUrl} 
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <span className="text-3xl font-bold font-cinzel text-foreground">{initials}</span>
          )}
        </div>
        <h3 className="font-bold font-cinzel text-base text-center line-clamp-2 text-foreground group-hover:text-primary transition-colors px-2">
          {name}
        </h3>
        <p className="text-sm font-medium text-center text-accent/80 line-clamp-1 mt-1 uppercase tracking-wide">
          {role}
        </p>
      </motion.div>
    </Link>
  )
}
