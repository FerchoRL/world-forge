import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'

import { useUniverseStore } from '@/features/universe/store/universeStore'
import {
  getUniverseStatusClass,
  getUniverseStatusLabel,
} from '@/features/universe/ui/statusBadge'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UniverseDetailPage() {
  const { id } = useParams<{ id: string }>()

  const {
    selectedUniverse,
    detailLoading,
    detailError,
    fetchUniverseById,
    clearErrors,
  } = useUniverseStore()

  useEffect(() => {
    if (!id) return

    fetchUniverseById(id)

    return () => {
      clearErrors()
    }
  }, [id, fetchUniverseById, clearErrors])

  if (detailLoading) {
    return <div className="p-8">Loading universe...</div>
  }

  if (detailError) {
    return <div className="p-8 text-red-600">{detailError}</div>
  }

  if (!selectedUniverse) {
    return <div className="p-8">Universe not found</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/universes">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Universes
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">{selectedUniverse.name}</h1>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={getUniverseStatusClass(selectedUniverse.status)}
            >
              {getUniverseStatusLabel(selectedUniverse.status)}
            </Badge>
          </div>
        </div>

        <Button disabled className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Universe
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Premise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 leading-relaxed">
              {selectedUniverse.premise ?? '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUniverse.rules && selectedUniverse.rules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedUniverse.rules.map((rule, index) => (
                  <Badge key={`${rule}-${index}`} variant="secondary">
                    {rule}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-zinc-700 leading-relaxed">—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 leading-relaxed">
              {selectedUniverse.notes ?? '—'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
