import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { UniverseForm } from '@/features/universe/components/UniverseForm'

import { Button } from '@/components/ui/button'

export function UniverseCreatePage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/universes">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Universes
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl mb-2">Create Universe</h1>
        <p className="text-zinc-600">Define a new fictional world and its core rules</p>
      </div>

      <UniverseForm mode="create" />
    </div>
  )
}
