import { Suspense, useEffect, useState } from "react"
import {Link, useNavigate, useSearchParams} from "react-router-dom"
//import {  } from "next/navigation"
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

type Mode = "login" | "signup"
type Status = "idle" | "submitting" | "success"

type FieldErrors = {
  name?: string
  email?: string
  password?: string
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  )
}

function AuthForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>(
    searchParams.get("mode") === "signup" ? "signup" : "login",
  )
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [feedback, setFeedback] = useState("")
  const isSignup = mode === "signup"

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "signup" ? "signup" : "login"
    setMode(nextMode)
  }, [searchParams])

  function validate() {
    const nextErrors: FieldErrors = {}

    if (isSignup && name.trim().length < 2) {
      nextErrors.name = "Please enter your name."
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address."
    }

    if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters for your password."
    }

    return nextErrors
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus("idle")
      setFeedback("Please fix the highlighted fields to continue.")
      return
    }

    setErrors({})
    setStatus("submitting")
    setFeedback("")

    window.setTimeout(() => {
      setStatus("success")
      setFeedback(
        isSignup
          ? "Account created. We are sending you into your timeline."
          : "You are signed in. We are taking you to your timeline.",
      )
      window.setTimeout(() => navigate("/timeline"), 700)
    }, 800)
  }

  function handleModeSwitch(nextMode: Mode) {
    setMode(nextMode)
    setErrors({})
    setFeedback("")
    setStatus("idle")
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(246,237,120,0.45) 0%, rgba(250,220,225,0.35) 45%, rgba(248,245,227,0) 72%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            to ="/"
            className="flex items-center gap-2 text-accent transition-opacity hover:opacity-80"
          >
            <Sparkles className="size-5" />
            <span className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
              Web Wonders
            </span>
          </Link>
          <p className="mt-3 font-display text-2xl font-semibold text-balance text-foreground">
            {isSignup ? "Join the fictional audience" : "Welcome back"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup
              ? "Create your account to start your timeline."
              : "Sign in to continue your journey."}
          </p>
        </div>

        <div className="rounded-[20px] border border-border/70 bg-card p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <div className="mb-8 flex rounded-[12px] border border-border/70 bg-background/70 p-1">
            <button
              type="button"
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 rounded-[10px] py-2 text-sm font-medium transition-all ${
                !isSignup
                  ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(243,191,95,0.2)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 rounded-[10px] py-2 text-sm font-medium transition-all ${
                isSignup
                  ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(243,191,95,0.2)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {isSignup && (
              <Field label="Full Name" htmlFor="name" error={errors.name}>
                <User className="size-4 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="Satoru Gojo"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
              </Field>
            )}

            <Field label="Email" htmlFor="email" error={errors.email}>
              <Mail className="size-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
            </Field>

            <Field label="Password" htmlFor="password" error={errors.password}>
              <Lock className="size-4 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </Field>

            {!isSignup && (
              <div className="-mt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFeedback("A recovery link will be sent to your email once the inbox is connected.")}
                  className="text-xs font-medium text-accent transition-opacity hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 flex items-center justify-center gap-2 rounded-[12px] bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(243,191,95,0.2)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Please wait…" : isSignup ? "Create Account" : "Sign In"}
              <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {feedback}
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to Web Wonders? "}
            <button
              type="button"
              onClick={() => handleModeSwitch(isSignup ? "login" : "signup")}
              className="font-semibold text-accent transition-opacity hover:opacity-80"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground text-balance">
          By continuing you agree to Web Wonders&apos; Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium tracking-wide text-secondary-foreground uppercase"
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-[12px] border border-border/70 bg-background/70 px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        {children}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
