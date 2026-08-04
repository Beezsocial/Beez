import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import NavBrand from '@/components/ui/NavBrand'
import BeezWord from '@/components/ui/BeezWord'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-white/8 pt-6">
      <h2 className="font-heading font-bold text-base text-white mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-white/60 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
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
        <span className="text-white/30 text-xs">Confidentialité</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Page title */}
        <div className="mb-8">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.15em] mb-2">
            Politique de confidentialité
          </p>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-tight">
            Tes données, en clair.
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Dernière mise à jour : avril 2026
          </p>
        </div>

        {/* Content card */}
        <div className="card p-6 sm:p-8 space-y-6">

          <Section title="1. Qui sommes-nous ?">
            <p>
              <BeezWord /> est un réseau social français dédié aux entrepreneurs. Le responsable du traitement des données est l'équipe <BeezWord />, joignable à{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
              .
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Lors de ton inscription et de l'utilisation de <BeezWord />, nous collectons :</p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                'Ton adresse email (via ton compte Google ou directement)',
                'Ton prénom et ton nom',
                'Ta ville de résidence',
                'Ta biographie et la description de ton projet',
                'Ton type de profil (entrepreneur, investisseur, mentor…)',
                'Ce que tu recherches sur la plateforme',
                'Ta photo de profil (optionnelle)',
                'Ton premier message à la communauté (optionnel)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. Finalités du traitement">
            <p>Tes données sont utilisées pour :</p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                'Créer et afficher ton profil de membre au sein de la communauté',
                'Faciliter la mise en relation entre entrepreneurs, investisseurs et mentors',
                "T'envoyer un email de bienvenue lors de ton inscription",
                "Te notifier en priorité du lancement de l'application",
                "Améliorer l'expérience de la plateforme",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              La base légale de ces traitements est l'exécution du contrat (conditions d'utilisation acceptées lors de l'inscription) et notre intérêt légitime à faire fonctionner la communauté.
            </p>
          </Section>

          <Section title="4. Sous-traitants et hébergement">
            <p>
              <BeezWord /> utilise <strong className="text-white/80">Supabase</strong> (Supabase Inc., États-Unis) comme base de données et service d'authentification. Supabase agit en tant que sous-traitant et traite tes données conformément à ses propres engagements RGPD, dont les clauses contractuelles types (CCT) approuvées par la Commission européenne.
            </p>
            <p>
              Les données sont hébergées dans la région <strong className="text-white/80">Europe de l'Ouest</strong> (Frankfurt, AWS eu-central-1).
            </p>
            <p>
              Les emails transactionnels sont envoyés via <strong className="text-white/80">Resend</strong> (Resend Inc., États-Unis), également soumis aux CCT.
            </p>
          </Section>

          <Section title="5. Visibilité de ton profil">
            <p>
              Créer un profil sur <BeezWord /> rend certaines informations visibles aux autres membres connectés, afin de permettre la mise en relation entre entrepreneurs, investisseurs et mentors — c'est la raison d'être de la plateforme. Les informations suivantes sont visibles par les autres membres :
            </p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                'Ton prénom et ton nom',
                'Ta ville',
                'Ta biographie',
                'Ta photo de profil',
                'Ton type de profil (Starter ou Founder)',
                'Ce que tu recherches ("Je recherche")',
                'Ton statut de Founding Member, le cas échéant',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Ces informations ne sont visibles que par les membres <strong className="text-white/80">connectés à leur compte</strong>. Ton profil n'est ni public, ni indexé par les moteurs de recherche : l'application nécessite une authentification pour consulter le profil de qui que ce soit.
            </p>
          </Section>

          <Section title="6. Messagerie entre membres">
            <p>
              <BeezWord /> propose une messagerie permettant aux membres d'échanger directement. Dans ce cadre, nous collectons :
            </p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                'Le contenu du message',
                "L'identifiant de l'expéditeur et du destinataire",
                "L'horodatage d'envoi",
                'Le statut de lecture du message',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              <strong className="text-white/80">Accès :</strong> seuls les deux membres d'une conversation peuvent lire leurs propres messages. Cette restriction est appliquée techniquement au niveau de la base de données via les politiques de sécurité au niveau ligne (Row Level Security) de Supabase — personne d'autre, y compris l'équipe <BeezWord />, n'a accès au contenu des conversations dans le cadre normal du service.
            </p>
            <p className="mt-3">
              <strong className="text-white/80">Accès administrateur :</strong> l'équipe <BeezWord /> peut techniquement accéder au contenu des messages échangés entre membres via notre infrastructure technique (base de données). Cet accès est strictement limité aux cas suivants :
            </p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                "Traitement d'un signalement (harcèlement, contenu inapproprié, etc.)",
                'Nécessité technique (débogage, maintenance, sécurité)',
                'Obligation légale (réquisition judiciaire, par exemple)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Nous ne consultons jamais le contenu des messages par simple curiosité ou à des fins commerciales. Cet accès est actuellement limité au fondateur de <BeezWord /> ; toute personne supplémentaire ayant accès à l'infrastructure sera soumise à un engagement de confidentialité strict.
            </p>
            <p className="mt-3">
              <strong className="text-white/80">Finalité :</strong> permettre la communication directe entre membres <BeezWord />.
            </p>
            <p className="mt-3">
              <strong className="text-white/80">Conservation :</strong> les messages sont conservés tant que ton compte est actif. Ils sont supprimés définitivement lors de la suppression de ton compte, par suppression en cascade liée aux clés étrangères de la base de données.
            </p>
            <p className="mt-3">
              <strong className="text-white/80">Ton contrôle :</strong> tu peux demander la suppression d'une conversation spécifique en nous contactant à{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Durée de conservation">
            <p>
              Tes données sont conservées pendant toute la durée de ton appartenance à la communauté <BeezWord />. Si tu demandes la suppression de ton compte, tes données sont effacées dans un délai de <strong className="text-white/80">30 jours</strong>, sauf obligation légale de conservation.
            </p>
          </Section>

          <Section title="8. Tes droits">
            <p>Conformément au RGPD, tu disposes des droits suivants :</p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                "Droit d'accès : obtenir une copie de tes données",
                'Droit de rectification : corriger des informations inexactes',
                "Droit à l'effacement : demander la suppression de ton compte et de tes données",
                'Droit à la portabilité : recevoir tes données dans un format structuré',
                "Droit d'opposition : t'opposer à un traitement basé sur notre intérêt légitime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 shrink-0" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contacte-nous à{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
              . Nous répondons dans un délai de 30 jours. Tu as également le droit d'introduire une réclamation auprès de la <strong className="text-white/80">CNIL</strong> (cnil.fr).
            </p>
          </Section>

          <Section title="9. Cookies et traceurs">
            <p>
              <BeezWord /> n'utilise pas de cookies publicitaires ou de traceurs tiers à des fins de ciblage. Seuls des cookies strictement nécessaires au fonctionnement de l'authentification (session Supabase) sont utilisés.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Pour toute question relative à la protection de tes données personnelles :{' '}
              <a
                href="mailto:contact@joinbeez.com"
                className="text-gold hover:text-gold-400 transition-colors duration-200"
              >
                contact@joinbeez.com
              </a>
            </p>
          </Section>

        </div>
      </main>
    </div>
  )
}
