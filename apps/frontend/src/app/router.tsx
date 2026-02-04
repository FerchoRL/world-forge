import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RootLayout } from './layout/RootLayout'

import { CharactersListPage } from './pages/CharactersListPage'
import { CharacterDetailPage } from './pages/CharacterDetailPage'
import { HealthPage } from './pages/HealthPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <Navigate to ="/" replace /> },
            { path: 'characters', element: <CharactersListPage /> },
            { path: 'characters/:id', element: <CharacterDetailPage /> },
            { path: 'health', element: <HealthPage /> }
        ]
    }
])