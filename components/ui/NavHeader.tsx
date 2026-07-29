'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import NavBrand from '@/components/ui/NavBrand'
import { createClient } from '@/lib/supabase/client'

const HEADER_HEIGHT = 56

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function MobileNavLink({
  href,
  onClick,
  gold,
  external,
  children,
}: {
  href: string
  onClick: () => void
  gold?: boolean
  external?: boolean
  children: React.ReactNode
}) {
  const className = `flex items-center justify-between gap-3 px-4 py-4 text-base font-medium transition-colors duration-150 hover:bg-white/5 active:bg-white/10 ${
    gold ? 'text-gold' : 'text-white/80 hover:text-gold'
  }`

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}

export default function NavHeader() {
  const pathname = usePathname()
  const showBackLink = pathname !== '/'
  const [hasSession, setHasSession] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/6"
        style={{
          // Inline position/zIndex, not just the fixed/z-50 classes: pages
          // that mount NavHeader as a direct child of a `.honeycomb-bg`
          // container pick up globals.css's `.honeycomb-bg > *` rule, which
          // forces position:relative + z-index:1 at the same specificity —
          // whichever declaration is later in the stylesheet wins on a
          // class-vs-class tie, silently breaking the fixed header. Inline
          // styles always win over stylesheet rules, so this is immune
          // regardless of where the header ends up mounted.
          position: 'fixed',
          zIndex: 50,
          background: 'rgba(8,43,68,0.92)',
          height: HEADER_HEIGHT,
        }}
      >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackLink && (
            <Link
              href="/"
              className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              ← Accueil
            </Link>
          )}
          <NavBrand height={36} />
        </div>

        {/* Desktop nav — unchanged, hidden below md (~768px) */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="https://www.instagram.com/beez.social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Beez sur Instagram"
            className="text-white/60 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <InstagramIcon />
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

        {/* Mobile hamburger toggle — visible only below md */}
        <button
          type="button"
          className="md:hidden relative text-white/70 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-beez p-1.5"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
          {/* Small unread indicator on the collapsed hamburger — the numbered
              badge itself lives in the panel, but this keeps the "you have
              unread messages" signal visible even while the menu is closed. */}
          {!mobileMenuOpen && hasSession && unreadCount > 0 && (
            <span
              className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ background: '#ebaf57' }}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </header>

      {/* Mobile menu backdrop + panel — rendered as siblings of <header>,
          not descendants: <header> has backdrop-blur (backdrop-filter),
          which establishes a new containing block for fixed-position
          descendants, so nesting these inside it collapsed their computed
          height to 0 instead of resolving top/bottom against the viewport.
          They're also wrapped in a plain div rather than being direct
          children of the page root: globals.css's `.honeycomb-bg > *`
          rule force-sets position:relative (and z-index:1) on direct
          children, which would clobber `fixed` on elements at that level
          — and, even once nested one level deeper to dodge that, still
          traps the wrapper itself in a z-index:1 stacking context that
          loses to later same-z-index siblings like the hero section, so
          the wrapper needs its own explicit z-index override too. */}
      <div style={{ zIndex: 50 }}>
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-x-0 bottom-0"
              style={{ top: HEADER_HEIGHT, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              className="md:hidden fixed inset-x-0"
              style={{
                top: HEADER_HEIGHT,
                zIndex: 45,
                background: '#082b44',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col py-2" aria-label="Menu principal">
                {hasSession ? (
                  <>
                    <MobileNavLink href="/roadmap" onClick={closeMenu}>
                      Roadmap
                    </MobileNavLink>
                    <MobileNavLink href="/ruche" onClick={closeMenu}>
                      La Ruche
                    </MobileNavLink>
                    <MobileNavLink href="/messages" onClick={closeMenu}>
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <span
                          className="gold-gradient min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-bold text-navy-900"
                          aria-label={`${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`}
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </MobileNavLink>
                    <MobileNavLink href="/profile" onClick={closeMenu} gold>
                      Mon profil
                    </MobileNavLink>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/signin" onClick={closeMenu}>
                      Se connecter
                    </MobileNavLink>
                    <MobileNavLink href="#signup" onClick={closeMenu}>
                      Rejoindre →
                    </MobileNavLink>
                  </>
                )}
                <MobileNavLink href="https://www.instagram.com/beez.social" onClick={closeMenu} external>
                  <span className="flex items-center gap-3">
                    <InstagramIcon />
                    Instagram
                  </span>
                </MobileNavLink>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </>
  )
}
