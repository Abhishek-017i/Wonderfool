import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b" style={{ borderBottomColor: 'var(--border)' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-bold text-primary">
            Wonderfool
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex gap-8 items-center justify-center flex-1">
          <Link to="#community" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="#community" className="text-foreground hover:text-primary transition-colors">
            Community
          </Link>
          <Link to="#genre" className="text-foreground hover:text-primary transition-colors">
            Genre
          </Link>
          <Link to="#timeline" className="text-foreground hover:text-primary transition-colors">
            Timeline
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-card border rounded-lg px-3 py-2" style={{ borderColor: 'var(--border)' }}>
            <Search size={18} className="text-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent border-none outline-none w-32 text-foreground placeholder-foreground/50"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-card border hover:bg-primary/10 transition-colors"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>

          {/* Login Button */}
          <Button variant="default" className="hidden sm:inline-flex">
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}
