'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { profileTypeLabels, seekingLabels } from '@/lib/validations'
import SignOutButton from './SignOutButton'

// ─── Types ────────────────────────────────────────────────────────────────────
type ProfileData = {
  firstName: string
  lastName: string
  city: string | null
  bio: string | null
  avatarUrl: string | null
  memberNumber: number | null
}

type Props = {
  profile: ProfileData
  types: string[]
  seeking: string[]
  firstPost: string | null
}

// ─── Hex avatar ───────────────────────────────────────────────────────────────
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
      className="w-24 h-[111px] relative flex items-center justify-center shrink-0"
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: 'linear-gradient(135deg, #ebaf57 0%, #d4912a 100%)',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[3px] flex items-center justify-center"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: '#0d3459',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-heading font-bold text-2xl text-gold select-none">
            {initials}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 text-xs font-medium border border-gold/40 text-gold bg-gold/8">
      {label}
    </span>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/8 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-navy border border-white/10 hover:border-white/20 text-white placeholder-white/25 px-3 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent'

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfileClient({ profile, types, seeking, firstPost }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  // Local optimistic state — updated on successful save
  const [current, setCurrent] = useState(profile)

  // Form mirrors current on edit open
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    city: profile.city ?? '',
    bio: profile.bio ?? '',
  })

  function handleEdit() {
    setForm({
      firstName: current.firstName,
      lastName: current.lastName,
      city: current.city ?? '',
      bio: current.bio ?? '',
    })
    setServerError('')
    setIsEditing(true)
  }

  function handleCancel() {
    setIsEditing(false)
    setServerError('')
  }

  async function handleSave() {
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()

    if (!firstName || !lastName) {
      setServerError('Le prénom et le nom sont obligatoires.')
      return
    }

    setSaving(true)
    setServerError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setServerError('Session expirée. Recharge la page.')
        setSaving(false)
        return
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          city: form.city.trim() || null,
          bio: form.bio.trim() || null,
        })
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state so the UI reflects changes immediately
      setCurrent((prev) => ({
        ...prev,
        firstName,
        lastName,
        city: form.city.trim() || null,
        bio: form.bio.trim() || null,
      }))

      setIsEditing(false)
      // Revalidate server-side cache for subsequent hard navigations
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setServerError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Identity block */}
      <div className="flex items-start gap-5 mb-8">
        <HexAvatar
          firstName={current.firstName}
          lastName={current.lastName}
          avatarUrl={current.avatarUrl}
        />

        <div className="flex-1 min-w-0 pt-1">
          <h1 className="font-heading font-bold text-2xl text-white leading-tight break-words">
            {current.firstName} {current.lastName}
          </h1>

          {current.city && (
            <p className="text-white/40 text-sm mt-0.5">{current.city}</p>
          )}

          {current.memberNumber != null && (
            <div className="inline-flex items-center gap-1.5 mt-2 border border-gold/30 bg-gold/8 px-2.5 py-1">
              <span className="text-gold text-xs" aria-hidden="true">✦</span>
              <span className="text-gold text-xs font-bold tracking-wide">
                Founding Member #{current.memberNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="bg-navy-950 border border-white/8 p-5 sm:p-6 space-y-5">

        {isEditing ? (
          /* ── Edit mode ── */
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom">
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Prénom"
                    disabled={saving}
                    className={inputClass}
                  />
                </Field>
                <Field label="Nom">
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="Nom"
                    disabled={saving}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Ville">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Paris, Lyon…"
                  disabled={saving}
                  className={inputClass}
                />
              </Field>

              <Field label="À propos">
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Décris ton projet, ton parcours…"
                  rows={4}
                  disabled={saving}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>

            {serverError && (
              <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2" role="alert">
                {serverError}
              </p>
            )}
          </>
        ) : (
          /* ── Read mode ── */
          <>
            {current.bio && (
              <Section title="À propos">
                <p className="text-white/70 text-sm leading-relaxed">{current.bio}</p>
              </Section>
            )}

            {types.length > 0 && (
              <Section title="Je suis">
                <div className="flex flex-wrap gap-2">
                  {types.map((t: string) => {
                    const label = profileTypeLabels[t as keyof typeof profileTypeLabels] ?? t
                    return <Pill key={t} label={label} />
                  })}
                </div>
              </Section>
            )}

            {seeking.length > 0 && (
              <Section title="Je cherche">
                <div className="flex flex-wrap gap-2">
                  {seeking.map((s: string) => {
                    const label = seekingLabels[s as keyof typeof seekingLabels] ?? s
                    return <Pill key={s} label={label} />
                  })}
                </div>
              </Section>
            )}

            {firstPost && (
              <Section title="Premier post">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {firstPost}
                </p>
              </Section>
            )}
          </>
        )}

      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold py-3 text-sm hover:bg-gold-400 active:bg-gold-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="w-full border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 font-medium py-3 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full border border-white/15 text-white/60 hover:border-white/30 hover:text-white/90 font-medium py-3 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Modifier mon profil
            </button>
            <SignOutButton />
          </>
        )}
      </div>
    </>
  )
}
