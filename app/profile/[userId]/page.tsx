import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavHeader from '@/components/ui/NavHeader'
import PublicProfileClient from './PublicProfileClient'

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getTargetProfile(userId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const [profileRes, typesRes, seekingRes] = await Promise.all([
    db
      .from('profiles')
      .select('first_name, last_name, city, bio, avatar_url, member_number')
      .eq('user_id', userId)
      .maybeSingle(),
    db.from('profile_types').select('type').eq('user_id', userId),
    db.from('seeking').select('seeking_type').eq('user_id', userId),
  ])

  if (!profileRes.data) return null

  return {
    profile: profileRes.data,
    types: (typesRes.data ?? []).map((r: any) => r.type),
    seeking: (seekingRes.data ?? []).map((r: any) => r.seeking_type),
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  // Visiting your own public profile link just shows your real (editable) page.
  if (user.id === userId) {
    redirect('/profile')
  }

  const data = await getTargetProfile(userId)

  return (
    <div className="min-h-screen bg-navy honeycomb-bg flex flex-col">
      <NavHeader />

      <main className="flex-1 px-4 sm:px-6 py-8 max-w-lg mx-auto w-full pt-20">
        {data ? (
          <PublicProfileClient
            currentUserId={user.id}
            targetUserId={userId}
            profile={{
              firstName: data.profile.first_name,
              lastName: data.profile.last_name,
              city: data.profile.city ?? null,
              bio: data.profile.bio ?? null,
              avatarUrl: data.profile.avatar_url ?? null,
              memberNumber: data.profile.member_number ?? null,
            }}
            types={data.types}
            seeking={data.seeking}
          />
        ) : (
          <div className="card p-8 text-center">
            <p className="text-3xl mb-3" aria-hidden="true">🔍</p>
            <h1 className="font-heading font-bold text-white text-lg mb-2">Profil introuvable</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Ce membre n'existe pas ou son profil a été supprimé.
            </p>
            <Link
              href="/ruche"
              className="inline-block border border-white/15 text-white/70 hover:text-white hover:border-white/25 font-medium rounded-beez px-5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Retour à La Ruche
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
