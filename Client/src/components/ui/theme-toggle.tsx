import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'web-wonders-theme'

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement
  // Briefly suspend transitions so the toggle press itself doesn't animate
  // together with every other themed element in a jarring wave.
  root.classList.add('theme-transitions-disabled')
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
  window.localStorage.setItem(STORAGE_KEY, theme)
  window.requestAnimationFrame(() => {
    root.classList.remove('theme-transitions-disabled')
  })
}

/**
 * Polished light/dark toggle. Persists to localStorage and respects the
 * system preference on first visit (handled by the blocking script in
 * layout.tsx, which sets the initial class before hydration).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === null
          ? 'Toggle theme'
          : theme === 'dark'
            ? 'Switch to light mode'
            : 'Switch to dark mode'
      }
      className={cn(
        'relative flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-border/70 bg-card/80 text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] transition-all duration-200 hover:border-accent/35 hover:text-accent',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute size-4 transition-all duration-200',
          theme === 'dark'
            ? 'scale-50 -rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100',
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute size-4 transition-all duration-200',
          theme === 'dark'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-50 rotate-90 opacity-0',
        )}
        aria-hidden
      />
    </button>
  )
}
