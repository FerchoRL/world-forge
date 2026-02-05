import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Pencil, Search } from 'lucide-react'
import { useEffect } from 'react'

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
import { getCharacterStatusClass } from '@/features/character/ui/statusBadge'

export function CharactersListPage() {
  const navigate = useNavigate()

  // Store state
  const filteredCharacters = useCharacterStore((s) => s.filteredCharacters)
  const loading = useCharacterStore((s) => s.charactersLoading)
  const error = useCharacterStore((s) => s.charactersError)

  const fetchCharacters = useCharacterStore((s) => s.fetchCharacters)

  const searchTerm = useCharacterStore((s) => s.searchTerm)
  const statusFilter = useCharacterStore((s) => s.statusFilter)

  const setSearchTerm = useCharacterStore((s) => s.setSearchTerm)
  const setStatusFilter = useCharacterStore((s) => s.setStatusFilter)

  // Ejecutamos el selector DERIVADO fuera del hook
  const characters = filteredCharacters()

  // ======================
  // Effects
  // ======================
  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  // ======================
  // States
  // ======================
  if (loading) {
    return <div className="p-8">Loading characters…</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="p-8 space-y-6">
      {/* ======================
          Header
         ====================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Characters</h1>
          <p className="text-zinc-600">
            Manage character profiles and attributes
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Character
        </Button>
      </div>

      {/* ======================
          Filters
         ====================== */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search characters..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
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

      {/* ======================
          Table
         ====================== */}
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
            {characters.map((character: CharacterListItem) => (
              <TableRow key={character.id}>
                {/* Name */}
                <TableCell className="w-40 truncate">
                  {character.name}
                </TableCell>

                {/* Status */}
                <TableCell className="w-30">
                  <Badge
                    variant="secondary"
                    className={getCharacterStatusClass(character.status)}
                  >
                    {character.status}
                  </Badge>
                </TableCell>

                {/* Categories */}
                <TableCell className="w-50">
                  <div
                    className="truncate"
                    title={character.categories.join(', ')}
                  >
                    {character.categories.join(', ')}
                  </div>
                </TableCell>

                {/* Identity */}
                <TableCell className="w-65">
                  <div className="truncate" title={character.identity}>
                    {character.identity}
                  </div>
                </TableCell>

                {/* Inspirations */}
                <TableCell className="w-65">
                  <div
                    className="truncate"
                    title={character.inspirations.join(', ')}
                  >
                    {character.inspirations.join(', ')}
                  </div>
                </TableCell>

                {/* Actions */}
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
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Empty state */}
            {characters.length === 0 && (
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
    </div>
  )
}
