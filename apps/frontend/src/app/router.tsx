import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RootLayout } from './layout/RootLayout'

import { DashboardPage } from './pages/DashboardPage'
import { CharacterCreatePage } from './pages/character/CharacterCreatePage'
import { CharactersListPage } from './pages/character/CharactersListPage'
import { CharacterDetailPage } from './pages/character/CharacterDetailPage'
import { CharacterEditPage } from './pages/character/CharacterEditPage'
import { UniversesListPage } from './pages/universe/UniversesListPage'
import { UniverseCreatePage } from './pages/universe/UniverseCreatePage'
import { UniverseDetailPage } from './pages/universe/UniverseDetailPage'
import { UniverseEditPage } from './pages/universe/UniverseEditPage'
import { HealthPage } from './pages/HealthPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <Navigate to="/" replace /> },
            { path: 'characters', element: <CharactersListPage /> },
            { path: 'characters/new', element: <CharacterCreatePage /> },
            { path: 'characters/:id', element: <CharacterDetailPage /> },
            { path: 'characters/:id/edit', element: <CharacterEditPage /> },
            { path: 'universes', element: <UniversesListPage /> },
            { path: 'universes/new', element: <UniverseCreatePage /> },
            { path: 'universes/:id', element: <UniverseDetailPage /> },
            { path: 'universes/:id/edit', element: <UniverseEditPage /> },
            { path: 'health', element: <HealthPage /> }
        ]
    }
])