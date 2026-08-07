import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, User, Settings, LogOut, Bookmark, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

const STORAGE_KEY = 'web-wonders-theme'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return saved === 'dark'
      return document.documentElement.classList.contains('dark') || true
    }
    return true
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`${API_URL}/series?search=${encodeURIComponent(searchQuery)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.series || [])
        }
      } catch (err) {
        console.error('Navbar search error:', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchExpanded(false)
      setSearchQuery('')
    }
  }

  const getSeriesTitle = (title) => {
    if (!title) return 'Untitled'
    if (typeof title === 'string') return title
    return title.english || title.romaji || title.native || 'Untitled'
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const shouldBeDark = saved ? saved === 'dark' : true
    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
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
      document.documentElement.classList.remove('light')
      localStorage.setItem(STORAGE_KEY, 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem(STORAGE_KEY, 'light')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Community', path: '/community' },
    { name: 'Creators', path: '/creators' },
    { name: 'Timeline', path: '/timeline' },
  ]

  const handleNavClick = (linkPath, e) => {
    if (linkPath === '#') {
      e.preventDefault()
      return
    }
    if (location.pathname === linkPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

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
                onClick={(e) => handleNavClick(link.path, e)}
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
            <form onSubmit={handleSearchSubmit}>
              <motion.div
                className="flex items-center overflow-hidden bg-background/50 border border-border rounded-full backdrop-blur-sm relative z-50"
                animate={{ width: isSearchExpanded ? 260 : 42 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!isSearchExpanded) {
                      e.preventDefault()
                      setIsSearchExpanded(true)
                    }
                  }}
                  className="p-2.5 text-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <Search size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Search series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/50 w-full pl-2 pr-4 font-serif italic"
                />
              </motion.div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchExpanded && searchQuery.trim().length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 w-[280px] bg-card border border-border rounded-xl shadow-xl overflow-hidden py-2 z-50 max-h-[360px] overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Series</span>
                    {isSearching && <span className="text-[10px] lowercase animate-pulse">searching...</span>}
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((series) => (
                      <Link
                        key={series._id}
                        to={`/series/${series._id}`}
                        onClick={() => { setIsSearchExpanded(false); setSearchQuery('') }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-muted/80 transition-colors"
                      >
                        <img
                          src={series.coverImage || series.posterImage || '/media/poster-1.png'}
                          className="w-8 h-10 object-cover rounded bg-muted flex-shrink-0"
                          alt={getSeriesTitle(series.title)}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-semibold truncate text-foreground">{getSeriesTitle(series.title)}</span>
                          <span className="text-xs text-muted-foreground capitalize">{series.type ? series.type.toLowerCase() : 'Series'}</span>
                        </div>
                      </Link>
                    ))
                  ) : !isSearching ? (
                    <div className="px-4 py-3 text-xs text-muted-foreground text-center italic">
                      No series found for "{searchQuery}"
                    </div>
                  ) : null}
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
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all hover:scale-105 focus:outline-none flex-shrink-0"
              title="Go to Profile"
            >
              <img src="/blog/avatar-3.png" alt="User avatar" className="w-full h-full object-cover" />
            </Link>
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
                    onClick={(e) => handleNavClick(link.path, e)}
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
