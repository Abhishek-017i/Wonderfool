import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import { auth } from '../firebase'
import { Loader2, KeyRound, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const oobCode = searchParams.get('oobCode')

  const [status, setStatus] = useState<'verifying' | 'ready' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!oobCode) {
      setStatus('error')
      setErrorMessage('Invalid or missing reset code.')
      return
    }

    const verifyCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode)
        setEmail(userEmail)
        setStatus('ready')
      } catch (err: any) {
        console.error('Error verifying reset code:', err)
        setStatus('error')
        setErrorMessage(err?.message || 'Invalid or expired reset link. Please request a new one.')
      }
    }

    verifyCode()
  }, [oobCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await confirmPasswordReset(auth, oobCode!, password)
      setStatus('success')
    } catch (err: any) {
      console.error('Error resetting password:', err)
      setErrorMessage(err?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-bold font-serif text-foreground mb-2">Reset Password</h1>
          
          {status === 'verifying' && (
            <p className="text-muted-foreground text-sm">Verifying your reset link...</p>
          )}
          
          {status === 'ready' && (
            <p className="text-muted-foreground text-sm">Enter a new password for <span className="font-semibold text-foreground">{email}</span></p>
          )}

          {status === 'success' && (
            <p className="text-muted-foreground text-sm">Your password has been successfully reset.</p>
          )}

          {status === 'error' && (
            <p className="text-destructive text-sm font-medium">Link expired or invalid</p>
          )}
        </div>

        {status === 'verifying' && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-foreground font-semibold text-sm">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="h-11 text-base pr-10"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold text-base mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} />
            </div>
            <Button onClick={() => navigate('/login')} className="w-full h-12 rounded-xl font-semibold text-base">
              Continue to Login
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <p className="text-muted-foreground text-sm mb-6">{errorMessage}</p>
            <Button onClick={() => navigate('/login')} className="w-full h-11 rounded-xl font-semibold text-base">
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
