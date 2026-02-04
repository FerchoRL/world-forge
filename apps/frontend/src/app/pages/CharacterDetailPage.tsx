import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCharacterStatusClass } from '@/features/character/ui/statusBadge'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

import { useCharacterStore } from "@/features/character/store/characterStore"

export function CharacterDetailPage() {
    const { id } = useParams<{ id: string }>()

    const {
        selectedCharacter,
        detailLoading,
        detailError,
        fetchCharacterById,
        clearErrors,
    } = useCharacterStore()

    // 🔹 ESTE ERA EL BLOQUE QUE FALTABA
    useEffect(() => {
        if (!id) return

        fetchCharacterById(id)

        return () => {
            clearErrors()
        }
    }, [id, fetchCharacterById, clearErrors])

    // 🔹 Estados de render (MUY importante el orden)
    if (detailLoading) {
        return <div className="p-8">Loading character…</div>
    }

    if (detailError) {
        return (
            <div className="p-8 text-red-600">
                {detailError}
            </div>
        )
    }

    if (!selectedCharacter) {
        return <div className="p-8">Character not found</div>
    }

    // 🔹 A partir de aquí, YA sabemos que hay character
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
                    <h1 className="text-3xl mb-2">
                        {selectedCharacter.name}
                    </h1>

                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className={getCharacterStatusClass(selectedCharacter.status)}
                        >
                            {selectedCharacter.status}
                        </Badge>
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
                        <p className="text-zinc-700 leading-relaxed">
                            {selectedCharacter.identity}
                        </p>
                    </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {selectedCharacter.categories.map((category) => (
                                <Badge key={category} variant="secondary">
                                    {category}
                                </Badge>
                            ))}
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
                            {selectedCharacter.inspirations.map((item, index) => (
                                <Badge key={index} variant="secondary">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-700 leading-relaxed">
                            {selectedCharacter.notes ?? "—"}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
