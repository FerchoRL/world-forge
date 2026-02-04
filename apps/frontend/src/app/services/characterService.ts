import { httpClient } from '@/app/api/httpClient'

import type {
    CharacterApiDTO,
    ListCharactersApiResponse,
    CharacterListItem,
    GetCharacterByIdApiResponse,
} from '@/features/character/types'

/**
 * ===== Service =====
 * Traduce backend → frontend
 * NO conoce UI
 * NO conoce estado
 */
export const characterService = {

    // Obtener todos los personajes
    async getAll(): Promise<CharacterListItem[]> {
        const response =
            await httpClient.get<ListCharactersApiResponse>('/characters')

        return response.characters.map((character: CharacterApiDTO) => ({
            id: character.id,
            name: character.name,
            status: character.status,
            categories: character.categories,
            identity: character.identity,
            inspirations: character.inspirations,
            notes: character.notes,
        }))
    },

    // Obtener un personaje por su ID
    async getById(id: string): Promise<CharacterListItem> {
        const response =
            await httpClient.get<GetCharacterByIdApiResponse>(`/characters/${id}`)

        return {
            id: response.character.id,
            name: response.character.name,
            status: response.character.status,
            categories: response.character.categories,
            identity: response.character.identity,
            inspirations: response.character.inspirations,
            notes: response.character.notes,
        }
    },
}
