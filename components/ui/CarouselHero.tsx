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
]

export default function CarouselHero() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const timer = setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length)
        setVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
        color: '#ebaf57',
        fontStyle: 'italic',
        fontSize: '1.125rem',
        display: 'inline-block',
      }}
    >
      {ITEMS[index]}
    </span>
  )
}
