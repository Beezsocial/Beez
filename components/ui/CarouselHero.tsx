'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ITEMS = [
  'Fais briller ton entreprise',
  'Partage tes avancées',
  'Match avec les bons contacts',
  'Trouve ton associé, ton mentor, tes clients',
  'Récolte des conseils',
  'Connecte avec des entrepreneurs partout en France',
  'Gagne en visibilité',
  'Lève des fonds',
  'Réseaute, tout le temps, sans limite',
]

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
const EASE = [0.22, 1, 0.36, 1] as const

// How long a phrase stays fully readable before the next swarm pass.
const HOLD_MS = 3800
// Total time for the swarm to cross the full text width, left to right.
const SWEEP_MS = 450
// How long any single hexagon stays visible (fade in → hold → fade out)
// as the sweep passes its horizontal position.
const FLASH_MS = 200
// Small random offset applied to each hex's delay so the pass reads as an
// organic scatter rather than a mechanically even line sweeping across.
const JITTER_MS = 40

const DESKTOP_COUNT = 20
const MOBILE_COUNT = 10
const DESKTOP_SIZE_RANGE: [number, number] = [12, 24]
const MOBILE_SIZE_RANGE: [number, number] = [8, 16]

type Phase = 'idle' | 'transitioning'
type SwarmHex = { id: string; x: number; y: number; size: number; delay: number }

// A sparse, non-interlocking scatter of hexagons spread across the text's
// width and height. Horizontal position (stratified — the width is split
// into `count` even bands, one hex randomly placed within each) drives the
// per-hex delay, so the group reads as a single fast left→right pass even
// though each hex's own position, size, and timing jitter are random.
function generateSwarm(
  width: number,
  height: number,
  count: number,
  sizeRange: [number, number]
): SwarmHex[] {
  const maxDelayMs = Math.max(0, SWEEP_MS - FLASH_MS)
  const [minSize, maxSize] = sizeRange
  const bandWidth = width / count

  const hexes: SwarmHex[] = []
  for (let i = 0; i < count; i++) {
    const size = minSize + Math.random() * (maxSize - minSize)
    const hexH = size * 0.866

    const cx = bandWidth * i + Math.random() * bandWidth
    const halfH = hexH / 2
    const cy = halfH + Math.random() * Math.max(1, height - hexH)

    const xFrac = width > 0 ? cx / width : 0
    const jitter = (Math.random() - 0.5) * 2 * JITTER_MS
    const delay = Math.max(0, Math.min(maxDelayMs, xFrac * maxDelayMs + jitter))

    hexes.push({ id: `${i}-${Math.round(cx)}-${Math.round(cy)}-${Math.round(size)}`, x: cx, y: cy, size, delay })
  }
  return hexes
}

export default function CarouselHero() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ready = size.width > 0
  const isMobile = size.width > 0 && size.width < 400
  const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT
  const sizeRange = isMobile ? MOBILE_SIZE_RANGE : DESKTOP_SIZE_RANGE

  // Regenerated once per phrase change (not on every render) so the scatter
  // stays put for the duration of a single sweep instead of reshuffling.
  const swarm = useMemo(
    () => generateSwarm(size.width || 320, size.height || 90, count, sizeRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, size.width, size.height, count]
  )

  useEffect(() => {
    if (!ready) return
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'idle') {
      timer = setTimeout(() => {
        // Advance the phrase and start the sweep in the SAME tick, so the
        // text crossfade and the hexagon pass run concurrently — the swarm
        // sweeping through is what visually "causes" the text to change.
        setIndex((i) => (i + 1) % ITEMS.length)
        setPhase('transitioning')
      }, HOLD_MS)
    } else {
      timer = setTimeout(() => setPhase('idle'), SWEEP_MS)
    }
    return () => clearTimeout(timer)
  }, [phase, ready])

  return (
    <div className="relative inline-block text-center" style={{ width: 'min(600px, 92vw)' }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          minHeight: 'clamp(72px, 12vw, 108px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 4px',
        }}
      >
        {/* Text crossfade — no `mode="wait"`, so the outgoing phrase's exit
            and the incoming phrase's enter run at the same time (a true
            crossfade), timed to match the swarm's own sweep duration. */}
        <AnimatePresence>
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: SWEEP_MS / 1000, ease: 'easeInOut' }}
            style={{
              // Both the outgoing and incoming span coexist in the DOM
              // during the crossfade (no `mode="wait"`), so each is
              // absolutely positioned to fill and center within the
              // container itself — otherwise two simultaneous flex
              // children would push each other out of the centered spot.
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textTransform: 'uppercase',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 4vw, 36px)',
              textShadow:
                '0 0 8px rgba(255,224,178,0.6), 0 0 20px rgba(235,175,87,0.5), 0 0 40px rgba(235,175,87,0.2)',
              lineHeight: 1.2,
            }}
          >
            {ITEMS[index]}
          </motion.span>
        </AnimatePresence>

        {/* Scattered hexagon swarm — sparse, non-interlocking, each one a
            brief individual flash staggered by horizontal position so the
            group reads as one fast left→right pass. Only mounted while
            actively transitioning; each hex fully completes its own fade
            within the phase's own duration, so there's nothing to clip. */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
          <AnimatePresence>
            {phase === 'transitioning' &&
              swarm.map((h) => (
                <motion.div
                  key={h.id}
                  className="absolute gold-gradient gold-shine"
                  style={{
                    left: h.x - h.size / 2,
                    top: h.y - (h.size * 0.866) / 2,
                    width: h.size,
                    height: h.size * 0.866,
                    clipPath: HEX_CLIP,
                    border: '1px solid #082b44',
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: FLASH_MS / 1000,
                    delay: h.delay / 1000,
                    times: [0, 0.25, 0.7, 1],
                    ease: EASE,
                  }}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
