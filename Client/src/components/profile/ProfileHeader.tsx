import { useState } from 'react'
import { Heart, Share2, ChevronDown, CheckCircle, MapPin, Calendar, Link as LinkIcon } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { UserProfile } from '../../data/mockData'
import { formatNumber } from '../../lib/utils'
import Toast from './Toast'
import UsersModal from './UsersModal'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

interface ProfileHeaderProps {
  user: UserProfile
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [showBioFull, setShowBioFull] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'followers' | 'following' }>({ isOpen: false, type: 'followers' })

  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const handleFollow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setIsFollowing(!isFollowing)
    setToast(isFollowing ? 'Unfollowed user' : 'Following user')
    setTimeout(() => setToast(null), 2000)
  }

  const handleShare = () => {
    setToast('Profile link copied')
    setTimeout(() => setToast(null), 2000)
  }

  const bioPreview = user.bio.length > 120 ? user.bio.substring(0, 120) + '...' : user.bio

  const mockUsers = [
    { id: '1', name: 'Alex Chen', handle: '@alexc', avatar: 'https://i.pravatar.cc/150?u=1', isFollowing: true },
    { id: '2', name: 'Sarah Smith', handle: '@sarahs', avatar: 'https://i.pravatar.cc/150?u=2', isFollowing: false },
    { id: '3', name: 'Mike Johnson', handle: '@mikej', avatar: 'https://i.pravatar.cc/150?u=3', isFollowing: true },
  ]

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Main Profile Card */}
        <div className="glass-panel rounded-2xl overflow-hidden relative">
          {/* Banner */}
          <div className="h-32 sm:h-40 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img 
              src={user.banner} 
              alt="Profile Banner" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 pt-0 relative z-20">
            {/* Avatar & Action Buttons */}
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-background ring-2 ring-primary/50 shadow-xl"
                />
              </div>
              
              <div className="flex gap-2 pb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="p-2 rounded-full bg-background/50 hover:bg-muted border border-border backdrop-blur-sm transition-colors text-foreground"
                  title="Share Profile"
                >
                  <Share2 size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg ${
                    isFollowing 
                      ? 'bg-muted text-foreground border border-border hover:bg-background' 
                      : 'bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground hover:shadow-[0_0_20px_rgba(200,173,57,0.4)] border border-primary/20'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">{user.name}</h1>
                {user.verified && (
                  <CheckCircle size={20} className="text-primary fill-primary/20" />
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold ml-2">
                  {user.rank}
                </span>
              </div>
              <p className="text-muted-foreground font-medium text-sm">{user.handle}</p>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <p className="text-foreground leading-relaxed text-sm sm:text-base">
                {showBioFull ? user.bio : bioPreview}
              </p>
              {user.bio.length > 120 && (
                <button
                  onClick={() => setShowBioFull(!showBioFull)}
                  className="flex items-center gap-1 mt-2 text-primary text-sm font-semibold hover:text-accent transition-colors"
                >
                  {showBioFull ? 'Show less' : 'Read more'}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showBioFull ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Meta Details */}
            <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary/70" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon size={16} className="text-primary/70" />
                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {user.website}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary/70" />
                <span>{user.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ y: -2 }} 
            onClick={() => setModalState({ isOpen: true, type: 'followers' })}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center luxury-shadow hover:border-primary/50 transition-colors w-full"
          >
            <span className="text-2xl font-bold text-gradient mb-1">{formatNumber(user.followers)}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Followers</span>
          </motion.button>
          <motion.button 
            whileHover={{ y: -2 }} 
            onClick={() => setModalState({ isOpen: true, type: 'following' })}
            className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center luxury-shadow hover:border-primary/50 transition-colors w-full"
          >
            <span className="text-2xl font-bold text-gradient mb-1">{formatNumber(user.following)}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Following</span>
          </motion.button>
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

      <UsersModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.type === 'followers' ? 'Followers' : 'Following'}
        users={mockUsers}
      />

      {toast && <Toast message={toast} />}
    </>
  )
}
