import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CategoryName } from '@world-forge/domain'
import { Plus, Trash2 } from 'lucide-react'

import { getApiErrorMessage } from '@/app/api/httpClient'
import { characterService } from '@/app/services/characterService'
import { CHARACTER_CATEGORY_GROUPS } from '@/features/character/categoryOptions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

import type {
  CharacterListItem,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from '@/features/character/types'

interface CharacterFormProps {
  mode: 'create' | 'edit'
  character?: CharacterListItem
  onSubmit?: (payload: UpdateCharacterRequest) => Promise<void>
  onCancel?: () => void
}

interface CharacterFormValues {
  name: string
  identity: string
  categories: CategoryName[]
  inspirations: string[]
  notes: string
  image: string
  status: 'DRAFT' | 'ACTIVE'
}

function getInitialValues(
  mode: CharacterFormProps['mode'],
  character?: CharacterListItem
): CharacterFormValues {
  if (mode === 'edit' && character) {
    return {
      name: character.name,
      identity: character.identity,
      categories: character.categories,
      inspirations: character.inspirations,
      notes: character.notes ?? '',
      image: character.image ?? '',
      status: character.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
    }
  }

  return {
    name: '',
    identity: '',
    categories: [],
    inspirations: [],
    notes: '',
    image: '',
    status: 'DRAFT',
  }
}

export function CharacterForm({ mode, character, onSubmit, onCancel }: CharacterFormProps) {
  const navigate = useNavigate()

  const initialValues = useMemo(
    () => getInitialValues(mode, character),
    [mode, character]
  )

  const [values, setValues] = useState<CharacterFormValues>(initialValues)
  const [newInspiration, setNewInspiration] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  function setField<K extends keyof CharacterFormValues>(
    field: K,
    value: CharacterFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function toggleCategory(category: CategoryName) {
    setValues((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }))
  }

  function addInspiration() {
    const trimmed = newInspiration.trim()
    if (!trimmed) return

    setValues((current) => ({
      ...current,
      inspirations: [...current.inspirations, trimmed],
    }))
    setNewInspiration('')
  }

  function removeInspiration(indexToRemove: number) {
    setValues((current) => ({
      ...current,
      inspirations: current.inspirations.filter((_, index) => index !== indexToRemove),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)
    setApiError(null)

    const name = values.name.trim()
    const identity = values.identity.trim()
    const inspirations = values.inspirations
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    if (!name) {
      setValidationError('Character name is required')
      return
    }

    if (!identity) {
      setValidationError('Character identity is required')
      return
    }

    if (values.categories.length === 0) {
      setValidationError('At least one category is required')
      return
    }

    if (inspirations.length === 0) {
      setValidationError('At least one inspiration is required')
      return
    }

    setSubmitting(true)

    try {
      if (mode === 'create') {
        const payload: CreateCharacterRequest = {
          name,
          identity,
          categories: values.categories,
          inspirations,
          notes: values.notes.trim() ? values.notes.trim() : undefined,
          image: values.image.trim() ? values.image.trim() : undefined,
          status: values.status,
        }

        const created = await characterService.createCharacter(payload)
        navigate(`/characters/${created.id}`)
        return
      }

      if (!character?.id) {
        setValidationError('Character id is required for edit mode')
        return
      }

      const payload: UpdateCharacterRequest = {
        name,
        identity,
        categories: values.categories,
        inspirations,
        notes: values.notes.trim() ? values.notes.trim() : undefined,
        image: values.image.trim() ? values.image.trim() : undefined,
      }

      if (onSubmit) {
        await onSubmit(payload)
        return
      }

      const updated = await characterService.updateCharacter(character.id, payload)
      navigate(`/characters/${updated.id}`)
    } catch (submitError) {
      console.error(submitError)
      setApiError(
        getApiErrorMessage(
          submitError,
          mode === 'create'
            ? 'Failed to create character'
            : 'Failed to update character'
        )
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <ConfirmationModal
        open={Boolean(apiError)}
        eyebrow="API Error"
        title={mode === 'create' ? 'Character could not be created' : 'Character could not be updated'}
        message={apiError ?? ''}
        confirmLabel="Close"
        onConfirm={() => setApiError(null)}
        onCancel={() => setApiError(null)}
        showCancel={false}
        confirmVariant="default"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {validationError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {validationError}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Core</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                Name *
              </label>
              <Input
                id="name"
                value={values.name}
                onChange={(event) => setField('name', event.target.value)}
                placeholder="Enter character name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="identity" className="text-sm font-medium text-zinc-700">
                Identity *
              </label>
              <textarea
                id="identity"
                value={values.identity}
                onChange={(event) => setField('identity', event.target.value)}
                placeholder="Describe the character identity"
                className="min-h-28 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-offset-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                required
              />
            </div>

            {mode === 'create' && (
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-zinc-700">
                  Status
                </label>
                <select
                  id="status"
                  value={values.status}
                  onChange={(event) => setField('status', event.target.value as 'DRAFT' | 'ACTIVE')}
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CHARACTER_CATEGORY_GROUPS.map(({ group, items }) => (
              <div key={group} className="space-y-2">
                <p className="text-sm font-medium text-zinc-700">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((category) => {
                    const isSelected = values.categories.includes(category)

                    return (
                      <Button
                        key={category}
                        type="button"
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspirations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newInspiration}
                onChange={(event) => setNewInspiration(event.target.value)}
                placeholder="Add an inspiration"
              />
              <Button type="button" variant="outline" onClick={addInspiration}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>

            {values.inspirations.length === 0 && (
              <p className="text-sm text-zinc-500">No inspirations added yet</p>
            )}

            {values.inspirations.length > 0 && (
              <div className="space-y-2">
                {values.inspirations.map((inspiration, index) => (
                  <div
                    key={`${inspiration}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2"
                  >
                    <span className="text-sm text-zinc-700">{inspiration}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInspiration(index)}
                      className="text-zinc-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-zinc-700">
                Image reference
              </label>
              <Input
                id="image"
                value={values.image}
                onChange={(event) => setField('image', event.target.value)}
                placeholder="Optional image reference"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-zinc-700">
                Notes
              </label>
              <textarea
                id="notes"
                value={values.notes}
                onChange={(event) => setField('notes', event.target.value)}
                placeholder="Additional notes"
                className="min-h-28 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-offset-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'create' ? 'Create Character' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </>
  )
}