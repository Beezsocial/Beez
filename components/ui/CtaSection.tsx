'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import MemberCounter from '@/components/ui/MemberCounter'
import { RevealSection } from '@/components/ui/RevealSection'

function RotatingHex({
  size,
  style,
  duration = 20,
  reverse = false,
}: {
  size: number
  style?: React.CSSProperties
  duration?: number
  reverse?: boolean
}) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        border: '1px solid rgba(235,175,87,0.12)',
        background: 'rgba(235,175,87,0.02)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

export default function CtaSection() {
  return (
    <section
      id="signup"
      className="py-20 px-4 sm:px-6 honeycomb-bg relative overflow-hidden"
      aria-labelledby="signup-heading"
      style={{ zIndex: 1 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />

      {/* Decorative hexagons */}
      <RotatingHex size={300} duration={40} style={{ top: '-80px', left: '-80px' }} />
      <RotatingHex size={200} duration={25} reverse style={{ top: '10%', left: '15%' }} />
      <RotatingHex size={250} duration={32} style={{ bottom: '-60px', right: '-60px' }} />
      <RotatingHex size={160} duration={20} reverse style={{ bottom: '15%', right: '18%' }} />

      <div className="relative max-w-lg mx-auto text-center">
        <RevealSection>
          <h2
            id="signup-heading"
            className="font-heading font-extrabold text-3xl sm:text-4xl text-white mb-4 leading-tight"
          >
            Rejoins la ruche maintenant.
          </h2>
          <p className="text-white/50 mb-10 text-sm sm:text-base leading-relaxed">
            Deux minutes. Gratuit. Tu seras parmi les premiers.
          </p>
        </RevealSection>

        <RevealSection delay={0.15}>
          <motion.div
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="relative inline-block w-full sm:w-auto"
          >
            {/* Pulse ring */}
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-beez"
              style={{ background: 'rgba(235,175,87,0.25)', pointerEvents: 'none' }}
            />
            <Link
              href="/onboarding"
              className="relative inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez px-10 py-4 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy w-full sm:w-auto"
              style={{ position: 'relative' }}
            >
              Créer mon profil
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
          </motion.div>
        </RevealSection>

        <RevealSection delay={0.25}>
          <p className="mt-4 text-white/25 text-xs">Aucune CB requise · Founding Member garanti</p>
          <MemberCounter />
        </RevealSection>
      </div>
    </section>
  )
}
