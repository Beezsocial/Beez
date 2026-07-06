import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavBrand from '@/components/ui/NavBrand'
import RucheClient from './RucheClient'

export default async function RuchePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/signin')
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#ffffff' }}>
      <header
        className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/6 backdrop-blur-md z-20"
        style={{ background: 'rgba(8,43,68,0.92)' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Accueil
          </Link>
          <NavBrand height={36} />
        </div>
        <span className="text-white/30 text-xs">La Ruche</span>
      </header>

      <RucheClient />
    </div>
  )
}
