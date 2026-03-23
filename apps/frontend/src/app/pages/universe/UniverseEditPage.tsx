import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { universeService } from '@/app/services/universeService'
import { useUniverseStore } from '@/features/universe/store/universeStore'
import { UniverseForm } from '@/features/universe/components/UniverseForm'
import {
  getUniverseStatusClass,
  getUniverseStatusLabel,
} from '@/features/universe/ui/statusBadge'
import type { UpdateUniverseRequest } from '@/features/universe/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { SuccessModal } from '@/components/ui/SuccessModal'

interface EditPageNavigationState {
  successMessage?: string
  successDescription?: string
}

export function UniverseEditPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = (location.state as EditPageNavigationState | null) ?? null

  const {
    selectedUniverse,
    detailLoading,
    detailError,
    fetchUniverseById,
    clearErrors,
  } = useUniverseStore()

  const [showSuccess, setShowSuccess] = useState(Boolean(navigationState?.successMessage))
  const [showApiError, setShowApiError] = useState(false)
  const [showEditBlocked, setShowEditBlocked] = useState(false)

  function handleCloseSuccessModal() {
    setShowSuccess(false)
    navigate(location.pathname, { replace: true, state: null })
  }

  useEffect(() => {
    if (!id) return

    fetchUniverseById(id)

    return () => {
      clearErrors()
    }
  }, [id, fetchUniverseById, clearErrors])

  useEffect(() => {
    if (detailError) {
      setShowApiError(true)
    }
  }, [detailError])

  useEffect(() => {
    if (
      selectedUniverse &&
      selectedUniverse.id === id &&
      selectedUniverse.status === 'ARCHIVED'
    ) {
      setShowEditBlocked(true)
    }
  }, [id, selectedUniverse])

  async function handleUpdateUniverse(payload: UpdateUniverseRequest): Promise<void> {
    if (!id) {
      throw new Error('Universe id is required')
    }

    const updated = await universeService.updateUniverse(id, payload)
    navigate(`/universes/${updated.id}`, {
      state: {
        successMessage: 'Universe updated successfully',
        successDescription:
          'The core universe details were saved and are now reflected in this universe.',
      },
    })
  }

  if (detailLoading) {
    return <div className="p-8">Loading universe...</div>
  }

  if (!selectedUniverse && !detailError) {
    return <div className="p-8">Universe not found</div>
  }

  return (
    <>
      <ConfirmationModal
        open={showApiError}
        eyebrow="API Error"
        title="Universe could not be loaded"
        message={detailError ?? ''}
        confirmLabel="Back to Universes"
        onConfirm={() => {
          setShowApiError(false)
          clearErrors()
          navigate('/universes')
        }}
        onCancel={() => {
          setShowApiError(false)
          clearErrors()
          navigate('/universes')
        }}
        showCancel={false}
        confirmVariant="default"
      />

      <ConfirmationModal
        open={showEditBlocked}
        eyebrow="Action Not Available"
        title="Universe cannot be edited"
        message="Archived universes cannot be edited in this flow. Reactivate it first or duplicate it from the detail page."
        confirmLabel="Back to Universe"
        onConfirm={() => {
          setShowEditBlocked(false)
          navigate(selectedUniverse ? `/universes/${selectedUniverse.id}` : '/universes')
        }}
        onCancel={() => {
          setShowEditBlocked(false)
          navigate(selectedUniverse ? `/universes/${selectedUniverse.id}` : '/universes')
        }}
        showCancel={false}
        confirmVariant="default"
      />

      <SuccessModal
        open={showSuccess}
        message={navigationState?.successMessage ?? ''}
        description={navigationState?.successDescription}
        onClose={handleCloseSuccessModal}
      />

      {selectedUniverse && selectedUniverse.id === id && selectedUniverse.status !== 'ARCHIVED' && (
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

        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">Current status</p>
          <Badge
            variant="secondary"
            className={getUniverseStatusClass(selectedUniverse.status)}
          >
            {getUniverseStatusLabel(selectedUniverse.status)}
          </Badge>
        </div>

        <UniverseForm
          mode="edit"
          universe={selectedUniverse}
          onSubmit={handleUpdateUniverse}
          onCancel={() => navigate(`/universes/${selectedUniverse.id}`)}
        />
      </div>
      )}
    </>
  )
}
