import Link from 'next/link'
import Logo from '@/components/ui/Logo'

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/8 pt-6">
      <h2 className="font-heading font-bold text-base text-white mb-3">
        <span className="text-gold mr-2">{number}.</span>{title}
      </h2>
      <div className="space-y-3 text-sm text-white/60 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function MentionsLegalesPage() {
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
        <span className="text-white/30 text-xs">Mentions légales</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">

        <div className="mb-8">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Mentions légales
          </p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            Informations légales.
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-6">

          <Section number="1" title="Éditeur du site">
            <p>
              Le site <strong className="text-white/80">joinbeez.com</strong> est édité par :
            </p>
            <ul className="mt-2 space-y-1">
              <li><span className="text-white/40">Nom :</span> David Durand</li>
              <li><span className="text-white/40">Email :</span>{' '}
                <a href="mailto:contact@joinbeez.com" className="text-gold hover:text-gold-400 transition-colors duration-200">
                  contact@joinbeez.com
                </a>
              </li>
              <li><span className="text-white/40">Site :</span> joinbeez.com</li>
            </ul>
          </Section>

          <Section number="2" title="Hébergement">
            <p>Le site est hébergé par :</p>
            <ul className="mt-2 space-y-1">
              <li><span className="text-white/40">Société :</span> <strong className="text-white/80">Vercel Inc.</strong></li>
              <li><span className="text-white/40">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
              <li><span className="text-white/40">Site :</span> vercel.com</li>
            </ul>
          </Section>

          <Section number="3" title="Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site — textes, graphismes, logotype, icônes — est la propriété exclusive de Beez et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ce site ou de son contenu, sans autorisation écrite préalable, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </Section>

          <Section number="4" title="Données personnelles">
            <p>
              Le traitement des données personnelles collectées sur joinbeez.com est décrit dans notre{' '}
              <Link href="/privacy" className="text-gold hover:text-gold-400 transition-colors duration-200">
                Politique de confidentialité
              </Link>
              .
            </p>
          </Section>

          <Section number="5" title="Contact">
            <p>
              Pour toute question relative au site :{' '}
              <a href="mailto:contact@joinbeez.com" className="text-gold hover:text-gold-400 transition-colors duration-200">
                contact@joinbeez.com
              </a>
            </p>
          </Section>

        </div>
      </main>
    </div>
  )
}
