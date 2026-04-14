import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProfileClient from './ProfileClient'

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getFullProfile() {
  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) return null

    const userId = authData.user.id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const [profileRes, typesRes, seekingRes, postRes] = await Promise.all([
      db
        .from('profiles')
        .select('first_name, last_name, city, bio, avatar_url, member_number')
        .eq('user_id', userId)
        .single(),
      db
        .from('profile_types')
        .select('type')
        .eq('user_id', userId),
      db
        .from('seeking')
        .select('seeking_type')
        .eq('user_id', userId),
      db
        .from('first_posts')
        .select('content')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle(),
    ])

    if (!profileRes.data) return null

    return {
      profile: profileRes.data,
      types: (typesRes.data ?? []).map((r: any) => r.type),
      seeking: (seekingRes.data ?? []).map((r: any) => r.seeking_type),
      firstPost: postRes.data?.content ?? null,
    }
  } catch {
    return null
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProfilePage() {
  const data = await getFullProfile()

  if (!data) {
    redirect('/onboarding')
  }

  const { profile, types, seeking, firstPost } = data

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Accueil
          </Link>
          <Link
            href="/"
            className="font-heading font-extrabold text-xl tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="text-white">B</span>
            <span className="text-gold">eez</span>
          </Link>
        </div>
        <span className="text-white/30 text-xs">Mon profil</span>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-lg mx-auto w-full">
        <ProfileClient
          profile={{
            firstName: profile.first_name,
            lastName: profile.last_name,
            city: profile.city ?? null,
            bio: profile.bio ?? null,
            avatarUrl: profile.avatar_url ?? null,
            memberNumber: profile.member_number ?? null,
          }}
          types={types}
          seeking={seeking}
          firstPost={firstPost}
        />
      </main>
    </div>
  )
}
