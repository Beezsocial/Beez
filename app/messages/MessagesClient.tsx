'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ComposeBox from '@/components/messaging/ComposeBox'
import type { MessageRow } from '@/lib/messages'

type OtherProfile = {
  user_id: string
  first_name: string
  last_name: string
  avatar_url: string | null
}

type Conversation = {
  otherUserId: string
  lastMessage: MessageRow
  unreadCount: number
}

function formatTimestamp(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export default function MessagesClient({ currentUserId }: { currentUserId: string }) {
  const [loading, setLoading] = useState(true)
  const [allMessages, setAllMessages] = useState<MessageRow[]>([])
  const [profiles, setProfiles] = useState<Record<string, OtherProfile>>({})
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let active = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any

    async function load() {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false })

      if (!active) return
      const list: MessageRow[] = messages ?? []
      setAllMessages(list)

      const otherIds = Array.from(
        new Set(list.map((m) => (m.sender_id === currentUserId ? m.receiver_id : m.sender_id)))
      )

      if (otherIds.length > 0) {
        const { data: profileRows } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name, avatar_url')
          .in('user_id', otherIds)

        if (!active) return
        const map: Record<string, OtherProfile> = {}
        for (const p of profileRows ?? []) map[p.user_id] = p
        setProfiles(map)
      }

      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [currentUserId, refreshTick])

  const conversations = useMemo<Conversation[]>(() => {
    const byUser = new Map<string, Conversation>()
    for (const m of allMessages) {
      const otherUserId = m.sender_id === currentUserId ? m.receiver_id : m.sender_id
      const existing = byUser.get(otherUserId)
      const isUnreadForMe = m.receiver_id === currentUserId && !m.read
      if (!existing) {
        byUser.set(otherUserId, { otherUserId, lastMessage: m, unreadCount: isUnreadForMe ? 1 : 0 })
      } else if (isUnreadForMe) {
        existing.unreadCount += 1
      }
    }
    // allMessages is already ordered created_at desc, and Map preserves
    // first-insertion order, so this is already sorted by most recent.
    return Array.from(byUser.values())
  }, [allMessages, currentUserId])

  const thread = useMemo(
    () =>
      selectedUserId
        ? allMessages
            .filter((m) => m.sender_id === selectedUserId || m.receiver_id === selectedUserId)
            .slice()
            .reverse()
        : [],
    [allMessages, selectedUserId]
  )

  async function openConversation(otherUserId: string) {
    setSelectedUserId(otherUserId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', currentUserId)
      .eq('read', false)

    if (!error) {
      setAllMessages((prev) =>
        prev.map((m) =>
          m.sender_id === otherUserId && m.receiver_id === currentUserId && !m.read
            ? { ...m, read: true }
            : m
        )
      )
    }
  }

  const selectedProfile = selectedUserId ? profiles[selectedUserId] : null

  return (
    <div className="flex-1 flex overflow-hidden relative z-10">
      {/* Conversation list */}
      <div
        className={`${selectedUserId ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-80 sm:border-r border-white/6 shrink-0 overflow-y-auto`}
      >
        <div className="px-4 sm:px-6 pt-6 pb-3 shrink-0">
          <h1 className="font-heading font-bold text-2xl text-white tracking-tight">Messages</h1>
        </div>

        {loading ? (
          <p className="text-white/40 text-sm px-4 sm:px-6">Chargement...</p>
        ) : conversations.length === 0 ? (
          <p className="text-white/40 text-sm px-4 sm:px-6">
            Aucune conversation pour l'instant. Rends-toi sur{' '}
            <a href="/ruche" className="text-gold hover:underline">
              La Ruche
            </a>{' '}
            pour envoyer un message.
          </p>
        ) : (
          <ul>
            {conversations.map(({ otherUserId, lastMessage, unreadCount }) => {
              const profile = profiles[otherUserId]
              const name = profile ? `${profile.first_name} ${profile.last_name}` : 'Membre Beez'
              const initials = profile
                ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
                : '?'
              const isMine = lastMessage.sender_id === currentUserId

              return (
                <li key={otherUserId}>
                  <button
                    type="button"
                    onClick={() => openConversation(otherUserId)}
                    className={`w-full flex items-center gap-3 px-4 sm:px-6 py-3 text-left transition-colors duration-150 hover:bg-white/5 ${
                      selectedUserId === otherUserId ? 'bg-white/5' : ''
                    }`}
                  >
                    <div
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
                      style={{ background: '#0D2E4A', border: '1px solid rgba(235,175,87,0.25)' }}
                    >
                      {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading font-bold text-gold text-sm">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white text-sm font-medium truncate">{name}</p>
                        <span className="text-white/30 text-xs shrink-0">
                          {formatTimestamp(lastMessage.created_at)}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs truncate mt-0.5">
                        {isMine ? 'Toi : ' : ''}
                        {lastMessage.content}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span
                        className="shrink-0 w-2.5 h-2.5 rounded-full"
                        style={{ background: '#ebaf57' }}
                        aria-label={`${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}`}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Thread view */}
      <div className={`${selectedUserId ? 'flex' : 'hidden sm:flex'} flex-col flex-1 min-w-0`}>
        {selectedUserId ? (
          <>
            <div className="shrink-0 flex items-center gap-3 px-4 sm:px-6 h-14 border-b border-white/6">
              <button
                type="button"
                onClick={() => setSelectedUserId(null)}
                className="sm:hidden text-white/50 hover:text-white transition-colors duration-200"
                aria-label="Retour aux conversations"
              >
                ←
              </button>
              <p className="text-white font-medium text-sm">
                {selectedProfile ? `${selectedProfile.first_name} ${selectedProfile.last_name}` : 'Membre Beez'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
              {thread.map((m) => {
                const isMine = m.sender_id === currentUserId
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[75%] rounded-beez px-4 py-2.5 text-sm"
                      style={
                        isMine
                          ? { background: '#ebaf57', color: '#082b44', fontWeight: 500 }
                          : { background: '#0D2E4A', color: '#ffffff', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <p
                        className="text-[11px] mt-1"
                        style={{ color: isMine ? 'rgba(8,43,68,0.6)' : 'rgba(255,255,255,0.4)' }}
                      >
                        {formatTimestamp(m.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="shrink-0 border-t border-white/6 px-4 sm:px-6 py-4">
              <ComposeBox
                currentUserId={currentUserId}
                recipientUserId={selectedUserId}
                recipientName={
                  selectedProfile ? `${selectedProfile.first_name} ${selectedProfile.last_name}` : 'ce membre'
                }
                onSent={() => setRefreshTick((t) => t + 1)}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 hidden sm:flex items-center justify-center">
            <p className="text-white/30 text-sm">Sélectionne une conversation</p>
          </div>
        )}
      </div>
    </div>
  )
}
