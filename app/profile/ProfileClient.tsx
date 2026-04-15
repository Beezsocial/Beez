'use client'

import { useState, useRef } from 'react'
import type { ReactNode, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  profileTypeValues,
  seekingValues,
  profileTypeLabels,
  seekingLabels,
} from '@/lib/validations'
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

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
const MAX_FILE_BYTES = 2 * 1024 * 1024 // 2 MB

// ─── Read-only hex avatar ─────────────────────────────────────────────────────
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

// ─── Editable hex avatar (edit mode) ─────────────────────────────────────────
function EditableHexAvatar({
  firstName,
  lastName,
  displayUrl,
  onFileSelect,
  disabled,
}: {
  firstName: string
  lastName: string
  displayUrl: string | null
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="shrink-0">
      <button
        type="button"
        aria-label="Changer la photo de profil"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
        className="w-24 h-[111px] relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed"
      >
        {/* Gold border hex */}
        <div
          className="absolute inset-0"
          style={{ clipPath: HEX_CLIP, background: 'linear-gradient(135deg, #ebaf57 0%, #d4912a 100%)' }}
        >
          {/* Navy inner */}
          <div
            className="absolute inset-[3px] flex items-center justify-center"
            style={{ clipPath: HEX_CLIP, background: '#0d3459' }}
          >
            {displayUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading font-bold text-2xl text-gold select-none">{initials}</span>
            )}
          </div>
          {/* Camera overlay — clipped to hex by parent clip-path */}
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.75" />
            </svg>
          </div>
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onFileSelect}
      />
    </div>
  )
}

// ─── Read-only pill ───────────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 text-xs font-medium border border-gold/40 text-gold bg-gold/8">
      {label}
    </span>
  )
}

// ─── Interactive pill toggle (edit mode) ─────────────────────────────────────
function PillToggle({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string
  selected: boolean
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={
        selected
          ? { background: 'rgba(235,175,87,0.15)', borderColor: 'rgba(235,175,87,0.5)', color: '#ebaf57' }
          : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
      }
      className={[
        'px-3 py-1.5 text-xs font-medium border rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        !selected && !disabled ? 'hover:border-gold/40 hover:text-white/80' : '',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

// ─── Read-only section ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/8 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-3">{title}</p>
      {children}
    </div>
  )
}

// ─── Edit mode field label ────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/30">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─── Edit mode section ────────────────────────────────────────────────────────
function EditSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/8 pt-5 space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/30">{title}</p>
      {children}
    </div>
  )
}

const inputBg = { background: 'rgba(255,255,255,0.04)' } as const
const inputClass =
  'w-full rounded-beez border border-white/10 hover:border-white/20 text-white placeholder-white/25 px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-gold focus:[box-shadow:0_0_0_3px_rgba(235,175,87,0.1)]'

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProfileClient({ profile, types, seeking, firstPost }: Props) {
  const router = useRouter()
  const supabase = createClient()

  // ── Read-mode state (updated optimistically after save) ──
  const [current, setCurrent] = useState(profile)
  const [currentTypes, setCurrentTypes] = useState(types)
  const [currentSeeking, setCurrentSeeking] = useState(seeking)

  // ── UI state ──
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  // ── Edit form ──
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    city: profile.city ?? '',
    bio: profile.bio ?? '',
  })
  const [editTypes, setEditTypes] = useState<string[]>([])
  const [editSeeking, setEditSeeking] = useState<string[]>([])

  // ── Avatar ──
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState('')

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleEdit() {
    setForm({
      firstName: current.firstName,
      lastName: current.lastName,
      city: current.city ?? '',
      bio: current.bio ?? '',
    })
    setEditTypes([...currentTypes])
    setEditSeeking([...currentSeeking])
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarError('')
    setServerError('')
    setSuccess(false)
    setIsEditing(true)
  }

  function handleCancel() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
    setAvatarFile(null)
    setIsEditing(false)
    setServerError('')
  }

  function toggleType(value: string) {
    setEditTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  function toggleSeeking(value: string) {
    setEditSeeking((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarError('Format non supporté. Utilise un JPEG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setAvatarError('La photo ne doit pas dépasser 2 Mo.')
      return
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarError('')
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))

    // Reset input so the same file can be re-selected after clearing
    e.target.value = ''
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

      const db = supabase as any

      // ── 1. Upload avatar if a new file was selected ──
      let newAvatarUrl = current.avatarUrl
      if (avatarFile) {
        const ext = avatarFile.type === 'image/jpeg' ? 'jpg'
          : avatarFile.type === 'image/png' ? 'png'
          : 'webp'
        const filePath = `${user.id}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('Avatars')
          .upload(filePath, avatarFile, { upsert: true, contentType: avatarFile.type })

        if (uploadError) throw new Error(`Échec du téléversement : ${uploadError.message}`)

        const { data: urlData } = supabase.storage.from('Avatars').getPublicUrl(filePath)
        newAvatarUrl = urlData.publicUrl
      }

      // ── 2. Update profiles ──
      const { error: profileError } = await db
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          city: form.city.trim() || null,
          bio: form.bio.trim() || null,
          avatar_url: newAvatarUrl,
        })
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // ── 3. Replace profile_types ──
      await db.from('profile_types').delete().eq('user_id', user.id)
      if (editTypes.length > 0) {
        const { error: typesError } = await db
          .from('profile_types')
          .insert(editTypes.map((type) => ({ user_id: user.id, type })))
        if (typesError) throw typesError
      }

      // ── 4. Replace seeking ──
      await db.from('seeking').delete().eq('user_id', user.id)
      if (editSeeking.length > 0) {
        const { error: seekingError } = await db
          .from('seeking')
          .insert(editSeeking.map((seeking_type) => ({ user_id: user.id, seeking_type })))
        if (seekingError) throw seekingError
      }

      // ── 5. Update local state ──
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
      setCurrent((prev) => ({
        ...prev,
        firstName,
        lastName,
        city: form.city.trim() || null,
        bio: form.bio.trim() || null,
        avatarUrl: newAvatarUrl,
      }))
      setCurrentTypes(editTypes)
      setCurrentSeeking(editSeeking)
      setAvatarFile(null)
      setAvatarPreview(null)

      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.'
      setServerError(msg)
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Identity block */}
      <div className="flex items-start gap-5 mb-8">
        {isEditing ? (
          <div className="flex flex-col items-center gap-1.5">
            <EditableHexAvatar
              firstName={form.firstName || current.firstName}
              lastName={form.lastName || current.lastName}
              displayUrl={avatarPreview ?? current.avatarUrl}
              onFileSelect={handleFileSelect}
              disabled={saving}
            />
            <span className="text-[10px] text-white/30 text-center leading-tight">
              Changer<br />la photo
            </span>
            {avatarError && (
              <p className="text-[10px] text-red-400 text-center max-w-[96px]">{avatarError}</p>
            )}
          </div>
        ) : (
          <HexAvatar
            firstName={current.firstName}
            lastName={current.lastName}
            avatarUrl={current.avatarUrl}
          />
        )}

        <div className="flex-1 min-w-0 pt-1">
          <h1 className="font-heading font-bold text-2xl text-white leading-tight break-words">
            {current.firstName} {current.lastName}
          </h1>
          {current.city && (
            <p className="text-white/40 text-sm mt-0.5">{current.city}</p>
          )}
          {current.memberNumber != null && current.memberNumber <= 150 ? (
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1"
              style={{
                background: 'rgba(235,175,87,0.12)',
                border: '1px solid rgba(235,175,87,0.4)',
                borderRadius: 6,
              }}
            >
              <span className="text-gold text-xs" aria-hidden="true">✦</span>
              <span className="text-gold text-xs font-bold tracking-wide">
                Founding Member #{current.memberNumber}
              </span>
            </div>
          ) : current.memberNumber != null ? (
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
              }}
            >
              <span className="text-white/40 text-xs font-medium">
                Membre #{current.memberNumber}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Card body */}
      <div className="card p-5 sm:p-6 space-y-5">

        {isEditing ? (
          /* ── Edit mode ────────────────────────────────────────────── */
          <>
            {/* Basic info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom">
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Prénom"
                    disabled={saving}
                    style={inputBg}
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
                    style={inputBg}
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
                  style={inputBg}
                />
              </Field>
            </div>

            {/* Profile types */}
            <EditSection title="Je suis">
              <div className="flex flex-wrap gap-2">
                {profileTypeValues.map((value) => (
                  <PillToggle
                    key={value}
                    label={profileTypeLabels[value]}
                    selected={editTypes.includes(value)}
                    onClick={() => toggleType(value)}
                    disabled={saving}
                  />
                ))}
              </div>
            </EditSection>

            {/* Seeking */}
            <EditSection title="Je cherche">
              <div className="flex flex-wrap gap-2">
                {seekingValues.map((value) => (
                  <PillToggle
                    key={value}
                    label={seekingLabels[value]}
                    selected={editSeeking.includes(value)}
                    onClick={() => toggleSeeking(value)}
                    disabled={saving}
                  />
                ))}
              </div>
            </EditSection>

            {serverError && (
              <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2" role="alert">
                {serverError}
              </p>
            )}
          </>
        ) : (
          /* ── Read mode ────────────────────────────────────────────── */
          <>
            {current.bio && (
              <Section title="À propos">
                <p className="text-white/70 text-sm leading-relaxed">{current.bio}</p>
              </Section>
            )}

            {currentTypes.length > 0 && (
              <Section title="Je suis">
                <div className="flex flex-wrap gap-2">
                  {currentTypes.map((t) => {
                    const label = profileTypeLabels[t as keyof typeof profileTypeLabels] ?? t
                    return <Pill key={t} label={label} />
                  })}
                </div>
              </Section>
            )}

            {currentSeeking.length > 0 && (
              <Section title="Je cherche">
                <div className="flex flex-wrap gap-2">
                  {currentSeeking.map((s) => {
                    const label = seekingLabels[s as keyof typeof seekingLabels] ?? s
                    return <Pill key={s} label={label} />
                  })}
                </div>
              </Section>
            )}

            {firstPost && (
              <Section title="Premier post">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{firstPost}</p>
              </Section>
            )}
          </>
        )}
      </div>

      {/* Success banner */}
      {success && !isEditing && (
        <div className="mt-4 flex items-center gap-2 border border-gold/30 bg-gold/8 px-4 py-3" role="status">
          <span className="text-gold text-xs" aria-hidden="true">✦</span>
          <span className="text-gold text-sm font-medium">Profil mis à jour ✓</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-navy-900 font-bold rounded-beez py-3 text-sm transition-all duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="w-full border border-white/15 text-white/50 hover:text-white/80 hover:border-white/25 font-medium rounded-beez py-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full font-medium rounded-beez py-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{
                border: '1px solid #ebaf57',
                color: '#ebaf57',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(235,175,87,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
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
