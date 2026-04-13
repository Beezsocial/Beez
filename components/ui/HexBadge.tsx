import type { ReactNode } from 'react'

interface HexBadgeProps {
  number?: number
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const sizeMap = {
  sm: { outer: 'w-20 h-[92px]', inner: 'text-xs' },
  md: { outer: 'w-32 h-[148px]', inner: 'text-sm' },
  lg: { outer: 'w-48 h-[222px]', inner: 'text-base' },
}

export default function HexBadge({ number, size = 'md', children }: HexBadgeProps) {
  const { outer, inner } = sizeMap[size]

  return (
    <div
      className={`${outer} relative flex items-center justify-center`}
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        background: 'linear-gradient(135deg, #ebaf57 0%, #d4912a 100%)',
      }}
      role="img"
      aria-label={number ? `Founding Member #${number}` : 'Badge membre'}
    >
      <div
        className="absolute inset-[3px] flex flex-col items-center justify-center gap-1"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: '#082b44',
        }}
      >
        {children ?? (
          <>
            <span className="text-gold text-lg leading-none" aria-hidden="true">
              ✦
            </span>
            <span className={`${inner} font-heading font-bold text-white text-center leading-tight px-2`}>
              Founding
              <br />
              Member
            </span>
            {number !== undefined && (
              <span className="text-gold font-mono text-xs font-bold">
                #{number}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
