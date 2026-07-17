import { useState } from 'react'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface LoginFormProps {
  sharedEmail: string
  onSharedEmailChange: (email: string) => void
  onSuccess: () => void
}

interface LoginErrors {
  emailOrUsername?: string
  password?: string
}

export default function LoginForm({ sharedEmail, onSharedEmailChange, onSuccess }: LoginFormProps) {
  const [emailOrUsername, setEmailOrUsername] = useState(sharedEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  const validateLogin = (values: { emailOrUsername: string; password: string }): LoginErrors => {
    const newErrors: LoginErrors = {}

    if (!values.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Please enter your email or username.'
    }

    if (!values.password) {
      newErrors.password = 'Please enter your password.'
    }

    return newErrors
  }

  const handleEmailChange = (value: string) => {
    setEmailOrUsername(value)
    onSharedEmailChange(value)
    if (errors.emailOrUsername) {
      setErrors((prev) => ({ ...prev, emailOrUsername: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateLogin({ emailOrUsername, password })
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email or Username */}
      <div className="space-y-2.5">
        <Label htmlFor="email-username" className="text-foreground font-semibold text-sm">
          Email or username
        </Label>
        <Input
          id="email-username"
          type="text"
          placeholder="you@example.com"
          value={emailOrUsername}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isSubmitting}
          aria-invalid={!!errors.emailOrUsername}
          aria-describedby={errors.emailOrUsername ? 'email-error' : undefined}
          className="h-11 text-base"
        />
        {errors.emailOrUsername && (
          <div
            id="email-error"
            className="flex items-center gap-1.5 text-destructive text-xs mt-1.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.emailOrUsername}</span>
          </div>
        )}
      </div>

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

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isSubmitting}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-foreground">
            Remember me
          </Label>
        </div>
        <a
          href="#"
          className="text-sm text-primary font-medium hover:text-accent transition-colors"
          onClick={(e) => {
            e.preventDefault()
            if (!isSubmitting) {
              console.log('Forgot password clicked')
            }
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold text-base mt-8"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Authenticating…
          </>
        ) : (
          'Login'
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
          onClick={() => console.log('Continue with Google')}
          className="w-full h-11 font-medium text-base"
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => console.log('Continue with Discord')}
          className="w-full h-11 font-medium text-base"
        >
          Continue with Discord
        </Button>
      </div>
    </form>
  )
}
