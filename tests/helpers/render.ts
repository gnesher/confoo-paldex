import { defineComponent, h } from 'vue'
import { render } from 'vitest-browser-vue'
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/vue-router'
import { createMemoryHistory } from '@tanstack/history'
import { QueryClient } from '@tanstack/vue-query'
import { VueQueryPlugin } from '@tanstack/vue-query'
import type { Component } from 'vue'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: Infinity,
      },
    },
  })
}

export interface RenderWithProvidersOptions {
  initialPath?: string
  queryClient?: QueryClient
}

/**
 * Renders a Vue component with RouterProvider and VueQueryPlugin.
 * Use for components that need Link, useNavigate, or router context.
 */
export async function renderWithProviders<T extends Component>(
  Component: T,
  options: { props?: Record<string, unknown> } & RenderWithProvidersOptions = {},
) {
  const { props = {}, initialPath = '/', queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  const rootRoute = createRootRoute({
    component: () => h('div', { class: 'router-outlet' }, [h(Outlet)]),
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => h(Component as any, props),
  })

  const palsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/pals/$palId',
    component: () => h('div', { 'data-testid': 'pal-detail' }),
  })

  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => h('div', { 'data-testid': 'routed-page' }),
  })

  const routeTree = rootRoute.addChildren([indexRoute, palsRoute, catchAllRoute])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    context: { queryClient: testQueryClient },
    defaultPreload: false,
  })

  const Wrapper = defineComponent({
    setup() {
      return () =>
        h(RouterProvider, { router })
    },
  })

  const result = render(Wrapper, {
    global: {
      plugins: [[VueQueryPlugin, { queryClient: testQueryClient }]],
    },
  })

  return { screen: result, container: result.container, queryClient: testQueryClient, router }
}

/**
 * Renders with QueryClient only (no router).
 * Use for components that need useQuery but not navigation.
 */
export async function renderWithQuery<T extends Component>(
  Component: T,
  options: { props?: Record<string, unknown> } & Omit<RenderWithProvidersOptions, 'initialPath'> = {},
) {
  const { props = {}, queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  const result = render(Component as any, {
    props,
    global: {
      plugins: [[VueQueryPlugin, { queryClient: testQueryClient }]],
    },
  })

  return { screen: result, container: result.container, queryClient: testQueryClient }
}

/**
 * Minimal render with no providers.
 * Use for simple presentational components.
 */
export async function renderSimple<T extends Component>(
  Component: T,
  options: { props?: Record<string, unknown> } = {},
) {
  const { props = {} } = options
  const result = render(Component as any, { props })
  return { screen: result, container: result.container }
}
