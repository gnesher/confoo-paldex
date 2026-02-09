import { Link } from '@tanstack/react-router'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  showClearButton?: boolean
}

/**
 * Empty state component for when no results are found
 */
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
        <Link
          to="/"
          search={{}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Clear all filters
        </Link>
      )}
    </div>
  )
}

/**
 * 404 Not Found state
 */
export function NotFoundState({ message = 'The page you are looking for does not exist.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">😕</span>
      <h3 className="text-xl font-semibold mb-2">Page Not Found</h3>
      <p className="text-sm mb-4">{message}</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  )
}

/**
 * Pal Not Found state
 */
export function PalNotFoundState({ palId }: { palId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">🎮</span>
      <h3 className="text-xl font-semibold mb-2">Pal Not Found</h3>
      <p className="text-sm mb-4">
        No Pal with ID "{palId}" exists in the Paldex.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
      >
        Browse All Pals
      </Link>
    </div>
  )
}
