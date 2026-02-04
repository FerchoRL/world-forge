import { Plus, Eye, Pencil, Search } from 'lucide-react'
import { useEffect } from 'react'

import { useCharacterStore } from '@/features/character/store/characterStore'
import type { CharacterListItem } from '@/features/character/types'

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
  // 🔵 Zustand state
  const characters = useCharacterStore((s) => s.characters)
  const loading = useCharacterStore((s) => s.charactersLoading)
  const error = useCharacterStore((s) => s.charactersError)
  const fetchCharacters = useCharacterStore((s) => s.fetchCharacters)

  // 🔵 Load data once
  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  if (loading) {
    return <div className="p-8">Loading characters…</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Characters</h1>
          <p className="text-zinc-600">
            Manage character profiles and attributes
          </p>
        </div>

        {/* TODO: Create new character */}
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Character
        </Button>
      </div>

      {/* Filters (UI only for now) */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input placeholder="Search characters..." className="pl-10" />
          </div>

          <select className="px-4 py-2 border border-zinc-300 rounded-md bg-white text-sm">
            <option>All Statuses</option>
            <option>ACTIVE</option>
            <option>DRAFT</option>
            <option>ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="w-55">Identity</TableHead>
              <TableHead className="w-55">Inspirations</TableHead>
              <TableHead className="w-60">Notes</TableHead>
              <TableHead className="text-right w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {characters.map((character: CharacterListItem) => (
              <TableRow key={character.id}>
                <TableCell>{character.name}</TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getCharacterStatusClass(character.status)}
                  >
                    {character.status}
                  </Badge>
                </TableCell>

                {/* Categories */}
                <TableCell>
                  <div
                    className="block max-w-55 overflow-hidden whitespace-nowrap text-ellipsis"
                    title={character.categories.join(', ')}
                  >
                    {character.categories.join(', ')}
                  </div>
                </TableCell>

                {/* Identity */}
                <TableCell>
                  <div
                    className="block max-w-55 overflow-hidden whitespace-nowrap text-ellipsis"
                    title={character.identity}
                  >
                    {character.identity}
                  </div>
                </TableCell>

                {/* Inspirations */}
                <TableCell>
                  <div
                    className="block max-w-55 overflow-hidden whitespace-nowrap text-ellipsis"
                    title={character.inspirations.join(', ')}
                  >
                    {character.inspirations.join(', ')}
                  </div>
                </TableCell>

                {/* Notes */}
                <TableCell>
                  <div
                    className="block max-w-60 overflow-hidden whitespace-nowrap text-ellipsis text-zinc-500 italic"
                    title={character.notes ?? ''}
                  >
                    {character.notes ?? '—'}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
