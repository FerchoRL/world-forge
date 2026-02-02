import { httpClient } from '@/app/api/httpClient'

/**
 * ===== Shapes que vienen DEL BACKEND =====
 * (solo forma de datos, no lógica)
 */

interface CharacterApiDTO {
  id: string
  name: string
  status: string
  categories: string[]
  identity: string
  inspirations: string[]
  notes?: string
}

interface ListCharactersApiResponse {
  characters: CharacterApiDTO[]
}

/**
 * ===== ViewModel para la UI de LISTA =====
 * (solo lo que la pantalla necesita)
 */

export interface CharacterListItem {
  id: string
  name: string
  status: string
  categories: string[]
}

/**
 * ===== Service =====
 * Traduce backend → frontend
 * NO conoce UI
 * NO conoce fetch
 */

export const characterService = {
  async getAll(): Promise<CharacterListItem[]> {
    const response =
      await httpClient.get<ListCharactersApiResponse>('/characters')

    return response.characters.map((character) => ({
      id: character.id,
      name: character.name,
      status: character.status,
      categories: character.categories,
    }))
  },
}
