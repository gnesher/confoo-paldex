import { LinkButton } from './LinkButton'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  showClearButton?: boolean
}

export function EmptyState({
  title = 'No Pals found',
  message = 'Try adjusting your search filters',
  icon = '🔍',
  showClearButton = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{message}</p>
      {showClearButton && (
        <LinkButton to="/" search={{}}>
          Clear all filters
        </LinkButton>
      )}
    </div>
  )
}

export function NotFoundState({ message = 'The page you are looking for does not exist.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">😕</span>
      <h3 className="text-xl font-semibold mb-2">Page Not Found</h3>
      <p className="text-sm mb-4">{message}</p>
      <LinkButton to="/">Go to Home</LinkButton>
    </div>
  )
}

export function PalNotFoundState({ palId }: { palId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">🎮</span>
      <h3 className="text-xl font-semibold mb-2">Pal Not Found</h3>
      <p className="text-sm mb-4">
        No Pal with ID &quot;{palId}&quot; exists in the Paldex.
      </p>
      <LinkButton to="/">Browse All Pals</LinkButton>
    </div>
  )
}
