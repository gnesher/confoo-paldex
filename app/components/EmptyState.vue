<script setup lang="ts">
import LinkButton from './LinkButton.vue'

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
    <LinkButton v-if="showClearButton" to="/" :search="{}">
      Clear all filters
    </LinkButton>
  </div>
</template>
