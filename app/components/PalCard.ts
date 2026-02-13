// Re-exports for backward compatibility with named imports
export { default as PalCard } from './PalCard.vue'

// PalCardSkeleton as a functional component for use in TSX route files
import { defineComponent, h } from 'vue'

export const PalCardSkeleton = defineComponent({
  name: 'PalCardSkeleton',
  setup() {
    return () =>
      h('div', { class: 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse' }, [
        h('div', { class: 'aspect-[4/3] bg-gray-100' }),
        h('div', { class: 'p-3' }, [
          h('div', { class: 'flex items-center gap-2 mb-2' }, [
            h('div', { class: 'h-4 w-8 bg-gray-100 rounded' }),
            h('div', { class: 'h-4 bg-gray-100 rounded flex-1' }),
          ]),
          h('div', { class: 'flex gap-1 mb-2' }, [
            h('div', { class: 'h-5 w-14 bg-gray-100 rounded-full' }),
          ]),
          h('div', { class: 'flex justify-between pt-2 border-t border-gray-50' }, [
            h('div', { class: 'h-3 w-10 bg-gray-100 rounded' }),
            h('div', { class: 'h-3 w-10 bg-gray-100 rounded' }),
            h('div', { class: 'h-3 w-10 bg-gray-100 rounded' }),
          ]),
        ]),
      ])
  },
})
