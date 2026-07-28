'use client'

import { motion } from 'motion/react'

const PINK = '#ff3fa4'

// Irregular neon-sign flicker: mostly lit, with an early soft dip and one
// quick hard flicker down to 0.4, then settling — repeats every ~3s.
const FLICKER_OPACITY = [1, 0.95, 1, 0.85, 1, 0.4, 1, 0.9, 1, 1, 0.88, 1]
const FLICKER_TIMES = [0, 0.08, 0.15, 0.2, 0.35, 0.38, 0.4, 0.55, 0.7, 0.85, 0.9, 1]

export default function EarlyAccessBanner() {
  return (
    <div className="relative flex justify-center px-4 pt-6" style={{ zIndex: 2 }}>
      <motion.div
        animate={{ opacity: FLICKER_OPACITY }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: FLICKER_TIMES }}
        className="font-heading font-bold uppercase text-center"
        style={{
          color: PINK,
          fontSize: 'clamp(13px, 2.2vw, 18px)',
          letterSpacing: '0.12em',
          padding: '12px 24px',
          borderRadius: 10,
          border: `1px solid rgba(255,63,164,0.6)`,
          background: 'rgba(10,4,14,0.35)',
          textShadow: '0 0 10px rgba(255,63,164,0.8), 0 0 20px rgba(255,63,164,0.8), 0 0 40px rgba(255,63,164,0.8)',
          boxShadow: '0 0 16px rgba(255,63,164,0.5), 0 0 32px rgba(255,63,164,0.25), inset 0 0 12px rgba(255,63,164,0.08)',
        }}
      >
        🚧 APPLICATION EN CONSTRUCTION · EARLY ACCESS EN COURS 🚧
      </motion.div>
    </div>
  )
}
