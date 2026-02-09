import {
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { TeamBottomBar } from '~/components/TeamBottomBar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen pb-14">
        <Outlet />
      </div>
      {/* Team Bottom Bar - FR-408, FR-409 */}
      <TeamBottomBar />
      {/* TanStack DevTools - Constitution Principle IV: Tutorial-Grade Quality */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
