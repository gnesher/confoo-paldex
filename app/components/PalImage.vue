<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  palId: string
  class?: string
  fallbackIconSize?: 'sm' | 'md' | 'lg'
}>(), {
  class: 'w-full h-full object-contain',
  fallbackIconSize: 'md',
})

const hasError = ref(false)

const iconSizeClasses: Record<string, string> = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-8xl',
}
</script>

<template>
  <div v-if="hasError" class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
    <span :class="iconSizeClasses[fallbackIconSize]">🎮</span>
    <span class="text-xs mt-1 font-mono">#{{ palId }}</span>
  </div>
  <img
    v-else
    :src="src"
    :alt="alt"
    :class="props.class"
    loading="lazy"
    @error="hasError = true"
  />
</template>
