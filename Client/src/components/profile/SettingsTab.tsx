import { Moon, Sun, LogOut, CheckCircle, Mail, AlertCircle, KeyRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase'

interface SettingsTabProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export default function SettingsTab({ isDark, setIsDark }: SettingsTabProps) {
  const { logout, isEmailVerified, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleResendVerification = async () => {
    if (!auth.currentUser || sending) return
    setSending(true)
    try {
      await sendEmailVerification(auth.currentUser)
      setSent(true)
    } catch (error) {
      console.error("Error sending verification email", error)
    } finally {
      setSending(false)
    }
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

      {/* Account Status */}
      {isAuthenticated && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-bold font-serif text-foreground mb-2">Account Status</h3>
          
          <div className="mt-4 flex items-center justify-between p-4 rounded-xl border bg-background/50">
            <div className="flex items-center gap-3">
              {isEmailVerified ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle size={20} />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                  <AlertCircle size={20} />
                </div>
              )}
              
              <div>
                <p className="font-semibold text-sm text-foreground">Email Verification</p>
                <p className="text-xs text-muted-foreground">
                  {isEmailVerified 
                    ? "Verified \u2713" 
                    : "Not verified — please verify to access all features"}
                </p>
              </div>
            </div>

            {!isEmailVerified && (
              <button
                onClick={handleResendVerification}
                disabled={sending || sent}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold text-xs transition-colors hover:bg-primary/20 disabled:opacity-50"
              >
                <Mail size={14} />
                {sent ? 'Link Sent' : sending ? 'Sending...' : 'Resend Link'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Security */}
      {isAuthenticated && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-bold font-serif text-foreground mb-2">Security</h3>
          <p className="text-xs text-muted-foreground mb-4">Manage your account security and password.</p>
          <button
            onClick={async () => {
              if (auth.currentUser?.email) {
                try {
                  await sendPasswordResetEmail(auth, auth.currentUser.email)
                  alert('Password reset email sent! Check your inbox.')
                } catch (error) {
                  console.error('Error sending reset email:', error)
                  alert('Failed to send reset email.')
                }
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-all"
          >
            <KeyRound size={16} />
            Change Password
          </button>
        </div>
      )}

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