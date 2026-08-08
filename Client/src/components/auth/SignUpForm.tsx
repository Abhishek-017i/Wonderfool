import { useState } from 'react'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import SpellLoader from '@/components/ui/SpellLoader'
import { auth, googleProvider } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';

interface SignUpFormProps {
  sharedEmail: string
  onSharedEmailChange: (email: string) => void
  onSuccess: () => void
}

interface SignUpErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  general?: string
}

export default function SignUpForm({ sharedEmail, onSharedEmailChange, onSuccess }: SignUpFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState(sharedEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<SignUpErrors>({})
  const setUser = useAuthStore((state) => state.setUser);
  const [emailOrUsername, setEmailOrUsername] = useState(sharedEmail)

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const validateSignUp = (values: {
    username: string
    email: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
  }): SignUpErrors => {
    const newErrors: SignUpErrors = {}

    if (!values.username.trim()) {
      newErrors.username = 'Please enter a username.'
    }

    if (!values.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!validateEmail(values.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!values.password) {
      newErrors.password = 'Please enter a password.'
    } else if (values.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!values.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service.'
    }

    return newErrors
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    onSharedEmailChange(value)
    if (errors.email || errors.general) {
      setErrors((prev) => ({ ...prev, email: undefined, general: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password || errors.general) {
      setErrors((prev) => ({ ...prev, password: undefined, general: undefined }))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (errors.confirmPassword || errors.general) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined, general: undefined }))
    }
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    if (errors.username || errors.general) {
      setErrors((prev) => ({ ...prev, username: undefined, general: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignUp({ username, email, password, confirmPassword, agreeToTerms })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });

      const token = await userCredential.user.getIdToken(true);
      const res = await api.post('/auth/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data, token);
      onSuccess();
    } catch (err: any) {
      console.error('SIGNUP ERROR:', err);
      let message = 'Failed to create account. Please try again.'
      if (err?.code === 'auth/email-already-in-use') {
        message = 'This email address is already in use.'
      } else if (err?.code === 'auth/weak-password') {
        message = 'Password should be at least 8 characters.'
      } else if (err?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.'
      }
      setErrors({ general: message })
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
      console.error('GOOGLE LOGIN ERROR:', err?.message || err);
      setErrors({ general: 'Google Sign-In failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}
      {/* Username */}
      <div className="space-y-2.5">
        <Label htmlFor="username" className="text-foreground font-semibold text-sm">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
          className="h-11 text-base"
        />
        {errors.username && (
          <div
            id="username-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.username}</span>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2.5">
        <Label htmlFor="signup-email" className="text-foreground font-semibold text-sm">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          className="h-11 text-base"
        />
        {errors.email && (
          <div
            id="signup-email-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2.5">
        <Label htmlFor="signup-password" className="text-foreground font-semibold text-sm">
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
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
            id="signup-password-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2.5">
        <Label htmlFor="confirm-password" className="text-foreground font-semibold text-sm">
          Confirm password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
            className="h-11 text-base pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <div
            id="confirm-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </div>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-2.5 pt-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          disabled={isSubmitting}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed text-foreground">
          I agree to the{' '}
          <a
            href="#"
            className="text-primary font-medium hover:text-accent transition-colors"
            onClick={(e) => {
              e.preventDefault()
              console.log('Terms of Service clicked')
            }}
          >
            Terms of Service
          </a>
        </Label>
      </div>

      {/* Sign Up Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !agreeToTerms}
        className="w-full h-11 font-semibold text-base mt-8"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <SpellLoader size={16} />
            Creating Account...
          </span>
        ) : (
          'Sign Up'
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


