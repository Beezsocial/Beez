'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { RevealSection } from '@/components/ui/RevealSection'

const FREE_FEATURES = [
  { text: 'Profil entrepreneur (Starter ou Founder)', ok: true },
  { text: 'Accès à la communauté', ok: true },
  { text: 'Posts et interactions', ok: true },
  { text: 'Prends ta place au sein de la ruche', ok: true },
  { text: 'Matching passif par IA', ok: false },
  { text: 'Page entreprise rattachée', ok: false },
  { text: 'Fonctionnalités Pro', ok: false },
]

const PRO_FEATURES = [
  'Tout ce qui est gratuit',
  'Matching passif par IA',
  'Création de page(s) entreprise',
  'Page entreprise liée à ton profil',
  'Notifications de matching avancées',
  'Badge Pro visible sur ton profil',
  'Accès prioritaire aux nouvelles features',
  'Gratuit à vie pour les 150 premiers membres',
]

export default function PricingSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 relative"
      style={{
        background: 'rgba(8,30,50,0.7)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        zIndex: 1,
      }}
      aria-labelledby="pricing-heading"
    >
      <div className="max-w-3xl mx-auto">
        <RevealSection className="mb-12 text-center">
          <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3">Tarifs</p>
          <h2
            id="pricing-heading"
            className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3"
          >
            Commence gratuitement.
          </h2>
          <p className="text-white/40 text-sm">Les Founding Members ont le Pro gratuit à vie.</p>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: '-60px' }}
            className="card p-6 space-y-5"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <div>
              <h3 className="font-heading font-bold text-white text-xl mb-1">Gratuit</h3>
              <p className="text-white/50 text-sm">Pour toujours</p>
            </div>

            {/* Profile type explainers */}
            <div className="space-y-3">
              {[
                {
                  emoji: '🌱',
                  label: 'Starter',
                  desc: "Tu n'as pas encore de business mais tu veux partager, tester tes idées, apprendre.",
                },
                {
                  emoji: '🐝',
                  label: 'Founder',
                  desc: 'Tu as déjà un business avec SIRET. Tu veux de la visibilité et des connexions.',
                },
              ].map(({ emoji, label, desc }) => (
                <div
                  key={label}
                  style={{
                    border: '1px solid rgba(235,175,87,0.2)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    background: 'rgba(235,175,87,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{emoji}</span>
                    <span className="text-white text-sm font-semibold">{label}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-2.5">
              {FREE_FEATURES.map(({ text, ok }) => (
                <li key={text} className="flex items-start gap-2 text-sm">
                  <span
                    className={`shrink-0 mt-0.5 ${ok ? 'text-gold' : 'text-white/20'}`}
                    aria-hidden="true"
                  >
                    {ok ? '✦' : '✗'}
                  </span>
                  <span className={ok ? 'text-white/70' : 'text-white/25 line-through'}>{text}</span>
                </li>
              ))}
            </ul>

            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 w-full bg-gold text-navy-900 font-bold rounded-beez px-6 py-3.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Créer mon profil gratuit →
              </Link>
            </motion.div>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{
              boxShadow: '0 0 40px rgba(235,175,87,0.15), 0 0 80px rgba(235,175,87,0.06), 0 4px 24px rgba(0,0,0,0.25)',
            }}
            className="card p-6 space-y-5 relative"
            style={{ borderColor: 'rgba(235,175,87,0.4)' }}
          >
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
              <div className="flex items-baseline gap-3">
                <h3 className="font-heading font-bold text-white text-xl">Pro</h3>
                <span
                  className="font-heading font-black"
                  style={{ fontSize: 28, color: '#ebaf57', letterSpacing: '-1px' }}
                >
                  4,99€
                </span>
                <span className="text-white/30 text-xs">/mois</span>
              </div>
              <p className="text-white/50 text-sm mt-0.5">Résiliable à tout moment</p>
            </div>

            <ul className="space-y-2.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-gold shrink-0 mt-0.5" aria-hidden="true">
                    ✦
                  </span>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
