import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { MOCK_LAMBALL } from '../helpers/fixtures'
import { clearTeam } from '~/stores/team'
import { SuitabilityTable } from '~/components/SuitabilityTable'
import { DropsTable } from '~/components/DropsTable'
import { TeamButton } from '~/components/TeamButton'
import { PalNotFoundState } from '~/components/EmptyState'
import { PAL_TYPE_COLORS } from '~/schemas/pal'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn().mockResolvedValue([]),
  getPalById: vi.fn(),
}))

import { getPalById } from '~/utils/pals'

const mockGetPalById = vi.mocked(getPalById)

function TestDetailPage({ palId }: { palId: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-gray-600">
            <span className="mr-2">←</span>
            <span>Back to Paldex</span>
          </Link>
        </div>
      </div>
      <Suspense fallback={<div>Loading detail...</div>}>
        <DetailContent palId={palId} />
      </Suspense>
    </div>
  )
}

function DetailContent({ palId }: { palId: string }) {
  const { data: pal } = useSuspenseQuery({
    queryKey: ['pal', palId],
    queryFn: () => getPalById(palId),
  })

  if (!pal) {
    return <PalNotFoundState palId={palId} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
            <img src={pal.imageUrl} alt={pal.name} className="w-48 h-48 object-contain" />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-gray-400 font-mono">#{pal.id}</span>
              <h1 className="text-3xl font-bold text-gray-900">{pal.name}</h1>
            </div>
            <div className="flex gap-2 mb-6">
              {pal.types.map((type) => (
                <span key={type} className={`px-3 py-1 rounded-full text-sm font-medium text-white ${PAL_TYPE_COLORS[type]}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg border p-3"><span>HP</span><div>{pal.stats.hp}</div></div>
              <div className="rounded-lg border p-3"><span>Attack</span><div>{pal.stats.attack}</div></div>
              <div className="rounded-lg border p-3"><span>Defense</span><div>{pal.stats.defense}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Work Suitability</h2>
          <SuitabilityTable data={pal.suitability} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Drops</h2>
          <DropsTable data={pal.drops} />
        </div>
      </div>
      <div className="mt-8 text-center pb-20">
        <TeamButton pal={pal} size="lg" />
      </div>
    </div>
  )
}

async function renderDetailPage(palId: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: Infinity },
    },
  })

  const rootRoute = createRootRoute({
    component: () => (
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    ),
  })

  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Home</div>,
  })

  const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/detail',
    component: () => <TestDetailPage palId={palId} />,
  })

  const catchAll = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => <div />,
  })

  const routeTree = rootRoute.addChildren([homeRoute, detailRoute, catchAll])
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/detail'] }),
  })

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  return { screen, queryClient }
}

describe('Detail Page Integration', () => {
  beforeEach(() => {
    clearTeam()
    mockGetPalById.mockReset()
  })

  it('should render the Pal name and stats after loading', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
    await expect.element(screen.getByText('HP')).toBeInTheDocument()
    await expect.element(screen.getByText('Attack')).toBeInTheDocument()
    await expect.element(screen.getByText('Defense')).toBeInTheDocument()
  })

  it('should render the Pal image', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByAltText('Lamball')).toBeInTheDocument()
  })

  it('should render type badges', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('should render the SuitabilityTable section', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Work Suitability')).toBeInTheDocument()
    await expect.element(screen.getByText('Handiwork')).toBeInTheDocument()
    await expect.element(screen.getByText('Transporting')).toBeInTheDocument()
    await expect.element(screen.getByText('Farming')).toBeInTheDocument()
  })

  it('should render the DropsTable section', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Drops')).toBeInTheDocument()
    await expect.element(screen.getByText('Wool')).toBeInTheDocument()
  })

  it('should render the TeamButton', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should toggle team membership via TeamButton', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    await screen.getByText('Remove from Team').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should render "Back to Paldex" link', async () => {
    mockGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderDetailPage('001')

    await expect.element(screen.getByText('Back to Paldex')).toBeInTheDocument()
  })

  it('should show PalNotFound when Pal does not exist', async () => {
    mockGetPalById.mockResolvedValue(null)
    const { screen } = await renderDetailPage('999')

    await expect.element(screen.getByText('Pal Not Found')).toBeInTheDocument()
    await expect.element(screen.getByText(/No Pal with ID "999" exists/)).toBeInTheDocument()
  })
})
