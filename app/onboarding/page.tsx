'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import PillTag from '@/components/ui/PillTag'
import { createClient } from '@/lib/supabase/client'
import {
  emailAuthSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  profileTypeValues,
  seekingValues,
  profileTypeLabels,
  seekingLabels,
  type EmailAuthInput,
  type Step1Input,
} from '@/lib/validations'

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthMethod = 'google' | 'email' | undefined

type OnboardingData = {
  firstName: string
  lastName: string
  city: string
  bio: string
  avatarFile: File | null
  types: (typeof profileTypeValues)[number][]
  seeking: (typeof seekingValues)[number][]
  post: string
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total} aria-label={`Étape ${step} sur ${total}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/40 text-xs">
          Étape {step}/{total}
        </span>
        <span className="text-gold text-xs font-medium">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="h-0.5 bg-white/10 w-full">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ─── Auth Step ────────────────────────────────────────────────────────────────
function AuthStep({ onEmailAuth }: { onEmailAuth: () => void }) {
  const [method, setMethod] = useState<AuthMethod>(undefined)
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof EmailAuthInput, string>>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const supabase = createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const handleOAuth = async (provider: 'google') => {
    setLoading(true)
    setServerError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        ...(provider === 'google' && {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }),
      },
    })
    if (error) {
      setServerError(error.message)
      setLoading(false)
    }
    // Redirect happens automatically
  }

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setServerError('')

    const result = emailAuthSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EmailAuthInput, string>> = {}
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof EmailAuthInput
        if (!fieldErrors[key]) fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      setServerError(
        error.message === 'User already registered'
          ? 'Un compte avec cet email existe déjà.'
          : error.message
      )
      setLoading(false)
      return
    }

    // Success — proceed to step 1
    onEmailAuth()
  }

  return (
    <div className="space-y-4">
      <p className="text-white/50 text-sm text-center mb-6">
        Choisis comment rejoindre la ruche.
      </p>

      {/* OAuth buttons */}
      {method !== 'email' && (
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="w-full flex items-center gap-3 border border-white/10 bg-navy-950 px-4 py-3.5 text-sm font-medium text-white hover:border-white/25 hover:bg-navy-800 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={() => setMethod('email')}
            className="w-full text-sm text-white/50 hover:text-gold transition-colors duration-200 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Continuer avec email et mot de passe
          </button>
        </div>
      )}

      {/* Email form */}
      {method === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="toi@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            required
            autoComplete="email"
            autoFocus
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Min. 8 car., 1 majuscule, 1 chiffre"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Répète ton mot de passe"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirmPassword: e.target.value }))
            }
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          {serverError && (
            <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2" role="alert">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Créer mon compte
          </Button>

          <button
            type="button"
            onClick={() => setMethod(undefined)}
            className="w-full text-sm text-white/40 hover:text-white/60 transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Retour
          </button>
        </form>
      )}
    </div>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function Step1({
  data,
  onUpdate,
}: {
  data: Pick<OnboardingData, 'firstName' | 'lastName' | 'city' | 'bio' | 'avatarFile'>
  onUpdate: (partial: Partial<OnboardingData>) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Input, string>>>({})
  const [avatarError, setAvatarError] = useState('')

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Max 5 MB')
      return
    }
    setAvatarError('')
    onUpdate({ avatarFile: file })
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  // Exposed validate fn via callback — parent calls it before proceeding
  const validate = useCallback((): boolean => {
    const result = step1Schema.safeParse({
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      bio: data.bio,
    })
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Step1Input, string>> = {}
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof Step1Input
        if (!fieldErrors[key]) fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }, [data])

  // Attach validate to parent via DOM trick — simpler: we pass it up
  // Actually we'll use a ref pattern in the parent. For simplicity,
  // expose validate on a hidden button id that parent can trigger.

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-16 h-[74px] clip-hex bg-navy-800 border border-white/10 hover:border-gold/40 transition-colors flex items-center justify-center overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Changer la photo de profil"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Aperçu de ta photo"
              className="w-full h-full object-cover"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="#ffffff50" strokeWidth="1.5" />
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#ffffff50" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          )}
        </button>
        <div>
          <p className="text-sm text-white/70 font-medium">Photo de profil</p>
          <p className="text-xs text-white/30 mt-0.5">Optionnel · JPG, PNG, max 5 MB</p>
          {avatarError && (
            <p className="text-xs text-red-400 mt-0.5" role="alert">{avatarError}</p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
            aria-label="Sélectionner une photo de profil"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Prénom"
          value={data.firstName}
          onChange={(e) => onUpdate({ firstName: e.target.value })}
          error={errors.firstName}
          required
          autoComplete="given-name"
          autoFocus
        />
        <Input
          label="Nom"
          value={data.lastName}
          onChange={(e) => onUpdate({ lastName: e.target.value })}
          error={errors.lastName}
          required
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Ville"
        value={data.city}
        onChange={(e) => onUpdate({ city: e.target.value })}
        error={errors.city}
        required
        placeholder="Paris"
        autoComplete="address-level2"
      />

      <Textarea
        label="Une phrase sur toi"
        value={data.bio}
        onChange={(e) => onUpdate({ bio: e.target.value })}
        error={errors.bio}
        required
        placeholder="Ex : Je construis un outil SaaS pour les freelances depuis 6 mois."
        rows={3}
        maxLength={120}
        charCount={data.bio.length}
        maxChars={120}
      />

      {/* Hidden validate trigger */}
      <button
        id="step1-validate"
        type="button"
        onClick={validate}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function Step2({
  selected,
  onToggle,
}: {
  selected: (typeof profileTypeValues)[number][]
  onToggle: (value: (typeof profileTypeValues)[number]) => void
}) {
  return (
    <div>
      <p className="text-white/50 text-sm mb-5">
        Sélectionne tout ce qui te correspond. Tu pourras modifier plus tard.
      </p>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Type de profil">
        {profileTypeValues.map((value) => (
          <PillTag
            key={value}
            label={profileTypeLabels[value]}
            selected={selected.includes(value)}
            onToggle={() => onToggle(value)}
          />
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-red-400 text-sm mt-3" role="alert">
          Sélectionne au moins un profil.
        </p>
      )}
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function Step3({
  selected,
  onToggle,
}: {
  selected: (typeof seekingValues)[number][]
  onToggle: (value: (typeof seekingValues)[number]) => void
}) {
  return (
    <div>
      <p className="text-white/50 text-sm mb-2">
        Beez te notifiera quand quelqu'un correspond.
      </p>
      <p className="text-white/30 text-xs mb-5">Multi-sélection possible.</p>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Ce que tu cherches">
        {seekingValues.map((value) => (
          <PillTag
            key={value}
            label={seekingLabels[value]}
            selected={selected.includes(value)}
            onToggle={() => onToggle(value)}
          />
        ))}
      </div>
      {selected.length === 0 && (
        <p className="text-red-400 text-sm mt-3" role="alert">
          Sélectionne au moins une option.
        </p>
      )}
    </div>
  )
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────
function Step4({
  post,
  onUpdate,
  firstName,
  onSkip,
}: {
  post: string
  onUpdate: (value: string) => void
  firstName: string
  onSkip: () => void
}) {
  const MAX = 280

  return (
    <div className="space-y-4">
      <p className="text-white/50 text-sm">
        Dis bonjour à la ruche,{firstName ? ` ${firstName}` : ''} ! Ce post sera
        visible par les autres membres.
      </p>

      <Textarea
        value={post}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Raconte-nous où tu en es…"
        rows={5}
        maxLength={MAX}
        charCount={post.length}
        maxChars={MAX}
        aria-label="Ton premier post"
      />

      {/* Suggestion prompts */}
      <div className="space-y-1.5 border-l-2 border-gold/30 pl-4">
        <p className="text-xs text-white/30 font-medium mb-2">Besoin d'inspiration ?</p>
        {[
          'Quel problème tu résous et pour qui ?',
          'Où en est ton projet aujourd&aposhui ?',
          'Pourquoi tu t&aposes lancé ?',
        ].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() =>
              onUpdate(post ? `${post}\n→ ${prompt}` : `→ ${prompt}`)
            }
            className="block text-xs text-white/40 hover:text-gold transition-colors text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            → {prompt}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="text-sm text-white/30 hover:text-white/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Passer cette étape →
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default  function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  // 0 = auth, 1-4 = onboarding steps
  const [phase, setPhase] = useState<'auth' | 1 | 2 | 3 | 4>('auth')
  const [sessionChecked, setSessionChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // On mount: if a session already exists (e.g. returning from OAuth),
  // skip the auth step and jump straight to the profile form.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPhase(1)
      setSessionChecked(true)
    })
  // supabase is stable — created once outside the effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    city: '',
    bio: '',
    avatarFile: null,
    types: [],
    seeking: [],
    post: '',
  })

  const update = useCallback(
    (partial: Partial<OnboardingData>) =>
      setData((prev) => ({ ...prev, ...partial })),
    []
  )

  const toggleType = useCallback(
    (value: (typeof profileTypeValues)[number]) => {
      setData((prev) => ({
        ...prev,
        types: prev.types.includes(value)
          ? prev.types.filter((t) => t !== value)
          : [...prev.types, value],
      }))
    },
    []
  )

  const toggleSeeking = useCallback(
    (value: (typeof seekingValues)[number]) => {
      setData((prev) => ({
        ...prev,
        seeking: prev.seeking.includes(value)
          ? prev.seeking.filter((s) => s !== value)
          : [...prev.seeking, value],
      }))
    },
    []
  )

  // Validate current step before advancing
  const validateAndAdvance = () => {
    if (phase === 1) {
      // Trigger the hidden button in Step1 which calls validate()
      const btn = document.getElementById('step1-validate') as HTMLButtonElement
      btn?.click()

      const result = step1Schema.safeParse({
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        bio: data.bio,
      })
      if (!result.success) return
      setPhase(2)
    } else if (phase === 2) {
      const result = step2Schema.safeParse({ types: data.types })
      if (!result.success) return
      setPhase(3)
    } else if (phase === 3) {
      const result = step3Schema.safeParse({ seeking: data.seeking })
      if (!result.success) return
      setPhase(4)
    }
  }

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/avatar.${ext}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    return urlData.publicUrl
  }

  // Submit all onboarding data
  const submit = async (skipPost = false) => {
    setLoading(true)
    setServerError('')

    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user

      if (!user) {
        setServerError('Session expirée. Recharge la page.')
        setLoading(false)
        return
      }

      // Upload avatar if present
      let avatarUrl: string | null = null
      if (data.avatarFile) {
        avatarUrl = await uploadAvatar(user.id, data.avatarFile)
      }

      // Insert profile
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        city: data.city,
        bio: data.bio,
        avatar_url: avatarUrl,
      } as any)

      if (profileError) throw profileError

      // Insert profile types
      if (data.types.length > 0) {
        const { error: typesError } = await supabase.from('profile_types').insert(
          data.types.map((type) => ({ user_id: user.id, type })) as any
        )
        if (typesError) throw typesError
      }

      // Insert seeking
      if (data.seeking.length > 0) {
        const { error: seekingError } = await supabase.from('seeking').insert(
          data.seeking.map((seeking_type) => ({
            user_id: user.id,
            seeking_type,
          })) as any
        )
        if (seekingError) throw seekingError
      }

      // Insert first post (optional)
      if (!skipPost && data.post.trim()) {
        const postResult = step4Schema.safeParse({ post: data.post })
        if (postResult.success) {
          await supabase.from('first_posts').insert({
            user_id: user.id,
            content: data.post.trim(),
          } as any)
          // Non-critical — don't throw on post error
        }
      }

      router.push('/onboarding/success')
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Une erreur est survenue.'
      setServerError(msg)
      setLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  // Hold render until session check resolves — prevents flash of auth screen
  // for users who already completed OAuth and are returning to /onboarding.
  if (!sessionChecked) return null

  const stepLabels = [
    'Qui es-tu ?',
    'Tu es…',
    'Tu cherches…',
    'Dis bonjour à la ruche',
  ]

  const isOnboarding = phase !== 'auth'
  const stepNumber = isOnboarding ? (phase as number) : 0

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Logo bar */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/5">
        <span className="font-heading font-extrabold text-xl tracking-tight">
          <span className="text-white">B</span>
          <span className="text-gold">eez</span>
        </span>
        {isOnboarding ? (
          <span className="text-white/30 text-xs">
            {stepLabels[(stepNumber as number) - 1]}
          </span>
        ) : (
          <Link
            href="/signin"
            className="text-sm text-white/40 hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Se connecter
          </Link>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Progress (onboarding steps only) */}
          {isOnboarding && (
            <div className="mb-8">
              <ProgressBar step={stepNumber as number} total={4} />
            </div>
          )}

          {/* Card */}
          <div className="bg-navy-950 border border-white/8 p-6 sm:p-8">
            {/* Auth phase */}
            {phase === 'auth' && (
              <>
                <h1 className="font-heading font-bold text-2xl text-white mb-1">
                  Rejoins la ruche.
                </h1>
                <p className="text-white/40 text-sm mb-6">
                  Crée ton compte pour commencer.
                </p>
                <AuthStep onEmailAuth={() => setPhase(1)} />
              </>
            )}

            {/* Step 1 */}
            {phase === 1 && (
              <>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  Qui es-tu ?
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Ton profil public · visible par la communauté.
                </p>
                <Step1 data={data} onUpdate={update} />
              </>
            )}

            {/* Step 2 */}
            {phase === 2 && (
              <>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  Tu es…
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Sélectionne ton ou tes profils.
                </p>
                <Step2 selected={data.types} onToggle={toggleType} />
              </>
            )}

            {/* Step 3 */}
            {phase === 3 && (
              <>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  Tu cherches…
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Le matching passif, c'est ici que ça se passe.
                </p>
                <Step3 selected={data.seeking} onToggle={toggleSeeking} />
              </>
            )}

            {/* Step 4 */}
            {phase === 4 && (
              <>
                <h2 className="font-heading font-bold text-2xl text-white mb-1">
                  Dis bonjour à la ruche
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  Ton premier post — optionnel mais recommandé.
                </p>
                <Step4
                  post={data.post}
                  onUpdate={(value) => update({ post: value })}
                  firstName={data.firstName}
                  onSkip={() => submit(true)}
                />
              </>
            )}

            {/* Server error */}
            {serverError && (
              <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2 mt-4" role="alert">
                {serverError}
              </p>
            )}

            {/* Actions */}
            {isOnboarding && (
              <div className="mt-6 flex flex-col gap-3">
                {phase < 4 ? (
                  <Button
                    onClick={validateAndAdvance}
                    fullWidth
                    size="lg"
                    disabled={
                      (phase === 2 && data.types.length === 0) ||
                      (phase === 3 && data.seeking.length === 0)
                    }
                  >
                    Continuer
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </Button>
                ) : (
                  <Button
                    onClick={() => submit(false)}
                    loading={loading}
                    fullWidth
                    size="lg"
                    disabled={data.post.length > 280}
                  >
                    Rejoindre la ruche ✦
                  </Button>
                )}

                {/* Back button */}
                {(phase as number) > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPhase((prev) => ((prev as number) - 1) as 1 | 2 | 3 | 4)
                    }
                    className="text-sm text-white/30 hover:text-white/50 transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    ← Retour
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
