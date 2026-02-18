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
      <div class="h-screen overflow-hidden">
        <Outlet />
      </div>
      <TeamBottomBar />
      <SolidQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
