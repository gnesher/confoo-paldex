import { ErrorBoundary as SolidErrorBoundary } from 'solid-js'
import type { JSX } from 'solid-js'
import { Link } from '@tanstack/solid-router'

interface ErrorBoundaryProps {
  children: JSX.Element
  fallback?: JSX.Element
}

/**
 * Error boundary component to catch and display errors gracefully.
 * Uses Solid's built-in ErrorBoundary.
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SolidErrorBoundary
      fallback={(err, reset) => {
        console.error('ErrorBoundary caught an error:', err)

        if (props.fallback) {
          return props.fallback
        }

        return (
          <div class="flex flex-col items-center justify-center py-16 text-gray-500">
            <span class="text-6xl mb-4">💥</span>
            <h3 class="text-xl font-semibold mb-2">Something went wrong</h3>
            <p class="text-sm mb-4 text-center max-w-md">
              {err?.message || 'An unexpected error occurred.'}
            </p>
            <div class="flex gap-4">
              <button
                onClick={reset}
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Try again
              </button>
              <Link
                to="/"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  )
}

/**
 * Functional error fallback component
 */
export function ErrorFallback(props: {
  error: Error
  resetErrorBoundary?: () => void
}) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-gray-500">
      <span class="text-6xl mb-4">💥</span>
      <h3 class="text-xl font-semibold mb-2">Something went wrong</h3>
      <p class="text-sm mb-4 text-center max-w-md">{props.error.message}</p>
      <div class="flex gap-4">
        {props.resetErrorBoundary && (
          <button
            onClick={props.resetErrorBoundary}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
          >
            Try again
          </button>
        )}
        <Link
          to="/"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
