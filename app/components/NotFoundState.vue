<script setup lang="ts">
import LinkButton from './LinkButton.vue'

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
    <LinkButton to="/">Go to Home</LinkButton>
  </div>
</template>
