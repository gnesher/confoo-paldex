import { Show } from 'solid-js'
import { LinkButton } from './LinkButton'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  showClearButton?: boolean
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">{props.icon ?? '🔍'}</span>
      <h3 class="text-xl font-semibold mb-2">{props.title ?? 'No Pals found'}</h3>
      <p class="text-sm mb-4">{props.message ?? 'Try adjusting your search filters'}</p>
      <Show when={props.showClearButton !== false}>
        <LinkButton to="/" search={{}}>
          Clear all filters
        </LinkButton>
      </Show>
    </div>
  )
}

export function NotFoundState(props: { message?: string }) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">😕</span>
      <h3 class="text-xl font-semibold mb-2">Page Not Found</h3>
      <p class="text-sm mb-4">{props.message ?? 'The page you are looking for does not exist.'}</p>
      <LinkButton to="/">Go to Home</LinkButton>
    </div>
  )
}

export function PalNotFoundState(props: { palId: string }) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">🎮</span>
      <h3 class="text-xl font-semibold mb-2">Pal Not Found</h3>
      <p class="text-sm mb-4">
        No Pal with ID &quot;{props.palId}&quot; exists in the Paldex.
      </p>
      <LinkButton to="/">Browse All Pals</LinkButton>
    </div>
  )
}
