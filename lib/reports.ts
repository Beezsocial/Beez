import type { Database } from '@/lib/supabase/types'
import type { createClient } from '@/lib/supabase/client'

type TypedSupabaseClient = ReturnType<typeof createClient>

export type ReportReason = Database['public']['Tables']['reports']['Row']['reason']

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'harcelement', label: 'Harcèlement' },
  { value: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam' },
  { value: 'usurpation_identite', label: "Usurpation d'identité" },
  { value: 'autre', label: 'Autre' },
]

export async function submitReport(
  supabase: TypedSupabaseClient,
  reporterId: string,
  reportedUserId: string,
  reason: ReportReason,
  details: string,
  conversationContext: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const result = await db
    .from('reports')
    .insert({
      reporter_id: reporterId,
      reported_user_id: reportedUserId,
      reason,
      details: details.trim() || null,
      conversation_context: conversationContext || null,
    })
    .select()
    .single()

  if (!result.error) {
    // Best-effort — the report already saved successfully either way.
    fetch('/api/notify-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportedUserId, reason, details }),
    }).catch(() => {})
  }

  return result as {
    data: Database['public']['Tables']['reports']['Row'] | null
    error: { message: string } | null
  }
}
