'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import CarouselHero from '@/components/ui/CarouselHero'

// Decorative rotating hexagon
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
        border: '1px solid rgba(235,175,87,0.15)',
        background: 'rgba(235,175,87,0.03)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-10 pb-16 overflow-hidden">
      {/* Gradient fade at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy to-transparent" />

      {/* Decorative rotating hexagons */}
      <RotatingHex size={220} duration={28} style={{ top: '8%', left: '-5%', opacity: 0.5 }} />
      <RotatingHex size={140} duration={18} reverse style={{ top: '20%', left: '6%' }} />
      <RotatingHex size={180} duration={24} style={{ top: '5%', right: '-3%', opacity: 0.5 }} />
      <RotatingHex size={110} duration={15} reverse style={{ bottom: '18%', right: '8%' }} />
      <RotatingHex size={260} duration={35} style={{ bottom: '-6%', left: '30%', opacity: 0.25 }} />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center"
        style={{ zIndex: 1 }}
      >
        {/* Logo */}
        <motion.div variants={fadeUp}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-dark.png"
            alt="Beez"
            style={{ height: 120, width: 'auto', marginBottom: 32 }}
          />
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          variants={fadeUp}
          className="font-heading leading-none mb-4"
          style={{
            fontSize: 'clamp(48px, 8vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-2px',
          }}
        >
          <span style={{ color: '#ffffff' }}>Bee</span>
          <span style={{ color: '#ebaf57' }}>z</span>
        </motion.h1>

        {/* Main headline */}
        <motion.p
          variants={fadeUp}
          className="font-heading font-bold text-center leading-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginTop: 24, marginBottom: 24 }}
        >
          <span className="text-white">Construis. </span>
          <span className="text-white">Partage. </span>
          <span style={{ color: '#ebaf57' }}>Connecte.</span>
        </motion.p>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-white/60 text-xl text-center"
          style={{ marginBottom: 32 }}
        >
          La ruche des entrepreneurs
        </motion.p>

        {/* Carousel */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center px-4"
          style={{ marginTop: 32, marginBottom: 40 }}
        >
          <CarouselHero />
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              href="#signup"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez px-8 py-4 text-base transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy mb-4"
            >
              🐝 Rejoindre la ruche →
            </Link>
          </motion.div>
        </motion.div>

        {/* Early access note */}
        <motion.p variants={fadeUp} className="text-white/30 text-sm mt-4">
          🔒 Early Access en cours · Founding Member garanti
        </motion.p>
      </motion.div>
    </section>
  )
}
