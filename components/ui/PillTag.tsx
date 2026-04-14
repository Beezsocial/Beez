'use client'

interface PillTagProps {
  label: string
  selected: boolean
  onToggle: () => void
  disabled?: boolean
}

export default function PillTag({
  label,
  selected,
  onToggle,
  disabled = false,
}: PillTagProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      style={
        selected
          ? { background: 'rgba(235,175,87,0.15)', borderColor: 'rgba(235,175,87,0.5)', color: '#ebaf57' }
          : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
      }
      className={[
        'px-3 py-1.5 text-xs font-medium transition-all duration-200',
        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        !selected ? 'hover:border-gold/40 hover:text-white/80' : '',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
