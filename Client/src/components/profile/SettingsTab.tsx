import { useState } from 'react'
import { ChevronDown, Moon, Sun, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Toast from './Toast'
import { cn } from '@/lib/utils'

interface SettingsTabProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function SettingsTab({ isDark, setIsDark }: SettingsTabProps) {
  const [email, setEmail] = useState('alex.rivera@example.com')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleSaveSettings = () => {
    showToast('Settings saved successfully')
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters')
      return
    }
    showToast('Password changed successfully')
    setNewPassword('')
    setConfirmPassword('')
    setPasswordOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Account Info */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-foreground mb-4">Account Information</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground mt-1.5">We&apos;ll only use this for account recovery</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="self-start px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <button
          onClick={() => setPasswordOpen(!passwordOpen)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <h3 className="text-xl font-bold font-serif text-foreground">Change Password</h3>
          <ChevronDown
            size={20}
            className={cn("text-muted-foreground transition-transform duration-200", passwordOpen && "rotate-180 text-primary")}
          />
        </button>

        {passwordOpen && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded border-border text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
              />
              <span>Show password</span>
            </label>
            <button
              onClick={handleChangePassword}
              className="self-start px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-all"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-foreground mb-4">Notifications</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="rounded border-border text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about your account activity</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              className="rounded border-border text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified on your device</p>
            </div>
          </label>
        </div>
      </div>

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

      {toast && <Toast message={toast} />}
    </div>
  )
}
