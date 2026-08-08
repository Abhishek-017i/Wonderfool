import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import useWishlistStore from '../../store/wishlistStore'
import useAuthStore from '../../store/authStore'

interface WishlistButtonProps {
  seriesId: string
  seriesData?: { name: string; category?: string; image?: string }
  variant?: 'hero' | 'icon'
}

export default function WishlistButton({ seriesId, seriesData, variant = 'icon' }: WishlistButtonProps) {
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(seriesId))
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    toggleWishlist(seriesId, seriesData)
  }

  if (variant === 'hero') {
    return (
      <motion.button
        onClick={handleClick}
        className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-black hover:bg-white/90 rounded-full font-bold uppercase tracking-wider text-sm shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart size={18} className={isWishlisted ? 'fill-current text-red-500' : 'fill-current'} />
        {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
      </motion.button>
    )
  }

  return (
    <button onClick={handleClick} className="text-muted-foreground hover:text-red-500 transition-colors">
      <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
    </button>
  )
}