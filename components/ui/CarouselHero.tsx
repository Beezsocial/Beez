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

// How long a phrase stays fully readable before the honeycomb closes over it.
const HOLD_MS = 3800
// Per-cell timings — stagger is per-column, duration is each cell's own tween.
const REVEAL_STAGGER_MS = 18
const REVEAL_CELL_DURATION = 0.35
const HIDE_STAGGER_MS = 14
const HIDE_CELL_DURATION = 0.22

type Phase = 'revealing' | 'holding' | 'hiding'

type HexCellData = { key: string; x: number; y: number; col: number; row: number }

// Same flat-top interlocking math used by the /ruche honeycomb and the site
// honeycomb-bg pattern: columns spaced at 3/4 width, alternating columns
// pushed down by half a hex height, +1 col/+2 row buffer for edge coverage.
function buildGrid(width: number, height: number, hexW: number) {
  const hexH = hexW * 0.866
  const colStep = hexW * 0.75
  const rowStep = hexH
  const cols = Math.max(1, Math.ceil(width / colStep) + 1)
  const rows = Math.max(1, Math.ceil(height / rowStep) + 2)

  const cells: HexCellData[] = []
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      cells.push({
        key: `${col}-${row}`,
        col,
        row,
        x: col * colStep,
        y: row * rowStep + (col % 2) * (rowStep / 2) - rowStep / 2,
      })
    }
  }
  return { cells, hexH, cols }
}

export default function CarouselHero() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('revealing')

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

  // Larger, fewer hexagons on mobile — same idea as the /ruche grid, tuned
  // here to keep total cell count (and therefore animated DOM nodes) low.
  const isMobile = size.width > 0 && size.width < 400
  const hexW = isMobile ? 38 : 30

  // Nothing has been measured yet on the very first paint. Rather than build
  // a grid from a guessed fallback size and then swap in the real one a
  // moment later (different column count → different cell keys → React
  // unmounts/remounts every cell mid-animation, restarting the reveal), the
  // grid below is built from the real size once available, and cell
  // animation stays frozen in "covering" until then — so the only thing
  // that ever changes size is a static, unanimated hex grid.
  const ready = size.width > 0

  const grid = useMemo(
    () => buildGrid(size.width || 320, size.height || 90, hexW),
    [size, hexW]
  )

  // Phase-duration is derived from the actual grid size so the reveal/hide
  // animation is never cut short (or left waiting) regardless of how many
  // columns the current viewport/phrase produces.
  const revealTotalMs = Math.round((grid.cols - 1) * REVEAL_STAGGER_MS + REVEAL_CELL_DURATION * 1000) + 80
  const hideTotalMs = Math.round((grid.cols - 1) * HIDE_STAGGER_MS + HIDE_CELL_DURATION * 1000) + 60

  useEffect(() => {
    if (!ready) return
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'revealing') {
      timer = setTimeout(() => setPhase('holding'), revealTotalMs)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('hiding'), HOLD_MS)
    } else {
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length)
        setPhase('revealing')
      }, hideTotalMs)
    }
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, revealTotalMs, hideTotalMs, ready])

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
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'relative',
              display: 'block',
              color: '#ebaf57',
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

        {/* Honeycomb reveal/cover mask — a persistent grid of hex cells that
            animate scale/opacity in a column-staggered wave. It never
            unmounts between phrases, only retargets, so the same wave that
            "grows" the text into view also closes back over it. */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
          {grid.cells.map((cell) => (
            <HexCell
              key={cell.key}
              x={cell.x}
              y={cell.y}
              size={hexW}
              height={grid.hexH}
              col={cell.col}
              row={cell.row}
              maxCol={grid.cols - 1}
              phase={phase}
              ready={ready}
            />
          ))}
        </div>
      </div>

      {/* Underline — timed to land exactly as the honeycomb finishes
          parting, so it reads as a confirmation the reveal is complete. */}
      <motion.span
        key={`u-${index}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: revealTotalMs / 1000 + 0.05 }}
        style={{
          display: 'block',
          height: 2,
          background: 'linear-gradient(90deg, #ebaf57, rgba(235,175,87,0.3))',
          marginTop: 6,
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

function HexCell({
  x,
  y,
  size,
  height,
  col,
  row,
  maxCol,
  phase,
  ready,
}: {
  x: number
  y: number
  size: number
  height: number
  col: number
  row: number
  maxCol: number
  phase: Phase
  ready: boolean
}) {
  // Target "covering" while actively hiding, or before the container has
  // been measured even once — that second case matters because the grid
  // rendered before `ready` is built from a guessed fallback size, and
  // freezing it in place (instead of animating it) means it can be swapped
  // for the real grid invisibly, with no mid-animation restart.
  const covering = !ready || phase === 'hiding'

  // Reveal sweeps left→right by column; hide sweeps right→left (reverse
  // order), with a small row offset so the wave reads as a soft diagonal
  // rather than a strictly vertical wipe.
  const stagger = covering ? HIDE_STAGGER_MS : REVEAL_STAGGER_MS
  const orderedCol = covering ? maxCol - col : col
  const delay = (orderedCol * stagger + row * stagger * 0.35) / 1000
  const duration = covering ? HIDE_CELL_DURATION : REVEAL_CELL_DURATION

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: size,
        height,
        clipPath: HEX_CLIP,
        // Deep navy (not the mid-tone surface navy) so the covering grid
        // reads as a clearly visible, deliberate honeycomb wall against the
        // page's primary navy background — a same-family fill was nearly
        // invisible and made the "reveal" look like a plain fade.
        background: '#041625',
        border: '1px solid rgba(235,175,87,0.4)',
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: covering ? 1 : 0, scale: covering ? 1 : 0 }}
      transition={{ duration, delay, ease: EASE }}
    />
  )
}
