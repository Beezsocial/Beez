import type { Database } from '@/lib/supabase/types'
import type { createClient } from '@/lib/supabase/client'

type TypedSupabaseClient = ReturnType<typeof createClient>

export type MessageRow = Database['public']['Tables']['messages']['Row']

type TurnState = {
  canSend: boolean
  lastMessage: MessageRow | null
}

// The one-message-until-reply rule only gates the very FIRST message of a
// new conversation — once the other person has replied even once, the
// thread is permanently unlocked and both sides can send freely forever.
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

  // No history yet — first contact is always allowed.
  if (!lastMessage) {
    return { canSend: true, lastMessage: null }
  }

  // Has the other person ever sent current user a message in this thread?
  // If so, they've already replied at least once and the gate is off for
  // good — this is independent of who sent the *last* message.
  const { count } = await db
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', currentUserId)

  return { canSend: (count ?? 0) > 0, lastMessage }
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
