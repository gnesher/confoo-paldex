<script setup lang="ts">
import { Link } from '@tanstack/vue-router'

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
    <Link
      to="/"
      class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
    >
      Browse All Pals
    </Link>
  </div>
</template>
