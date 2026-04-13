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
      className={[
        'px-4 py-2 text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        selected
          ? 'bg-gold text-navy-900 border-gold hover:bg-gold-400'
          : 'bg-transparent text-white/80 border-white/20 hover:border-gold/60 hover:text-white',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
