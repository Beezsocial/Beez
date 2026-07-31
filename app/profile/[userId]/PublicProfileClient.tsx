'use client'

import { useState } from 'react'
import ComposeBox from '@/components/messaging/ComposeBox'
import ProfileView, { type ProfileViewData } from '@/components/profile/ProfileView'

type Props = {
  currentUserId: string
  targetUserId: string
  profile: ProfileViewData
  types: string[]
  seeking: string[]
}

export default function PublicProfileClient({ currentUserId, targetUserId, profile, types, seeking }: Props) {
  const [composeOpen, setComposeOpen] = useState(false)

  return (
    <div>
      <ProfileView profile={profile} types={types} seeking={seeking} />

      <div className="mt-8">
        {composeOpen ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold mb-2.5 px-1">Contacter</p>
            <div className="card p-6">
              <ComposeBox
                currentUserId={currentUserId}
                recipientUserId={targetUserId}
                recipientName={`${profile.firstName} ${profile.lastName}`}
                autoFocus
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setComposeOpen(true)}
            className="w-full gold-gradient gold-shine font-bold text-navy-900 rounded-beez py-3.5 text-sm transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Contacter {profile.firstName}
          </button>
        )}
      </div>
    </div>
  )
}
