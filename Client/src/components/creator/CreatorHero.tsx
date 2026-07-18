import { MapPin, Heart } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface CreatorHeroProps {
  name: string
  roles: string[]
  country: string | null
  avatarUrl: string
  bannerUrl: string
}

export default function CreatorHero({
  name,
  roles,
  country,
  avatarUrl,
  bannerUrl,
}: CreatorHeroProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = getInitials(name)

  return (
    <div className="w-full">
      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-card to-border overflow-hidden"
      >
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`${name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        {/* Gradient overlay bottom-to-top */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </motion.div>

      {/* Hero Content */}
      <div className="px-4 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-20 sm:-mt-24 relative z-10">
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex-shrink-0"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-accent to-primary border-4 border-background flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              {avatarUrl && avatarUrl.startsWith('http') ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl sm:text-5xl font-bold text-foreground font-cinzel">
                  {initials}
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 pb-4 sm:pb-2 space-y-3"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-foreground text-balance bg-clip-text text-transparent bg-gradient-to-r from-accent via-secondary to-primary">
                {name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {roles.map(role => (
                  <Badge key={role} variant="secondary" className="border-accent/30 bg-accent/10 text-accent hover:bg-accent/20">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            {country && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{country}</span>
              </div>
            )}
          </motion.div>

          {/* Follow Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-3 sm:pb-2"
          >
            <Button
              className="flex-1 sm:flex-none border-primary/50 hover:border-primary hover:bg-primary/10 transition-colors"
              onClick={() => setIsFavorited(!isFavorited)}
              variant="outline"
              size="sm"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-primary text-primary' : 'text-foreground'}`}
              />
            </Button>
            <Button className="flex-1 sm:flex-none bg-gradient-to-r from-accent to-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all border-0">
              Follow
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
