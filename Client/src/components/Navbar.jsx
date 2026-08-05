import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Moon, Sun, User, Settings, LogOut, Bookmark, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Community', path: '/community' },
    // { name: 'Genre', path: '#' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Profile', path: '/profile' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled ? 'glass-panel py-3 border-border/50' : 'bg-transparent py-5 border-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <button 
            className="md:hidden text-foreground p-1" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-3xl font-serif font-bold text-gradient tracking-wider">
            Wonderfool
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex gap-10 items-center justify-center flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || location.hash === link.path
            return (
              <Link
                key={link.name}
                to={link.path}
                title={link.path === '#' ? 'Coming Soon' : undefined}
                onClick={link.path === '#' ? (e) => e.preventDefault() : undefined}
                className="relative group text-sm font-semibold text-foreground hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full opacity-50" />
              </Link>
            )
          })}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative flex items-center hidden sm:flex" ref={searchRef}>
            <motion.div
              className="flex items-center overflow-hidden bg-background/50 border border-border rounded-full backdrop-blur-sm relative z-50"
              animate={{ width: isSearchExpanded ? 260 : 42 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="p-2.5 text-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                <Search size={18} />
              </button>
              <input
                type="text"
                placeholder="Search series or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/50 w-full pl-2 pr-4 font-serif italic"
              />
            </motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchExpanded && searchQuery.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 w-[260px] bg-card border border-border rounded-xl shadow-xl overflow-hidden py-2 z-50"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Series</div>
                  <Link
                    to="/series/1"
                    onClick={() => { setIsSearchExpanded(false); setSearchQuery('') }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <img src="/media/poster-1.png" className="w-8 h-10 object-cover rounded" alt="Attack on Titan" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate">Attack on Titan</span>
                      <span className="text-xs text-muted-foreground">Anime</span>
                    </div>
                  </Link>
                  <div className="h-px bg-border my-1 mx-2" />
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Users</div>
                  <Link
                    to="/profile"
                    onClick={() => { setIsSearchExpanded(false); setSearchQuery('') }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-full object-cover" alt="User" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate">Alex Chen</span>
                      <span className="text-xs text-muted-foreground">@alexc</span>
                    </div>
                  </Link>
                  <div className="h-px bg-border my-1 mx-2" />
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Creators</div>
                  <Link
                    to="/creator/1"
                    onClick={() => { setIsSearchExpanded(false); setSearchQuery('') }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <img src="/blog/avatar-3.png" className="w-8 h-8 rounded-full object-cover" alt="Creator" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold truncate">Akira Toriyama</span>
                      <span className="text-xs text-muted-foreground text-accent">Character Designer</span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full hover:bg-foreground/5 transition-colors text-foreground hover:text-primary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors focus:outline-none"
              >
                <img src="/blog/avatar-3.png" alt="User avatar" className="w-full h-full object-cover" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/profile?tab=settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Bookmark size={16} /> Wishlist
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground border border-border hover:shadow-[0_0_20px_rgba(244,216,69,0.3)] transition-all font-bold px-7 uppercase tracking-wider text-xs"
              size="sm"
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || location.hash === link.path
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-semibold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'} transition-colors`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-border">
                  <Button
                    className="w-full bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground border border-border hover:shadow-[0_0_20px_rgba(244,216,69,0.3)] transition-all font-bold uppercase tracking-wider text-xs"
                    size="sm"
                    asChild
                  >
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
