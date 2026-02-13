<script setup lang="ts">
import { Link } from '@tanstack/vue-router'

withDefaults(defineProps<{
  title?: string
  message?: string
  icon?: string
  showClearButton?: boolean
}>(), {
  title: 'No Pals found',
  message: 'Try adjusting your search filters',
  icon: '🔍',
  showClearButton: true,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-500">
    <span class="text-6xl mb-4">{{ icon }}</span>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-sm mb-4">{{ message }}</p>
    <Link
      v-if="showClearButton"
      to="/"
      :search="{}"
      class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
    >
      Clear all filters
    </Link>
  </div>
</template>
