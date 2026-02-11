import {
  Outlet,
  createRootRoute,
} from '@tanstack/solid-router'
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'

import { TeamBottomBar } from '~/components/TeamBottomBar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div class="min-h-screen pb-14">
        <Outlet />
      </div>
      {/* Team Bottom Bar - FR-408, FR-409 */}
      <TeamBottomBar />
      {/* TanStack DevTools - Constitution Principle IV: Tutorial-Grade Quality */}
      <SolidQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
