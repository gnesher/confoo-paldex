import { Show } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import { teamStore, togglePal } from '~/stores/team'
import type { Pal } from '~/schemas/pal'

interface TeamButtonProps {
  pal: Pal
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

/**
 * Button to add/remove a Pal from the team
 * FR-406: Page MUST include "Add to Team" / "Remove from Team" button connected to TanStack Store
 * FR-407: Button state MUST reflect current team membership (reactive to store changes)
 */
export function TeamButton(props: TeamButtonProps) {
  // Subscribe to store to get reactive updates
  // FR-106: Store MUST NOT use React Context - using useStore directly
  const isInTeam = useStore(teamStore, (state) =>
    state.pals.some((p) => p.id === props.pal.id)
  )

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const handleClick = () => {
    togglePal(props.pal)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class={`
        ${sizeClasses[props.size ?? 'md']}
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

/**
 * Compact team button for use in cards
 */
export function TeamButtonCompact(props: { pal: Pal }) {
  const isInTeam = useStore(teamStore, (state) =>
    state.pals.some((p) => p.id === props.pal.id)
  )

  const handleClick = (e: MouseEvent) => {
    e.preventDefault() // Prevent navigation if inside a Link
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
