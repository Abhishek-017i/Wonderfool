import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { applyActionCode } from 'firebase/auth'
import { auth } from '../firebase'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const oobCode = searchParams.get('oobCode')
  const { reloadAuth } = useAuth()

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!oobCode) {
      setStatus('error')
      setErrorMessage('Invalid or missing verification code.')
      return
    }

    const verifyEmail = async () => {
      try {
        await applyActionCode(auth, oobCode)
        await reloadAuth()
        setStatus('success')
      } catch (err: any) {
        console.error('Error verifying email:', err)
        setStatus('error')
        setErrorMessage(err?.message || 'Failed to verify email. The link may have expired or already been used.')
      }
    }

    verifyEmail()
  }, [oobCode])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h1 className="text-2xl font-bold font-serif text-foreground mb-3">Verifying your email</h1>
            <p className="text-muted-foreground text-sm">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold font-serif text-foreground mb-3">Email Verified!</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Your email address has been successfully verified. You now have full access to all Wonderfool features.
            </p>
            <Button onClick={() => navigate('/')} className="w-full h-12 rounded-xl font-semibold text-base">
              Go to Homepage
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold font-serif text-foreground mb-3">Verification Failed</h1>
            <p className="text-destructive text-sm mb-8">{errorMessage}</p>
            <Button onClick={() => navigate('/login')} className="w-full h-12 rounded-xl font-semibold text-base">
              Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
