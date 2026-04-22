'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ITEMS = [
  'Partage la création de ton projet',
  'Reçois des encouragements',
  'Trouve un associé',
  'Attire tes premiers clients',
  'Teste ton idée',
  'Construis ta communauté',
  'Lève des fonds',
  'Trouve un mentor',
  'Rends visible ta startup',
]

export default function CarouselHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ITEMS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="relative inline-block text-center"
      style={{ minWidth: 'min(320px, 80vw)', minHeight: 56 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'block',
            color: '#ebaf57',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(24px, 4vw, 36px)',
            textShadow: '0 0 20px rgba(235,175,87,0.5), 0 0 40px rgba(235,175,87,0.2)',
            lineHeight: 1.2,
          }}
        >
          {ITEMS[index]}
        </motion.span>
      </AnimatePresence>

      {/* Animated underline — re-renders on each phrase */}
      <motion.span
        key={`u-${index}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
        style={{
          display: 'block',
          height: 2,
          background: 'linear-gradient(90deg, #ebaf57, rgba(235,175,87,0.3))',
          marginTop: 6,
          transformOrigin: 'left',
        }}
      />
    </span>
  )
}
