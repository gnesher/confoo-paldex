import { createSignal, onMount, Show, For } from 'solid-js'
import { useStore } from '@tanstack/solid-store'
import { Link } from '@tanstack/solid-router'
import { teamStore, removePal } from '~/stores/team'
import { PalImage } from '~/components/PalImage'
import type { Pal } from '~/schemas/pal'

/**
 * Collapsible bottom bar for team display
 * FR-408: Team MUST be displayed as a collapsible bottom bar, persistent across all routes
 * FR-409: Bottom bar MUST show team count when collapsed and expand on click to show Pal thumbnails
 */
export function TeamBottomBar() {
  const [isExpanded, setIsExpanded] = createSignal(false)
  const [storageWarning, setStorageWarning] = createSignal(false)

  // Subscribe to team store
  const team = useStore(teamStore, (state) => state.pals)

  // Check localStorage availability on mount
  onMount(() => {
    try {
      const testKey = '__paldex_storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
    } catch {
      setStorageWarning(true)
    }
  })

  return (
    <Show when={team().length > 0 || isExpanded()}>
      <div class="fixed bottom-0 left-0 right-0 z-50">
        {/* Storage warning banner */}
        <Show when={storageWarning()}>
          <div class="bg-yellow-100 border-t border-yellow-300 px-4 py-2 text-sm text-yellow-800 text-center">
            ⚠️ localStorage unavailable. Team data will not persist across sessions.
          </div>
        </Show>

        {/* Collapsed bar */}
        <div
          class={`bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
            isExpanded() ? 'h-48' : 'h-14'
          }`}
        >
          {/* Toggle button and count */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded())}
            class="w-full h-14 px-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">👥</span>
              <span class="font-semibold">My Team</span>
              <span class="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                {team().length} Pal{team().length !== 1 ? 's' : ''}
              </span>
            </div>
            <span class="text-xl transition-transform duration-200" style={{
              transform: isExpanded() ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▲
            </span>
          </button>

          {/* Expanded content */}
          <Show when={isExpanded()}>
            <div class="h-[calc(100%-3.5rem)] overflow-hidden">
              <Show
                when={team().length > 0}
                fallback={
                  <div class="h-full flex items-center justify-center text-gray-500">
                    <div class="text-center">
                      <span class="text-3xl mb-2 block">🎮</span>
                      <p>No Pals in your team yet.</p>
                      <p class="text-sm">Click "Add to Team" on any Pal to get started!</p>
                    </div>
                  </div>
                }
              >
                <div class="h-full p-4 overflow-x-auto">
                  <div class="flex gap-4">
                    <For each={team()}>
                      {(pal) => (
                        <TeamPalCard pal={pal} onRemove={() => removePal(pal.id)} />
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  )
}

/**
 * Mini Pal card for the team bar
 */
function TeamPalCard(props: {
  pal: Pal
  onRemove: () => void
}) {
  return (
    <div class="relative flex-shrink-0 w-24 group">
      <Link
        to="/pals/$palId"
        params={{ palId: props.pal.id }}
        class="block bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
      >
        <div class="aspect-square flex items-center justify-center p-2">
          <PalImage
            src={props.pal.imageUrl}
            alt={props.pal.name}
            palId={props.pal.id}
            fallbackIconSize="sm"
          />
        </div>
        <div class="px-2 py-1 text-center">
          <span class="text-xs font-medium text-gray-700 truncate block">
            {props.pal.name}
          </span>
        </div>
      </Link>
      
      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          props.onRemove()
        }}
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Remove from team"
      >
        ×
      </button>
    </div>
  )
}
