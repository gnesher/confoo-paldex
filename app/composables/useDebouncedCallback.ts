import { Debouncer } from '@tanstack/pacer'
import { onUnmounted } from 'vue'

/**
 * Vue composable wrapping TanStack Pacer's vanilla Debouncer.
 * Replaces @tanstack/react-pacer's useDebouncedCallback.
 */
export function useDebouncedCallback<TArgs extends Array<unknown>>(
  fn: (...args: TArgs) => void,
  options: { wait: number },
): (...args: TArgs) => void {
  const debouncer = new Debouncer(fn, options)

  onUnmounted(() => {
    debouncer.cancel()
  })

  return (...args: TArgs) => {
    debouncer.maybeExecute(...args)
  }
}
