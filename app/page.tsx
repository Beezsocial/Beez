import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import CarouselHero from '@/components/ui/CarouselHero'
import NavHeader from '@/components/ui/NavHeader'
import BeezWord from '@/components/ui/BeezWord'

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: React.ReactNode
}) {
  return (
    <div className="card p-6 space-y-3">
      <div
        className="w-10 h-10 flex items-center justify-center text-xl"
        style={{ background: 'rgba(235,175,87,0.1)', borderRadius: 8 }}
      >
        {icon}
      </div>
      <h3 className="font-heading font-semibold text-white text-lg">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Mockup hex avatar ────────────────────────────────────────────────────────
function MockHex({ initial, gradient }: { initial: string; gradient: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 42,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: gradient,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
        color: '#082b44',
      }}
    >
      {initial}
    </div>
  )
}

// ─── Phone feed card ──────────────────────────────────────────────────────────
function MockCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '10px 12px',
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy honeycomb-bg overflow-x-hidden">

      {/* ── NAV (client — session-aware) ── */}
      <NavHeader />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy to-transparent" />

        {/* Logo image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-dark.png"
          alt="Beez"
          style={{ height: 80, width: 'auto', marginBottom: 16, position: 'relative', zIndex: 1 }}
        />

        {/* "Beez" wordmark */}
        <h1
          className="font-heading leading-none mb-4"
          style={{
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span style={{ color: '#ffffff' }}>Bee</span>
          <span style={{ color: '#ebaf57' }}>z</span>
        </h1>

        {/* Main headline */}
        <p
          className="font-heading font-bold text-center mb-4 leading-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', position: 'relative', zIndex: 1 }}
        >
          <span className="text-white">Construis. </span>
          <span className="text-white">Partage. </span>
          <span style={{ color: '#ebaf57' }}>Connecte.</span>
        </p>

        {/* Subtitle */}
        <p className="text-white/60 text-xl text-center mb-6" style={{ position: 'relative', zIndex: 1 }}>
          La ruche des entrepreneurs
        </p>

        {/* Auto-rotating carousel */}
        <div className="mb-8 flex items-center justify-center px-4" style={{ position: 'relative', zIndex: 1 }}>
          <CarouselHero />
        </div>

        {/* CTA button */}
        <Link
          href="#signup"
          className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez px-8 py-4 text-base transition-all duration-200 hover:brightness-110 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy mb-4"
          style={{ position: 'relative', zIndex: 1 }}
        >
          Rejoindre la ruche →
        </Link>

        {/* Early access note */}
        <p className="text-white/30 text-sm" style={{ position: 'relative', zIndex: 1 }}>
          🔒 Early Access en cours · Founding Member garanti
        </p>
      </section>

      {/* ── APP MOCKUP ── */}
      <section className="py-12 px-4 flex items-center justify-center overflow-visible" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: 300,
            width: '100%',
            background: '#082b44',
            borderRadius: 36,
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            padding: '20px 16px',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>9:41</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: -0.5 }}>
              <span style={{ color: '#ffffff' }}>Bee</span><span style={{ color: '#ebaf57' }}>z</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>●●●</span>
          </div>

          {/* Card 1 — Welcome */}
          <MockCard>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <MockHex initial="M" gradient="linear-gradient(135deg,#ebaf57,#d4912a)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Martin</span>
                  <span style={{ background: 'rgba(235,175,87,0.15)', border: '1px solid rgba(235,175,87,0.4)', color: '#ebaf57', fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                    ✦ Founding Member #001
                  </span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>FlowDesk · À l'instant</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginBottom: 6, lineHeight: 1.4 }}>
              Vient de rejoindre la ruche 🐝
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 6, lineHeight: 1.4 }}>
              Souhaitez la bienvenue à Martin, fondateur de FlowDesk !
            </p>
            <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
              <span>🍯 14</span>
              <span>💬 6</span>
            </div>
          </MockCard>

          {/* Card 2 — Milestone */}
          <MockCard>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <MockHex initial="B" gradient="linear-gradient(135deg,#f472b6,#ef4444)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Blop 🚀</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>· 1h</span>
                </div>
                <span style={{ background: 'rgba(235,175,87,0.12)', color: '#ebaf57', fontSize: 9, padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>
                  250K€ levés
                </span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginBottom: 4, lineHeight: 1.4 }}>
              Première levée de fonds 🎉
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, lineHeight: 1.4 }}>
              250 000€ en pré-seed. Merci aux 3 business angels.
            </p>
          </MockCard>

          {/* Card 3 — Help */}
          <MockCard>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <MockHex initial="T" gradient="linear-gradient(135deg,#60a5fa,#3b82f6)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Thibault</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>· Nexio</span>
                </div>
                <span style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>
                  🙋 Aide
                </span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, marginBottom: 8, lineHeight: 1.4 }}>
              Comment créer ma chaîne YouTube ?
            </p>
            <div style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 10, padding: '5px 10px', borderRadius: 6, textAlign: 'center' }}>
              💬 Répondre
            </div>
          </MockCard>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto" aria-labelledby="features-heading" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <span style={{ color: '#ebaf57' }}>Pourquoi </span>
            <span style={{ color: '#ffffff' }}>Bee</span>
            <span style={{ color: '#ebaf57' }}>z</span>
          </p>
          <h2
            id="features-heading"
            className="font-heading font-bold text-3xl sm:text-4xl text-white"
          >
            Fait pour ceux qui font.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard
            icon="🏗️"
            title="Build in public"
            description="Partage ton parcours en temps réel. Succès, échecs, pivots. La vraie vie d'un entrepreneur."
          />
          <FeatureCard
            icon="🔔"
            title="Matching passif"
            description={<><BeezWord /> te notifie quand les bonnes opportunités apparaissent. Dis ce que tu cherches une fois, c'est tout.</>}
          />
          <FeatureCard
            icon="🤝"
            title="Intelligence collective"
            description="Pose tes questions à ceux qui sont passés par là. Conseils vrais, pas de bullshit. Profite du cercle vertueux de la ruche."
          />
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ background: 'rgba(8,30,50,0.7)', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">Tarifs</p>
            <h2
              id="pricing-heading"
              className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3"
            >
              Commence gratuitement.
            </h2>
            <p className="text-white/40 text-sm">
              Les Founding Members ont le Pro gratuit à vie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

            {/* Free */}
            <div
              className="card p-6 space-y-5"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <div>
                <h3 className="font-heading font-bold text-white text-xl mb-1">
                  Gratuit
                </h3>
                <p className="text-white/50 text-sm">Pour toujours</p>
              </div>

              {/* Profile type explainers */}
              <div className="space-y-3">
                <div
                  style={{
                    border: '1px solid rgba(235,175,87,0.2)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    background: 'rgba(235,175,87,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>🌱</span>
                    <span className="text-white text-sm font-semibold">Starter</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Tu n'as pas encore de business mais tu veux partager, tester tes idées, apprendre.
                  </p>
                </div>
                <div
                  style={{
                    border: '1px solid rgba(235,175,87,0.2)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    background: 'rgba(235,175,87,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>🐝</span>
                    <span className="text-white text-sm font-semibold">Founder</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Tu as déjà un business avec SIRET. Tu veux de la visibilité et des connexions.
                  </p>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-2.5">
                {[
                  { text: 'Profil entrepreneur (Starter ou Founder)', ok: true },
                  { text: 'Accès à la communauté', ok: true },
                  { text: 'Posts et interactions', ok: true },
                  { text: 'Prends ta place au sein de la ruche', ok: true },
                  { text: 'Matching passif par IA', ok: false },
                  { text: 'Page entreprise rattachée', ok: false },
                  { text: 'Fonctionnalités Pro', ok: false },
                ].map(({ text, ok }) => (
                  <li key={text} className="flex items-start gap-2 text-sm">
                    <span
                      className={`shrink-0 mt-0.5 ${ok ? 'text-gold' : 'text-white/20'}`}
                      aria-hidden="true"
                    >
                      {ok ? '✦' : '✗'}
                    </span>
                    <span className={ok ? 'text-white/70' : 'text-white/25 line-through'}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 w-full bg-gold text-navy-900 font-bold rounded-beez px-6 py-3.5 text-sm transition-all duration-200 hover:brightness-110 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Créer mon profil gratuit →
              </Link>
            </div>

            {/* Pro */}
            <div className="card p-6 space-y-5 relative" style={{ borderColor: 'rgba(235,175,87,0.4)' }}>
              <div
                className="absolute -top-3 left-6 text-gold text-xs font-bold px-3 py-1 uppercase tracking-wider"
                style={{
                  background: '#082b44',
                  border: '1px solid rgba(235,175,87,0.4)',
                  borderRadius: 6,
                }}
              >
                Bientôt disponible
              </div>

              <div>
                <h3 className="font-heading font-bold text-white text-xl mb-1">Pro</h3>
                <p className="text-white/50 text-sm">4,99€/mois · Résiliable à tout moment</p>
              </div>

              <ul className="space-y-2.5">
                {[
                  'Tout ce qui est gratuit',
                  'Matching passif par IA',
                  'Création de page(s) entreprise',
                  'Page entreprise liée à ton profil',
                  'Notifications de matching avancées',
                  'Badge Pro visible sur ton profil',
                  'Accès prioritaire aux nouvelles features',
                  'Gratuit à vie pour les 150 premiers membres',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="text-gold shrink-0 mt-0.5" aria-hidden="true">✦</span>
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className="w-full inline-flex items-center justify-center font-bold rounded-beez px-6 py-3.5 text-sm cursor-not-allowed opacity-40"
                style={{
                  background: 'rgba(235,175,87,0.12)',
                  color: '#ebaf57',
                  border: '1px solid rgba(235,175,87,0.3)',
                }}
              >
                Bientôt disponible
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── SIGN-UP CTA ── */}
      <section
        id="signup"
        className="py-20 px-4 sm:px-6 honeycomb-bg relative"
        aria-labelledby="signup-heading"
        style={{ zIndex: 1 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />
        <div className="relative max-w-lg mx-auto text-center">
          <h2
            id="signup-heading"
            className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight"
          >
            Rejoins la ruche maintenant.
          </h2>
          <p className="text-white/50 mb-10 text-sm sm:text-base leading-relaxed">
            Deux minutes. Gratuit. Tu seras parmi les premiers.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez px-10 py-4 text-lg transition-all duration-200 hover:brightness-110 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy w-full sm:w-auto"
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
      <footer className="py-8 px-4 sm:px-6 border-t border-white/5" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/25 text-xs">
          <Logo height={32} />
          <p>La ruche des entrepreneurs. © {new Date().getFullYear()}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/mentions-legales" className="hover:text-white/50 transition-colors">
              Mentions légales
            </a>
            <a href="/privacy" className="hover:text-white/50 transition-colors">
              Politique de confidentialité
            </a>
            <a href="/terms" className="hover:text-white/50 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="/contact" className="hover:text-white/50 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
