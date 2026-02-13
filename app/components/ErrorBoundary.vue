<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import ErrorFallback from './ErrorFallback.vue'

const hasError = ref(false)
const error = ref<Error | undefined>(undefined)

onErrorCaptured((err) => {
  hasError.value = true
  error.value = err instanceof Error ? err : new Error(String(err))
  console.error('ErrorBoundary caught an error:', err)
  return false // prevent propagation
})

function reset() {
  hasError.value = false
  error.value = undefined
}
</script>

<template>
  <ErrorFallback v-if="hasError" :error="error!" :reset-error-boundary="reset" />
  <slot v-else />
</template>
