'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LOGO_DARK_SRC, logoBoxStyle } from '@/components/ui/Logo'

export default function NavBrand({ height = 36 }: { height?: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const fontSize = Math.round(height * 0.56)

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Beez — accueil"
    >
      {!imgFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGO_DARK_SRC}
          alt=""
          className="logo-halo"
          style={logoBoxStyle(height)}
          onError={() => setImgFailed(true)}
        />
      )}
      <span
        className="font-heading font-bold"
        style={{ fontSize, letterSpacing: '-0.02em', lineHeight: 1 }}
        aria-hidden="true"
      >
        <span style={{ color: '#ffffff' }}>Bee</span>
        <span style={{ color: '#57d9eb' }}>z</span>
      </span>
    </Link>
  )
}
