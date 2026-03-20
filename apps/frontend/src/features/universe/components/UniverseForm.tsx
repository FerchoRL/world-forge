import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'

import { getApiErrorMessage } from '@/app/api/httpClient'
import { universeService } from '@/app/services/universeService'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

import type {
  CreateUniverseRequest,
  UniverseListItem,
  UniverseStatus,
  UpdateUniverseRequest,
} from '@/features/universe/types'

interface UniverseFormProps {
  mode: 'create' | 'edit'
  universe?: UniverseListItem
  onSubmit?: (payload: UpdateUniverseRequest) => Promise<void>
}

interface UniverseFormValues {
  name: string
  premise: string
  rules: string[]
  notes: string
  status: UniverseStatus
}

function getInitialValues(
  mode: UniverseFormProps['mode'],
  universe?: UniverseListItem
): UniverseFormValues {
  if (mode === 'edit' && universe) {
    return {
      name: universe.name,
      premise: universe.premise ?? '',
      rules: universe.rules ?? [],
      notes: universe.notes ?? '',
      status: universe.status,
    }
  }

  return {
    name: '',
    premise: '',
    rules: [],
    notes: '',
    status: 'DRAFT',
  }
}

function getAllowedStatuses(
  mode: UniverseFormProps['mode'],
  initialStatus?: UniverseStatus
): UniverseStatus[] {
  if (mode === 'create') {
    return ['DRAFT', 'ACTIVE']
  }

  if (initialStatus === 'DRAFT') {
    return ['DRAFT', 'ACTIVE']
  }

  if (initialStatus === 'ACTIVE') {
    return ['ACTIVE', 'ARCHIVED']
  }

  if (initialStatus === 'ARCHIVED') {
    return ['ARCHIVED', 'ACTIVE']
  }

  return ['ACTIVE']
}

function isValidStatusTransition(
  from: UniverseStatus,
  to: UniverseStatus
): boolean {
  if (from === to) return true

  if (from === 'DRAFT' && to === 'ACTIVE') return true
  if (from === 'ACTIVE' && to === 'ARCHIVED') return true
  if (from === 'ARCHIVED' && to === 'ACTIVE') return true

  return false
}

export function UniverseForm({ mode, universe, onSubmit }: UniverseFormProps) {
  const navigate = useNavigate()

  const initialValues = useMemo(
    () => getInitialValues(mode, universe),
    [mode, universe]
  )

  const [values, setValues] = useState<UniverseFormValues>(initialValues)
  const [newRule, setNewRule] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const initialStatus = mode === 'edit' ? universe?.status : 'DRAFT'
  const allowedStatuses = useMemo(
    () => getAllowedStatuses(mode, initialStatus),
    [mode, initialStatus]
  )

  const submitLabel = mode === 'create' ? 'Create Universe' : 'Save Changes'

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  function setField<K extends keyof UniverseFormValues>(
    field: K,
    value: UniverseFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function addRule() {
    const trimmed = newRule.trim()
    if (!trimmed) return

    setValues((current) => ({
      ...current,
      rules: [...current.rules, trimmed],
    }))
    setNewRule('')
  }

  function removeRule(indexToRemove: number) {
    setValues((current) => ({
      ...current,
      rules: current.rules.filter((_, index) => index !== indexToRemove),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)
    setApiError(null)

    const name = values.name.trim()
    const premise = values.premise.trim()

    if (!name || !premise) {
      setValidationError('Name and premise are required')
      return
    }

    const payload: CreateUniverseRequest = {
      name,
      premise,
      rules: values.rules.length > 0 ? values.rules : undefined,
      notes: values.notes.trim() ? values.notes.trim() : undefined,
      status: values.status,
    }

    if (!allowedStatuses.includes(payload.status)) {
      setValidationError('Selected status is not allowed in this form mode')
      return
    }

    setSubmitting(true)

    try {
      if (mode === 'create') {
        const created = await universeService.createUniverse(payload)
        navigate(`/universes/${created.id}`)
        return
      }

      if (!universe?.id) {
        setValidationError('Universe id is required for edit mode')
        return
      }

      if (!isValidStatusTransition(universe.status, payload.status)) {
        setValidationError('Invalid status transition for this universe')
        return
      }

      if (onSubmit) {
        await onSubmit(payload)
        return
      }

      const updated = await universeService.updateUniverse(universe.id, payload)
      navigate(`/universes/${updated.id}`)
    } catch (submitError) {
      console.error(submitError)
      setApiError(
        getApiErrorMessage(
          submitError,
          mode === 'create'
            ? 'Failed to create universe'
            : 'Failed to update universe'
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
        title={mode === 'create' ? 'Universe could not be created' : 'Universe could not be updated'}
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
              placeholder="Enter universe name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="premise" className="text-sm font-medium text-zinc-700">
              Premise *
            </label>
            <textarea
              id="premise"
              value={values.premise}
              onChange={(event) => setField('premise', event.target.value)}
              placeholder="Describe the universe premise"
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
                onChange={(event) =>
                  setField('status', event.target.value as UniverseStatus)
                }
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
              >
                {allowedStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newRule}
              onChange={(event) => setNewRule(event.target.value)}
              placeholder="Add a world rule"
            />
            <Button type="button" variant="outline" onClick={addRule}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {values.rules.length === 0 && (
            <p className="text-sm text-zinc-500">No rules added yet</p>
          )}

          {values.rules.length > 0 && (
            <div className="space-y-2">
              {values.rules.map((rule, index) => (
                <div
                  key={`${rule}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2"
                >
                  <span className="text-sm text-zinc-700">{rule}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(index)}
                    className="text-zinc-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={values.notes}
            onChange={(event) => setField('notes', event.target.value)}
            placeholder="Additional notes"
            className="min-h-28 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-offset-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
      </form>
    </>
  )
}
