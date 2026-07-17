import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

interface User {
  id: string
  name: string
  handle: string
  avatar: string
  isFollowing: boolean
}

interface UsersModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  users: User[]
}

export default function UsersModal({ isOpen, onClose, title, users }: UsersModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold font-serif">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 bg-background"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users found.</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-3">
                  <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0 group" onClick={onClose}>
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full object-cover border border-border group-hover:border-primary transition-colors"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{user.name}</span>
                      <span className="text-sm text-muted-foreground truncate">{user.handle}</span>
                    </div>
                  </Link>
                  <Button 
                    variant={user.isFollowing ? "outline" : "default"}
                    size="sm"
                    className={`rounded-full px-4 h-8 text-xs font-bold ${
                      user.isFollowing ? 'hover:text-destructive hover:border-destructive hover:bg-destructive/10' : ''
                    }`}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
