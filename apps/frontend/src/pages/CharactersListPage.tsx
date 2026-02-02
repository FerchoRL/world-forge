import { Plus, Eye, Pencil, Search } from 'lucide-react'
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

// Mock data (UI only)
const characters = [
  { id: '1', name: 'Elena Voss', status: 'Active', type: 'Protagonist', universe: 'Shattered Realm', updatedAt: '2026-01-28' },
  { id: '2', name: 'Marcus Kane', status: 'Archived', type: 'Antagonist', universe: 'Shattered Realm', updatedAt: '2026-01-27' },
  { id: '3', name: 'Aria Zhang', status: 'Draft', type: 'Supporting', universe: 'Neo Tokyo', updatedAt: '2026-01-25' },
  { id: '4', name: 'Dr. Silas Vorn', status: 'Active', type: 'Antagonist', universe: 'Quantum Wars', updatedAt: '2026-01-24' },
]

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Draft: 'bg-yellow-100 text-yellow-800',
  Archived: 'bg-zinc-100 text-zinc-600',
}

export function CharactersListPage() {
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

      {/* Filters */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input placeholder="Search characters..." className="pl-10" />
          </div>

          <select className="px-4 py-2 border border-zinc-300 rounded-md bg-white text-sm">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>

          <select className="px-4 py-2 border border-zinc-300 rounded-md bg-white text-sm">
            <option>All Types</option>
            <option>Protagonist</option>
            <option>Antagonist</option>
            <option>Supporting</option>
            <option>Neutral</option>
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
              <TableHead>Type</TableHead>
              <TableHead>Universe</TableHead>
              <TableHead>Last Updated</TableHead>
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
                  {character.type}
                </TableCell>
                <TableCell className="text-zinc-600">
                  {character.universe}
                </TableCell>
                <TableCell className="text-zinc-600">
                  {character.updatedAt}
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
