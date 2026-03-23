import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'

import { characterService } from '@/app/services/characterService'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    getCharacterStatusClass,
    getCharacterStatusLabel,
} from '@/features/character/ui/statusBadge'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'
import { SuccessModal } from '@/components/ui/SuccessModal'
import { HttpError } from '@/app/api/httpClient'

import { useCharacterStore } from '@/features/character/store/characterStore'

interface DetailPageNavigationState {
    successMessage?: string
    successDescription?: string
}

export function CharacterDetailPage() {
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const navigationState = (location.state as DetailPageNavigationState | null) ?? null

    const {
        selectedCharacter,
        detailLoading,
        detailError,
        fetchCharacterById,
        clearErrors,
    } = useCharacterStore()

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

        fetchCharacterById(id)

        return () => {
            clearErrors()
        }
    }, [id, fetchCharacterById, clearErrors])

    useEffect(() => {
        if (detailError) {
            setAlertTitle('Character could not be loaded')
            setAlertMessage(detailError)
            setShowAlert(true)
        }
    }, [detailError])

    async function handleActivateCharacter() {
        if (!selectedCharacter?.id) return

        setActivating(true)

        try {
            await characterService.changeStatus(selectedCharacter.id, 'ACTIVE')
            await fetchCharacterById(selectedCharacter.id)
            setSuccessMessage('Character activated successfully!')
            setSuccessDescription(
                'This character is now ACTIVE: it is ready for stories, can still be edited, and participates fully in the narrative flow.'
            )
            setShowSuccess(true)
        } catch (error) {
            showActionError('Character could not be activated', error)
        } finally {
            setActivating(false)
        }
    }

    async function handleReactivateCharacter() {
        if (!selectedCharacter?.id) return

        setReactivating(true)

        try {
            await characterService.changeStatus(selectedCharacter.id, 'ACTIVE')
            await fetchCharacterById(selectedCharacter.id)
            setSuccessMessage('Character reactivated successfully!')
            setSuccessDescription(
                'This character is ACTIVE again: it can be edited, used in stories, and returns to the active creative cycle.'
            )
            setShowSuccess(true)
        } catch (error) {
            showActionError('Character could not be reactivated', error)
        } finally {
            setReactivating(false)
        }
    }

    async function handleArchiveCharacter() {
        if (!selectedCharacter?.id) return

        setArchiving(true)

        try {
            await characterService.changeStatus(selectedCharacter.id, 'ARCHIVED')
            await fetchCharacterById(selectedCharacter.id)
            setSuccessMessage('Character archived successfully!')
            setSuccessDescription(
                'This character is now ARCHIVED: it is preserved for reference and can be reactivated or duplicated later.'
            )
            setShowSuccess(true)
        } catch (error) {
            showActionError('Character could not be archived', error)
        } finally {
            setArchiving(false)
        }
    }

    async function handleDuplicateCharacter() {
        if (!selectedCharacter?.id) return

        setDuplicating(true)

        try {
            const created = await characterService.createFromArchived(selectedCharacter.id)

            navigate(`/characters/${created.id}/edit`, {
                state: {
                    successMessage: 'Character duplicated successfully',
                    successDescription:
                        'A new DRAFT character was created from this archived version and is ready to be edited.',
                },
            })
        } catch (error) {
            showActionError('Character could not be duplicated', error)
        } finally {
            setDuplicating(false)
            setShowDuplicateConfirmation(false)
        }
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
                open={showAlert}
                eyebrow="Alert"
                title={alertTitle}
                message={alertMessage}
                confirmLabel="Close"
                onConfirm={() => {
                    setShowAlert(false)
                    if (detailError) {
                        clearErrors()
                        navigate('/characters')
                    }
                }}
                onCancel={() => {
                    setShowAlert(false)
                    if (detailError) {
                        clearErrors()
                        navigate('/characters')
                    }
                }}
                showCancel={false}
                confirmVariant="default"
            />

            <ConfirmationModal
                open={showDuplicateConfirmation}
                eyebrow="Create Copy"
                title="Duplicate Character"
                message="You are about to create a new Character from this archived version"
                confirmLabel={duplicating ? 'Duplicating...' : 'Confirm'}
                cancelLabel="Cancel"
                onConfirm={handleDuplicateCharacter}
                onCancel={() => setShowDuplicateConfirmation(false)}
                confirmDisabled={duplicating}
            />

            <SuccessModal
                open={showSuccess}
                message={successMessage}
                description={successDescription}
                onClose={handleCloseSuccessModal}
            />

            {selectedCharacter && (
                <div className="p-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Link to="/characters">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Characters
                            </Button>
                        </Link>
                    </div>

                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl">{selectedCharacter.name}</h1>

                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className={getCharacterStatusClass(selectedCharacter.status)}
                                >
                                    {getCharacterStatusLabel(selectedCharacter.status)}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {selectedCharacter.status !== 'ARCHIVED' && (
                                <Link to={`/characters/${selectedCharacter.id}/edit`}>
                                    <Button className="flex items-center gap-2" type="button">
                                        <Pencil className="h-4 w-4" />
                                        Edit Character
                                    </Button>
                                </Link>
                            )}

                            {selectedCharacter.status === 'DRAFT' && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleActivateCharacter}
                                    disabled={activating}
                                >
                                    {activating ? 'Activating...' : 'Activate Character'}
                                </Button>
                            )}

                            {selectedCharacter.status === 'ACTIVE' && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleArchiveCharacter}
                                    disabled={archiving}
                                >
                                    {archiving ? 'Archiving...' : 'Archive Character'}
                                </Button>
                            )}

                            {selectedCharacter.status === 'ARCHIVED' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleReactivateCharacter}
                                    disabled={reactivating}
                                >
                                    {reactivating ? 'Reactivating...' : 'Reactivate Character'}
                                </Button>
                            )}

                            {selectedCharacter.status === 'ARCHIVED' && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => setShowDuplicateConfirmation(true)}
                                >
                                    Duplicate Character
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Identity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-zinc-700">{selectedCharacter.identity}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedCharacter.categories.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCharacter.categories.map((category) => (
                                            <Badge key={category} variant="secondary">
                                                {category}
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
                                <CardTitle>Inspirations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedCharacter.inspirations.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCharacter.inspirations.map((item, index) => (
                                            <Badge key={`${item}-${index}`} variant="secondary">
                                                {item}
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
                                <p className="leading-relaxed text-zinc-700">{selectedCharacter.notes ?? '—'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Image Reference</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-zinc-700">{selectedCharacter.image ?? '—'}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </>
    )
}
