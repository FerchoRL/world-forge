import { UniverseDTO } from './universe.dto'

//DTO para los query params
export interface ListUniversesQuery {
    page?: number
    limit?: number
}

//DTO para la respuesta de listar universes
export interface ListUniversesResponse {
    universes: UniverseDTO[]
    page: number
    limit: number
    total: number
}
