<script setup lang="ts">
import { Link } from '@tanstack/vue-router'

withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'The page you are looking for does not exist.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-500">
    <span class="text-6xl mb-4">😕</span>
    <h3 class="text-xl font-semibold mb-2">Page Not Found</h3>
    <p class="text-sm mb-4">{{ message }}</p>
    <Link
      to="/"
      class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
    >
      Go to Home
    </Link>
  </div>
</template>
