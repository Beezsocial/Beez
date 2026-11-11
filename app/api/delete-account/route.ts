import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const AVATARS_BUCKET = 'Avatars'
const PAGE_SIZE = 100

// Tables rattachées au membre par user_id. Le profil passe en dernier : tant
// qu'il existe, la page /profile reste accessible pour retenter la suppression.
const USER_TABLES = ['first_posts', 'profile_types', 'seeking', 'profiles'] as const

const FAILED =
  "La suppression n'est pas allée jusqu'au bout. Réessaie dans un instant ; si ça persiste, écris-nous à contact@joinbeez.com."

// Chemins de tous les fichiers d'un dossier du bucket, sous-dossiers compris.
async function listAvatarFiles(admin: SupabaseClient, folder: string): Promise<string[]> {
  const paths: string[] = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await admin.storage
      .from(AVATARS_BUCKET)
      .list(folder, { limit: PAGE_SIZE, offset })
    if (error) throw error

    for (const entry of data) {
      const path = `${folder}/${entry.name}`
      // Un sous-dossier n'a pas d'id : on liste son contenu.
      if (entry.id === null) paths.push(...(await listAvatarFiles(admin, path)))
      else paths.push(path)
    }
    if (data.length < PAGE_SIZE) return paths
  }
}

// Supprime le compte de l'utilisateur CONNECTÉ, et lui seul : l'identifiant
// vient de la session, rien n'est lu dans la requête. Chaque étape peut être
// relancée sans dégât si la précédente tentative s'est arrêtée en route.
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Session expirée. Recharge la page.' }, { status: 401 })
    }
    const userId = user.id

    const admin = createAdminClient()
    if (!admin) {
      console.error('[delete-account] Supabase secret key not set.')
      return NextResponse.json({ error: FAILED }, { status: 500 })
    }

    // ── 1. Photos : tout le dossier du membre dans le bucket Avatars ─────────
    // Avant le compte : Supabase refuse de supprimer un compte qui possède
    // encore des fichiers.
    const paths = await listAvatarFiles(admin, userId)
    for (let i = 0; i < paths.length; i += PAGE_SIZE) {
      const { error } = await admin.storage.from(AVATARS_BUCKET).remove(paths.slice(i, i + PAGE_SIZE))
      if (error) throw error
    }
    if ((await listAvatarFiles(admin, userId)).length > 0) {
      throw new Error('Avatar files still present after removal.')
    }

    // ── 2. Lignes du membre ─────────────────────────────────────────────────
    for (const table of USER_TABLES) {
      const { error } = await admin.from(table).delete().eq('user_id', userId)
      if (error) throw error
    }

    // ── 3. Compte auth (clé secrète) ────────────────────────────────────────
    // Les clés étrangères ON DELETE CASCADE effacent avec lui ses messages,
    // envoyés et reçus, comme l'annonce /privacy, ainsi que les signalements
    // qu'il a faits ou qui le visent.
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId)
    if (deleteError) throw deleteError

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[delete-account] Unexpected error:', err)
    return NextResponse.json({ error: FAILED }, { status: 500 })
  }
}
