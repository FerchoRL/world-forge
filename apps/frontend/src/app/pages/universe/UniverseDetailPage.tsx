import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'

import { universeService } from '@/app/services/universeService'
import { useUniverseStore } from '@/features/universe/store/universeStore'
import {
  getUniverseStatusClass,
  getUniverseStatusLabel,
} from '@/features/universe/ui/statusBadge'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { SuccessModal } from '@/components/ui/SuccessModal'
import { HttpError } from '@/app/api/httpClient'

interface DetailPageNavigationState {
  successMessage?: string
  successDescription?: string
}

export function UniverseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = (location.state as DetailPageNavigationState | null) ?? null
  const {
    selectedUniverse,
    detailLoading,
    detailError,
    fetchUniverseById,
    clearErrors,
  } = useUniverseStore()

  const [activating, setActivating] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [reactivating, setReactivating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(Boolean(navigationState?.successMessage))
  const [showDuplicateConfirmation, setShowDuplicateConfirmation] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState(navigationState?.successMessage ?? '')
  const [successDescription, setSuccessDescription] = useState(navigationState?.successDescription ?? '')

  function handleCloseSuccessModal() {
    setShowSuccess(false)
    navigate(location.pathname, { replace: true, state: null })
  }

  function showActionError(title: string, error: unknown) {
    const message =
      error instanceof HttpError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unexpected error occurred'

    setAlertTitle(title)
    setAlertMessage(message)
    setShowAlert(true)
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
      setAlertTitle('Universe could not be loaded')
      setAlertMessage(detailError)
      setShowAlert(true)
    }
  }, [detailError])

  async function handleActivateUniverse() {
    if (!selectedUniverse?.id) return

    setActivating(true)

    try {
      await universeService.changeStatus(selectedUniverse.id, 'ACTIVE')
      await fetchUniverseById(selectedUniverse.id)
      setSuccessMessage('Universe activated successfully!')
      setSuccessDescription(
        'This universe is now ACTIVE: it is ready for stories, can still be edited, and works as a consolidated narrative board.'
      )
      setShowSuccess(true)
    } catch (error) {
      showActionError('Universe could not be activated', error)
    } finally {
      setActivating(false)
    }
  }

  async function handleReactivateUniverse() {
    if (!selectedUniverse?.id) return

    setReactivating(true)

    try {
      await universeService.changeStatus(selectedUniverse.id, 'ACTIVE')
      await fetchUniverseById(selectedUniverse.id)
      setSuccessMessage('Universe reactivated successfully!')
      setSuccessDescription(
        'This universe is ACTIVE again: it can be edited, used for stories, and returns to the active creative cycle.'
      )
      setShowSuccess(true)
    } catch (error) {
      showActionError('Universe could not be reactivated', error)
    } finally {
      setReactivating(false)
    }
  }

  async function handleArchiveUniverse() {
    if (!selectedUniverse?.id) return

    setArchiving(true)

    try {
      await universeService.changeStatus(selectedUniverse.id, 'ARCHIVED')
      await fetchUniverseById(selectedUniverse.id)
      setSuccessMessage('Universe archived successfully!')
      setSuccessDescription(
        'This universe is now ARCHIVED: it is closed for new active story use, keeps existing content, and can be reactivated later.'
      )
      setShowSuccess(true)
    } catch (error) {
      showActionError('Universe could not be archived', error)
    } finally {
      setArchiving(false)
    }
  }

  async function handleDuplicateUniverse() {
    if (!selectedUniverse?.id) return

    setDuplicating(true)

    try {
      const created = await universeService.createFromArchived(selectedUniverse.id)

      navigate(`/universes/${created.id}/edit`, {
        state: {
          successMessage: 'Universe duplicated successfully',
          successDescription:
            'A new DRAFT universe was created from this archived version and is ready to be edited.',
        },
      })
    } catch (error) {
      showActionError('Universe could not be duplicated', error)
    } finally {
      setDuplicating(false)
      setShowDuplicateConfirmation(false)
    }
  }

  if (detailLoading) {
    return <div className="p-8">Loading universe...</div>
  }

  if (!selectedUniverse && !detailError) {
    return <div className="p-8">Universe not found</div>
  }

  const rules = selectedUniverse?.rules ?? []

  return (
    <>
      <ConfirmationModal
        open={showAlert}
        eyebrow="Alert"
        title={alertTitle}
        message={alertMessage}
        confirmLabel="Close"
        onConfirm={() => {
          setShowAlert(false)
          if (detailError) {
            clearErrors()
            navigate('/universes')
          }
        }}
        onCancel={() => {
          setShowAlert(false)
          if (detailError) {
            clearErrors()
            navigate('/universes')
          }
        }}
        showCancel={false}
        confirmVariant="default"
      />

      <ConfirmationModal
        open={showDuplicateConfirmation}
        eyebrow="Create Copy"
        title="Duplicate Universe"
        message="You are about to create a new Universe from this archived version"
        confirmLabel={duplicating ? 'Duplicating...' : 'Confirm'}
        cancelLabel="Cancel"
        onConfirm={handleDuplicateUniverse}
        onCancel={() => setShowDuplicateConfirmation(false)}
        confirmDisabled={duplicating}
      />

      <SuccessModal
        open={showSuccess}
        message={successMessage}
        description={successDescription}
        onClose={handleCloseSuccessModal}
      />

      {selectedUniverse && (
        <div className="p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/universes">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Universes
            </Button>
          </Link>
        </div>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl">{selectedUniverse.name}</h1>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={getUniverseStatusClass(selectedUniverse.status)}
              >
                {getUniverseStatusLabel(selectedUniverse.status)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {selectedUniverse.status !== 'ARCHIVED' && (
              <Link to={`/universes/${selectedUniverse.id}/edit`}>
                <Button className="flex items-center gap-2" type="button">
                  <Pencil className="h-4 w-4" />
                  Edit Universe
                </Button>
              </Link>
            )}

            {selectedUniverse.status === 'DRAFT' && (
              <Button
                variant="default"
                size="sm"
                className="mt-2"
                onClick={handleActivateUniverse}
                disabled={activating}
              >
                {activating ? 'Activating...' : 'Activate Universe'}
              </Button>
            )}

            {selectedUniverse.status === 'ACTIVE' && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={handleArchiveUniverse}
                disabled={archiving}
              >
                {archiving ? 'Archiving...' : 'Archive Universe'}
              </Button>
            )}

            {selectedUniverse.status === 'ARCHIVED' && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleReactivateUniverse}
                disabled={reactivating}
              >
                {reactivating ? 'Reactivating...' : 'Reactivate Universe'}
              </Button>
            )}

            {selectedUniverse.status === 'ARCHIVED' && (
              <Button
                variant="default"
                size="sm"
                className="mt-2"
                onClick={() => setShowDuplicateConfirmation(true)}
              >
                Duplicate Universe
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Premise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-zinc-700">{selectedUniverse.premise ?? '—'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {rules.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {rules.map((rule, index) => (
                    <Badge key={`${rule}-${index}`} variant="secondary">
                      {rule}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="leading-relaxed text-zinc-700">—</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-zinc-700">{selectedUniverse.notes ?? '—'}</p>
            </CardContent>
          </Card>
        </div>
        </div>
      )}
    </>
  )
}
