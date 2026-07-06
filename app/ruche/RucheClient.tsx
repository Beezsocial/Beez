'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
const LIFT_TRANSITION = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }
const HOVER_SHADOW = 'drop-shadow(0 12px 20px rgba(0,0,0,0.45))'
const GOLD = '#ebaf57'
// Visual border thickness for the layered "gold hex behind, content hex
// inset in front" technique — a plain CSS `border` on a clip-path hexagon
// renders unevenly thick along the slanted edges, so instead every cell is
// two nested hexagons: a solid gold one, with a smaller one on top inset by
// this many pixels showing the actual fill (same trick as HexBadge.tsx).
const HEX_BORDER = 2.5
// Breathing room around the scroll container so the bio tooltip (which
// floats above a hex) and the 1.25x hover scale never get clipped when a
// cell sits on the honeycomb's outer edge.
const TOOLTIP_TOP_SPACE = 90
const TOOLTIP_SIDE_SPACE = 80
// Mouse movement (px) past which a mousedown+drag is treated as a pan
// gesture rather than a click, so panning never fires a spurious profile click.
const DRAG_CLICK_THRESHOLD = 4

type Profile = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  member_number: number | null
}

type Cell =
  | { kind: 'empty'; key: string; x: number; y: number }
  | { kind: 'profile'; key: string; x: number; y: number; profile: Profile }

// Deterministic pseudo-random in [0, 1) from an integer seed, so the
// honeycomb's organic edge and the profile spread stay stable across
// re-renders instead of reshuffling on every layout recompute.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export default function RucheClient() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  // Kept for the upcoming chat integration — not read yet.
  const [, setSelectedProfile] = useState<Profile | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // Mouse drag-to-pan on top of native scroll: dragging adjusts scrollLeft/
  // scrollTop directly, so trackpad horizontal scroll and mobile touch swipe
  // keep working natively via the container's own overflow: auto.
  const [isPanning, setIsPanning] = useState(false)
  const panStateRef = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0, moved: false })
  const suppressClickRef = useRef(false)

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    panStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
      moved: false,
    }
    setIsPanning(true)
  }, [])

  useEffect(() => {
    if (!isPanning) return

    function onMouseMove(e: MouseEvent) {
      const el = containerRef.current
      if (!el) return
      const dx = e.clientX - panStateRef.current.startX
      const dy = e.clientY - panStateRef.current.startY
      if (Math.abs(dx) > DRAG_CLICK_THRESHOLD || Math.abs(dy) > DRAG_CLICK_THRESHOLD) {
        panStateRef.current.moved = true
      }
      el.scrollLeft = panStateRef.current.scrollLeft - dx
      el.scrollTop = panStateRef.current.scrollTop - dy
    }

    function onMouseUp() {
      if (panStateRef.current.moved) {
        suppressClickRef.current = true
        setTimeout(() => {
          suppressClickRef.current = false
        }, 0)
      }
      setIsPanning(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isPanning])

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
  const hexW = isMobile ? 60 : 100
  const hexH = hexW * 0.866
  const colStep = hexW * 0.75
  const rowStep = hexH

  const { cells, gridWidth, gridHeight } = useMemo(() => {
    const availWidth = Math.max(320, (containerSize.width || 1200) - TOOLTIP_SIDE_SPACE * 2)
    const availHeight = Math.max(320, (containerSize.height || 800) - TOOLTIP_TOP_SPACE)

    const cols = Math.max(3, Math.ceil(availWidth / colStep) + 2)
    const rows = Math.max(3, Math.ceil(availHeight / rowStep) + 2)

    // True flat-top interlocking: columns are the repeating unit, spaced at
    // 3/4 of a hex width, with odd columns pushed down by half a hex height
    // so each hex nests into the notch of its neighboring columns.
    const candidates: { col: number; row: number; x: number; y: number }[] = []
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        candidates.push({
          col,
          row,
          x: col * colStep,
          y: row * rowStep + (col % 2) * (rowStep / 2),
        })
      }
    }

    const gridW = cols * colStep + hexW * 0.25
    const gridH = rows * rowStep + rowStep / 2 + rowStep * 0.25

    // Organic silhouette: only keep cells within an elliptical radius of the
    // honeycomb's center, with a small per-cell jitter so the boundary reads
    // as an irregular cluster rather than a perfect ellipse or rectangle.
    const centerX = gridW / 2
    const centerY = gridH / 2

    let masked = candidates.filter((c) => {
      const dx = (c.x - centerX) / centerX
      const dy = (c.y - centerY) / centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const jitter = (seededRandom(c.col * 1000 + c.row) - 0.5) * 0.3
      return dist <= 1 + jitter
    })

    // Never let the organic mask drop profiles on very small viewports —
    // fall back to the full candidate grid if it left too few cells.
    if (masked.length < profiles.length) {
      masked = candidates
    }

    const total = masked.length
    const profileCount = profiles.length
    const cellIndexToProfile = new Map<number, Profile>()

    if (profileCount > 0) {
      const step = Math.max(1, Math.floor(total / profileCount))
      const usedIndices = new Set<number>()
      for (let i = 0; i < profileCount; i++) {
        const bucketStart = i * step
        const bucketEnd = i === profileCount - 1 ? total : Math.min(total, bucketStart + step)
        const span = Math.max(1, bucketEnd - bucketStart)
        let idx = bucketStart + Math.floor(seededRandom(i * 97 + total) * span)
        idx = Math.min(idx, total - 1)
        while (usedIndices.has(idx) && idx < total - 1) idx++
        usedIndices.add(idx)
        cellIndexToProfile.set(idx, profiles[i])
      }
    }

    const list: Cell[] = masked.map((c, index) => {
      const profile = cellIndexToProfile.get(index)
      const key = `${c.col}-${c.row}`
      return profile
        ? { kind: 'profile', key, x: c.x, y: c.y, profile }
        : { kind: 'empty', key, x: c.x, y: c.y }
    })

    return { cells: list, gridWidth: gridW, gridHeight: gridH }
  }, [containerSize, profiles, colStep, rowStep, hexW])

  const handleSelect = useCallback((profile: Profile) => {
    if (suppressClickRef.current) return
    setSelectedProfile(profile)
    console.log(profile)
    setToast(`Chat avec ${profile.first_name} ${profile.last_name} — bientôt disponible`)
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative z-10">
      <div className="px-4 sm:px-6 pt-6 pb-3 shrink-0">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy tracking-tight">
          La Ruche
        </h1>
        <p className="text-navy text-sm mt-1">
          {loading
            ? '...'
            : `${profiles.length} entrepreneur${profiles.length === 1 ? '' : 's'} dans la ruche`}
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex-1"
        onMouseDown={handlePanStart}
        style={{
          overflowY: 'auto',
          overflowX: 'auto',
          paddingTop: TOOLTIP_TOP_SPACE,
          paddingBottom: 40,
          paddingLeft: TOOLTIP_SIDE_SPACE,
          paddingRight: TOOLTIP_SIDE_SPACE,
          cursor: isPanning ? 'grabbing' : 'grab',
          userSelect: isPanning ? 'none' : 'auto',
        }}
      >
        <div className="relative mx-auto" style={{ width: gridWidth, height: gridHeight }}>
          {cells.map((cell) =>
            cell.kind === 'empty' ? (
              <EmptyHex key={cell.key} x={cell.x} y={cell.y} size={hexW} height={hexH} />
            ) : (
              <ProfileHex
                key={cell.key}
                x={cell.x}
                y={cell.y}
                size={hexW}
                height={hexH}
                profile={cell.profile}
                onSelect={handleSelect}
              />
            )
          )}
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
      style={{
        left: x,
        top: y,
        width: size,
        height,
        zIndex: 1,
        clipPath: HEX_CLIP,
        background: GOLD,
      }}
      whileHover={{ scale: 1.25, zIndex: 10, filter: HOVER_SHADOW }}
      transition={LIFT_TRANSITION}
    >
      <div
        className="absolute"
        style={{ inset: HEX_BORDER, clipPath: HEX_CLIP, background: '#0a2540' }}
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
    // Plain, un-clipped, un-scaled positioning wrapper. The hex clip-path and
    // the hover scale both live on the motion child below — keeping them on
    // the SAME element is what stops the hover zoom from revealing a square.
    // The tooltip is this wrapper's other child so it escapes the hex clip.
    <div className="absolute" style={{ left: x, top: y, width: size, height }}>
      <motion.div
        className="cursor-pointer"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          clipPath: HEX_CLIP,
          background: GOLD,
        }}
        whileHover={{ scale: 1.25, zIndex: 10, filter: HOVER_SHADOW }}
        transition={LIFT_TRANSITION}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => onSelect(profile)}
      >
        <div
          className="absolute flex items-center justify-center overflow-hidden"
          style={{
            inset: HEX_BORDER,
            clipPath: HEX_CLIP,
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
      </motion.div>

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
    </div>
  )
}
