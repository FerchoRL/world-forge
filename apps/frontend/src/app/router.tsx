import { createBrowserRouter, Navigate } from 'react-router-dom'

import { RootLayout } from './layout/RootLayout'

import { CharactersListPage } from './pages/CharactersListPage'
import { HealthPage } from './pages/HealthPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Navigate to ="/" replace /> },
            { path: 'characters', element: <CharactersListPage /> },
            { path: 'health', element: <HealthPage /> }
        ]
    }
])