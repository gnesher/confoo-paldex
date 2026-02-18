<script setup lang="ts">
import LinkButton from './LinkButton.vue'

defineProps<{
  palId: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-gray-500">
    <span class="text-6xl mb-4">🎮</span>
    <h3 class="text-xl font-semibold mb-2">Pal Not Found</h3>
    <p class="text-sm mb-4">
      No Pal with ID "{{ palId }}" exists in the Paldex.
    </p>
    <LinkButton to="/">Browse All Pals</LinkButton>
  </div>
</template>
