'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/ui/Logo'

// ─── French error messages ────────────────────────────────────────────────────
function friendlyError(message: string): string {
  if (message.includes('Invalid login credentials'))
    return 'Email ou mot de passe incorrect.'
  if (message.includes('Email not confirmed'))
    return 'Confirme ton email avant de te connecter.'
  if (message.includes('too many requests') || message.includes('rate limit'))
    return 'Trop de tentatives. Réessaie dans quelques minutes.'
  if (message.includes('network') || message.includes('fetch'))
    return 'Erreur réseau. Vérifie ta connexion.'
  return 'Une erreur est survenue. Réessaie.'
}

// ─── Google icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignInPage() {
  const router = useRouter()
  const supabase = createClient()

  const [ready, setReady] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Redirect immediately if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/profile')
      } else {
        setReady(true)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoogle = async () => {
    setOauthLoading(true)
    setError('')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.joinbeez.com'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=/profile`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      setError(friendlyError(error.message))
      setOauthLoading(false)
    }
    // On success the browser navigates away — no need to reset loading
  }

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Remplis tous les champs.')
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError(friendlyError(error.message))
      setEmailLoading(false)
      return
    }

    router.replace('/profile')
  }

  // Blank until session check resolves — no flash of the sign-in form
  if (!ready) return null

  const anyLoading = oauthLoading || emailLoading

  return (
    <div className="min-h-screen bg-navy honeycomb-bg flex flex-col">
      {/* Header */}
      <header
        className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/6 backdrop-blur-md"
        style={{ background: 'rgba(8,43,68,0.92)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Accueil
          </Link>
          <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <Logo height={36} />
          </Link>
        </div>
        <Link
          href="/onboarding"
          className="text-sm text-white/40 hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          Créer un compte
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-2xl text-white mb-1">
              Content de te revoir.
            </h1>
            <p className="text-white/40 text-sm">
              Connecte-toi pour accéder à ton profil.
            </p>
          </div>

          {/* Card */}
          <div className="card p-6 sm:p-8 space-y-4">

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={anyLoading}
              className="w-full flex items-center gap-3 rounded-beez border border-white/10 px-4 py-3.5 text-sm font-medium text-white hover:border-white/25 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {oauthLoading ? (
                <svg className="animate-spin h-[18px] w-[18px] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <GoogleIcon />
              )}
              Continuer avec Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="toi@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={anyLoading}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  className="w-full rounded-beez border border-white/10 hover:border-white/20 text-white placeholder-white/30 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:border-gold focus:[box-shadow:0_0_0_3px_rgba(235,175,87,0.1)] disabled:opacity-40"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-white/70">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  disabled={anyLoading}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  className="w-full rounded-beez border border-white/10 hover:border-white/20 text-white placeholder-white/30 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:border-gold focus:[box-shadow:0_0_0_3px_rgba(235,175,87,0.1)] disabled:opacity-40"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={anyLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez px-6 py-3.5 text-base transition-all duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {emailLoading ? (
                  <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                Se connecter
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-white/30">
            Pas encore de compte ?{' '}
            <Link
              href="/onboarding"
              className="text-gold hover:text-gold-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Rejoindre la ruche →
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}
