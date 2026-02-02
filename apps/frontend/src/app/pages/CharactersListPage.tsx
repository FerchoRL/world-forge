import { Plus, Eye, Pencil, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

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

import { characterService, type CharacterListItem } from '@/app/services/characterService'

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  ARCHIVED: 'bg-zinc-100 text-zinc-600',
}

export function CharactersListPage() {
  const [characters, setCharacters] = useState<CharacterListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    characterService
      .getAll()
      .then(setCharacters)
      .catch((err) => {
        console.error(err)
        setError('Failed to load characters')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

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

        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Character
        </Button>
      </div>

      {/* Filters (solo UI por ahora) */}
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
      <div className="bg-white border border-zinc-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {characters.map((character) => (
              <TableRow key={character.id}>
                <TableCell>{character.name}</TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[character.status]}
                  >
                    {character.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-zinc-600">
                  {character.categories.join(', ')}
                </TableCell>

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
