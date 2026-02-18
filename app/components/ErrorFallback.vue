<script setup lang="ts">
import LinkButton from './LinkButton.vue'

defineProps<{
  error: Error
  resetErrorBoundary?: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-500">
    <span class="text-6xl mb-4">💥</span>
    <h3 class="text-xl font-semibold mb-2">Something went wrong</h3>
    <p class="text-sm mb-4 text-center max-w-md">{{ error.message }}</p>
    <div class="flex gap-4">
      <button
        v-if="resetErrorBoundary"
        @click="resetErrorBoundary"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
      >
        Try again
      </button>
      <LinkButton to="/">Go to Home</LinkButton>
    </div>
  </div>
</template>
