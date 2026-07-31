const FLAT_TOP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<
  Size,
  {
    hex: number
    border: number
    icon: number
    layout: 'row' | 'column'
    labelClass: string
    numberClass: string
    gapClass: string
  }
> = {
  sm: {
    hex: 18,
    border: 1.5,
    icon: 8,
    layout: 'row',
    labelClass: 'text-[10px] font-bold whitespace-nowrap',
    numberClass: 'text-[10px] font-bold whitespace-nowrap',
    gapClass: 'gap-1.5',
  },
  md: {
    hex: 32,
    border: 2,
    icon: 14,
    layout: 'row',
    labelClass: 'text-xs font-bold whitespace-nowrap',
    numberClass: 'text-xs font-bold whitespace-nowrap',
    gapClass: 'gap-2',
  },
  lg: {
    hex: 56,
    border: 2.5,
    icon: 24,
    layout: 'column',
    labelClass: 'text-sm font-bold tracking-wide',
    numberClass: 'text-2xl font-extrabold tracking-wide',
    gapClass: 'gap-2',
  },
}

// Simple inline bee icon, consistent with the app's line-icon style
// (Instagram icon in NavHeader, camera icon on avatar upload, etc.)
function BeeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="13" rx="6" ry="7" stroke="#082b44" strokeWidth="1.75" />
      <path d="M8 10h8M7.5 13h9M8 16h8" stroke="#082b44" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6V3M9 4.5L7.5 2M15 4.5L16.5 2" stroke="#082b44" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function FoundingMemberBadge({
  memberNumber,
  size = 'md',
}: {
  memberNumber: number
  size?: Size
}) {
  const { hex, border, icon, layout, labelClass, numberClass, gapClass } = SIZES[size]
  const padded = String(memberNumber).padStart(3, '0')

  return (
    <div
      className={`inline-flex items-center ${layout === 'column' ? 'flex-col text-center' : 'flex-row'} ${gapClass}`}
      role="img"
      aria-label={`Founding Member #${padded}`}
    >
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: hex, height: hex * 0.866, clipPath: FLAT_TOP, background: '#082b44' }}
      >
        <div
          className="absolute flex items-center justify-center"
          style={{ inset: border, clipPath: FLAT_TOP, background: 'linear-gradient(135deg, #ebaf57 0%, #d4932a 50%, #ebaf57 100%)' }}
        >
          <BeeIcon size={icon} />
        </div>
      </div>
      {layout === 'column' ? (
        <div>
          <p className={`${labelClass} text-gold`}>Founding Member</p>
          <p className={`${numberClass} text-gold font-mono`}>#{padded}</p>
        </div>
      ) : (
        <p className={`${labelClass} text-gold`}>
          Founding Member <span className={`${numberClass} font-mono`}>#{padded}</span>
        </p>
      )}
    </div>
  )
}
