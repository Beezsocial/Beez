'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-beez py-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        border: '1px solid rgba(220,50,50,0.5)',
        color: 'rgba(220,50,50,0.8)',
        background: 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.borderColor = 'rgba(220,50,50,0.8)'
          e.currentTarget.style.color = 'rgb(220,50,50)'
          e.currentTarget.style.background = 'rgba(220,50,50,0.08)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(220,50,50,0.5)'
        e.currentTarget.style.color = 'rgba(220,50,50,0.8)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      Se déconnecter
    </button>
  )
}
