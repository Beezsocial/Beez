import type { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

// ─── Member count from Supabase ───────────────────────────────────────────────
async function getMemberCount(): Promise<number> {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}

// ─── Icons (inline SVG, no external dep) ─────────────────────────────────────
function IconBolt() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" stroke="#ebaf57" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
function IconTarget() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#ebaf57" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="#ebaf57" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="#ebaf57" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#ebaf57" strokeWidth="1.5" strokeLinecap="square" />
      <circle cx="9" cy="7" r="4" stroke="#ebaf57" strokeWidth="1.5" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#ebaf57" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2Z" stroke="#ebaf57" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#ebaf57" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group border border-white/8 bg-navy-950 p-6 hover:border-gold/30 transition-all duration-300">
      <div className="mb-4 w-10 h-10 flex items-center justify-center border border-gold/20 bg-navy-900 group-hover:border-gold/50 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-white text-lg mb-2">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({
  tier,
  subtitle,
  features,
  highlighted = false,
}: {
  tier: string
  subtitle: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className={[
        'p-6 border transition-all duration-300',
        highlighted
          ? 'border-gold/50 bg-navy-950 relative'
          : 'border-white/8 bg-navy-950 hover:border-white/20',
      ].join(' ')}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 bg-gold text-navy-900 text-xs font-bold px-3 py-1 uppercase tracking-wider">
          Populaire
        </span>
      )}
      <div className="mb-4">
        <h3 className="font-heading font-bold text-white text-xl">{tier}</h3>
        <p className="text-white/50 text-sm mt-1">{subtitle}</p>
      </div>
      <div className="my-4 border-t border-white/8" />
      <ul className="space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/70">
            <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <span className="text-white/30 text-sm font-medium uppercase tracking-widest">
          Prix · Bientôt
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function LandingPage() {
  const memberCount=await getMemberCount()

  return (
    <div className="min-h-screen bg-navy overflow-x-hidden">
      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-navy/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-heading font-extrabold text-xl tracking-tight">
            <span className="text-white">B</span>
            <span className="text-gold">eez</span>
          </span>
          <div className="flex items-center gap-5">
            <Link
              href="/signin"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-200"
            >
              Se connecter
            </Link>
            <Link
              href="#signup"
              className="text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
            >
              Rejoindre →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="honeycomb-bg relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        {/* Gradient fade bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy to-transparent" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold uppercase tracking-widest mb-8 animate-fade-in">
          <IconLock />
          Early Access en cours
        </div>

        {/* Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-4xl mx-auto animate-slide-up">
          LinkedIn pour les
          <br />
          <span className="text-gradient">entrepreneurs vrais.</span>
        </h1>

        <p className="mt-6 text-white/60 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed animate-slide-up delay-100">
          Construis en public, connecte avec ceux qui peuvent vraiment t'aider,
          trouve ton associé — sans le bullshit corporate.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-slide-up delay-200">
          <Link
            href="#signup"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-semibold px-8 py-4 text-base hover:bg-gold-400 active:bg-gold-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            Rejoindre la ruche
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </Link>
          <span className="text-white/30 text-sm">
            {memberCount > 0
              ? `${memberCount.toLocaleString('fr-FR')} membres · accès gratuit`
              : 'Accès gratuit · Founding Member'}
          </span>
        </div>

        {/* Hex decorations */}
        <div className="pointer-events-none absolute left-4 top-32 w-12 h-[56px] clip-hex bg-gold/5 hidden md:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-8 top-48 w-8 h-[37px] clip-hex bg-gold/8 hidden md:block" aria-hidden="true" />
        <div className="pointer-events-none absolute left-16 bottom-32 w-16 h-[74px] clip-hex bg-gold/5 hidden lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute right-24 bottom-24 w-20 h-[93px] clip-hex bg-gold/6 hidden lg:block" aria-hidden="true" />
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto" aria-labelledby="features-heading">
        <div className="mb-12 text-center">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Pourquoi Beez
          </p>
          <h2
            id="features-heading"
            className="font-heading font-bold text-3xl sm:text-4xl text-white"
          >
            Fait pour ceux qui construisent.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          <FeatureCard
            icon={<IconBolt />}
            title="Build in public"
            description="Partage ton parcours — les wins ET les galères. La transparence crée la confiance et l'audience."
          />
          <FeatureCard
            icon={<IconTarget />}
            title="Matching passif"
            description="Déclare ce que tu cherches une fois. Beez te notifie quand quelqu'un correspond. Pas de prospection, juste de la pertinence."
          />
          <FeatureCard
            icon={<IconUsers />}
            title="Intelligence collective"
            description="Des conseils de pairs qui ont vécu les mêmes problèmes. Mentors, investisseurs, co-fondateurs — tous là pour s'entraider."
          />
          <FeatureCard
            icon={<IconShield />}
            title="Zéro bullshit"
            description="Pas de personal branding vide, pas de posts formatés pour l'algorithme. Authentique, brut, direct."
          />
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 px-4 sm:px-6 bg-navy-950 border-y border-white/5" aria-labelledby="proof-heading">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
            {/* Member count */}
            <div>
              <div className="font-heading font-extrabold text-5xl text-gradient">
                {memberCount > 0
                  ? memberCount.toLocaleString('fr-FR')
                  : '—'}
              </div>
              <p className="text-white/50 text-sm mt-1">membres fondateurs</p>
            </div>

            <div className="hidden sm:block w-px h-16 bg-white/10" aria-hidden="true" />

            {/* Founding member */}
            <div className="text-left max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold text-sm font-bold" aria-hidden="true">✦</span>
                <h2
                  id="proof-heading"
                  className="font-heading font-bold text-white text-lg"
                >
                  Founding Member
                </h2>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Les premiers inscrits obtiennent un statut permanent et des
                avantages exclusifs à vie sur la plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" aria-labelledby="how-heading">
        <div className="mb-12 text-center">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Comment ça marche
          </p>
          <h2
            id="how-heading"
            className="font-heading font-bold text-3xl sm:text-4xl text-white"
          >
            Simple. Intentionnel. Efficace.
          </h2>
        </div>

        <ol className="relative space-y-0" aria-label="Étapes pour rejoindre Beez">
          {[
            {
              n: '01',
              title: 'Crée ton profil',
              desc: 'Qui tu es, où tu en es, ce que tu cherches. Deux minutes, pas un CV.',
            },
            {
              n: '02',
              title: 'Déclare tes intentions',
              desc: 'Co-fondateur ? Investisseur ? Dev ? Beta testeurs ? Beez s&apos;occupe du matching en arrière-plan.',
            },
            {
              n: '03',
              title: 'Dis bonjour à la ruche',
              desc: 'Ton premier post — où tu en es, ce que tu construis. La communauté répond.',
            },
            {
              n: '04',
              title: 'Construis en public',
              desc: 'Partage tes victoires, tes erreurs, tes questions. C&apos;est ça qui crée de vraies connexions.',
            },
          ].map(({ n, title, desc }, i) => (
            <li key={n} className="flex gap-6 pb-12 relative">
              {i < 3 && (
                <div
                  className="absolute left-[23px] top-12 bottom-0 w-px bg-white/8"
                  aria-hidden="true"
                />
              )}
              <div className="shrink-0 w-12 h-12 border border-gold/30 flex items-center justify-center bg-navy">
                <span className="font-mono text-gold font-bold text-sm">{n}</span>
              </div>
              <div className="pt-2">
                <h3 className="font-heading font-semibold text-white text-lg mb-1">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-4 sm:px-6 bg-navy-950 border-t border-white/5" aria-labelledby="pricing-heading">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Tarifs
            </p>
            <h2
              id="pricing-heading"
              className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3"
            >
              Commence gratuitement.
            </h2>
            <p className="text-white/40 text-sm">
              Les prix arrivent bientôt. Les Founding Members gardent l'accès gratuit à vie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5">
            <PricingCard
              tier="Free"
              subtitle="Pour commencer"
              features={[
                'Profil personnel',
                'Accès au feed communauté',
                'Matching de base',
                'Premier post public',
              ]}
            />
            <PricingCard
              tier="Pro"
              subtitle="Pour les projets sérieux"
              features={[
                'Profil startup complet',
                'Vérification SIRET',
                'Matching avancé débloqué',
                'Notifications de matching',
                'Badge Pro visible',
              ]}
              highlighted
            />
            <PricingCard
              tier="Startup Certified"
              subtitle="Pour les startups qui veulent être vues"
              features={[
                'Page startup premium',
                'Placement featured',
                'Analytics avancés',
                'Support prioritaire',
                'Tout ce qui est Pro',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── SIGN-UP CTA ── */}
      <section
        id="signup"
        className="py-20 px-4 sm:px-6 honeycomb-bg relative"
        aria-labelledby="signup-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />

        <div className="relative max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold uppercase tracking-widest mb-6">
            <IconLock />
            Accès limité
          </div>

          <h2
            id="signup-heading"
            className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight"
          >
            Rejoins la ruche maintenant.
          </h2>

          <p className="text-white/50 mb-10 text-sm sm:text-base leading-relaxed">
            Gratuit. Deux minutes. Tu seras notifié en premier quand l'app sera
            disponible.
          </p>

          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold px-10 py-4 text-lg hover:bg-gold-400 active:bg-gold-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy w-full sm:w-auto"
          >
            Créer mon profil
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </Link>

          <p className="mt-4 text-white/25 text-xs">
            Aucune CB requise · Founding Member garanti
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/25 text-xs">
          <span className="font-heading font-extrabold text-base">
            <span className="text-white/40">B</span>
            <span className="text-gold/60">eez</span>
          </span>
          <p>La ruche des entrepreneurs. © {new Date().getFullYear()}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">
              Mentions légales
            </a>
            <a href="/privacy" className="hover:text-white/50 transition-colors">
              Politique de confidentialité
            </a>
            <a href="/terms" className="hover:text-white/50 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="hover:text-white/50 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
