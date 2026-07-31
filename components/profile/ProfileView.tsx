import type { ReactNode } from 'react'
import FoundingMemberBadge from '@/components/ui/FoundingMemberBadge'
import { profileTypeLabels, seekingLabels } from '@/lib/validations'

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

export type ProfileViewData = {
  firstName: string
  lastName: string
  city: string | null
  bio: string | null
  avatarUrl: string | null
  memberNumber: number | null
}

type Props = {
  profile: ProfileViewData
  types: string[]
  seeking: string[]
}

// ─── Read-only hex avatar — same layered gold-hex technique used across
// the app (profile, ruche grid, compose previews) ──────────────────────────
function HexAvatar({
  firstName,
  lastName,
  avatarUrl,
}: {
  firstName: string
  lastName: string
  avatarUrl: string | null
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  return (
    <div
      className="w-24 h-[83px] relative flex items-center justify-center shrink-0"
      style={{ clipPath: HEX_CLIP, background: 'linear-gradient(135deg, #ebaf57 0%, #d4912a 100%)' }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[3px] flex items-center justify-center"
        style={{ clipPath: HEX_CLIP, background: '#0d3459' }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading font-bold text-2xl text-gold select-none">{initials}</span>
        )}
      </div>
    </div>
  )
}

// ─── Identity block — avatar overlapping the half-hexagon name tile.
// `avatarSlot` lets a caller (e.g. the editable own-profile view) swap in
// an interactive avatar without duplicating the tile markup around it. ────
export function ProfileIdentity({
  profile,
  types,
  avatarSlot,
}: {
  profile: ProfileViewData
  types: string[]
  avatarSlot?: ReactNode
}) {
  const isFounder = types.includes('entrepreneur_actif')
  const isStarter = !isFounder && types.includes('futur_entrepreneur')

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minHeight: profile.memberNumber != null && profile.memberNumber <= 150 ? 110 : 83,
      }}
    >
      <div style={{ position: 'absolute', left: 32, right: 0, top: 0, bottom: 0, zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(235,175,87,0.4)',
            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)',
            borderRadius: '10px 0 0 10px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 1, right: 1, bottom: 1, left: 1,
            background: '#041625',
            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)',
            borderRadius: '10px 0 0 10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingLeft: 80, paddingRight: 48 }}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-lg text-white leading-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              {isFounder && <span className="text-sm text-white/60 font-medium">🐝 Founder</span>}
              {isStarter && <span className="text-sm text-white/60 font-medium">🌱 Starter</span>}
            </div>
            {profile.city && <p className="text-white/50 text-sm mt-0.5">{profile.city}</p>}
            {profile.memberNumber != null && profile.memberNumber <= 150 && (
              <div className="mt-1">
                <FoundingMemberBadge memberNumber={profile.memberNumber} size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        {avatarSlot ?? (
          <HexAvatar firstName={profile.firstName} lastName={profile.lastName} avatarUrl={profile.avatarUrl} />
        )}
      </div>
    </div>
  )
}

// ─── Section label + icon, sits above a card so the eye immediately knows
// what it's looking at before reading the card content ─────────────────────
function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5 px-1">
      <span className="text-gold" aria-hidden="true">{icon}</span>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">{children}</p>
    </div>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 text-xs font-medium border border-gold/40 text-gold bg-gold/8 rounded-beez">
      {label}
    </span>
  )
}

const BioIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const IdentityIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M4.5 20c1.5-4 4.5-6 7.5-6s6 2 7.5 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const SeekingIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M20 20l-4.8-4.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

// ─── Card stack — one clearly bordered card per piece of information, each
// with its own section label above it, generous vertical rhythm between
// them so nothing reads as a LinkedIn-style wall of unstructured text. ─────
export function ProfileCards({ profile, types, seeking }: Props) {
  return (
    <div className="space-y-6">
      {profile.bio && (
        <div>
          <SectionLabel icon={BioIcon}>Bio</SectionLabel>
          <div className="card p-6">
            <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        </div>
      )}

      {types.length > 0 && (
        <div>
          <SectionLabel icon={IdentityIcon}>Je suis</SectionLabel>
          <div className="card p-6">
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <Pill key={t} label={profileTypeLabels[t as keyof typeof profileTypeLabels] ?? t} />
              ))}
            </div>
          </div>
        </div>
      )}

      {seeking.length > 0 && (
        <div>
          <SectionLabel icon={SeekingIcon}>Je recherche</SectionLabel>
          <div className="card p-6">
            <div className="flex flex-wrap gap-2">
              {seeking.map((s) => (
                <Pill key={s} label={seekingLabels[s as keyof typeof seekingLabels] ?? s} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfileView({ profile, types, seeking }: Props) {
  return (
    <div>
      <ProfileIdentity profile={profile} types={types} />
      <div className="mt-8">
        <ProfileCards profile={profile} types={types} seeking={seeking} />
      </div>
    </div>
  )
}
