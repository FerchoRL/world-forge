import { useEffect, useState } from 'react'
import { Eye, Pencil, Plus, Search } from 'lucide-react'

import { universeService } from '@/app/services/universeService'

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

import type {
  UniverseListItem,
  UniverseStatusFilter,
} from '@/features/universe/types'
import {
  getUniverseStatusClass,
  getUniverseStatusLabel,
} from '@/features/universe/ui/statusBadge'

export function UniversesListPage() {
  const [universes, setUniverses] = useState<UniverseListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<UniverseStatusFilter>('ALL')

  useEffect(() => {
    const abortController = new AbortController()

    setLoading(true)
    setError(null)

    const timeoutId = setTimeout(async () => {
      try {
        const response = await universeService.getAll(
          {
            page: 1,
            limit: 10,
            search: searchTerm,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
          },
          { signal: abortController.signal }
        )

        setUniverses(response.universes)
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return
        }

        setError('Failed to load universes')
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      abortController.abort()
      clearTimeout(timeoutId)
    }
  }, [searchTerm, statusFilter])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Universes</h1>
          <p className="text-zinc-600">Manage fictional worlds and settings</p>
        </div>

        <Button className="flex items-center gap-2" type="button">
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
            <option value="ACTIVE">Active</option>
            <option value="IN_DEVELOPMENT">In Development</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-lg overflow-x-auto">
        <Table className="table-fixed min-w-220">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Name</TableHead>
              <TableHead className="w-30">Status</TableHead>
              <TableHead className="w-30">Type</TableHead>
              <TableHead className="w-20">Stories</TableHead>
              <TableHead className="w-25">Characters</TableHead>
              <TableHead className="w-40">Last Updated</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && universes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
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

                <TableCell className="w-30">{universe.type ?? '—'}</TableCell>
                <TableCell className="w-20">{universe.stories ?? 0}</TableCell>
                <TableCell className="w-25">{universe.characters ?? 0}</TableCell>
                <TableCell className="w-40">{universe.updatedAt ?? '—'}</TableCell>

                <TableCell className="w-40">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      type="button"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!loading && universes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-zinc-500 py-8">
                  No universes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
