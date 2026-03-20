import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { updateUniverseMock } from '@/app/services/universeService'
import { useUniverseStore } from '@/features/universe/store/universeStore'
import { UniverseForm } from '@/features/universe/components/UniverseForm'
import type { UpdateUniverseRequest } from '@/features/universe/types'

import { Button } from '@/components/ui/button'

export function UniverseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    selectedUniverse,
    detailLoading,
    detailError,
    fetchUniverseById,
    clearErrors,
  } = useUniverseStore()

  useEffect(() => {
    if (!id) return

    fetchUniverseById(id)

    return () => {
      clearErrors()
    }
  }, [id, fetchUniverseById, clearErrors])

  async function handleUpdateUniverse(payload: UpdateUniverseRequest): Promise<void> {
    if (!id) {
      throw new Error('Universe id is required')
    }

    const updated = await updateUniverseMock(id, payload)
    navigate(`/universes/${updated.id}`)
  }

  if (detailLoading) {
    return <div className="p-8">Loading universe...</div>
  }

  if (detailError) {
    return <div className="p-8 text-red-600">{detailError}</div>
  }

  if (!selectedUniverse) {
    return <div className="p-8">Universe not found</div>
  }

  if (selectedUniverse.status !== 'DRAFT' && selectedUniverse.status !== 'ACTIVE') {
    return (
      <div className="p-8 text-red-600">
        This universe cannot be edited in this flow.
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/universes/${selectedUniverse.id}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Universe
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl mb-2">Edit Universe</h1>
        <p className="text-zinc-600">Update universe core details and metadata</p>
      </div>

      <UniverseForm
        mode="edit"
        universe={selectedUniverse}
        onSubmit={handleUpdateUniverse}
      />
    </div>
  )
}
