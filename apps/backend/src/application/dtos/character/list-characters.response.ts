import { CharacterDTO } from './character.dto'

//DTO para los query params
export interface ListCharactersQuery {
    page?: number
    limit?: number
}

//DTO para la respuesta de listar personajes
export interface ListCharactersResponse {
    characters: CharacterDTO[]
    page: number
    limit: number
    total: number
}

