import { Show } from 'solid-js'
import { Link } from '@tanstack/solid-router'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  showClearButton?: boolean
}

/**
 * Empty state component for when no results are found
 */
export function EmptyState(props: EmptyStateProps) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">{props.icon ?? '🔍'}</span>
      <h3 class="text-xl font-semibold mb-2">{props.title ?? 'No Pals found'}</h3>
      <p class="text-sm mb-4">{props.message ?? 'Try adjusting your search filters'}</p>
      <Show when={props.showClearButton !== false}>
        <Link
          to="/"
          search={{}}
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Clear all filters
        </Link>
      </Show>
    </div>
  )
}

/**
 * 404 Not Found state
 */
export function NotFoundState(props: { message?: string }) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">😕</span>
      <h3 class="text-xl font-semibold mb-2">Page Not Found</h3>
      <p class="text-sm mb-4">{props.message ?? 'The page you are looking for does not exist.'}</p>
      <Link
        to="/"
        class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  )
}

/**
 * Pal Not Found state
 */
export function PalNotFoundState(props: { palId: string }) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">🎮</span>
      <h3 class="text-xl font-semibold mb-2">Pal Not Found</h3>
      <p class="text-sm mb-4">
        No Pal with ID "{props.palId}" exists in the Paldex.
      </p>
      <Link
        to="/"
        class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Browse All Pals
      </Link>
    </div>
  )
}
