<script setup lang="ts">
import { Link } from '@tanstack/vue-router'
import type { Pal } from '~/schemas/pal'
import TypeBadge from './TypeBadge.vue'
import PalImage from './PalImage.vue'

defineProps<{
  pal: Pal
}>()
</script>

<template>
  <Link
    :to="'/pals/$palId'"
    :params="{ palId: pal.id }"
    class="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5"
  >
    <!-- Image section -->
    <div class="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3">
      <PalImage :src="pal.imageUrl" :alt="pal.name" :pal-id="pal.id" />
    </div>

    <!-- Content section -->
    <div class="p-3">
      <!-- ID and Name -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-[10px] text-gray-400 font-mono bg-gray-50 px-1 py-0.5 rounded">
          #{{ pal.id }}
        </span>
        <h3 class="font-semibold text-gray-900 truncate text-sm">{{ pal.name }}</h3>
      </div>

      <!-- Types -->
      <div class="flex flex-wrap gap-1 mb-2">
        <TypeBadge v-for="type in pal.types" :key="type" :type="type" />
      </div>

      <!-- Stats preview -->
      <div class="flex justify-between text-xs text-gray-500 border-t border-gray-50 pt-2">
        <div class="flex items-center gap-0.5">
          <span>❤️</span>
          <span class="font-medium">{{ pal.stats.hp }}</span>
        </div>
        <div class="flex items-center gap-0.5">
          <span>⚔️</span>
          <span class="font-medium">{{ pal.stats.attack }}</span>
        </div>
        <div class="flex items-center gap-0.5">
          <span>🛡️</span>
          <span class="font-medium">{{ pal.stats.defense }}</span>
        </div>
      </div>
    </div>
  </Link>
</template>
