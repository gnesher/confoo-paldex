import { defineComponent, h } from 'vue'

/**
 * Grid stats display for debugging/demo purposes
 */
export const PalGridStats = defineComponent({
  name: 'PalGridStats',
  props: {
    total: { type: Number, required: true },
    visible: { type: Number, required: true },
  },
  setup(props) {
    return () =>
      h('div', { class: 'text-xs text-gray-400 mb-2' },
        `Showing ${props.visible} of ${props.total} Pals (virtualized)`)
  },
})
