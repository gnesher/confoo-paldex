import { createFileRoute, useParams } from '@tanstack/vue-router'
import { defineComponent, h } from 'vue'
import { PalDetail } from '~/components/PalDetail'

export const Route = createFileRoute('/pals/$palId')({
  component: defineComponent({
    name: 'PalDetailPage',
    setup() {
      const params = useParams({ from: '/pals/$palId' })
      return () => h(PalDetail, { palId: params.value.palId })
    },
  }),
})
