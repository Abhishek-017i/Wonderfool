import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    { name: 'Community', path: '/community' },
    { name: 'Genre', path: '#' },
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
        <div className="flex-shrink-0">
          <Link to="/" className="text-3xl font-cinzel font-bold text-gradient tracking-wider">
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
          <div className="relative flex items-center hidden sm:flex">
            <motion.div 
              className="flex items-center overflow-hidden bg-background/50 border border-border rounded-full backdrop-blur-sm"
              animate={{ width: isSearchExpanded ? 220 : 42 }}
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
                placeholder="Search series..."
                className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground/50 w-full pl-2 pr-4 font-serif italic"
                onBlur={() => setIsSearchExpanded(false)}
              />
            </motion.div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full hover:bg-foreground/5 transition-colors text-foreground hover:text-primary"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Login Button */}
          <Button 
            className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-accent via-secondary to-primary text-secondary-foreground border border-white/20 hover:shadow-[0_0_20px_rgba(244,216,69,0.3)] transition-all font-bold px-7 uppercase tracking-wider text-xs" 
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}
