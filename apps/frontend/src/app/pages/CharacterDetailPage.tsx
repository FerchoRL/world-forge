import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-8">
      {/* Back */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/characters">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Characters
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Character Name</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">STATUS</Badge>
          </div>
        </div>

        <Button disabled className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Character
        </Button>
      </div>

      <div className="space-y-6">
        {/* Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 leading-relaxed">—</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Category</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Inspirations */}
        <Card>
          <CardHeader>
            <CardTitle>Inspirations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Inspiration</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 leading-relaxed">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
