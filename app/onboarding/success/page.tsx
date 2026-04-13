import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HexBadge from '@/components/ui/HexBadge'

async function getProfileData() {
  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('first_name, member_number')
      .eq('user_id', authData.user.id)
      .single()

    return profile ?? null
  } catch {
    return null
  }
}

export default async function SuccessPage() {
  const profile = await getProfileData()

  if (!profile) {
    redirect('/onboarding')
  }

  const { first_name: firstName, member_number: memberNumber } = profile

  return (
    <div className="min-h-screen bg-navy honeycomb-bg flex flex-col">
      {/* Gradient overlay */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-navy/80 via-transparent to-navy/90" />

      {/* Logo */}
      <header className="relative shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/5 z-10">
        <Link
          href="/"
          className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          ← Accueil
        </Link>
        <span className="font-heading font-extrabold text-xl tracking-tight">
          <span className="text-white">B</span>
          <span className="text-gold">eez</span>
        </span>
      </header>

      {/* Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 z-10 text-center">
        {/* Hex badge */}
        <div className="mb-10 animate-fade-in">
          <HexBadge number={memberNumber ?? undefined} size="lg" />
        </div>

        {/* Welcome message */}
        <div className="animate-slide-up">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Tu es dans la ruche
          </p>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Bienvenue dans la ruche,
            <br />
            <span className="text-gradient">{firstName}</span> ✦
          </h1>

          <p className="text-white/50 max-w-sm mx-auto text-sm sm:text-base leading-relaxed mb-8">
            L'app arrive bientôt. Tu seras notifié en premier.
          </p>
        </div>

        {/* CTA */}
        <div className="animate-slide-up delay-200 w-full max-w-xs space-y-3">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 w-full bg-gold text-navy-900 font-bold px-8 py-4 text-base hover:bg-gold-400 active:bg-gold-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Consulter mon profil
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </Link>

          <Link
            href="/"
            className="block text-sm text-center text-white/30 hover:text-white/50 transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Decorative hexes */}
        <div className="pointer-events-none absolute left-4 top-24 w-10 h-[46px] clip-hex bg-gold/8 hidden md:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-10 top-32 w-14 h-[64px] clip-hex bg-gold/6 hidden md:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-6 bottom-24 w-8 h-[37px] clip-hex bg-gold/5 hidden md:block" aria-hidden="true" />
      </main>
    </div>
  )
}
