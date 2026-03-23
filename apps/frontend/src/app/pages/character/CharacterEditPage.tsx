import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { characterService } from '@/app/services/characterService'
import { useCharacterStore } from '@/features/character/store/characterStore'
import { CharacterForm } from '@/features/character/components/CharacterForm'
import {
  getCharacterStatusClass,
  getCharacterStatusLabel,
} from '@/features/character/ui/statusBadge'
import type { UpdateCharacterRequest } from '@/features/character/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { SuccessModal } from '@/components/ui/SuccessModal'

interface EditPageNavigationState {
  successMessage?: string
  successDescription?: string
}

export function CharacterEditPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = (location.state as EditPageNavigationState | null) ?? null

  const {
    selectedCharacter,
    detailLoading,
    detailError,
    fetchCharacterById,
    clearErrors,
  } = useCharacterStore()

  const [showSuccess, setShowSuccess] = useState(Boolean(navigationState?.successMessage))
  const [showApiError, setShowApiError] = useState(false)
  const [showEditBlocked, setShowEditBlocked] = useState(false)

  function handleCloseSuccessModal() {
    setShowSuccess(false)
    navigate(location.pathname, { replace: true, state: null })
  }

  useEffect(() => {
    if (!id) return

    fetchCharacterById(id)

    return () => {
      clearErrors()
    }
  }, [id, fetchCharacterById, clearErrors])

  useEffect(() => {
    if (detailError) {
      setShowApiError(true)
    }
  }, [detailError])

  useEffect(() => {
    if (
      selectedCharacter &&
      selectedCharacter.id === id &&
      selectedCharacter.status === 'ARCHIVED'
    ) {
      setShowEditBlocked(true)
    }
  }, [id, selectedCharacter])

  async function handleUpdateCharacter(payload: UpdateCharacterRequest): Promise<void> {
    if (!id) {
      throw new Error('Character id is required')
    }

    const updated = await characterService.updateCharacter(id, payload)
    navigate(`/characters/${updated.id}`, {
      state: {
        successMessage: 'Character updated successfully',
        successDescription:
          'The core character details were saved and are now reflected in this character.',
      },
    })
  }

  if (detailLoading) {
    return <div className="p-8">Loading character...</div>
  }

  if (!selectedCharacter && !detailError) {
    return <div className="p-8">Character not found</div>
  }

  return (
    <>
      <ConfirmationModal
        open={showApiError}
        eyebrow="API Error"
        title="Character could not be loaded"
        message={detailError ?? ''}
        confirmLabel="Back to Characters"
        onConfirm={() => {
          setShowApiError(false)
          clearErrors()
          navigate('/characters')
        }}
        onCancel={() => {
          setShowApiError(false)
          clearErrors()
          navigate('/characters')
        }}
        showCancel={false}
        confirmVariant="default"
      />

      <ConfirmationModal
        open={showEditBlocked}
        eyebrow="Action Not Available"
        title="Character cannot be edited"
        message="Archived characters cannot be edited in this flow. Reactivate it first or duplicate it from the detail page."
        confirmLabel="Back to Character"
        onConfirm={() => {
          setShowEditBlocked(false)
          navigate(selectedCharacter ? `/characters/${selectedCharacter.id}` : '/characters')
        }}
        onCancel={() => {
          setShowEditBlocked(false)
          navigate(selectedCharacter ? `/characters/${selectedCharacter.id}` : '/characters')
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

      {selectedCharacter && selectedCharacter.id === id && selectedCharacter.status !== 'ARCHIVED' && (
        <div className="space-y-6 p-8">
          <div className="flex items-center gap-4">
            <Link to={`/characters/${selectedCharacter.id}`}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Character
              </Button>
            </Link>
          </div>

          <div>
            <h1 className="mb-2 text-3xl">Edit Character</h1>
            <p className="text-zinc-600">Update character core details and metadata</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-700">Current status</p>
            <Badge
              variant="secondary"
              className={getCharacterStatusClass(selectedCharacter.status)}
            >
              {getCharacterStatusLabel(selectedCharacter.status)}
            </Badge>
          </div>

          <CharacterForm
            mode="edit"
            character={selectedCharacter}
            onSubmit={handleUpdateCharacter}
            onCancel={() => navigate(`/characters/${selectedCharacter.id}`)}
          />
        </div>
      )}
    </>
  )
}