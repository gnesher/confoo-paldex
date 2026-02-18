import { createFileRoute } from '@tanstack/react-router'
import { PalDetail } from '~/components/PalDetail'

export const Route = createFileRoute('/pals/$palId')({
  component: PalDetailPage,
})

function PalDetailPage() {
  const { palId } = Route.useParams()
  return <PalDetail palId={palId} />
}
