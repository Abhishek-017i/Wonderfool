import { useState } from 'react'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import SpellLoader from '@/components/ui/SpellLoader'
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';

interface LoginFormProps {
  sharedEmail: string
  onSharedEmailChange: (email: string) => void
  onSuccess: () => void
  onSwitchToSignUp?: () => void
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
  notRegistered?: boolean
}

export default function LoginForm({ sharedEmail, onSharedEmailChange, onSuccess, onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState(sharedEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})
  const setUser = useAuthStore((state) => state.setUser);

  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const validateLogin = (values: { email: string; password: string }): LoginErrors => {
    const newErrors: LoginErrors = {}

    if (!values.email.trim()) {
      newErrors.email = 'Please enter your email.'
    } else if (!validateEmail(values.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!values.password) {
      newErrors.password = 'Please enter your password.'
    }

    return newErrors
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    onSharedEmailChange(value)
    if (errors.email || errors.general) {
      setErrors((prev) => ({ ...prev, email: undefined, general: undefined, notRegistered: false }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password || errors.general) {
      setErrors((prev) => ({ ...prev, password: undefined, general: undefined, notRegistered: false }))
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address to reset password.' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      console.error('RESET PASSWORD ERROR:', err);
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setErrors({ general: 'No account found with this email address.' });
      } else {
        setErrors({ general: err?.message || 'Failed to send reset email. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin({ email, password })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const res = await api.post('/auth/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data, token);
      onSuccess();
    } catch (err: any) {
      console.error('LOGIN ERROR:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential') {
        setErrors({ general: 'Invalid credentials. Please check your email and password.' })
      } else if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setErrors({
          general: 'No account found with this email.',
          notRegistered: true,
        })
      } else if (code === 'auth/wrong-password') {
        setErrors({ password: 'Incorrect password. Please try again.' })
      } else {
        setErrors({
          general: 'Login failed. Please try again.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    setErrors({})
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      const res = await api.post('/auth/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data, token);
      onSuccess();
    } catch (err: any) {
      console.error('GOOGLE LOGIN ERROR:', err);
      setErrors({
        general: 'Google sign-in failed. Please try again or sign up.',
        notRegistered: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
          {errors.notRegistered && onSwitchToSignUp && (
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-xs underline font-semibold hover:opacity-80 shrink-0 ml-2"
            >
              Sign Up
            </button>
          )}
        </div>
      )}

      {resetSent && isForgotPassword && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <span>Password reset email sent! Check your inbox.</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2.5">
        <Label htmlFor="email" className="text-foreground font-semibold text-sm">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="h-11 text-base"
        />
        {errors.email && (
          <div
            id="email-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {!isForgotPassword && (
        <>
          {/* Password */}
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-foreground font-semibold text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="h-11 text-base pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <div
                id="password-error"
                className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end pt-1">
            
              href="#"
              className="text-sm text-primary font-medium hover:text-accent transition-colors"
              onClick={(e) => {
                e.preventDefault()
                if (!isSubmitting) {
                  setIsForgotPassword(true)
                  setErrors({})
                }
              }}
            >
              Forgot password?
            </a>
          </div>
        </>
      )}

      {isForgotPassword && (
        <div className="flex items-center justify-between pt-1">
          
            href="#"
            className="text-sm text-primary font-medium hover:text-accent transition-colors"
            onClick={(e) => {
              e.preventDefault()
              if (!isSubmitting) {
                setIsForgotPassword(false)
                setResetSent(false)
                setErrors({})
              }
            }}
          >
            Back to login
          </a>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold text-base mt-8"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <SpellLoader size={16} />
            {isForgotPassword ? 'Sending…' : 'Authenticating…'}
          </span>
        ) : (
          isForgotPassword ? 'Send Reset Link' : 'Login'
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 pt-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground font-medium">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 pt-1">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleGoogleSignIn}
          className="w-full h-11 font-medium text-base"
        >
          Continue with Google
        </Button>
      </div>
    </form>
  )
}
