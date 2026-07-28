'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBrand from '@/components/ui/NavBrand'
import { createClient } from '@/lib/supabase/client'

export default function NavHeader() {
  const [hasSession, setHasSession] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    // Guards against React Strict Mode's mount→cleanup→mount double-invoke
    // in dev: without this, the first effect instance's getSession() can
    // resolve AFTER its own cleanup already ran, creating and subscribing a
    // channel that never gets torn down — leaving a stale channel around
    // when the second (live) effect instance also tries to subscribe on the
    // same topic, which is what throws "cannot add postgres_changes
    // callbacks for realtime after subscribe()".
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setHasSession(!!session)
      const userId = session?.user.id
      if (!userId) return

      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('read', false)
        .then(({ count }) => {
          if (!cancelled) setUnreadCount(count ?? 0)
        })

      // .on() must be chained directly onto the same channel() call, before
      // .subscribe() — no await/async gap in between — otherwise Supabase
      // throws "cannot add postgres_changes callbacks for realtime after
      // subscribe()" because .subscribe() has already flipped the channel
      // into a joining/joined state that no longer accepts new bindings.
      channel = supabase
        .channel('nav-unread-messages')
        .on(
          'postgres_changes' as any,
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
          () => setUnreadCount((c) => c + 1)
        )
        .subscribe()
    })

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
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
                Roadmap
              </Link>
              <Link
                href="/ruche"
                className="text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
              >
                La Ruche
              </Link>
              <Link
                href="/messages"
                className="relative text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
              >
                Messages
                {unreadCount > 0 && (
                  <span
                    className="gold-gradient absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-navy-900"
                    aria-label={`${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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
