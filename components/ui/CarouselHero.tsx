'use client'

import { useState, useEffect } from 'react'

const ITEMS = [
  'Partage la création de ton projet',
  'Reçois des encouragements',
  'Trouve un associé',
  'Attire tes premiers clients',
  'Teste ton idée',
  'Construis ta communauté',
  'Lève des fonds',
  'Trouve un mentor',
  'Rends visible la vie de ta startup',
]

export default function CarouselHero() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [underlineKey, setUnderlineKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const timer = setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length)
        setUnderlineKey((k) => k + 1)
        setVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-block text-center">
      <span
        style={{
          display: 'block',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          color: '#ebaf57',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(24px, 4vw, 36px)',
          textShadow: '0 0 20px rgba(235,175,87,0.5), 0 0 40px rgba(235,175,87,0.2)',
          lineHeight: 1.2,
        }}
      >
        {ITEMS[index]}
      </span>
      {/* Animated underline — key triggers CSS animation restart on each phrase */}
      <span
        key={underlineKey}
        style={{
          display: 'block',
          height: 2,
          background: 'linear-gradient(90deg, #ebaf57, rgba(235,175,87,0.3))',
          marginTop: 6,
          transformOrigin: 'left',
          animation: 'slideInUnderline 0.4s ease forwards',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </span>
  )
}
