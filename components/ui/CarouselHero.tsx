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
// Fast, single-direction "swarm" sweep — the SAME left-to-right stagger
// order and timing drive both the cover pass and the reveal pass, since
// they're one continuous motion happening twice per phrase change (sweep
// covers phrase A, text swaps underneath while fully covered, the same
// sweep reveals phrase B) rather than two separate directional animations.
// Tuned so a full pass (first column to last) lands around 0.4-0.5s.
const SWEEP_STAGGER_MS = 8
const SWEEP_CELL_DURATION = 0.16

type Phase = 'revealing' | 'holding' | 'hiding'

type HexCellData = { key: string; x: number; y: number; col: number; row: number }

// Deterministic pseudo-random in [0, 1) from an integer seed — same helper as
// /ruche, so the organic edge is stable across re-renders instead of
// reshuffling every time the grid recomputes.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Same flat-top interlocking math used by the /ruche honeycomb and the site
// honeycomb-bg pattern: columns spaced at 3/4 width, alternating columns
// pushed down by half a hex height.
//
// Coverage is split into two zones instead of one probabilistic ellipse:
//   1. CORE — every cell whose center falls within the actual text box
//      (± half a hex of slack at the edges) is included UNCONDITIONALLY.
//      This is what guarantees zero gaps over real text — it never depends
//      on a jitter roll.
//   2. RING — cells beyond the core, out to `margin` px past the box, are
//      included only if they fall within an ellipse centered on the box's
//      true center (± seeded jitter), which is what produces the organic,
//      ragged edge — entirely outside the area any text can occupy.
//
// The previous version used a single ellipse over the whole padded grid,
// but centered it on a box (`gridW`/`gridH`) that didn't match the actual
// span of generated points — off by more than a full row height — which
// both let the "safe" zone dip into real text (gaps) and made the ellipse
// visibly off-center (organic edge only visible on two sides).
function buildGrid(width: number, height: number, hexW: number) {
  const hexH = hexW * 0.866
  const colStep = hexW * 0.75
  const rowStep = hexH
  // Kept to roughly one hex-width deep — enough for a couple of rings of
  // organic edge, but bounded so it can't spill into whatever sits right
  // above/below the carousel in HeroSection's own layout (~32-40px margin).
  const margin = hexW

  const cols = Math.max(3, Math.ceil((width + margin * 2) / colStep) + 2)
  const rows = Math.max(3, Math.ceil((height + margin * 2) / rowStep) + 2)
  // Col/row loop counters stay non-negative on purpose — `col % 2` on a
  // negative index flips sign in JS (-3 % 2 === -1), which would silently
  // break the alternating-column interlock for anything left of x=0 and
  // reproduce the exact asymmetry bug this rewrite is fixing. The pixel
  // origin is shifted separately via startX/startY instead.
  const startX = -margin - colStep
  const startY = -margin - rowStep

  const candidates: HexCellData[] = []
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      candidates.push({
        key: `${col}-${row}`,
        col,
        row,
        x: startX + col * colStep,
        y: startY + row * rowStep + (col % 2) * (rowStep / 2),
      })
    }
  }

  const centerX = width / 2
  const centerY = height / 2
  const radiusX = width / 2 + margin
  const radiusY = height / 2 + margin

  const cells = candidates.filter((c) => {
    const insideCore =
      c.x >= -hexW * 0.5 &&
      c.x <= width + hexW * 0.5 &&
      c.y >= -hexH * 0.5 &&
      c.y <= height + hexH * 0.5
    if (insideCore) return true

    const dx = (c.x - centerX) / radiusX
    const dy = (c.y - centerY) / radiusY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const jitter = (seededRandom(c.col * 1000 + c.row) - 0.5) * 0.3
    return dist <= 1 + jitter
  })

  return { cells, hexH, cols, margin }
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

  // Sweep-pass duration is derived from the actual grid size so it's never
  // cut short (or left waiting) regardless of how many columns the current
  // viewport/phrase produces — cover and reveal now use the same one-
  // directional sweep, so there's a single duration for both passes.
  const sweepTotalMs = Math.round((grid.cols - 1) * SWEEP_STAGGER_MS + SWEEP_CELL_DURATION * 1000) + 60

  useEffect(() => {
    if (!ready) return
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'revealing') {
      timer = setTimeout(() => setPhase('holding'), sweepTotalMs)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('hiding'), HOLD_MS)
    } else {
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % ITEMS.length)
        setPhase('revealing')
      }, sweepTotalMs)
    }
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sweepTotalMs, ready])

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

        {/* Honeycomb reveal/cover mask — a persistent grid of hex cells that
            animate scale/opacity in a column-staggered wave. It never
            unmounts between phrases, only retargets, so the same wave that
            "grows" the text into view also closes back over it. The clip
            boundary is expanded by exactly `grid.margin` (not left fully
            unclipped) — that shows the full organic ring without letting it
            spill into whatever sits just above/below in HeroSection. */}
        <div
          style={{
            position: 'absolute',
            inset: -grid.margin,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {grid.cells.map((cell) => (
            <HexCell
              key={cell.key}
              // The wrapper itself is offset by -margin (inset: -margin),
              // so cell positions — generated in the text box's own 0,0
              // coordinate space — need the same margin added back to land
              // in the right place relative to the wrapper's shifted origin.
              x={cell.x + grid.margin}
              y={cell.y + grid.margin}
              size={hexW}
              height={grid.hexH}
              col={cell.col}
              row={cell.row}
              phase={phase}
              ready={ready}
            />
          ))}
        </div>
      </div>
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
  phase,
  ready,
}: {
  x: number
  y: number
  size: number
  height: number
  col: number
  row: number
  phase: Phase
  ready: boolean
}) {
  // Target "covering" while actively hiding, or before the container has
  // been measured even once — that second case matters because the grid
  // rendered before `ready` is built from a guessed fallback size, and
  // freezing it in place (instead of animating it) means it can be swapped
  // for the real grid invisibly, with no mid-animation restart.
  const covering = !ready || phase === 'hiding'

  // Left→right ONLY, for both directions of the swarm pass: covering
  // (hiding phase) sweeps in left→right just like revealing does, so the
  // whole cover→swap-text→reveal cycle reads as one continuous sweep
  // rather than the mask closing from the right and opening from the left.
  const delay = (col * SWEEP_STAGGER_MS + row * SWEEP_STAGGER_MS * 0.35) / 1000

  return (
    <motion.div
      // .gold-gradient / .gold-shine (globals.css) give the fill the same
      // richer, metallic gold treatment as the "Rejoindre la ruche" CTA —
      // a 3-stop gradient plus a diagonal shine streak, both correctly
      // clipped to the hex shape since clip-path applies to the whole box
      // (content, border, and the ::after shine pseudo-element alike).
      className="absolute gold-gradient gold-shine"
      style={{
        left: x,
        top: y,
        width: size,
        height,
        clipPath: HEX_CLIP,
        // Navy border so the grid lines between cells read as the site's
        // other primary brand color on top of the gold fill.
        border: '1px solid #082b44',
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: covering ? 1 : 0, scale: covering ? 1 : 0 }}
      transition={{ duration: SWEEP_CELL_DURATION, delay, ease: EASE }}
    />
  )
}
