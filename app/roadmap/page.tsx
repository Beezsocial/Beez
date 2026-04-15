import Link from 'next/link'
import NavBrand from '@/components/ui/NavBrand'
import BeezWord from '@/components/ui/BeezWord'

type Status = 'done' | 'progress' | 'future'

const items: { status: Status; title: string; description: string; date?: string }[] = [
  {
    status: 'done',
    title: 'Lancement Early Access',
    description: 'Inscriptions ouvertes, profils membres, système Founding Member (150 premiers = Pro à vie), email de bienvenue, page entreprise.',
    date: 'Avril 2026',
  },
  {
    status: 'progress',
    title: 'Feed & communauté',
    description: 'Publication de posts, réactions, commentaires, partage de milestones. La vie de la ruche visible par tous les membres.',
  },
  {
    status: 'future',
    title: 'Matching par IA',
    description: 'Algorithme de matching passif : <BeezWord /> analyse ton profil et tes besoins pour te notifier quand une opportunité te correspond. Associé, investisseur, mentor, client — sans chercher.',
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
    return <span className="text-xs font-bold px-2 py-0.5" style={{ background: 'rgba(235,175,87,0.15)', border: '1px solid rgba(235,175,87,0.4)', color: '#ebaf57', borderRadius: 5 }}>Terminé</span>
  }
  if (status === 'progress') {
    return <span className="text-xs font-bold px-2 py-0.5" style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)', color: '#60a5fa', borderRadius: 5 }}>En cours</span>
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
                    {description.includes('<BeezWord />') ? (
                      <>
                        {description.split('<BeezWord />')[0]}
                        <BeezWord />
                        {description.split('<BeezWord />')[1]}
                      </>
                    ) : description}
                  </p>
                </div>
              </div>
            ))}
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
