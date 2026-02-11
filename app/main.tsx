import { render } from 'solid-js/web'
import { RouterProvider } from '@tanstack/solid-router'
import { QueryClientProvider } from '@tanstack/solid-query'
import { createRouter } from './router'

import './styles/globals.css'

// Create router and query client
const { router, queryClient } = createRouter()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

// Mount the app
const rootElement = document.getElementById('root')
if (rootElement) {
  render(() => <App />, rootElement)
} else {
  console.error('Root element not found!')
}
