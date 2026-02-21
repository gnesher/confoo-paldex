import { createFileRoute } from '@tanstack/solid-router'
import { PalDetail } from '~/components/PalDetail'

export const Route = createFileRoute('/pals/$palId')({
  component: PalDetailPage,
})

function PalDetailPage() {
  const params = Route.useParams()
  return <PalDetail palId={params().palId} />
}
