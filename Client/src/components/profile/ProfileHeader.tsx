import { CheckCircle, Calendar } from 'lucide-react'
import { formatNumber } from '../../lib/utils'
import { motion } from 'framer-motion'

interface UserProfile {
  name: string
  email?: string
  handle: string
  avatar: string
  bio: string
  location: string
  verified: boolean
  rank: string
  website: string
  joinDate: string
  joined: string
  reviews: number
  articles: number
}

interface ProfileHeaderProps {
  user: UserProfile
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Main Profile Card */}
      <div className="glass-panel rounded-2xl overflow-hidden relative">
        <div className="p-6 relative z-20">
          {/* Avatar */}
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-background ring-2 ring-primary/50 shadow-xl"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">{user.name}</h1>
              {user.verified && (
                <CheckCircle size={20} className="text-primary fill-primary/20" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-muted-foreground font-medium text-sm">{user.handle}</p>
              {user.email && (
                <p className="text-muted-foreground/80 font-medium text-xs">{user.email}</p>
              )}
            </div>
          </div>

          {/* Meta Details */}
          <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-primary/70" />
              <span>{user.joinDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center luxury-shadow">
          <span className="text-2xl font-bold text-gradient mb-1">{formatNumber(user.reviews)}</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reviews</span>
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center luxury-shadow">
          <span className="text-2xl font-bold text-gradient mb-1">{formatNumber(user.articles)}</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Articles</span>
        </motion.div>
      </div>
    </div>
  )
}