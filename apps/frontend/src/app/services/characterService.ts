import { httpClient } from '@/app/api/httpClient'

import type{
    CharacterApiDTO,
    ListCharactersApiResponse,
    CharacterListItem,
} from '@/features/character/types'

/**
 * ===== Shapes que vienen DEL BACKEND =====
 * (solo forma de datos, no lógica)
 */

/**
 * ===== Service =====
 * Traduce backend → frontend
 * NO conoce UI
 * NO conoce fetch
 */

export const characterService = {

    //
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
}