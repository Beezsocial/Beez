'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBrand from '@/components/ui/NavBrand'
import { createClient } from '@/lib/supabase/client'

export default function NavHeader() {
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/6"
      style={{ background: 'rgba(8,43,68,0.92)', height: 56 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <NavBrand height={36} />
        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/beez.social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Beez sur Instagram"
            className="text-white/60 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
          {hasSession ? (
            <>
              <Link
                href="/roadmap"
                className="text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
              >
                Roadmap →
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-gold hover:text-gold/80 transition-colors duration-200"
              >
                Mon profil
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-200"
              >
                Se connecter
              </Link>
              <Link
                href="#signup"
                className="text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
              >
                Rejoindre →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
