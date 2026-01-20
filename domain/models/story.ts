import { LocationId, Status, StoryId, UniverseId} from '../types'

// Contenedor macro: Universo + conflicto + lugares relevantes

export interface Story {
    id: StoryId
    title: string
    universeId: UniverseId
    status: Status
    summary: string
    locationIds?: LocationId[]
}