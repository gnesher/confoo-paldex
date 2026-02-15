import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ErrorBoundary, ErrorFallback } from './ErrorBoundary'
import { renderWithProviders } from '../../tests/helpers/render'

function ThrowingComponent({ message }: { message: string }): never {
  throw new Error(message)
}

function GoodComponent() {
  return <div>Everything is fine</div>
}

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalConsoleError
  })

  it('should render children when no error occurs', async () => {
    const { screen } = await renderWithProviders(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    )
    await expect.element(screen.getByText('Everything is fine')).toBeInTheDocument()
  })

  it('should catch errors and show fallback UI', async () => {
    const { screen } = await renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent message="Test error message" />
      </ErrorBoundary>
    )
    await expect.element(screen.getByText('Something went wrong')).toBeInTheDocument()
    await expect.element(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should show "Try again" and "Go to Home" buttons on error', async () => {
    const { screen } = await renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent message="Oops" />
      </ErrorBoundary>
    )
    await expect.element(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
    await expect.element(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument()
  })

  it('should use custom fallback when provided', async () => {
    const { screen } = await renderWithProviders(
      <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
        <ThrowingComponent message="Oops" />
      </ErrorBoundary>
    )
    await expect.element(screen.getByText('Custom fallback UI')).toBeInTheDocument()
    await expect.element(screen.getByText('Something went wrong')).not.toBeInTheDocument()
  })
})

describe('ErrorFallback', () => {
  it('should render the error message', async () => {
    const { screen } = await renderWithProviders(
      <ErrorFallback error={new Error('Something broke')} />
    )
    await expect.element(screen.getByText('Something went wrong')).toBeInTheDocument()
    await expect.element(screen.getByText('Something broke')).toBeInTheDocument()
  })

  it('should render "Try again" button when resetErrorBoundary is provided', async () => {
    const reset = vi.fn()
    const { screen } = await renderWithProviders(
      <ErrorFallback
        error={new Error('Fail')}
        resetErrorBoundary={reset}
      />
    )
    await expect.element(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
  })

  it('should not render "Try again" button when no resetErrorBoundary', async () => {
    const { screen } = await renderWithProviders(
      <ErrorFallback error={new Error('Fail')} />
    )
    await expect.element(
      screen.getByRole('button', { name: /try again/i })
    ).not.toBeInTheDocument()
  })

  it('should call resetErrorBoundary when "Try again" is clicked', async () => {
    const reset = vi.fn()
    const { screen } = await renderWithProviders(
      <ErrorFallback
        error={new Error('Fail')}
        resetErrorBoundary={reset}
      />
    )
    await screen.getByRole('button', { name: /try again/i }).click()
    expect(reset).toHaveBeenCalledOnce()
  })
})
