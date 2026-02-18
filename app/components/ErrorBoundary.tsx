import { ErrorBoundary as SolidErrorBoundary } from 'solid-js'
import type { JSX } from 'solid-js'
import { LinkButton } from './LinkButton'

interface ErrorBoundaryProps {
  children: JSX.Element
  fallback?: JSX.Element
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SolidErrorBoundary
      fallback={(err, reset) => {
        console.error('ErrorBoundary caught an error:', err)

        if (props.fallback) {
          return props.fallback
        }

        return (
          <ErrorFallback
            error={err instanceof Error ? err : new Error('An unexpected error occurred.')}
            resetErrorBoundary={reset}
          />
        )
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  )
}

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
        <LinkButton to="/">Go to Home</LinkButton>
      </div>
    </div>
  )
}
