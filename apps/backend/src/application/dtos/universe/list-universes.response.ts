import { UniverseDTO } from './universe.dto'
import { Status } from '@world-forge/domain'

//DTO para los query params
export interface ListUniversesQuery {
    page?: number
    limit?: number
    search?: string
    status?: Status
}

//DTO para la respuesta de listar universes
export interface ListUniversesResponse {
    universes: UniverseDTO[]
    page: number
    limit: number
    total: number
}
