import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ErrorBoundary, ErrorFallback } from './ErrorBoundary'
import { renderWithProviders } from '../../tests/helpers/render'

// Component that throws an error on render
function ThrowingComponent({ message }: { message: string }) {
  throw new Error(message)
}

// Component that renders normally
function GoodComponent() {
  return <div>Everything is fine</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error from React error boundary during tests
  const originalConsoleError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalConsoleError
  })

  it('should render children when no error occurs', async () => {
    await renderWithProviders(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Everything is fine')).toBeInTheDocument()
  })

  it('should catch errors and show fallback UI', async () => {
    await renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent message="Test error message" />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should show "Try again" and "Go to Home" buttons on error', async () => {
    await renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent message="Oops" />
      </ErrorBoundary>
    )
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument()
  })

  it('should use custom fallback when provided', async () => {
    await renderWithProviders(
      <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
        <ThrowingComponent message="Oops" />
      </ErrorBoundary>
    )
    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})

describe('ErrorFallback', () => {
  it('should render the error message', async () => {
    await renderWithProviders(
      <ErrorFallback error={new Error('Something broke')} />
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Something broke')).toBeInTheDocument()
  })

  it('should render "Try again" button when resetErrorBoundary is provided', async () => {
    const reset = vi.fn()
    await renderWithProviders(
      <ErrorFallback
        error={new Error('Fail')}
        resetErrorBoundary={reset}
      />
    )
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
  })

  it('should not render "Try again" button when no resetErrorBoundary', async () => {
    await renderWithProviders(
      <ErrorFallback error={new Error('Fail')} />
    )
    expect(
      screen.queryByRole('button', { name: /try again/i })
    ).not.toBeInTheDocument()
  })

  it('should call resetErrorBoundary when "Try again" is clicked', async () => {
    const reset = vi.fn()
    const { user } = await renderWithProviders(
      <ErrorFallback
        error={new Error('Fail')}
        resetErrorBoundary={reset}
      />
    )
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(reset).toHaveBeenCalledOnce()
  })
})
