// Route tree for TanStack Router

import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as PalDetailRoute } from './routes/pals/$palId'

// Build the route tree
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  PalDetailRoute,
])
