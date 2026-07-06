'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
const LIFT_TRANSITION = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }
const GAP = 4
// Breathing room so the bio tooltip (which floats above/beside a hex) never
// gets clipped by the scroll container when the hex sits on the top row or
// against a side edge.
const TOOLTIP_TOP_SPACE = 100
const TOOLTIP_SIDE_SPACE = 90

type Profile = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  member_number: number | null
}

type Cell =
  | { kind: 'empty'; key: string; row: number; col: number }
  | { kind: 'profile'; key: string; row: number; col: number; profile: Profile }

export default function RucheClient() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  // Kept for the upcoming chat integration — not read yet.
  const [, setSelectedProfile] = useState<Profile | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, bio, member_number')
      .order('member_number', { ascending: true })
      .then(({ data }) => {
        setProfiles((data ?? []) as Profile[])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => setContainerSize({ width: el.clientWidth, height: el.clientHeight })
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const isMobile = containerSize.width > 0 && containerSize.width < 640
  const hexSize = isMobile ? 60 : 90
  const hexHeight = hexSize * (Math.sqrt(3) / 2)
  const colStep = hexSize + GAP
  const rowStep = hexHeight * 0.75 + GAP
  const colOffset = colStep / 2

  const { cells, gridWidth, gridHeight } = useMemo(() => {
    const width = (containerSize.width || 1200) - TOOLTIP_SIDE_SPACE * 2
    const height = (containerSize.height || 800) - TOOLTIP_TOP_SPACE

    const cols = Math.max(1, Math.ceil(width / colStep) + 1)
    const fillRows = Math.max(1, Math.ceil(height / rowStep) + 1)
    const rowsForProfiles = Math.ceil(profiles.length / cols)
    const rows = Math.max(fillRows, rowsForProfiles)

    const list: Cell[] = []
    let profileIndex = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r}-${c}`
        if (profileIndex < profiles.length) {
          list.push({ kind: 'profile', key, row: r, col: c, profile: profiles[profileIndex] })
          profileIndex++
        } else {
          list.push({ kind: 'empty', key, row: r, col: c })
        }
      }
    }

    return {
      cells: list,
      gridWidth: cols * colStep + colOffset,
      gridHeight: rows * rowStep + hexHeight * 0.25,
    }
  }, [containerSize, profiles, colStep, rowStep, colOffset, hexHeight])

  const handleSelect = useCallback((profile: Profile) => {
    setSelectedProfile(profile)
    console.log(profile)
    setToast(`Chat avec ${profile.first_name} ${profile.last_name} — bientôt disponible`)
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative z-10">
      <div className="px-4 sm:px-6 pt-6 pb-3 shrink-0">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
          La Ruche
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {loading
            ? '...'
            : `${profiles.length} entrepreneur${profiles.length === 1 ? '' : 's'} dans la ruche`}
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: TOOLTIP_TOP_SPACE,
          paddingLeft: TOOLTIP_SIDE_SPACE,
          paddingRight: TOOLTIP_SIDE_SPACE,
        }}
      >
        <div className="relative" style={{ width: gridWidth, height: gridHeight }}>
          {cells.map((cell) => {
            const x = cell.col * colStep + (cell.row % 2 === 1 ? colOffset : 0)
            const y = cell.row * rowStep

            return cell.kind === 'empty' ? (
              <EmptyHex key={cell.key} x={x} y={y} size={hexSize} height={hexHeight} />
            ) : (
              <ProfileHex
                key={cell.key}
                x={x}
                y={y}
                size={hexSize}
                height={hexHeight}
                profile={cell.profile}
                onSelect={handleSelect}
              />
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm rounded-beez px-4 py-3 shadow-card z-50"
            style={{ background: '#041625', border: '1px solid rgba(235,175,87,0.3)' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyHex({
  x,
  y,
  size,
  height,
}: {
  x: number
  y: number
  size: number
  height: number
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width: size, height, zIndex: 1 }}
      whileHover={{ scale: 1.25, zIndex: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
      transition={LIFT_TRANSITION}
    >
      <div
        className="w-full h-full"
        style={{
          clipPath: HEX_CLIP,
          background: 'rgba(235,175,87,0.03)',
          border: '1px solid rgba(235,175,87,0.08)',
        }}
      />
    </motion.div>
  )
}

function ProfileHex({
  x,
  y,
  size,
  height,
  profile,
  onSelect,
}: {
  x: number
  y: number
  size: number
  height: number
  profile: Profile
  onSelect: (profile: Profile) => void
}) {
  const [hovered, setHovered] = useState(false)
  const fullName = `${profile.first_name} ${profile.last_name}`
  const initials = `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: x, top: y, width: size, height, zIndex: 1 }}
      whileHover={{ scale: 1.25, zIndex: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
      transition={LIFT_TRANSITION}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(profile)}
    >
      <div
        className="w-full h-full overflow-hidden flex items-center justify-center"
        style={{
          clipPath: HEX_CLIP,
          border: '1px solid rgba(235,175,87,0.25)',
          background: profile.avatar_url ? undefined : '#0D2E4A',
        }}
      >
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <span className="font-heading font-bold text-gold text-lg">{initials}</span>
        )}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-[10px]"
            style={{
              bottom: '100%',
              marginBottom: 10,
              width: 220,
              maxWidth: 220,
              background: '#041625',
              border: '1px solid rgba(235,175,87,0.3)',
              padding: 12,
              zIndex: 20,
            }}
          >
            <p className="font-heading font-bold text-white text-sm leading-tight">{fullName}</p>
            {profile.bio && (
              <p className="text-white/70 text-xs mt-1 leading-snug">{profile.bio}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
