<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@tanstack/vue-store'
import { Link } from '@tanstack/vue-router'
import { teamStore, removePal } from '~/stores/team'
import PalImage from '~/components/PalImage.vue'
import type { Pal } from '~/schemas/pal'

const isExpanded = ref(false)
const storageWarning = ref(false)

const team = useStore(teamStore, (state) => state.pals)

onMounted(() => {
  try {
    const testKey = '__paldex_storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
  } catch {
    storageWarning.value = true
  }
})
</script>

<template>
  <div v-if="team.length > 0 || isExpanded" class="fixed bottom-0 left-0 right-0 z-50">
    <!-- Storage warning banner -->
    <div
      v-if="storageWarning"
      class="bg-yellow-100 border-t border-yellow-300 px-4 py-2 text-sm text-yellow-800 text-center"
    >
      ⚠️ localStorage unavailable. Team data will not persist across sessions.
    </div>

    <div
      :class="[
        'bg-white border-t border-gray-200 shadow-lg transition-all duration-300',
        isExpanded ? 'h-48' : 'h-14',
      ]"
    >
      <!-- Toggle button -->
      <button
        type="button"
        @click="isExpanded = !isExpanded"
        class="w-full h-14 px-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">👥</span>
          <span class="font-semibold">My Team</span>
          <span class="px-2 py-0.5 bg-white/20 rounded-full text-sm">
            {{ team.length }} Pal{{ team.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <span
          class="text-xl transition-transform duration-200"
          :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }"
        >
          ▲
        </span>
      </button>

      <!-- Expanded content -->
      <div v-if="isExpanded" class="h-[calc(100%-3.5rem)] overflow-hidden">
        <div v-if="team.length === 0" class="h-full flex items-center justify-center text-gray-500">
          <div class="text-center">
            <span class="text-3xl mb-2 block">🎮</span>
            <p>No Pals in your team yet.</p>
            <p class="text-sm">Click "Add to Team" on any Pal to get started!</p>
          </div>
        </div>
        <div v-else class="h-full p-4 overflow-x-auto">
          <div class="flex gap-4">
            <div
              v-for="pal in team"
              :key="pal.id"
              class="relative flex-shrink-0 w-24 group"
            >
              <Link
                :to="'/pals/$palId'"
                :params="{ palId: pal.id }"
                class="block bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
              >
                <div class="aspect-square flex items-center justify-center p-2">
                  <PalImage
                    :src="pal.imageUrl"
                    :alt="pal.name"
                    :pal-id="pal.id"
                    fallback-icon-size="sm"
                  />
                </div>
                <div class="px-2 py-1 text-center">
                  <span class="text-xs font-medium text-gray-700 truncate block">{{ pal.name }}</span>
                </div>
              </Link>
              <button
                type="button"
                @click.prevent="removePal(pal.id)"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove from team"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
