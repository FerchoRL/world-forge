import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Plus, Search } from 'lucide-react'

import { useUniverseStore } from '@/features/universe/store/universeStore'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { UniverseStatusFilter } from '@/features/universe/types'
import {
  getUniverseStatusClass,
  getUniverseStatusLabel,
} from '@/features/universe/ui/statusBadge'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function UniversesListPage() {
  const navigate = useNavigate()

  const universes = useUniverseStore((s) => s.universes)
  const universesLoading = useUniverseStore((s) => s.universesLoading)
  const error = useUniverseStore((s) => s.universesError)

  const { hasMore, fetchInitialUniverses, loadMoreUniverses } =
    useUniverseStore()
  const clearErrors = useUniverseStore((s) => s.clearErrors)

  const searchTerm = useUniverseStore((s) => s.searchTerm)
  const statusFilter = useUniverseStore((s) => s.statusFilter)

  const setSearchTerm = useUniverseStore((s) => s.setSearchTerm)
  const setStatusFilter = useUniverseStore((s) => s.setStatusFilter)
  const [showApiError, setShowApiError] = useState(false)
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInitialUniverses()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [fetchInitialUniverses, searchTerm, statusFilter])

  useEffect(() => {
    if (error) {
      setShowApiError(true)
    }
  }, [error])

  function handleCloseApiError() {
    setShowApiError(false)
    clearErrors()
  }

  function handleEditUniverse(universeId: string, status: string) {
    if (status === 'ARCHIVED') {
      setActionErrorMessage('Archived universes cannot be edited. Reactivate it first or duplicate it to continue working.')
      return
    }

    navigate(`/universes/${universeId}/edit`)
  }

  return (
    <>
      <ConfirmationModal
        open={showApiError}
        eyebrow="API Error"
        title="Universes could not be loaded"
        message={error ?? ''}
        confirmLabel="Close"
        onConfirm={handleCloseApiError}
        onCancel={handleCloseApiError}
        showCancel={false}
        confirmVariant="default"
      />

      <ConfirmationModal
        open={Boolean(actionErrorMessage)}
        eyebrow="Action Not Available"
        title="Universe cannot be edited"
        message={actionErrorMessage ?? ''}
        confirmLabel="Close"
        onConfirm={() => setActionErrorMessage(null)}
        onCancel={() => setActionErrorMessage(null)}
        showCancel={false}
        confirmVariant="default"
      />

      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Universes</h1>
          <p className="text-zinc-600">Manage fictional worlds and settings</p>
        </div>

        <Button
          className="flex items-center gap-2"
          type="button"
          onClick={() => navigate('/universes/new')}
        >
          <Plus className="w-4 h-4" />
          New Universe
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search universes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-zinc-300 rounded-md bg-white text-sm"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as UniverseStatusFilter)
            }
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-x-auto">
        <Table className="table-fixed min-w-290">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Name</TableHead>
              <TableHead className="w-30">Status</TableHead>
              <TableHead className="w-65">Premise</TableHead>
              <TableHead className="w-65">Rules</TableHead>
              <TableHead className="w-65">Notes</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {universesLoading && universes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  Loading universes…
                </TableCell>
              </TableRow>
            )}

            {universes.map((universe) => (
              <TableRow key={universe.id}>
                <TableCell className="w-40 truncate">{universe.name}</TableCell>
                <TableCell className="w-30">
                  <Badge
                    variant="secondary"
                    className={getUniverseStatusClass(universe.status)}
                  >
                    {getUniverseStatusLabel(universe.status)}
                  </Badge>
                </TableCell>
                <TableCell className="w-65 truncate">{universe.premise ?? '—'}</TableCell>
                <TableCell className="w-65 truncate">{Array.isArray(universe.rules) ? universe.rules.join(', ') : universe.rules ?? '—'}</TableCell>
                <TableCell className="w-65 truncate">{universe.notes ?? '—'}</TableCell>
                <TableCell className="w-40">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      type="button"
                      onClick={() => navigate(`/universes/${universe.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      type="button"
                      onClick={() => handleEditUniverse(universe.id, universe.status)}
                      disabled={universe.status === 'ARCHIVED'}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!universesLoading && universes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                  No universes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMoreUniverses} disabled={universesLoading}>
            {universesLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
      </div>
    </>
  )
}
