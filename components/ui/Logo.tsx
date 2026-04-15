'use client'

import { useState } from 'react'

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
        <span className="text-gold">z</span>
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-dark.png"
      alt="Beez"
      height={height}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
