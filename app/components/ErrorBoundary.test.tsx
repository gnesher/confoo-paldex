import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { renderWithProviders } from '../../tests/helpers/render'
import ErrorBoundary from './ErrorBoundary.vue'
import ErrorFallback from './ErrorFallback.vue'

const GoodComponent = defineComponent({
  name: 'GoodComponent',
  setup() {
    return () => h('div', 'Everything is fine')
  },
})

const ThrowingComponent = defineComponent({
  name: 'ThrowingComponent',
  props: { message: { type: String, required: true } },
  setup(props) {
    throw new Error(props.message)
  },
})

describe('ErrorFallback', () => {
  it('should show error message', async () => {
    const { screen } = await renderWithProviders(ErrorFallback, {
      props: { error: new Error('Something broke') },
    })
    await expect.element(screen.getByText('Something went wrong')).toBeInTheDocument()
    await expect.element(screen.getByText('Something broke')).toBeInTheDocument()
  })

  it('should show "Try again" button when resetErrorBoundary is provided', async () => {
    const reset = vi.fn()
    const { screen } = await renderWithProviders(ErrorFallback, {
      props: {
        error: new Error('Fail'),
        resetErrorBoundary: reset,
      },
    })
    await expect.element(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
  })

  it('should not show "Try again" when resetErrorBoundary is not provided', async () => {
    const { screen } = await renderWithProviders(ErrorFallback, {
      props: { error: new Error('Fail') },
    })
    const buttons = await screen.getByRole('button', { name: /try again/i }).all()
    expect(buttons).toHaveLength(0)
  })

  it('should call resetErrorBoundary when Try again is clicked', async () => {
    const reset = vi.fn()
    const { screen } = await renderWithProviders(ErrorFallback, {
      props: {
        error: new Error('Fail'),
        resetErrorBoundary: reset,
      },
    })
    const tryAgainButton = screen.getByRole('button', { name: /try again/i })
    await tryAgainButton.click()
    expect(reset).toHaveBeenCalled()
  })
})

const ErrorBoundaryWithGoodChild = defineComponent({
  name: 'ErrorBoundaryWithGoodChild',
  setup() {
    return () => h(ErrorBoundary, null, { default: () => h(GoodComponent) })
  },
})

const ErrorBoundaryWithThrowingChild = defineComponent({
  name: 'ErrorBoundaryWithThrowingChild',
  setup() {
    return () =>
      h(ErrorBoundary, null, {
        default: () => h(ThrowingComponent, { message: 'Test error message' }),
      })
  },
})

describe('ErrorBoundary', () => {
  it('should render children normally', async () => {
    const { screen } = await renderWithProviders(ErrorBoundaryWithGoodChild)
    await expect.element(screen.getByText('Everything is fine')).toBeInTheDocument()
  })

  it('should catch errors and show ErrorFallback', async () => {
    const { screen } = await renderWithProviders(ErrorBoundaryWithThrowingChild)
    await expect.element(screen.getByText('Something went wrong')).toBeInTheDocument()
    await expect.element(screen.getByText('Test error message')).toBeInTheDocument()
  })
})
