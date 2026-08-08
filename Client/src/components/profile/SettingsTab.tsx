import { Moon, Sun, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface SettingsTabProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function SettingsTab({ isDark, setIsDark }: SettingsTabProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Theme Preference */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-foreground mb-4">Theme Preference</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setIsDark(false)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider border transition-all",
              !isDark
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider border transition-all",
              isDark
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </div>

      {/* Session & Logout */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-foreground mb-2">Session</h3>
        <p className="text-xs text-muted-foreground mb-4">Sign out of your Wonderfool account on this device.</p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-all"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  )
}