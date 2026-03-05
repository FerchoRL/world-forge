import { CharacterDTO } from './character.dto'

import { Status } from '@world-forge/domain'

//DTO para los query params
export interface ListCharactersQuery {
    page?: number
    limit?: number
    search?: string
    status?: Status
}

//DTO para la respuesta de listar personajes
export interface ListCharactersResponse {
    characters: CharacterDTO[]
    page: number
    limit: number
    total: number
}

