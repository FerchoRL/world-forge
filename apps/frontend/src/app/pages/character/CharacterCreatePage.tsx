import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { CharacterForm } from '@/features/character/components/CharacterForm'

import { Button } from '@/components/ui/button'

export function CharacterCreatePage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link to="/characters">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Characters
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="mb-2 text-3xl">Create Character</h1>
        <p className="text-zinc-600">Define a new character and its conceptual core</p>
      </div>

      <CharacterForm mode="create" />
    </div>
  )
}