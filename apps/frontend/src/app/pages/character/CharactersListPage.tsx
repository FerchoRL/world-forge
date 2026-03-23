import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Pencil, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useCharacterStore } from '@/features/character/store/characterStore'
import type { CharacterListItem, StatusFilter } from '@/features/character/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  getCharacterStatusClass,
  getCharacterStatusLabel,
} from '@/features/character/ui/statusBadge'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

export function CharactersListPage() {
  const navigate = useNavigate()

  const characters = useCharacterStore((s) => s.characters)
  const charactersLoading = useCharacterStore((s) => s.charactersLoading)
  const error = useCharacterStore((s) => s.charactersError)

  const {
    hasMore,
    fetchInitialCharacters,
    loadMoreCharacters,
  } = useCharacterStore()
  const clearErrors = useCharacterStore((s) => s.clearErrors)

  const searchTerm = useCharacterStore((s) => s.searchTerm)
  const statusFilter = useCharacterStore((s) => s.statusFilter)

  const setSearchTerm = useCharacterStore((s) => s.setSearchTerm)
  const setStatusFilter = useCharacterStore((s) => s.setStatusFilter)
  const [showApiError, setShowApiError] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInitialCharacters()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [fetchInitialCharacters, searchTerm, statusFilter])

  useEffect(() => {
    if (error) {
      setShowApiError(true)
    }
  }, [error])

  function handleCloseApiError() {
    setShowApiError(false)
    clearErrors()
  }

  return (
    <>
      <ConfirmationModal
        open={showApiError}
        eyebrow="API Error"
        title="Characters could not be loaded"
        message={error ?? ''}
        confirmLabel="Close"
        onConfirm={handleCloseApiError}
        onCancel={handleCloseApiError}
        showCancel={false}
        confirmVariant="default"
      />

      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Characters</h1>
          <p className="text-zinc-600">
            Manage character profiles and attributes
          </p>
        </div>

        <Button className="flex items-center gap-2" onClick={() => navigate('/characters/new')}>
          <Plus className="w-4 h-4" />
          New Character
        </Button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search characters..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-zinc-300 rounded-md bg-white text-sm"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
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
              <TableHead className="w-50">Categories</TableHead>
              <TableHead className="w-65">Identity</TableHead>
              <TableHead className="w-65">Inspirations</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {charactersLoading && characters.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-zinc-500 py-8"
                >
                  Loading characters…
                </TableCell>
              </TableRow>
            )}

            {characters.map((character: CharacterListItem) => (
              <TableRow key={character.id}>
                <TableCell className="w-40 truncate">
                  {character.name}
                </TableCell>

                <TableCell className="w-30">
                  <Badge
                    variant="secondary"
                    className={getCharacterStatusClass(character.status)}
                  >
                    {getCharacterStatusLabel(character.status)}
                  </Badge>
                </TableCell>

                <TableCell className="w-50">
                  <div
                    className="truncate"
                    title={character.categories.join(', ')}
                  >
                    {character.categories.join(', ')}
                  </div>
                </TableCell>

                <TableCell className="w-65">
                  <div className="truncate" title={character.identity}>
                    {character.identity}
                  </div>
                </TableCell>

                <TableCell className="w-65">
                  <div
                    className="truncate"
                    title={character.inspirations.join(', ')}
                  >
                    {character.inspirations.join(', ')}
                  </div>
                </TableCell>

                <TableCell className="w-40">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        navigate(`/characters/${character.id}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        navigate(`/characters/${character.id}/edit`)
                      }
                      disabled={character.status === 'ARCHIVED'}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!charactersLoading && characters.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-zinc-500 py-8"
                >
                  No characters found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMoreCharacters}
            disabled={charactersLoading}
          >
            {charactersLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}

      </div>
    </>
  )
}
