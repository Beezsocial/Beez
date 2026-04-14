import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function ContactPage() {
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
        <span className="text-white/30 text-xs">Contact</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-16">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <p className="text-gold text-xs font-bold uppercase tracking-[0.15em] mb-2">
              Nous contacter
            </p>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              On est là.
            </h1>
          </div>

          <div className="card p-6 sm:p-8 space-y-6">

            <div className="border-t border-white/8 pt-6 first:border-t-0 first:pt-0">
              <p className="text-sm text-white/60 leading-relaxed">
                Pour toute question, suggestion ou signalement, écris-nous à{' '}
                <a
                  href="mailto:contact@joinbeez.com"
                  className="text-gold hover:text-gold-400 transition-colors duration-200 font-medium"
                >
                  contact@joinbeez.com
                </a>
                . On répond dans les 48h.
              </p>
            </div>

            <div className="border-t border-white/8 pt-6">
              <a
                href="mailto:contact@joinbeez.com"
                className="inline-flex items-center justify-center gap-2 w-full bg-gold text-navy-900 font-bold rounded-beez px-6 py-4 text-base transition-all duration-200 hover:brightness-110 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
                Envoyer un email
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
