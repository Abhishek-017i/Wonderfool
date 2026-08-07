import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/signup' ? 'signup' : 'login'
  );
  const [sharedEmail, setSharedEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      const from = location.state?.from?.pathname || location.state?.from || '/';
      navigate(from);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 sm:py-16">
          <div className="w-full max-w-sm bg-card rounded-2xl px-8 py-10 sm:px-10 sm:py-12 shadow-sm border border-border">
            <div className="grid w-full grid-cols-2 mb-8 bg-muted p-0 rounded-lg h-10">
              <button
                onClick={() => setActiveTab('login')}
                className={`font-medium text-sm rounded-lg ${activeTab === 'login' ? 'bg-background' : ''}`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`font-medium text-sm rounded-lg ${activeTab === 'signup' ? 'bg-background' : ''}`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' ? (
              <>
                <div className="mb-8">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-foreground tracking-tight">Welcome back</h1>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">Log in to continue to your library.</p>
                </div>
                <LoginForm sharedEmail={sharedEmail} onSharedEmailChange={setSharedEmail} onSuccess={handleLoginSuccess} />
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2 text-foreground tracking-tight">Create an account</h1>
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">Join to start tracking your library.</p>
                </div>
                <SignUpForm sharedEmail={sharedEmail} onSharedEmailChange={setSharedEmail} onSuccess={handleLoginSuccess} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}