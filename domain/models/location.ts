import { LocationId, LocationType } from '../types'

// Representa un lugar significativo dentro de una Story

export interface Location {
    id: LocationId
    name: string
    type: LocationType
    description?: string
    notes?: string
}