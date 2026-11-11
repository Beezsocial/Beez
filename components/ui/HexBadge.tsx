import type { ReactNode } from 'react'

interface HexBadgeProps {
  // Founding Member (member_number <= 150) : hexagone or + « Founding Member ».
  // Sinon : hexagone cyan + « Membre Beez ».
  founding?: boolean
  number?: number
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const FLAT_TOP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

const sizeMap = {
  sm: { outer: 'w-20 h-[69px]', inner: 'text-xs' },
  md: { outer: 'w-32 h-[111px]', inner: 'text-sm' },
  lg: { outer: 'w-48 h-[166px]', inner: 'text-base' },
}

// Or réservé au badge Founding Member : même dégradé que FoundingMemberBadge.
const GOLD_GRADIENT = 'linear-gradient(135deg, rgb(var(--beez-gold)) 0%, #d4932a 50%, rgb(var(--beez-gold)) 100%)'
const ACCENT_GRADIENT = 'linear-gradient(135deg, rgb(var(--beez-accent)) 0%, rgb(var(--beez-accent-2)) 50%, rgb(var(--beez-accent)) 100%)'

export default function HexBadge({ founding = false, number, size = 'md', children }: HexBadgeProps) {
  const { outer, inner } = sizeMap[size]
  const padded = number !== undefined ? String(number).padStart(3, '0') : null
  const highlight = founding ? 'text-gold' : 'text-accent'

  return (
    <div
      className={`${outer} relative flex items-center justify-center`}
      style={{
        clipPath: FLAT_TOP,
        background: founding ? GOLD_GRADIENT : ACCENT_GRADIENT,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)',
      }}
      role="img"
      aria-label={founding ? `Founding Member${padded ? ` #${padded}` : ''}` : 'Membre Beez'}
    >
      <div
        className="absolute inset-[3px] flex flex-col items-center justify-center gap-1"
        style={{
          clipPath: FLAT_TOP,
          background: '#082b44',
        }}
      >
        {children ?? (
          <>
            <span className={`${highlight} text-lg leading-none`} aria-hidden="true">
              ✦
            </span>
            <span className={`${inner} font-heading font-bold text-white text-center leading-tight px-2`}>
              {founding ? 'Founding' : 'Membre'}
              <br />
              {founding ? 'Member' : 'Beez'}
            </span>
            {founding && padded && (
              <span className={`${highlight} font-mono text-xs font-bold`}>
                #{padded}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
