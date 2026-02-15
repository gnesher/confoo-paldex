import { togglePal, useIsInTeam } from '~/stores/team'
import type { Pal } from '~/schemas/pal'

interface TeamButtonProps {
  pal: Pal
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export function TeamButton({ pal, size = 'md', className = '' }: TeamButtonProps) {
  const isInTeam = useIsInTeam(pal.id)

  return (
    <button
      type="button"
      onClick={() => togglePal(pal)}
      className={`
        ${SIZE_CLASSES[size]}
        font-semibold rounded-lg transition-all duration-200
        ${
          isInTeam
            ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        ${className}
      `}
    >
      {isInTeam ? (
        <span className="flex items-center gap-2">
          <span>✓</span>
          <span>Remove from Team</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>+</span>
          <span>Add to Team</span>
        </span>
      )}
    </button>
  )
}

export function TeamButtonCompact({ pal }: { pal: Pal }) {
  const isInTeam = useIsInTeam(pal.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if inside a Link
    e.stopPropagation()
    togglePal(pal)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        p-2 rounded-full transition-all duration-200
        ${
          isInTeam
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }
      `}
      title={isInTeam ? 'Remove from Team' : 'Add to Team'}
    >
      {isInTeam ? '✓' : '+'}
    </button>
  )
}
