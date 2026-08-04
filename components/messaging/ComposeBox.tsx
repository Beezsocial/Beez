'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getTurnState, sendMessage } from '@/lib/messages'

type Props = {
  currentUserId: string
  recipientUserId: string
  recipientName: string
  onSent?: () => void
  autoFocus?: boolean
}

export default function ComposeBox({
  currentUserId,
  recipientUserId,
  recipientName,
  onSent,
  autoFocus,
}: Props) {
  const [content, setContent] = useState('')
  const [canSend, setCanSend] = useState<boolean | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setCanSend(null)
    const supabase = createClient()
    getTurnState(supabase, currentUserId, recipientUserId).then(({ canSend }) => {
      if (active) setCanSend(canSend)
    })
    return () => {
      active = false
    }
  }, [currentUserId, recipientUserId])

  async function handleSend() {
    const trimmed = content.trim()
    if (!trimmed || sending || canSend !== true) return
    setSending(true)
    setError(null)
    const supabase = createClient()
    const { error } = await sendMessage(supabase, currentUserId, recipientUserId, trimmed)
    setSending(false)
    if (error) {
      setError("Une erreur est survenue, réessaie.")
      return
    }
    setContent('')
    // Re-check the real turn state instead of assuming we're now blocked —
    // if the other person has ever replied in this thread, it's permanently
    // unlocked and this send must not gate the next one.
    const { canSend: stillCanSend } = await getTurnState(supabase, currentUserId, recipientUserId)
    setCanSend(stillCanSend)
    onSent?.()
  }

  const waiting = canSend === false
  const disabled = canSend !== true || sending

  return (
    <div>
      <p className="text-white/50 text-xs mb-2">
        Message à <span className="text-white font-medium">{recipientName}</span>
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
        placeholder={waiting ? 'En attente de sa réponse...' : 'Écris ton message...'}
        rows={3}
        autoFocus={autoFocus}
        maxLength={2000}
        className="input-beez resize-none w-full disabled:opacity-60"
      />
      <div className="flex items-center justify-between mt-2 gap-3">
        {waiting ? (
          <p className="text-gold/70 text-xs">En attente de sa réponse...</p>
        ) : error ? (
          <p className="text-red-400 text-xs">{error}</p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !content.trim()}
          className="gold-gradient gold-shine shrink-0 inline-flex items-center gap-2 text-navy-900 font-bold rounded-beez px-5 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:brightness-110"
        >
          {sending ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>
    </div>
  )
}
