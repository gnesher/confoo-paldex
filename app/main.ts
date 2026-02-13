import { createApp, h } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { RouterProvider } from '@tanstack/vue-router'
import { createRouter } from './router'

import './styles/globals.css'

// Create router and query client
const { router, queryClient } = createRouter()

const app = createApp({
  setup() {
    return () => h(RouterProvider, { router })
  },
})

app.use(VueQueryPlugin, { queryClient })
app.mount('#root')
