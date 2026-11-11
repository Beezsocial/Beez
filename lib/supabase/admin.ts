import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '@/lib/supabase/env'

// Client « admin » : la clé secrète passe au-dessus de toutes les règles de la
// base. Serveur uniquement : « server-only » fait échouer la compilation si un
// composant client importe ce fichier. Jamais de préfixe NEXT_PUBLIC_ pour
// cette clé.
//
// Rotation des clés : SUPABASE_SECRET_KEY en priorité, repli sur l'ancienne
// SUPABASE_SERVICE_ROLE_KEY pour basculer sans coupure. Retirer le repli une
// fois la bascule faite.
export function getSupabaseSecretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Renvoie null si la clé secrète n'est pas configurée.
export function createAdminClient() {
  const secretKey = getSupabaseSecretKey()
  if (!SUPABASE_URL || !secretKey) return null

  return createClient(SUPABASE_URL, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
