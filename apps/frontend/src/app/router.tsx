import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RootLayout } from './layout/RootLayout'

import { DashboardPage } from './pages/DashboardPage'
import { CharactersListPage } from './pages/CharactersListPage'
import { CharacterDetailPage } from './pages/CharacterDetailPage'
import { UniversesListPage } from './pages/UniversesListPage'
import { UniverseCreatePage } from './pages/UniverseCreatePage'
import { UniverseDetailPage } from './pages/UniverseDetailPage'
import { UniverseEditPage } from './pages/UniverseEditPage'
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
            { path: 'characters/:id', element: <CharacterDetailPage /> },
            { path: 'universes', element: <UniversesListPage /> },
            { path: 'universes/new', element: <UniverseCreatePage /> },
            { path: 'universes/:id', element: <UniverseDetailPage /> },
            { path: 'universes/:id/edit', element: <UniverseEditPage /> },
            { path: 'health', element: <HealthPage /> }
        ]
    }
])