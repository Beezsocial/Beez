'use client'

import { motion } from 'motion/react'
import BeezWord from '@/components/ui/BeezWord'

interface FeatureCardProps {
  icon: string
  title: string
  description: React.ReactNode
  delay?: number
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(235,175,87,0.12), 0 4px 24px rgba(0,0,0,0.25)' }}
      className="card p-6 space-y-3"
      style={{ borderColor: 'rgba(255,255,255,0.08)', cursor: 'default' }}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 8 }}
        transition={{ duration: 0.2 }}
        className="w-10 h-10 flex items-center justify-center text-xl"
        style={{ background: 'rgba(235,175,87,0.1)', borderRadius: 8 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-heading font-semibold text-white text-lg">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 max-w-4xl mx-auto relative"
      aria-labelledby="features-heading"
      style={{ zIndex: 1 }}
    >
      {/* BEEZ watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-heading font-black"
          style={{
            fontSize: 'clamp(120px, 20vw, 200px)',
            color: 'rgba(235,175,87,0.03)',
            letterSpacing: '-0.05em',
            userSelect: 'none',
          }}
        >
          BEEZ
        </span>
      </div>

      <motion.div
        className="mb-12 text-center relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
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
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
        <FeatureCard
          icon="🏗️"
          title="Build in public"
          description="Partage ton parcours en temps réel. Succès, échecs, pivots. La vraie vie d'un entrepreneur."
          delay={0}
        />
        <FeatureCard
          icon="🔔"
          title="Matching passif"
          description={
            <>
              <BeezWord /> te notifie quand les bonnes opportunités apparaissent. Dis ce que tu
              cherches une fois, c'est tout.
            </>
          }
          delay={0.1}
        />
        <FeatureCard
          icon="🤝"
          title="Intelligence collective"
          description="Pose tes questions à ceux qui sont passés par là. Conseils vrais, pas de bullshit. Profite du cercle vertueux de la ruche."
          delay={0.2}
        />
      </div>
    </section>
  )
}
