'use client'

import { useState, type CSSProperties } from 'react'

export const LOGO_DARK_SRC = '/images/logo-dark-v3.svg'

// Le logo v3 sort de Canva en carré, avec plus de marge que le v2
// (1080×1350, abeille = 40 % de la hauteur, contre 53,9 % en v3). Pour garder
// la même abeille à l'écran ET la même boîte (donc la même mise en page),
// on conserve la boîte du v2 (hauteur h, largeur 0,8 h) et on ramène l'image
// à 74,2 % de h (0,4 / 0,539) par un padding vertical + object-fit.
export function logoBoxStyle(height: number): CSSProperties {
  return {
    display: 'block',
    height,
    width: height * 0.8,
    padding: `${height * 0.129}px 0`,
    boxSizing: 'border-box',
    objectFit: 'contain',
  }
}

interface LogoProps {
  height?: number
  className?: string
}

export default function Logo({ height = 36, className = '' }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={`font-heading font-extrabold tracking-tight ${className}`}
        style={{ fontSize: Math.round(height * 0.56) + 'px' }}
      >
        <span className="text-white">Bee</span>
        <span className="text-accent">z</span>
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_DARK_SRC}
      alt="Beez"
      height={height}
      style={logoBoxStyle(height)}
      onError={() => setFailed(true)}
      className={`logo-halo ${className}`.trim()}
    />
  )
}
