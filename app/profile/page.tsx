import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { profileTypeLabels, seekingLabels } from '@/lib/validations'
import SignOutButton from './SignOutButton'

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getFullProfile() {
  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) return null

    const userId = authData.user.id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const [profileRes, typesRes, seekingRes, postRes] = await Promise.all([
      db
        .from('profiles')
        .select('first_name, last_name, city, bio, avatar_url, member_number')
        .eq('user_id', userId)
        .single(),
      db
        .from('profile_types')
        .select('type')
        .eq('user_id', userId),
      db
        .from('seeking')
        .select('seeking_type')
        .eq('user_id', userId),
      db
        .from('first_posts')
        .select('content')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle(),
    ])

    if (!profileRes.data) return null

    return {
      profile: profileRes.data,
      types: (typesRes.data ?? []).map((r: any) => r.type),
      seeking: (seekingRes.data ?? []).map((r: any) => r.seeking_type),
      firstPost: postRes.data?.content ?? null,
    }
  } catch {
    return null
  }
}

// ─── Hex avatar (initials) ────────────────────────────────────────────────────
function HexAvatar({
  firstName,
  lastName,
  avatarUrl,
}: {
  firstName: string
  lastName: string
  avatarUrl: string | null
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div
      className="w-24 h-[111px] relative flex items-center justify-center shrink-0"
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: 'linear-gradient(135deg, #ebaf57 0%, #d4912a 100%)',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[3px] flex items-center justify-center"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: '#0d3459',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-heading font-bold text-2xl text-gold select-none">
            {initials}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Read-only pill tag ───────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 text-xs font-medium border border-gold/40 text-gold bg-gold/8">
      {label}
    </span>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/8 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProfilePage() {
  const data = await getFullProfile()

  if (!data) {
    redirect('/onboarding')
  }

  const { profile, types, seeking, firstPost } = data
  const { first_name: firstName, last_name: lastName, city, bio, avatar_url: avatarUrl, member_number: memberNumber } = profile

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Accueil
          </Link>
          <Link
            href="/"
            className="font-heading font-extrabold text-xl tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="text-white">B</span>
            <span className="text-gold">eez</span>
          </Link>
        </div>
        <span className="text-white/30 text-xs">Mon profil</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-lg mx-auto w-full">

        {/* Identity block */}
        <div className="flex items-start gap-5 mb-8">
          <HexAvatar
            firstName={firstName}
            lastName={lastName}
            avatarUrl={avatarUrl}
          />

          <div className="flex-1 min-w-0 pt-1">
            <h1 className="font-heading font-bold text-2xl text-white leading-tight break-words">
              {firstName} {lastName}
            </h1>

            {city && (
              <p className="text-white/40 text-sm mt-0.5">{city}</p>
            )}

            {memberNumber != null && (
              <div className="inline-flex items-center gap-1.5 mt-2 border border-gold/30 bg-gold/8 px-2.5 py-1">
                <span className="text-gold text-xs" aria-hidden="true">✦</span>
                <span className="text-gold text-xs font-bold tracking-wide">
                  Founding Member #{memberNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="bg-navy-950 border border-white/8 p-5 sm:p-6 space-y-5">

          {/* Bio */}
          {bio && (
            <Section title="À propos">
              <p className="text-white/70 text-sm leading-relaxed">{bio}</p>
            </Section>
          )}

          {/* Profile types */}
          {types.length > 0 && (
            <Section title="Je suis">
              <div className="flex flex-wrap gap-2">
                {types.map((t: string) => {
                  const label = profileTypeLabels[t as keyof typeof profileTypeLabels] ?? t
                  return <Pill key={t} label={label} />
                })}
              </div>
            </Section>
          )}

          {/* Seeking */}
          {seeking.length > 0 && (
            <Section title="Je cherche">
              <div className="flex flex-wrap gap-2">
                {seeking.map((s: string) => {
                  const label = seekingLabels[s as keyof typeof seekingLabels] ?? s
                  return <Pill key={s} label={label} />
                })}
              </div>
            </Section>
          )}

          {/* First post */}
          {firstPost && (
            <Section title="Premier post">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {firstPost}
              </p>
            </Section>
          )}

        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled
            className="w-full border border-white/10 text-white/30 font-medium py-3 text-sm cursor-not-allowed"
            title="Bientôt disponible"
          >
            Modifier mon profil
          </button>
          <SignOutButton />
        </div>

      </main>
    </div>
  )
}
