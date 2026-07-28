import type { Database } from '@/lib/supabase/types'
import type { createClient } from '@/lib/supabase/client'

type TypedSupabaseClient = ReturnType<typeof createClient>

export type MessageRow = Database['public']['Tables']['messages']['Row']

type TurnState = {
  canSend: boolean
  lastMessage: MessageRow | null
}

// One message until reply: the current user can send if there is no message
// history yet between the two of them, or if the last message in the thread
// was NOT sent by the current user (i.e. it's their turn to reply/initiate).
export async function getTurnState(
  supabase: TypedSupabaseClient,
  currentUserId: string,
  otherUserId: string
): Promise<TurnState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data } = await db
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`
    )
    .order('created_at', { ascending: false })
    .limit(1)

  const lastMessage: MessageRow | null = data?.[0] ?? null
  return { canSend: !lastMessage || lastMessage.sender_id !== currentUserId, lastMessage }
}

export async function sendMessage(
  supabase: TypedSupabaseClient,
  senderId: string,
  receiverId: string,
  content: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const result = await db
    .from('messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, content })
    .select()
    .single()

  if (!result.error) {
    // Best-effort — the message already sent successfully either way.
    fetch('/api/notify-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId }),
    }).catch(() => {})
  }

  return result as { data: MessageRow | null; error: { message: string } | null }
}
