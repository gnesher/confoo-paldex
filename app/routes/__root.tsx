import {
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { TeamBottomBar } from '~/components/TeamBottomBar'
import { CookieBanner } from '~/components/CookieBanner'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="h-screen overflow-hidden">
        <Outlet />
      </div>
      <TeamBottomBar />
      <CookieBanner />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
