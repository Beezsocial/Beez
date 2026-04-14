import type { ReactNode } from 'react'
import Link from 'next/link'

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
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

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
      <span>{children}</span>
    </li>
  )
}

export default function TermsPage() {
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
        <span className="text-white/30 text-xs">Conditions d'utilisation</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Page title */}
        <div className="mb-8">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Conditions générales d'utilisation
          </p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            Les règles de la ruche.
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Dernière mise à jour : avril 2026
          </p>
        </div>

        {/* Content card */}
        <div className="bg-navy-950 border border-white/8 p-6 sm:p-8 space-y-6">

          <Section number="1" title="Objet">
            <p>
              Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme <strong className="text-white/80">Beez</strong>, réseau social français dédié aux entrepreneurs, investisseurs et mentors.
            </p>
            <p>
              En créant un compte, tu acceptes sans réserve les présentes CGU. Si tu n'acceptes pas ces conditions, tu ne dois pas utiliser Beez.
            </p>
          </Section>

          <Section number="2" title="Inscription">
            <p>
              Pour rejoindre Beez, tu dois fournir des informations exactes, complètes et à jour. Toute fausse déclaration peut entraîner la suspension immédiate de ton compte.
            </p>
            <ul className="list-none space-y-1.5 mt-2">
              <Bullet>
                L'inscription est ouverte à toute personne majeure exerçant ou souhaitant exercer une activité entrepreneuriale.
              </Bullet>
              <Bullet>
                Les comptes de type <strong className="text-white/80">Pro</strong> (entrepreneurs avec une activité déclarée) nécessitent un numéro de <strong className="text-white/80">SIRET valide</strong>. Beez se réserve le droit de vérifier cette information.
              </Bullet>
              <Bullet>
                Tu es responsable de la confidentialité de tes identifiants de connexion et de toute activité réalisée depuis ton compte.
              </Bullet>
            </ul>
          </Section>

          <Section number="3" title="Utilisation acceptable">
            <p>En utilisant Beez, tu t'engages à ne pas :</p>
            <ul className="list-none space-y-1.5 mt-2">
              <Bullet>Créer de faux profils ou usurper l'identité d'une autre personne ou entreprise</Bullet>
              <Bullet>Envoyer des messages non sollicités (spam) ou du contenu promotionnel abusif</Bullet>
              <Bullet>Publier ou partager tout contenu illégal, diffamatoire, haineux, obscène ou portant atteinte aux droits de tiers</Bullet>
              <Bullet>Utiliser la plateforme à des fins de démarchage commercial non autorisé ou de collecte de données</Bullet>
              <Bullet>Tenter de contourner les mesures de sécurité ou d'accéder à des données qui ne te sont pas destinées</Bullet>
              <Bullet>Automatiser l'accès à la plateforme (scraping, bots) sans autorisation écrite préalable</Bullet>
            </ul>
          </Section>

          <Section number="4" title="Contenu publié">
            <p>
              Tu restes seul responsable du contenu que tu publies sur Beez (profil, biographie, messages, photos, etc.). En publiant du contenu, tu garantis en disposer des droits nécessaires et qu'il ne porte pas atteinte aux droits de tiers.
            </p>
            <p>
              Beez ne saurait être tenu responsable du contenu publié par ses membres. Tout contenu contraire aux présentes CGU peut être supprimé sans préavis.
            </p>
          </Section>

          <Section number="5" title="Suspension et résiliation">
            <p>
              Beez se réserve le droit de suspendre ou de résilier ton accès à la plateforme, avec ou sans préavis, en cas de :
            </p>
            <ul className="list-none space-y-1.5 mt-2">
              <Bullet>Violation des présentes CGU</Bullet>
              <Bullet>Comportement abusif, harcelant ou nuisible envers d'autres membres</Bullet>
              <Bullet>Fourniture d'informations fausses lors de l'inscription</Bullet>
              <Bullet>Activité frauduleuse ou illégale</Bullet>
            </ul>
            <p className="mt-3">
              Tu peux à tout moment demander la suppression de ton compte en contactant{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
              .
            </p>
          </Section>

          <Section number="6" title="Propriété intellectuelle">
            <p>
              Le contenu que tu publies sur Beez (textes, photos, descriptions) te reste entièrement <strong className="text-white/80">appartenant</strong>. En le publiant, tu accordes à Beez une licence non exclusive, mondiale, gratuite et transférable, pour l'afficher et le distribuer dans le cadre du fonctionnement de la plateforme.
            </p>
            <p>
              La marque Beez, le logo, le design de la plateforme et le code source sont la propriété exclusive de Beez et sont protégés par le droit de la propriété intellectuelle. Toute reproduction sans autorisation écrite est interdite.
            </p>
          </Section>

          <Section number="7" title="Limitation de responsabilité">
            <p>
              La plateforme Beez est fournie <strong className="text-white/80">en l'état</strong>, sans garantie d'aucune sorte, expresse ou implicite. Beez ne garantit pas la disponibilité continue du service ni l'absence d'erreurs.
            </p>
            <p>
              Dans les limites autorisées par la loi applicable, Beez ne pourra être tenu responsable des dommages indirects, accessoires ou consécutifs découlant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.
            </p>
          </Section>

          <Section number="8" title="Modification des CGU">
            <p>
              Beez se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification substantielle, un préavis de <strong className="text-white/80">30 jours</strong> sera envoyé par email à l'adresse associée à ton compte.
            </p>
            <p>
              La poursuite de l'utilisation de la plateforme après ce délai vaut acceptation des nouvelles conditions. Si tu refuses les modifications, tu peux supprimer ton compte avant l'entrée en vigueur des nouvelles CGU.
            </p>
          </Section>

          <Section number="9" title="Contact">
            <p>
              Pour toute question relative aux présentes CGU ou à l'utilisation de la plateforme :{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
            </p>
          </Section>

          <Section number="10" title="Droit applicable et juridiction">
            <p>
              Les présentes CGU sont régies par le <strong className="text-white/80">droit français</strong>. En cas de litige, et après tentative de résolution amiable, les tribunaux compétents seront ceux du ressort du <strong className="text-white/80">Tribunal judiciaire de Tours</strong>.
            </p>
          </Section>

        </div>
      </main>
    </div>
  )
}
