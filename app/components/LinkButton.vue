<script setup lang="ts">
import { Link } from '@tanstack/vue-router'

defineProps<{
  to: string
  search?: Record<string, unknown>
}>()
</script>

<template>
  <Link
    :to="to"
    :search="search"
    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
  >
    <slot />
  </Link>
</template>
