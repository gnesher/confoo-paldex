import { defineComponent, h } from 'vue'
import {
  Outlet,
  createRootRoute,
} from '@tanstack/vue-router'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/vue-router-devtools'

import TeamBottomBar from '~/components/TeamBottomBar.vue'

export const Route = createRootRoute({
  component: defineComponent({
    name: 'RootComponent',
    setup() {
      return () =>
        h('div', {}, [
          h('div', { class: 'h-screen overflow-hidden' }, [
            h(Outlet),
          ]),
          h(TeamBottomBar),
          h(VueQueryDevtools, { initialIsOpen: false, buttonPosition: 'bottom-left' }),
          h(TanStackRouterDevtools, { position: 'bottom-right' }),
        ])
    },
  }),
})
