import { Component, type ReactNode } from 'react'
import { LinkButton } from './LinkButton'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error ?? new Error('An unexpected error occurred.')}
          resetErrorBoundary={() =>
            this.setState({ hasError: false, error: undefined })
          }
        />
      )
    }

    return this.props.children
  }
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <span className="text-6xl mb-4">💥</span>
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm mb-4 text-center max-w-md">{error.message}</p>
      <div className="flex gap-4">
        {resetErrorBoundary && (
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
          >
            Try again
          </button>
        )}
        <LinkButton to="/">Go to Home</LinkButton>
      </div>
    </div>
  )
}
