import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from '@/components/auth/LoginForm'
import SignUpForm from '@/components/auth/SignUpForm'
import SuccessToast from '@/components/auth/SuccessToast'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const location = useLocation()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(
    location.pathname === '/signup' ? 'signup' : 'login'
  )
  const [sharedEmail, setSharedEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Update tab based on route
    if (location.pathname === '/signup') {
      setActiveTab('signup')
    } else {
      setActiveTab('login')
    }
  }, [location.pathname])

  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      const from = location.state?.from?.pathname || location.state?.from || '/timeline'
      login(from)
    }, 1500)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2.5 rounded-full hover:bg-muted border border-border/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-card rounded-2xl p-8 sm:p-10 shadow-lg border border-border mt-10 sm:mt-0">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-0 rounded-lg h-10">
            <TabsTrigger value="login" className="font-medium text-sm">Login</TabsTrigger>
            <TabsTrigger value="signup" className="font-medium text-sm">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-foreground tracking-tight">
                Welcome back
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Log in to continue to your library.
              </p>
            </div>
            <LoginForm
              sharedEmail={sharedEmail}
              onSharedEmailChange={setSharedEmail}
              onSuccess={handleLoginSuccess}
              onSwitchToSignUp={() => setActiveTab('signup')}
            />
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-foreground tracking-tight">
                Create an account
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                Join to start tracking your library.
              </p>
            </div>
            <SignUpForm
              sharedEmail={sharedEmail}
              onSharedEmailChange={setSharedEmail}
              onSuccess={handleLoginSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Toast */}
      <SuccessToast show={showSuccess} />
    </div>
  )
}
