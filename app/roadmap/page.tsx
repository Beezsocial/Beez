import Link from 'next/link'
import NavBrand from '@/components/ui/NavBrand'

type Status = 'done' | 'progress' | 'future'

const items: { status: Status; title: string; description: string; date?: string }[] = [
  {
    status: 'done',
    date: 'Janvier 2026',
    title: '🌐 Publication de la landing page',
    description: "Création de la page Beez et de l'identité visuelle.",
  },
  {
    status: 'done',
    date: '16 avril 2026',
    title: "🚀 Lancement de l'Early Access",
    description: "Ouverture des créations de profils. Les 150 premiers membres deviennent Founding Members. Accès à la roadmap et à la newsletter.",
  },
  {
    status: 'progress',
    date: 'Bientôt',
    title: '🎬 Contenu vidéo',
    description: 'Publication des vidéos Beez sur Instagram et YouTube. Build in public documenté.',
  },
  {
    status: 'future',
    date: 'À venir',
    title: "📱 Publication de l'app",
    description: 'Lancement du feed communautaire et des fonctionnalités sociales complètes.',
  },
]

function NodeDot({ status }: { status: Status }) {
  if (status === 'done') {
    return (
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ebaf57', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5l2.5 2.5L8 3" stroke="#082b44" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  if (status === 'progress') {
    return (
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#082b44', border: '2px solid #ebaf57', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ebaf57', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>
    )
  }
  return (
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#082b44', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0, position: 'relative', zIndex: 1 }} />
  )
}

function StatusBadge({ status }: { status: Status }) {
  if (status === 'done') {
    return <span className="text-xs font-bold px-2 py-0.5" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399', borderRadius: 5 }}>Terminé</span>
  }
  if (status === 'progress') {
    return <span className="text-xs font-bold px-2 py-0.5" style={{ background: 'rgba(235,175,87,0.15)', border: '1px solid rgba(235,175,87,0.4)', color: '#ebaf57', borderRadius: 5, animation: 'pulse 2s ease-in-out infinite' }}>En cours</span>
  }
  return <span className="text-xs font-bold px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: 5 }}>À venir</span>
}

export default function RoadmapPage() {
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
          <NavBrand height={36} />
        </div>
        <span className="text-white/30 text-xs">Roadmap</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Page title */}
        <div className="mb-10">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Roadmap
          </p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            Ce qu'on construit.
          </h1>
          <p className="text-white/40 text-sm mt-2">
            La ruche grandit. Voici où on en est et où on va.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[9px] top-3 bottom-3"
            style={{ width: 2, background: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />

          <div className="space-y-8">
            {items.map(({ status, title, description, date }, i) => (
              <div key={i} className="flex gap-5">
                <NodeDot status={status} />
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className={`font-heading font-bold text-base ${status === 'future' ? 'text-white/50' : 'text-white'}`}>
                      {title}
                    </h2>
                    <StatusBadge status={status} />
                    {date && <span className="text-white/25 text-xs">{date}</span>}
                  </div>
                  <p className={`text-sm leading-relaxed ${status === 'future' ? 'text-white/30' : 'text-white/55'}`}>
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fading continuation */}
          <div className="flex gap-5 mt-4">
            <div style={{ width: 20, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)', borderLeft: '2px dashed rgba(255,255,255,0.06)' }} />
            </div>
            <p className="text-white/20 text-sm italic pt-2">... et la suite</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 card p-6 text-center">
          <p className="text-white/60 text-sm mb-4">
            Tu as une idée de feature ? On est à l'écoute.
          </p>
          <a
            href="mailto:contact@joinbeez.com"
            className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            contact@joinbeez.com →
          </a>
        </div>

      </main>
    </div>
  )
}
