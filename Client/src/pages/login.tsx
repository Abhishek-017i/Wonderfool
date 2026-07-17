import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from '@/components/auth/LoginForm'
import SignUpForm from '@/components/auth/SignUpForm'
import BrandingPanel from '@/components/auth/BrandingPanel'
import MobileHeader from '@/components/auth/MobileHeader'
import SuccessToast from '@/components/auth/SuccessToast'

export default function AuthPage() {
  const location = useLocation()
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
      navigate('/timeline')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen">
      {/* Branding Panel - Hidden on mobile */}
      <BrandingPanel />

      {/* Form Area */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col bg-background">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 sm:py-16">
          <div className="w-full max-w-sm bg-card rounded-2xl px-8 py-10 sm:px-10 sm:py-12 shadow-sm border border-border">
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
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <SuccessToast show={showSuccess} />
    </div>
  )
}
