import { Show } from 'solid-js'
import { togglePal, useIsInTeam } from '~/stores/team'
import type { Pal } from '~/schemas/pal'

interface TeamButtonProps {
  pal: Pal
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export function TeamButton(props: TeamButtonProps) {
  const isInTeam = useIsInTeam(() => props.pal.id)

  return (
    <button
      type="button"
      onClick={() => togglePal(props.pal)}
      class={`
        ${SIZE_CLASSES[props.size ?? 'md']}
        font-semibold rounded-lg transition-all duration-200
        ${
          isInTeam()
            ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        ${props.class ?? ''}
      `}
    >
      <Show
        when={isInTeam()}
        fallback={
          <span class="flex items-center gap-2">
            <span>+</span>
            <span>Add to Team</span>
          </span>
        }
      >
        <span class="flex items-center gap-2">
          <span>✓</span>
          <span>Remove from Team</span>
        </span>
      </Show>
    </button>
  )
}

export function TeamButtonCompact(props: { pal: Pal }) {
  const isInTeam = useIsInTeam(() => props.pal.id)

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    togglePal(props.pal)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class={`
        p-2 rounded-full transition-all duration-200
        ${
          isInTeam()
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }
      `}
      title={isInTeam() ? 'Remove from Team' : 'Add to Team'}
    >
      {isInTeam() ? '✓' : '+'}
    </button>
  )
}
