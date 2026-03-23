import { httpClient } from '@/app/api/httpClient'

import type {
    CharacterApiDTO,
    CreateCharacterApiResponse,
    CreateCharacterRequest,
    ListCharactersApiResponse,
    ListCharactersQuery,
    CharacterListItem,
    GetCharacterByIdApiResponse,
    PaginatedCharactersResponse,
    UpdateCharacterApiResponse,
    UpdateCharacterRequest,
} from '@/features/character/types'

/**
 * ===== Service =====
 * Traduce backend → frontend
 * NO conoce UI
 * NO conoce estado
 */
export const characterService = {

    // Obtener todos los personajes
    // options.signal permite abortar búsquedas anteriores desde el store.
    async getAll(
        params: ListCharactersQuery,
        options?: { signal?: AbortSignal }
    ): Promise<PaginatedCharactersResponse> {
        const query = new URLSearchParams()

        if (params.page !== undefined) {
            query.set('page', String(params.page))
        }

        if (params.limit !== undefined) {
            query.set('limit', String(params.limit))
        }

        if (params.search && params.search.trim().length > 0) {
            query.set('search', params.search.trim())
        }

        if (params.status) {
            query.set('status', params.status)
        }

        const response =
            await httpClient.get<ListCharactersApiResponse>(
                `/characters?${query.toString()}`,
                { signal: options?.signal }
            )

        return {
            characters: response.characters.map((character: CharacterApiDTO) => ({
                id: character.id,
                name: character.name,
                status: character.status,
                categories: character.categories,
                identity: character.identity,
                inspirations: character.inspirations,
                notes: character.notes,
                image: character.image,
            })),
            page: response.page,
            limit: response.limit,
            total: response.total,
        }
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
            image: response.character.image,
        }
    },

    async createCharacter(
        payload: CreateCharacterRequest
    ): Promise<CharacterListItem> {
        const response = await httpClient.post<CreateCharacterApiResponse>(
            '/characters',
            payload
        )

        return {
            id: response.character.id,
            name: response.character.name,
            status: response.character.status,
            categories: response.character.categories,
            identity: response.character.identity,
            inspirations: response.character.inspirations,
            notes: response.character.notes,
            image: response.character.image,
        }
    },

    async updateCharacter(
        id: string,
        payload: UpdateCharacterRequest
    ): Promise<CharacterListItem> {
        const response = await httpClient.patch<UpdateCharacterApiResponse>(
            `/characters/${id}`,
            payload
        )

        return {
            id: response.character.id,
            name: response.character.name,
            status: response.character.status,
            categories: response.character.categories,
            identity: response.character.identity,
            inspirations: response.character.inspirations,
            notes: response.character.notes,
            image: response.character.image,
        }
    },

    async changeStatus(id: string, status: 'ACTIVE' | 'ARCHIVED'): Promise<CharacterListItem> {
        const response = await httpClient.patch<UpdateCharacterApiResponse>(
            `/characters/${id}/status`,
            { status }
        )

        return {
            id: response.character.id,
            name: response.character.name,
            status: response.character.status,
            categories: response.character.categories,
            identity: response.character.identity,
            inspirations: response.character.inspirations,
            notes: response.character.notes,
            image: response.character.image,
        }
    },

    async createFromArchived(
        id: string
    ): Promise<CharacterListItem> {
        const response = await httpClient.post<CreateCharacterApiResponse>(
            `/characters/${id}/create-from-archived`,
            {}
        )

        return {
            id: response.character.id,
            name: response.character.name,
            status: response.character.status,
            categories: response.character.categories,
            identity: response.character.identity,
            inspirations: response.character.inspirations,
            notes: response.character.notes,
            image: response.character.image,
        }
    },
}
